<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
session_start();
require_once 'db_config.php';

// Handle language switcher form POST
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['language'])) {
    $lang = $_POST['language'];
    $supported_langs = ['en','fr','de','el','ru','ar','es'];
    if (in_array($lang, $supported_langs)) {
        $_SESSION['language'] = $lang;
        header("Location: " . $_SERVER['PHP_SELF'] . "?lang_updated=1");
        exit;
    }
}

$membership_type = $_SESSION['membership_type'] ?? ($_SESSION['membership_level'] ?? null);
if (!isset($_SESSION['user_id']) || $membership_type !== 'green_thumb') {
    header("Location: login.php");
    exit;
}

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

// TRANSLATIONS FOR ALL SUPPORTED LANGUAGES
$translations = [
'en' => [
    'welcome' => "Welcome to your Green Thumb Dashboard!",
    'benefits' => "Your Green Thumb Benefits:",
    'monthly_articles' => "Exclusive Monthly Articles & Guides",
    'plant_care' => "Personalized plant care reminders",
    'ai_expert' => "Ask the Expert (AI)",
    'ai_planning' => "AI Garden Planning",
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
    'cancel_subscription' => "Cancel Subscription",
    'are_you_sure' => "Are you sure you want to cancel your subscription?",
    'yes_cancel' => "Yes, cancel it",
    'no_keep' => "No, keep my subscription",
    'achievements' => "Achievements & Badges",
    'no_badges' => "No badges earned yet. Participate to earn your first badge!",
    'member_since' => "Member since:",
    'change_language' => "Change Language"
],
'fr' => [
    'welcome' => "Bienvenue sur votre Tableau de Bord Green Thumb !",
    'benefits' => "Vos avantages Green Thumb :",
    'monthly_articles' => "Articles et guides mensuels exclusifs",
    'plant_care' => "Rappels personnalisés pour l'entretien des plantes",
    'ai_expert' => "Demandez à l'expert (IA)",
    'ai_planning' => "Planification de jardin IA",
    'community' => "Accès au forum communautaire",
    'journal' => "Journal des plantes",
    'beginners_corner' => "Coin des débutants",
    'no_articles' => "Aucun article du Coin des débutants disponible dans votre langue.",
    'logout' => "Déconnexion",
    'profile' => "Votre profil",
    'quick_links' => "Liens rapides",
    'forum' => "Forum communautaire",
    'journal_link' => "Journal des plantes",
    'activity' => "Activité récente",
    'help' => "Besoin d'aide ?",
    'about' => "À propos de ce site",
    'membership_type' => "Niveau d'adhésion",
    'cancel_subscription' => "Annuler l'abonnement",
    'are_you_sure' => "Êtes-vous sûr de vouloir annuler votre abonnement ?",
    'yes_cancel' => "Oui, annulez-le",
    'no_keep' => "Non, garder mon abonnement",
    'achievements' => "Réalisations et badges",
    'no_badges' => "Aucun badge obtenu pour le moment. Participez pour obtenir votre premier badge !",
    'member_since' => "Membre depuis :",
    'change_language' => "Changer de langue"
],
'es' => [
    'welcome' => "¡Bienvenido a tu panel Green Thumb!",
    'benefits' => "Tus beneficios Green Thumb:",
    'monthly_articles' => "Artículos mensuales exclusivos y guías",
    'plant_care' => "Recordatorios personalizados de cuidado de plantas",
    'ai_expert' => "Consulta al experto (IA)",
    'ai_planning' => "Planificación de jardines con IA",
    'community' => "Acceso al foro comunitario",
    'journal' => "Diario de plantas",
    'beginners_corner' => "Rincón del principiante",
    'no_articles' => "Aún no hay artículos para principiantes disponibles en tu idioma.",
    'logout' => "Cerrar sesión",
    'profile' => "Tu perfil",
    'quick_links' => "Enlaces rápidos",
    'forum' => "Foro comunitario",
    'journal_link' => "Diario de plantas",
    'activity' => "Actividad reciente",
    'help' => "¿Necesitas ayuda?",
    'about' => "Sobre este sitio",
    'membership_type' => "Nivel de membresía",
    'cancel_subscription' => "Cancelar suscripción",
    'are_you_sure' => "¿Seguro que deseas cancelar tu suscripción?",
    'yes_cancel' => "Sí, cancelarla",
    'no_keep' => "No, mantenerla",
    'achievements' => "Logros y Medallas",
    'no_badges' => "Aún no has ganado ninguna medalla. ¡Participa para ganar tu primera medalla!",
    'member_since' => "Miembro desde:",
    'change_language' => "Cambiar idioma"
],
'de' => [
    'welcome' => "Willkommen zu Ihrem Green Thumb Dashboard!",
    'benefits' => "Ihre Green Thumb Vorteile:",
    'monthly_articles' => "Exklusive monatliche Artikel & Leitfäden",
    'plant_care' => "Personalisierte Pflanzenpflege-Erinnerungen",
    'ai_expert' => "Frag den Experten (KI)",
    'ai_planning' => "KI-Gartenplanung",
    'community' => "Community-Forum Zugang",
    'journal' => "Pflanzenjournal",
    'beginners_corner' => "Ecke für Anfänger",
    'no_articles' => "Noch keine Anfänger-Artikel in Ihrer Sprache verfügbar.",
    'logout' => "Abmelden",
    'profile' => "Ihr Profil",
    'quick_links' => "Schnellzugriff",
    'forum' => "Community-Forum",
    'journal_link' => "Pflanzenjournal",
    'activity' => "Letzte Aktivität",
    'help' => "Brauchst du Hilfe?",
    'about' => "Über diese Seite",
    'membership_type' => "Mitgliedschaftsstufe",
    'cancel_subscription' => "Abo kündigen",
    'are_you_sure' => "Sind Sie sicher, dass Sie Ihr Abonnement kündigen möchten?",
    'yes_cancel' => "Ja, kündigen",
    'no_keep' => "Nein, behalten",
    'achievements' => "Errungenschaften & Abzeichen",
    'no_badges' => "Noch keine Abzeichen verdient. Nimm teil, um dein erstes Abzeichen zu erhalten!",
    'member_since' => "Mitglied seit:",
    'change_language' => "Sprache ändern"
],
'el' => [
    'welcome' => "Καλώς ήρθατε στον πίνακα Green Thumb!",
    'benefits' => "Τα οφέλη σας Green Thumb:",
    'monthly_articles' => "Αποκλειστικά μηνιαία άρθρα & οδηγοί",
    'plant_care' => "Εξατομικευμένες υπενθυμίσεις φροντίδας φυτών",
    'ai_expert' => "Ρωτήστε τον ειδικό (AI)",
    'ai_planning' => "AI σχεδιασμός κήπου",
    'community' => "Πρόσβαση στο φόρουμ κοινότητας",
    'journal' => "Ημερολόγιο φυτών",
    'beginners_corner' => "Γωνιά αρχαρίων",
    'no_articles' => "Δεν υπάρχουν διαθέσιμα άρθρα για αρχάριους στη γλώσσα σας ακόμα.",
    'logout' => "Αποσύνδεση",
    'profile' => "Το προφίλ σας",
    'quick_links' => "Γρήγοροι σύνδεσμοι",
    'forum' => "Φόρουμ κοινότητας",
    'journal_link' => "Ημερολόγιο φυτών",
    'activity' => "Πρόσφατη δραστηριότητα",
    'help' => "Χρειάζεστε βοήθεια;",
    'about' => "Σχετικά με αυτόν τον ιστότοπο",
    'membership_type' => "Επίπεδο συνδρομής",
    'cancel_subscription' => "Ακύρωση συνδρομής",
    'are_you_sure' => "Είστε σίγουροι ότι θέλετε να ακυρώσετε τη συνδρομή σας;",
    'yes_cancel' => "Ναι, ακύρωσέ το",
    'no_keep' => "Όχι, διατήρησέ το",
    'achievements' => "Διακρίσεις & Σήματα",
    'no_badges' => "Δεν έχετε κερδίσει ακόμη κάποιο σήμα. Συμμετέχετε για να κερδίσετε το πρώτο σας!",
    'member_since' => "Μέλος από:",
    'change_language' => "Αλλαγή γλώσσας"
],
'ru' => [
    'welcome' => "Добро пожаловать в ваш Green Thumb Dashboard!",
    'benefits' => "Ваши преимущества Green Thumb:",
    'monthly_articles' => "Эксклюзивные ежемесячные статьи и руководства",
    'plant_care' => "Персонализированные напоминания по уходу за растениями",
    'ai_expert' => "Спросить эксперта (ИИ)",
    'ai_planning' => "ИИ-планирование сада",
    'community' => "Доступ к форуму сообщества",
    'journal' => "Дневник растений",
    'beginners_corner' => "Уголок новичка",
    'no_articles' => "Пока нет статей для новичков на вашем языке.",
    'logout' => "Выйти",
    'profile' => "Ваш профиль",
    'quick_links' => "Быстрые ссылки",
    'forum' => "Форум сообщества",
    'journal_link' => "Дневник растений",
    'activity' => "Недавняя активность",
    'help' => "Нужна помощь?",
    'about' => "О сайте",
    'membership_type' => "Уровень членства",
    'cancel_subscription' => "Отменить подписку",
    'are_you_sure' => "Вы уверены, что хотите отменить подписку?",
    'yes_cancel' => "Да, отменить",
    'no_keep' => "Нет, оставить",
    'achievements' => "Достижения и значки",
    'no_badges' => "Пока нет заработанных значков. Участвуйте, чтобы получить свой первый значок!",
    'member_since' => "Участник с:",
    'change_language' => "Сменить язык"
],
'ar' => [
    'welcome' => "مرحبًا بك في لوحة التحكم Green Thumb!",
    'benefits' => "مزايا Green Thumb الخاصة بك:",
    'monthly_articles' => "مقالات ودلائل شهرية حصرية",
    'plant_care' => "تذكيرات العناية بالنباتات المخصصة",
    'ai_expert' => "اسأل الخبير (الذكاء الاصطناعي)",
    'ai_planning' => "تخطيط الحديقة بالذكاء الاصطناعي",
    'community' => "الوصول إلى منتدى المجتمع",
    'journal' => "مفكرة النباتات",
    'beginners_corner' => "ركن المبتدئين",
    'no_articles' => "لا توجد مقالات للمبتدئين متوفرة بلغتك حتى الآن.",
    'logout' => "تسجيل الخروج",
    'profile' => "ملفك الشخصي",
    'quick_links' => "روابط سريعة",
    'forum' => "منتدى المجتمع",
    'journal_link' => "مفكرة النباتات",
    'activity' => "النشاط الأخير",
    'help' => "هل تحتاج مساعدة؟",
    'about' => "عن هذا الموقع",
    'membership_type' => "مستوى العضوية",
    'cancel_subscription' => "إلغاء الاشتراك",
    'are_you_sure' => "هل أنت متأكد أنك تريد إلغاء اشتراكك؟",
    'yes_cancel' => "نعم، إلغِه",
    'no_keep' => "لا، احتفظ بالاشتراك",
    'achievements' => "الإنجازات والشارات",
    'no_badges' => "لم تحصل على أي شارات بعد. شارك لتحصل على أول شارة لك!",
    'member_since' => "عضو منذ:",
    'change_language' => "تغيير اللغة"
]
];

