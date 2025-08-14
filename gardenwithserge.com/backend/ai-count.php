<?php
session_start();
header('Content-Type: application/json');
if (!isset($_SESSION['user_id'])) { echo json_encode(['count'=>0]); exit; }
require_once __DIR__ . '/../db_config.php';
$start = date('Y-m-01 00:00:00');
$end   = date('Y-m-t 23:59:59');
$stmt = $pdo->prepare("SELECT COUNT(*) FROM plant_analyses WHERE user_id = ? AND analysis_date BETWEEN ? AND ?");
$stmt->execute([(int)$_SESSION['user_id'], $start, $end]);
echo json_encode(['count'=>(int)$stmt->fetchColumn()]);
