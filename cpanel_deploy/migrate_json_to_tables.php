<?php
/**
 * Migration Script: Convert JSON settings to Database Tables
 * KEEPS ALL OLD IDs - only new entries get new number format with dynamic year
 * Run once after creating the new tables
 * 
 * Usage: php migrate_json_to_tables.php
 */

require_once 'db_config.php';

// Disable time limit for large datasets
set_time_limit(0);

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

$pdo->beginTransaction();
$errors = [];
$migrated = [
    'admissions' => 0,
    'complaints' => 0,
    'contact_messages' => 0,
    'job_applications' => 0,
    'job_departments' => 0
];

echo "═══════════════════════════════════════════════════════════════════\n";
echo "  MIGRATION SCRIPT: JSON Settings → Database Tables\n";
echo "  Date: " . date('Y-m-d H:i:s') . "\n";
echo "═══════════════════════════════════════════════════════════════════\n\n";

try {
    // ═══════════════════════════════════════════════════════════════════════════
    // 1. Migrate Admissions (Critical)
    // ═══════════════════════════════════════════════════════════════════════════
    echo "[1/5] Migrating Admissions...\n";
    
    $stmt = $pdo->query("SELECT setting_value FROM settings WHERE setting_key = 'admissions'");
    $row = $stmt->fetch();
    
    if ($row && !empty($row['setting_value'])) {
        $admissions = json_decode($row['setting_value'], true);
        
        if (!is_array($admissions)) {
            echo "  ⚠️  Invalid admissions data format\n";
        } else {
            foreach ($admissions as $old) {
                // Keep original ID (e.g., adm_xxxxx)
                $id = $old['id'] ?? uniqid('ADM_');
                
                // For OLD entries: NO application_number (null)
                // Only NEW entries after migration will get APP-YYYY-XXX-NNNN format
                $applicationNumber = null;
                
                try {
                    // Check if admission already exists
                    $checkStmt = $pdo->prepare("SELECT id FROM admissions WHERE id = ?");
                    $checkStmt->execute([$id]);
                    if ($checkStmt->fetch()) {
                        echo "  ℹ️  Admission {$id} already exists, skipping...\n";
                        continue;
                    }
                    
                    $stmt = $pdo->prepare("
                        INSERT INTO admissions (
                            id, application_number, student_name, student_name_ar, 
                            student_national_id, student_dob, grade_stage, grade_class,
                            parent_name, parent_name_ar, parent_phone, parent_email, 
                            parent_national_id, address, has_sibling, sibling_school,
                            documents, status, accepted_school_id, admin_notes, created_at
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ");
                    
                    $stmt->execute([
                        $id,
                        $applicationNumber, // null for old entries
                        $old['studentName'] ?? '',
                        $old['studentNameAr'] ?? '',
                        $old['studentNationalId'] ?? '',
                        !empty($old['studentDob']) ? $old['studentDob'] : null,
                        $old['grade'] ?? '',
                        $old['gradeClass'] ?? '',
                        $old['parentName'] ?? '',
                        $old['parentNameAr'] ?? '',
                        $old['parentPhone'] ?? '',
                        $old['parentEmail'] ?? '',
                        $old['parentNationalId'] ?? '',
                        $old['address'] ?? '',
                        ($old['hasSibling'] ?? false) ? 1 : 0,
                        $old['siblingSchool'] ?? '',
                        json_encode($old['documents'] ?? []),
                        $old['status'] ?? 'pending',
                        $old['acceptedSchoolId'] ?? null,
                        $old['adminNotes'] ?? '',
                        !empty($old['createdAt']) ? $old['createdAt'] : date('c')
                    ]);
                    
                    // Insert preferences
                    if (isset($old['preferences']) && is_array($old['preferences'])) {
                        $prefStmt = $pdo->prepare("
                            INSERT INTO admission_preferences (id, admission_id, school_id, preference_order)
                            VALUES (?, ?, ?, ?)
                        ");
                        
                        foreach ($old['preferences'] as $index => $pref) {
                            // Check if preference already exists
                            $prefId = $id . '_pref_' . ($index + 1);
                            $checkPrefStmt = $pdo->prepare("
                                SELECT id FROM admission_preferences WHERE id = ?
                            ");
                            $checkPrefStmt->execute([$prefId]);
                            if ($checkPrefStmt->fetch()) {
                                continue; // Skip if exists
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
                    
                    $migrated['admissions']++;
                    
                } catch (Exception $e) {
                    $errors[] = "Admission {$id}: " . $e->getMessage();
                    echo "  ⚠️  Skipped admission {$id}: " . $e->getMessage() . "\n";
                }
            }
        }
        
        echo "  ✅ Migrated {$migrated['admissions']} admissions\n";
    } else {
        echo "  ℹ️  No admissions found in settings\n";
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 2. Migrate Complaints
    // ═══════════════════════════════════════════════════════════════════════════
    echo "\n[2/5] Migrating Complaints...\n";
    
    $stmt = $pdo->query("SELECT setting_value FROM settings WHERE setting_key = 'complaints'");
    $row = $stmt->fetch();
    
    if ($row && !empty($row['setting_value'])) {
        $complaints = json_decode($row['setting_value'], true);
        
        if (!is_array($complaints)) {
            echo "  ⚠️  Invalid complaints data format\n";
        } else {
            foreach ($complaints as $old) {
                $id = $old['id'] ?? uniqid('COMP_');
                $complaintNumber = null; // No number for old entries
                
                try {
                    // Check if exists
                    $checkStmt = $pdo->prepare("SELECT id FROM complaints WHERE id = ?");
                    $checkStmt->execute([$id]);
                    if ($checkStmt->fetch()) {
                        continue;
                    }
                    
                    $stmt = $pdo->prepare("
                        INSERT INTO complaints (
                            id, complaint_number, full_name, email, phone, 
                            message_type, school, message, status, admin_response, 
                            priority, created_at
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ");
                    
                    $stmt->execute([
                        $id,
                        $complaintNumber,
                        $old['fullName'] ?? '',
                        $old['email'] ?? '',
                        $old['phone'] ?? '',
                        $old['messageType'] ?? '',
                        $old['school'] ?? '',
                        $old['message'] ?? '',
                        $old['status'] ?? 'pending',
                        $old['adminResponse'] ?? '',
                        $old['priority'] ?? 'medium',
                        !empty($old['createdAt']) ? $old['createdAt'] : date('c')
                    ]);
                    
                    $migrated['complaints']++;
                    
                } catch (Exception $e) {
                    $errors[] = "Complaint {$id}: " . $e->getMessage();
                    echo "  ⚠️  Skipped complaint {$id}: " . $e->getMessage() . "\n";
                }
            }
        }
        
        echo "  ✅ Migrated {$migrated['complaints']} complaints\n";
    } else {
        echo "  ℹ️  No complaints found in settings\n";
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 3. Migrate Contact Messages
    // ═══════════════════════════════════════════════════════════════════════════
    echo "\n[3/5] Migrating Contact Messages...\n";
    
    $stmt = $pdo->query("SELECT setting_value FROM settings WHERE setting_key = 'contactMessages'");
    $row = $stmt->fetch();
    
    if ($row && !empty($row['setting_value'])) {
        $messages = json_decode($row['setting_value'], true);
        
        if (!is_array($messages)) {
            echo "  ⚠️  Invalid messages data format\n";
        } else {
            foreach ($messages as $old) {
                $id = $old['id'] ?? uniqid('MSG_');
                $messageNumber = null;
                
                try {
                    // Check if exists
                    $checkStmt = $pdo->prepare("SELECT id FROM contact_messages WHERE id = ?");
                    $checkStmt->execute([$id]);
                    if ($checkStmt->fetch()) {
                        continue;
                    }
                    
                    $stmt = $pdo->prepare("
                        INSERT INTO contact_messages (
                            id, message_number, full_name, email, phone, 
                            subject, message, status, created_at
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ");
                    
                    $stmt->execute([
                        $id,
                        $messageNumber,
                        $old['fullName'] ?? '',
                        $old['email'] ?? '',
                        $old['phone'] ?? '',
                        $old['subject'] ?? '',
                        $old['message'] ?? '',
                        $old['status'] ?? 'pending',
                        !empty($old['createdAt']) ? $old['createdAt'] : date('c')
                    ]);
                    
                    $migrated['contact_messages']++;
                    
                } catch (Exception $e) {
                    $errors[] = "Message {$id}: " . $e->getMessage();
                    echo "  ⚠️  Skipped message {$id}: " . $e->getMessage() . "\n";
                }
            }
        }
        
        echo "  ✅ Migrated {$migrated['contact_messages']} messages\n";
    } else {
        echo "  ℹ️  No messages found in settings\n";
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 4. Migrate Job Applications
    // ═══════════════════════════════════════════════════════════════════════════
    echo "\n[4/5] Migrating Job Applications...\n";
    
    $stmt = $pdo->query("SELECT setting_value FROM settings WHERE setting_key = 'jobApplications'");
    $row = $stmt->fetch();
    
    if ($row && !empty($row['setting_value'])) {
        $applications = json_decode($row['setting_value'], true);
        
        if (!is_array($applications)) {
            echo "  ⚠️  Invalid job applications data format\n";
        } else {
            foreach ($applications as $old) {
                $id = $old['id'] ?? uniqid('JOBAPP_');
                $applicationNumber = null;
                
                try {
                    // Check if exists
                    $checkStmt = $pdo->prepare("SELECT id FROM job_applications WHERE id = ?");
                    $checkStmt->execute([$id]);
                    if ($checkStmt->fetch()) {
                        continue;
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
                        $applicationNumber,
                        $old['jobId'] ?? '',
                        $old['fullName'] ?? '',
                        $old['email'] ?? '',
                        $old['phone'] ?? '',
                        $old['resume'] ?? '',
                        $old['coverLetter'] ?? '',
                        !empty($old['experienceYears']) ? intval($old['experienceYears']) : null,
                        $old['currentEmployer'] ?? '',
                        $old['educationLevel'] ?? '',
                        $old['status'] ?? 'pending',
                        $old['adminNotes'] ?? '',
                        !empty($old['interviewDate']) ? $old['interviewDate'] : null,
                        !empty($old['appliedAt']) ? $old['appliedAt'] : date('c')
                    ]);
                    
                    $migrated['job_applications']++;
                    
                } catch (Exception $e) {
                    $errors[] = "Job Application {$id}: " . $e->getMessage();
                    echo "  ⚠️  Skipped job application {$id}: " . $e->getMessage() . "\n";
                }
            }
        }
        
        echo "  ✅ Migrated {$migrated['job_applications']} job applications\n";
    } else {
        echo "  ℹ️  No job applications found in settings\n";
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 5. Migrate Job Departments
    // ═══════════════════════════════════════════════════════════════════════════
    echo "\n[5/5] Migrating Job Departments...\n";
    
    $stmt = $pdo->query("SELECT setting_value FROM settings WHERE setting_key = 'jobDepartments'");
    $row = $stmt->fetch();
    
    if ($row && !empty($row['setting_value'])) {
        $departments = json_decode($row['setting_value'], true);
        
        if (!is_array($departments)) {
            echo "  ⚠️  Invalid departments data format\n";
        } else {
            $sortOrder = 1;
            
            foreach ($departments as $old) {
                $id = $old['id'] ?? uniqid('DEPT_');
                
                try {
                    // Check if exists
                    $checkStmt = $pdo->prepare("SELECT id FROM job_departments WHERE id = ?");
                    $checkStmt->execute([$id]);
                    if ($checkStmt->fetch()) {
                        continue;
                    }
                    
                    $stmt = $pdo->prepare("
                        INSERT INTO job_departments (id, name, name_ar, sort_order, is_active)
                        VALUES (?, ?, ?, ?, ?)
                    ");
                    
                    $stmt->execute([
                        $id,
                        $old['name'] ?? '',
                        $old['nameAr'] ?? '',
                        $sortOrder++,
                        ($old['isActive'] ?? true) ? 1 : 0
                    ]);
                    
                    $migrated['job_departments']++;
                    
                } catch (Exception $e) {
                    $errors[] = "Department {$id}: " . $e->getMessage();
                    echo "  ⚠️  Skipped department {$id}: " . $e->getMessage() . "\n";
                }
            }
        }
        
        echo "  ✅ Migrated {$migrated['job_departments']} departments\n";
    } else {
        echo "  ℹ️  No departments found in settings\n";
    }
    
    // Commit all changes
    $pdo->commit();
    
    echo "\n═══════════════════════════════════════════════════════════════════\n";
    echo "  ✅ MIGRATION COMPLETED SUCCESSFULLY!\n";
    echo "═══════════════════════════════════════════════════════════════════\n";
    echo "\n📊 Migration Summary:\n";
    echo "  • Admissions:        {$migrated['admissions']} records\n";
    echo "  • Complaints:        {$migrated['complaints']} records\n";
    echo "  • Contact Messages:  {$migrated['contact_messages']} records\n";
    echo "  • Job Applications:  {$migrated['job_applications']} records\n";
    echo "  • Job Departments:   {$migrated['job_departments']} records\n";
    echo "\n🔑 Key Points:\n";
    echo "  • All old IDs: PRESERVED (no changes)\n";
    echo "  • Old entries: NO application/complaint/message numbers\n";
    echo "  • New entries: Will get APP-YYYY-XXX-NNNN format with dynamic year\n";
    echo "  • Example for 2026: APP-2026-001-5847, MOD-2026-001-5847\n";
    echo "  • Example for 2027: APP-2027-001-5847, MOD-2027-001-5847\n";
    
    if (!empty($errors)) {
        echo "\n⚠️  Warnings (" . count($errors) . " items skipped):\n";
        foreach (array_slice($errors, 0, 5) as $error) {
            echo "  - {$error}\n";
        }
        if (count($errors) > 5) {
            echo "  ... and " . (count($errors) - 5) . " more\n";
        }
    }
    
    echo "\n📝 Next Steps:\n";
    echo "  1. Verify migrated data in database\n";
    echo "  2. Update API endpoints to use new tables\n";
    echo "  3. Test new admission submission (should get APP-" . date('Y') . "-XXX-NNNN)\n";
    echo "  4. Test modification workflow\n";
    echo "  5. Deploy to production\n";
    
} catch (Exception $e) {
    $pdo->rollBack();
    echo "\n❌ MIGRATION FAILED!\n";
    echo "Error: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
    exit(1);
}

echo "\n✅ Done!\n";
?>
