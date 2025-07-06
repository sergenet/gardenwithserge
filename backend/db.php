<?php
function get_db_connection() {
    $host = 'localhost';
    $user = 'sergbcqk_gardenwithserge_user';
    $pass = 'Sako!!GWS2025';
    $db   = 'sergbcqk_gardenwithserge_db';
    $conn = new mysqli($host, $user, $pass, $db);
    if ($conn->connect_error) {
        die("Database connection failed: " . $conn->connect_error);
    }
    return $conn;
}
?>