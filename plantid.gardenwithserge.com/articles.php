<?php
require_once 'db_config.php';

$section = isset($_GET['section']) ? $_GET['section'] : '';

try {
    $pdo = new PDO(DB_DSN, DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($section == 'beginners') {
        echo "<h2>Beginner's Corner</h2>";

        $stmt = $pdo->query("SELECT title, content, created_at FROM beginners_corner WHERE is_active = 1 ORDER BY created_at DESC");
        $articles = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (count($articles) === 0) {
            echo "<p>No articles available yet. Check back soon!</p>";
        } else {
            foreach ($articles as $row) {
                // Escape output to prevent XSS and format content
                $safeTitle = htmlspecialchars($row['title'], ENT_QUOTES, 'UTF-8');
                $safeContent = nl2br(htmlspecialchars($row['content'], ENT_QUOTES, 'UTF-8'));
                $safeCreated = htmlspecialchars($row['created_at'], ENT_QUOTES, 'UTF-8');

                echo "<div class='article'>";
                echo "<h3>{$safeTitle}</h3>";
                echo "<div>{$safeContent}</div>";
                echo "<small>Posted on {$safeCreated}</small>";
                echo "<hr>";
                echo "</div>";
            }
        }
        exit; // Prevents showing anything else
    }

    echo "<h2>Welcome to the Main Articles Page</h2>";
    echo "<p>Select a section to view articles.</p>";

} catch (Exception $e) {
    // User-friendly error message
    echo "<h2>Error</h2>";
    echo "<p>Could not connect to the database. Please try again later.</p>";
    // Log actual error for developer (optional)
    // error_log($e->getMessage());
}
?>