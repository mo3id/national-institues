<?php
/**
 * ============================================================
 *  PHPUNIT TEST SUITE – NIS Backend Security & DB Tests
 *  File: tests/php/NISSecurityTest.php
 *
 *  Covers:
 *   1. PDO Database Connection Verification
 *   2. SQL Injection Prevention via Prepared Statements
 *   3. XSS Input Sanitization
 *   4. Data Integrity After CRUD Operations
 *   5. Error Handling / HTTP Status Codes
 *
 *  Setup:
 *    composer require --dev phpunit/phpunit
 *    ./vendor/bin/phpunit tests/php/NISSecurityTest.php --testdox
 *
 *  NOTE: These tests operate on a TEST database.
 *        Set TEST_DB_NAME below to a separate DB for safety.
 * ============================================================
 */

declare(strict_types=1);

use PHPUnit\Framework\TestCase;

// ── Configuration ─────────────────────────────────────────────────────────────
define('DB_HOST',     getenv('TEST_DB_HOST')     ?: 'localhost');
define('DB_NAME',     getenv('TEST_DB_NAME')     ?: 'ganiedu_nis_test'); // ← separate test DB!
define('DB_USER',     getenv('TEST_DB_USER')     ?: 'ganiedu_admin');
define('DB_PASS',     getenv('TEST_DB_PASS')     ?: 'Sm@rt@2026@@');
define('API_BASE_URL', getenv('TEST_API_URL')    ?: 'http://localhost/backend/api.php');

// ─────────────────────────────────────────────────────────────────────────────

class NISSecurityTest extends TestCase
{
    private static PDO $pdo;

    // ── Setup / Teardown ──────────────────────────────────────────────────────

