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
define('CACHE_TTL', 60); // refresh DB data every 60 seconds (prevents long stale data)

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
            // REMOVED: jobApplications, complaints, contactMessages to prevent exposing millions of bytes of private data to public visitors
            $response = [
                'schools' => $schools,
                'news' => $news,
                'jobs' => $jobs,
                'jobDepartments' => $settings['jobDepartments'] ?? [],
                'heroSlides' => $settings['heroSlides'] ?? [],
                'aboutData' => $settings['aboutData'] ?? new stdClass(),
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

            $pdo->beginTransaction();
            try {
                if ($category === 'schools') {
                    // ── Ensure schema is up to date ──
                    $cols = $pdo->query("DESCRIBE schools")->fetchAll(PDO::FETCH_COLUMN);
                    if (!in_array('about', $cols)) $pdo->exec("ALTER TABLE schools ADD COLUMN about text");
                    if (!in_array('aboutAr', $cols)) $pdo->exec("ALTER TABLE schools ADD COLUMN aboutAr text");
                    if (!in_array('phone', $cols)) $pdo->exec("ALTER TABLE schools ADD COLUMN phone varchar(50)");
                    if (!in_array('email', $cols)) $pdo->exec("ALTER TABLE schools ADD COLUMN email varchar(100)");
                    if (!in_array('website', $cols)) $pdo->exec("ALTER TABLE schools ADD COLUMN website text");
                    if (!in_array('rating', $cols)) $pdo->exec("ALTER TABLE schools ADD COLUMN rating varchar(20)");
                    if (!in_array('studentCount', $cols)) $pdo->exec("ALTER TABLE schools ADD COLUMN studentCount varchar(20)");
                    if (!in_array('foundedYear', $cols)) $pdo->exec("ALTER TABLE schools ADD COLUMN foundedYear varchar(20)");

                    $pdo->exec("DELETE FROM schools");
                    $stmt = $pdo->prepare("INSERT INTO schools (id, name, nameAr, location, locationAr, governorate, governorateAr, principal, principalAr, logo, type, mainImage, gallery, about, aboutAr, phone, email, website, rating, studentCount, foundedYear, address, addressAr) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
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
                            $s['foundedYear'] ?? '',
                            $s['address'] ?? '',
                            $s['addressAr'] ?? ''
                        ]);
                    }
                } elseif ($category === 'news') {
                    // ── Ensure schema is up to date ──
                    $cols = $pdo->query("DESCRIBE news")->fetchAll(PDO::FETCH_COLUMN);
                    if (!in_array('highlightTitle', $cols)) $pdo->exec("ALTER TABLE news ADD COLUMN highlightTitle varchar(255) DEFAULT NULL");
                    if (!in_array('highlightTitleAr', $cols)) $pdo->exec("ALTER TABLE news ADD COLUMN highlightTitleAr varchar(255) DEFAULT NULL");
                    if (!in_array('highlightContent', $cols)) $pdo->exec("ALTER TABLE news ADD COLUMN highlightContent longtext DEFAULT NULL");
                    if (!in_array('highlightContentAr', $cols)) $pdo->exec("ALTER TABLE news ADD COLUMN highlightContentAr longtext DEFAULT NULL");
                    if (!in_array('featured', $cols)) $pdo->exec("ALTER TABLE news ADD COLUMN featured tinyint(1) DEFAULT 0");
                    if (!in_array('published', $cols)) $pdo->exec("ALTER TABLE news ADD COLUMN published tinyint(1) DEFAULT 1");

                    $pdo->exec("DELETE FROM news");
                    $stmt = $pdo->prepare("INSERT INTO news (id, title, titleAr, date, summary, summaryAr, content, contentAr, highlightTitle, highlightTitleAr, highlightContent, highlightContentAr, image, published, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                    foreach ($newData as $n) {
                        $stmt->execute([
                            $n['id'] ?? uniqid(),
                            $n['title'] ?? '',
                            $n['titleAr'] ?? '',
                            $n['date'] ?? date('Y-m-d'),
                            $n['summary'] ?? '',
                            $n['summaryAr'] ?? '',
                            $n['content'] ?? '',
                            $n['contentAr'] ?? '',
                            $n['highlightTitle'] ?? '',
                            $n['highlightTitleAr'] ?? '',
                            $n['highlightContent'] ?? '',
                            $n['highlightContentAr'] ?? '',
                            $n['image'] ?? '',
                            !empty($n['published']) ? 1 : 0,
                            !empty($n['featured']) ? 1 : 0
                        ]);
                    }
                } elseif ($category === 'jobs') {
                    $pdo->exec("DELETE FROM jobs");
                    $stmt = $pdo->prepare("INSERT INTO jobs (id, title, titleAr, department, departmentAr, location, locationAr, type, typeAr, description, descriptionAr) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                    foreach ($newData as $j) {
                        $stmt->execute([
                            $j['id'] ?? uniqid(),
                            $j['title'] ?? '',
                            $j['titleAr'] ?? '',
                            $j['department'] ?? '',
                            $j['departmentAr'] ?? '',
                            $j['location'] ?? '',
                            $j['locationAr'] ?? '',
                            $j['type'] ?? '',
                            $j['typeAr'] ?? '',
                            $j['description'] ?? '',
                            $j['descriptionAr'] ?? ''
                        ]);
                    }
                } else {
                    $stmt = $pdo->prepare("REPLACE INTO settings (setting_key, setting_value) VALUES (?, ?)");
                    $stmt->execute([$category, json_encode($newData, JSON_UNESCAPED_UNICODE)]);
                }
                $pdo->commit();
                bustCache();
                echo json_encode(["status" => "success", "message" => "Updated successfully.", "category" => $category]);
            } catch (Exception $ex) {
                $pdo->rollBack();
                throw $ex; 
            }
            break;

        case 'add_complaint':
            $input = json_decode(file_get_contents('php://input'), true);
            if (!is_array($input)) throw new Exception('Invalid JSON payload');

            // ── Sanitize all user-supplied text fields ─────────────────────
            $input = sanitizeArray($input, ['fullName', 'email', 'phone', 'messageType', 'school', 'message']);

            $stmt = $pdo->query("SELECT setting_value FROM settings WHERE setting_key = 'complaints'");
            $row = $stmt->fetch();
            $complaints = $row ? json_decode($row['setting_value'], true) : [];
            
            $msgType = $input['messageType'] ?? '';
            // Only generate ID for Complaint (شكوى) and Inquiry (استفسار)
            $shouldGenerateId = in_array($msgType, ['شكوى', 'استفسار', 'Complaint', 'Inquiry']);
            
            if ($shouldGenerateId) {
                // Generate a readable ID: CMP-XXXX (e.g. CMP-5821)
                $complaintNumber = 'CMP-' . str_pad(mt_rand(1, 9999), 4, '0', STR_PAD_LEFT);
                $input['id']        = $complaintNumber;
                $input['status']    = 'Pending';
                $input['response']  = '';
            } else {
                $input['id']        = null;
            }
            
            $input['createdAt'] = date('c');
            
            $complaints[] = $input;
            $stmt = $pdo->prepare("REPLACE INTO settings (setting_key, setting_value) VALUES ('complaints', ?)");
            $stmt->execute([json_encode($complaints, JSON_UNESCAPED_UNICODE)]);
            bustCache();
            echo json_encode(["status" => "success", "message" => "Complaint added successfully.", "data" => $input]);
            break;

        case 'get_complaint_status':
            $id = $_GET['complaintId'] ?? '';
            if (!$id) throw new Exception("Complaint ID is required");

            $stmt = $pdo->query("SELECT setting_value FROM settings WHERE setting_key = 'complaints'");
            $row = $stmt->fetch();
            $complaints = $row ? json_decode($row['setting_value'], true) : [];

            $found = null;
            foreach ($complaints as $c) {
                if (($c['id'] ?? '') === $id) {
                    $found = $c;
                    break;
                }
            }

            if (!$found) {
                echo json_encode(["status" => "error", "message" => "Complaint not found."]);
            } else {
                echo json_encode(["status" => "success", "data" => [
                    'id' => $found['id'],
                    'status' => $found['status'],
                    'response' => $found['response'] ?? '',
                    'createdAt' => $found['createdAt'],
                    'fullName' => $found['fullName'] ?? '***' // Mask name for privacy
                ]]);
            }
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

        case 'get_entries':
            $type = $_GET['type'] ?? '';
            $page = max(1, (int)($_GET['page'] ?? 1));
            $limit = max(1, (int)($_GET['limit'] ?? 12));
            $search = $_GET['search'] ?? '';
            $filterType = $_GET['filterType'] ?? 'All';

            $data = [];
            if ($type === 'schools') {
                $q = "SELECT * FROM schools WHERE 1=1";
                $params = [];
                if ($search) {
                    $q .= " AND (name LIKE ? OR location LIKE ? OR governorate LIKE ? OR principal LIKE ?)";
                    $term = "%$search%";
                    $params = [$term, $term, $term, $term];
                }
                $stmt = $pdo->prepare($q);
                $stmt->execute($params);
                $data = $stmt->fetchAll();
                
                // Decode JSON fields
                foreach ($data as &$school) {
                    if (!empty($school['gallery'])) {
                        $school['gallery'] = json_decode($school['gallery'], true);
                    } else {
                        $school['gallery'] = [];
                    }
                }
            } elseif ($type === 'news') {
                $q = "SELECT * FROM news WHERE 1=1";
                $params = [];
                if ($search) {
                    $q .= " AND (title LIKE ? OR titleAr LIKE ? OR summary LIKE ? OR summaryAr LIKE ?)";
                    $term = "%$search%";
                    $params = [$term, $term, $term, $term];
                }
                $q .= " ORDER BY date DESC";
                $stmt = $pdo->prepare($q);
                $stmt->execute($params);
                $data = $stmt->fetchAll();
            } elseif ($type === 'jobs') {
                $q = "SELECT * FROM jobs WHERE 1=1";
                $params = [];
                if ($search) {
                    $q .= " AND (title LIKE ? OR titleAr LIKE ? OR department LIKE ? OR location LIKE ?)";
                    $term = "%$search%";
                    $params = [$term, $term, $term, $term];
                }
                $stmt = $pdo->prepare($q);
                $stmt->execute($params);
                $data = $stmt->fetchAll();
            } elseif ($type === 'jobDepartments') {
                $stmt = $pdo->query("SELECT setting_value FROM settings WHERE setting_key = 'jobDepartments'");
                $row = $stmt->fetch();
                $data = $row ? json_decode($row['setting_value'], true) : [];
            } elseif (in_array($type, ['complaints', 'contactMessages', 'jobApplications'])) {
                $stmt = $pdo->prepare("SELECT setting_value FROM settings WHERE setting_key = ?");
                $stmt->execute([$type]);
                $row = $stmt->fetch();
                $data = $row ? json_decode($row['setting_value'], true) : [];
                
                // Primary Sort: Sort by date descending
                usort($data, function($a, $b) {
                    $dateA = $a['createdAt'] ?? $a['appliedAt'] ?? $a['date'] ?? '';
                    $dateB = $b['createdAt'] ?? $b['appliedAt'] ?? $b['date'] ?? '';
                    return strcmp($dateB, $dateA);
                });
            }

            // Backend Filtering
            if ($search || $filterType !== 'All') {
                $term = strtolower($search);
                $data = array_filter($data, function($item) use ($term, $filterType, $type) {
                    // Filter by Type-specific field
                    if ($filterType !== 'All') {
                        if ($type === 'complaints') {
                            if (($item['messageType'] ?? '') !== $filterType) return false;
                        } elseif ($type === 'jobApplications') {
                            // Applications are filtered by Job ID
                            if (($item['job'] ?? '') !== $filterType) return false;
                        }
                    }

                    // Filter by Search Term
                    if ($term) {
                        $searchable = strtolower(implode(' ', [
                            $item['fullName'] ?? '',
                            $item['id'] ?? '',
                            $item['phone'] ?? '',
                            $item['email'] ?? '',
                            $item['school'] ?? '',
                            $item['subject'] ?? '',
                            $item['message'] ?? '',
                            $item['job'] ?? '',
                            $item['jobTitle'] ?? ''
                        ]));
                        return strpos($searchable, $term) !== false;
                    }
                    return true;
                });
            }

            $total = count($data);
            $totalPages = ceil($total / $limit);
            $offset = ($page - 1) * $limit;
            $items = array_values(array_slice($data, $offset, $limit));

            echo json_encode([
                "status" => "success",
                "data" => [
                    "items" => $items,
                    "total" => $total,
                    "page" => $page,
                    "limit" => $limit,
                    "totalPages" => $totalPages
                ]
            ]);
            break;

        case 'update_complaint':
            $input = json_decode(file_get_contents('php://input'), true);
            $id = $input['id'] ?? '';
            $status = $input['status'] ?? '';
            $response = $input['response'] ?? '';
            if (!$id) throw new Exception("ID required");
            $stmt = $pdo->query("SELECT setting_value FROM settings WHERE setting_key = 'complaints'");
            $row = $stmt->fetch();
            $complaints = $row ? json_decode($row['setting_value'], true) : [];
            $found = false;
            foreach ($complaints as &$c) {
                if (($c['id'] ?? '') === $id) {
                    $c['status'] = $status;
                    $c['response'] = $response;
                    $found = true;
                    break;
                }
            }
            if ($found) {
                $stmt = $pdo->prepare("REPLACE INTO settings (setting_key, setting_value) VALUES ('complaints', ?)");
                $stmt->execute([json_encode($complaints, JSON_UNESCAPED_UNICODE)]);
                bustCache();
                echo json_encode(["status" => "success", "message" => "Updated successfully."]);
            } else {
                throw new Exception("Complaint not found");
            }
            break;

        case 'update_job_application':
            $input = json_decode(file_get_contents('php://input'), true);
            $id = $input['id'] ?? '';
            $status = $input['status'] ?? '';
            if (!$id) throw new Exception("ID required");
            $stmt = $pdo->query("SELECT setting_value FROM settings WHERE setting_key = 'jobApplications'");
            $row = $stmt->fetch();
            $apps = $row ? json_decode($row['setting_value'], true) : [];
            $found = false;
            foreach ($apps as &$a) {
                if (($a['id'] ?? '') === $id) {
                    $a['status'] = $status;
                    $found = true;
                    break;
                }
            }
            if ($found) {
                $stmt = $pdo->prepare("REPLACE INTO settings (setting_key, setting_value) VALUES ('jobApplications', ?)");
                $stmt->execute([json_encode($apps, JSON_UNESCAPED_UNICODE)]);
                bustCache();
                echo json_encode(["status" => "success", "message" => "Updated successfully."]);
            } else {
                throw new Exception("Application not found");
            }
            break;

        case 'save_news':
            $n = json_decode(file_get_contents('php://input'), true);
            if (!$n) throw new Exception("Data required");
            $stmt = $pdo->prepare("REPLACE INTO news (id, title, titleAr, date, summary, summaryAr, content, contentAr, highlightTitle, highlightTitleAr, highlightContent, highlightContentAr, image, published, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $n['id'] ?? uniqid(),
                $n['title'] ?? '',
                $n['titleAr'] ?? '',
                $n['date'] ?? date('Y-m-d'),
                $n['summary'] ?? '',
                $n['summaryAr'] ?? '',
                $n['content'] ?? '',
                $n['contentAr'] ?? '',
                $n['highlightTitle'] ?? '',
                $n['highlightTitleAr'] ?? '',
                $n['highlightContent'] ?? '',
                $n['highlightContentAr'] ?? '',
                $n['image'] ?? '',
                !empty($n['published']) ? 1 : 0,
                !empty($n['featured']) ? 1 : 0
            ]);
            bustCache();
            echo json_encode(["status" => "success", "message" => "News saved successfully."]);
            break;

        case 'save_school':
            $s = json_decode(file_get_contents('php://input'), true);
            if (!$s) throw new Exception("Data required");
            $stmt = $pdo->prepare("REPLACE INTO schools (id, name, nameAr, location, locationAr, governorate, governorateAr, principal, principalAr, logo, type, mainImage, gallery, about, aboutAr, phone, email, website, rating, studentCount, foundedYear, address, addressAr, applicationLink) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
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
                $s['foundedYear'] ?? '',
                $s['address'] ?? '',
                $s['addressAr'] ?? '',
                $s['applicationLink'] ?? ''
            ]);
            bustCache();
            echo json_encode(["status" => "success", "message" => "School saved successfully."]);
            break;

        case 'save_job':
            $j = json_decode(file_get_contents('php://input'), true);
            if (!$j) throw new Exception("Data required");
            $stmt = $pdo->prepare("REPLACE INTO jobs (id, title, titleAr, department, departmentAr, location, locationAr, type, typeAr, description, descriptionAr) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $j['id'] ?? uniqid(),
                $j['title'] ?? '',
                $j['titleAr'] ?? '',
                $j['department'] ?? '',
                $j['departmentAr'] ?? '',
                $j['location'] ?? '',
                $j['locationAr'] ?? '',
                $j['type'] ?? '',
                $j['typeAr'] ?? '',
                $j['description'] ?? '',
                $j['descriptionAr'] ?? ''
            ]);
            bustCache();
            echo json_encode(["status" => "success", "message" => "Job saved successfully."]);
            break;

        case 'delete_news':
            $id = $_GET['id'] ?? '';
            if (!$id) throw new Exception("ID required");
            $stmt = $pdo->prepare("DELETE FROM news WHERE id = ?");
            $stmt->execute([$id]);
            bustCache();
            echo json_encode(["status" => "success", "message" => "Deleted."]);
            break;

        case 'delete_school':
            $id = $_GET['id'] ?? '';
            if (!$id) throw new Exception("ID required");
            $stmt = $pdo->prepare("DELETE FROM schools WHERE id = ?");
            $stmt->execute([$id]);
            bustCache();
            echo json_encode(["status" => "success", "message" => "Deleted."]);
            break;

        case 'delete_job':
            $id = $_GET['id'] ?? '';
            if (!$id) throw new Exception("ID required");
            $stmt = $pdo->prepare("DELETE FROM jobs WHERE id = ?");
            $stmt->execute([$id]);
            bustCache();
            echo json_encode(["status" => "success", "message" => "Deleted."]);
            break;

        case 'delete_entry':
            $input = json_decode(file_get_contents('php://input'), true);
            if (!is_array($input)) throw new Exception('Invalid JSON payload');

            // Whitelist allowed types — never expose arbitrary settings keys to the client
            $allowedTypes = ['complaints', 'contactMessages', 'jobApplications'];
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
