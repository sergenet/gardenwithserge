<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['image'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Image data required']);
    exit;
}

$image_data = $input['image'];
$language = isset($input['language']) ? $input['language'] : 'en';

// Language-specific prompts
$prompts = [
    'en' => 'Analyze this plant image for diseases, pests, or health issues. Provide specific diagnosis and treatment recommendations in a clear, helpful format.',
    'es' => 'Analiza esta imagen de planta para enfermedades, plagas o problemas de salud. Proporciona diagnóstico específico y recomendaciones de tratamiento en formato claro y útil. Responde en español.',
    'fr' => 'Analysez cette image de plante pour les maladies, les parasites ou les problèmes de santé. Fournissez un diagnostic spécifique et des recommandations de traitement dans un format clair et utile. Répondez en français.',
    'el' => 'Αναλύστε αυτή την εικόνα φυτού για ασθένειες, παράσιτα ή προβλήματα υγείας. Παρέχετε συγκεκριμένη διάγνωση και συστάσεις θεραπείας σε σαφή και χρήσιμη μορφή. Απαντήστε στα ελληνικά.'
];

$prompt_text = isset($prompts[$language]) ? $prompts[$language] : $prompts['en'];
$openai_api_key = '***REMOVED***GJ4gxsPs7bAHyy2cMl6TIdXmywZnKAyngMvZ-mo-j1ghZJAwPfZ0qDZMt1k8wF4RRZIrn7gqywT3BlbkFJIVRmW-6JjDs0EltZzQsUlPnV58EQ4i5-2URMSffHRRA1ukt_4XdGjqzqq718a8EDB67qDRw_sA';

$payload = json_encode([
    'model' => 'gpt-4o',
    'messages' => [[
        'role' => 'user',
        'content' => [
            [
                'type' => 'text',
                'text' => $prompt_text
            ],
            [
                'type' => 'image_url',
                'image_url' => [
                    'url' => 'data:image/jpeg;base64,' . $image_data
                ]
            ]
        ]
    ]],
    'max_tokens' => 500
]);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://api.openai.com/v1/chat/completions');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $openai_api_key
]);

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($http_code !== 200) {
    echo json_encode(['success' => false, 'message' => 'OpenAI API error']);
    exit;
}

$response_data = json_decode($response, true);

if (!isset($response_data['choices'][0]['message']['content'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid API response']);
    exit;
}

echo json_encode([
    'success' => true,
    'diagnosis' => $response_data['choices'][0]['message']['content']
]);
?>