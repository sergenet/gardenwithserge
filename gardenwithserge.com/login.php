<?php
session_start();
require_once 'db_config.php';

// Read the user's language from the cookie, default to 'en'
$user_language = $_COOKIE['language'] ?? 'en';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    try {
        $pdo = new PDO(DB_DSN, DB_USER, DB_PASS);
        $stmt = $pdo->prepare("SELECT id, email, password_hash, membership_type FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($password, $user['password_hash'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['email'] = $user['email'];
            $_SESSION['membership_type'] = $user['membership_type'];

            // --- Language sync step ---
            // Update user's language in the database
            $updateStmt = $pdo->prepare("UPDATE users SET language = ? WHERE id = ?");
            $updateStmt->execute([$user_language, $user['id']]);
            // Also store in session (optional, for server-side use)
            $_SESSION['language'] = $user_language;
            setcookie('language', $user_language, time() + (365 * 24 * 60 * 60), "/");

            // Redirect based on membership type
            if ($user['membership_type'] === 'green_thumb') {
                header("Location: green_thumb_members_dashboard.php");
                exit;
            } else {
                // Default to basic dashboard for any other type
                header("Location: basic_members_dashboard.php");
                exit;
            }
        } else {
            $error = "Invalid email or password";
        }
    } catch (Exception $e) {
        $error = "Database error: " . $e->getMessage();
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Member Login - Garden with Serge</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/png" href="favicon.png">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { background: #F5F5DC; }
    </style>
</head>
<body class="min-h-screen flex items-center justify-center" style="background: #F5F5DC;">
    <div class="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <div class="mb-6 text-center">
            <h1 class="text-3xl font-bold text-green-800 mb-2">Member Login</h1>
            <p class="text-gray-600">Sign in to access your member dashboard</p>
        </div>
        <?php if ($error): ?>
            <div class="mb-4 text-red-600 text-center font-semibold"><?php echo htmlspecialchars($error); ?></div>
        <?php endif; ?>
        <form method="POST" class="space-y-6">
            <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" id="email" name="email" required class="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400" autocomplete="email">
            </div>
            <div>
                <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input type="password" id="password" name="password" required class="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400" autocomplete="current-password">
            </div>
            <button type="submit" class="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors">Login</button>
        </form>
        <div class="mt-6 text-center">
            <a href="index.html" class="text-green-700 hover:underline">← Back to Home</a>
        </div>
    </div>
</body>
</html>