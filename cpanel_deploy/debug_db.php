<?php
/**
 * Debug script to check database tables and test queries
 * Run this in browser: https://gani.edu.eg/debug_db.php
 */

require_once 'db_config.php';

header('Content-Type: text/plain; charset=utf-8');

echo "=== DATABASE DEBUG ===\n\n";

try {
    // Check if tables exist
    echo "1. Checking tables...\n";
    $tables = ['jobs', 'job_applications', 'complaints', 'contact_messages', 'admissions'];
    foreach ($tables as $table) {
        $stmt = $pdo->query("SHOW TABLES LIKE '{$table}'");
        $exists = $stmt->fetch() ? 'EXISTS' : 'MISSING';
        echo "   {$table}: {$exists}\n";
    }
    
    echo "\n2. Checking jobs table columns...\n";
    $stmt = $pdo->query("DESCRIBE jobs");
    while ($col = $stmt->fetch()) {
        echo "   {$col['Field']} ({$col['Type']})\n";
    }
    
    echo "\n3. Checking job_applications table columns...\n";
    $stmt = $pdo->query("DESCRIBE job_applications");
    while ($col = $stmt->fetch()) {
        echo "   {$col['Field']} ({$col['Type']})\n";
    }
    
    echo "\n4. Testing simple job_applications query...\n";
    $stmt = $pdo->query("SELECT * FROM job_applications LIMIT 1");
    $row = $stmt->fetch();
    if ($row) {
        echo "   SUCCESS - Found row with ID: {$row['id']}\n";
        echo "   job_id: " . ($row['job_id'] ?? 'NULL') . "\n";
        echo "   full_name: " . ($row['full_name'] ?? 'NULL') . "\n";
    } else {
        echo "   Table is empty\n";
    }
    
    echo "\n5. Testing JOIN query...\n";
    $stmt = $pdo->query("SELECT ja.*, j.title AS jobTitle, j.titleAr AS jobTitleAr, j.department AS jobDepartment FROM job_applications ja LEFT JOIN jobs j ON ja.job_id COLLATE utf8mb4_unicode_ci = j.id COLLATE utf8mb4_unicode_ci LIMIT 1");
    $row = $stmt->fetch();
    if ($row) {
        echo "   SUCCESS - JOIN works\n";
        echo "   jobTitle: " . ($row['jobTitle'] ?? 'NULL') . "\n";
    } else {
        echo "   Table is empty\n";
    }
    
    echo "\n6. Testing complaints query...\n";
    $stmt = $pdo->query("SELECT * FROM complaints LIMIT 1");
    $row = $stmt->fetch();
    if ($row) {
        echo "   SUCCESS - Found row\n";
    } else {
        echo "   Table is empty\n";
    }
    
    echo "\n6. Testing admissions preferences JOIN...\n";
    $stmt = $pdo->query("SELECT ap.school_id, s.name FROM admission_preferences ap LEFT JOIN schools s ON ap.school_id COLLATE utf8mb4_unicode_ci = s.id COLLATE utf8mb4_unicode_ci LIMIT 1");
    $row = $stmt->fetch();
    if ($row) {
        echo "   SUCCESS - JOIN works\n";
    } else {
        echo "   Table is empty or error\n";
    }
    
    echo "\n=== ALL TESTS PASSED ===";
    
} catch (Exception $e) {
    echo "\n❌ ERROR: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . ":" . $e->getLine() . "\n";
}
