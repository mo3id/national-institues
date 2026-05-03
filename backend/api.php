<?php
// api.php

// ═══════════════════════════════════════════════════════════════════════════
// PHP LIMITS — Allow enough memory/time for large responses
// ═══════════════════════════════════════════════════════════════════════════
ini_set('memory_limit', '256M');
ini_set('max_execution_time', 120);

// ═══════════════════════════════════════════════════════════════════════════
// GZIP COMPRESSION — Reduce response size by ~70%
// ═══════════════════════════════════════════════════════════════════════════
if (!ob_start('ob_gzhandler')) {
    ob_start();
}

// ═══════════════════════════════════════════════════════════════════════════
// IMAGE UPLOAD HANDLER — Convert base64 to file paths
// ═══════════════════════════════════════════════════════════════════════════
// Look for upload_handler.php in multiple locations
$uploadHandlerPaths = [
    __DIR__ . '/upload_handler.php',
    $_SERVER['DOCUMENT_ROOT'] . '/upload_handler.php',
];
foreach ($uploadHandlerPaths as $uploadHandlerPath) {
    if (file_exists($uploadHandlerPath)) {
        require_once $uploadHandlerPath;
        break;
    }
}

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
    // For development, allow localhost on any port
    if (preg_match('/^http:\/\/localhost(:\d+)?$/', $origin)) {
        header("Access-Control-Allow-Origin: {$origin}");
        header("Vary: Origin");
    }
    // Otherwise deny cross-origin requests from unknown origins silently
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

// Look for db_config.php in multiple locations (backend/ dir or document root)
$dbConfigPaths = [
    __DIR__ . '/db_config.php',
    $_SERVER['DOCUMENT_ROOT'] . '/db_config.php',
];
foreach ($dbConfigPaths as $dbConfigPath) {
    if (file_exists($dbConfigPath)) {
        require_once $dbConfigPath;
        break;
    }
}

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

// ═══════════════════════════════════════════════════════════════════════════
// JWT AUTHENTICATION HELPERS
// ═══════════════════════════════════════════════════════════════════════════

// Load JWT secret from environment or use default (CHANGE IN PRODUCTION!)
function getJWTSecret(): string {
    return $_ENV['JWT_SECRET'] ?? $_SERVER['JWT_SECRET'] ?? 'nis-default-secret-change-in-production-2024';
}

/**
 * Generate JWT token
 * @param string $userId User ID
 * @param string $email User email
 * @param string $role User role (super_admin, school_admin)
 * @return string JWT token
 */
function generateJWT(string $userId, string $email, string $role): string {
    $secret = getJWTSecret();
    $issuedAt = time();
    $expirationTime = $issuedAt + 86400; // 24 hours
    
    $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
    $payload = json_encode([
        'iat' => $issuedAt,
        'exp' => $expirationTime,
        'sub' => $userId,
        'email' => $email,
        'role' => $role
    ]);
    
    $base64Header = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
    $base64Payload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));
    
    $signature = hash_hmac('sha256', $base64Header . "." . $base64Payload, $secret, true);
    $base64Signature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
    
    return $base64Header . "." . $base64Payload . "." . $base64Signature;
}

/**
 * Verify JWT token and return payload
 * @param string $token JWT token
 * @return array|false Payload if valid, false otherwise
 */
function verifyJWT(string $token): array|false {
    $parts = explode('.', $token);
    if (count($parts) !== 3) return false;
    
    $secret = getJWTSecret();
    $signature = hash_hmac('sha256', $parts[0] . "." . $parts[1], $secret, true);
    $base64Signature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
    
    if (!hash_equals($base64Signature, $parts[2])) return false;
    
    $payload = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $parts[1])), true);
    if (!$payload) return false;
    
    // Check expiration
    if (isset($payload['exp']) && $payload['exp'] < time()) return false;
    
    return $payload;
}

/**
 * Get authorization token from request headers
 * Supports multiple methods for different server configurations
 * @return string|null Token or null if not found
 */
function getAuthToken(): ?string {
    $authHeader = '';
    
    // Method 1: getallheaders() - Standard method
    if (function_exists('getallheaders')) {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    }
    
    // Method 2: $_SERVER['HTTP_AUTHORIZATION'] - For CGI/FastCGI
    if (empty($authHeader)) {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    }
    
    // Method 3: $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] - For Apache mod_rewrite
    if (empty($authHeader)) {
        $authHeader = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
    }
    
    // Method 4: get_headers() function - Alternative method
    if (empty($authHeader) && function_exists('get_headers')) {
        $allHeaders = get_headers('php://input', true);
        if (is_array($allHeaders)) {
            $authHeader = $allHeaders['Authorization'] ?? '';
        }
    }
    
    // Extract Bearer token
    if (!empty($authHeader) && preg_match('/Bearer\s+(\S+)/', $authHeader, $matches)) {
        return $matches[1];
    }
    
    // Method 5: Query parameter fallback (last resort)
    if (isset($_GET['token']) && !empty($_GET['token'])) {
        return $_GET['token'];
    }
    
    return null;
}

// ═══════════════════════════════════════════════════════════════════════════
// NUMBER GENERATION FUNCTIONS (DYNAMIC YEAR)
// All numbers use current year from date('Y') - auto-updates each year
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generate new admission application number
 * Format: APP-YYYY-XXX-NNNN (last 4 of national ID)
 * Example: APP-2026-015-5847 (for year 2026)
 * @param string $nationalId Student national ID (14 digits)
 * @param PDO $pdo Database connection
 * @return string Generated application number
 */
