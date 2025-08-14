<?php
session_start();
header('Content-Type: application/json');

require_once __DIR__ . '/../db_config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'POST only']);
    exit;
}

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Not logged in']);
    exit;
}

$input = $_POST;

$user_id = $_SESSION['user_id'];
$membership_type = $_SESSION['membership_type'] ?? '';

// Always require plant confirmation before proceeding
if (empty($input['confirmed']) || $input['confirmed'] !== 'yes') {
    http_response_code(400);
    echo json_encode(['error' => 'Plant identity not confirmed']);
    exit;
}

$plant_name = $input['plantName'] ?? '';
$scientific_name = $input['scientificName'] ?? '';
$confidence = $input['confidence'] ?? '';
$image_url = $input['imageUrl'] ?? '';

if (!$plant_name) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing plant name']);
    exit;
}

// Save for basic and green_thumb only
if ($membership_type === 'basic' || $membership_type === 'green_thumb') {
    try {
        $pdo = new PDO(DB_DSN, DB_USER, DB_PASS);
        $stmt = $pdo->prepare(
            "INSERT INTO plant_identifications (user_id, plant_name, scientific_name, confidence, image_url)
             VALUES (?, ?, ?, ?, ?)"
        );
        $stmt->execute([
            $user_id,
            $plant_name,
            $scientific_name,
            $confidence,
            $image_url
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error', 'details' => $e->getMessage()]);
        exit;
    }
}

echo json_encode([
    'success' => true,
    'plantName' => $plant_name,
    'scientificName' => $scientific_name,
    'confidence' => $confidence,
    'imageUrl' => $image_url
]);
?>