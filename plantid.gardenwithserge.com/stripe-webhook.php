<?php
require 'vendor/autoload.php'; // Stripe PHP SDK
require_once 'db_config.php';   // Your DB connection

\Stripe\Stripe::setApiKey(getenv('STRIPE_SECRET_KEY') ?: '');

// You should set your Stripe webhook secret here!
$endpoint_secret = 'YOUR_STRIPE_WEBHOOK_SECRET';

$payload = @file_get_contents('php://input');
$sig_header = $_SERVER['HTTP_STRIPE_SIGNATURE'] ?? '';
$event = null;

try {
    $event = \Stripe\Webhook::constructEvent(
        $payload, $sig_header, $endpoint_secret
    );
} catch(\UnexpectedValueException $e) {
    http_response_code(400); // Invalid payload
    exit();
} catch(\Stripe\Exception\SignatureVerificationException $e) {
    http_response_code(400); // Invalid signature
    exit();
}

// Handle the event
if ($event->type === 'customer.subscription.created' || $event->type === 'customer.subscription.updated') {
    $subscription = $event->data->object;
    $stripe_subscription_id = $subscription->id;
    $stripe_customer_id = $subscription->customer;
    $status = $subscription->status;
    $current_period_end = $subscription->current_period_end; // Unix timestamp

    // Retrieve the customer email from Stripe (if not in metadata)
    $customer = \Stripe\Customer::retrieve($stripe_customer_id);
    $email = $customer->email;

    // Optionally, you can use $subscription->metadata['user_id'] if you set it on subscription creation

    // Determine plan type (depends on your Stripe Price/Product setup)
    $price_id = $subscription->items->data[0]->price->id;

    // Map Stripe Price IDs to your membership_type values
    $priceIdToMembershipType = [
        'price_1RhFb3FJK8JMTXAG3GHqJkNi' => 'basic_yearly',
        'price_1RTlQ9FJK8JMTXAGkjq9J4vF' => 'basic_monthly',
        'price_1RhFWMFJK8JMTXAGqAO7HT6b' => 'green_thumb_yearly',
        'price_1RTlQ9FJK8JMTXAG7TMUpI5I' => 'green_thumb_monthly',
    ];

    // Get membership_type based on price_id (falls back to 'unknown' if not found)
    $membership_type = $priceIdToMembershipType[$price_id] ?? 'unknown';

    // Activate user in your DB
    $pdo = new PDO(DB_DSN, DB_USER, DB_PASS);
    $stmt = $pdo->prepare("UPDATE users SET is_premium=1, membership_type=?, stripe_subscription_id=?, payment_provider='stripe', premium_until=FROM_UNIXTIME(?) WHERE email=?");
    $stmt->execute([$membership_type, $stripe_subscription_id, $current_period_end, $email]);
}

http_response_code(200);
echo 'Webhook received';
?>