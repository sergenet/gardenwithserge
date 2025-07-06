<?php
// This is a simple example using PayPal's v2 Orders API with curl
// In production, use the official PayPal SDK for PHP!

$clientId = getenv('PAYPAL_CLIENT_ID');
$secret = getenv('PAYPAL_SECRET');

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://api-m.sandbox.paypal.com/v1/oauth2/token");
curl_setopt($ch, CURLOPT_HEADER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_USERPWD, $clientId . ":" . $secret);
curl_setopt($ch, CURLOPT_POSTFIELDS, "grant_type=client_credentials");

$result = curl_exec($ch);
if (empty($result)) die("Error: No response.");
$json = json_decode($result);
curl_close($ch);

$accessToken = $json->access_token;

// Create order
$order = [
    "intent" => "CAPTURE",
    "purchase_units" => [[
        "amount" => [
            "currency_code" => "USD",
            "value" => "5.00"
        ]
    ]],
    "application_context" => [
        "return_url" => "https://yourdomain.com/success.html",
        "cancel_url" => "https://yourdomain.com/cancel.html"
    ]
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://api-m.sandbox.paypal.com/v2/checkout/orders");
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    "Authorization: Bearer $accessToken"
]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($order));

$result = curl_exec($ch);
if (empty($result)) die("Error: No response.");
echo $result;
curl_close($ch);