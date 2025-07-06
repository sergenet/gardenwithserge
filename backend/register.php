<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
// register.php: Register a new user and send verification email

require_once 'db.php'; // assumes db.php contains your database connection

function send_verification_email($email, $token) {
    $verify_url = "https://gardenwithserge.com/verify_email.php?token=" . urlencode($token);
    $subject = "Verify your email for GardenWithSerge";
    $message = "Welcome to GardenWithSerge!\n\nPlease verify your email by clicking the link below:\n\n$verify_url\n\nIf you did not request this, please ignore this email.";
    $headers = "From: noreply@gardenwithserge.com\r\n";
    return mail($email, $subject, $message, $headers);
}

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Read JSON input
$data = json_decode(file_get_contents('php://input'), true);
$email = isset($data['email']) ? trim($data['email']) : '';
$password = isset($data['password']) ? $data['password'] : '';

if (!$email || !$password) {
    echo json_encode(['success' => false, 'message' => 'Email and password required']);
    exit;
}

$conn = get_db_connection();

// Check if email already exists
$stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Email already registered']);
    exit;
}
$stmt->close();

// Hash password and create verification token
$hashed_password = password_hash($password, PASSWORD_DEFAULT);
$token = bin2hex(random_bytes(32));

// Insert user
$stmt = $conn->prepare("INSERT INTO users (email, password_hash, verification_token, is_verified) VALUES (?, ?, ?, 0)");
$stmt->bind_param("sss", $email, $hashed_password, $token);
if ($stmt->execute()) {
    send_verification_email($email, $token);
    echo json_encode(['success' => true, 'message' => 'Registration successful! Please check your email to verify your account.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Registration failed. Please try again.']);
}
$stmt->close();
$conn->close();
?>