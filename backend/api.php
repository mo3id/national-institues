<?php
// api.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'db_config.php';

$action = $_GET['action'] ?? '';

try {
    switch ($action) {
        case 'get_site_data':
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
                'heroSlides' => $settings['heroSlides'] ?? [],
                'aboutData' => $settings['aboutData'] ?? new stdClass(),
                'complaints' => $settings['complaints'] ?? [],
                'contactMessages' => $settings['contactMessages'] ?? [],
                'stats' => $settings['stats'] ?? new stdClass(),
                'homeData' => $settings['homeData'] ?? new stdClass(),
                'partners' => $settings['partners'] ?? [],
                'galleryImages' => $settings['galleryImages'] ?? [],
                'formSettings' => $settings['formSettings'] ?? new stdClass(),
            ];

            echo json_encode(["status" => "success", "data" => $response]);
            break;

        case 'update_category':
            $input = json_decode(file_get_contents('php://input'), true);
            $category = $input['category'] ?? '';
            $newData = $input['newData'] ?? [];
            if (!$category) throw new Exception("Category required");

            if ($category === 'schools') {
                $pdo->exec("DELETE FROM schools");
                $stmt = $pdo->prepare("INSERT INTO schools (id, name, nameAr, location, locationAr, governorate, governorateAr, principal, principalAr, logo, type, mainImage, gallery) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                foreach ($newData as $s) {
                    $stmt->execute([$s['id'], $s['name'], $s['nameAr'], $s['location'], $s['locationAr'], $s['governorate'], $s['governorateAr'], $s['principal'], $s['principalAr'] ?? '', $s['logo'], $s['type'], $s['mainImage'] ?? '', json_encode($s['gallery'] ?? [])]);
                }
            } elseif ($category === 'news') {
                $pdo->exec("DELETE FROM news");
                $stmt = $pdo->prepare("INSERT INTO news (id, title, titleAr, date, summary, summaryAr, image, published) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
                foreach ($newData as $n) {
                    $stmt->execute([$n['id'], $n['title'], $n['titleAr'], $n['date'], $n['summary'], $n['summaryAr'], $n['image'], $n['published'] ? 1 : 0]);
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
            echo json_encode(["status" => "success", "message" => "Updated successfully.", "category" => $category]);
            break;

        case 'add_complaint':
            $input = json_decode(file_get_contents('php://input'), true);
            $stmt = $pdo->query("SELECT setting_value FROM settings WHERE setting_key = 'complaints'");
            $row = $stmt->fetch();
            $complaints = $row ? json_decode($row['setting_value'], true) : [];
            $input['id'] = uniqid();
            $input['createdAt'] = date('c');
            $input['status'] = 'Pending';
            $complaints[] = $input;
            $stmt = $pdo->prepare("REPLACE INTO settings (setting_key, setting_value) VALUES ('complaints', ?)");
            $stmt->execute([json_encode($complaints)]);
            echo json_encode(["status" => "success", "message" => "Complaint added successfully.", "data" => $input]);
            break;

        case 'add_contact_message':
             $input = json_decode(file_get_contents('php://input'), true);
             $stmt = $pdo->query("SELECT setting_value FROM settings WHERE setting_key = 'contactMessages'");
             $row = $stmt->fetch();
             $messages = $row ? json_decode($row['setting_value'], true) : [];
             $input['id'] = uniqid();
             $input['createdAt'] = date('c');
             $input['status'] = 'Pending';
             $messages[] = $input;
             $stmt = $pdo->prepare("REPLACE INTO settings (setting_key, setting_value) VALUES ('contactMessages', ?)");
             $stmt->execute([json_encode($messages)]);
             echo json_encode(["status" => "success", "message" => "Message sent successfully.", "data" => $input]);
             break;

        case 'add_job_application':
             $input = json_decode(file_get_contents('php://input'), true);
             $stmt = $pdo->query("SELECT setting_value FROM settings WHERE setting_key = 'jobApplications'");
             $row = $stmt->fetch();
             $applications = $row ? json_decode($row['setting_value'], true) : [];
             $input['id'] = uniqid();
             $input['appliedAt'] = date('c');
             $input['status'] = 'Pending';
             $applications[] = $input;
             $stmt = $pdo->prepare("REPLACE INTO settings (setting_key, setting_value) VALUES ('jobApplications', ?)");
             $stmt->execute([json_encode($applications)]);
             echo json_encode(["status" => "success", "message" => "Application submitted successfully.", "data" => $input]);
             break;

        default:
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "Invalid action."]);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Server error: " . $e->getMessage()]);
}
?>
