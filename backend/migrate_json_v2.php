<?php
/**
 * Migration Script v2: JSON Settings → Database Tables
 * SAFE VERSION: No deletion, batch commits, progress tracking, resume support
 * 
 * Usage: php migrate_json_v2.php
 * Or via browser: https://your-site.com/migrate_json_v2.php
 */

// ═══════════════════════════════════════════════════════════════════════════
// 0. FIND DB CONFIG (supports multiple locations like api.php)
// ═══════════════════════════════════════════════════════════════════════════
$dbConfigFound = false;
$dbConfigPaths = [
    __DIR__ . '/db_config.php',
    __DIR__ . '/backend/db_config.php',
    $_SERVER['DOCUMENT_ROOT'] . '/db_config.php',
    $_SERVER['DOCUMENT_ROOT'] . '/backend/db_config.php',
];

foreach ($dbConfigPaths as $dbConfigPath) {
    if (file_exists($dbConfigPath)) {
        require_once $dbConfigPath;
        $dbConfigFound = true;
        break;
    }
}

if (!$dbConfigFound) {
    die("❌ Error: db_config.php not found. Searched in:\n" . implode("\n", $dbConfigPaths));
}

// ═══════════════════════════════════════════════════════════════════════════
// 1. CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════
ini_set('memory_limit', '512M');
set_time_limit(0);
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Output buffering for real-time progress in browser
if (ob_get_level() == 0) {
    ob_start();
}
ob_implicit_flush(true);
ob_end_flush();

$logFile = __DIR__ . '/migration_errors_' . date('Ymd_His') . '.log';
$batchSize = 50;

// ═══════════════════════════════════════════════════════════════════════════
// 2. HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

function logError(string $msg): void {
    global $logFile;
    file_put_contents($logFile, date('[Y-m-d H:i:s] ') . $msg . PHP_EOL, FILE_APPEND);
}

function progress(string $msg): void {
    echo $msg . "\n";
    // For browser output
    echo str_pad('', 4096) . "\n";
    flush();
    if (function_exists('ob_flush')) {
        ob_flush();
    }
}