// Connect to DB and fetch data
$error = '';
try {
    // Fetch articles
    $stmt = $pdo->prepare("SELECT title, content, created_at FROM beginners_corner WHERE language = ? AND is_active = 1 ORDER BY created_at DESC");
    $stmt->execute([$user_language]);
    $articles = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Fetch recent activity
    $activity_stmt = $pdo->prepare("SELECT action, details, ts FROM user_activity WHERE user_id = ? ORDER BY ts DESC LIMIT 5");
    $activity_stmt->execute([$_SESSION['user_id']]);
    $recent_activity = $activity_stmt->fetchAll(PDO::FETCH_ASSOC);

    // Fetch profile
    $profile_stmt = $pdo->prepare("SELECT username, email, join_date, membership_type, membership_start, avatar_url FROM users WHERE id = ?");
    $profile_stmt->execute([$_SESSION['user_id']]);
    $profile = $profile_stmt->fetch(PDO::FETCH_ASSOC);

    // --- AI Analyses this month ---
    $current_year = date('Y');
    $current_month = date('m');
    $month_start = "$current_year-$current_month-01";
    $month_end = date('Y-m-t'); // Last day of month

    $ai_count_stmt = $pdo->prepare(
        "SELECT COUNT(*) FROM plant_analyses WHERE user_id = ? AND analysis_date >= ? AND analysis_date <= ?"
    );
    $ai_count_stmt->execute([$_SESSION['user_id'], $month_start, $month_end]);
    $ai_analyses_this_month = $ai_count_stmt->fetchColumn();

    // Fetch badges
    $badge_stmt = $pdo->prepare("SELECT name, description, icon FROM user_badges WHERE user_id = ?");
    $badge_stmt->execute([$_SESSION['user_id']]);
    $badges = $badge_stmt->fetchAll(PDO::FETCH_ASSOC);

} catch (Exception $e) {
    $articles = [];
    $recent_activity = [];
    $profile = [];
    $badges = [];
    $ai_analyses_this_month = 0; // Always set a default value!
    $error = "Database error: " . $e->getMessage();
}
?>

