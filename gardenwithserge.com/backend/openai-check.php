<?php
// Key-file first checker (no changes to your live page)
// Reads /home/sergbcqk/garden/openai_gws.key, falls back to env.

error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: text/plain');

// Locate /home/sergbcqk/garden
$garden = realpath(__DIR__ . '/../../garden');
echo "garden-path: " . ($garden ?: 'NOT_FOUND') . "\n";

// Try key file first
$key = '';
$keyFile = $garden ? ($garden . '/openai_gws.key') : null;
if ($keyFile && is_readable($keyFile)) {
  $key = file_get_contents($keyFile);
}

// Sanitize
$sanitize = function($s){
  $s = trim((string)$s);
  return preg_replace('/[^\x21-\x7E]/', '', $s); // strip BOM/non-printables
};
$key = $sanitize($key);

// If empty, fallback to env
if ($key === '') {
  // load dotenv, but it's optional
  $autoload = $garden . '/vendor/autoload.php';
  if (file_exists($autoload)) require $autoload;
  if (class_exists('Dotenv\\Dotenv')) {
    try {
      Dotenv\Dotenv::createImmutable($garden)->safeLoad();
    } catch (Throwable $e) {
      echo "dotenv-error: " . $e->getMessage() . "\n";
    }
  }
  $key = $sanitize(getenv('OPENAI_API_KEY_GWS') ?: getenv('OPENAI_API_KEY') ?: '');
}

echo "keyfile-exists: " . (($keyFile && file_exists($keyFile)) ? 'yes' : 'no') . "\n";
echo "keyfile-readable: " . (($keyFile && is_readable($keyFile)) ? 'yes' : 'no') . "\n";
echo "key-length: " . strlen($key) . "\n";

// Minimal external check (lists models) — very low cost
if ($key === '') {
  echo "models-status: no-key\n";
  exit;
}

$ch = curl_init('https://api.openai.com/v1/models');
curl_setopt_array($ch, [
  CURLOPT_HTTPHEADER     => ['Authorization: Bearer ' . $key],
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_TIMEOUT        => 20,
]);
curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "models-status: " . ($code ?: 'no-response') . "\n";
