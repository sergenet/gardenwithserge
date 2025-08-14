<?php
// backend/plant-identify.php — uses ../../garden for autoload + .env

error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);
ini_set('display_errors', 0);

// --- quick ping/diag (no AI call) ---
if (isset($_GET['ping'])) { header('Content-Type:text/plain'); echo 'ok'; exit; }

function json_out($obj, $code = 200) {
  http_response_code($code);
  header('Content-Type: application/json');
  echo json_encode($obj);
  exit;
}

// Load Composer + .env from /home/sergbcqk/garden  (two levels up from /backend)
require __DIR__ . '/../../garden/vendor/autoload.php';
if (class_exists('Dotenv\Dotenv')) {
  $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../garden');
  $dotenv->safeLoad();
}
$OPENAI = trim(getenv('OPENAI_API_KEY_GWS') ?: getenv('OPENAI_API_KEY') ?: '');
$OPENAI = trim($OPENAI);
$OPENAI = preg_replace('/[^\x21-\x7E]/', '', $OPENAI);

// TEMPORARY: mock mode to keep the site working without credits
if (true) {

  json_out([
    'plantName'      => 'Tomato',
    'scientificName' => 'Solanum lycopersicum',
    'confidence'     => 0.85
  ], 200);
}

// --- quick OpenAI key check (no image, minimal cost)
if (isset($_GET['check']) && $_GET['check'] === 'openai') {
  $ch = curl_init('https://api.openai.com/v1/models');
  curl_setopt_array($ch, [
    CURLOPT_HTTPHEADER     => ['Authorization: Bearer ' . $OPENAI],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT        => 20,
  ]);
  $resp = curl_exec($ch);
  $err  = curl_error($ch);
  $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
  curl_close($ch);

  header('Content-Type: application/json');
  echo json_encode([
    'status'       => $code,
    'err'          => $err ?: null,
    'body_snippet' => is_string($resp) ? substr($resp, 0, 180) : null,
  ]);
  exit;
}

if (isset($_GET['diag'])) {
  json_out([
    'env_ok'     => (bool)$OPENAI,
    'vendor_ok'  => file_exists(__DIR__ . '/../../garden/vendor/autoload.php'),
    'using_path' => realpath(__DIR__ . '/../../garden') ?: 'n/a',
  ], 200);
}

if (!$OPENAI) {
  json_out(['error' => 'NO_OPENAI_KEY'], 500);
}

// --- helpers ---
function get_mime($path) {
  if (function_exists('mime_content_type')) {
    $m = @mime_content_type($path); if ($m) return $m;
  }
  $f = @finfo_open(FILEINFO_MIME_TYPE);
  if ($f) { $m = @finfo_file($f, $path); @finfo_close($f); if ($m) return $m; }
  return 'image/jpeg';
}

function data_url_from_upload() {
  if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) return null;
  $tmp  = $_FILES['image']['tmp_name'];
  $mime = get_mime($tmp);
  $b64  = base64_encode(file_get_contents($tmp));
  return "data:$mime;base64,$b64";
}

function extract_json($s) {
  if (!$s) return null;
  $j = json_decode($s, true);
  if (is_array($j)) return $j;
  if (preg_match('/\{.*\}/s', $s, $m)) {
    $j = json_decode($m[0], true);
    if (is_array($j)) return $j;
  }
  return null;
}

// --- only POST accepts work ---
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  json_out(['error' => 'USE_POST'], 405);
}

// Accept multipart "image" or JSON {imageData} / {image_url}
$ctype = $_SERVER['CONTENT_TYPE'] ?? '';
$body  = (stripos($ctype, 'application/json') !== false)
  ? (json_decode(file_get_contents('php://input'), true) ?: [])
  : [];

$dataUrl = data_url_from_upload()
        ?: ($body['imageData'] ?? null)
        ?: ($body['image_url'] ?? null);

if (!$dataUrl) {
  json_out(['error' => 'NO_IMAGE'], 400);
}

// --- Build prompt for OpenAI ---
$prompt = <<<TXT
Identify the plant in the image. Respond as JSON ONLY:
{
  "plantName": "",
  "scientificName": "",
  "confidence": 0
}
Use null if unsure. Return only JSON, no extra text.
TXT;

// --- OpenAI call (chat.completions) ---
$payload = [
  'model' => 'gpt-4o-mini',
  'messages' => [
    ['role' => 'system', 'content' => 'You are an expert botanist. Only return JSON as instructed.'],
    ['role' => 'user', 'content' => [
      ['type' => 'text', 'text' => $prompt],
      ['type' => 'image_url', 'image_url' => ['url' => $dataUrl]],
    ]],
  ],
  'temperature' => 0.2,
];

$ch = curl_init('https://api.openai.com/v1/chat/completions');
curl_setopt_array($ch, [
  CURLOPT_POST           => true,
  CURLOPT_HTTPHEADER     => [
    'Authorization: Bearer ' . $OPENAI,
    'Content-Type: application/json',
  ],
  CURLOPT_POSTFIELDS     => json_encode($payload),
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_TIMEOUT        => 45,
]);
$resp = curl_exec($ch);
$err  = curl_error($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($err || $code >= 400 || !$resp) {
  json_out(['error' => 'AI_CALL_FAILED', 'status' => $code], 502);
}

$j = json_decode($resp, true);
$choice = $j['choices'][0]['message'] ?? null;

$text = '';
if ($choice) {
  if (isset($choice['content']) && is_string($choice['content'])) {
    $text = $choice['content'];
  } elseif (isset($choice['content']) && is_array($choice['content'])) {
    foreach ($choice['content'] as $part) {
      if (($part['type'] ?? '') === 'text') { $text = $part['text'] ?? ''; break; }
    }
  }
}

$data = extract_json($text);
if (!is_array($data)) {
  json_out(['error' => 'AI_JSON_PARSE', 'snippet' => mb_substr($text, 0, 180)], 502);
}

json_out([
  'plantName'      => $data['plantName']      ?? null,
  'scientificName' => $data['scientificName'] ?? null,
  'confidence'     => (isset($data['confidence']) && is_numeric($data['confidence'])) ? (0 + $data['confidence']) : null,
], 200);
