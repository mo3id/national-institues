<?php
/**
 * migrate_images.php — One-time migration script
 * Converts all base64-encoded images in the database to physical files on disk.
 * 
 * USAGE: Access via browser: https://gani.edu.eg/migrate_images.php
 * Or run via CLI: php migrate_images.php
 * 
 * After running successfully, DELETE this file from the server for security.
 */

// Increase limits for migration
ini_set('memory_limit', '512M');
ini_set('max_execution_time', 300);
set_time_limit(300);

header('Content-Type: text/plain; charset=utf-8');

echo "=== Image Migration Script ===\n";
echo "Started: " . date('Y-m-d H:i:s') . "\n\n";

require_once __DIR__ . '/upload_handler.php';
require_once __DIR__ . '/db_config.php';

$stats = [
    'schools_logo' => 0,
    'schools_mainImage' => 0,
    'schools_gallery' => 0,
    'news_image' => 0,
    'jobs_image' => 0,
    'settings_images' => 0,
    'errors' => 0,
    'skipped' => 0,
];

// ─── Helper: Check if a value is base64 image data ───────────────────────
function isBase64Image($value) {
    if (empty($value) || !is_string($value)) return false;
    if (strpos($value, '/uploads/') === 0 || strpos($value, 'http') === 0) return false;
    if (strpos($value, 'data:image') === 0) return true;
    // Long strings that aren't URLs are likely base64
    if (strlen($value) > 1000 && strpos($value, '/') === false && strpos($value, '.') === false) return true;
    return false;
}

// ─── Helper: Recursively find and convert base64 images in arrays ────────
function processArrayImages(&$data, $prefix, &$count) {
    if (!is_array($data)) return;
    foreach ($data as $key => &$value) {
        if (is_string($value) && isBase64Image($value)) {
            $newPath = processImageField($value, $prefix . '_' . $key);
            if ($newPath && $newPath !== $value) {
                $value = $newPath;
                $count++;
                echo "  Converted: {$prefix}_{$key} -> {$newPath}\n";
            }
        } elseif (is_array($value)) {
            processArrayImages($value, $prefix . '_' . $key, $count);
        }
    }
}

// ═════════════════════════════════════════════════════════════════════════
// 1. MIGRATE SCHOOLS TABLE
// ═════════════════════════════════════════════════════════════════════════
echo "--- Migrating Schools ---\n";

$stmt = $pdo->query("SELECT id, name, logo, mainImage, gallery FROM schools");
$schools = $stmt->fetchAll();
echo "Found " . count($schools) . " schools\n";

foreach ($schools as $school) {
    $id = $school['id'];
    $name = $school['name'];
    $updates = [];
    $params = [];

    // Process logo
    if (isBase64Image($school['logo'])) {
        $newLogo = processImageField($school['logo'], 'school_logo_' . $id);
        if ($newLogo && $newLogo !== $school['logo']) {
            $updates[] = "logo = ?";
            $params[] = $newLogo;
            $stats['schools_logo']++;
            echo "  [{$name}] Logo converted -> {$newLogo}\n";
        }
    } else {
        $stats['skipped']++;
    }

    // Process mainImage
    if (isBase64Image($school['mainImage'])) {
        $newMain = processImageField($school['mainImage'], 'school_main_' . $id);
        if ($newMain && $newMain !== $school['mainImage']) {
            $updates[] = "mainImage = ?";
            $params[] = $newMain;
            $stats['schools_mainImage']++;
            echo "  [{$name}] MainImage converted -> {$newMain}\n";
        }
    } else {
        $stats['skipped']++;
    }

    // Process gallery
    $gallery = json_decode($school['gallery'], true);
    if (is_array($gallery) && !empty($gallery)) {
        $galleryChanged = false;
        foreach ($gallery as &$img) {
            if (is_string($img) && isBase64Image($img)) {
                $newImg = processImageField($img, 'school_gallery_' . $id);
                if ($newImg && $newImg !== $img) {
                    $img = $newImg;
                    $galleryChanged = true;
                    $stats['schools_gallery']++;
                    echo "  [{$name}] Gallery image converted -> {$newImg}\n";
                }
            }
        }
        if ($galleryChanged) {
            $updates[] = "gallery = ?";
            $params[] = json_encode($gallery);
        }
    }

    // Apply updates
    if (!empty($updates)) {
        $params[] = $id;
        $sql = "UPDATE schools SET " . implode(', ', $updates) . " WHERE id = ?";
        try {
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            echo "  [{$name}] DB updated successfully\n";
        } catch (Exception $e) {
            $stats['errors']++;
            echo "  [{$name}] ERROR: " . $e->getMessage() . "\n";
        }
    }
}

// ═════════════════════════════════════════════════════════════════════════
// 2. MIGRATE NEWS TABLE
// ═════════════════════════════════════════════════════════════════════════
echo "\n--- Migrating News ---\n";

$stmt = $pdo->query("SELECT id, title, image FROM news");
$newsItems = $stmt->fetchAll();
echo "Found " . count($newsItems) . " news items\n";

