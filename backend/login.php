<?php
// login.php: User login with email and password

require_once 'db.php';

header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['email']) || !isset($data['password'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Email and password required']);
    exit;
}

$email = filter_var($data['email'], FILTER_VALIDATE_EMAIL);
$password = $data['password'];

if (!$email) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid email']);
    exit;
}

$conn = get_db_connection();
$stmt = $conn->prepare("SELECT id, password_hash, is_verified, is_premium FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows == 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
    exit;
}

$stmt->bind_result($id, $password_hash, $is_verified, $is_premium);
$stmt->fetch();

if (!$is_verified) {
    echo json_encode(['success' => false, 'message' => 'Please verify your email before logging in.']);
    exit;
}

if (!password_verify($password, $password_hash)) {
    echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
    exit;
}

// Optionally, generate a session/token here. For now, just return user info.
echo json_encode([
    'success' => true,
    'message' => 'Login successful!',
    'user' => [
        'id' => $id,
        'email' => $email,
        'is_premium' => $is_premium
    ]
]);
?>