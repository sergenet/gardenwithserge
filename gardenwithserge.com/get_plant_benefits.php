<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
session_start();
header('Content-Type: application/json');

// Only allow Green Thumb members
if (!isset($_SESSION['membership_type']) || $_SESSION['membership_type'] !== 'green_thumb') {
    echo json_encode(['error' => 'Not authorized']);
    exit;
}

// Get plant name from JSON input
$data = json_decode(file_get_contents('php://input'), true);
$plant = trim($data['plant'] ?? '');

if (!$plant) {
    echo json_encode(['benefits' => 'No plant specified.']);
    exit;
}

// Replace with your actual OpenAI API key
$openaiApiKey = 'REDACTED';

// Build the chat message for GPT model
$messages = [
    [
        "role" => "system",
        "content" => "You are a helpful gardening assistant. Provide clear, accurate, and concise bullet lists for plant benefits."
    ],
    [
        "role" => "user",
        "content" => "List the gardening, ecological, culinary, and health benefits of the plant: $plant. Respond as a short, clear bullet list (max 5 points) for a gardening audience."
    ]
];

// Prepare the payload for the Chat Completions API
$payload = [
    "model" => "gpt-3.5-turbo", // You can use "gpt-4o" if you have access!
    "messages" => $messages,
    "max_tokens" => 350,
    "temperature" => 0.7,
];

$ch = curl_init('https://api.openai.com/v1/chat/completions');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $openaiApiKey",
    "Content-Type: application/json"
]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));

$result = curl_exec($ch);
if ($result === false) {
    echo json_encode(['benefits' => 'Error contacting OpenAI API.']);
    curl_close($ch);
    exit;
}
curl_close($ch);

$response = json_decode($result, true);

// Error handling for API issues
if (isset($response['error'])) {
    echo json_encode(['benefits' => 'OpenAI error: ' . $response['error']['message']]);
    exit;
}

// Get the assistant's reply from the new response format
$benefits = $response['choices'][0]['message']['content'] ?? "No information found.";

echo json_encode(['benefits' => trim($benefits)]);
?>
