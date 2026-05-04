<?php
header('Content-Type: text/plain; charset=UTF-8');
$root = $_SERVER['DOCUMENT_ROOT'];

echo "=== ROOT .env ===\n";
if (file_exists($root . '/.env')) {
    $env = file_get_contents($root . '/.env');
    $env = preg_replace('/(PASS|PASSWORD)\s*=\s*.*/i', '$1 = ******', $env);
    echo $env;
} else {
    echo "NOT FOUND\n";
}

echo "\n=== ROOT db_config.php ===\n";
if (file_exists($root . '/db_config.php')) {
    echo file_get_contents($root . '/db_config.php');
} else {
    echo "NOT FOUND\n";
}

echo "\n=== ROOT upload_handler.php ===\n";
if (file_exists($root . '/upload_handler.php')) {
    echo "SIZE: " . filesize($root . '/upload_handler.php') . " bytes\n";
    echo substr(file_get_contents($root . '/upload_handler.php'), 0, 200);
} else {
    echo "NOT FOUND\n";
}

echo "\n=== BACKEND DIR ===\n";
$backendDir = $root . '/backend';
foreach (scandir($backendDir) as $f) {
    if ($f === '.' || $f === '..') continue;
    echo $f . (is_dir($backendDir.'/'.$f) ? '/' : '') . "\n";
}

echo "\n=== DB CONNECTION TEST ===\n";
try {
    // Load root .env
    $envFile = $root . '/.env';
    if (file_exists($envFile)) {
        $env = parse_ini_file($envFile);
    } else {
        $env = [];
    }
    $host = $env['DB_HOST'] ?? 'localhost';
    $dbname = $env['DB_NAME'] ?? '';
    $user = $env['DB_USER'] ?? '';
    $pass = $env['DB_PASS'] ?? '';
    echo "DB_HOST: $host\n";
    echo "DB_NAME: $dbname\n";
    echo "DB_USER: $user\n";
    echo "DB_PASS: " . str_repeat('*', strlen($pass)) . "\n";
    
    $pdo = new PDO("mysql:host={$host};dbname={$dbname};charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "DB CONNECTED: YES\n";
    
    $sample = $pdo->query("SELECT id, application_number, student_national_id, status FROM admissions LIMIT 3")->fetchAll(PDO::FETCH_ASSOC);
    echo "\n=== SAMPLE ADMISSIONS ===\n";
    foreach ($sample as $row) {
        echo json_encode($row, JSON_UNESCAPED_UNICODE) . "\n";
    }
} catch (Exception $e) {
    echo "DB ERROR: " . $e->getMessage() . "\n";
}

echo "\n=== DONE ===\n";