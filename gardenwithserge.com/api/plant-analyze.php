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

$plant_name = $input['plantName'] ?? '';
$scientific_name = $input['scientificName'] ?? '';
$health_status = $input['healthStatus'] ?? '';
$care_recommendations = $input['careRecommendations'] ?? '';
$benefits = $input['benefits'] ?? '';
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
            "INSERT INTO plant_analyses (user_id, plant_name, scientific_name, health_status, care_recommendations, benefits, confidence, image_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        );
        // Only save "benefits" for green_thumb members
        $stmt->execute([
            $user_id,
            $plant_name,
            $scientific_name,
            $health_status,
            is_array($care_recommendations) ? json_encode($care_recommendations) : $care_recommendations,
            ($membership_type === 'green_thumb') ? $benefits : '', // blank for basic
            $confidence,
            $image_url
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error', 'details' => $e->getMessage()]);
        exit;
    }
}

$response = [
    'success' => true,
    'plantName' => $plant_name,
    'scientificName' => $scientific_name,
    'healthStatus' => $health_status,
    'careRecommendations' => $care_recommendations,
    'confidence' => $confidence,
    'imageUrl' => $image_url
];

// Only send benefits to green_thumb members
if ($membership_type === 'green_thumb') {
    $response['benefits'] = $benefits;
}

echo json_encode($response);
?>