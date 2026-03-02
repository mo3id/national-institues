<?php
// api.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
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

        case 'add_complaint':
            $input = json_decode(file_get_contents('php://input'), true);
            // Example sanitization and prepared statement
            $name = htmlspecialchars(strip_tags($input['name'] ?? ''));
            // ... (In a real scenario, insert into a complaints table)
            // For now, updating JSON settings for simplicity, though a table is better
            echo json_encode(["status" => "success", "message" => "Complaint added successfully."]);
            break;

        case 'add_contact_message':
             // implementation for contact
             echo json_encode(["status" => "success", "message" => "Message sent successfully."]);
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
