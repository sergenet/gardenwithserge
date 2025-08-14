<?php
// Basic Membership Journal - Minimal Setup

session_start();

// Replace this with a real authentication check for production
if (!isset($_SESSION['user_id'])) {
    $_SESSION['user_id'] = 1; // Demo user for Basic Membership
}
$user_id = $_SESSION['user_id'];

// Minimal SQLite storage for demo (use MySQL in production)
$db = new PDO('sqlite:journal_basic.db');
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$db->exec("CREATE TABLE IF NOT EXISTS entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    entry_date TEXT,
    content TEXT
)");

// Handle new journal entry submission
if ($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($_POST['entry_date']) && !empty($_POST['entry_content'])) {
    $stmt = $db->prepare("INSERT INTO entries (user_id, entry_date, content) VALUES (?, ?, ?)");
    $stmt->execute([$user_id, $_POST['entry_date'], $_POST['entry_content']]);
    header("Location: journal.php");
    exit;
}

// List entries
$stmt = $db->prepare("SELECT * FROM entries WHERE user_id = ? ORDER BY entry_date DESC, id DESC");
$stmt->execute([$user_id]);
$entries = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>🌻 My Plant Journal 🌻</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body {
            background: linear-gradient(120deg, #e6fffa 0%, #d1fae5 100%);
            font-family: system-ui, sans-serif;
        }
        nav {
            background: #fff;
            border-bottom: 1px solid #d1fae5;
            padding: 1em 0;
            margin-bottom: 2em;
        }
        .nav-container {
            max-width: 700px;
            margin: 0 auto;
            display: flex;
            gap: 2em;
            align-items: center;
        }
        .nav-link {
            color: #16a34a;
            font-weight: bold;
            text-decoration: none;
            padding: 0.3em 0.8em;
            border-radius: 0.5em;
            transition: background 0.2s;
        }
        .nav-link:hover {
            background: #d1fae5;
        }
        .nav-btn {
            background: #22c55e;
            color: #fff;
            border: none;
            border-radius: 0.5em;
            padding: 0.3em 1em;
            cursor: pointer;
            font-weight: bold;
            margin-left: auto;
        }
        .container {
            max-width: 700px;
            margin: 0 auto;
            padding: 2em;
        }
        .entry-box {
            background: #fff;
            border-radius: 1em;
            box-shadow: 0 8px 32px rgba(16,185,129,0.15), 0 1.5px 8px rgba(59,130,246,0.07);
            border: 1px solid #d1fae5;
            padding: 2em;
            margin-bottom: 2em;
            position: relative;
            z-index: 10;
        }
        label { display: block; margin: 0.5em 0 0.2em; font-weight: bold; color: #16a34a; }
        input, textarea, button {
            background: #fff;
            color: #222;
            border: 1px solid #d1fae5;
            border-radius: 0.5em;
            padding: 0.5em;
            margin-bottom: 1em;
            width: 100%;
            box-sizing: border-box;
        }
        button {
            background: linear-gradient(90deg, #22c55e, #4ade80);
            color: #fff;
            font-weight: bold;
            border: none;
            width: auto;
            cursor: pointer;
            transition: background 0.2s;
        }
        button:hover {
            background: linear-gradient(90deg, #16a34a, #22c55e);
        }
        .svg-icon { vertical-align: middle; stroke: #22c55e; width: 24px; height: 24px; }
        h1 { font-size: 2.5em; color: #166534; margin-bottom: 0.5em; }
        h2 { font-size: 1.5em; color: #166534; margin-bottom: 1em; }
        .subtitle { font-size: 1.2em; color: #16a34a; font-style: italic; }
        .entries-empty { color: #6b7280; font-size: 1.1em; }
        .entry-content { white-space: pre-wrap; color: #222; margin-top: 0.5em; }
        .entry-date { font-size: 1.1em; color: #16a34a; font-weight: bold; }
        /* Ask the Expert styles */
        .ai-answer { background:#e0f7ec; border-radius:0.5em; padding:1em; margin-top:0.5em;}
    </style>
</head>
<body>
<!-- Navigation Bar Start -->
<nav>
    <div class="nav-container">
        <a href="/home.php" class="nav-link">Home</a>
        <a href="/dashboard.php" class="nav-link">Dashboard</a>
        <a href="/journal.php" class="nav-link">Journal</a>
        <button class="nav-btn" onclick="window.history.back()">Go Back</button>
    </div>
</nav>
<!-- Navigation Bar End -->
<div class="container">
    <div class="entry-box">
        <h1>🌻 My Plant Journal 🌱</h1>
        <div class="subtitle">Cherish your green memories!</div>
    </div>
    <!-- Ask the Expert feature START -->
    <div class="entry-box">
        <h2>🤖 Ask the Expert (AI)</h2>
        <form id="expert-form">
            <label>Your gardening question</label>
            <input type="text" name="question" placeholder="e.g. Why are my tomato leaves yellow?" required>
            <button type="submit">Ask the Expert</button>
        </form>
        <div class="ai-answer" style="display:none;" id="expert-answer">
            <strong>AI Answer:</strong>
            <div id="expert-answer-text"></div>
        </div>
    </div>
    <script>
    document.getElementById('expert-form').onsubmit = async function(e){
        e.preventDefault();
        const q = this.question.value;
        // Update the URL below if your api folder is in a different path!
        const response = await fetch('api/ai-expert.php', {
            method: 'POST',
            body: JSON.stringify({question: q}),
            headers: {'Content-Type':'application/json'}
        });
        const data = await response.json();
        document.getElementById('expert-answer-text').innerText = data.answer;
        document.getElementById('expert-answer').style.display = 'block';
    };
    </script>
    <!-- Ask the Expert feature END -->
    <div class="entry-box">
        <h2>
            <svg class="svg-icon" fill="none" stroke="#22c55e" viewBox="0 0 24 24">
                <path stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Add New Entry
        </h2>
        <form method="post">
            <label>Date</label>
            <input type="date" name="entry_date" required>
            <label>Your Journal Entry</label>
            <textarea name="entry_content" required rows="4"></textarea>
            <button type="submit">Add Entry</button>
        </form>
    </div>
    <div class="entry-box">
        <h2>
            <svg class="svg-icon" fill="none" stroke="#22c55e" viewBox="0 0 24 24">
                <path stroke-width="2" d="M7 8h10M7 16h10M7 12h10"></path>
            </svg>
            Your Entries
        </h2>
        <?php if (empty($entries)): ?>
            <div class="entries-empty">No journal entries yet. Start by adding one above!</div>
        <?php else: ?>
            <?php foreach ($entries as $entry): ?>
                <div class="entry-date"><?=htmlspecialchars(date('F j, Y', strtotime($entry['entry_date'])))?></div>
                <div class="entry-content"><?=htmlspecialchars($entry['content'])?></div>
                <hr style="margin:1em 0;border:0;border-top:1px solid #d1fae5;">
            <?php endforeach; ?>
        <?php endif; ?>
    </div>
</div>
</body>
</html>