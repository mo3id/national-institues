<?php
/**
 * SAFE MIGRATION SCRIPT — Backup + Migrate in one step
 * يعمل backup أولاً ثم ينقل الداتا من settings JSON إلى الجداول
 * 
 * ⚠️  احذف هذا الملف فوراً بعد الانتهاء منه
 */

// ── Basic Security ─────────────────────────────────────────────────────────
define('SAFE_TOKEN', 'NIS_MIGRATE_2026');
$token = $_GET['token'] ?? '';
if ($token !== SAFE_TOKEN) {
    http_response_code(403);
    die('<h2 style="color:red;">403 Forbidden — يجب تمرير ?token=NIS_MIGRATE_2026</h2>');
}

$action = $_GET['action'] ?? 'status';

// ── Database Connection ───────────────────────────────────────────────────
// Fallback: check document root (when backend/ .env doesn't exist but root one does)
$envFile = $_SERVER['DOCUMENT_ROOT'] . '/.env';

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
    $pdo = new PDO("mysql:host={$host};dbname={$dbname};charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
} catch (PDOException $e) {
    die('<h2 style="color:red;">Database Connection Failed: ' . htmlspecialchars($e->getMessage()) . '</h2>');
}

set_time_limit(300);
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
<meta charset="UTF-8">
<title>Safe Migration Tool</title>
<style>
  body { font-family: monospace; background: #111; color: #eee; padding: 20px; }
  h1   { color: #00d4ff; }
  h2   { color: #ffaa00; }
  .ok  { color: #00ff88; }
  .err { color: #ff4444; }
  .warn{ color: #ffaa00; }
  .box { background: #1a1a1a; border: 1px solid #333; padding: 15px; margin: 10px 0; border-radius: 5px; }
  table{ border-collapse: collapse; width: 100%; }
  th,td{ border: 1px solid #444; padding: 8px 12px; text-align: right; }
  th   { background: #222; color: #00d4ff; }
  .btn { display:inline-block; background:#0066cc; color:#fff; padding:10px 20px;
         text-decoration:none; border-radius:5px; margin:5px; font-size:16px; }
  .btn-red { background:#cc0000; }
  .btn-green { background:#006600; }
  pre  { background:#000; padding:10px; overflow:auto; }
</style>
</head>
<body>
<h1>🛡️ Safe Migration Tool — National Institutes</h1>

<?php

// ══════════════════════════════════════════════════════════════════════════
// STATUS PAGE — عرض الأرقام الحالية
// ══════════════════════════════════════════════════════════════════════════
if ($action === 'status') {
    echo '<h2>📊 الوضع الحالي</h2><div class="box">';
    
    $tables = [
        'admissions'       => ['new_table' => 'admissions',      'settings_key' => 'admissions'],
        'complaints'       => ['new_table' => 'complaints',       'settings_key' => 'complaints'],
        'contact_messages' => ['new_table' => 'contact_messages', 'settings_key' => 'contactMessages'],
        'job_applications' => ['new_table' => 'job_applications', 'settings_key' => 'jobApplications'],
    ];
    
    echo '<table><tr><th>البيانات</th><th>في settings (القديم)</th><th>في الجدول الجديد</th><th>الحالة</th></tr>';
    
    foreach ($tables as $label => $info) {
        $oldCount = 0;
        $newCount = 0;
        
        try {
            $stmt = $pdo->prepare("SELECT JSON_LENGTH(setting_value) FROM settings WHERE setting_key = ?");
            $stmt->execute([$info['settings_key']]);
            $oldCount = (int)$stmt->fetchColumn() ?: 0;
        } catch(Exception $e) {}
        
        try {
            $stmt = $pdo->query("SELECT COUNT(*) FROM `{$info['new_table']}`");
            $newCount = (int)$stmt->fetchColumn();
        } catch(Exception $e) {}
        
        $missing = $oldCount - $newCount;
        $status = $missing > 0 
            ? "<span class='warn'>⚠️ {$missing} لم تُنقل</span>"
            : "<span class='ok'>✅ مكتمل</span>";
        
        echo "<tr><td>{$label}</td><td>{$oldCount}</td><td>{$newCount}</td><td>{$status}</td></tr>";
    }
    echo '</table></div>';

    // Check if backup tables exist
    $backupExists = false;
    try {
        $pdo->query("SELECT 1 FROM backup_settings_json LIMIT 1");
        $backupExists = true;
    } catch(Exception $e) {}
    
    echo '<h2>🎯 الإجراءات المتاحة</h2><div class="box">';
    
    if (!$backupExists) {
        echo '<p class="warn">⚠️ لا يوجد backup بعد — يجب عمل Backup أولاً قبل النقل</p>';
        echo '<a class="btn" href="?token='.SAFE_TOKEN.'&action=backup">1️⃣ عمل Backup الآن</a>';
    } else {
        echo '<p class="ok">✅ Backup موجود ومحفوظ في جدول backup_settings_json</p>';
        echo '<a class="btn btn-green" href="?token='.SAFE_TOKEN.'&action=migrate">2️⃣ تشغيل النقل الآن</a>';
        echo '<a class="btn btn-red" href="?token='.SAFE_TOKEN.'&action=restore" onclick="return confirm(\'هل أنت متأكد من الاستعادة؟\')">↩️ استعادة من Backup</a>';
    }
    echo '</div>';
}

// ══════════════════════════════════════════════════════════════════════════
// BACKUP
// ══════════════════════════════════════════════════════════════════════════
elseif ($action === 'backup') {
    echo '<h2>💾 جاري عمل Backup...</h2><div class="box"><pre>';
    
    try {
        // Create backup table for settings JSON
        $pdo->exec("DROP TABLE IF EXISTS backup_settings_json");
        $pdo->exec("CREATE TABLE backup_settings_json AS SELECT * FROM settings WHERE setting_key IN ('admissions','complaints','contactMessages','jobApplications')");
        
        $stmt = $pdo->query("SELECT COUNT(*) FROM backup_settings_json");
        $count = $stmt->fetchColumn();
        echo "<span class='ok'>✅ تم حفظ {$count} مفتاح في جدول backup_settings_json</span>\n";
        
        // Backup new tables too
        foreach (['admissions','complaints','contact_messages','job_applications'] as $tbl) {
            try {
                $pdo->exec("DROP TABLE IF EXISTS backup_{$tbl}");
                $pdo->exec("CREATE TABLE backup_{$tbl} AS SELECT * FROM {$tbl}");
                $stmt = $pdo->query("SELECT COUNT(*) FROM backup_{$tbl}");
                $n = $stmt->fetchColumn();
                echo "<span class='ok'>✅ backup_{$tbl}: {$n} سجل</span>\n";
            } catch(Exception $e) {
                echo "<span class='err'>❌ {$tbl}: " . $e->getMessage() . "</span>\n";
            }
        }
        
        echo "\n<span class='ok'>✅ تم الـ Backup بنجاح!</span>\n";
        echo "</pre>\n";
        echo '<a class="btn btn-green" href="?token='.SAFE_TOKEN.'&action=migrate">➡️ تشغيل النقل الآن</a>';
        echo '<a class="btn" href="?token='.SAFE_TOKEN.'&action=status">↩️ رجوع</a>';
        
    } catch(Exception $e) {
        echo "<span class='err'>❌ فشل الـ Backup: " . $e->getMessage() . "</span>\n</pre>";
    }
    echo '</div>';
}

// ══════════════════════════════════════════════════════════════════════════
// MIGRATE
// ══════════════════════════════════════════════════════════════════════════
elseif ($action === 'migrate') {
    echo '<h2>🚀 جاري نقل البيانات...</h2><div class="box"><pre>';
    
    $migrated = ['admissions'=>0,'complaints'=>0,'contact_messages'=>0,'job_applications'=>0];
    $skipped  = ['admissions'=>0,'complaints'=>0,'contact_messages'=>0,'job_applications'=>0];
    $errors   = [];
    
    $pdo->beginTransaction();
    try {
        
        // ── 1. Admissions ─────────────────────────────────────────────
        echo "[1/4] 📋 نقل طلبات التقديم...\n";
        $row = $pdo->query("SELECT setting_value FROM settings WHERE setting_key='admissions'")->fetch();
        if ($row) {
            $items = json_decode($row['setting_value'], true) ?? [];
            foreach ($items as $old) {
                $id = $old['id'] ?? uniqid('ADM_');
                $check = $pdo->prepare("SELECT id FROM admissions WHERE id=?");
                $check->execute([$id]);
                if ($check->fetch()) { $skipped['admissions']++; continue; }
                try {
                    $student_nid = mb_substr(trim($old['studentNationalId'] ?? ''), 0, 20, 'UTF-8');
                    $parent_nid = mb_substr(trim($old['parentNationalId'] ?? ''), 0, 20, 'UTF-8');
                    $parent_phone = mb_substr(trim($old['parentPhone'] ?? ''), 0, 50, 'UTF-8');
                    
                    try {
                        $pdo->prepare("
                            INSERT INTO admissions (
                                id, application_number, student_name, student_name_ar,
                                student_national_id, student_dob, grade_stage, grade_class,
                                parent_name, parent_name_ar, parent_phone, parent_email,
                                parent_national_id, address, has_sibling, sibling_school,
                                documents, status, accepted_school_id, admin_notes, created_at
                            ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
                        ")->execute([
                            $id, null,
                            $old['studentName'] ?? '', $old['studentNameAr'] ?? '',
                            $student_nid,
                            !empty($old['studentDob']) ? $old['studentDob'] : null,
                            $old['grade'] ?? $old['gradeStage'] ?? '',
                            $old['gradeClass'] ?? '',
                            $old['parentName'] ?? '', $old['parentNameAr'] ?? '',
                            $parent_phone, $old['parentEmail'] ?? '',
                            $parent_nid, $old['address'] ?? '',
                            ($old['hasSibling']??false)?1:0, $old['siblingSchool']??'',
                            json_encode($old['documents']??[]),
                            $old['status']??'pending',
                            $old['acceptedSchoolId']??null, $old['adminNotes']??'',
                            !empty($old['createdAt'])?$old['createdAt']:date('Y-m-d H:i:s')
                        ]);
                    } catch (PDOException $e) {
                        // If it's a duplicate entry for student_national_id, try modifying the ID slightly
                        if ($e->getCode() == 23000 && strpos($e->getMessage(), 'Duplicate entry') !== false) {
                            $student_nid = mb_substr($student_nid, 0, 15, 'UTF-8') . '-' . rand(100, 999);
                            $pdo->prepare("
                                INSERT INTO admissions (
                                    id, application_number, student_name, student_name_ar,
                                    student_national_id, student_dob, grade_stage, grade_class,
                                    parent_name, parent_name_ar, parent_phone, parent_email,
                                    parent_national_id, address, has_sibling, sibling_school,
                                    documents, status, accepted_school_id, admin_notes, created_at
                                ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
                            ")->execute([
                                $id, null,
                                $old['studentName'] ?? '', $old['studentNameAr'] ?? '',
                                $student_nid,
                                !empty($old['studentDob']) ? $old['studentDob'] : null,
                                $old['grade'] ?? $old['gradeStage'] ?? '',
                                $old['gradeClass'] ?? '',
                                $old['parentName'] ?? '', $old['parentNameAr'] ?? '',
                                $parent_phone, $old['parentEmail'] ?? '',
                                $parent_nid, $old['address'] ?? '',
                                ($old['hasSibling']??false)?1:0, $old['siblingSchool']??'',
                                json_encode($old['documents']??[]),
                                $old['status']??'pending',
                                $old['acceptedSchoolId']??null, $old['adminNotes']??'',
                                !empty($old['createdAt'])?$old['createdAt']:date('Y-m-d H:i:s')
                            ]);
                        } else {
                            throw $e; // Re-throw if it's a different error
                        }
                    }
                    
                    // Preferences
                    if (!empty($old['preferences'])) {
                        $ps = $pdo->prepare("INSERT IGNORE INTO admission_preferences (id,admission_id,school_id,preference_order) VALUES(?,?,?,?)");
                        foreach ($old['preferences'] as $i=>$pref) {
                            $sid = is_array($pref)?($pref['schoolId']??$pref):$pref;
                            $ps->execute([$id.'_pref_'.($i+1),$id,$sid,$i+1]);
                        }
                    }
                    $migrated['admissions']++;
                } catch(Exception $e) {
                    $errors[] = "ADM {$id}: ".$e->getMessage();
                }
            }
        }
        echo "  <span class='ok'>✅ منقول: {$migrated['admissions']} — متجاوز (موجود): {$skipped['admissions']}</span>\n\n";
        
        // ── 2. Complaints ──────────────────────────────────────────────
        echo "[2/4] 📣 نقل الشكاوي...\n";
        $row = $pdo->query("SELECT setting_value FROM settings WHERE setting_key='complaints'")->fetch();
        if ($row) {
            $items = json_decode($row['setting_value'], true) ?? [];
            foreach ($items as $old) {
                $id = $old['id'] ?? uniqid('COMP_');
                $check = $pdo->prepare("SELECT id FROM complaints WHERE id=?");
                $check->execute([$id]);
                if ($check->fetch()) { $skipped['complaints']++; continue; }
                
                try {
                    $c_name = mb_substr($old['fullName']??'', 0, 255, 'UTF-8');
                    $c_email = mb_substr($old['email']??'', 0, 255, 'UTF-8');
                    $c_phone = mb_substr($old['phone']??'', 0, 50, 'UTF-8');
                    $c_type = mb_substr($old['messageType']??'', 0, 50, 'UTF-8');
                    $c_school = mb_substr($old['school']??'', 0, 255, 'UTF-8');
                    $c_msg = mb_substr($old['message']??'', 0, 5000, 'UTF-8');
                    $c_status = mb_substr($old['status']??'pending', 0, 50, 'UTF-8');
                    $c_num = $old['complaintNumber'] ?? substr($id, 0, 20);

                    $pdo->prepare("
                        INSERT INTO complaints (id,complaint_number,full_name,email,phone,message_type,school,message,status,admin_response,created_at)
                        VALUES (?,?,?,?,?,?,?,?,?,?,?)
                    ")->execute([
                        $id, $c_num,
                        $c_name, $c_email, $c_phone,
                        $c_type, $c_school, $c_msg,
                        $c_status, $old['adminResponse']??$old['admin_response']??'',
                        !empty($old['createdAt'])?$old['createdAt']:date('Y-m-d H:i:s')
                    ]);
                    $migrated['complaints']++;
                } catch(Exception $e) {
                    $errors[] = "COMP {$id}: ".$e->getMessage();
                }
            }
        }
        echo "  <span class='ok'>✅ منقول: {$migrated['complaints']} — متجاوز: {$skipped['complaints']}</span>\n\n";
        
        // ── 3. Contact Messages ────────────────────────────────────────
        echo "[3/4] 📩 نقل رسائل التواصل...\n";
        $row = $pdo->query("SELECT setting_value FROM settings WHERE setting_key='contactMessages'")->fetch();
        if ($row) {
            $items = json_decode($row['setting_value'], true) ?? [];
            foreach ($items as $old) {
                $id = $old['id'] ?? uniqid('MSG_');
                $check = $pdo->prepare("SELECT id FROM contact_messages WHERE id=?");
                $check->execute([$id]);
                if ($check->fetch()) { $skipped['contact_messages']++; continue; }
                
                try {
                    $pdo->prepare("
                        INSERT INTO contact_messages (id,message_number,full_name,email,phone,subject,message,status,created_at)
                        VALUES (?,?,?,?,?,?,?,?,?)
                    ")->execute([
                        $id, null,
                        $old['fullName']??'', $old['email']??'', $old['phone']??'',
                        $old['subject']??'', $old['message']??'',
                        $old['status']??'pending',
                        !empty($old['createdAt'])?$old['createdAt']:date('Y-m-d H:i:s')
                    ]);
                    $migrated['contact_messages']++;
                } catch(Exception $e) {
                    $errors[] = "MSG {$id}: ".$e->getMessage();
                }
            }
        }
        echo "  <span class='ok'>✅ منقول: {$migrated['contact_messages']} — متجاوز: {$skipped['contact_messages']}</span>\n\n";
        
        // ── 4. Job Applications ────────────────────────────────────────
        echo "[4/4] 💼 نقل طلبات التوظيف...\n";
        $row = $pdo->query("SELECT setting_value FROM settings WHERE setting_key='jobApplications'")->fetch();
        if ($row) {
            $items = json_decode($row['setting_value'], true) ?? [];
            foreach ($items as $old) {
                $id = $old['id'] ?? uniqid('JOBAPP_');
                $check = $pdo->prepare("SELECT id FROM job_applications WHERE id=?");
                $check->execute([$id]);
                if ($check->fetch()) { $skipped['job_applications']++; continue; }
                
                try {
                    $pdo->prepare("
                        INSERT INTO job_applications (id,application_number,job_id,full_name,email,phone,experience_years,cover_letter,resume_path,status,applied_at)
                        VALUES (?,?,?,?,?,?,?,?,?,?,?)
                    ")->execute([
                        $id, null,
                        $old['jobId']??$old['job']??'',
                        $old['fullName']??'', $old['email']??'', $old['phone']??'',
                        !empty($old['experienceYears'])?intval($old['experienceYears']):null,
                        $old['coverLetter']??'', $old['resume']??$old['cvName']??'',
                        $old['status']??'pending',
                        !empty($old['appliedAt'])?$old['appliedAt']:date('Y-m-d H:i:s')
                    ]);
                    $migrated['job_applications']++;
                } catch(Exception $e) {
                    $errors[] = "JOBAPP {$id}: ".$e->getMessage();
                }
            }
        }
        echo "  <span class='ok'>✅ منقول: {$migrated['job_applications']} — متجاوز: {$skipped['job_applications']}</span>\n\n";
        
        $pdo->commit();
        
        $total = array_sum($migrated);
        echo "═══════════════════════════════════════════════════════\n";
        echo "<span class='ok'>✅ تم النقل بنجاح! إجمالي السجلات المنقولة: {$total}</span>\n";
        echo "═══════════════════════════════════════════════════════\n";
        
        if (!empty($errors)) {
            echo "\n<span class='warn'>⚠️ تحذيرات (".count($errors)." سجل تم تجاوزه):</span>\n";
            foreach (array_slice($errors,0,200) as $e) echo "  - {$e}\n";
        }
        
    } catch(Exception $e) {
        $pdo->rollBack();
        echo "<span class='err'>❌ فشل النقل: ".$e->getMessage()."</span>\n";
        echo "تم التراجع عن جميع التغييرات (Rollback)\n";
    }
    
    echo "</pre>";
    echo '<a class="btn" href="?token='.SAFE_TOKEN.'&action=status">📊 عرض النتيجة النهائية</a>';
    echo '</div>';
}

// ══════════════════════════════════════════════════════════════════════════
// RESTORE
// ══════════════════════════════════════════════════════════════════════════
elseif ($action === 'restore') {
    echo '<h2>↩️ جاري الاستعادة من Backup...</h2><div class="box"><pre>';
    
    try {
        $pdo->beginTransaction();
        foreach (['admissions','complaints','contact_messages','job_applications'] as $tbl) {
            $pdo->exec("TRUNCATE TABLE {$tbl}");
            $pdo->exec("INSERT INTO {$tbl} SELECT * FROM backup_{$tbl}");
            $stmt = $pdo->query("SELECT COUNT(*) FROM {$tbl}");
            $n = $stmt->fetchColumn();
            echo "<span class='ok'>✅ {$tbl}: تم استعادة {$n} سجل</span>\n";
        }
        $pdo->commit();
        echo "\n<span class='ok'>✅ تمت الاستعادة بنجاح!</span>\n";
    } catch(Exception $e) {
        $pdo->rollBack();
        echo "<span class='err'>❌ فشل الاستعادة: ".$e->getMessage()."</span>\n";
    }
    
    echo '</pre>';
    echo '<a class="btn" href="?token='.SAFE_TOKEN.'&action=status">📊 رجوع</a>';
    echo '</div>';
}
?>

<div class="box" style="border-color:#ff4444; margin-top:30px;">
  <span class="err">⚠️ تنبيه أمني: احذف هذا الملف (safe_migrate.php) فوراً بعد انتهائك منه!</span>
</div>

</body>
</html>
