<?php
// NO OUTPUT BEFORE THIS LINE — JSON ONLY
error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);
ini_set('display_errors', 0);

function json_out($obj,$code=200){ http_response_code($code); header('Content-Type: application/json'); echo json_encode($obj); exit; }

if (isset($_GET['ping'])) { header('Content-Type: text/plain'); echo 'ok'; exit; }

// Load OpenAI key from /home/sergbcqk/garden/openai_gws.key
$garden = realpath(__DIR__.'/../../garden');
$keyfile = $garden ? $garden.'/openai_gws.key' : null;
$key = ($keyfile && is_readable($keyfile)) ? trim(file_get_contents($keyfile)) : '';
$key = preg_replace('/[^\x21-\x7E]/','',$key);
if (!$key) json_out(['error'=>'NO_OPENAI_KEY'],500);

// CORS for www and apex
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, ['https://www.gardenwithserge.com','https://gardenwithserge.com'], true)) {
  header("Access-Control-Allow-Origin: $origin");
  header('Vary: Origin');
  header('Access-Control-Allow-Credentials: true');
}
if ($_SERVER['REQUEST_METHOD']==='OPTIONS') {
  header('Access-Control-Allow-Methods: POST, OPTIONS');
  header('Access-Control-Allow-Headers: Content-Type, Authorization');
  http_response_code(204); exit;
}

if ($_SERVER['REQUEST_METHOD']!=='POST') json_out(['error'=>'USE_POST'],405);

function get_mime($path){
  if (function_exists('mime_content_type')) { $m=@mime_content_type($path); if ($m) return $m; }
  $f=@finfo_open(FILEINFO_MIME_TYPE);
  if ($f){ $m=@finfo_file($f,$path); @finfo_close($f); if ($m) return $m; }
  return 'image/jpeg';
}
function data_url_from_upload(){
  if (!empty($_FILES)) {
    foreach ($_FILES as $file) {
      if (isset($file['error']) && $file['error']===UPLOAD_ERR_OK && is_uploaded_file($file['tmp_name'])) {
        $mime=get_mime($file['tmp_name']);
        return "data:$mime;base64,".base64_encode(file_get_contents($file['tmp_name']));
      }
    }
  }
  return null;
}

// Accept multiple JSON keys as well
$ctype = $_SERVER['CONTENT_TYPE'] ?? '';
$body  = (stripos($ctype,'application/json')!==false) ? (json_decode(file_get_contents('php://input'),true) ?: []) : [];
$dataUrl = data_url_from_upload()
  ?: ($body['imageData']     ?? null)
  ?: ($body['image_base64']  ?? null)
  ?: ($body['dataUrl']       ?? null)
  ?: ($body['data_url']      ?? null)
  ?: ($body['image_url']     ?? null);

if (!$dataUrl) json_out(['error'=>'NO_IMAGE'],400);

// Build prompt
$prompt = 'Identify the plant in the image. Respond as JSON: {"plantName":"","scientificName":"","confidence":0} Use null if unsure. Only return JSON.';

// Call OpenAI
$payload = [
  'model'=>'gpt-4o-mini',
  'messages'=>[
    ['role'=>'system','content'=>'You are an expert botanist. Only return JSON as instructed.'],
    ['role'=>'user','content'=>[
      ['type'=>'text','text'=>$prompt],
      ['type'=>'image_url','image_url'=>['url'=>$dataUrl]],
    ]]
  ],
  'temperature'=>0.2
];

$ch=curl_init('https://api.openai.com/v1/chat/completions');
curl_setopt_array($ch,[
  CURLOPT_POST=>true,
  CURLOPT_HTTPHEADER=>['Authorization: Bearer '.$key,'Content-Type: application/json'],
  CURLOPT_POSTFIELDS=>json_encode($payload),
  CURLOPT_RETURNTRANSFER=>true,
  CURLOPT_TIMEOUT=>60,
]);
$resp=curl_exec($ch); $err=curl_error($ch); $code=curl_getinfo($ch,CURLINFO_HTTP_CODE); curl_close($ch);
if ($err || $code>=400 || !$resp) json_out(['error'=>'AI_CALL_FAILED','status'=>$code],502);

// Parse assistant text → JSON
$j = json_decode($resp,true);
$text = $j['choices'][0]['message']['content'] ?? '';
if (!$text && isset($j['choices'][0]['message']['content']) && is_array($j['choices'][0]['message']['content'])) {
  foreach ($j['choices'][0]['message']['content'] as $part) {
    if (($part['type']??'')==='text'){ $text=$part['text']??''; break; }
  }
}
$data = json_decode($text,true);
if (!is_array($data) && preg_match('/\{.*\}/s',$text,$m)) $data=json_decode($m[0],true);
if (!is_array($data)) json_out(['plantName'=>null,'scientificName'=>null,'confidence'=>0],200);

json_out($data,200);
