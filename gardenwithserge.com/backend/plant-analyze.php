<?php
/**
 * backend/plant-analyze.php
 * JSON-only endpoint that:
 *  - Accepts an uploaded image (multipart/form-data) or JSON data URL.
 *  - Calls OpenAI Vision to analyze plant health.
 *  - Saves the analysis into `plant_analyses` for the logged-in user.
 *  - Returns JSON: { healthStatus, diseaseAnalysis, careRecommendations[] }
 */

error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);
ini_set('display_errors', 0);

// We need the session (user_id) and DB access to log the analysis
session_start();
require_once __DIR__ . '/../db_config.php';  // provides $conn (mysqli) or $pdo

// ---------- helpers ----------
function json_out($obj, $code = 200) {
  http_response_code($code);
  header('Content-Type: application/json');
  echo json_encode($obj);
  exit;
}
function get_mime($path) {
  if (function_exists('mime_content_type')) { $m = @mime_content_type($path); if ($m) return $m; }
  $f = @finfo_open(FILEINFO_MIME_TYPE);
  if ($f) { $m = @finfo_file($f, $path); @finfo_close($f); if ($m) return $m; }
  return 'image/jpeg';
}
function data_url_from_upload() {
  if (!empty($_FILES)) {
    foreach ($_FILES as $file) {
      if (isset($file['error']) && $file['error'] === UPLOAD_ERR_OK && is_uploaded_file($file['tmp_name'])) {
        $mime = get_mime($file['tmp_name']);
        return "data:$mime;base64," . base64_encode(file_get_contents($file['tmp_name']));
      }
    }
  }
  return null;
}

// ---------- CORS & pings ----------
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, ['https://www.gardenwithserge.com','https://gardenwithserge.com'], true)) {
  header("Access-Control-Allow-Origin: $origin");
  header('Vary: Origin');
  header('Access-Control-Allow-Credentials: true');
}
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  header('Access-Control-Allow-Methods: POST, OPTIONS');
  header('Access-Control-Allow-Headers: Content-Type, Authorization');
  http_response_code(204); exit;
}
if (isset($_GET['ping'])) { header('Content-Type: text/plain'); echo 'ok'; exit; }

// ---------- Load OpenAI key from file: /home/sergbcqk/garden/openai_gws.key ----------
$garden  = realpath(__DIR__ . '/../../garden');
$keyfile = $garden ? $garden . '/openai_gws.key' : null;
$key     = ($keyfile && is_readable($keyfile)) ? trim(file_get_contents($keyfile)) : '';
$key     = preg_replace('/[^\x21-\x7E]/', '', $key);
if (!$key) json_out(['error' => 'NO_OPENAI_KEY'], 500);

// quick key check without making a vision call
if (isset($_GET['check']) && $_GET['check'] === 'openai') {
  $ch = curl_init('https://api.openai.com/v1/models');
  curl_setopt_array($ch, [
    CURLOPT_HTTPHEADER     => ['Authorization: Bearer ' . $key],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT        => 20
  ]);
  curl_exec($ch);
  $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
  curl_close($ch);
  json_out(['status' => $code], 200);
}

// ---------- Only POST does real work ----------
if ($_SERVER['REQUEST_METHOD'] !== 'POST') json_out(['error' => 'USE_POST'], 405);

// ---------- Read body (JSON or multipart) ----------
$ctype = $_SERVER['CONTENT_TYPE'] ?? '';
$body  = (stripos($ctype, 'application/json') !== false)
          ? (json_decode(file_get_contents('php://input'), true) ?: [])
          : [];

$dataUrl = data_url_from_upload()
  ?: ($body['imageData']     ?? null)
  ?: ($body['image_base64']  ?? null)
  ?: ($body['dataUrl']       ?? null)
  ?: ($body['data_url']      ?? null)
  ?: ($body['image_url']     ?? null);

if (!$dataUrl) json_out(['error' => 'NO_IMAGE'], 400);

// optional plant name hint
$plantName = '';
foreach (['plantName','plant','name','identifiedPlant','identified_name','commonName','title'] as $k) {
  if (!empty($body[$k])) { $plantName = trim((string)$body[$k]); break; }
  if (!empty($_POST[$k])) { $plantName = trim((string)$_POST[$k]); break; }
}

// ---------- OpenAI call ----------
$context = $plantName ? "Plant name: \"{$plantName}\"." : "";
$prompt  = "Analyze the health of the plant in the image. {$context}\nRespond as JSON:\n"
          . "{\"healthStatus\":\"\",\"diseaseAnalysis\":\"\",\"careRecommendations\":[\"\",\"\",\"\"]}\n"
          . "Use null if unsure. Only return JSON.";

$payload = [
  'model'    => 'gpt-4o-mini',
  'messages' => [
    ['role' => 'system', 'content' => 'You are a plant disease expert. Only return JSON as instructed.'],
    ['role' => 'user',   'content' => [
      ['type' => 'text',      'text'      => $prompt],
      ['type' => 'image_url', 'image_url' => ['url' => $dataUrl]],
    ]],
  ],
  'temperature' => 0.2,
];

