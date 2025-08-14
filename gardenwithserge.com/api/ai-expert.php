<?php
// Receives POST {question: "..."}
$q = json_decode(file_get_contents('php://input'), true)['question'] ?? '';
$openai_api_key = trim(@file_get_contents(__DIR__ . '/../../garden/openai_gws.key'));
$openai_api_key = preg_replace('/[^\x21-\x7E]/','',$openai_api_key);
$curl = curl_init();
curl_setopt_array($curl, [
    CURLOPT_URL => "https://api.openai.com/v1/chat/completions",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => [
        "Authorization: Bearer $openai_api_key",
        "Content-Type: application/json"
    ],
    CURLOPT_POSTFIELDS => json_encode([
        "model" => "gpt-4", // Or your preferred model
        "messages" => [["role"=>"user", "content"=>$q]],
        "max_tokens" => 400
    ])
]);
$response = curl_exec($curl);
curl_close($curl);
$data = json_decode($response, true);
echo json_encode(['answer'=>$data['choices'][0]['message']['content'] ?? 'No response.']);
?>