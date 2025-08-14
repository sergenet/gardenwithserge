<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
session_start();
require_once 'db_config.php';

/* Language switch */
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['language'])) {
    $lang = $_POST['language'];
    $supported_langs = ['en','fr','de','el','ru','ar','es'];
    if (in_array($lang, $supported_langs)) {
        $_SESSION['language'] = $lang;
        header("Location: " . $_SERVER['PHP_SELF'] . "?lang_updated=1");
        exit;
    }
}

/* Must be logged in AND be basic */
$membership_type = $_SESSION['membership_type'] ?? null;
if (!isset($_SESSION['user_id']) || $membership_type !== 'basic') {
    header("Location: login.php");
    exit;
}

/* Lang helpers */
$user_language = $_SESSION['language'] ?? 'en';
$language_names = [
    'en' => 'English', 'fr' => 'Français', 'de' => 'Deutsch', 'el' => 'Ελληνικά',
    'ru' => 'Русский', 'ar' => 'العربية', 'es' => 'Español'
];
$language_flags = [
    'en' => '🇺🇸', 'fr' => '🇫🇷', 'de' => '🇩🇪', 'el' => '🇬🇷',
    'ru' => '🇷🇺', 'ar' => '🇸🇦', 'es' => '🇪🇸'
];
$language_update_message = '';
if (isset($_GET['lang_updated']) && isset($_SESSION['language'])) {
    $language_update_message = "Language updated to: " . ($language_names[$_SESSION['language']] ?? 'English');
}

/* Translations (mirrors Green Thumb structure, Basic text changed) */
$translations = [
 'en' => [
   'welcome' => "Welcome to your Basic Dashboard!",
   'benefits' => "Your Basic Membership Includes:",
   'monthly_articles' => "Weekly newsletter & beginner tips",
   'plant_care' => "Basic plant identification & analysis",
   'community' => "Community forum access",
   'journal' => "Plant journal",
   'beginners_corner' => "Beginner's Corner",
   'no_articles' => "No Beginner's Corner articles available in your language yet.",
   'logout' => "Logout",
   'profile' => "Your Profile",
   'quick_links' => "Quick Links",
   'forum' => "Community Forum",
   'journal_link' => "Plant Journal",
   'activity' => "Recent Activity",
   'help' => "Need Help?",
   'about' => "About This Site",
   'membership_type' => "Membership Level",
   'achievements' => "Achievements & Badges",
   'no_badges' => "No badges earned yet. Participate to earn your first badge!",
   'member_since' => "Member since:",
   'change_language' => "Change Language",
 ],
 // (Optional) keep other languages pointing to EN strings if you like:
 'fr'=>[], 'es'=>[], 'de'=>[], 'el'=>[], 'ru'=>[], 'ar'=>[],
];