foreach ($newsItems as $news) {
    if (isBase64Image($news['image'])) {
        $newImage = processImageField($news['image'], 'news_' . $news['id']);
        if ($newImage && $newImage !== $news['image']) {
            try {
                $stmt = $pdo->prepare("UPDATE news SET image = ? WHERE id = ?");
                $stmt->execute([$newImage, $news['id']]);
                $stats['news_image']++;
                echo "  [{$news['title']}] Image converted -> {$newImage}\n";
            } catch (Exception $e) {
                $stats['errors']++;
                echo "  [{$news['title']}] ERROR: " . $e->getMessage() . "\n";
            }
        }
    } else {
        $stats['skipped']++;
    }
}

// ═════════════════════════════════════════════════════════════════════════
// 3. MIGRATE JOBS TABLE
// ═════════════════════════════════════════════════════════════════════════
echo "\n--- Migrating Jobs ---\n";

try {
    $stmt = $pdo->query("SELECT id, title, image FROM jobs");
    $jobItems = $stmt->fetchAll();
    echo "Found " . count($jobItems) . " jobs\n";

    foreach ($jobItems as $job) {
        if (isBase64Image($job['image'] ?? '')) {
            $newImage = processImageField($job['image'], 'job_' . $job['id']);
            if ($newImage && $newImage !== $job['image']) {
                try {
                    $stmt = $pdo->prepare("UPDATE jobs SET image = ? WHERE id = ?");
                    $stmt->execute([$newImage, $job['id']]);
                    $stats['jobs_image']++;
                    echo "  [{$job['title']}] Image converted -> {$newImage}\n";
                } catch (Exception $e) {
                    $stats['errors']++;
                    echo "  [{$job['title']}] ERROR: " . $e->getMessage() . "\n";
                }
            }
        }
    }
} catch (Exception $e) {
    echo "  Jobs table might not have image column: " . $e->getMessage() . "\n";
}

// ═════════════════════════════════════════════════════════════════════════
// 4. MIGRATE SETTINGS (heroSlides, aboutData, partners, galleryImages)
// ═════════════════════════════════════════════════════════════════════════
echo "\n--- Migrating Settings ---\n";

$settingsToCheck = ['heroSlides', 'aboutData', 'partners', 'galleryImages', 'homeData', 'contactData', 'pagesHeroSettings'];

foreach ($settingsToCheck as $settingKey) {
    $stmt = $pdo->prepare("SELECT setting_value FROM settings WHERE setting_key = ?");
    $stmt->execute([$settingKey]);
    $row = $stmt->fetch();
    
    if (!$row) {
        echo "  [{$settingKey}] Not found, skipping\n";
        continue;
    }
    
    $data = json_decode($row['setting_value'], true);
    if (!is_array($data)) {
        echo "  [{$settingKey}] Not an array, skipping\n";
        continue;
    }
    
    $countBefore = $stats['settings_images'];
    processArrayImages($data, $settingKey, $stats['settings_images']);
    
    if ($stats['settings_images'] > $countBefore) {
        try {
            $stmt = $pdo->prepare("REPLACE INTO settings (setting_key, setting_value) VALUES (?, ?)");
            $stmt->execute([$settingKey, json_encode($data, JSON_UNESCAPED_UNICODE)]);
            echo "  [{$settingKey}] DB updated successfully\n";
        } catch (Exception $e) {
            $stats['errors']++;
            echo "  [{$settingKey}] ERROR: " . $e->getMessage() . "\n";
        }
    } else {
        echo "  [{$settingKey}] No base64 images found\n";
    }
}

// ═════════════════════════════════════════════════════════════════════════
// 5. BUST CACHE
// ═════════════════════════════════════════════════════════════════════════
echo "\n--- Busting Cache ---\n";
$cacheFile = __DIR__ . '/cache/site_data.json';
if (file_exists($cacheFile)) {
    unlink($cacheFile);
    echo "Cache file deleted\n";
} else {
    echo "No cache file found\n";
}

// ═════════════════════════════════════════════════════════════════════════
// SUMMARY
// ═════════════════════════════════════════════════════════════════════════
echo "\n=== Migration Complete ===\n";
echo "Finished: " . date('Y-m-d H:i:s') . "\n";
echo "Results:\n";
echo "  School logos converted:      {$stats['schools_logo']}\n";
echo "  School main images converted: {$stats['schools_mainImage']}\n";
echo "  School gallery images converted: {$stats['schools_gallery']}\n";
echo "  News images converted:       {$stats['news_image']}\n";
echo "  Jobs images converted:       {$stats['jobs_image']}\n";
echo "  Settings images converted:   {$stats['settings_images']}\n";
echo "  Skipped (already file paths): {$stats['skipped']}\n";
echo "  Errors:                      {$stats['errors']}\n";
$total = $stats['schools_logo'] + $stats['schools_mainImage'] + $stats['schools_gallery'] + $stats['news_image'] + $stats['jobs_image'] + $stats['settings_images'];
echo "  TOTAL CONVERTED:             {$total}\n";

if ($stats['errors'] > 0) {
    echo "\n⚠ There were errors during migration. Check the output above for details.\n";
} else {
    echo "\n✅ Migration completed successfully!\n";
}

echo "\n🔒 SECURITY: Delete this file from the server after migration!\n";
echo "   rm migrate_images.php\n";