<!DOCTYPE html>
<html lang="<?php echo htmlspecialchars($user_language); ?>">
<head>
    <meta charset="UTF-8">
    <title>Green Thumb Member Dashboard</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/png" href="favicon.png">
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
        .feature-card:hover {
            box-shadow: 0 6px 24px rgba(16,185,129,0.18);
        }
        .green-badge {
            background: linear-gradient(90deg, #22c55e 0%, #16a34a 100%);
            color: white;
            padding: 0.5rem 1.25rem;
            border-radius: 9999px;
            font-weight: bold;
            font-size: 1rem;
            box-shadow: 0 2px 8px rgba(34,197,94,0.12);
            letter-spacing: 0.03em;
            display: inline-block;
            margin-bottom: 1.5rem;
        }
    </style>
</head>
<body class="min-h-screen flex flex-col items-center justify-start">

<!-- Modern Navigation Bar -->
<nav class="w-full bg-white border-b border-green-100 shadow-sm sticky top-0 z-30 mb-2">
    <div class="max-w-5xl mx-auto flex gap-6 items-center py-2 px-4">
        <img src="favicon.png" alt="Green Thumb" class="h-8 w-8 rounded-full">
        <a href="/home.php" class="text-green-700 font-bold hover:underline">Home</a>
        <a href="/green_thumb_members_dashboard.php" class="text-green-700 font-bold hover:underline">Dashboard</a>
        <a href="/journal.php" class="text-green-700 font-bold hover:underline">Journal</a>
        <a href="/articles.php" class="text-green-700 font-bold hover:underline"><?php echo $translations[$user_language]['beginners_corner'] ?? "Beginner's Corner"; ?></a>
        <button onclick="window.history.back()" class="ml-auto bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">Go Back</button>
        <form method="post" action="logout.php" class="ml-4">
            <button type="submit" class="bg-gray-700 hover:bg-gray-900 text-white px-4 py-2 rounded-lg font-semibold transition-colors"><?php echo $translations[$user_language]['logout'] ?? 'Logout'; ?></button>
        </form>
    </div>
</nav>
<main class="w-full max-w-3xl mx-auto mt-6 p-0 sm:px-6">

    <!-- HERO: Welcome + Green Thumb Badge + Quick Stats -->
    <section class="bg-white rounded-2xl shadow-md px-6 py-8 mb-8 text-center relative">
        <div class="green-badge flex items-center justify-center gap-2 mx-auto mb-2">
            <i data-lucide="leaf" class="inline h-6 w-6 text-white"></i>
            Green Thumb Member
        </div>
        <h1 class="text-3xl sm:text-4xl font-bold text-green-800 mb-2">
            <?php echo $translations[$user_language]['welcome'] ?? 'Welcome to your Green Thumb Dashboard!'; ?>
        </h1>
        <p class="text-lg text-green-600 mb-4">You’ve unlocked the full power of Garden with Serge.</p>
        <p class="text-gray-700 mb-4">Enjoy unlimited AI plant analyses, exclusive content, advanced tools, and premium support—everything you need to grow your best garden ever.</p>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 justify-center mt-4">
            <div class="bg-green-50 rounded-lg p-4 flex flex-col items-center">
                <i data-lucide="camera" class="h-7 w-7 text-green-600 mb-1"></i>
                <span class="text-green-900 font-bold text-xl"><?php echo (int)$ai_analyses_this_month; ?></span>
                <span class="text-green-800 text-sm">AI Analyses this month</span>
            </div>
            <div class="bg-yellow-50 rounded-lg p-4 flex flex-col items-center">
                <i data-lucide="star" class="h-7 w-7 text-yellow-500 mb-1"></i>
                <span class="text-green-900 font-bold text-xl"><?php echo count($badges); ?></span>
                <span class="text-yellow-800 text-sm">Badges earned</span>
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
        </div>
    </section>
	    <!-- ACTION CARDS: Quick Access to Premium Features -->
    <section class="mb-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
      <a href="#ai-plant-doctor-anchor" class="feature-card px-6 py-6 flex flex-col items-center hover:shadow-xl transition">
        <i data-lucide="camera" class="h-10 w-10 text-green-600 mb-3"></i>
        <span class="font-semibold text-lg text-green-800 mb-1">AI Plant Doctor</span>
        <span class="text-green-700 text-sm text-center">Unlimited analyses, instant results</span>
      </a>
      <a href="calendar.php" class="feature-card px-6 py-6 flex flex-col items-center hover:shadow-xl transition">
        <i data-lucide="calendar" class="h-10 w-10 text-yellow-600 mb-3"></i>
        <span class="font-semibold text-lg text-green-800 mb-1">Personalized Garden Calendar</span>
        <span class="text-green-700 text-sm text-center">Seasonal tasks tailored for you</span>
      </a>
      <a href="premium-guides.php" class="feature-card px-6 py-6 flex flex-col items-center hover:shadow-xl transition">
        <i data-lucide="book-open" class="h-10 w-10 text-blue-600 mb-3"></i>
        <span class="font-semibold text-lg text-green-800 mb-1">Exclusive Guides & Videos</span>
        <span class="text-green-700 text-sm text-center">Member-only tutorials and tips</span>
      </a>
      <a href="support.php" class="feature-card px-6 py-6 flex flex-col items-center hover:shadow-xl transition">
        <i data-lucide="help-circle" class="h-10 w-10 text-purple-600 mb-3"></i>
        <span class="font-semibold text-lg text-green-800 mb-1">Priority Support</span>
        <span class="text-green-700 text-sm text-center">Expert answers, faster help</span>
      </a>
    </section>

    <!-- Profile Block -->
    <section class="flex flex-col md:flex-row items-start md:items-center justify-between bg-green-50 rounded-lg p-6 mb-4 shadow">
        <div class="flex items-center space-x-4">
            <!-- Avatar -->
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
                    <span class="inline-block px-2 py-1 bg-green-200 text-green-900 rounded font-semibold">
                        <?php echo htmlspecialchars($profile['membership_type'] ?? $membership_type); ?>
                    </span>
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
                        <?php echo $language_flags[$code] . ' ' . $langName; ?>
                    </option>
                <?php endforeach; ?>
            </select>
            <button type="submit"
                    class="ml-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                    aria-label="<?php echo htmlspecialchars($translations[$user_language]['change_language'] ?? 'Change Language'); ?>">
                <?php echo $translations[$user_language]['change_language'] ?? 'Change Language'; ?>
            </button>
        </form>
    </section>

<!-- AI Analyses This Month Block -->
<div class="flex flex-col sm:flex-row gap-4 mb-4">
    <div class="flex-1 rounded-lg bg-green-50 p-4 shadow flex flex-col items-center">
        <div class="text-3xl font-bold text-green-700 mb-1">
            <?php echo (int)$ai_analyses_this_month; ?>
        </div>
        <div class="text-gray-700 text-sm">
            AI Analyses this month
        </div>
    </div>
</div>
    <!-- Green Thumb Benefits, visually enhanced -->
    <section class="rounded-lg bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 shadow">
        <div class="font-semibold mb-2 text-yellow-800 text-lg"><?php echo $translations[$user_language]['benefits'] ?? 'Your Green Thumb Benefits'; ?></div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="flex items-start gap-3">
                <i data-lucide="infinity" class="h-6 w-6 text-green-600 mt-1"></i>
                <div>
                    <strong>Unlimited AI Plant Analyses</strong><br>
                    No daily limits—run as many plant diagnoses as you need.
                </div>
            </div>
            <div class="flex items-start gap-3">
                <i data-lucide="stethoscope" class="h-6 w-6 text-purple-600 mt-1"></i>
                <div>
                    <strong>Advanced Disease Identification</strong><br>
                    Get detailed reports, care plans, and prevention tips.
                </div>
            </div>
            <div class="flex items-start gap-3">
                <i data-lucide="calendar" class="h-6 w-6 text-yellow-600 mt-1"></i>
                <div>
                    <strong>Personalized Garden Calendar</strong><br>
                    See seasonal tasks and reminders tailored to your region.
                </div>
            </div>
            <div class="flex items-start gap-3">
                <i data-lucide="book-open" class="h-6 w-6 text-blue-600 mt-1"></i>
                <div>
                    <strong>Exclusive Content</strong><br>
                    Access premium guides, videos, and resources.
                </div>
            </div>
            <div class="flex items-start gap-3">
                <i data-lucide="users" class="h-6 w-6 text-pink-600 mt-1"></i>
                <div>
                    <strong>Green Thumb Community</strong><br>
                    Join private forums and connect with other top gardeners.
                </div>
            </div>
            <div class="flex items-start gap-3">
                <i data-lucide="star" class="h-6 w-6 text-orange-500 mt-1"></i>
                <div>
                    <strong>Priority Support</strong><br>
                    Get faster replies and personal help from Serge and the team.
                </div>
            </div>
            <div class="flex items-start gap-3">
                <i data-lucide="gift" class="h-6 w-6 text-green-500 mt-1"></i>
                <div>
                    <strong>Discounts & Early Access</strong><br>
                    Save on gardening products and be the first to try new features.
                </div>
            </div>
        </div>
    </section>
	    <!-- Achievements & Badges -->
    <section class="rounded-lg bg-blue-50 p-4 mb-4 shadow">
        <div class="font-semibold text-blue-800 mb-2">
            <?php echo $translations[$user_language]['achievements'] ?? 'Achievements & Badges'; ?>
        </div>
        <?php if ($badges): ?>
            <div class="flex flex-wrap gap-6">
            <?php foreach ($badges as $badge): ?>
                <div class="flex flex-col items-center justify-center">
                    <?php if (!empty($badge['icon'])): ?>
                        <img src="<?php echo htmlspecialchars($badge['icon']); ?>" alt="<?php echo htmlspecialchars($badge['name']); ?>" class="w-10 h-10 mb-1">
                    <?php endif; ?>
                    <span class="font-bold"><?php echo htmlspecialchars($badge['name']); ?></span>
                    <span class="text-xs text-gray-600"><?php echo htmlspecialchars($badge['description']); ?></span>
                </div>
            <?php endforeach; ?>
            </div>
        <?php else: ?>
            <div class="text-gray-500 italic">
                <?php echo $translations[$user_language]['no_badges'] ?? 'No badges earned yet. Participate to earn your first badge!'; ?>
            </div>
        <?php endif; ?>
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
            <li>
                <a href="journal.php" class="hover:underline">
                    <?php echo $translations[$user_language]['journal_link'] ?? 'Plant Journal'; ?>
                </a>
            </li>
            <li>
                <a href="articles.php" class="hover:underline">
                    <?php echo $translations[$user_language]['beginners_corner'] ?? "Beginner's Corner"; ?>
                </a>
            </li>
            <li>
                <a href="plants.php" class="hover:underline">🌱 My Plants</a>
            </li>
        </ul>
    </section>

    <!-- Recent Activity -->
    <section class="rounded-lg bg-purple-50 p-4 mb-4 shadow">
        <div class="font-semibold text-purple-800 mb-2"><?php echo $translations[$user_language]['activity'] ?? 'Recent Activity'; ?></div>
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

    <!-- Beginner's Corner Articles -->
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
                    <div class="font-bold text-green-700"><?php echo htmlspecialchars($article['title']); ?></div>
                    <div class="text-gray-700 mb-1"><?php echo nl2br(htmlspecialchars($article['content'])); ?></div>
                    <div class="text-xs text-gray-400">Published: <?php echo $article['created_at']; ?></div>
                </div>
            <?php endforeach; ?>
        <?php else: ?>
            <div class="text-gray-500 italic"><?php echo $translations[$user_language]['no_articles'] ?? $translations['en']['no_articles']; ?></div>
        <?php endif; ?>
    </section>

    <!-- Referral Banner (optional) -->
    <section class="bg-white rounded-2xl shadow-md p-6 text-center mb-8">
      <h3 class="text-xl font-bold text-green-800 mb-2">Refer a Friend, Grow Together!</h3>
      <p class="text-green-700 mb-4">Invite a friend and you both get a free month of Green Thumb membership.</p>
      <a href="refer.php" class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">Refer Now</a>
    </section>
    <?php include 'plant_doctor_component.php'; ?>

    <!-- Help/About Section -->
    <section class="rounded-lg bg-yellow-100 p-4 mb-6 shadow flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
            <div class="font-semibold text-yellow-900 mb-1"><?php echo $translations[$user_language]['help'] ?? 'Need Help?'; ?></div>
            <p class="text-yellow-800">
                <?php echo $translations[$user_language]['help'] ?? 'Need Help?'; ?>
                <?php echo $translations[$user_language]['about'] ?? 'About This Site'; ?>
                If you need assistance, please visit our <a href="help.php" class="underline">Help Center</a>
                or <a href="contact.php" class="underline">contact us</a>.
            </p>
        </div>
        <div class="mt-3 sm:mt-0">
            <button onclick="showCancelModal()" class="border border-gray-400 text-gray-600 bg-white px-2 py-1 rounded hover:bg-gray-100 transition-colors text-sm" aria-label="Cancel Subscription">
                <?php echo $translations[$user_language]['cancel_subscription'] ?? 'Cancel Subscription'; ?>
            </button>
        </div>
    </section>
    <section class="rounded-lg bg-gray-100 p-4 shadow mb-8">
        <div class="font-semibold text-gray-800 mb-1"><?php echo $translations[$user_language]['about'] ?? 'About This Site'; ?></div>
        <p class="text-gray-700">Your Green Thumb membership unlocks advanced AI features and exclusive resources. Connect, learn, and grow with our community!</p>
    </section>
</main>

<!-- Cancel Modal -->
<div id="cancelModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 hidden">
    <div class="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center">
        <div class="text-lg font-bold text-red-600 mb-3">
            <?php echo $translations[$user_language]['are_you_sure'] ?? 'Are you sure you want to cancel your subscription?'; ?>
        </div>
        <button onclick="confirmCancel()" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors mr-2"><?php echo $translations[$user_language]['yes_cancel'] ?? 'Yes, cancel it'; ?></button>
        <button onclick="hideCancelModal()" class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"><?php echo $translations[$user_language]['no_keep'] ?? 'No, keep my subscription'; ?></button>
    </div>
</div>
<script>
    document.addEventListener('DOMContentLoaded', function() {
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    });
    function showCancelModal() {
        document.getElementById('cancelModal').classList.remove('hidden');
    }
    function hideCancelModal() {
        document.getElementById('cancelModal').classList.add('hidden');
    }
    function confirmCancel() {
        hideCancelModal();
        alert('Subscription cancellation is not yet implemented. Please contact support if you need to cancel.');
    }
</script>
<script>
  window.membershipType = "<?php echo htmlspecialchars($membership_type); ?>";
</script>
<script src="translations.js"></script>
<script src="app.js"></script>
</body>
</html>