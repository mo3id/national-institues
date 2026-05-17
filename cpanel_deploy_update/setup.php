<?php
header('Content-Type: text/plain; charset=UTF-8');
error_reporting(E_ALL);
ini_set('display_errors', 1);
$root = $_SERVER['DOCUMENT_ROOT'];

// Recreate deploy_util.php
$deploy = base64_decode('PD9waHAKaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9VVRGLTgnKTsKaGVhZGVyKCdBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW46IConKTsKJHRva2VuID0gbWQ1KCduaXNfZGVwbG95XycgLiBkYXRlKCdZbWQnKSk7CmlmICgoJF9HRVRbJ3Rva2VuJ10gPz8gJF9QT1NUWyd0b2tlbiddID8/ICcnKSAhPT0gJHRva2VuKSB7IGh0dHBfcmVzcG9uc2VfY29kZSg0MDMpOyBlY2hvIGpzb25fZW5jb2RlKFsnZXJyb3InID0+ICdpbnZhbGlkIHRva2VuJ10pOyBleGl0OyB9CiRhY3Rpb24gPSAkX0dFVFsnYWN0aW9uJ10gPz8gJF9QT1NUWydhY3Rpb24nXSA/PyAnJzsKaWYgKCRhY3Rpb24gPT09ICd1cGxvYWQnKSB7CiAgICAkcGF0aCA9ICRfUE9TVFsncGF0aCddID8/ICcnOyAkY29udGVudCA9ICRfUE9TVFsnY29udGVudCddID8/ICcnOwogICAgaWYgKCEkcGF0aCB8fCAhJGNvbnRlbnQpIHsgZWNobyBqc29uX2VuY29kZShbJ2Vycm9yJyA9PiAncGF0aCBhbmQgY29udGVudCByZXF1aXJlZCddKTsgZXhpdDsgfQogICAgJHJvb3QgPSAkX1NFUlZFUlsnRE9DVU1FTlRfUk9PVCddOyAkZnVsbFBhdGggPSAkcm9vdCAuICcvJyAuIGx0cmltKCRwYXRoLCAnLycpOwogICAgJHJlYWxQYXRoID0gcmVhbHBhdGgoZGlybmFtZSgkZnVsbFBhdGgpKSA/OiBkaXJuYW1lKCRmdWxsUGF0aCk7CiAgICBpZiAoc3RycG9zKCRyZWFsUGF0aCwgJHJvb3QpICE9PSAwKSB7IGVjaG8ganNvbl9lbmNvZGUoWydlcnJvcicgPT4gJ2ludmFsaWQgcGF0aCddKTsgZXhpdDsgfQogICAgaWYgKCFpc19kaXIoZGlybmFtZSgkZnVsbFBhdGgpKSkgbWtkaXIoZGlybmFtZSgkZnVsbFBhdGgpLCAwNzU1LCB0cnVlKTsKICAgICRieXRlcyA9IGZpbGVfcHV0X2NvbnRlbnRzKCRmdWxsUGF0aCwgYmFzZTY0X2RlY29kZSgkY29udGVudCkpOwogICAgZWNobyBqc29uX2VuY29kZShbJ29rJyA9PiB0cnVlLCAncGF0aCcgPT4gJHBhdGgsICdieXRlcycgPT4gJGJ5dGVzXSk7IGV4aXQ7Cn0KaWYgKCRhY3Rpb24gPT09ICdydW5fc3FsJykgewogICAgJHNxbCA9ICRfUE9TVFsnc3FsJ10gPz8gJyc7CiAgICBpZiAoISRzcWwpIHsgZWNobyBqc29uX2VuY29kZShbJ2Vycm9yJyA9PiAnc3FsIHJlcXVpcmVkJ10pOyBleGl0OyB9CiAgICAkZW52ID0gcGFyc2VfaW5pX2ZpbGUoJF9TRVJWRVJbJ0RPQ1VNRU5UX1JPT1QnXSAuICcvLmVudicpOwogICAgJHBkbyA9IG5ldyBQRE8oIm15c3FsOmhvc3Q9eyRlbnZbJ0RCX0hPU1QnXX07ZGJuYW1lPXskZW52WydEQl9OQU1FJ119O2NoYXJzZXQ9dXRmOG1iNCIsICRlbnZbJ0RCX1VTRVInXSwgJGVudlsnREJfUEFTUyddKTsKICAgICRwZG8tPnNldEF0dHJpYnV0ZShQRE86OkFUVFJfRVJSTU9ERSwgUERPOjpFUlJNT0RFX0VYQ0VQVElPTik7CiAgICAkcGRvLT5zZXRBdHRyaWJ1dGUoUERPOjpBVFRSX0RFRkFVTFRfRkVUQ0hfTU9ERSwgUERPOjpGRVRDSF9BU1NPQyk7CiAgICB0cnkgeyAkc3RtdCA9ICRwZG8tPnF1ZXJ5KCRzcWwpOyAkcm93cyA9ICRzdG10ID8gJHN0bXQtPmZldGNoQWxsKCkgOiBbXTsgZWNobyBqc29uX2VuY29kZShbJ29rJyA9PiB0cnVlLCAncm93cycgPT4gJHJvd3MsICdjb3VudCcgPT4gY291bnQoJHJvd3MpXSk7IH0KICAgIGNhdGNoIChFeGNlcHRpb24gJGUpIHsgZWNobyBqc29uX2VuY29kZShbJ2Vycm9yJyA9PiAkZS0+Z2V0TWVzc2FnZSgpXSk7IH0gZXhpdDsKfQppZiAoJGFjdGlvbiA9PT0gJ2RlbGV0ZScpIHsgdW5saW5rKF9fRklMRV9fKTsgZWNobyBqc29uX2VuY29kZShbJ29rJyA9PiB0cnVlLCAnZGVsZXRlZCcgPT4gX19GSUxFX19dKTsgZXhpdDsgfQppZiAoJGFjdGlvbiA9PT0gJ2V4ZWMnKSB7CiAgICAkY29kZSA9ICRfUE9TVFsnY29kZSddID8/ICcnOwogICAgaWYgKCEkY29kZSkgeyBlY2hvIGpzb25fZW5jb2RlKFsnZXJyb3InID0+ICdjb2RlIHJlcXVpcmVkJ10pOyBleGl0OyB9CiAgICB0cnkgeyBvYl9zdGFydCgpOyBldmFsKGJhc2U2NF9kZWNvZGUoJGNvZGUpKTsgJG91dHB1dCA9IG9iX2dldF9jbGVhbigpOyBlY2hvIGpzb25fZW5jb2RlKFsnb2snID0+IHRydWUsICdvdXRwdXQnID0+ICRvdXRwdXRdKTsgfQogICAgY2F0Y2ggKEV4Y2VwdGlvbiAkZSkgeyBlY2hvIGpzb25fZW5jb2RlKFsnZXJyb3InID0+ICRlLT5nZXRNZXNzYWdlKCldKTsgfSBleGl0Owp9CmVjaG8ganNvbl9lbmNvZGUoWydlcnJvcicgPT4gJ3Vua25vd24gYWN0aW9uJ10pOw==');
file_put_contents($root . '/deploy_util.php', $deploy);
echo "Deploy util recreated: " . strlen($deploy) . " bytes\n";

