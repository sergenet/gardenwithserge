<?php
// Replace these values with your actual database credentials
define('DB_DSN', 'mysql:host=localhost;dbname=sergbcqk_gardenwithserge_db;charset=latin1');
define('DB_USER', 'sergbcqk_gardenwithserge_user');      // <-- Your database username (from cPanel/phpMyAdmin)
define('DB_PASS', 'Sako!!GWS2025');      // <-- Your database password (from cPanel/phpMyAdmin)

// Create PDO connection for use in other files
try {
    $pdo = new PDO(DB_DSN, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}
?>