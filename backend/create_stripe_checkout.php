<?php
require_once __DIR__ . '/../vendor/autoload.php'; // Adjust path if needed

\Stripe\Stripe::setApiKey(getenv('STRIPE_SECRET_KEY'));

// Example: $amount = 500 (means $5.00)
$YOUR_DOMAIN = 'https://yourdomain.com'; // Change to your real domain

header('Content-Type: application/json');

try {
    $checkout_session = \Stripe\Checkout\Session::create([
        'payment_method_types' => ['card'],
        'line_items' => [[
            'price_data' => [
                'currency' => 'usd',
                'unit_amount' => 500,
                'product_data' => [
                    'name' => 'Premium Membership',
                ],
            ],
            'quantity' => 1,
        ]],
        'mode' => 'payment',
        'success_url' => $YOUR_DOMAIN . '/success.html',
        'cancel_url' => $YOUR_DOMAIN . '/cancel.html',
    ]);

    echo json_encode(['id' => $checkout_session->id]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}