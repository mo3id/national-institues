<?php
/**
 * ============================================================
 *  DATABASE STRESS TEST SEEDER
 *  File: tests/php/DatabaseSeeder.php
 *
 *  Seeds the MySQL database with 5,000+ mock school records
 *  to test:
 *   - Pagination performance
 *   - Server response time under load
 *   - React Query cache behaviour
 *   - Infinite scroll / virtual list rendering
 *
 *  Usage:
 *    php tests/php/DatabaseSeeder.php [--count=5000] [--batch=100] [--clean]
 *
 *  Options:
 *    --count=N   Total records to insert (default: 5000)
 *    --batch=N   Insert batch size (default: 100, reduces memory)
 *    --clean     Truncate seeded records before inserting
 *
 *  IMPORTANT:
 *    Run this on a STAGING / TEST environment only.
 *    The seeded records use id prefix "seed-" for easy cleanup.
 * ============================================================
 */

declare(strict_types=1);

// ── CLI argument parsing ───────────────────────────────────────────────────

$opts        = getopt('', ['count:', 'batch:', 'clean']);
$TOTAL_COUNT = (int)($opts['count'] ?? 5000);
$BATCH_SIZE  = (int)($opts['batch'] ?? 100);
$DO_CLEAN    = isset($opts['clean']);

// ── DB Config ──────────────────────────────────────────────────────────────

$host   = getenv('DB_HOST') ?: 'localhost';
$dbname = getenv('DB_NAME') ?: 'ganiedu_nis_db';
$user   = getenv('DB_USER') ?: 'ganiedu_admin';
$pass   = getenv('DB_PASS') ?: 'Sm@rt@2026@@';

// ── Reference Data ─────────────────────────────────────────────────────────

$governorates = [
    ['en' => 'Cairo',          'ar' => 'القاهرة'],
    ['en' => 'Alexandria',     'ar' => 'الإسكندرية'],
    ['en' => 'Giza',           'ar' => 'الجيزة'],
    ['en' => 'Dakahlia',       'ar' => 'الدقهلية'],
    ['en' => 'Sharqia',        'ar' => 'الشرقية'],
    ['en' => 'Qalyubia',       'ar' => 'القليوبية'],
    ['en' => 'Port Said',      'ar' => 'بورسعيد'],
    ['en' => 'Suez',           'ar' => 'السويس'],
    ['en' => 'Luxor',          'ar' => 'الأقصر'],
    ['en' => 'Aswan',          'ar' => 'أسوان'],
    ['en' => 'Ismailia',       'ar' => 'الإسماعيلية'],
    ['en' => 'Menofia',        'ar' => 'المنوفية'],
    ['en' => 'Beheira',        'ar' => 'البحيرة'],
    ['en' => 'Sohag',          'ar' => 'سوهاج'],
    ['en' => 'Qena',           'ar' => 'قنا'],
    ['en' => 'Minya',          'ar' => 'المنيا'],
    ['en' => 'Beni Suef',      'ar' => 'بني سويف'],
    ['en' => 'Fayoum',         'ar' => 'الفيوم'],
    ['en' => 'Kafr El Sheikh', 'ar' => 'كفر الشيخ'],
    ['en' => 'Gharbia',        'ar' => 'الغربية'],
    ['en' => 'Damietta',       'ar' => 'دمياط'],
    ['en' => 'North Sinai',    'ar' => 'شمال سيناء'],
    ['en' => 'South Sinai',    'ar' => 'جنوب سيناء'],
    ['en' => 'Red Sea',        'ar' => 'البحر الأحمر'],
    ['en' => 'New Valley',     'ar' => 'الوادي الجديد'],
    ['en' => 'Matrouh',        'ar' => 'مطروح'],
    ['en' => 'Assiut',         'ar' => 'أسيوط'],
];

$schoolTypes = ['Arabic', 'Languages', 'American', 'British', 'French'];

$typeNamesAr = [
    'Arabic'    => 'عربي',
    'Languages' => 'لغات',
    'American'  => 'أمريكي',
    'British'   => 'بريطاني',
    'French'    => 'فرنسي',
];

$arabicFirstNames = ['محمد','أحمد','مريم','فاطمة','عمر','علي','نور','سارة','يوسف','إبراهيم','ليلى','خالد'];
$arabicLastNames  = ['حسن','عبدالله','محمود','إبراهيم','عبدالرحمن','الشريف','سيد','عبدالعزيز','جمال','رضا'];
$englishFirsts    = ['Ahmed','Mohamed','Nora','Fatima','Omar','Youssef','Sara','Layla','Khaled','Ibrahim'];
$englishLasts     = ['Hassan','Abdullah','Mahmoud','Ibrahim','Sharif','Sayed','Gamal','Rady','Kamel','Farouk'];