function formatBytes(int $bytes): string {
    $units = ['B', 'KB', 'MB', 'GB'];
    $unitIndex = 0;
    while ($bytes >= 1024 && $unitIndex < count($units) - 1) {
        $bytes /= 1024;
        $unitIndex++;
    }
    return round($bytes, 2) . ' ' . $units[$unitIndex];
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. MIGRATION FUNCTION
// ═══════════════════════════════════════════════════════════════════════════

function migrateTable(string $settingKey, string $tableName, callable $inserter): void {
    global $pdo, $batchSize;
    
    progress("\n═══════════════════════════════════════════════════════════════════");
    progress("  Migrating: {$settingKey} → {$tableName}");
    progress("═══════════════════════════════════════════════════════════════════");
    
    // Get JSON data from settings
    $stmt = $pdo->prepare("SELECT setting_value FROM settings WHERE setting_key = ?");
    $stmt->execute([$settingKey]);
    $row = $stmt->fetch();
    
    if (!$row || empty($row['setting_value'])) {
        progress("  ℹ️  No data found in settings for '{$settingKey}'");
        return;
    }
    
    // Decode JSON
    $jsonSize = strlen($row['setting_value']);
    progress("  📦 JSON size: " . formatBytes($jsonSize));
    
    $data = json_decode($row['setting_value'], true);
    if (!is_array($data)) {
        progress("  ⚠️  Invalid JSON format for '{$settingKey}'");
        logError("Invalid JSON format for {$settingKey}");
        return;
    }
    
    $total = count($data);
    progress("  📊 Total records in JSON: {$total}");
    
    // Check existing count in table
    $existingCount = $pdo->query("SELECT COUNT(*) FROM {$tableName}")->fetchColumn();
    progress("  📊 Existing records in table: {$existingCount}");
    progress("  🎯 Records to migrate (estimated): " . max(0, $total - $existingCount));
    
    $migrated = 0;
    $skipped = 0;
    $errors = 0;
    $batchCount = 0;
    
    // Start transaction for first batch
    $pdo->beginTransaction();
    
    $startTime = microtime(true);
    
    foreach ($data as $index => $item) {
        $current = $index + 1;
        
        // Print progress every 10 records
        if ($current % 10 === 0 || $current === $total || $current === 1) {
            $percent = round(($current / $total) * 100, 1);
            progress("  ⏳ Processing {$current}/{$total} ({$percent}%)...");
        }
        
        try {
            $result = $inserter($item, $pdo);
            
            if ($result === 'exists') {
                $skipped++;
            } elseif ($result === true) {
                $migrated++;
                $batchCount++;
            }
            
            // Commit every batch
            if ($batchCount >= $batchSize) {
                $pdo->commit();
                progress("  💾 Batch committed ({$migrated} migrated so far)");
                $pdo->beginTransaction();
                $batchCount = 0;
            }
            
        } catch (Exception $e) {
            $errors++;
            $id = $item['id'] ?? 'unknown';
            $errorMsg = "Error on {$tableName} ID {$id}: " . $e->getMessage();
            logError($errorMsg);
            progress("    ⚠️  Skipped: " . substr($e->getMessage(), 0, 100));
            // Continue to next record - don't stop!
        }
    }
    
    // Final commit for remaining records
    $pdo->commit();
    
    $elapsed = round(microtime(true) - $startTime, 2);
    $finalCount = $pdo->query("SELECT COUNT(*) FROM {$tableName}")->fetchColumn();
    
    progress("\n  ✅ {$tableName} Migration Complete!");
    progress("     ⏱️  Time: {$elapsed} seconds");
    progress("     ✅ Migrated: {$migrated}");
    progress("     ⏭️  Skipped (already exist): {$skipped}");
    progress("     ❌ Errors: {$errors}");
    progress("     📊 Total in table now: {$finalCount}");
    progress("     📊 Remaining in JSON: " . max(0, $total - $finalCount));
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. MIGRATION LOGIC FOR EACH TABLE
// ═══════════════════════════════════════════════════════════════════════════

progress("🚀 Starting Migration v2");
progress("Date: " . date('Y-m-d H:i:s'));
progress("Memory limit: " . ini_get('memory_limit'));
progress("Batch size: {$batchSize}");
progress("Log file: {$logFile}");
progress("IMPORTANT: This script will NOT delete any data!");
progress("It only INSERTS new records that don't already exist.\n");

// ── 1. MIGRATE ADMISSIONS ─────────────────────────────────────────────────
migrateTable('admissions', 'admissions', function($old, $pdo) {
    $id = $old['id'] ?? uniqid('ADM_');
    
    // Check if already exists
    $checkStmt = $pdo->prepare("SELECT id FROM admissions WHERE id = ?");
    $checkStmt->execute([$id]);
    if ($checkStmt->fetch()) {
        return 'exists';
    }
    
    $stmt = $pdo->prepare("
        INSERT INTO admissions (
            id, application_number, student_name, student_name_ar, 
            student_national_id, student_dob, grade_stage, grade_class,
            parent_name, parent_name_ar, parent_phone, parent_email, 
            parent_national_id, parent_job, address, has_sibling, sibling_school,
            passport_number, id_type, documents, status, accepted_school_id, 
            admin_notes, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    
    $stmt->execute([
        $id,
        null, // No application number for old entries
        $old['studentName'] ?? '',
        $old['studentNameAr'] ?? '',
        $old['studentNationalId'] ?? null,
        !empty($old['studentDob']) ? $old['studentDob'] : null,
        $old['grade'] ?? ($old['gradeStage'] ?? ''),
        $old['gradeClass'] ?? '',
        $old['parentName'] ?? '',
        $old['parentNameAr'] ?? '',
        $old['parentPhone'] ?? '',
        $old['parentEmail'] ?? '',
        $old['parentNationalId'] ?? '',
        $old['parentJob'] ?? '',
        $old['address'] ?? '',
        ($old['hasSibling'] ?? false) ? 1 : 0,
        $old['siblingSchool'] ?? '',
        $old['passportNumber'] ?? null,
        $old['idType'] ?? 'national_id',
        json_encode($old['documents'] ?? [], JSON_UNESCAPED_UNICODE),
        $old['status'] ?? 'pending',
        $old['acceptedSchoolId'] ?? null,
        $old['adminNotes'] ?? '',
        !empty($old['createdAt']) ? $old['createdAt'] : date('Y-m-d H:i:s')
    ]);
    
    // Insert preferences if exist
    if (isset($old['preferences']) && is_array($old['preferences']) && count($old['preferences']) > 0) {
        $prefStmt = $pdo->prepare("
            INSERT INTO admission_preferences (id, admission_id, school_id, preference_order)
            VALUES (?, ?, ?, ?)
        ");
        
        foreach ($old['preferences'] as $index => $pref) {
            $prefId = $id . '_pref_' . ($index + 1);
            
            // Check if preference already exists
            $checkPref = $pdo->prepare("SELECT id FROM admission_preferences WHERE id = ?");
            $checkPref->execute([$prefId]);
            if ($checkPref->fetch()) {
                continue;
            }
            
            $schoolId = is_array($pref) ? ($pref['schoolId'] ?? $pref) : $pref;
            $prefStmt->execute([
                $prefId,
                $id,
                $schoolId,
                $index + 1
            ]);
        }
    }
    
    return true;
});

// ── 2. MIGRATE COMPLAINTS ─────────────────────────────────────────────────
migrateTable('complaints', 'complaints', function($old, $pdo) {
    $id = $old['id'] ?? uniqid('COMP_');
    
    $checkStmt = $pdo->prepare("SELECT id FROM complaints WHERE id = ?");
    $checkStmt->execute([$id]);
    if ($checkStmt->fetch()) {
        return 'exists';
    }
    
    $stmt = $pdo->prepare("
        INSERT INTO complaints (
            id, complaint_number, full_name, email, phone, 
            message_type, school, message, status, admin_response, 
            priority, assigned_to, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    
    $stmt->execute([
        $id,
        $old['complaintNumber'] ?? null,
        $old['fullName'] ?? '',
        $old['email'] ?? '',
        $old['phone'] ?? '',
        $old['messageType'] ?? '',
        $old['school'] ?? '',
        $old['message'] ?? '',
        $old['status'] ?? 'pending',
        $old['adminResponse'] ?? '',
        $old['priority'] ?? 'medium',
        $old['assignedTo'] ?? null,
        !empty($old['createdAt']) ? $old['createdAt'] : date('Y-m-d H:i:s')
    ]);
    
    return true;
});

// ── 3. MIGRATE CONTACT MESSAGES ────────────────────────────────────────────
migrateTable('contactMessages', 'contact_messages', function($old, $pdo) {
    $id = $old['id'] ?? uniqid('MSG_');
    
    $checkStmt = $pdo->prepare("SELECT id FROM contact_messages WHERE id = ?");
    $checkStmt->execute([$id]);
    if ($checkStmt->fetch()) {
        return 'exists';
    }
    
    $stmt = $pdo->prepare("
        INSERT INTO contact_messages (
            id, message_number, full_name, email, phone, 
            subject, message, status, admin_notes, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    
    $stmt->execute([
        $id,
        $old['messageNumber'] ?? null,
        $old['fullName'] ?? '',
        $old['email'] ?? '',
        $old['phone'] ?? '',
        $old['subject'] ?? '',
        $old['message'] ?? '',
        $old['status'] ?? 'pending',
        $old['adminNotes'] ?? '',
        !empty($old['createdAt']) ? $old['createdAt'] : date('Y-m-d H:i:s')
    ]);
    
    return true;
});

// ── 4. MIGRATE JOB APPLICATIONS ────────────────────────────────────────────
migrateTable('jobApplications', 'job_applications', function($old, $pdo) {
    $id = $old['id'] ?? uniqid('JOBAPP_');
    
    $checkStmt = $pdo->prepare("SELECT id FROM job_applications WHERE id = ?");
    $checkStmt->execute([$id]);
    if ($checkStmt->fetch()) {
        return 'exists';
    }
    
    $stmt = $pdo->prepare("
        INSERT INTO job_applications (
            id, application_number, job_id, full_name, email, phone,
            resume_path, cover_letter, experience_years, current_employer,
            education_level, status, admin_notes, interview_date, applied_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    
    $stmt->execute([
        $id,
        $old['applicationNumber'] ?? null,
        $old['jobId'] ?? ($old['job'] ?? ''),
        $old['fullName'] ?? '',
        $old['email'] ?? '',
        $old['phone'] ?? '',
        $old['resume'] ?? ($old['resumePath'] ?? ''),
        $old['coverLetter'] ?? '',
        !empty($old['experienceYears']) ? intval($old['experienceYears']) : null,
        $old['currentEmployer'] ?? '',
        $old['educationLevel'] ?? '',
        $old['status'] ?? 'pending',
        $old['adminNotes'] ?? '',
        !empty($old['interviewDate']) ? $old['interviewDate'] : null,
        !empty($old['appliedAt']) ? $old['appliedAt'] : (!empty($old['createdAt']) ? $old['createdAt'] : date('Y-m-d H:i:s'))
    ]);
    
    return true;
});

// ── 5. MIGRATE JOB DEPARTMENTS ─────────────────────────────────────────────
migrateTable('jobDepartments', 'job_departments', function($old, $pdo) {
    $id = $old['id'] ?? uniqid('DEPT_');
    
    $checkStmt = $pdo->prepare("SELECT id FROM job_departments WHERE id = ?");
    $checkStmt->execute([$id]);
    if ($checkStmt->fetch()) {
        return 'exists';
    }
    
    // Get next sort order
    $maxSort = $pdo->query("SELECT MAX(sort_order) FROM job_departments")->fetchColumn();
    $nextSort = ($maxSort !== null) ? intval($maxSort) + 1 : 1;
    
    $stmt = $pdo->prepare("
        INSERT INTO job_departments (id, name, name_ar, description, sort_order, is_active)
        VALUES (?, ?, ?, ?, ?, ?)
    ");
    
    $stmt->execute([
        $id,
        $old['name'] ?? ($old['nameEn'] ?? ''),
        $old['nameAr'] ?? '',
        $old['description'] ?? '',
        $nextSort,
        ($old['isActive'] ?? true) ? 1 : 0
    ]);
    
    return true;
});

// ═══════════════════════════════════════════════════════════════════════════
// 5. FINAL SUMMARY
// ═══════════════════════════════════════════════════════════════════════════

progress("\n═══════════════════════════════════════════════════════════════════");
progress("  ✅ MIGRATION v2 COMPLETE!");
progress("═══════════════════════════════════════════════════════════════════");
progress("\n📊 Summary:");
progress("  • Check log file for any errors:");
progress("    {$logFile}");
progress("\n🔒 IMPORTANT:");
progress("  • NO data was deleted from settings table");
progress("  • NO data was deleted from any table");
progress("  • Only NEW records were inserted");
progress("\n📝 Next Steps:");
progress("  1. Verify data in phpMyAdmin");
progress("  2. Run comparison query to confirm all migrated");
progress("  3. Only THEN clear JSON from settings (MANUAL)");
progress("  4. DELETE this script from server");
progress("\n✅ Done!\n");

// Output any remaining buffer
if (ob_get_level() > 0) {
    ob_end_flush();
}
