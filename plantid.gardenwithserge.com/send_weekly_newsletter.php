<?php
// Load DB config
require_once 'db_config.php';

// Connect to DB
$pdo = new PDO(DB_DSN, DB_USER, DB_PASS);

// Set your timezone if needed (example: UTC, can change)
$now = new DateTime('now', new DateTimeZone('UTC'));
$week_year = $now->format('o-W'); // ISO week of year, e.g. "2025-30"

// Ensure newsletter_log table exists
$pdo->exec("CREATE TABLE IF NOT EXISTS newsletter_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sent_at DATETIME NOT NULL,
    week_year VARCHAR(8) NOT NULL,
    notes VARCHAR(255)
)");

// Check if already sent this week
$stmt = $pdo->prepare("SELECT COUNT(*) FROM newsletter_log WHERE week_year = ?");
$stmt->execute([$week_year]);
$already_sent = $stmt->fetchColumn();

if ($already_sent) {
    exit("Newsletter already sent for week $week_year\n");
}

// --- SEND THE NEWSLETTER ---
// Fetch subscribers (active ones)
$stmt = $pdo->query("SELECT email FROM newsletter_subscribers WHERE active=1");
$subscribers = $stmt->fetchAll(PDO::FETCH_COLUMN);

$subject = "🌱 Weekly Garden Newsletter (English)";
$body = "Hello gardener! This is your weekly update. Happy gardening!\n\n-- Garden With Serge";

// Use your actual email sending routine here
foreach ($subscribers as $email) {
    // Uncomment and use your real mailer here:
    // mail($email, $subject, $body, "From: serge@gardenwithserge.com");
    echo "Pretend-sending to $email\n";
}

// Log the send in the database
$stmt = $pdo->prepare("INSERT INTO newsletter_log (sent_at, week_year, notes) VALUES (?, ?, ?)");
$stmt->execute([$now->format('Y-m-d H:i:s'), $week_year, 'Weekly newsletter sent']);

// Output confirmation for cron log
echo "Newsletter sent for week $week_year at " . $now->format('Y-m-d H:i:s') . "\n";
?>