$schoolNamePrefixesEN = [
    'National', 'Future', 'Excellence', 'Pioneer', 'Modern',
    'Advanced', 'Elite', 'Heritage', 'Bright', 'Sunrise', 'Horizon', 'New Era',
];
$schoolNameSuffixesEN = [
    'Institute', 'Academy', 'School', 'Educational Center',
    'International School', 'College', 'High School',
];
$schoolNamePrefixesAR = [
    'معهد', 'مدرسة', 'أكاديمية', 'مركز', 'مجمع', 'نظام',
];
$schoolNameSuffixesAR = [
    'المستقبل', 'التميز', 'الريادة', 'النور', 'الأمل', 'العلوم', 'المعرفة', 'الحضارة',
];

$cityAreas  = ['Nasr City', 'Heliopolis', 'Maadi', 'Dokki', 'Smouha', 'Mohandessin', 'Zamalek', 'New Cairo', '6th October'];
$cityAreasAR = ['مدينة نصر', 'مصر الجديدة', 'المعادي', 'الدقي', 'السموحة', 'المهندسين', 'الزمالك', 'القاهرة الجديدة', 'السادس من أكتوبر'];

// ── Utility ────────────────────────────────────────────────────────────────

function randFrom(array $arr): string {
    return $arr[array_rand($arr)];
}

function randInt(int $min, int $max): int {
    return random_int($min, $max);
}

function generateGallery(): string {
    $images = [];
    $count  = randInt(0, 5);
    for ($i = 0; $i < $count; $i++) {
        $images[] = "https://picsum.photos/seed/" . randInt(1, 1000) . "/800/600";
    }
    return json_encode($images);
}

// ── PDO Connection ─────────────────────────────────────────────────────────

echo "📡 Connecting to database '{$dbname}' at {$host}...\n";

