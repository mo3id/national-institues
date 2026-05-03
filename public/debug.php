<?php
header('Content-Type: text/plain; charset=UTF-8');
$root = $_SERVER['DOCUMENT_ROOT'];

// Load DB
$env = parse_ini_file($root . '/.env');
$pdo = new PDO("mysql:host={$env['DB_HOST']};dbname={$env['DB_NAME']};charset=utf8mb4", $env['DB_USER'], $env['DB_PASS']);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

echo "=== TEST 1: Simple admission query ===\n";
try {
    $stmt = $pdo->prepare("SELECT * FROM admissions LIMIT 1");
    $stmt->execute();
    $row = $stmt->fetch();
    echo "OK - got: " . $row['id'] . " / " . ($row['application_number'] ?? 'NULL') . "\n";
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}

echo "\n=== TEST 2: Check admission_preferences table ===\n";
try {
    $stmt = $pdo->query("SHOW TABLES LIKE 'admission_preferences'");
    $result = $stmt->fetch();
    echo "admission_preferences table exists: " . ($result ? 'YES' : 'NO') . "\n";
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}

echo "\n=== TEST 3: Check modification_requests table ===\n";
try {
    $stmt = $pdo->query("SHOW TABLES LIKE 'modification_requests'");
    $result = $stmt->fetch();
    echo "modification_requests table exists: " . ($result ? 'YES' : 'NO') . "\n";
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}

echo "\n=== TEST 4: Check schools table columns ===\n";
try {
    $cols = $pdo->query("DESCRIBE schools")->fetchAll(PDO::FETCH_COLUMN);
    echo "Columns: " . implode(', ', $cols) . "\n";
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}

echo "\n=== TEST 5: Check admissions table columns ===\n";
try {
    $cols = $pdo->query("DESCRIBE admissions")->fetchAll(PDO::FETCH_COLUMN);
    echo "Columns: " . implode(', ', $cols) . "\n";
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}

echo "\n=== TEST 6: Run get_admission_status query ===\n";
try {
    $nationalId = '32101240201022';
    $stmt = $pdo->prepare("
        SELECT a.*, s.name as accepted_school_name, s.name_ar as accepted_school_name_ar
        FROM admissions a
        LEFT JOIN schools s ON a.accepted_school_id = s.id
        WHERE a.student_national_id = ?
    ");
    $stmt->execute([$nationalId]);
    $admission = $stmt->fetch();
    if ($admission) {
        echo "FOUND: " . $admission['id'] . " / " . $admission['application_number'] . "\n";
    } else {
        echo "NOT FOUND\n";
    }
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}

echo "\n=== TEST 7: Check admission_preferences for this admission ===\n";
try {
    $stmt = $pdo->query("SELECT COUNT(*) FROM admission_preferences");
    echo "Total preferences: " . $stmt->fetchColumn() . "\n";
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}

echo "\n=== TEST 8: Run PHP error log ===\n";
echo "PHP error log: " . ini_get('error_log') . "\n";

// Cleanup
unlink(__FILE__);
echo "\n=== DONE (self-deleting) ===\n";