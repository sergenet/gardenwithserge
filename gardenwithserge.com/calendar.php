<?php
session_start();
if (!isset($_SESSION['membership_type']) || $_SESSION['membership_type'] !== 'green_thumb') {
    header('Location: index.html');
    exit;
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Personalized Garden Calendar</title>
</head>
<body>
    <h1>Personalized Garden Calendar</h1>
    <p>This feature is coming soon for Green Thumb members!</p>
    <a href="green_thumb_members_dashboard.php">Back to Dashboard</a>
</body>
</html>