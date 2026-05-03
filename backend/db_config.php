<?php

// ── Load environment variables from .env file ─────────────────────────────
$envFile = __DIR__ . '/.env';
if (!file_exists($envFile)) {
    // Fallback: check document root (when backend/ .env doesn't exist but root one does)
    $envFile = $_SERVER['DOCUMENT_ROOT'] . '/.env';
}

if (file_exists($envFile)) {
    $env = parse_ini_file($envFile);
} else {
    // Fallback: read from system environment (useful in cPanel / hosting env vars)
    $env = [
        'DB_HOST' => getenv('DB_HOST') ?: 'localhost',
        'DB_NAME' => getenv('DB_NAME') ?: '',
        'DB_USER' => getenv('DB_USER') ?: '',
        'DB_PASS' => getenv('DB_PASS') ?: '',
    ];
}

$host     = $env['DB_HOST'] ?? 'localhost';
$dbname   = $env['DB_NAME'] ?? '';
$username = $env['DB_USER'] ?? '';
$password = $env['DB_PASS'] ?? '';

try {
    $pdo = new PDO(
        "mysql:host={$host};dbname={$dbname};charset=utf8mb4",
        $username,
        $password
    );

    // ── Security: always throw exceptions on SQL errors ───────────────────
    $pdo->setAttribute(PDO::ATTR_ERRMODE,            PDO::ERRMODE_EXCEPTION);

    // ── Performance: return associative arrays by default ─────────────────
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    // ── Security: CRITICAL — disable emulated prepares for real
    //    parameterized queries that actually prevent SQL injection ──────────
    $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES,   false);

} catch (PDOException $e) {
    http_response_code(500);
    // Never expose the real error message to the client in production
    error_log('[NIS DB Error] ' . $e->getMessage());
    echo json_encode(["status" => "error", "message" => "Database connection failed. Please try again later."]);
    exit();
}
?>