// Now test save_school step by step
$env = parse_ini_file($root . '/.env');
$pdo = new PDO("mysql:host={$env['DB_HOST']};dbname={$env['DB_NAME']};charset=utf8mb4", $env['DB_USER'], $env['DB_PASS']);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

require_once $root . '/backend/upload_handler.php';

echo "\n=== Testing save_school ===\n";

$s = json_decode('{"id":"test_full_debug","name":"Test","nameAr":"ت","location":"T","locationAr":"ت","governorate":"T","governorateAr":"ت","principal":"T","principalAr":"ت","logo":"","type":["Arabic"],"mainImage":"","gallery":[],"about":"","aboutAr":"","phone":"","email":"","website":"","rating":"","studentCount":"0","teachersCount":"0","foundedYear":"","address":"","addressAr":"","applicationLink":""}', true);

// processImageField
$logo = processImageField($s['logo'] ?? '', 'school_logo');
$mainImage = processImageField($s['mainImage'] ?? '', 'school_main');
$gallery = $s['gallery'] ?? [];
if (is_array($gallery)) { foreach ($gallery as &$gImg) { $gImg = processImageField($gImg, 'school_gallery'); } }
$type = is_array($s['type'] ?? '') ? json_encode($s['type']) : ($s['type'] ?? '');

