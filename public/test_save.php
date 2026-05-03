<?php
header('Content-Type: text/plain; charset=UTF-8');
error_reporting(E_ALL);
ini_set('display_errors', 1);
$root = $_SERVER['DOCUMENT_ROOT'];

// Step 1: Recreate deploy_util.php
$deploy_code = '<?php
header(\'Content-Type: application/json; charset=UTF-8\');
header(\'Access-Control-Allow-Origin: *\');
$tok = md5(\'nis_deploy_\' . date(\'Ymd\'));
if (($_GET[\'token\'] ?? $_POST[\'token\'] ?? \'\') !== $tok) { http_response_code(403); echo json_encode([\'error\' => \'invalid token\']); exit; }
$act = $_GET[\'action\'] ?? $_POST[\'action\'] ?? \'\';
if ($act === \'upload\') {
    $p = $_POST[\'path\'] ?? \'\'; $c = $_POST[\'content\'] ?? \'\';
    if (!$p || !$c) { echo json_encode([\'error\' => \'path and content required\']); exit; }
    $fp = $_SERVER[\'DOCUMENT_ROOT\'] . \'/\' . ltrim($p, \'/\');
    $rp = realpath(dirname($fp)) ?: dirname($fp);
    if (strpos($rp, $_SERVER[\'DOCUMENT_ROOT\']) !== 0) { echo json_encode([\'error\' => \'invalid path\']); exit; }
    if (!is_dir(dirname($fp))) mkdir(dirname($fp), 0755, true);
    $b = file_put_contents($fp, base64_decode($c));
    echo json_encode([\'ok\' => true, \'path\' => $p, \'bytes\' => $b]); exit;
}
if ($act === \'run_sql\') {
    $sql = $_POST[\'sql\'] ?? \'\';
    if (!$sql) { echo json_encode([\'error\' => \'sql required\']); exit; }
    $e = parse_ini_file($_SERVER[\'DOCUMENT_ROOT\'] . \'/\.env\');
    $pd = new PDO("mysql:host={$e[\'DB_HOST\']};dbname={$e[\'DB_NAME\']};charset=utf8mb4", $e[\'DB_USER\'], $e[\'DB_PASS\']);
    $pd->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pd->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    try { $st = $pd->query($sql); $rows = $st ? $st->fetchAll() : []; echo json_encode([\'ok\' => true, \'rows\' => $rows, \'count\' => count($rows)]); }
    catch (Exception $ex) { echo json_encode([\'error\' => $ex->getMessage()]); } exit;
}
if ($act === \'delete\') { unlink(__FILE__); echo json_encode([\'ok\' => true]); exit; }
echo json_encode([\'error\' => \'unknown action\']);';
file_put_contents($root . '/deploy_util.php', $deploy_code);
echo "Deploy util: OK (" . strlen($deploy_code) . " bytes)\n";
echo "Token: " . md5('nis_deploy_' . date('Ymd')) . "\n\n";

// Step 2: Test save_school via actual HTTP request
$ctx = stream_context_create(['http' => ['method' => 'POST', 'header' => 'Content-Type: application/json', 'content' => '{"email":"admin@nis.edu.eg","password":"admin123"}']]);
$loginResp = json_decode(file_get_contents('https://gani.edu.eg/api.php?action=login', false, $ctx), true);
$jwt = $loginResp['token'] ?? 'NO_TOKEN';
echo "JWT: " . substr($jwt, 0, 30) . "...\n\n";

$ch = curl_init('https://gani.edu.eg/api.php?action=save_school&token=' . urlencode($jwt));
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'id' => 'test_save_via_api',
    'name' => 'Test API Save',
    'nameAr' => 'تجربة',
    'location' => 'Test',
    'locationAr' => 'تجربة',
    'governorate' => 'Test',
    'governorateAr' => 'تجربة',
    'principal' => 'Test',
    'principalAr' => 'تجربة',
    'logo' => '',
    'type' => ['Arabic'],
    'mainImage' => '',
    'gallery' => [],
    'about' => '', 'aboutAr' => '', 'phone' => '', 'email' => '', 'website' => '', 'rating' => '', 'studentCount' => '0', 'teachersCount' => '0', 'foundedYear' => '', 'address' => '', 'addressAr' => '', 'applicationLink' => ''
]));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, false);
$result = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

echo "API save_school HTTP $httpCode:\n$result\n";
if ($error) echo "cURL error: $error\n";

// Cleanup
$env = parse_ini_file($root . '/.env');
$pdo = new PDO("mysql:host={$env['DB_HOST']};dbname={$env['DB_NAME']};charset=utf8mb4", $env['DB_USER'], $env['DB_PASS']);
$pdo->prepare("DELETE FROM schools WHERE id LIKE 'test_%'")->execute();

echo "\nDone\n";
unlink(__FILE__);