try {
    $pdo = new PDO(
        "mysql:host={$host};dbname={$dbname};charset=utf8mb4",
        $user,
        $pass,
        [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );
    echo "✅ Connected successfully.\n\n";
} catch (PDOException $e) {
    echo "❌ Connection failed: " . $e->getMessage() . "\n";
    exit(1);
}

// ── Optional Cleanup ───────────────────────────────────────────────────────

if ($DO_CLEAN) {
    echo "🧹 Cleaning previously seeded records (id LIKE 'seed-%')...\n";
    $deleted = $pdo->exec("DELETE FROM schools WHERE id LIKE 'seed-%'");
    echo "   → Deleted {$deleted} records.\n\n";
}

// ── Check existing count ───────────────────────────────────────────────────

$existingCount = (int)$pdo->query("SELECT COUNT(*) FROM schools WHERE id LIKE 'seed-%'")->fetchColumn();
echo "📊 Existing seeded records: {$existingCount}\n";
echo "📊 Target total new records: {$TOTAL_COUNT}\n";
echo "📊 Batch size: {$BATCH_SIZE}\n\n";

// ── Prepared Statement ─────────────────────────────────────────────────────

$stmt = $pdo->prepare(
    "INSERT IGNORE INTO schools
     (id, name, nameAr, location, locationAr, governorate, governorateAr,
      principal, principalAr, logo, type, mainImage, gallery)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
);

// ── Seeding Loop ───────────────────────────────────────────────────────────

$inserted  = 0;
$startTime = microtime(true);
$batches   = (int)ceil($TOTAL_COUNT / $BATCH_SIZE);

echo "🌱 Starting seed insertion...\n";
echo str_repeat('─', 60) . "\n";

for ($batch = 0; $batch < $batches; $batch++) {
    $pdo->beginTransaction();

    $batchCount = min($BATCH_SIZE, $TOTAL_COUNT - ($batch * $BATCH_SIZE));

    for ($i = 0; $i < $batchCount; $i++) {
        $globalIndex  = $existingCount + ($batch * $BATCH_SIZE) + $i + 1;
        $id           = 'seed-' . str_pad((string)$globalIndex, 6, '0', STR_PAD_LEFT);

        $govIndex     = array_rand($governorates);
        $gov          = $governorates[$govIndex];
        $type         = randFrom($schoolTypes);
        $cityIndex    = array_rand($cityAreas);

        $prefixEN     = randFrom($schoolNamePrefixesEN);
        $suffixEN     = randFrom($schoolNameSuffixesEN);
        $nameEN       = "{$gov['en']} {$prefixEN} {$suffixEN}";

        $prefixAR     = randFrom($schoolNamePrefixesAR);
        $suffixAR     = randFrom($schoolNameSuffixesAR);
        $nameAR       = "{$prefixAR} {$gov['ar']} {$suffixAR}";

        $principalEN  = randFrom($englishFirsts) . ' ' . randFrom($englishLasts);
        $principalAR  = randFrom($arabicFirstNames) . ' ' . randFrom($arabicLastNames);

        $rating       = number_format(random_int(38, 50) / 10, 1);
        $students     = '+' . randInt(200, 5000);
        $founded      = (string)randInt(1975, 2020);

        $stmt->execute([
            $id,
            $nameEN,
            $nameAR,
            $cityAreas[$cityIndex],
            $cityAreasAR[$cityIndex],
            $gov['en'],
            $gov['ar'],
            $principalEN,
            $principalAR,
            '',             // logo (empty for seed data)
            $type,
            '',             // mainImage
            generateGallery(),
        ]);

        $inserted++;
    }

    $pdo->commit();

    // Progress bar
    $progress    = min(100, (int)(($batch + 1) / $batches * 100));
    $elapsed     = round(microtime(true) - $startTime, 1);
    $rate        = $inserted > 0 ? round($inserted / max($elapsed, 0.1)) : 0;
    echo sprintf(
        "  Batch %d/%d │ %d records │ %d%% │ %.1fs │ %d rec/s\n",
        $batch + 1, $batches, $inserted, $progress, $elapsed, $rate
    );
}

// ── Done ───────────────────────────────────────────────────────────────────

$totalTime  = round(microtime(true) - $startTime, 2);
$totalCount = (int)$pdo->query("SELECT COUNT(*) FROM schools")->fetchColumn();

echo str_repeat('─', 60) . "\n";
echo "✅ Seed complete!\n";
echo "   → Inserted:    {$inserted} new records\n";
echo "   → Total in DB: {$totalCount} records\n";
echo "   → Time taken:  {$totalTime}s\n";
echo "   → Avg rate:    " . round($inserted / max($totalTime, 0.1)) . " records/sec\n\n";

// ── Pagination Performance Test ────────────────────────────────────────────

echo "🔬 Running pagination performance tests...\n";
echo str_repeat('─', 60) . "\n";

$pageSizes = [10, 25, 50, 100];
$pageSizeTime = [];

foreach ($pageSizes as $pageSize) {
    $timings = [];
    for ($page = 0; $page < 3; $page++) {
        $offset = $page * $pageSize;
        $start  = microtime(true);
        $rs     = $pdo->prepare("SELECT * FROM schools LIMIT ? OFFSET ?");
        $rs->bindValue(1, $pageSize, PDO::PARAM_INT);
        $rs->bindValue(2, $offset, PDO::PARAM_INT);
        $rs->execute();
        $rows = $rs->fetchAll();
        $timings[] = (microtime(true) - $start) * 1000;
    }
    $avgMs = round(array_sum($timings) / count($timings), 2);
    $pageSizeTime[$pageSize] = $avgMs;
    $status = $avgMs < 100 ? '✅' : ($avgMs < 300 ? '⚠️ ' : '❌');
    echo sprintf("  Page size %3d → avg %6.2f ms  %s\n", $pageSize, $avgMs, $status);
}

// ── Filter Performance ─────────────────────────────────────────────────────

echo "\n🔬 Filter query performance (governorate = 'Cairo'):\n";
$start = microtime(true);
$rs    = $pdo->prepare("SELECT * FROM schools WHERE governorate = ? LIMIT 100");
$rs->execute(['Cairo']);
$rows  = $rs->fetchAll();
$filterMs = round((microtime(true) - $start) * 1000, 2);
echo "  → {$filterMs}ms, returned " . count($rows) . " rows ";
echo ($filterMs < 200 ? "✅\n" : "⚠️  Consider adding INDEX on governorate\n");

// ── Index Recommendation ───────────────────────────────────────────────────

echo "\n📋 Recommended MySQL Indexes for performance:\n";
echo "   ALTER TABLE schools ADD INDEX idx_governorate (governorate);\n";
echo "   ALTER TABLE schools ADD INDEX idx_type (type);\n";
echo "   ALTER TABLE schools ADD FULLTEXT INDEX idx_search_name (name, nameAr);\n";
echo "\n   Run: EXPLAIN SELECT * FROM schools WHERE governorate='Cairo'; to verify.\n";

echo "\n🏁 Done. To remove seed data run:\n";
echo "   DELETE FROM schools WHERE id LIKE 'seed-%';\n";
echo "   OR: php tests/php/DatabaseSeeder.php --clean\n";