function generateAdmissionNumber(string $nationalId, PDO $pdo): string {
    $year = date('Y'); // Dynamic year: 2026, 2027, etc.
    $last4 = substr($nationalId, -4);
    
    // Get next sequence number for this year
    $stmt = $pdo->prepare("
        SELECT COUNT(*) as count 
        FROM admissions 
        WHERE application_number LIKE CONCAT('APP-', ?, '-%')
    ");
    $stmt->execute([$year]);
    $row = $stmt->fetch();
    $nextNumber = str_pad(($row['count'] ?? 0) + 1, 3, '0', STR_PAD_LEFT);
    
    return "APP-{$year}-{$nextNumber}-{$last4}";
}

/**
 * Generate modification request number
 * Format: MOD-YYYY-XXX-NNNN
 * Example: MOD-2026-003-5847
 */
function generateModificationNumber(string $nationalId, PDO $pdo): string {
    $year = date('Y');
    $last4 = substr($nationalId, -4);
    
    $stmt = $pdo->prepare("
        SELECT COUNT(*) as count 
        FROM modification_requests 
        WHERE request_number LIKE CONCAT('MOD-', ?, '-%')
    ");
    $stmt->execute([$year]);
    $row = $stmt->fetch();
    $nextNumber = str_pad(($row['count'] ?? 0) + 1, 3, '0', STR_PAD_LEFT);
    
    return "MOD-{$year}-{$nextNumber}-{$last4}";
}

/**
 * Generate complaint number
 * Format: COMP-YYYY-XXX
 * Example: COMP-2026-042
 */
function generateComplaintNumber(PDO $pdo): string {
    $year = date('Y');
    
    $stmt = $pdo->prepare("
        SELECT COUNT(*) as count 
        FROM complaints 
        WHERE complaint_number LIKE CONCAT('COMP-', ?, '-%')
    ");
    $stmt->execute([$year]);
    $row = $stmt->fetch();
    $nextNumber = str_pad(($row['count'] ?? 0) + 1, 3, '0', STR_PAD_LEFT);
    
    return "COMP-{$year}-{$nextNumber}";
}

/**
 * Generate message number
 * Format: MSG-YYYY-XXX
 * Example: MSG-2026-018
 */
function generateMessageNumber(PDO $pdo): string {
    $year = date('Y');
    
    $stmt = $pdo->prepare("
        SELECT COUNT(*) as count 
        FROM contact_messages 
        WHERE message_number LIKE CONCAT('MSG-', ?, '-%')
    ");
    $stmt->execute([$year]);
    $row = $stmt->fetch();
    $nextNumber = str_pad(($row['count'] ?? 0) + 1, 3, '0', STR_PAD_LEFT);
    
    return "MSG-{$year}-{$nextNumber}";
}

/**
 * Generate job application number
 * Format: JOB-YYYY-XXX
 * Example: JOB-2026-007
 */
function generateJobApplicationNumber(PDO $pdo): string {
    $year = date('Y');
    
    $stmt = $pdo->prepare("
        SELECT COUNT(*) as count 
        FROM job_applications 
        WHERE application_number LIKE CONCAT('JOB-', ?, '-%')
    ");
    $stmt->execute([$year]);
    $row = $stmt->fetch();
    $nextNumber = str_pad(($row['count'] ?? 0) + 1, 3, '0', STR_PAD_LEFT);
    
    return "JOB-{$year}-{$nextNumber}";
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS FOR STATUS LABELS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get Arabic label for admission status
 */
function getStatusLabel(string $status): string {
    $labels = [
        'pending' => 'معلق',
        'under_review' => 'قيد المراجعة',
        'accepted' => 'مقبول',
        'rejected' => 'مرفوض',
        'modification_requested' => 'بانتظار تعديل الرغبات',
        'modification_approved' => 'تم الموافقة على التعديل'
    ];
    return $labels[$status] ?? $status;
}

/**
 * Get Arabic label for modification request status
 */
function getModificationStatusLabel(string $status): string {
    $labels = [
        'pending' => 'معلق',
        'approved' => 'تمت الموافقة',
        'rejected' => 'مرفوض',
        'completed' => 'مكتمل'
    ];
    return $labels[$status] ?? $status;
}

// ═══════════════════════════════════════════════════════════════════════════

/**
 * Require authentication for protected endpoints
 * Returns user payload or exits with 401
 * @return array User payload containing id, email, role
 */
function requireAuth(): array {
    $token = getAuthToken();
    
    if (!$token) {
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "Authentication required. Please login."]);
        exit;
    }
    
    $payload = verifyJWT($token);
    
    if (!$payload) {
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "Invalid or expired token. Please login again."]);
        exit;
    }
    
    return $payload;
}

/**
 * Hash password using bcrypt
 * @param string $password Plain password
 * @return string Hashed password
 */
function hashPassword(string $password): string {
    return password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
}

/**
 * Verify password against hash
 * @param string $password Plain password
 * @param string $hash Stored hash
 * @return bool True if matches
 */
function verifyPassword(string $password, string $hash): bool {
    return password_verify($password, $hash);
}

$action = $_GET['action'] ?? '';

try {
    switch ($action) {
        case 'get_live_stats':
            // Ensure teachersCount column exists before querying
            $cols = $pdo->query("DESCRIBE schools")->fetchAll(PDO::FETCH_COLUMN);
            if (!in_array('teachersCount', $cols)) {
                $pdo->exec("ALTER TABLE schools ADD COLUMN teachersCount varchar(20) DEFAULT '0'");
            }

            // Count schools
            $schoolsCount = $pdo->query("SELECT COUNT(*) FROM schools")->fetchColumn();
            
            // Sum students and teachers
            $schoolsStmt = $pdo->query("SELECT studentCount, teachersCount FROM schools");
            $schoolsData = $schoolsStmt->fetchAll();
            $totalStudents = 0;
            $totalTeachers = 0;
            
            foreach ($schoolsData as $s) {
                $studentsVal = str_replace(',', '', $s['studentCount'] ?? '0');
                $teachersVal = str_replace(',', '', $s['teachersCount'] ?? '0');
                $totalStudents += (int)$studentsVal;
                $totalTeachers += (int)$teachersVal;
            }
            
            // Calculate years of service
            $currentYear = (int)date('Y');
            $foundationYear = 1985;
            
            $stmt = $pdo->query("SELECT setting_value FROM settings WHERE setting_key = 'aboutData'");
            $aboutDataRow = $stmt->fetch();
            if ($aboutDataRow) {
                $aboutData = json_decode($aboutDataRow['setting_value'], true);
                if (isset($aboutData['foundationYear'])) {
                    $foundationYear = (int)$aboutData['foundationYear'];
                }
            }
            
            $yearsOfService = $currentYear - $foundationYear;
            
            echo json_encode([
                "status" => "success",
                "data" => [
                    "schoolsCount" => (int)$schoolsCount,
                    "totalStudents" => (int)$totalStudents,
                    "totalTeachers" => (int)$totalTeachers,
                    "yearsOfService" => (int)$yearsOfService
                ]
            ]);
            break;

        case 'get_dashboard_stats':
            // Ensure teachersCount column exists before querying (just in case)
            $cols = $pdo->query("DESCRIBE schools")->fetchAll(PDO::FETCH_COLUMN);
            if (!in_array('teachersCount', $cols)) {
                $pdo->exec("ALTER TABLE schools ADD COLUMN teachersCount varchar(20) DEFAULT '0'");
            }

            // Count news
            $newsTotal = $pdo->query("SELECT COUNT(*) FROM news")->fetchColumn();
            $newsPublished = $pdo->query("SELECT COUNT(*) FROM news WHERE published = 1")->fetchColumn();
            
            // Count schools and sum studentCount
            $schoolsStmt = $pdo->query("SELECT id, studentCount, teachersCount FROM schools");
            $schoolsData = $schoolsStmt->fetchAll();
            $schoolsCount = count($schoolsData);
            $totalStudents = 0;
            $totalTeachers = 0;
            foreach ($schoolsData as $s) {
                $studentsVal = str_replace(',', '', $s['studentCount'] ?? '');
                $teachersVal = str_replace(',', '', $s['teachersCount'] ?? '');
                $totalStudents += (int)$studentsVal;
                $totalTeachers += (int)$teachersVal;
            }
            
            echo json_encode([
                "status" => "success",
                "data" => [
                    "totalNews" => (int)$newsTotal,
                    "publishedNews" => (int)$newsPublished,
                    "schoolsCount" => (int)$schoolsCount,
                    "totalStudents" => (int)$totalStudents,
                    "totalTeachers" => (int)$totalTeachers
                ]
            ]);
            break;

        case 'login':
            $input = json_decode(file_get_contents('php://input'), true);
            $email = sanitizeInput($input['email'] ?? '');
            $password = $input['password'] ?? '';
            
            if (!$email || !$password) {
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => "Email and password are required."]);
                break;
            }
            
            $stmt = $pdo->prepare("SELECT id, email, passwordHash, name, role, isActive FROM users WHERE email = ?");
            $stmt->execute([$email]);
            $user = $stmt->fetch();
            
            if (!$user || !verifyPassword($password, $user['passwordHash'])) {
                http_response_code(401);
                echo json_encode(["status" => "error", "message" => "Invalid email or password."]);
                break;
            }
            
            if (!$user['isActive']) {
                http_response_code(403);
                echo json_encode(["status" => "error", "message" => "Account is disabled. Please contact administrator."]);
                break;
            }
            
            // Generate JWT token
            $token = generateJWT($user['id'], $user['email'], $user['role']);
            
            // Update last login
            $pdo->prepare("UPDATE users SET lastLogin = NOW() WHERE id = ?")->execute([$user['id']]);
            
            echo json_encode([
                "status" => "success",
                "token" => $token,
                "user" => [
                    "id" => $user['id'],
                    "email" => $user['email'],
                    "name" => $user['name'],
                    "role" => $user['role']
                ]
            ]);
            break;

        case 'verify_token':
            $payload = requireAuth();
            echo json_encode([
                "status" => "success",
                "user" => [
                    "id" => $payload['sub'],
                    "email" => $payload['email'],
                    "role" => $payload['role']
                ]
            ]);
            break;

        case 'get_site_data':
            // Serve from file cache if fresh (TTL: 60s) — avoids 4 SQL queries per request
            if (serveFromCache()) break;

            // Pagination support
            $schoolsLimit = isset($_GET['schools_limit']) ? (int)$_GET['schools_limit'] : 1000;
            $schoolsOffset = isset($_GET['schools_offset']) ? (int)$_GET['schools_offset'] : 0;
            $newsLimit = isset($_GET['news_limit']) ? (int)$_GET['news_limit'] : 1000;
            $newsOffset = isset($_GET['news_offset']) ? (int)$_GET['news_offset'] : 0;

            // Fetch schools with pagination
            $stmt = $pdo->prepare("SELECT * FROM schools LIMIT :limit OFFSET :offset");
            $stmt->bindValue(':limit', $schoolsLimit, PDO::PARAM_INT);
            $stmt->bindValue(':offset', $schoolsOffset, PDO::PARAM_INT);
            $stmt->execute();
            $schools = $stmt->fetchAll();
            $needsMigration = false;
            foreach ($schools as &$school) {
                // Decode gallery JSON
                if (!empty($school['gallery'])) {
                    $school['gallery'] = json_decode($school['gallery'], true);
                }
                // Safety net: convert any remaining base64 images on-the-fly
                if (!empty($school['logo']) && strpos($school['logo'], 'data:image') === 0) {
                    $school['logo'] = processImageField($school['logo'], 'school_logo_' . ($school['id'] ?? ''));
                    $pdo->prepare("UPDATE schools SET logo = ? WHERE id = ?")->execute([$school['logo'], $school['id']]);
                    $needsMigration = true;
                }
                if (!empty($school['mainImage']) && strpos($school['mainImage'], 'data:image') === 0) {
                    $school['mainImage'] = processImageField($school['mainImage'], 'school_main_' . ($school['id'] ?? ''));
                    $pdo->prepare("UPDATE schools SET mainimage = ? WHERE id = ?")->execute([$school['mainImage'], $school['id']]);
                    $needsMigration = true;
                }
                if (is_array($school['gallery'] ?? null)) {
                    $galleryChanged = false;
                    foreach ($school['gallery'] as &$gImg) {
                        if (is_string($gImg) && strpos($gImg, 'data:image') === 0) {
                            $gImg = processImageField($gImg, 'school_gallery_' . ($school['id'] ?? ''));
                            $galleryChanged = true;
                        }
                    }
                    if ($galleryChanged) {
                        $pdo->prepare("UPDATE schools SET gallery = ? WHERE id = ?")->execute([json_encode($school['gallery']), $school['id']]);
                        $needsMigration = true;
                    }
                }
            }
            if ($needsMigration) {
                error_log('[NIS] Auto-migrated base64 images to files during get_site_data');
            }

            // Fetch news with pagination
            $stmt = $pdo->prepare("SELECT * FROM news WHERE published = 1 ORDER BY date DESC LIMIT :limit OFFSET :offset");
            $stmt->bindValue(':limit', $newsLimit, PDO::PARAM_INT);
            $stmt->bindValue(':offset', $newsOffset, PDO::PARAM_INT);
            $stmt->execute();
            $news = $stmt->fetchAll();
            foreach ($news as &$item) {
                $item['published'] = (bool)$item['published'];
                $item['featured'] = (bool)($item['featured'] ?? false);
                // Safety net: convert any remaining base64 images on-the-fly
                if (!empty($item['image']) && strpos($item['image'], 'data:image') === 0) {
                    $item['image'] = processImageField($item['image'], 'news_' . ($item['id'] ?? ''));
                    $pdo->prepare("UPDATE news SET image = ? WHERE id = ?")->execute([$item['image'], $item['id']]);
                }
            }

            // Fetch jobs
            $stmt = $pdo->query("SELECT * FROM jobs");
            $jobs = $stmt->fetchAll();
            foreach ($jobs as &$job) {
                if (!empty($job['image']) && strpos($job['image'], 'data:image') === 0) {
                    $job['image'] = processImageField($job['image'], 'job_' . ($job['id'] ?? ''));
                    $pdo->prepare("UPDATE jobs SET image = ? WHERE id = ?")->execute([$job['image'], $job['id']]);
                }
            }

            // Fetch alumni
            $stmt = $pdo->query("SELECT * FROM alumni ORDER BY graduationYear DESC");
            $alumni = $stmt->fetchAll();
            foreach ($alumni as &$a) {
                $a['featured'] = (bool)($a['featured'] ?? false);
                if (!empty($a['image']) && strpos($a['image'], 'data:image') === 0) {
                    $a['image'] = processImageField($a['image'], 'alumni_' . ($a['id'] ?? ''));
                    $pdo->prepare("UPDATE alumni SET image = ? WHERE id = ?")->execute([$a['image'], $a['id']]);
                }
            }

            // Fetch governorates
            $stmt = $pdo->query("SELECT * FROM governorates ORDER BY name");
            $governorates = $stmt->fetchAll();

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
                'alumni' => $alumni,
                'jobDepartments' => (function() use ($pdo) {
                    $depts = $pdo->query("SELECT id, name, name_ar FROM job_departments ORDER BY sort_order")->fetchAll();
                    return array_map(function($d) {
                        return ['id' => $d['id'], 'nameEn' => $d['name'], 'nameAr' => $d['name_ar']];
                    }, $depts);
                })(),
                'governorates' => $governorates,
                'heroSlides' => $settings['heroSlides'] ?? [],
                'aboutData' => $settings['aboutData'] ?? new stdClass(),
                'pagesHeroSettings' => $settings['pagesHeroSettings'] ?? [
                    'about' => ['backgroundType' => 'color', 'backgroundColor' => '#0f172a'],
                    'schools' => ['backgroundType' => 'color', 'backgroundColor' => '#0f172a'],
                    'news' => ['backgroundType' => 'color', 'backgroundColor' => '#0f172a'],
                    'jobs' => ['backgroundType' => 'color', 'backgroundColor' => '#0f172a'],
                    'complaints' => ['backgroundType' => 'color', 'backgroundColor' => '#0f172a'],
                    'contact' => ['backgroundType' => 'color', 'backgroundColor' => '#0f172a']
                ],
                'stats' => $settings['stats'] ?? new stdClass(),
                'homeData' => $settings['homeData'] ?? new stdClass(),
                'partners' => $settings['partners'] ?? [],
                'galleryImages' => $settings['galleryImages'] ?? [],
                'contactData' => $settings['contactData'] ?? new stdClass(),
                'formSettings' => $settings['formSettings'] ?? new stdClass(),
                'admissionSettings' => (function() use ($settings) {
                    $admSettings = $settings['admissionSettings'] ?? [
                        'isOpen' => true,
                        'requiredDocuments' => ['شهادة الميلاد', 'صورة شخصية', 'شهادة آخر سنة دراسية'],
                        'gradeStages' => ['ابتدائي', 'إعدادي', 'ثانوي'],
                        'gradeClassesByStage' => [
                            'ابتدائي' => ['أول', 'ثاني', 'ثالث', 'رابع', 'خامس', 'سادس'],
                            'إعدادي' => ['أول', 'ثاني', 'ثالث'],
                            'ثانوي' => ['أول', 'ثاني', 'ثالث']
                        ],
                        'maxPreferences' => 0,
                        'formTitle' => 'School Admission Application',
                        'formTitleAr' => 'طلب التقديم للمدارس',
                        'formDesc' => 'Fill in your details to apply for admission',
                        'formDescAr' => 'أدخل بياناتك للتقديم على الالتحاق بالمدارس'
                    ];
                    // Auto-migrate old gradeClasses to gradeClassesByStage
                    if (isset($admSettings['gradeClasses']) && !isset($admSettings['gradeClassesByStage'])) {
                        $admSettings['gradeClassesByStage'] = [];
                        foreach ($admSettings['gradeStages'] ?? [] as $stage) {
                            $admSettings['gradeClassesByStage'][$stage] = $admSettings['gradeClasses'];
                        }
                        unset($admSettings['gradeClasses']);
                    }
                    return $admSettings;
                })(),
            ];

            $jsonOut = json_encode(["status" => "success", "data" => $response]);
            writeCache($jsonOut); // Store in file cache for next 60s
            header('X-Cache: MISS');
            echo $jsonOut;
            break;

        case 'update_category':
            requireAuth(); // Protected: only admin can update categories
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
                    if (!in_array('teachersCount', $cols)) $pdo->exec("ALTER TABLE schools ADD COLUMN teachersCount varchar(20)");
                    if (!in_array('foundedYear', $cols)) $pdo->exec("ALTER TABLE schools ADD COLUMN foundedYear varchar(20)");
                    if (!in_array('applicationLink', $cols)) $pdo->exec("ALTER TABLE schools ADD COLUMN applicationLink text");

                    $pdo->exec("DELETE FROM schools");
                    $stmt = $pdo->prepare("INSERT INTO schools (id, name, nameAr, location, locationAr, governorate, governorateAr, principal, principalAr, logo, type, mainimage, gallery, about, aboutAr, phone, email, website, rating, studentCount, teachersCount, foundedYear, address, addressAr, applicationLink) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                    foreach ($newData as $s) {
                        // Convert base64 images to file paths
                        $logo = processImageField($s['logo'] ?? '', 'school_logo');
                        $mainImage = processImageField($s['mainImage'] ?? '', 'school_main');
                        
                        // Process gallery images
                        $gallery = $s['gallery'] ?? [];
                        if (is_array($gallery)) {
                            foreach ($gallery as &$galleryImg) {
                                $galleryImg = processImageField($galleryImg, 'school_gallery');
                            }
                        }
                        
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
                            $logo,
                            is_array($s['type'] ?? '') ? json_encode($s['type']) : ($s['type'] ?? ''),
                            $mainImage,
                            json_encode($gallery),
                            $s['about'] ?? '',
                            $s['aboutAr'] ?? '',
                            $s['phone'] ?? '',
                            $s['email'] ?? '',
                            $s['website'] ?? '',
                            $s['rating'] ?? '',
                            $s['studentCount'] ?? '',
                            $s['teachersCount'] ?? '',
                            $s['foundedYear'] ?? '',
                            $s['address'] ?? '',
                            $s['addressAr'] ?? '',
                            $s['applicationLink'] ?? ''
                        ]);
                    }
                } elseif ($category === 'news') {
                    // ── Ensure schema is up to date ──
                    $cols = $pdo->query("DESCRIBE news")->fetchAll(PDO::FETCH_COLUMN);
                    if (!in_array('highlightTitle', $cols)) $pdo->exec("ALTER TABLE news ADD COLUMN highlightTitle varchar(255) DEFAULT NULL");
                    if (!in_array('highlightTitleAr', $cols)) $pdo->exec("ALTER TABLE news ADD COLUMN highlightTitleAr varchar(255) DEFAULT NULL");
                    if (!in_array('highlightContent', $cols)) $pdo->exec("ALTER TABLE news ADD COLUMN highlightContent longtext DEFAULT NULL");
                    if (!in_array('highlightContentAr', $cols)) $pdo->exec("ALTER TABLE news ADD COLUMN highlightContentAr longtext DEFAULT NULL");
                    if (!in_array('content', $cols)) $pdo->exec("ALTER TABLE news ADD COLUMN content longtext DEFAULT NULL");
                    if (!in_array('contentAr', $cols)) $pdo->exec("ALTER TABLE news ADD COLUMN contentAr longtext DEFAULT NULL");
                    if (!in_array('featured', $cols)) $pdo->exec("ALTER TABLE news ADD COLUMN featured tinyint(1) DEFAULT 0");
                    if (!in_array('published', $cols)) $pdo->exec("ALTER TABLE news ADD COLUMN published tinyint(1) DEFAULT 1");
                    
                    $pdo->exec("DELETE FROM news");
                    $stmt = $pdo->prepare("INSERT INTO news (id, title, titleAr, date, summary, summaryAr, content, contentAr, highlightTitle, highlightTitleAr, highlightContent, highlightContentAr, image, published, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                    foreach ($newData as $n) {
                        // Convert base64 image to file path
                        $image = processImageField($n['image'] ?? '', 'news');
                        
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
                            $image,
                            !empty($n['published']) ? 1 : 0,
                            !empty($n['featured']) ? 1 : 0
                        ]);
                    }
                } elseif ($category === 'jobs') {
                    // ── Ensure schema is up to date ──
                    $cols = $pdo->query("DESCRIBE jobs")->fetchAll(PDO::FETCH_COLUMN);
                    if (!in_array('image', $cols)) $pdo->exec("ALTER TABLE jobs ADD COLUMN image text");

                    $pdo->exec("DELETE FROM jobs");
                    $stmt = $pdo->prepare("INSERT INTO jobs (id, title, titleAr, department, departmentAr, location, locationAr, type, typeAr, description, descriptionAr, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                    foreach ($newData as $j) {
                        // Convert base64 image to file path
                        $jobImg = processImageField($j['image'] ?? '', 'job');
                        
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
                            $j['descriptionAr'] ?? '',
                            $jobImg
                        ]);
                    }
                } elseif ($category === 'jobDepartments') {
                    $pdo->exec("DELETE FROM job_departments");
                    $stmt = $pdo->prepare("INSERT INTO job_departments (id, name, name_ar, sort_order, is_active) VALUES (?, ?, ?, ?, 1)");
                    $sortOrder = 1;
                    foreach ($newData as $d) {
                        $stmt->execute([
                            $d['id'] ?? uniqid('DEPT_'),
                            $d['nameEn'] ?? $d['name'] ?? '',
                            $d['nameAr'] ?? '',
                            $sortOrder++
                        ]);
                    }
                } elseif ($category === 'governorates') {
                    $pdo->exec("DELETE FROM governorates");
                    $stmt = $pdo->prepare("INSERT INTO governorates (id, name, nameAr) VALUES (?, ?, ?)");
                    foreach ($newData as $g) {
                        $stmt->execute([
                            $g['id'] ?? uniqid('GOV_'),
                            $g['name'] ?? '',
                            $g['nameAr'] ?? ''
                        ]);
                    }
                } else {
                    // Process any base64 images in settings data before storing
                    $settingsWithImages = ['heroSlides', 'aboutData', 'partners', 'galleryImages', 'homeData', 'pagesHeroSettings'];
                    if (in_array($category, $settingsWithImages) && is_array($newData)) {
                        array_walk_recursive($newData, function(&$val) use ($category) {
                            if (is_string($val) && (strpos($val, 'data:image') === 0) && strlen($val) > 500) {
                                $val = processImageField($val, $category);
                            }
                        });
                    }
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

            $msgType = $input['messageType'] ?? '';
            // Only generate ID for Complaint (شكوى) and Inquiry (استفسار)
            $shouldGenerateId = in_array($msgType, ['شكوى', 'استفسار', 'Complaint', 'Inquiry']);

            // Assign a distinctive prefix per message type
            $prefixMap = [
                'شكوى'      => 'CMP',
                'Complaint' => 'CMP',
                'استفسار'   => 'EXPL',
                'Inquiry'   => 'EXPL',
                'اقتراح'    => 'SUGG',
                'Suggestion'=> 'SUGG',
                'شكر'       => 'THX',
                'Thanks'    => 'THX',
            ];
            $prefix = $prefixMap[$msgType] ?? 'MSG';
            $complaintNumber = generateComplaintNumber($pdo);
            $complaintId = uniqid('comp_');

            $stmt = $pdo->prepare("INSERT INTO complaints (id, complaint_number, full_name, email, phone, message_type, school, message, status, admin_response, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $complaintId,
                $complaintNumber,
                $input['fullName'] ?? '',
                $input['email'] ?? '',
                $input['phone'] ?? '',
                $msgType,
                $input['school'] ?? '',
                $input['message'] ?? '',
                $shouldGenerateId ? 'pending' : '',
                '',
                date('Y-m-d H:i:s')
            ]);
            bustCache();

            $data = array_merge($input, [
                'id' => $complaintId,
                'complaint_number' => $complaintNumber,
                'status' => $shouldGenerateId ? 'pending' : '',
                'admin_response' => '',
                'created_at' => date('Y-m-d H:i:s')
            ]);
            echo json_encode(["status" => "success", "message" => "Complaint added successfully.", "data" => $data]);
            break;

        case 'get_complaint_status':
            $id = $_GET['complaintId'] ?? '';
            if (!$id) throw new Exception("Complaint ID is required");

            $stmt = $pdo->prepare("SELECT id, complaint_number, status, admin_response, created_at, full_name FROM complaints WHERE id = ?");
            $stmt->execute([$id]);
            $complaint = $stmt->fetch();

            if (!$complaint) {
                echo json_encode(["status" => "error", "message" => "Complaint not found."]);
            } else {
                echo json_encode(["status" => "success", "data" => [
                    'id' => $complaint['id'],
                    'complaint_number' => $complaint['complaint_number'],
                    'status' => $complaint['status'],
                    'admin_response' => $complaint['admin_response'] ?? '',
                    'created_at' => $complaint['created_at'],
                    'fullName' => $complaint['full_name'] ?? '***'
                ]]);
            }
            break;

        case 'add_contact_message':
             $input = json_decode(file_get_contents('php://input'), true);
             if (!is_array($input)) throw new Exception('Invalid JSON payload');

             // ── Sanitize all user-supplied text fields ─────────────────────
             $input = sanitizeArray($input, ['fullName', 'email', 'phone', 'subject', 'message']);

             $messageId = uniqid('msg_');
             $messageNumber = generateMessageNumber($pdo);

             $stmt = $pdo->prepare("INSERT INTO contact_messages (id, message_number, full_name, email, phone, subject, message, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
             $stmt->execute([
                 $messageId,
                 $messageNumber,
                 $input['fullName'] ?? '',
                 $input['email'] ?? '',
                 $input['phone'] ?? '',
                 $input['subject'] ?? '',
                 $input['message'] ?? '',
                 'pending',
                 date('Y-m-d H:i:s')
             ]);
             bustCache();

             $data = array_merge($input, [
                 'id' => $messageId,
                 'message_number' => $messageNumber,
                 'status' => 'pending',
                 'created_at' => date('Y-m-d H:i:s')
             ]);
             echo json_encode(["status" => "success", "message" => "Message sent successfully.", "data" => $data]);
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

             $appId = uniqid('app_');
             $appNumber = generateJobApplicationNumber($pdo);

             $stmt = $pdo->prepare("INSERT INTO job_applications (id, application_number, job_id, full_name, email, phone, experience_years, cover_letter, resume_path, status, applied_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
             $stmt->execute([
                 $appId,
                 $appNumber,
                 $input['job'] ?? '',
                 $input['fullName'] ?? '',
                 $input['email'] ?? '',
                 $input['phone'] ?? '',
                 (int)($input['experience'] ?? 0),
                 $input['coverLetter'] ?? '',
                 $fileName,
                 'pending',
                 date('Y-m-d H:i:s')
             ]);
             bustCache();

             $data = array_merge($input, [
                 'id' => $appId,
                 'application_number' => $appNumber,
                 'status' => 'pending',
                 'applied_at' => date('Y-m-d H:i:s')
             ]);
             echo json_encode(["status" => "success", "message" => "Application submitted successfully.", "data" => $data]);
             break;

        case 'get_entries':
            $type = $_GET['type'] ?? '';
            $page = max(1, (int)($_GET['page'] ?? 1));
            $limit = max(1, (int)($_GET['limit'] ?? 12));
            $search = $_GET['search'] ?? '';
            $filterType = $_GET['filterType'] ?? 'All';
            $filterSchool = $_GET['filterSchool'] ?? '';
            $filterGov = $_GET['filterGov'] ?? '';

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
            } elseif ($type === 'alumni') {
                $q = "SELECT * FROM alumni WHERE 1=1";
                $params = [];
                if ($search) {
                    $q .= " AND (name LIKE ? OR nameAr LIKE ? OR school LIKE ? OR company LIKE ?)";
                    $term = "%$search%";
                    $params = [$term, $term, $term, $term];
                }
                $q .= " ORDER BY graduationYear DESC";
                $stmt = $pdo->prepare($q);
                $stmt->execute($params);
                $data = $stmt->fetchAll();
                foreach ($data as &$a) {
                    $a['featured'] = (bool)($a['featured'] ?? false);
                }
            } elseif ($type === 'jobDepartments') {
                $stmt = $pdo->query("SELECT id, name, name_ar FROM job_departments ORDER BY sort_order");
                $rows = $stmt->fetchAll();
                $data = [];
                foreach ($rows as $row) {
                    $data[] = [
                        'id' => $row['id'],
                        'nameEn' => $row['name'],
                        'nameAr' => $row['name_ar']
                    ];
                }
            } elseif ($type === 'complaints') {
                $stmt = $pdo->query("SELECT * FROM complaints ORDER BY created_at DESC");
                $data = $stmt->fetchAll();
            } elseif ($type === 'contactMessages') {
                $stmt = $pdo->query("SELECT * FROM contact_messages ORDER BY created_at DESC");
                $data = $stmt->fetchAll();
            } elseif ($type === 'jobApplications') {
                $stmt = $pdo->query("SELECT * FROM job_applications ORDER BY applied_at DESC");
                $data = $stmt->fetchAll();
            } elseif ($type === 'admissions') {
                $stmt = $pdo->query("SELECT * FROM admissions ORDER BY created_at DESC");
                $data = $stmt->fetchAll();
                // Normalize snake_case DB columns to camelCase for frontend
                foreach ($data as &$adm) {
                    $adm['applicationNumber'] = $adm['application_number'] ?? null;
                    $adm['studentName'] = $adm['student_name'] ?? '';
                    $adm['studentNameAr'] = $adm['student_name_ar'] ?? '';
                    $adm['studentDOB'] = $adm['student_dob'] ?? null;
                    $adm['studentNationalId'] = $adm['student_national_id'] ?? null;
                    $adm['studentBirthCertificate'] = $adm['student_birth_certificate'] ?? null;
                    $adm['gradeStage'] = $adm['grade_stage'] ?? '';
                    $adm['gradeClass'] = $adm['grade_class'] ?? '';
                    $adm['parentName'] = $adm['parent_name'] ?? '';
                    $adm['parentNameAr'] = $adm['parent_name_ar'] ?? '';
                    $adm['parentPhone'] = $adm['parent_phone'] ?? '';
                    $adm['parentEmail'] = $adm['parent_email'] ?? '';
                    $adm['parentNationalId'] = $adm['parent_national_id'] ?? '';
                    $adm['parentJob'] = $adm['parent_job'] ?? '';
                    $adm['siblingSchool'] = $adm['sibling_school'] ?? null;
                    $adm['passportNumber'] = $adm['passport_number'] ?? null;
                    $adm['idType'] = $adm['id_type'] ?? 'national_id';
                    $adm['acceptedSchoolId'] = $adm['accepted_school_id'] ?? null;
                    $adm['adminNotes'] = $adm['admin_notes'] ?? '';
                    $adm['createdAt'] = $adm['created_at'] ?? null;
                    $adm['updatedAt'] = $adm['updated_at'] ?? null;
                    // Decode JSON fields
                    if (!empty($adm['documents'])) {
                        $decoded = json_decode($adm['documents'], true);
                        $adm['documents'] = is_array($decoded) ? $decoded : [];
                    } else {
                        $adm['documents'] = [];
                    }
                }
                unset($adm);
            }

            // Calculate top schools by complaints from ALL data (before filtering)
            $topSchools = [];
            if ($type === 'complaints') {
                $schoolCounts = [];
                foreach ($data as $item) {
                    $school = $item['school'] ?? '';
                    if ($school) {
                        $schoolCounts[$school] = ($schoolCounts[$school] ?? 0) + 1;
                    }
                }
                arsort($schoolCounts);
                $topSchools = array_slice($schoolCounts, 0, 3, true);
            }

            // Build school→governorate mapping for complaints filtering (supports both languages)
            $schoolGovMapEn = []; // school name/nameAr => governorate (English)
            $schoolGovMapAr = []; // school name/nameAr => governorateAr (Arabic)
            $schoolNameMap = [];  // school nameAr => name (English), name => nameAr (Arabic)
            if ($type === 'complaints' && ($filterSchool || $filterGov)) {
                $stmtSG = $pdo->query("SELECT name, nameAr, governorate, governorateAr FROM schools");
                while ($sr = $stmtSG->fetch(PDO::FETCH_ASSOC)) {
                    $gov = $sr['governorate'] ?? '';
                    $govAr = $sr['governorateAr'] ?? '';
                    $sName = $sr['name'] ?? '';
                    $sNameAr = $sr['nameAr'] ?? '';
                    // Map both English and Arabic school names to both governorate versions
                    $schoolGovMapEn[$sName] = $gov;
                    $schoolGovMapEn[$sNameAr] = $gov;
                    $schoolGovMapAr[$sName] = $govAr;
                    $schoolGovMapAr[$sNameAr] = $govAr;
                    // Map between English and Arabic school names
                    $schoolNameMap[$sName] = $sNameAr;
                    $schoolNameMap[$sNameAr] = $sName;
                }
            }

            // Backend Filtering
            if ($search || $filterType !== 'All' || $filterSchool || $filterGov) {
                $term = strtolower($search);
                $data = array_filter($data, function($item) use ($term, $filterType, $type, $filterSchool, $filterGov, $schoolGovMapEn, $schoolGovMapAr, $schoolNameMap) {
                    // Filter by Type-specific field
                    if ($filterType !== 'All') {
                        if ($type === 'complaints') {
                            if (($item['messageType'] ?? '') !== $filterType) return false;
                        } elseif ($type === 'jobApplications') {
                            // Applications are filtered by Job ID or Department name
                            $jobId = $item['job'] ?? '';
                            if ($jobId !== $filterType) {
                                // Not an exact job ID match, check if filterType is a department name
                                static $jobsMapping = null;
                                if ($jobsMapping === null) {
                                    global $pdo;
                                    $stmt = $pdo->query("SELECT id, department, departmentAr FROM jobs");
                                    $jobsMapping = [];
                                    while ($r = $stmt->fetch(PDO::FETCH_ASSOC)) {
                                        $jobsMapping[$r['id']] = $r;
                                    }
                                }
                                $jobDetails = $jobsMapping[$jobId] ?? null;
                                if (!$jobDetails || ($jobDetails['department'] !== $filterType && $jobDetails['departmentAr'] !== $filterType)) {
                                    return false;
                                }
                            }
                        } elseif ($type === 'admissions') {
                            if (($item['status'] ?? '') !== $filterType) return false;
                        }
                    }

                    // Filter by School (complaints — match English or Arabic name)
                    if ($filterSchool && $type === 'complaints') {
                        $itemSchool = $item['school'] ?? '';
                        $altSchoolName = $schoolNameMap[$filterSchool] ?? '';
                        if ($itemSchool !== $filterSchool && $itemSchool !== $altSchoolName) return false;
                    }

                    // Filter by Governorate (complaints — resolve via school, match English or Arabic)
                    if ($filterGov && $type === 'complaints') {
                        $itemSchool = $item['school'] ?? '';
                        $schoolGov = $schoolGovMapEn[$itemSchool] ?? '';
                        $schoolGovAr = $schoolGovMapAr[$itemSchool] ?? '';
                        if ($schoolGov !== $filterGov && $schoolGovAr !== $filterGov) return false;
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
                            $item['jobTitle'] ?? '',
                            $item['studentName'] ?? '',
                            $item['parentName'] ?? '',
                            $item['parentPhone'] ?? '',
                            $item['parentEmail'] ?? ''
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
            
            // Optimization: Remove heavy fields from list view to keep payload small
            if ($type === 'jobApplications') {
                foreach ($items as &$item) {
                    unset($item['cvData']);
                }
            }
            if ($type === 'admissions') {
                foreach ($items as &$item) {
                    unset($item['documents']); // Heavy field — only load on detail view
                }
            }

            $responseData = [
                "items" => $items,
                "total" => $total,
                "page" => $page,
                "limit" => $limit,
                "totalPages" => $totalPages
            ];
            if ($type === 'complaints' && !empty($topSchools)) {
                $responseData['topSchools'] = $topSchools;
            }
            echo json_encode([
                "status" => "success",
                "data" => $responseData
            ]);
            break;

        case 'get_job_application':
            $id = $_GET['id'] ?? '';
            if (!$id) throw new Exception("ID required");

            $stmt = $pdo->prepare("SELECT * FROM job_applications WHERE id = ?");
            $stmt->execute([$id]);
            $app = $stmt->fetch();

            if ($app) {
                echo json_encode(["status" => "success", "data" => $app]);
            } else {
                throw new Exception("Application not found");
            }
            break;

        case 'update_complaint':
            requireAuth();
            $input = json_decode(file_get_contents('php://input'), true);
            $id = $input['id'] ?? '';
            $status = $input['status'] ?? '';
            $response = $input['response'] ?? '';
            if (!$id) throw new Exception("ID required");

            $stmt = $pdo->prepare("UPDATE complaints SET status = ?, admin_response = ? WHERE id = ?");
            $result = $stmt->execute([$status, $response, $id]);

            if ($result && $stmt->rowCount() > 0) {
                bustCache();
                echo json_encode(["status" => "success", "message" => "Updated successfully."]);
            } else {
                throw new Exception("Complaint not found");
            }
            break;

        case 'add_admission':
            // ═══════════════════════════════════════════════════════════════════════════
            // NEW: Submit admission with duplicate check and database storage
            // ═══════════════════════════════════════════════════════════════════════════
            
            // ── Accept multipart/form-data: text fields in $_POST, files in $_FILES
            $input = [];
            $textFields = ['studentName', 'studentNameAr', 'studentDOB', 'studentNationalId', 'passportNumber', 'gradeStage', 'gradeClass', 'parentName', 'parentNameAr', 'parentPhone', 'parentEmail', 'parentNationalId', 'parentJob', 'address', 'siblingSchool'];
            foreach ($textFields as $f) {
                $input[$f] = sanitizeInput($_POST[$f] ?? '');
            }
            
            // Convert checkbox to boolean
            $input['hasSibling'] = in_array($_POST['hasSibling'] ?? '', ['1', 'true', 'on'], true);
            
            // ═══════════════════════════════════════════════════════════════════════════
            // STEP 0: Validate ID requirements (National ID or Passport)
            // ═══════════════════════════════════════════════════════════════════════════
            $nationalId = $input['studentNationalId'];
            $passport = $input['passportNumber'];
            $hasNationalId = !empty($nationalId);
            $hasPassport = !empty($passport);
            
            // At least one ID is required
            if (!$hasNationalId && !$hasPassport) {
                http_response_code(400);
                echo json_encode([
                    "status" => "error",
                    "error_code" => "ID_REQUIRED",
                    "message" => "يجب إدخال الرقم القومي أو رقم جواز السفر / Please enter either national ID or passport number"
                ]);
                break;
            }
            
            // Validate Egyptian National ID format if provided
            if ($hasNationalId) {
                if (!preg_match('/^\d{14}$/', $nationalId)) {
                    http_response_code(400);
                    echo json_encode([
                        "status" => "error",
                        "error_code" => "INVALID_NATIONAL_ID",
                        "message" => "الرقم القومي يجب أن يكون 14 رقمًا / National ID must be 14 digits"
                    ]);
                    break;
                }
                
                // Extract components
                $century = $nationalId[0];
                $year = substr($nationalId, 1, 2);
                $month = substr($nationalId, 3, 2);
                $day = substr($nationalId, 5, 2);
                $governorate = substr($nationalId, 7, 2);
                
                // Validate century (2 or 3)
                if ($century !== '2' && $century !== '3') {
                    http_response_code(400);
                    echo json_encode([
                        "status" => "error",
                        "error_code" => "INVALID_NATIONAL_ID_CENTURY",
                        "message" => "الرقم القومي يجب أن يبدأ بـ 2 أو 3 / National ID must start with 2 or 3"
                    ]);
                    break;
                }
                
                // Validate month
                $monthNum = intval($month);
                if ($monthNum < 1 || $monthNum > 12) {
                    http_response_code(400);
                    echo json_encode([
                        "status" => "error",
                        "error_code" => "INVALID_NATIONAL_ID_MONTH",
                        "message" => "الرقم القومي غير صالح - الشهر غير صحيح / Invalid national ID - invalid month"
                    ]);
                    break;
                }
                
                // Validate day
                $dayNum = intval($day);
                $fullYear = ($century === '2') ? '19' . $year : '20' . $year;
                $daysInMonth = (int)date('t', strtotime("{$fullYear}-{$monthNum}-01"));
                if ($dayNum < 1 || $dayNum > $daysInMonth) {
                    http_response_code(400);
                    echo json_encode([
                        "status" => "error",
                        "error_code" => "INVALID_NATIONAL_ID_DAY",
                        "message" => "الرقم القومي غير صالح - اليوم غير صحيح / Invalid national ID - invalid day"
                    ]);
                    break;
                }
                
                // Validate governorate (01-35 or 88 for abroad)
                $govNum = intval($governorate);
                if (($govNum < 1 || $govNum > 35) && $govNum !== 88) {
                    http_response_code(400);
                    echo json_encode([
                        "status" => "error",
                        "error_code" => "INVALID_NATIONAL_ID_GOVERNORATE",
                        "message" => "الرقم القومي غير صالح - محافظة غير معروفة / Invalid national ID - unknown governorate"
                    ]);
                    break;
                }
            }
            
            // Validate Passport format if provided
            if ($hasPassport) {
                // Common formats: AB123456, 123456789, A12345678
                if (!preg_match('/^[A-Z0-9]{6,12}$/i', str_replace(' ', '', $passport))) {
                    http_response_code(400);
                    echo json_encode([
                        "status" => "error",
                        "error_code" => "INVALID_PASSPORT",
                        "message" => "رقم جواز السفر غير صالح / Invalid passport number format"
                    ]);
                    break;
                }
            }
            
            // Validate required documents
            if (empty($_FILES['documents']) || !is_array($_FILES['documents']['name']) || count($_FILES['documents']['name']) === 0) {
                http_response_code(400);
                echo json_encode([
                    "status" => "error",
                    "error_code" => "DOCUMENTS_REQUIRED",
                    "message" => "يجب إرفاق جميع المستندات المطلوبة / All required documents must be attached"
                ]);
                break;
            }
            
            // ═══════════════════════════════════════════════════════════════════════════
            // STEP 1: Check if already applied (by national ID or passport)
            // ═══════════════════════════════════════════════════════════════════════════
            $checkConditions = [];
            $checkParams = [];
            
            if ($hasNationalId) {
                $checkConditions[] = "student_national_id = ?";
                $checkParams[] = $nationalId;
            }
            if ($hasPassport) {
                $checkConditions[] = "passport_number = ?";
                $checkParams[] = $passport;
            }
            
            if (!empty($checkConditions)) {
                $checkQuery = "
                    SELECT id, application_number, student_name, status, created_at, student_national_id, passport_number 
                    FROM admissions 
                    WHERE " . implode(" OR ", $checkConditions);
                $checkStmt = $pdo->prepare($checkQuery);
                $checkStmt->execute($checkParams);
                $existing = $checkStmt->fetch(PDO::FETCH_ASSOC);
                
                if ($existing) {
                    // Student already applied - return error with details
                    http_response_code(409); // Conflict
                    $idType = !empty($existing['student_national_id']) ? 'الرقم القومي' : 'رقم جواز السفر';
                    echo json_encode([
                        "status" => "error",
                        "error_code" => "ALREADY_APPLIED",
                        "message" => "لقد قدمت طلباً مسبقاً بهذا $idType / You have already applied with this " . ($idType === 'الرقم القومي' ? 'national ID' : 'passport number'),
                        "data" => [
                            "applicationId" => $existing['id'],
                            "applicationNumber" => $existing['application_number'] ?? $existing['id'],
                            "studentName" => $existing['student_name'],
                            "status" => $existing['status'],
                            "submittedAt" => $existing['created_at'],
                            "actions" => [
                                "view_details" => "/admissions/track?id={$existing['id']}",
                                "request_modification" => "/modifications/request?admissionId={$existing['id']}"
                            ]
                        ]
                    ]);
                    break;
                }
            }
            
            // Preferences: sent as JSON string in a POST field
            $preferences = [];
            if (!empty($_POST['preferences'])) {
                $prefs = json_decode($_POST['preferences'], true);
                if (is_array($prefs)) {
                    $preferences = array_map(function($p) {
                        return is_array($p)
                            ? [
                                'schoolId' => htmlspecialchars($p['schoolId'] ?? '', ENT_QUOTES),
                                'schoolName' => htmlspecialchars($p['schoolName'] ?? '', ENT_QUOTES),
                                'schoolNameAr' => htmlspecialchars($p['schoolNameAr'] ?? '', ENT_QUOTES)
                              ]
                            : null;
                    }, $prefs);
                    $preferences = array_filter($preferences); // Remove nulls
                }
            }
            
            // Document names: sent as JSON string in a POST field
            $docNames = [];
            if (!empty($_POST['documentNames'])) {
                $docNames = json_decode($_POST['documentNames'], true) ?: [];
            }
            
            // Documents: actual files via $_FILES['documents']
            $savedDocs = [];
            $allowedMimes = ['image/jpeg', 'image/png', 'application/pdf'];
            $maxFileSize = 5 * 1024 * 1024; // 5 MB
            $uploadDir = __DIR__ . '/uploads/admissions/';
            if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);
            
            if (!empty($_FILES['documents'])) {
                $files = $_FILES['documents'];
                $count = is_array($files['name']) ? count($files['name']) : 0;
                for ($i = 0; $i < $count; $i++) {
                    $docLabel = $docNames[$i] ?? ('Document ' . ($i + 1));
                    $origName = $files['name'][$i] ?? '';
                    $tmpPath  = $files['tmp_name'][$i] ?? '';
                    $fileSize = $files['size'][$i] ?? 0;
                    $fileMime = $files['type'][$i] ?? '';
                    $error    = $files['error'][$i] ?? UPLOAD_ERR_NO_FILE;
                    
                    if ($error !== UPLOAD_ERR_OK || empty($tmpPath)) {
                        continue; // Skip failed uploads
                    }
                    if (!in_array($fileMime, $allowedMimes)) {
                        $savedDocs[] = ['name' => $docLabel, 'fileName' => $origName, 'path' => '', 'error' => 'Invalid file type'];
                        continue;
                    }
                    if ($fileSize > $maxFileSize) {
                        $savedDocs[] = ['name' => $docLabel, 'fileName' => $origName, 'path' => '', 'error' => 'File too large'];
                        continue;
                    }
                    
                    $ext = pathinfo($origName, PATHINFO_EXTENSION) ?: 'pdf';
                    $safeName = 'doc_' . uniqid() . '_' . time() . '.' . $ext;
                    $destPath = $uploadDir . $safeName;
                    if (move_uploaded_file($tmpPath, $destPath)) {
                        $savedDocs[] = ['name' => $docLabel, 'fileName' => $origName, 'path' => '/uploads/admissions/' . $safeName];
                    }
                }
            }
            
            // Rate limit: reject if same parentPhone submitted within last 60 seconds
            $parentPhone = $input['parentPhone'] ?? '';
            if (!empty($parentPhone)) {
                $rateStmt = $pdo->prepare("
                    SELECT id FROM admissions 
                    WHERE parent_phone = ? AND created_at > DATE_SUB(NOW(), INTERVAL 60 SECOND)
                    LIMIT 1
                ");
                $rateStmt->execute([$parentPhone]);
                if ($rateStmt->fetch()) {
                    http_response_code(429); // Too Many Requests
                    echo json_encode([
                        "status" => "error",
                        "message" => "يرجى الانتظار 60 ثانية قبل إرسال طلب آخر"
                    ]);
                    break;
                }
            }
            
            // ═══════════════════════════════════════════════════════════════════════════
            // STEP 2: Generate IDs and Number
            // ═══════════════════════════════════════════════════════════════════════════
            $id = uniqid('ADM_');
            
            // Generate application number with dynamic year (APP-YYYY-XXX-NNNN)
            // Use national ID if available, otherwise use passport for the number
            $idForNumber = $hasNationalId ? $nationalId : $passport;
            $applicationNumber = generateAdmissionNumber($idForNumber, $pdo);
            
            // Determine id_type
            if ($hasNationalId && $hasPassport) {
                $idType = 'both';
            } elseif ($hasNationalId) {
                $idType = 'national_id';
            } else {
                $idType = 'passport';
            }
            
            // ═══════════════════════════════════════════════════════════════════════════
            // STEP 3: Insert into admissions table
            // ═══════════════════════════════════════════════════════════════════════════
            $stmt = $pdo->prepare("
                INSERT INTO admissions (
                    id, application_number, student_name, student_name_ar, student_dob,
                    student_national_id, passport_number, id_type, grade_stage, grade_class,
                    parent_name, parent_name_ar, parent_phone, parent_email, parent_national_id,
                    parent_job, address, has_sibling, sibling_school, documents, status, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())
            ");
            
            $stmt->execute([
                $id,
                $applicationNumber,
                $input['studentName'],
                $input['studentNameAr'],
                !empty($input['studentDOB']) ? $input['studentDOB'] : null,
                $hasNationalId ? $nationalId : null,
                $hasPassport ? $passport : null,
                $idType,
                $input['gradeStage'],
                $input['gradeClass'],
                $input['parentName'],
                $input['parentNameAr'],
                $input['parentPhone'],
                $input['parentEmail'],
                $input['parentNationalId'],
                $input['parentJob'],
                $input['address'],
                $input['hasSibling'] ? 1 : 0,
                $input['siblingSchool'],
                json_encode($savedDocs, JSON_UNESCAPED_UNICODE)
            ]);
            
            // ═══════════════════════════════════════════════════════════════════════════
            // STEP 4: Insert preferences into admission_preferences table
            // ═══════════════════════════════════════════════════════════════════════════
            if (!empty($preferences)) {
                $prefStmt = $pdo->prepare("
                    INSERT INTO admission_preferences (id, admission_id, school_id, preference_order)
                    VALUES (?, ?, ?, ?)
                ");
                
                foreach ($preferences as $index => $pref) {
                    if (is_array($pref) && !empty($pref['schoolId'])) {
                        $prefStmt->execute([
                            uniqid('PREF_'),
                            $id,
                            $pref['schoolId'],
                            $index + 1
                        ]);
                    }
                }
            }
            
            // Clear cache
            bustCache();
            
            echo json_encode([
                "status" => "success",
                "message" => "تم تقديم طلب الالتحاق بنجاح",
                "data" => [
                    "applicationId" => $id,
                    "applicationNumber" => $applicationNumber,
                    "trackUrl" => "/admissions/track?id={$id}"
                ]
            ]);
            break;

        case 'get_admission_status':
            // ═══════════════════════════════════════════════════════════════════════════
            // Get admission status from database with preferences and modifications
            // Supports: applicationNumber or nationalId
            // ═══════════════════════════════════════════════════════════════════════════
            $applicationNumber = $_GET['applicationNumber'] ?? '';
            $nationalId = $_GET['nationalId'] ?? '';
            $admissionId = $_GET['admissionId'] ?? '';
            
            if (empty($applicationNumber) && empty($nationalId) && empty($admissionId)) {
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => "يرجى إدخال رقم الطلب أو الرقم القومي"]);
                break;
            }
            
            // Build query based on provided identifier
            $whereClause = '';
            $params = [];
            if (!empty($admissionId)) {
                $whereClause = 'a.id = ?';
                $params[] = $admissionId;
            } elseif (!empty($applicationNumber)) {
                $whereClause = '(a.id = ? OR a.application_number = ?)';
                $params[] = $applicationNumber;
                $params[] = $applicationNumber;
            } else {
                $whereClause = 'a.student_national_id = ?';
                $params[] = $nationalId;
            }
            
            // Get admission with school info
            $stmt = $pdo->prepare("
                SELECT a.*, s.name as accepted_school_name, s.nameAr as accepted_school_name_ar
                FROM admissions a
                LEFT JOIN schools s ON a.accepted_school_id = s.id
                WHERE {$whereClause}
            ");
            $stmt->execute($params);
            $admission = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$admission) {
                http_response_code(404);
                echo json_encode(["status" => "error", "message" => "لم يتم العثور على طلب بهذا الرقم"]);
                break;
            }
            
            // Get preferences
            $prefStmt = $pdo->prepare("
                SELECT ap.*, s.name as school_name, s.nameAr as school_name_ar, s.type as stage
                FROM admission_preferences ap
                JOIN schools s ON ap.school_id = s.id
                WHERE ap.admission_id = ?
                ORDER BY ap.preference_order
            ");
            $prefStmt->execute([$admission['id']]);
            $preferences = $prefStmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Get pending/completed modification requests
            $modStmt = $pdo->prepare("
                SELECT id, request_number, status, request_reason, admin_response, created_at, reviewed_at
                FROM modification_requests
                WHERE admission_id = ?
                ORDER BY created_at DESC
            ");
            $modStmt->execute([$admission['id']]);
            $modifications = $modStmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Mask student name for public display
            $studentName = $admission['student_name'] ?? '';
            $maskedName = mb_strlen($studentName) > 3
                ? mb_substr($studentName, 0, 3) . '***'
                : $studentName . '***';
            
            // Determine if modification is allowed
            $canRequestModification = in_array($admission['status'], ['pending', 'under_review', 'accepted']);
            $hasPendingModification = false;
            foreach ($modifications as $mod) {
                if ($mod['status'] === 'pending') {
                    $hasPendingModification = true;
                    break;
                }
            }
            
            echo json_encode([
                "status" => "success",
                "data" => [
                    'applicationId' => $admission['id'],
                    'applicationNumber' => $admission['application_number'] ?? $admission['id'],
                    'studentName' => $maskedName,
                    'gradeStage' => $admission['grade_stage'],
                    'gradeClass' => $admission['grade_class'],
                    'status' => $admission['status'],
                    'statusLabel' => getStatusLabel($admission['status']),
                    'acceptedSchool' => $admission['accepted_school_name_ar'] ?? $admission['accepted_school_name'] ?? null,
                    'submittedAt' => $admission['created_at'],
                    'updatedAt' => $admission['updated_at'],
                    'preferences' => array_map(function($p) {
                        return [
                            'order' => intval($p['preference_order']),
                            'schoolId' => $p['school_id'],
                            'schoolName' => $p['school_name_ar'] ?? $p['school_name'],
                            'stage' => $p['stage']
                        ];
                    }, $preferences),
                    'modifications' => array_map(function($m) {
                        return [
                            'requestNumber' => $m['request_number'],
                            'status' => $m['status'],
                            'statusLabel' => getModificationStatusLabel($m['status']),
                            'reason' => $m['request_reason'],
                            'adminResponse' => $m['admin_response'],
                            'requestedAt' => $m['created_at'],
                            'reviewedAt' => $m['reviewed_at']
                        ];
                    }, $modifications),
                    'actions' => [
                        'canRequestModification' => $canRequestModification && !$hasPendingModification,
                        'canEditPreferences' => $admission['status'] === 'modification_approved',
                        'requestModificationUrl' => "/modifications/request?admissionId={$admission['id']}",
                        'editPreferencesUrl' => "/admissions/edit?id={$admission['id']}"
                    ]
                ]
            ]);
            break;

        case 'get_admission_detail':
            $id = $_GET['id'] ?? '';
            if (!$id) throw new Exception("Admission ID is required");

            $stmt = $pdo->prepare("SELECT * FROM admissions WHERE id = ?");
            $stmt->execute([$id]);
            $admission = $stmt->fetch();

            if (!$admission) throw new Exception("Admission not found");
            // Normalize snake_case DB columns to camelCase
            $admission['applicationNumber'] = $admission['application_number'] ?? null;
            $admission['studentName'] = $admission['student_name'] ?? '';
            $admission['studentNameAr'] = $admission['student_name_ar'] ?? '';
            $admission['studentDOB'] = $admission['student_dob'] ?? null;
            $admission['studentNationalId'] = $admission['student_national_id'] ?? null;
            $admission['studentBirthCertificate'] = $admission['student_birth_certificate'] ?? null;
            $admission['gradeStage'] = $admission['grade_stage'] ?? '';
            $admission['gradeClass'] = $admission['grade_class'] ?? '';
            $admission['parentName'] = $admission['parent_name'] ?? '';
            $admission['parentNameAr'] = $admission['parent_name_ar'] ?? '';
            $admission['parentPhone'] = $admission['parent_phone'] ?? '';
            $admission['parentEmail'] = $admission['parent_email'] ?? '';
            $admission['parentNationalId'] = $admission['parent_national_id'] ?? '';
            $admission['parentJob'] = $admission['parent_job'] ?? '';
            $admission['siblingSchool'] = $admission['sibling_school'] ?? null;
            $admission['passportNumber'] = $admission['passport_number'] ?? null;
            $admission['idType'] = $admission['id_type'] ?? 'national_id';
            $admission['acceptedSchoolId'] = $admission['accepted_school_id'] ?? null;
            $admission['adminNotes'] = $admission['admin_notes'] ?? '';
            $admission['createdAt'] = $admission['created_at'] ?? null;
            $admission['updatedAt'] = $admission['updated_at'] ?? null;
            if (!empty($admission['documents'])) {
                $decoded = json_decode($admission['documents'], true);
                $admission['documents'] = is_array($decoded) ? $decoded : [];
            } else {
                $admission['documents'] = [];
            }
            echo json_encode(["status" => "success", "data" => $admission]);
            break;

        case 'update_admission':
            // Admin only: Update admission status and accepted school
            requireAuth();
            
            $input = json_decode(file_get_contents('php://input'), true);
            $id = sanitizeInput($input['id'] ?? '');
            $status = sanitizeInput($input['status'] ?? '');
            $acceptedSchoolId = sanitizeInput($input['acceptedSchoolId'] ?? $input['acceptedSchool'] ?? null);
            $adminNotes = sanitizeInput($input['adminNotes'] ?? '');
            
            if (empty($id)) {
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => "Admission ID is required"]);
                break;
            }
            
            $validStatuses = ['pending', 'under_review', 'accepted', 'rejected', 'modification_approved'];
            if (!empty($status) && !in_array($status, $validStatuses)) {
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => "Invalid status"]);
                break;
            }
            
            $updates = [];
            $params = [];
            
            if (!empty($status)) {
                $updates[] = "status = ?";
                $params[] = $status;
            }
            if ($acceptedSchoolId !== null) {
                $updates[] = "accepted_school_id = ?";
                $params[] = $acceptedSchoolId ?: null;
            }
            if (!empty($adminNotes)) {
                $updates[] = "admin_notes = ?";
                $params[] = $adminNotes;
            }
            
            if (empty($updates)) {
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => "No fields to update"]);
                break;
            }
            
            $params[] = $id;
            $sql = "UPDATE admissions SET " . implode(', ', $updates) . " WHERE id = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            
            if ($stmt->rowCount() === 0) {
                http_response_code(404);
                echo json_encode(["status" => "error", "message" => "Admission not found"]);
                break;
            }
            
            bustCache();
            echo json_encode([
                "status" => "success",
                "message" => "تم تحديث حالة الطلب بنجاح",
                "data" => ["id" => $id, "status" => $status]
            ]);
            break;

        case 'update_job_application':
            requireAuth();
            $input = json_decode(file_get_contents('php://input'), true);
            $id = $input['id'] ?? '';
            $status = $input['status'] ?? '';
            if (!$id) throw new Exception("ID required");

            $stmt = $pdo->prepare("UPDATE job_applications SET status = ? WHERE id = ?");
            $result = $stmt->execute([$status, $id]);

            if ($result && $stmt->rowCount() > 0) {
                bustCache();
                echo json_encode(["status" => "success", "message" => "Updated successfully."]);
            } else {
                throw new Exception("Application not found");
            }
            break;

        case 'save_news':
            requireAuth(); // Protected: only admin can save news
            $n = json_decode(file_get_contents('php://input'), true);
            if (!$n) throw new Exception("Data required");
            // Convert base64 image to file path
            $newsImage = processImageField($n['image'] ?? '', 'news');

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
                $newsImage,
                !empty($n['published']) ? 1 : 0,
                !empty($n['featured']) ? 1 : 0
            ]);
            bustCache();
            echo json_encode(["status" => "success", "message" => "News saved successfully."]);
            break;

        case 'save_school':
            requireAuth(); // Protected: only admin can save schools
            $s = json_decode(file_get_contents('php://input'), true);
            if (!$s) throw new Exception("Data required");

            // ── Ensure schema is up to date (prevents HTTP 500 on older DB schemas) ──
            $cols = $pdo->query("DESCRIBE schools")->fetchAll(PDO::FETCH_COLUMN);
            if (!in_array('about', $cols, true)) $pdo->exec("ALTER TABLE schools ADD COLUMN about text");
            if (!in_array('aboutAr', $cols, true)) $pdo->exec("ALTER TABLE schools ADD COLUMN aboutAr text");
            if (!in_array('phone', $cols, true)) $pdo->exec("ALTER TABLE schools ADD COLUMN phone varchar(50)");
            if (!in_array('email', $cols, true)) $pdo->exec("ALTER TABLE schools ADD COLUMN email varchar(100)");
            if (!in_array('website', $cols, true)) $pdo->exec("ALTER TABLE schools ADD COLUMN website text");
            if (!in_array('rating', $cols, true)) $pdo->exec("ALTER TABLE schools ADD COLUMN rating varchar(20)");
            if (!in_array('studentCount', $cols, true)) $pdo->exec("ALTER TABLE schools ADD COLUMN studentCount varchar(20)");
            if (!in_array('teachersCount', $cols, true)) $pdo->exec("ALTER TABLE schools ADD COLUMN teachersCount varchar(20)");
            if (!in_array('foundedYear', $cols, true)) $pdo->exec("ALTER TABLE schools ADD COLUMN foundedYear varchar(20)");
            if (!in_array('address', $cols, true)) $pdo->exec("ALTER TABLE schools ADD COLUMN address text");
            if (!in_array('addressAr', $cols, true)) $pdo->exec("ALTER TABLE schools ADD COLUMN addressAr text");
            if (!in_array('applicationLink', $cols, true)) $pdo->exec("ALTER TABLE schools ADD COLUMN applicationLink text");

            // Convert base64 images to file paths
            $logo = processImageField($s['logo'] ?? '', 'school_logo');
            $mainImage = processImageField($s['mainImage'] ?? '', 'school_main');
            $gallery = $s['gallery'] ?? [];
            if (is_array($gallery)) {
                foreach ($gallery as &$gImg) {
                    $gImg = processImageField($gImg, 'school_gallery');
                }
            }

            $schoolId = $s['id'] ?? uniqid();
            $stmt = $pdo->prepare("INSERT INTO schools (id, name, nameAr, location, locationAr, governorate, governorateAr, principal, principalAr, logo, type, mainimage, gallery, about, aboutAr, phone, email, website, rating, studentCount, teachersCount, foundedYear, address, addressAr, applicationLink) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name=VALUES(name), nameAr=VALUES(nameAr), location=VALUES(location), locationAr=VALUES(locationAr), governorate=VALUES(governorate), governorateAr=VALUES(governorateAr), principal=VALUES(principal), principalAr=VALUES(principalAr), logo=VALUES(logo), type=VALUES(type), mainimage=VALUES(mainimage), gallery=VALUES(gallery), about=VALUES(about), aboutAr=VALUES(aboutAr), phone=VALUES(phone), email=VALUES(email), website=VALUES(website), rating=VALUES(rating), studentCount=VALUES(studentCount), teachersCount=VALUES(teachersCount), foundedYear=VALUES(foundedYear), address=VALUES(address), addressAr=VALUES(addressAr), applicationLink=VALUES(applicationLink)");
            $stmt->execute([
                $schoolId,
                $s['name'] ?? '',
                $s['nameAr'] ?? ($s['name'] ?? ''),
                $s['location'] ?? '',
                $s['locationAr'] ?? ($s['location'] ?? ''),
                $s['governorate'] ?? '',
                $s['governorateAr'] ?? ($s['governorate'] ?? ''),
                $s['principal'] ?? '',
                $s['principalAr'] ?? ($s['principal'] ?? ''),
                $logo,
                is_array($s['type'] ?? '') ? json_encode($s['type']) : ($s['type'] ?? ''),
                $mainImage,
                json_encode($gallery),
                $s['about'] ?? '',
                $s['aboutAr'] ?? '',
                $s['phone'] ?? '',
                $s['email'] ?? '',
                $s['website'] ?? '',
                $s['rating'] ?? '',
                $s['studentCount'] ?? '',
                $s['teachersCount'] ?? '',
                $s['foundedYear'] ?? '',
                $s['address'] ?? '',
                $s['addressAr'] ?? '',
                $s['applicationLink'] ?? ''
            ]);
            bustCache();
            echo json_encode(["status" => "success", "message" => "School saved successfully."]);
            break;

        case 'save_job':
            requireAuth(); // Protected: only admin can save jobs
            $j = json_decode(file_get_contents('php://input'), true);
            if (!$j) throw new Exception("Data required");
            
            // Migration: Ensure image column exists
            try {
                $pdo->query("SELECT image FROM jobs LIMIT 1");
            } catch (Exception $e) {
                $pdo->exec("ALTER TABLE jobs ADD COLUMN image TEXT NULL");
            }

            // Convert base64 image to file path
            $jobImage = processImageField($j['image'] ?? '', 'job');

            $stmt = $pdo->prepare("REPLACE INTO jobs (id, title, titleAr, department, departmentAr, location, locationAr, type, typeAr, description, descriptionAr, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
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
                $j['descriptionAr'] ?? '',
                $jobImage
            ]);
            bustCache();
            echo json_encode(["status" => "success", "message" => "Job saved successfully."]);
            break;

        case 'delete_news':
            requireAuth(); // Protected: only admin can delete news
            $id = $_GET['id'] ?? '';
            if (!$id) throw new Exception("ID required");
            $stmt = $pdo->prepare("DELETE FROM news WHERE id = ?");
            $stmt->execute([$id]);
            bustCache();
            echo json_encode(["status" => "success", "message" => "Deleted."]);
            break;

        case 'delete_school':
            requireAuth(); // Protected: only admin can delete schools
            $id = $_GET['id'] ?? '';
            if (!$id) throw new Exception("ID required");
            $stmt = $pdo->prepare("DELETE FROM schools WHERE id = ?");
            $stmt->execute([$id]);
            bustCache();
            echo json_encode(["status" => "success", "message" => "Deleted."]);
            break;

        case 'delete_job':
            requireAuth(); // Protected: only admin can delete jobs
            $id = $_GET['id'] ?? '';
            if (!$id) throw new Exception("ID required");
            $stmt = $pdo->prepare("DELETE FROM jobs WHERE id = ?");
            $stmt->execute([$id]);
            bustCache();
            echo json_encode(["status" => "success", "message" => "Deleted."]);
            break;

        case 'delete_entry':
            requireAuth();
            $input = json_decode(file_get_contents('php://input'), true);
            if (!is_array($input)) throw new Exception('Invalid JSON payload');

            $allowedTypes = ['complaints', 'contactMessages', 'jobApplications', 'admissions'];
            $type = $input['type'] ?? '';
            $id   = $input['id']   ?? '';

            if (!in_array($type, $allowedTypes, true)) throw new Exception('Invalid entry type');
            if (!$id) throw new Exception('Entry id is required');

            $tableMap = [
                'complaints' => 'complaints',
                'contactMessages' => 'contact_messages',
                'jobApplications' => 'job_applications',
                'admissions' => 'admissions'
            ];
            $tableName = $tableMap[$type] ?? null;
            if (!$tableName) throw new Exception('Invalid entry type');

            $stmt = $pdo->prepare("DELETE FROM {$tableName} WHERE id = ?");
            $stmt->execute([$id]);

            bustCache();
            echo json_encode(["status" => "success", "message" => "Entry deleted successfully."]);
            break;

        case 'save_governorate':
            requireAuth(); // Protected: only admin can save governorates
            $gov = json_decode(file_get_contents('php://input'), true);
            if (!$gov) throw new Exception("Data required");
            
            $id = $gov['id'] ?? uniqid('gov_');
            $name = $gov['name'] ?? '';
            $nameAr = $gov['nameAr'] ?? '';
            
            if (!$name || !$nameAr) throw new Exception("Name and Arabic name are required");
            
            $stmt = $pdo->prepare("REPLACE INTO governorates (id, name, nameAr) VALUES (?, ?, ?)");
            $stmt->execute([$id, $name, $nameAr]);
            
            bustCache();
            echo json_encode(["status" => "success", "message" => "Governorate saved successfully."]);
            break;

        case 'delete_governorate':
            requireAuth(); // Protected: only admin can delete governorates
            $id = $_GET['id'] ?? '';
            if (!$id) throw new Exception("ID required");
            
            $stmt = $pdo->prepare("DELETE FROM governorates WHERE id = ?");
            $stmt->execute([$id]);
            
            bustCache();
            echo json_encode(["status" => "success", "message" => "Governorate deleted successfully."]);
            break;

        case 'save_alumni':
            requireAuth(); // Protected: only admin can save alumni
            $a = json_decode(file_get_contents('php://input'), true);
            if (!$a) throw new Exception("Data required");

            // Convert base64 image to file path
            $image = processImageField($a['image'] ?? '', 'alumni');

            $stmt = $pdo->prepare("REPLACE INTO alumni (id, name, nameAr, image, school, schoolAr, graduationYear, degree, degreeAr, jobTitle, jobTitleAr, company, companyAr, testimonial, testimonialAr, linkedin, twitter, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $a['id'] ?? uniqid(),
                $a['name'] ?? '',
                $a['nameAr'] ?? ($a['name'] ?? ''),
                $image,
                $a['school'] ?? '',
                $a['schoolAr'] ?? ($a['school'] ?? ''),
                $a['graduationYear'] ?? '',
                $a['degree'] ?? '',
                $a['degreeAr'] ?? ($a['degree'] ?? ''),
                $a['jobTitle'] ?? '',
                $a['jobTitleAr'] ?? ($a['jobTitle'] ?? ''),
                $a['company'] ?? '',
                $a['companyAr'] ?? ($a['company'] ?? ''),
                $a['testimonial'] ?? '',
                $a['testimonialAr'] ?? '',
                $a['linkedin'] ?? '',
                $a['twitter'] ?? '',
                isset($a['featured']) ? (int)$a['featured'] : 0
            ]);
            bustCache();
            echo json_encode(["status" => "success", "message" => "Alumni saved successfully."]);
            break;

        case 'delete_alumni':
            requireAuth(); // Protected: only admin can delete alumni
            $id = $_GET['id'] ?? '';
            if (!$id) throw new Exception("ID required");

            $stmt = $pdo->prepare("DELETE FROM alumni WHERE id = ?");
            $stmt->execute([$id]);

            bustCache();
            echo json_encode(["status" => "success", "message" => "Alumni deleted successfully."]);
            break;

        // ═══════════════════════════════════════════════════════════════════════════
        // NEW ADMISSION & MODIFICATION APIs
        // ═══════════════════════════════════════════════════════════════════════════

        case 'request_modification':
            // Student: Request to modify preferences
            $input = json_decode(file_get_contents('php://input'), true);
            $admissionId = sanitizeInput($input['admissionId'] ?? '');
            $requestedPreferences = $input['requestedPreferences'] ?? [];
            $reason = sanitizeInput($input['reason'] ?? '');
            
            if (empty($admissionId) || empty($reason)) {
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => "Admission ID and reason are required"]);
                break;
            }
            
            if (empty($requestedPreferences) || !is_array($requestedPreferences)) {
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => "Preferences are required"]);
                break;
            }
            
            // Check admission exists and status allows modification request
            $checkStmt = $pdo->prepare("
                SELECT id, student_national_id, status FROM admissions WHERE id = ?
            ");
            $checkStmt->execute([$admissionId]);
            $admission = $checkStmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$admission) {
                http_response_code(404);
                echo json_encode(["status" => "error", "message" => "Admission not found"]);
                break;
            }
            
            // Only allow modification requests for certain statuses
            if (!in_array($admission['status'], ['pending', 'under_review', 'accepted'])) {
                http_response_code(400);
                echo json_encode([
                    "status" => "error",
                    "message" => "لا يمكن طلب تعديل في الحالة الحالية"
                ]);
                break;
            }
            
            // Check for pending modification request
            $pendingStmt = $pdo->prepare("
                SELECT id FROM modification_requests 
                WHERE admission_id = ? AND status = 'pending'
            ");
            $pendingStmt->execute([$admissionId]);
            if ($pendingStmt->fetch()) {
                http_response_code(409);
                echo json_encode([
                    "status" => "error",
                    "message" => "يوجد طلب تعديل معلق بالفعل"
                ]);
                break;
            }
            
            // Generate modification request number
            $nationalId = $admission['student_national_id'];
            $requestNumber = generateModificationNumber($nationalId, $pdo);
            
            // Create modification request
            $id = uniqid('MODREQ_');
            $stmt = $pdo->prepare("
                INSERT INTO modification_requests (
                    id, request_number, admission_id, national_id_suffix,
                    requested_preferences, request_reason, status, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, 'pending', NOW())
            ");
            
            $stmt->execute([
                $id,
                $requestNumber,
                $admissionId,
                substr($nationalId, -4),
                json_encode($requestedPreferences, JSON_UNESCAPED_UNICODE),
                $reason
            ]);
            
            // Update admission status
            $pdo->prepare("UPDATE admissions SET status = 'modification_requested' WHERE id = ?")
                ->execute([$admissionId]);
            
            bustCache();
            echo json_encode([
                "status" => "success",
                "message" => "تم تقديم طلب التعديل بنجاح",
                "data" => [
                    "requestId" => $id,
                    "requestNumber" => $requestNumber,
                    "trackUrl" => "/modifications/track?requestNumber={$requestNumber}"
                ]
            ]);
            break;

        case 'get_modification_status':
            // Track modification request status
            $requestNumber = sanitizeInput($_GET['requestNumber'] ?? '');
            $nationalIdSuffix = sanitizeInput($_GET['nationalIdSuffix'] ?? '');
            
            if (empty($requestNumber)) {
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => "Request number is required"]);
                break;
            }
            
            $sql = "
                SELECT mr.*, a.student_name, a.student_national_id
                FROM modification_requests mr
                JOIN admissions a ON mr.admission_id = a.id
                WHERE mr.request_number = ?
            ";
            $params = [$requestNumber];
            
            // Optional: verify last 4 digits of national ID for security
            if (!empty($nationalIdSuffix)) {
                $sql .= " AND mr.national_id_suffix = ?";
                $params[] = $nationalIdSuffix;
            }
            
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $request = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$request) {
                http_response_code(404);
                echo json_encode(["status" => "error", "message" => "Request not found"]);
                break;
            }
            
            // Mask student name
            $studentName = $request['student_name'] ?? '';
            $maskedName = mb_strlen($studentName) > 3
                ? mb_substr($studentName, 0, 3) . '***'
                : $studentName . '***';
            
            echo json_encode([
                "status" => "success",
                "data" => [
                    "requestNumber" => $request['request_number'],
                    "studentName" => $maskedName,
                    "status" => $request['status'],
                    "statusLabel" => getModificationStatusLabel($request['status']),
                    "reason" => $request['request_reason'],
                    "adminResponse" => $request['admin_response'],
                    "requestedAt" => $request['created_at'],
                    "reviewedAt" => $request['reviewed_at'],
                    "completedAt" => $request['completed_at'],
                    "requestedPreferences" => json_decode($request['requested_preferences'], true),
                    "actions" => [
                        "canResubmit" => $request['status'] === 'rejected',
                        "canEdit" => $request['status'] === 'approved'
                    ]
                ]
            ]);
            break;

        case 'review_modification':
            // Admin only: Approve or reject modification request
            requireAuth();
            
            $input = json_decode(file_get_contents('php://input'), true);
            $requestId = sanitizeInput($input['requestId'] ?? '');
            $action = sanitizeInput($input['action'] ?? ''); // 'approve' or 'reject'
            $adminResponse = sanitizeInput($input['adminResponse'] ?? '');
            
            if (empty($requestId) || !in_array($action, ['approve', 'reject'])) {
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => "Request ID and valid action (approve/reject) are required"]);
                break;
            }
            
            if ($action === 'reject' && empty($adminResponse)) {
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => "Rejection reason is required"]);
                break;
            }
            
            // Get request details
            $stmt = $pdo->prepare("
                SELECT * FROM modification_requests WHERE id = ? AND status = 'pending'
            ");
            $stmt->execute([$requestId]);
            $request = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$request) {
                http_response_code(404);
                echo json_encode(["status" => "error", "message" => "Request not found or already processed"]);
                break;
            }
            
            $user = requireAuth();
            $newStatus = $action === 'approve' ? 'approved' : 'rejected';
            $admissionStatus = $action === 'approve' ? 'modification_approved' : 'pending';
            
            // Update modification request
            $updateStmt = $pdo->prepare("
                UPDATE modification_requests 
                SET status = ?, admin_response = ?, reviewed_by = ?, reviewed_at = NOW()
                WHERE id = ?
            ");
            $updateStmt->execute([$newStatus, $adminResponse, $user['id'], $requestId]);
            
            // Update admission status
            $admissionStmt = $pdo->prepare("
                UPDATE admissions SET status = ? WHERE id = ?
            ");
            $admissionStmt->execute([$admissionStatus, $request['admission_id']]);
            
            bustCache();
            
            $message = $action === 'approve'
                ? "تمت الموافقة على طلب التعديل"
                : "تم رفض طلب التعديل";
            
            echo json_encode([
                "status" => "success",
                "message" => $message,
                "data" => [
                    "requestId" => $requestId,
                    "newStatus" => $newStatus,
                    "admissionStatus" => $admissionStatus,
                    "adminResponse" => $adminResponse
                ]
            ]);
            break;

        default:
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "Invalid action."]);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    error_log('[NIS API Error] Action: ' . ($action ?? 'unknown') . ' | ' . $e->getMessage() . ' | ' . $e->getFile() . ':' . $e->getLine());
    echo json_encode(["status" => "error", "message" => $e->getMessage(), "file" => basename($e->getFile()), "line" => $e->getLine()]);
}
?>
