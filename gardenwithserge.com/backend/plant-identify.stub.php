<?php
// TEMPORARY SAFE STUB — always returns a valid JSON result
// This avoids any API calls/keys so your site works immediately.

error_reporting(0);
header('Content-Type: application/json');

echo json_encode([
  'plantName'      => 'Tomato',
  'scientificName' => 'Solanum lycopersicum',
  'confidence'     => 0.85
]);

exit;
