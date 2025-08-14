<?php
require_once 'db_config.php';
$pdo = new PDO(DB_DSN, DB_USER, DB_PASS);
if (isset($_GET['delete']) && is_numeric($_GET['delete'])) {
    $stmt = $pdo->prepare("DELETE FROM beginners_corner WHERE id = ?");
    $stmt->execute([$_GET['delete']]);
    echo "Deleted article ID " . (int)$_GET['delete'] . "<br>";
}
echo "<h2>Beginner's Corner Articles</h2>";
foreach ($pdo->query("SELECT id, title, created_at FROM beginners_corner ORDER BY created_at DESC") as $row) {
    echo "<div>
        <strong>{$row['title']}</strong> ({$row['created_at']}) 
        <a href='?delete={$row['id']}' onclick=\"return confirm('Delete this article?')\">Delete</a>
    </div>";
}
?>