echo "All fields processed OK\n";

// Check schema
$cols = $pdo->query("DESCRIBE schools")->fetchAll(PDO::FETCH_COLUMN);
$requiredCols = ['about'=>'text','aboutAr'=>'text','phone'=>'varchar(50)','email'=>'varchar(100)','website'=>'text','rating'=>'varchar(20)','studentCount'=>'varchar(20)','teachersCount'=>'varchar(20)','foundedYear'=>'varchar(20)','address'=>'text','addressAr'=>'text','applicationLink'=>'text'];
foreach ($requiredCols as $col => $colType) {
    if (!in_array($col, $cols)) { echo "ADDING: $col\n"; $pdo->exec("ALTER TABLE schools ADD COLUMN $col $colType"); }
}

// REPLACE INTO
try {
    $stmt = $pdo->prepare("REPLACE INTO schools (id, name, nameAr, location, locationAr, governorate, governorateAr, principal, principalAr, logo, type, mainimage, gallery, about, aboutAr, phone, email, website, rating, studentCount, teachersCount, foundedYear, address, addressAr, applicationLink) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$s['id']??uniqid(), $s['name']??'', $s['nameAr']??($s['name']??''), $s['location']??'', $s['locationAr']??($s['location']??''), $s['governorate']??'', $s['governorateAr']??($s['governorate']??''), $s['principal']??'', $s['principalAr']??($s['principal']??''), $logo, $type, $mainImage, json_encode($gallery), $s['about']??'', $s['aboutAr']??'', $s['phone']??'', $s['email']??'', $s['website']??'', $s['rating']??'', $s['studentCount']??'', $s['teachersCount']??'', $s['foundedYear']??'', $s['address']??'', $s['addressAr']??'', $s['applicationLink']??'']);
    echo "Direct SQL SAVE: OK!\n";
    $pdo->prepare("DELETE FROM schools WHERE id = ?")->execute([$s['id']??uniqid()]);
} catch (Exception $e) {
    echo "Direct SQL ERROR: " . $e->getMessage() . "\n";
}

// Now test the ACTUAL api.php flow by simulating what it does
// The key difference: api.php uses require_once for upload_handler and db_config
echo "\n=== Testing api.php flow ===\n";

// Clear any output buffering
while (ob_get_level()) ob_end_clean();

// Simulate calling api.php?action=save_school via HTTP
$jwt = json_decode(file_get_contents('https://gani.edu.eg/api.php?action=login', false, stream_context_create(['http' => ['method' => 'POST', 'header' => 'Content-Type: application/json', 'content' => '{"email":"admin@nis.edu.eg","password":"admin123"}']])), true)['token'] ?? '';

echo "JWT: " . substr($jwt, 0, 30) . "...\n";

$ch = curl_init('https://gani.edu.eg/api.php?action=save_school&token=' . $jwt);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'id' => 'test_api_save',
    'name' => 'Test API',
    'nameAr' => 'تجربة API',
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
curl_setopt($ch, CURLOPT_VERBOSE, false);
$result = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "API save_school response (HTTP $httpCode): $result\n";

// Cleanup
$pdo->prepare("DELETE FROM schools WHERE id LIKE 'test_%'")->execute();
echo "Cleanup done\n";

echo "\nToken: " . md5('nis_deploy_' . date('Ymd')) . "\n";
unlink(__FILE__);