$ch = curl_init('https://api.openai.com/v1/chat/completions');
curl_setopt_array($ch, [
  CURLOPT_POST           => true,
  CURLOPT_HTTPHEADER     => ['Authorization: Bearer ' . $key, 'Content-Type: application/json'],
  CURLOPT_POSTFIELDS     => json_encode($payload),
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_TIMEOUT        => 60,
]);
$resp = curl_exec($ch);
$err  = curl_error($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($err || $code >= 400 || !$resp) {
  json_out(['error' => 'AI_CALL_FAILED', 'status' => $code], 502);
}

// parse assistant content -> JSON object
$j    = json_decode($resp, true);
$text = $j['choices'][0]['message']['content'] ?? '';
if (!$text && isset($j['choices'][0]['message']['content']) && is_array($j['choices'][0]['message']['content'])) {
  foreach ($j['choices'][0]['message']['content'] as $part) {
    if (($part['type'] ?? '') === 'text') { $text = $part['text'] ?? ''; break; }
  }
}
$data = json_decode($text, true);
if (!is_array($data) && preg_match('/\{.*\}/s', $text, $m)) $data = json_decode($m[0], true);
if (!is_array($data)) $data = ['healthStatus' => null, 'diseaseAnalysis' => null, 'careRecommendations' => []];

// ---------- SAVE the analysis so the monthly counter works ----------
try {
  $uid = (int)($_SESSION['user_id'] ?? 0);
  if ($uid > 0) {
    $plant_name      = $plantName;
    $scientific_name = '';  // not provided by this endpoint
    $health_status   = $data['healthStatus']        ?? '';
    $care_arr        = $data['careRecommendations'] ?? [];
    $care_recs       = is_array($care_arr) ? implode("\n", $care_arr) : (string)$care_arr;
    $confidence_val  = isset($data['confidence']) ? (string)$data['confidence'] : '';
    $image_url       = '';  // set if you store uploads
    $now             = date('Y-m-d H:i:s');

    if (isset($conn) && $conn instanceof mysqli) {
      $stmt = $conn->prepare(
        "INSERT INTO plant_analyses
         (user_id, plant_name, scientific_name, analysis_date, health_status, care_recommendations, image_url, confidence)
         VALUES (?,?,?,?,?,?,?,?)"
      );
      $stmt->bind_param("isssssss", $uid, $plant_name, $scientific_name, $now, $health_status, $care_recs, $image_url, $confidence_val);
      $stmt->execute();
      $stmt->close();
    } elseif (isset($pdo) && $pdo instanceof PDO) {
      $stmt = $pdo->prepare(
        "INSERT INTO plant_analyses
         (user_id, plant_name, scientific_name, analysis_date, health_status, care_recommendations, image_url, confidence)
         VALUES (?,?,?,?,?,?,?,?)"
      );
      $stmt->execute([$uid, $plant_name, $scientific_name, $now, $health_status, $care_recs, $image_url, $confidence_val]);
    }
  }
} catch (Throwable $e) {
  // ignore DB failures so user still gets a result
}
// --- SAVE ANALYSIS FOR MONTHLY COUNTER (Basic) ---
if (session_status() === PHP_SESSION_NONE) { @session_start(); }
$user_id = isset($_SESSION['user_id']) ? (int)$_SESSION['user_id'] : 0;
if ($user_id) {
  try {
    require_once __DIR__ . '/../db_config.php'; // gives $pdo (PDO)
    $plant_for_db = $plantName ?? ($data['plantName'] ?? null);
    $stmt = $pdo->prepare(
      "INSERT INTO plant_analyses (user_id, plant_name, result_json, analysis_date)
       VALUES (?, ?, ?, NOW())"
    );
    $stmt->execute([
      $user_id,
      $plant_for_db,
      json_encode($data, JSON_UNESCAPED_UNICODE)
    ]);
  } catch (Throwable $e) { /* ignore DB errors, still return JSON */ }
}
// --- SAVE ANALYSIS FOR MONTHLY COUNTER ---
if (session_status() === PHP_SESSION_NONE) { @session_start(); }
$user_id = isset($_SESSION['user_id']) ? (int)$_SESSION['user_id'] : 0;
if ($user_id) {
  try {
    require_once __DIR__ . '/../db_config.php'; // $pdo (PDO)
    $plant_for_db = $plantName ?? ($data['plantName'] ?? null);
    $stmt = $pdo->prepare(
      "INSERT INTO plant_analyses (user_id, plant_name, result_json, analysis_date)
       VALUES (?, ?, ?, NOW())"
    );
    $stmt->execute([$user_id, $plant_for_db, json_encode($data, JSON_UNESCAPED_UNICODE)]);
  } catch (Throwable $e) { /* ignore */ }
}

// ---------- Return the JSON to the browser ----------
json_out($data, 200);
