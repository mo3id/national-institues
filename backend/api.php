<?php
// api.php

// ═══════════════════════════════════════════════════════════════════════════
// CORS — Allowed Origins Whitelist (never use * in production)
// ═══════════════════════════════════════════════════════════════════════════
$allowedOrigins = [
    'http://localhost:3000',       // Vite dev server
    'http://localhost:4173',       // Vite preview
    'https://gani.edu.eg',         // Production domain
    'https://www.gani.edu.eg',     // Production www
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: {$origin}");
    header("Vary: Origin");
} else {
    // Deny cross-origin requests from unknown origins silently
    // (Do not send Allow-Origin header — browser will block automatically)
}

header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept");
header("Access-Control-Max-Age: 3600");

// ═══════════════════════════════════════════════════════════════════════════
// SECURITY HEADERS
// ═══════════════════════════════════════════════════════════════════════════
header("Content-Type: application/json; charset=UTF-8");
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: SAMEORIGIN");
header("X-XSS-Protection: 1; mode=block");
header("Referrer-Policy: strict-origin-when-cross-origin");
header("Permissions-Policy: geolocation=(), microphone=(), camera=()");

// ═══════════════════════════════════════════════════════════════════════════
// CACHE CONTROL (HTTP headers)
// ═══════════════════════════════════════════════════════════════════════════
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");

// ═══════════════════════════════════════════════════════════════════════════
// FILE CACHE — serves get_site_data instantly from disk (~1ms vs ~1.5s DB)
// Cache stored in: cache/site_data.json
// TTL: 60 seconds. Busted immediately on any write action (update_category, etc.)
// ═══════════════════════════════════════════════════════════════════════════
define('CACHE_FILE', __DIR__ . '/cache/site_data.json');
define('CACHE_TTL', 60); // seconds

function serveFromCache(): bool {
    if (!file_exists(CACHE_FILE)) return false;
    if ((time() - filemtime(CACHE_FILE)) > CACHE_TTL) return false;
    $cached = @file_get_contents(CACHE_FILE);
    if (!$cached) return false;
    header('X-Cache: HIT');
    echo $cached;
    return true;
}

function writeCache(string $json): void {
    $dir = dirname(CACHE_FILE);
    if (!is_dir($dir)) @mkdir($dir, 0755, true);
    @file_put_contents(CACHE_FILE, $json, LOCK_EX);
}

function bustCache(): void {
    if (file_exists(CACHE_FILE)) @unlink(CACHE_FILE);
}

$action = $_GET['action'] ?? '';

require_once 'db_config.php';

// ── Handle OPTIONS preflight (must be after headers, before DB) ───────────
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ═══════════════════════════════════════════════════════════════════════════
// SANITIZATION HELPER
// Strips HTML tags, escapes special chars, trims whitespace.
// Use on every user-supplied string before storing to DB.
// ═══════════════════════════════════════════════════════════════════════════
function sanitizeInput(?string $value): string {
    if ($value === null) return '';
    // Strip tags and trim whitespace, but don't use htmlspecialchars 
    // to avoid mangling Arabic characters and special symbols in JSON fields.
    return strip_tags(trim($value));
}

function sanitizeArray(?array $data, array $textFields): array {
    if (!$data) return [];
    foreach ($textFields as $field) {
        if (isset($data[$field])) {
            $data[$field] = sanitizeInput((string)$data[$field]);
        }
    }
    return $data;
}

$action = $_GET['action'] ?? '';

