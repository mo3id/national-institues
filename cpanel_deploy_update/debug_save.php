<?php
header('Content-Type: text/plain; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
$root = $_SERVER['DOCUMENT_ROOT'];

// Load DB and upload handler
$envFile = $root . '/.env';
$env = parse_ini_file($envFile);
$pdo = new PDO("mysql:host={$env['DB_HOST']};dbname={$env['DB_NAME']};charset=utf8mb4", $env['DB_USER'], $env['DB_PASS']);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

require_once $root . '/upload_handler.php';

echo "=== SAVE SCHOOL TEST ===\n";

// Try to save a minimal school
try {
    $id = 'test_debug_' . time();
    $stmt = $pdo->prepare("REPLACE INTO schools (id, name, nameAr, location, locationAr, governorate, governorateAr, principal, principalAr, logo, type, mainimage, gallery, about, aboutAr, phone, email, website, rating, studentCount, teachersCount, foundedYear, address, addressAr, applicationLink) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $result = $stmt->execute([
        $id,
        'Test Debug School',
        'مدرسة تجريبية',
        'Test Location',
        'موقع تجريبي',
        'Test Gov',
        'تجريبي',
        'Test Principal',
        'تجريبي',
        '', // logo
        json_encode(['Arabic']), // type as JSON string
        '', // mainimage
        json_encode([]), // gallery
        '', '', '', '', '', '', '', '', '', '', '', ''
    ]);
    echo "BASIC SAVE: OK\n";
    // Clean up
    $pdo->prepare("DELETE FROM schools WHERE id = ?")->execute([$id]);
} catch (Exception $e) {
    echo "BASIC SAVE ERROR: " . $e->getMessage() . "\n";
    echo "LINE: " . $e->getLine() . "\n";
}

// Now test processImageField  
echo "\n=== PROCESS IMAGE TEST ===\n";
try {
    $result = processImageField('', 'test');
    echo "processImageField(''): '" . $result . "'\n";
    $result2 = processImageField('/uploads/existing.webp', 'test');
    echo "processImageField('/uploads/...'): '" . $result2 . "'\n";
} catch (Exception $e) {
    echo "processImageField ERROR: " . $e->getMessage() . "\n";
}

// Test with JSON type
echo "\n=== JSON TYPE TEST ===\n";
try {
    $type = json_encode(["Arabic", "Languages"]);
    echo "Type JSON: " . $type . "\n";
} catch (Exception $e) {
    echo "JSON ERROR: " . $e->getMessage() . "\n";
}

// Check the actual school data that get_site_data returns
echo "\n=== FIRST SCHOOL DATA ===\n";
$school = $pdo->query("SELECT id, name, type, mainimage FROM schools LIMIT 1")->fetch();
echo "id: " . $school['id'] . "\n";
echo "name: " . $school['name'] . "\n";
echo "type: " . $school['type'] . "\n";
echo "mainimage: " . substr($school['mainimage'] ?? '', 0, 50) . "\n";

echo "\nDONE\n";

// Cleanup
unlink(__FILE__);