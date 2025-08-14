<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
session_start();
$_SESSION['membership_type'] = 'green_thumb'; // For testing only
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
    'en' => 'English',
    'fr' => 'Français',
    'de' => 'Deutsch',
    'el' => 'Ελληνικά',
    'ru' => 'Русский',
    'ar' => 'العربية',
    'es' => 'Español'
];
$language_flags = [
    'en' => '🇺🇸',
    'fr' => '🇫🇷',
    'de' => '🇩🇪',
    'el' => '🇬🇷',
    'ru' => '🇷🇺',
    'ar' => '🇸🇦',
    'es' => '🇪🇸'
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

// Connect to DB
try {
    $pdo = new PDO(DB_DSN, DB_USER, DB_PASS);

    // Fetch active Beginner's Corner articles for user's language
    $stmt = $pdo->prepare("SELECT title, content, created_at FROM beginners_corner WHERE language = ? AND is_active = 1 ORDER BY created_at DESC");
    $stmt->execute([$user_language]);
    $articles = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Fetch recent activity
    $activity_stmt = $pdo->prepare("SELECT action, details, ts FROM user_activity WHERE user_id = ? ORDER BY ts DESC LIMIT 5");
    $activity_stmt->execute([$_SESSION['user_id']]);
    $recent_activity = $activity_stmt->fetchAll(PDO::FETCH_ASSOC);

    // Fetch user profile info (with avatar and membership_start)
    $profile_stmt = $pdo->prepare("SELECT username, email, join_date, membership_type, membership_start, avatar_url FROM users WHERE id = ?");
    $profile_stmt->execute([$_SESSION['user_id']]);
    $profile = $profile_stmt->fetch(PDO::FETCH_ASSOC);

} catch (Exception $e) {
    $articles = [];
    $recent_activity = [];
    $profile = [];
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
    <style>body { background: #F5F5DC; }</style>
</head>
<body class="min-h-screen flex flex-col items-center justify-start bg-[#F5F5DC]">
    <!-- Navigation Bar Start -->
    <nav style="background:#fff; border-bottom:1px solid #d1fae5; padding:1em 0; margin-bottom:2em;">
        <div style="max-width:700px; margin:0 auto; display:flex; gap:2em; align-items:center;">
            <a href="/home.php" style="color:#16a34a; font-weight:bold; text-decoration:none;">Home</a>
            <a href="/green_thumb_members_dashboard.php" style="color:#16a34a; font-weight:bold; text-decoration:none;">Dashboard</a>
            <a href="/journal.php" style="color:#16a34a; font-weight:bold; text-decoration:none;">Journal</a>
            <button onclick="window.history.back()" style="background:#22c55e; color:#fff; border:none; border-radius:0.5em; padding:0.3em 1em; cursor:pointer;">Go Back</button>
        </div>
    </nav>
    <!-- Navigation Bar End -->
    <div class="w-full max-w-3xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-lg">
        <!-- Welcome/Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-green-800 mb-2 sm:mb-0">
                <?php echo ($translations[$user_language]['welcome'] ?? $translations['en']['welcome']); ?>
            </h2>
            <div class="flex space-x-2">
                <form method="post" class="inline" action="logout.php" style="display:inline;">
                    <button type="submit" class="bg-gray-700 hover:bg-gray-900 text-white px-4 py-2 rounded-lg font-semibold transition-colors mr-2" aria-label="Logout">
                        <?php echo $translations[$user_language]['logout'] ?? 'Logout'; ?>
                    </button>
                </form>
            </div>
        </div>
        <?php if (!empty($language_update_message)): ?>
            <div class="mb-4 text-green-700 text-center font-semibold"><?php echo $language_update_message; ?></div>
        <?php endif; ?>

        <!-- Profile Block -->
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between bg-green-50 rounded-lg p-6 mb-4 shadow">
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
                            $membership_since = $profile['membership_start'] ?? $profile['join_date'] ?? ($_SESSION['join_date'] ?? '');
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
        </div>

        <!-- Green Thumb Benefits -->
        <div class="rounded-lg bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <div class="font-semibold mb-2 text-yellow-800"><?php echo $translations[$user_language]['benefits'] ?? 'Your Green Thumb Benefits'; ?></div>
            <ul class="list-disc list-inside text-gray-700">
                <li><?php echo $translations[$user_language]['monthly_articles'] ?? 'Exclusive Monthly Articles & Guides'; ?></li>
                <li><?php echo $translations[$user_language]['plant_care'] ?? 'Personalized plant care reminders'; ?></li>
                <li><?php echo $translations[$user_language]['ai_expert'] ?? 'Ask the Expert (AI)'; ?></li>
                <li><?php echo $translations[$user_language]['ai_planning'] ?? 'AI Garden Planning'; ?></li>
                <li><?php echo $translations[$user_language]['community'] ?? 'Community forum access'; ?></li>
                <li><?php echo $translations[$user_language]['journal'] ?? 'Plant journal'; ?></li>
            </ul>
        </div>

        <!-- Achievements & Badges -->
        <div class="rounded-lg bg-blue-50 p-4 mb-4 shadow">
            <div class="font-semibold text-blue-800 mb-2">
                <?php echo $translations[$user_language]['achievements'] ?? 'Achievements & Badges'; ?>
            </div>
            <?php
            $badge_stmt = $pdo->prepare("SELECT name, description, icon FROM user_badges WHERE user_id = ?");
            $badge_stmt->execute([$_SESSION['user_id']]);
            $badges = $badge_stmt->fetchAll(PDO::FETCH_ASSOC);

            if ($badges) {
                echo '<div class="flex flex-wrap gap-6">';
                foreach ($badges as $badge) {
                    echo '<div class="flex flex-col items-center justify-center">';
                    if (!empty($badge['icon'])) {
                        echo '<img src="' . htmlspecialchars($badge['icon']) . '" alt="' . htmlspecialchars($badge['name']) . '" class="w-10 h-10 mb-1">';
                    }
                    echo '<span class="font-bold">' . htmlspecialchars($badge['name']) . '</span>';
                    echo '<span class="text-xs text-gray-600">' . htmlspecialchars($badge['description']) . '</span>';
                    echo '</div>';
                }
                echo '</div>';
            } else {
                echo '<div class="text-gray-500 italic">';
                echo $translations[$user_language]['no_badges'] ?? 'No badges earned yet. Participate to earn your first badge!';
                echo '</div>';
            }
            ?>
        </div>

      <!-- Quick Links -->
<div class="rounded-lg bg-green-50 p-4 mb-4 shadow">
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
            <a href="plants.php" class="hover:underline">
                🌱 My Plants
            </a>
        </li>
    </ul>
</div>

        <!-- Activity -->
        <div class="rounded-lg bg-purple-50 p-4 mb-4 shadow">
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
        </div>

        <!-- Beginner's Corner Articles -->
        <div class="rounded-lg bg-white border border-green-200 p-4 mb-4 shadow">
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
        </div>

        <!-- Help/About Section -->
        <div class="rounded-lg bg-yellow-100 p-4 mb-6 shadow flex flex-col sm:flex-row sm:items-center sm:justify-between">
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
        </div>
        <div class="rounded-lg bg-gray-100 p-4 shadow">
            <div class="font-semibold text-gray-800 mb-1"><?php echo $translations[$user_language]['about'] ?? 'About This Site'; ?></div>
            <p class="text-gray-700">Your Green Thumb membership unlocks advanced AI features and exclusive resources. Connect, learn, and grow with our community!</p>
        </div>
    </div>

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
</body>
</html>