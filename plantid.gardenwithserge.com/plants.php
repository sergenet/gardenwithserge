<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();
require_once 'db_config.php';

// Check login
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit;
}

$user_id = $_SESSION['user_id'];
$error = '';
$success = '';

// Handle Add Plant form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['add_plant'])) {
    $name = trim($_POST['plant_name'] ?? '');
    $species = trim($_POST['plant_species'] ?? '');

    if ($name === '') {
        $error = "Plant name is required.";
    } else {
        try {
            $pdo = new PDO(DB_DSN, DB_USER, DB_PASS);
            $stmt = $pdo->prepare("INSERT INTO user_plants (user_id, name, species) VALUES (?, ?, ?)");
            $stmt->execute([$user_id, $name, $species]);
            $success = "Plant added!";
        } catch (Exception $e) {
            $error = "Database error: " . $e->getMessage();
        }
    }
}

// Fetch user's plants
$plants = [];
try {
    $pdo = new PDO(DB_DSN, DB_USER, DB_PASS);
    $stmt = $pdo->prepare("SELECT id, name, species, added_at FROM user_plants WHERE user_id = ? ORDER BY added_at DESC");
    $stmt->execute([$user_id]);
    $plants = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (Exception $e) {
    $error = "Database error: " . $e->getMessage();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Your Plants</title>
    <link rel="icon" type="image/png" href="favicon.png">
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-green-50 min-h-screen flex flex-col items-center">
    <div class="w-full max-w-xl mt-10 bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-2xl font-bold text-green-800 mb-4">Your Plants</h2>

        <?php if ($error): ?>
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-3"><?php echo htmlspecialchars($error); ?></div>
        <?php endif; ?>
        <?php if ($success): ?>
            <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-3"><?php echo htmlspecialchars($success); ?></div>
        <?php endif; ?>

        <form method="post" class="mb-6 flex flex-col sm:flex-row gap-3 items-stretch">
            <input type="text" name="plant_name" placeholder="Plant name (e.g. Monstera)" class="border px-3 py-2 rounded w-full" required>
            <input type="text" name="plant_species" placeholder="Species (optional)" class="border px-3 py-2 rounded w-full">
            <button type="submit" name="add_plant" class="bg-green-700 text-white px-5 py-2 rounded hover:bg-green-800">Add Plant</button>
        </form>

        <h3 class="text-lg font-semibold mb-2">Your Plant List</h3>
        <?php if (count($plants) === 0): ?>
            <div class="text-gray-600 italic">You have not added any plants yet.</div>
        <?php else: ?>
            <ul class="divide-y">
                <?php foreach ($plants as $plant): ?>
                    <li class="py-2 flex flex-col">
                        <span class="font-bold"><?php echo htmlspecialchars($plant['name']); ?></span>
                        <?php if ($plant['species']): ?>
                            <span class="text-gray-700 text-sm"><?php echo htmlspecialchars($plant['species']); ?></span>
                        <?php endif; ?>
                        <span class="text-xs text-gray-400">Added: <?php echo htmlspecialchars($plant['added_at']); ?></span>
                        <a href="plant_reminders.php?plant_id=<?php echo $plant['id']; ?>" class="text-green-700 hover:underline mt-1 text-sm">Manage Reminders</a>
                    </li>
                <?php endforeach; ?>
            </ul>
        <?php endif; ?>

        <a href="basic_members_dashboard.php" class="inline-block mt-6 text-green-800 hover:underline">&larr; Back to Dashboard</a>
    </div>
</body>
</html>