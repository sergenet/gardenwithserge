<?php
require_once 'db_config.php';

// SET YOUR OPENAI API KEY HERE
$OPENAI_API_KEY = trim(@file_get_contents(__DIR__ . '/../../garden/openai_gws.key'));
$OPENAI_API_KEY = preg_replace('/[^\x21-\x7E]/','',$OPENAI_API_KEY);

// ======= FUNCTION TO GENERATE CONTENT =======
function generate_gardening_article($api_key) {
    $prompt = "Write a 200-word beginner-friendly gardening tip or guide for the weekly Beginner's Corner. Use a helpful, friendly tone and focus on practical advice for new gardeners.";
    $postData = [
        'model' => 'gpt-3.5-turbo',
        'messages' => [
            ['role' => 'system', 'content' => 'You are a gardening expert writing for beginners.'],
            ['role' => 'user', 'content' => $prompt]
        ],
        'max_tokens' => 350,
        'temperature' => 0.8
    ];

    $ch = curl_init('https://api.openai.com/v1/chat/completions');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $api_key
    ]);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($postData));

    $response = curl_exec($ch);
    curl_close($ch);

    $data = json_decode($response, true);
    if (isset($data['choices'][0]['message']['content'])) {
        return $data['choices'][0]['message']['content'];
    } else {
        return false;
    }
}

// ======= MAIN LOGIC =======
try {
    $pdo = new PDO(DB_DSN, DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Only add a new article if none exists this week
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM beginners_corner WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)");
    $stmt->execute();
    if ($stmt->fetchColumn() == 0) {
        $content = generate_gardening_article($OPENAI_API_KEY);
        if ($content) {
            $title = "Weekly Gardening Tip for Beginners";
            $language = 'en';
            $insert = $pdo->prepare("INSERT INTO beginners_corner (title, content, language, is_active, created_at) VALUES (?, ?, ?, 1, NOW())");
            $insert->execute([$title, $content, $language]);
            echo "Added new AI-generated article.\n";
        } else {
            echo "OpenAI error: Could not generate content.\n";
        }
    } else {
        echo "Already added an article this week.\n";
    }
} catch(Exception $e) {
    echo "Database or API error: " . $e->getMessage() . "\n";
}
?>