<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/vendor/autoload.php';

function send_verification_email($email, $token) {
    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host       = 'gardenwithserge.com'; // Your SMTP server
        $mail->SMTPAuth   = true;
        $mail->Username   = 'noreply@gardenwithserge.com'; // Your email address
        $mail->Password   = 'Sako!!GWS2025';         // Your email password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;   // Use SSL
        $mail->Port       = 465;                           // SSL port

        $mail->setFrom('noreply@gardenwithserge.com', 'GardenWithSerge');
        $mail->addAddress($email);

        $mail->isHTML(false);
        $mail->Subject = 'Verify your email for GardenWithSerge';
        $verify_url = "https://gardenwithserge.com/verify_email.php?token=" . urlencode($token);
        $mail->Body = "Welcome to GardenWithSerge!\n\nPlease verify your email by clicking the link below:\n\n$verify_url\n\nIf you did not request this, please ignore this email.";

        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Mailer Error: {$mail->ErrorInfo}");
        return false;
    }
}

// Test sending an email:
$email = 'sergenet@yahoo.com'; // Change this to your email for testing
$token = 'testingtoken123';
if(send_verification_email($email, $token)){
    echo "Verification email sent!";
} else {
    echo "Failed to send verification email.";
}
?>