<?php
header('Content-Type: text/plain; charset=UTF-8');
$root = $_SERVER['DOCUMENT_ROOT'];

// Re-create deploy_util.php
$deploy = '<?php
header(\'Content-Type: application/json; charset=UTF-8\');
header(\'Access-Control-Allow-Origin: *\');
$token = md5(\'nis_deploy_\' . date(\'Ymd\'));
if (($_GET[\'token\'] ?? $_POST[\'token\'] ?? \'\') !== $token) { http_response_code(403); echo json_encode([\'error\' => \'invalid token\']); exit; }
$action = $_GET[\'action\'] ?? $_POST[\'action\'] ?? \'\';
if ($action === \'upload\') {
    $path = $_POST[\'path\'] ?? \'\'; $content = $_POST[\'content\'] ?? \'\';
    if (!$path || !$content) { echo json_encode([\'error\' => \'path and content required\']); exit; }
    $fullPath = $_SERVER[\'DOCUMENT_ROOT\'] . \'/\' . ltrim($path, \'/\');
    $realPath = realpath(dirname($fullPath)) ?: dirname($fullPath);
    if (strpos($realPath, $_SERVER[\'DOCUMENT_ROOT\']) !== 0) { echo json_encode([\'error\' => \'invalid path\']); exit; }
    if (!is_dir(dirname($fullPath))) mkdir(dirname($fullPath), 0755, true);
    $bytes = file_put_contents($fullPath, base64_decode($content));
    echo json_encode([\'ok\' => true, \'path\' => $path, \'bytes\' => $bytes]); exit;
}
if ($action === \'run_sql\') {
    $sql = $_POST[\'sql\'] ?? \'\';
    if (!$sql) { echo json_encode([\'error\' => \'sql required\']); exit; }
    $env = parse_ini_file($_SERVER[\'DOCUMENT_ROOT\'] . \'/\.env\');
    $pdo = new PDO("mysql:host={$env[\'DB_HOST\']};dbname={$env[\'DB_NAME\']};charset=utf8mb4", $env[\'DB_USER\'], $env[\'DB_PASS\']);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    try { $stmt = $pdo->query($sql); $rows = $stmt ? $stmt->fetchAll() : [];
        echo json_encode([\'ok\' => true, \'rows\' => $rows, \'count\' => count($rows)]); }
    catch (Exception $e) { echo json_encode([\'error\' => $e->getMessage()]); } exit;
}
if ($action === \'delete\') { unlink(__FILE__); echo json_encode([\'ok\' => true, \'deleted\' => __FILE__]); exit; }
echo json_encode([\'error\' => \'unknown action\']);';
file_put_contents($root . '/deploy_util.php', $deploy);
echo "Deploy util ready.\n";

// Now simulate EXACTLY what api.php does for save_school
error_reporting(E_ALL);
ini_set('display_errors', 1);

$env = parse_ini_file($root . '/.env');
$pdo = new PDO("mysql:host={$env['DB_HOST']};dbname={$env['DB_NAME']};charset=utf8mb4", $env['DB_USER'], $env['DB_PASS']);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

// Include api.php step by step
echo "=== Step 1: Check upload_handler.php ===\n";
require_once $root . '/backend/upload_handler.php';
echo "upload_handler.php loaded OK\n";

echo "\n=== Step 2: Test processImageField ===\n";
try {
    $result = processImageField('/', 'test');
    echo "processImageField('/'): '$result'\n";
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}

try {
    $result = processImageField('', 'test');
    echo "processImageField(''): '$result'\n";
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}

echo "\n=== Step 3: Check schools table columns ===\n";
$cols = $pdo->query("DESCRIBE schools")->fetchAll(PDO::FETCH_COLUMN);
echo "Columns: " . implode(', ', $cols) . "\n";
echo "Has mainimage: " . (in_array('mainimage', $cols) ? 'YES' : 'NO') . "\n";
echo "Has mainImage: " . (in_array('mainImage', $cols) ? 'YES' : 'NO') . "\n";

echo "\n=== Step 4: Simulate save_school with all steps ===\n";
$s = json_decode('{"id":"test_full_sim","name":"Test","nameAr":"ت","location":"T","locationAr":"ت","governorate":"T","governorateAr":"ت","principal":"T","principalAr":"ت","logo":"","type":["Arabic"],"mainImage":"","gallery":[],"about":"","aboutAr":"","phone":"","email":"","website":"","rating":"","studentCount":"0","teachersCount":"0","foundedYear":"","address":"","addressAr":"","applicationLink":""}', true);

echo "Step 4a: processImageField for logo...\n";
$logo = processImageField($s['logo'] ?? '', 'school_logo');
echo "Logo processed: '$logo'\n";

echo "Step 4b: processImageField for mainImage...\n";
$mainImage = processImageField($s['mainImage'] ?? '', 'school_main');
echo "MainImage processed: '$mainImage'\n";

echo "Step 4c: process gallery...\n";
$gallery = $s['gallery'] ?? [];
if (is_array($gallery)) {
    foreach ($gallery as &$gImg) {
        $gImg = processImageField($gImg, 'school_gallery');
    }
}
echo "Gallery processed OK\n";

echo "Step 4d: type encoding...\n";
$type = is_array($s['type'] ?? '') ? json_encode($s['type']) : ($s['type'] ?? '');
echo "Type: '$type'\n";

echo "Step 4e: SQL REPLACE INTO...\n";
try {
    // Ensure all columns exist
    $cols = $pdo->query("DESCRIBE schools")->fetchAll(PDO::FETCH_COLUMN);
    $requiredCols = ['about','aboutAr','phone','email','website','rating','studentCount','teachersCount','foundedYear','address','addressAr','applicationLink'];
    foreach ($requiredCols as $col) {
        if (!in_array($col, $cols)) {
            echo "ADDING MISSING COLUMN: $col\n";
            $pdo->exec("ALTER TABLE schools ADD COLUMN $col text");
        }
    }
    
    $stmt = $pdo->prepare("REPLACE INTO schools (id, name, nameAr, location, locationAr, governorate, governorateAr, principal, principalAr, logo, type, mainimage, gallery, about, aboutAr, phone, email, website, rating, studentCount, teachersCount, foundedYear, address, addressAr, applicationLink) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $s['id'] ?? uniqid(),
        $s['name'] ?? '',
        $s['nameAr'] ?? ($s['name'] ?? ''),
        $s['location'] ?? '',
        $s['locationAr'] ?? ($s['location'] ?? ''),
        $s['governorate'] ?? '',
        $s['governorateAr'] ?? ($s['governorate'] ?? ''),
        $s['principal'] ?? '',
        $s['principalAr'] ?? ($s['principal'] ?? ''),
        $logo,
        $type,
        $mainImage,
        json_encode($gallery),
        $s['about'] ?? '',
        $s['aboutAr'] ?? '',
        $s['phone'] ?? '',
        $s['email'] ?? '',
        $s['website'] ?? '',
        $s['rating'] ?? '',
        $s['studentCount'] ?? '',
        $s['teachersCount'] ?? '',
        $s['foundedYear'] ?? '',
        $s['address'] ?? '',
        $s['addressAr'] ?? '',
        $s['applicationLink'] ?? ''
    ]);
    echo "SAVE OK!\n";
    $pdo->prepare("DELETE FROM schools WHERE id = ?")->execute([$s['id']]);
    echo "DELETE OK!\n";
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo "FILE: " . $e->getFile() . " LINE: " . $e->getLine() . "\n";
}

echo "\n=== DONE ===\n";
unlink(__FILE__);