try {
    switch ($action) {
        case 'get_site_data':
            // Serve from file cache if fresh (TTL: 60s) — avoids 4 SQL queries per request
            if (serveFromCache()) break;

            // Fetch schools
            $stmt = $pdo->query("SELECT * FROM schools");
            $schools = $stmt->fetchAll();
            foreach ($schools as &$school) {
                // Decode gallery JSON
                if (!empty($school['gallery'])) {
                    $school['gallery'] = json_decode($school['gallery'], true);
                }
            }

            // Fetch news
            $stmt = $pdo->query("SELECT * FROM news WHERE published = 1 ORDER BY date DESC");
            $news = $stmt->fetchAll();
            foreach ($news as &$item) {
                $item['published'] = (bool)$item['published'];
                $item['featured'] = (bool)($item['featured'] ?? false);
            }

            // Fetch jobs
            $stmt = $pdo->query("SELECT * FROM jobs");
            $jobs = $stmt->fetchAll();

            // Fetch settings
            $stmt = $pdo->query("SELECT * FROM settings");
            $settingsRows = $stmt->fetchAll();
            $settings = [];
            foreach ($settingsRows as $row) {
                $settings[$row['setting_key']] = json_decode($row['setting_value'], true);
            }

            // Construct response matching SiteData structure
            $response = [
                'schools' => $schools,
                'news' => $news,
                'jobs' => $jobs,
                'jobApplications' => $settings['jobApplications'] ?? [],
                'jobDepartments' => $settings['jobDepartments'] ?? [],
                'heroSlides' => $settings['heroSlides'] ?? [],
                'aboutData' => $settings['aboutData'] ?? new stdClass(),
                'complaints' => $settings['complaints'] ?? [],
                'contactMessages' => $settings['contactMessages'] ?? [],
                'stats' => $settings['stats'] ?? new stdClass(),
                'homeData' => $settings['homeData'] ?? new stdClass(),
                'partners' => $settings['partners'] ?? [],
                'galleryImages' => $settings['galleryImages'] ?? [],
                'contactData' => $settings['contactData'] ?? new stdClass(),
                'formSettings' => $settings['formSettings'] ?? new stdClass(),
            ];

            $jsonOut = json_encode(["status" => "success", "data" => $response]);
            writeCache($jsonOut); // Store in file cache for next 60s
            header('X-Cache: MISS');
            echo $jsonOut;
            break;

        case 'update_category':
            $input = json_decode(file_get_contents('php://input'), true);
            $category = $input['category'] ?? '';
            $newData = $input['newData'] ?? [];
            if (!$category) throw new Exception("Category required");

            if ($category === 'schools') {
                $pdo->exec("DELETE FROM schools");
                $stmt = $pdo->prepare("INSERT INTO schools (id, name, nameAr, location, locationAr, governorate, governorateAr, principal, principalAr, logo, type, mainImage, gallery, about, aboutAr, phone, email, website, rating, studentCount, foundedYear) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                foreach ($newData as $s) {
                    $stmt->execute([
                        $s['id'] ?? '',
                        $s['name'] ?? '',
                        $s['nameAr'] ?? ($s['name'] ?? ''),
                        $s['location'] ?? '',
                        $s['locationAr'] ?? ($s['location'] ?? ''),
                        $s['governorate'] ?? '',
                        $s['governorateAr'] ?? ($s['governorate'] ?? ''),
                        $s['principal'] ?? '',
                        $s['principalAr'] ?? ($s['principal'] ?? ''),
                        $s['logo'] ?? '',
                        $s['type'] ?? '',
                        $s['mainImage'] ?? '',
                        json_encode($s['gallery'] ?? []),
                        $s['about'] ?? '',
                        $s['aboutAr'] ?? '',
                        $s['phone'] ?? '',
                        $s['email'] ?? '',
                        $s['website'] ?? '',
                        $s['rating'] ?? '',
                        $s['studentCount'] ?? '',
                        $s['foundedYear'] ?? ''
                    ]);
                }
            } elseif ($category === 'news') {
                $pdo->exec("DELETE FROM news");
                $stmt = $pdo->prepare("INSERT INTO news (id, title, titleAr, date, summary, summaryAr, content, contentAr, highlightTitle, highlightTitleAr, highlightContent, highlightContentAr, image, published, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                foreach ($newData as $n) {
                    $stmt->execute([$n['id'], $n['title'], $n['titleAr'], $n['date'], $n['summary'], $n['summaryAr'], $n['content'] ?? '', $n['contentAr'] ?? '', $n['highlightTitle'] ?? '', $n['highlightTitleAr'] ?? '', $n['highlightContent'] ?? '', $n['highlightContentAr'] ?? '', $n['image'], $n['published'] ? 1 : 0, !empty($n['featured']) ? 1 : 0]);
                }
            } elseif ($category === 'jobs') {
                $pdo->exec("DELETE FROM jobs");
                $stmt = $pdo->prepare("INSERT INTO jobs (id, title, titleAr, department, departmentAr, location, locationAr, type, typeAr, description, descriptionAr) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                foreach ($newData as $j) {
                    $stmt->execute([$j['id'], $j['title'], $j['titleAr'], $j['department'], $j['departmentAr'], $j['location'], $j['locationAr'], $j['type'], $j['typeAr'], $j['description'], $j['descriptionAr']]);
                }
            } else {
                // Save JSON for other components: heroSlides, aboutData, jobApplications, complaints, contactMessages...
                $stmt = $pdo->prepare("REPLACE INTO settings (setting_key, setting_value) VALUES (?, ?)");
                $stmt->execute([$category, json_encode($newData)]);
            }
            bustCache(); // Invalidate cache so next read fetches fresh data
            echo json_encode(["status" => "success", "message" => "Updated successfully.", "category" => $category]);
            break;

        case 'add_complaint':
            $input = json_decode(file_get_contents('php://input'), true);
            if (!is_array($input)) throw new Exception('Invalid JSON payload');

            // ── Sanitize all user-supplied text fields ─────────────────────
            $input = sanitizeArray($input, ['fullName', 'email', 'phone', 'messageType', 'school', 'message']);

            $stmt = $pdo->query("SELECT setting_value FROM settings WHERE setting_key = 'complaints'");
            $row = $stmt->fetch();
            $complaints = $row ? json_decode($row['setting_value'], true) : [];
            $input['id']        = uniqid('cmp_', true);
            $input['createdAt'] = date('c');
            $input['status']    = 'Pending';
            $complaints[] = $input;
            $stmt = $pdo->prepare("REPLACE INTO settings (setting_key, setting_value) VALUES ('complaints', ?)");
            $stmt->execute([json_encode($complaints, JSON_UNESCAPED_UNICODE)]);
            bustCache();
            echo json_encode(["status" => "success", "message" => "Complaint added successfully.", "data" => $input]);
            break;

        case 'add_contact_message':
             $input = json_decode(file_get_contents('php://input'), true);
             if (!is_array($input)) throw new Exception('Invalid JSON payload');

             // ── Sanitize all user-supplied text fields ─────────────────────
             $input = sanitizeArray($input, ['fullName', 'email', 'phone', 'subject', 'message']);

             $stmt = $pdo->query("SELECT setting_value FROM settings WHERE setting_key = 'contactMessages'");
             $row = $stmt->fetch();
             $messages = $row ? json_decode($row['setting_value'], true) : [];
             $input['id']        = uniqid('msg_', true);
             $input['createdAt'] = date('c');
             $input['status']    = 'Pending';
             $messages[] = $input;
             $stmt = $pdo->prepare("REPLACE INTO settings (setting_key, setting_value) VALUES ('contactMessages', ?)");
             $stmt->execute([json_encode($messages, JSON_UNESCAPED_UNICODE)]);
             bustCache();
             echo json_encode(["status" => "success", "message" => "Message sent successfully.", "data" => $input]);
             break;

        case 'add_job_application':
             $input = json_decode(file_get_contents('php://input'), true);
             if (!is_array($input)) throw new Exception('Invalid JSON payload');

             // ── Sanitize text fields (cvData is base64 — do NOT htmlspecialchars it)
             $input = sanitizeArray($input, ['fullName', 'email', 'phone', 'job', 'experience', 'coverLetter', 'cvName']);

             // SERVER-SIDE SECURITY CHECK: Validate file extension
             $fileName = $input['cvName'] ?? '';
             $allowedExtensions = ['pdf', 'doc', 'docx'];
             if (!empty($fileName)) {
                 $ext = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
                 if (!in_array($ext, $allowedExtensions, true)) {
                     throw new Exception('Invalid file type. Only PDF, DOC, and DOCX are allowed.');
                 }
             }

             $stmt = $pdo->query("SELECT setting_value FROM settings WHERE setting_key = 'jobApplications'");
             $row = $stmt->fetch();
             $applications = $row ? json_decode($row['setting_value'], true) : [];
             $input['id']        = uniqid('app_', true);
             $input['appliedAt'] = date('c');
             $input['status']    = 'Pending';
             $applications[] = $input;
             $stmt = $pdo->prepare("REPLACE INTO settings (setting_key, setting_value) VALUES ('jobApplications', ?)");
             $stmt->execute([json_encode($applications, JSON_UNESCAPED_UNICODE)]);
             bustCache();
             echo json_encode(["status" => "success", "message" => "Application submitted successfully.", "data" => $input]);
             break;

        case 'delete_entry':
            $input = json_decode(file_get_contents('php://input'), true);
            if (!is_array($input)) throw new Exception('Invalid JSON payload');

            // Whitelist allowed types — never expose arbitrary settings keys to the client
            $allowedTypes = ['complaints', 'contactMessages'];
            $type = $input['type'] ?? '';
            $id   = $input['id']   ?? '';

            if (!in_array($type, $allowedTypes, true)) throw new Exception('Invalid entry type');
            if (!$id) throw new Exception('Entry id is required');

            $stmt = $pdo->query("SELECT setting_value FROM settings WHERE setting_key = " . $pdo->quote($type));
            $row  = $stmt->fetch();
            $entries = $row ? json_decode($row['setting_value'], true) : [];

            // Filter out the entry whose id matches
            $updated = array_values(array_filter($entries, fn($e) => ($e['id'] ?? '') !== $id));

            $stmt = $pdo->prepare("REPLACE INTO settings (setting_key, setting_value) VALUES (?, ?)");
            $stmt->execute([$type, json_encode($updated, JSON_UNESCAPED_UNICODE)]);

            bustCache();
            echo json_encode(["status" => "success", "message" => "Entry deleted successfully."]);
            break;

        default:
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "Invalid action."]);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    // Log the real error server-side, never expose it to the client
    error_log('[NIS API Error] Action: ' . ($action ?? 'unknown') . ' | ' . $e->getMessage());
    echo json_encode(["status" => "error", "message" => "An internal server error occurred. Please try again."]);
}
?>
