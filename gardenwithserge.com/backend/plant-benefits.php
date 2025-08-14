<?php
// backend/plant-benefits.php — real AI benefits using key file at ../../garden/openai_gws.key
error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);
ini_set('display_errors', 0);

function json_out($obj, $code=200){
  http_response_code($code);
  header('Content-Type: application/json');
  echo json_encode($obj);
  exit;
}

// --- read key from file (same good key you verified) ---
$garden  = realpath(__DIR__ . '/../../garden');
$keyfile = $garden ? ($garden . '/openai_gws.key') : null;
$key     = ($keyfile && is_readable($keyfile)) ? file_get_contents($keyfile) : '';
$key     = preg_replace('/[^\x21-\x7E]/', '', trim((string)$key));

if (isset($_GET['ping']))  { header('Content-Type:text/plain'); echo 'ok'; exit; }
if (isset($_GET['check']) && $_GET['check']==='openai') {
  if ($key==='') json_out(['status'=>'no-key'],500);
  $ch=curl_init('https://api.openai.com/v1/models');
  curl_setopt_array($ch,[CURLOPT_HTTPHEADER=>['Authorization: Bearer '.$key],CURLOPT_RETURNTRANSFER=>true,CURLOPT_TIMEOUT=>20]);
  curl_exec($ch); $code=curl_getinfo($ch,CURLINFO_HTTP_CODE); curl_close($ch);
  json_out(['status'=>$code],200);
}
if ($key==='') json_out(['error'=>'NO_OPENAI_KEY'],500);

// --- accept POST only ---
if ($_SERVER['REQUEST_METHOD']!=='POST') json_out(['error'=>'USE_POST'],405);

// accept JSON or form
$ctype = $_SERVER['CONTENT_TYPE'] ?? '';
$body  = (stripos($ctype,'application/json')!==false)
  ? (json_decode(file_get_contents('php://input'), true) ?: [])
  : [];

// pull plant name from multiple possible keys
function first_nonempty_key($src, $keys){
  foreach ($keys as $k) {
    if (isset($src[$k])) {
      $v = trim((string)$src[$k]);
      if ($v !== '') return $v;
    }
  }
  return '';
}
$plantKeys = ['plantName','plant','name','plant_name','identifiedPlant','identified_name','commonName','title'];
$langKeys  = ['language','lang','locale','preferred_language'];

$plantName = first_nonempty_key($body, $plantKeys);
if ($plantName==='') $plantName = first_nonempty_key($_POST, $plantKeys);
if ($plantName==='') $plantName = first_nonempty_key($_GET,  $plantKeys);

$lang = first_nonempty_key($body, $langKeys);
if ($lang==='') $lang = first_nonempty_key($_POST, $langKeys);
if ($lang==='') $lang = first_nonempty_key($_GET,  $langKeys);
if ($lang==='') $lang = 'en';

// optional scientific name if provided
$sci = first_nonempty_key($body, ['scientificName','scientific_name','species']);
if ($sci==='') $sci = first_nonempty_key($_POST, ['scientificName','scientific_name','species']);
if ($sci==='') $sci = first_nonempty_key($_GET,  ['scientificName','scientific_name','species']);

if ($plantName==='') {
  // no plant name provided -> return empty list (what UI expects)
  json_out(['benefits' => []], 200);
}

// --- build prompt ---
$plantLine = $sci ? "{$plantName} ({$sci})" : $plantName;
$prompt = <<<TXT
You are a horticulture and nutrition expert. In language code "{$lang}", list concise, factual benefits of the edible plant "{$plantLine}".
Return JSON ONLY:
{
  "benefits": ["", "", ""]
}
Write 3–6 short bullet items (max 1 sentence each). If unsure, return an empty list.
TXT;

// --- OpenAI call (chat.completions) ---
$payload = [
  'model' => 'gpt-4o-mini',
  'messages' => [
    ['role' => 'system', 'content' => 'You are a helpful expert. Only return JSON as instructed.'],
    ['role' => 'user',   'content' => $prompt],
  ],
  'temperature' => 0.2,
];

$ch = curl_init('https://api.openai.com/v1/chat/completions');
curl_setopt_array($ch, [
  CURLOPT_POST           => true,
  CURLOPT_HTTPHEADER     => ['Authorization: Bearer ' . $key, 'Content-Type: application/json'],
  CURLOPT_POSTFIELDS     => json_encode($payload),
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_TIMEOUT        => 45,
]);
$resp = curl_exec($ch); $err = curl_error($ch); $code = curl_getinfo($ch, CURLINFO_HTTP_CODE); curl_close($ch);

if ($err || $code >= 400 || !$resp) json_out(['error'=>'AI_CALL_FAILED','status'=>$code],502);

// parse response
$j = json_decode($resp, true);
$text = $j['choices'][0]['message']['content'] ?? '';
if (!$text && isset($j['choices'][0]['message']['content']) && is_array($j['choices'][0]['message']['content'])) {
  foreach ($j['choices'][0]['message']['content'] as $part) {
    if (($part['type'] ?? '') === 'text') { $text = $part['text'] ?? ''; break; }
  }
}

// extract JSON
$data = json_decode($text, true);
if (!is_array($data)) {
  if (preg_match('/\{.*\}/s', $text, $m)) $data = json_decode($m[0], true);
}
if (!is_array($data)) json_out(['benefits'=>[]],200); // fall back to empty list, no error in UI

// normalize + return
$benefits = [];
if (isset($data['benefits']) && is_array($data['benefits'])) {
  foreach ($data['benefits'] as $b) {
    if (is_string($b) && $b !== '') $benefits[] = $b;
  }
}
json_out(['benefits' => $benefits], 200);
