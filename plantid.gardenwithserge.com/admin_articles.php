<?php
require_once 'db_config.php';

// --- CHANGE THIS TO YOUR SECRET PASSWORD ---
$admin_password = 'Sako!!GWS2025';

session_start();

if (!isset($_SESSION['logged_in'])) {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if (isset($_POST['password']) && $_POST['password'] === $admin_password) {
            $_SESSION['logged_in'] = true;
            header('Location: admin_articles.php');
            exit;
        } else {
            echo "<p style='color:red;'>Incorrect password.</p>";
        }
    }
    // Show password form
    echo '<form method="post">
            <label>Admin Password: <input type="password" name="password"></label>
            <input type="submit" value="Login">
        </form>';
    exit;
}

// --- Handle Deletion ---
$pdo = new PDO(DB_DSN, DB_USER, DB_PASS);
if (isset($_GET['delete']) && is_numeric($_GET['delete'])) {
    $stmt = $pdo->prepare("DELETE FROM beginners_corner WHERE id = ?");
    $stmt->execute([$_GET['delete']]);
    echo "<p style='color:green;'>Deleted article ID " . (int)$_GET['delete'] . "</p>";
}

// --- Show Articles ---
echo "<h2>Beginner's Corner Articles (Admin)</h2>";
foreach ($pdo->query("SELECT id, title, created_at FROM beginners_corner ORDER BY created_at DESC") as $row) {
    echo "<div>
        <strong>{$row['title']}</strong> ({$row['created_at']}) 
        <a href='?delete={$row['id']}' onclick=\"return confirm('Delete this article?')\">Delete</a>
    </div>";
}
echo '<p><a href="?logout=1">Logout</a></p>';

// --- Handle Logout ---
if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: admin_articles.php');
    exit;
}
?>