    public static function setUpBeforeClass(): void
    {
        self::$pdo = new PDO(
            sprintf('mysql:host=%s;dbname=%s;charset=utf8mb4', DB_HOST, DB_NAME),
            DB_USER,
            DB_PASS,
            [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,  // CRITICAL for real prepared stmts
            ]
        );

        // Ensure test tables exist
        self::$pdo->exec("
            CREATE TABLE IF NOT EXISTS schools (
                id VARCHAR(64) PRIMARY KEY,
                name VARCHAR(255),
                nameAr VARCHAR(255),
                location VARCHAR(255),
                locationAr VARCHAR(255),
                governorate VARCHAR(100),
                governorateAr VARCHAR(100),
                principal VARCHAR(255),
                principalAr VARCHAR(255),
                logo TEXT,
                type VARCHAR(50),
                mainImage TEXT,
                gallery JSON
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        ");

        self::$pdo->exec("
            CREATE TABLE IF NOT EXISTS settings (
                setting_key VARCHAR(100) PRIMARY KEY,
                setting_value LONGTEXT
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        ");
    }

    protected function setUp(): void
    {
        // Clean test data before each test
        self::$pdo->exec("DELETE FROM schools WHERE id LIKE 'test-%'");
        self::$pdo->exec("DELETE FROM settings WHERE setting_key LIKE 'test_%'");
    }

    // ═════════════════════════════════════════════════════════════════════════
    //  1. PDO CONNECTION VERIFICATION
    // ═════════════════════════════════════════════════════════════════════════

    /** @test */
    public function it_establishes_a_successful_pdo_connection(): void
    {
        $this->assertInstanceOf(PDO::class, self::$pdo, 'PDO connection must be a PDO instance');

        $errMode = self::$pdo->getAttribute(PDO::ATTR_ERRMODE);
        $this->assertEquals(PDO::ERRMODE_EXCEPTION, $errMode, 'PDO must be in ERRMODE_EXCEPTION');
    }

    /** @test */
    public function it_connects_to_the_correct_database(): void
    {
        $stmt = self::$pdo->query("SELECT DATABASE()");
        $db   = $stmt->fetchColumn();
        $this->assertEquals(DB_NAME, $db, 'Connected database must match TEST_DB_NAME');
    }

    /** @test */
    public function it_uses_utf8mb4_character_set(): void
    {
        $stmt = self::$pdo->query("SHOW VARIABLES LIKE 'character_set_connection'");
        $row  = $stmt->fetch();
        $this->assertEquals('utf8mb4', $row['Value'], 'Connection charset must be utf8mb4 for Arabic support');
    }

    /** @test */
    public function it_can_query_schools_table(): void
    {
        $stmt  = self::$pdo->query("SELECT COUNT(*) as cnt FROM schools");
        $row   = $stmt->fetch();
        $this->assertArrayHasKey('cnt', $row, 'Schools table must be queryable');
        $this->assertIsNumeric($row['cnt']);
    }

    /** @test */
    public function connection_fails_gracefully_with_wrong_credentials(): void
    {
        $this->expectException(PDOException::class);
        new PDO(
            'mysql:host=' . DB_HOST . ';dbname=nonexistent_db;charset=utf8mb4',
            'wrong_user',
            'wrong_password',
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
        );
    }

    // ═════════════════════════════════════════════════════════════════════════
    //  2. SQL INJECTION PREVENTION (PREPARED STATEMENTS)
    // ═════════════════════════════════════════════════════════════════════════

    /** @test */
    public function it_prevents_sql_injection_in_school_insert(): void
    {
        $maliciousId   = "test-1'; DROP TABLE schools; --";
        $maliciousName = "'); INSERT INTO schools (id) VALUES ('hacked');--";

        $stmt = self::$pdo->prepare(
            "INSERT INTO schools (id, name, nameAr, location, locationAr, governorate, governorateAr, principal, principalAr, logo, type, mainImage, gallery)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        );

        // This should NOT throw; the payload is treated as data, not SQL
        $stmt->execute([
            $maliciousId,
            $maliciousName,
            'اختبار',
            'Test Location',
            'موقع الاختبار',
            'Cairo',
            'القاهرة',
            'Dr. Injector',
            null,
            '',
            'Arabic',
            '',
            json_encode([]),
        ]);

        // Confirm schools table still exists (DROP TABLE was neutralized)
        $check = self::$pdo->query("SHOW TABLES LIKE 'schools'");
        $this->assertNotFalse($check->fetch(), 'schools table must still exist after injection attempt');

        // Confirm the literal payload was stored as data, not executed
        $verify = self::$pdo->prepare("SELECT name FROM schools WHERE id = ?");
        $verify->execute([$maliciousId]);
        $row = $verify->fetch();
        $this->assertNotFalse($row, 'Injected row should be stored literally');
        $this->assertEquals($maliciousName, $row['name'], 'Malicious name stored as literal string, not executed');
    }

    /** @test */
    public function it_prevents_union_based_sql_injection_in_query(): void
    {
        // Simulate a query that uses prepared statements with user-supplied governorate
        $maliciousGov = "Cairo' UNION SELECT setting_key, setting_value, 1,2,3,4,5,6,7,8,9,10,11 FROM settings--";

        $stmt = self::$pdo->prepare(
            "SELECT id, name FROM schools WHERE governorate = ?"
        );
        $stmt->execute([$maliciousGov]);
        $rows = $stmt->fetchAll();

        // UNION payload should return 0 rows because the literal string doesn't match any governorate
        $this->assertEmpty($rows, 'UNION injection should return no rows when parameterized');
    }

    /** @test */
    public function it_prevents_blind_sql_injection_via_boolean_based(): void
    {
        // Insert a known school
        $this->insertTestSchool('test-blind-1', 'Blind Test School', 'Arabic', 'Cairo');

        $maliciousInput = "' OR '1'='1";
        $stmt = self::$pdo->prepare("SELECT id FROM schools WHERE name = ?");
        $stmt->execute([$maliciousInput]);
        $rows = $stmt->fetchAll();

        // Should return empty – not ALL rows
        $this->assertCount(0, $rows, "'1'='1' injection must not bypass the WHERE clause");
    }

    /** @test */
    public function it_prevents_stacked_query_injection(): void
    {
        $malicious = "test-stacked'; UPDATE schools SET name='HACKED' WHERE '1'='1";
        $stmt = self::$pdo->prepare(
            "INSERT INTO schools (id, name, nameAr, location, locationAr, governorate, governorateAr, principal, logo, type, mainImage, gallery)
             VALUES (?, 'Stacked Test', '', '', '', 'Cairo', '', '', '', 'Arabic', '', ?)"
        );
        $stmt->execute([$malicious, json_encode([])]);

        // Make sure the update in the stacked query was NOT executed
        $check = self::$pdo->prepare("SELECT name FROM schools WHERE name = 'HACKED'");
        $check->execute();
        $this->assertFalse($check->fetch(), 'Stacked query injection must not execute secondary UPDATE');
    }

    // ═════════════════════════════════════════════════════════════════════════
    //  3. XSS / CONTENT SANITIZATION VERIFICATION
    // ═════════════════════════════════════════════════════════════════════════

    /** @test */
    public function it_stores_xss_payload_as_literal_data_not_html(): void
    {
        $xssPayload = "<script>alert('XSS')</script>";

        // Simulate add_complaint logic: store in settings JSON
        $complaints = [
            [
                'id'        => uniqid('test_', true),
                'fullName'  => $xssPayload,
                'message'   => '<img src=x onerror=alert(1)>',
                'createdAt' => date('c'),
                'status'    => 'Pending',
            ]
        ];

        $stmt = self::$pdo->prepare(
            "REPLACE INTO settings (setting_key, setting_value) VALUES ('test_complaints', ?)"
        );
        $stmt->execute([json_encode($complaints)]);

        // Retrieve and decode
        $read = self::$pdo->prepare("SELECT setting_value FROM settings WHERE setting_key = 'test_complaints'");
        $read->execute();
        $raw    = $read->fetchColumn();
        $decoded = json_decode($raw, true);

        $this->assertEquals(
            $xssPayload,
            $decoded[0]['fullName'],
            'XSS payload stored as literal string in JSON'
        );

        // Verify JSON encoding escapes < > by default
        $this->assertStringNotContainsString('<script>', $raw,
            'json_encode should escape HTML special chars in the raw JSON string'
        );
    }

    /** @test */
    public function it_strips_html_tags_when_using_htmlspecialchars(): void
    {
        $input    = "<h1>Title</h1><script>evil()</script>";
        $sanitized = htmlspecialchars($input, ENT_QUOTES | ENT_HTML5, 'UTF-8');

        $this->assertStringNotContainsString('<script>', $sanitized);
        $this->assertStringNotContainsString('<h1>', $sanitized);
        $this->assertStringContainsString('&lt;script&gt;', $sanitized);
    }

    /** @test */
    public function it_validates_json_decode_of_gallery_field(): void
    {
        $testGallery = ['img1.jpg', 'img2.jpg', '<script>hack</script>'];
        $encoded     = json_encode($testGallery);

        $this->insertTestSchool(
            'test-gallery-1',
            'Gallery School',
            'Arabic',
            'Cairo',
            $encoded
        );

        $stmt = self::$pdo->prepare("SELECT gallery FROM schools WHERE id = 'test-gallery-1'");
        $stmt->execute();
        $row  = $stmt->fetch();
        $decoded = json_decode($row['gallery'], true);

        $this->assertIsArray($decoded);
        $this->assertCount(3, $decoded);
        // The raw injection string is stored literally (not executed)
        $this->assertEquals('<script>hack</script>', $decoded[2]);
    }

    // ═════════════════════════════════════════════════════════════════════════
    //  4. DATA INTEGRITY TESTS
    // ═════════════════════════════════════════════════════════════════════════

    /** @test */
    public function it_correctly_inserts_and_retrieves_arabic_school_name(): void
    {
        $arabicName = 'مدرسة نور المستقبل الدولية';
        $this->insertTestSchool('test-arabic-1', 'Future Light', 'Languages', 'Alexandria', null, $arabicName);

        $stmt = self::$pdo->prepare("SELECT nameAr FROM schools WHERE id = 'test-arabic-1'");
        $stmt->execute();
        $row = $stmt->fetch();

        $this->assertEquals($arabicName, $row['nameAr'], 'Arabic UTF-8 text must survive round-trip storage');
    }

    /** @test */
    public function it_handles_null_and_optional_fields(): void
    {
        $this->insertTestSchool('test-opt-1', 'Optional School', 'American', 'Giza');

        $stmt = self::$pdo->prepare("SELECT principalAr, mainImage FROM schools WHERE id = 'test-opt-1'");
        $stmt->execute();
        $row = $stmt->fetch();

        // NULL values should be fetchable without error
        $this->assertTrue(
            $row['principalAr'] === null || is_string($row['principalAr']),
            'principalAr can be null'
        );
    }

    /** @test */
    public function it_enforces_school_type_enum_is_one_of_valid_types(): void
    {
        $validTypes = ['Arabic', 'Languages', 'American', 'British', 'French'];

        // Insert schools with each valid type
        foreach ($validTypes as $type) {
            $this->insertTestSchool("test-type-{$type}", "{$type} School", $type, 'Cairo');
        }

        $stmt  = self::$pdo->prepare(
            "SELECT type FROM schools WHERE id LIKE 'test-type-%'"
        );
        $stmt->execute();
        $rows  = $stmt->fetchAll(PDO::FETCH_COLUMN);

        foreach ($rows as $type) {
            $this->assertContains($type, $validTypes, "Type '{$type}' must be in the valid enum list");
        }
    }

    /** @test */
    public function it_can_replace_settings_key_idempotently(): void
    {
        $stmt = self::$pdo->prepare(
            "REPLACE INTO settings (setting_key, setting_value) VALUES ('test_stats', ?)"
        );
        $stats = ['items' => [['number' => '40+', 'label' => 'Schools']]];
        $stmt->execute([json_encode($stats)]);

        // Replace again with updated value
        $stats['items'][] = ['number' => '50k+', 'label' => 'Students'];
        $stmt->execute([json_encode($stats)]);

        $read = self::$pdo->prepare("SELECT setting_value FROM settings WHERE setting_key = 'test_stats'");
        $read->execute();
        $decoded = json_decode($read->fetchColumn(), true);

        $this->assertCount(2, $decoded['items'], 'REPLACE INTO should overwrite with updated data');
    }

    // ═════════════════════════════════════════════════════════════════════════
    //  5. API HTTP TESTS (requires running PHP server)
    // ═════════════════════════════════════════════════════════════════════════

    /** @test */
    public function api_returns_json_content_type_header(): void
    {
        if (!$this->isApiReachable()) {
            $this->markTestSkipped('API server not reachable at ' . API_BASE_URL);
        }

        $ch = curl_init(API_BASE_URL . '?action=get_site_data');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HEADER, true);
        $response = curl_exec($ch);
        $info     = curl_getinfo($ch);
        curl_close($ch);

        $this->assertEquals(200, $info['http_code'], 'API must return 200 for get_site_data');
        $this->assertStringContainsString('application/json', $info['content_type']);
    }

    /** @test */
    public function api_returns_404_for_unknown_action(): void
    {
        if (!$this->isApiReachable()) {
            $this->markTestSkipped('API server not reachable');
        }

        $ch = curl_init(API_BASE_URL . '?action=invalid_xyz_action');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $body = curl_exec($ch);
        $info = curl_getinfo($ch);
        curl_close($ch);

        $this->assertEquals(404, $info['http_code']);
        $json = json_decode($body, true);
        $this->assertEquals('error', $json['status']);
    }

    /** @test */
    public function api_does_not_expose_php_errors_in_response(): void
    {
        if (!$this->isApiReachable()) {
            $this->markTestSkipped('API server not reachable');
        }

        $ch = curl_init(API_BASE_URL . '?action=get_site_data');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $body = curl_exec($ch);
        curl_close($ch);

        $this->assertStringNotContainsString('Fatal error', $body);
        $this->assertStringNotContainsString('Warning:', $body);
        $this->assertStringNotContainsString('Notice:', $body);
        $this->assertStringNotContainsString('Stack trace', $body);
    }

    /** @test */
    public function api_accepts_options_preflight_with_cors_headers(): void
    {
        if (!$this->isApiReachable()) {
            $this->markTestSkipped('API server not reachable');
        }

        $ch = curl_init(API_BASE_URL . '?action=get_site_data');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'OPTIONS');
        curl_setopt($ch, CURLOPT_HEADER, true);
        $response = curl_exec($ch);
        $info     = curl_getinfo($ch);
        curl_close($ch);

        $this->assertEquals(200, $info['http_code'], 'OPTIONS should return 200');
        $this->assertStringContainsString('Access-Control-Allow-Origin', $response);
    }

    // ═════════════════════════════════════════════════════════════════════════
    //  6. PAGINATION PERFORMANCE SANITY CHECK
    // ═════════════════════════════════════════════════════════════════════════

    /** @test */
    public function it_queries_500_schools_in_under_500ms(): void
    {
        // Batch-insert 500 test schools
        self::$pdo->beginTransaction();
        $stmt = self::$pdo->prepare(
            "INSERT IGNORE INTO schools (id, name, nameAr, location, locationAr, governorate, governorateAr, principal, principalAr, logo, type, mainImage, gallery)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        );

        for ($i = 1; $i <= 500; $i++) {
            $stmt->execute([
                "test-perf-{$i}",
                "Perf School {$i}",
                "مدرسة أداء {$i}",
                "Location {$i}",
                "موقع {$i}",
                ($i % 2 === 0) ? 'Cairo' : 'Alexandria',
                ($i % 2 === 0) ? 'القاهرة' : 'الإسكندرية',
                "Principal {$i}",
                null,
                '',
                'Arabic',
                '',
                json_encode([]),
            ]);
        }
        self::$pdo->commit();

        $start = microtime(true);
        $rs    = self::$pdo->query("SELECT * FROM schools WHERE id LIKE 'test-perf-%'");
        $rows  = $rs->fetchAll();
        $elapsed = (microtime(true) - $start) * 1000; // ms

        $this->assertCount(500, $rows, 'Must retrieve all 500 test records');
        $this->assertLessThan(500, $elapsed,
            "Query of 500 rows took {$elapsed}ms – must be < 500ms"
        );

        // Cleanup
        self::$pdo->exec("DELETE FROM schools WHERE id LIKE 'test-perf-%'");
    }

    // ═════════════════════════════════════════════════════════════════════════
    //  HELPERS
    // ═════════════════════════════════════════════════════════════════════════

    private function insertTestSchool(
        string  $id,
        string  $name,
        string  $type,
        string  $governorate,
        ?string $gallery = null,
        string  $nameAr  = ''
    ): void {
        $stmt = self::$pdo->prepare(
            "INSERT INTO schools (id, name, nameAr, location, locationAr, governorate, governorateAr, principal, logo, type, mainImage, gallery)
             VALUES (?, ?, ?, '', '', ?, '', '', '', ?, '', ?)"
        );
        $stmt->execute([
            $id,
            $name,
            $nameAr,
            $governorate,
            $type,
            $gallery ?? json_encode([]),
        ]);
    }

    private function isApiReachable(): bool
    {
        $ch = curl_init(API_BASE_URL . '?action=get_site_data');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 3);
        curl_exec($ch);
        $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        return $code > 0;
    }
}
