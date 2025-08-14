<?php
// Include translations
include 'email_translations.php';

// Database connection details
$host = "localhost";
$user = "sergbcqk_gardenwithserge_user";
$password = "Sako!!GWS2025";
$db = "sergbcqk_gardenwithserge_db";

// Connect to database
$conn = new mysqli($host, $user, $password, $db);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get form data
$email = $_POST['email'];
$language = $_POST['language'];
$subscribed_at = date("Y-m-d H:i:s");

// Check if email already exists
$check_sql = "SELECT COUNT(*) FROM newsletter_subscribers WHERE email = ?";
$check_stmt = $conn->prepare($check_sql);
$check_stmt->bind_param("s", $email);
$check_stmt->execute();
$check_stmt->bind_result($count);
$check_stmt->fetch();
$check_stmt->close();

if ($count > 0) {
    echo "This email address is already subscribed.<br>
    <a href='https://gardenwithserge.com'>Return to Garden With Serge</a>
    <meta http-equiv='refresh' content='5;url=https://gardenwithserge.com'>";
} else {
    // Insert new subscriber
    $sql = "INSERT INTO newsletter_subscribers (email, language, subscribed_at) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sss", $email, $language, $subscribed_at);

    if ($stmt->execute()) {
        // Pick email language, default to English if not available
        $lang = isset($emailTranslations[$language]) ? $language : 'en';
        $subject = $emailTranslations[$lang]['subject'];
        $message = $emailTranslations[$lang]['message'];
        $headers = "From: noreply@gardenwithserge.com\r\nReply-To: noreply@gardenwithserge.com\r\n";

        // Send confirmation email
        if (mail($email, $subject, $message, $headers)) {
            echo "Thank you for subscribing! A confirmation email has been sent.<br>
            <a href='https://gardenwithserge.com'>Return to Garden With Serge</a>
            <meta http-equiv='refresh' content='5;url=https://gardenwithserge.com'>";
        } else {
            echo "Thank you for subscribing! (Could not send confirmation email.)<br>
            <a href='https://gardenwithserge.com'>Return to Garden With Serge</a>
            <meta http-equiv='refresh' content='5;url=https://gardenwithserge.com'>";
        }
    } else {
        echo "Error: " . $stmt->error . "<br>
        <a href='https://gardenwithserge.com'>Return to Garden With Serge</a>
        <meta http-equiv='refresh' content='5;url=https://gardenwithserge.com'>";
    }
    $stmt->close();
}

$conn->close();
?>