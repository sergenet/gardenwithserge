<?php
// verify_email.php: Verifies a user's email using the provided token

require_once 'db.php';

if (!isset($_GET['token'])) {
    die('Invalid verification link.');
}
$token = $_GET['token'];

$conn = get_db_connection();
$stmt = $conn->prepare("SELECT id, is_verified FROM users WHERE verification_token = ?");
$stmt->bind_param('s', $token);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows == 0) {
    die('Invalid or expired verification link.');
}

$stmt->bind_result($id, $is_verified);
$stmt->fetch();

if ($is_verified) {
    die('Email already verified.');
}

// Mark as verified
$stmt->close();
$stmt = $conn->prepare("UPDATE users SET is_verified = 1, verification_token = NULL WHERE id = ?");
$stmt->bind_param('i', $id);
$stmt->execute();

echo 'Your email is verified! You may now log in and upgrade to premium if you wish.';
?>