/* DB fetches (copy of Green Thumb logic but safe defaults) */
$error = '';
try {
    // Beginner’s Corner (created_at optional)
    $stmt = $pdo->prepare("SELECT title, content, created_at FROM beginners_corner WHERE language = ? AND is_active = 1 ORDER BY id DESC");
    $stmt->execute([$user_language]);
    $articles = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Recent activity
    $activity_stmt = $pdo->prepare("SELECT action, details, ts FROM user_activity WHERE user_id = ? ORDER BY ts DESC LIMIT 5");
    $activity_stmt->execute([$_SESSION['user_id']]);
    $recent_activity = $activity_stmt->fetchAll(PDO::FETCH_ASSOC);

    // Profile
    $profile_stmt = $pdo->prepare("SELECT username, email, join_date, membership_type, membership_start, avatar_url FROM users WHERE id = ?");
    $profile_stmt->execute([$_SESSION['user_id']]);
    $profile = $profile_stmt->fetch(PDO::FETCH_ASSOC);

    // AI analyses count this month (safe default table name)
    $current_year  = date('Y');
    $current_month = date('m');
    $month_start   = "$current_year-$current_month-01";
    $month_end     = date('Y-m-t');

    $ai_analyses_this_month = 0;
    try {
        $ai_count_stmt = $pdo->prepare(
            "SELECT COUNT(*) FROM plant_analyses WHERE user_id = ? AND analysis_date >= ? AND analysis_date <= ?"
        );
        $ai_count_stmt->execute([$_SESSION['user_id'], $month_start, $month_end]);
        $ai_analyses_this_month = (int)$ai_count_stmt->fetchColumn();
    } catch (Exception $e2) {
        $ai_analyses_this_month = 0;
    }

    // Badges (optional for basic)
    $badges = [];
    try {
        $badge_stmt = $pdo->prepare("SELECT name, description, icon FROM user_badges WHERE user_id = ?");
        $badge_stmt->execute([$_SESSION['user_id']]);
        $badges = $badge_stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $e3) {
        $badges = [];
    }

} catch (Exception $e) {
    $articles = [];
    $recent_activity = [];
    $profile = [];
    $badges = [];
    $ai_analyses_this_month = 0;
    $error = "Database error: " . $e->getMessage();
}
?>
<!DOCTYPE html>
<html lang="<?php echo htmlspecialchars($user_language); ?>">
<head>
  <meta charset="UTF-8" />
  <title>Basic Member Dashboard</title>
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <link rel="icon" type="image/png" href="favicon.png" />
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
  <style>
    body { background: #F5F5DC !important; }
    .feature-card {
      background: linear-gradient(135deg, #d1fae5 0%, #fef3c7 100%);
      border-radius: 1.5rem;
      box-shadow: 0 2px 12px rgba(34,197,94,0.08);
      transition: box-shadow 0.2s;
    }
    .feature-card:hover { box-shadow: 0 6px 24px rgba(16,185,129,0.18); }
    .green-badge {
      background: linear-gradient(90deg, #10b981 0%, #059669 100%);
      color:#fff; padding:.5rem 1.25rem; border-radius:9999px; font-weight:bold;
      font-size:1rem; box-shadow:0 2px 8px rgba(34,197,94,0.12); letter-spacing:.03em;
      display:inline-block; margin-bottom:1.5rem;
    }
  </style>
</head>
<body class="min-h-screen flex flex-col items-center justify-start">
  <!-- Nav -->
  <nav class="w-full bg-white border-b border-green-100 shadow-sm sticky top-0 z-30 mb-2">
    <div class="max-w-5xl mx-auto flex gap-6 items-center py-2 px-4">
      <img src="favicon.png" alt="Basic" class="h-8 w-8 rounded-full">
      <a href="/home.php" class="text-green-700 font-bold hover:underline">Home</a>
      <a href="/basic_members_dashboard.php" class="text-green-700 font-bold hover:underline">Dashboard</a>
      <a href="/journal.php" class="text-green-700 font-bold hover:underline">Journal</a>
      <a href="/articles.php" class="text-green-700 font-bold hover:underline">
        <?php echo $translations[$user_language]['beginners_corner'] ?? "Beginner's Corner"; ?>
      </a>
      <button onclick="window.history.back()" class="ml-auto bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">Go Back</button>
      <form method="post" action="logout.php" class="ml-4">
        <button type="submit" class="bg-gray-700 hover:bg-gray-900 text-white px-4 py-2 rounded-lg font-semibold">
          <?php echo $translations[$user_language]['logout'] ?? 'Logout'; ?>
        </button>
      </form>
    </div>
  </nav>

  <main class="w-full max-w-3xl mx-auto mt-6 p-0 sm:px-6">
    <!-- Hero -->
    <section class="bg-white rounded-2xl shadow-md px-6 py-8 mb-8 text-center relative">
      <div class="green-badge flex items-center justify-center gap-2 mx-auto mb-2">
        <i data-lucide="leaf" class="inline h-6 w-6 text-white"></i>
        Basic Member
      </div>
      <h1 class="text-3xl sm:text-4xl font-bold text-green-800 mb-2">
        <?php echo $translations[$user_language]['welcome'] ?? 'Welcome to your Basic Dashboard!'; ?>
      </h1>
      <p class="text-lg text-green-700 mb-2">Identify and analyze plants anytime.</p>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 justify-center mt-4">
        <div class="bg-green-50 rounded-lg p-4 flex flex-col items-center">
          <i data-lucide="camera" class="h-7 w-7 text-green-600 mb-1"></i>
          <span class="text-green-900 font-bold text-xl"><?php echo (int)$ai_analyses_this_month; ?></span>
          <span class="text-green-800 text-sm">AI Analyses this month</span>
        </div>
        <div class="bg-blue-50 rounded-lg p-4 flex flex-col items-center">
          <i data-lucide="calendar" class="h-7 w-7 text-blue-600 mb-1"></i>
          <span class="text-green-900 font-bold text-xl">
            <?php
              $membership_since = $profile['membership_start'] ?? $profile['join_date'] ?? ($_SESSION['join_date'] ?? '');
              echo $membership_since ? htmlspecialchars(date('M Y', strtotime($membership_since))) : 'Unknown';
            ?>
          </span>
          <span class="text-blue-800 text-sm">Member since</span>
        </div>
        <div class="bg-yellow-50 rounded-lg p-4 flex flex-col items-center">
          <i data-lucide="star" class="h-7 w-7 text-yellow-600 mb-1"></i>
          <span class="text-green-900 font-bold text-xl"><?php echo count($badges); ?></span>
          <span class="text-yellow-800 text-sm">Badges</span>
        </div>
      </div>
    </section>

    <!-- Action cards -->
    <section class="mb-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
      <a href="#ai-plant-doctor-anchor" class="feature-card px-6 py-6 flex flex-col items-center hover:shadow-xl">
        <i data-lucide="camera" class="h-10 w-10 text-green-600 mb-3"></i>
        <span class="font-semibold text-lg text-green-800 mb-1">AI Plant Doctor</span>
        <span class="text-green-700 text-sm text-center">Identify & analyze plants</span>
      </a>
      <a href="/beginner_guides.php" class="feature-card px-6 py-6 flex flex-col items-center hover:shadow-xl">
        <i data-lucide="book-open" class="h-10 w-10 text-blue-600 mb-3"></i>
        <span class="font-semibold text-lg text-green-800 mb-1">Beginner Guides</span>
        <span class="text-green-700 text-sm text-center">Learn core gardening basics</span>
      </a>
    </section>

    <!-- Profile -->
    <section class="flex flex-col md:flex-row items-start md:items-center justify-between bg-green-50 rounded-lg p-6 mb-4 shadow">
      <div class="flex items-center space-x-4">
        <?php if (!empty($profile['avatar_url'])): ?>
          <img src="<?php echo htmlspecialchars($profile['avatar_url']); ?>" alt="Avatar" class="w-14 h-14 rounded-full border border-green-400 shadow" />
        <?php else: ?>
          <div class="w-14 h-14 rounded-full bg-green-200 flex items-center justify-center text-3xl text-green-700 border border-green-400 shadow">
            <span><?php echo strtoupper(substr($profile['username'] ?? 'U', 0, 1)); ?></span>
          </div>
        <?php endif; ?>
        <div>
          <div class="text-lg font-semibold text-green-900 mb-1"><?php echo $translations[$user_language]['profile'] ?? 'Your Profile'; ?></div>
          <div class="mb-1">
            <?php
              if ($profile) {
                echo htmlspecialchars($profile['username'] ?? '') . ' <span class="text-gray-500">(' . htmlspecialchars($profile['email'] ?? '') . ')</span>';
              } else {
                echo htmlspecialchars($_SESSION['email']);
              }
            ?>
          </div>
          <div class="text-sm text-gray-600 mb-2">
            <?php
              echo ($translations[$user_language]['member_since'] ?? 'Member since:') . ' ';
              echo ($membership_since) ? htmlspecialchars($membership_since) : 'Unknown';
            ?>
          </div>
          <div class="text-sm text-gray-700">
            <strong><?php echo $translations[$user_language]['membership_type'] ?? 'Membership Level'; ?>:</strong>
            <span class="inline-block px-2 py-1 bg-green-200 text-green-900 rounded font-semibold">basic</span>
          </div>
        </div>
      </div>
      <!-- Language Switcher -->
      <form method="post" class="mt-4 md:mt-0 flex flex-col md:flex-row items-center">
        <label for="language" class="mr-2 text-gray-700">
          <?php echo $language_flags[$user_language] ?? '🌐'; ?>
        </label>
        <select name="language" id="language" class="rounded px-3 py-2 border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400">
          <?php foreach ($language_names as $code => $langName): ?>
            <option value="<?php echo $code; ?>" <?php if($user_language == $code) echo 'selected'; ?>>
              <?php echo ($language_flags[$code] ?? '') . ' ' . $langName; ?>
            </option>
          <?php endforeach; ?>
        </select>
        <button type="submit" class="ml-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          <?php echo $translations[$user_language]['change_language'] ?? 'Change Language'; ?>
        </button>
      </form>
    </section>

    <!-- AI analyses count -->
    <div class="flex flex-col sm:flex-row gap-4 mb-4">
      <div class="flex-1 rounded-lg bg-green-50 p-4 shadow flex flex-col items-center">
        <div class="text-3xl font-bold text-green-700 mb-1"><?php echo (int)$ai_analyses_this_month; ?></div>
        <div class="text-gray-700 text-sm">AI Analyses this month</div>
      </div>
    </div>

    <!-- Basic benefits (clean & simple, no “discounts”) -->
    <section class="rounded-lg bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 shadow">
      <div class="font-semibold mb-2 text-yellow-800 text-lg">
        <?php echo $translations[$user_language]['benefits'] ?? 'Your Basic Membership Includes:'; ?>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="flex items-start gap-3">
          <i data-lucide="camera" class="h-6 w-6 text-green-600 mt-1"></i>
          <div><strong>Basic Plant Identification</strong><br>Upload a photo to identify the plant and check its health.</div>
        </div>
        <div class="flex items-start gap-3">
          <i data-lucide="mail" class="h-6 w-6 text-blue-600 mt-1"></i>
          <div><strong>Weekly Newsletter</strong><br>Beginner-friendly tips and seasonal reminders.</div>
        </div>
        <div class="flex items-start gap-3">
          <i data-lucide="users" class="h-6 w-6 text-pink-600 mt-1"></i>
          <div><strong>Community Access</strong><br>Join the public forum and learn from others.</div>
        </div>
        <div class="flex items-start gap-3">
          <i data-lucide="book-open" class="h-6 w-6 text-yellow-600 mt-1"></i>
          <div><strong>Beginner Guides</strong><br>Read curated articles in Beginner’s Corner.</div>
        </div>
      </div>
    </section>

    <!-- Quick Links -->
    <section class="rounded-lg bg-green-50 p-4 mb-4 shadow">
      <div class="font-semibold text-green-800 mb-2">
        <?php echo $translations[$user_language]['quick_links'] ?? 'Quick Links'; ?>
      </div>
      <ul class="list-inside list-disc text-green-700">
        <li>
          <a href="https://www.facebook.com/groups/742905868105286" target="_blank" rel="noopener noreferrer" class="hover:underline">
            <?php echo $translations[$user_language]['forum'] ?? 'Community Forum'; ?>
          </a>
        </li>
        <li><a href="journal.php" class="hover:underline"><?php echo $translations[$user_language]['journal_link'] ?? 'Plant Journal'; ?></a></li>
        <li><a href="articles.php" class="hover:underline"><?php echo $translations[$user_language]['beginners_corner'] ?? "Beginner's Corner"; ?></a></li>
        <li><a href="plants.php" class="hover:underline">🌱 My Plants</a></li>
      </ul>
    </section>

    <!-- Recent Activity -->
    <section class="rounded-lg bg-purple-50 p-4 mb-4 shadow">
      <div class="font-semibold text-purple-800 mb-2">
        <?php echo $translations[$user_language]['activity'] ?? 'Recent Activity'; ?>
      </div>
      <?php if (!empty($recent_activity)): ?>
        <ul class="list-inside list-disc text-purple-700">
        <?php foreach ($recent_activity as $activity): ?>
          <li>
            <?php echo htmlspecialchars($activity['action']); ?>:
            <?php echo htmlspecialchars($activity['details']); ?>
            <span class="text-xs text-gray-500">(<?php echo $activity['ts']; ?>)</span>
          </li>
        <?php endforeach; ?>
        </ul>
      <?php else: ?>
        <div class="text-gray-500 italic">No recent activity found.</div>
      <?php endif; ?>
    </section>

    <!-- Beginner's Corner -->
    <section class="rounded-lg bg-white border border-green-200 p-4 mb-4 shadow">
      <h3 class="text-lg font-semibold text-green-800 mb-2">
        <?php
          echo $translations[$user_language]['beginners_corner'] ?? $translations['en']['beginners_corner'];
          echo " (" . strtoupper($user_language) . ")";
        ?>
      </h3>
      <?php if (!empty($error)) echo "<div class=\"mb-2 text-red-600\">$error</div>"; ?>
      <?php if ($articles): ?>
        <?php foreach ($articles as $article): ?>
          <div class="mb-3 border-b border-gray-200 pb-3">
            <div class="font-bold text-green-700"><?php echo htmlspecialchars($article['title'] ?? ''); ?></div>
            <div class="text-gray-700 mb-1"><?php echo nl2br(htmlspecialchars($article['content'] ?? '')); ?></div>
            <?php if (!empty($article['created_at'])): ?>
              <div class="text-xs text-gray-400">Published: <?php echo htmlspecialchars($article['created_at']); ?></div>
            <?php endif; ?>
          </div>
        <?php endforeach; ?>
      <?php else: ?>
        <div class="text-gray-500 italic">
          <?php echo $translations[$user_language]['no_articles'] ?? $translations['en']['no_articles']; ?>
        </div>
      <?php endif; ?>
    </section>

    <!-- AI Plant Doctor (same component used by Green Thumb) -->
    <?php include 'plant_doctor_component.php'; ?>

    <!-- Help/About -->
    <section class="rounded-lg bg-yellow-100 p-4 mb-6 shadow flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div class="font-semibold text-yellow-900 mb-1"><?php echo $translations[$user_language]['help'] ?? 'Need Help?'; ?></div>
        <p class="text-yellow-900">Questions? Reach out via the contact page and we’ll help you get growing.</p>
      </div>
      <a href="contact.php" class="mt-3 sm:mt-0 bg-yellow-600 hover:bg-yellow-700 text-white px-5 py-2 rounded-lg font-semibold transition-colors">Contact</a>
    </section>

  </main>

  <script>window.lucide && window.lucide.createIcons();</script>
  <script>
async function refreshCounter(){
  try{
    const r = await fetch('/backend/ai-count.php', {credentials:'same-origin'});
    const j = await r.json();
    const el = document.getElementById('ai_count');
    if (el && typeof j.count === 'number') el.textContent = j.count;
  }catch(_){}
}
refreshCounter();
window.addEventListener('focus', refreshCounter);
setInterval(refreshCounter, 10000);
</script>

</body>
</html>
