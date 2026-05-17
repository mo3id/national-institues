<?php
// seo_router.php

// Read the base HTML file
$html = file_get_contents(__DIR__ . '/index.html');
$requestUri = $_SERVER['REQUEST_URI'];

// Remove query parameters to match paths correctly
$path = parse_url($requestUri, PHP_URL_PATH);
$pathParts = explode('/', trim($path, '/'));

$title = "National Institutes Schools Portal";
$description = "National Institutes Schools Portal (NIS) - The official digital portal for Egypt's largest educational network.";
$image = "/og-default.jpg"; // Default OG image (1200x630) for social sharing

// Database connection
try {
    $dbConfigBackend = __DIR__ . '/backend/db_config.php';
    $dbConfigRoot = __DIR__ . '/db_config.php';
    
    if (file_exists($dbConfigBackend)) {
        require_once $dbConfigBackend;
    } elseif (file_exists($dbConfigRoot)) {
        require_once $dbConfigRoot;
    }

    if (isset($pdo) && count($pathParts) >= 2) {
        $type = $pathParts[0];
        $id = $pathParts[1];

        if ($type === 'news') {
            $stmt = $pdo->prepare("SELECT titleAr, summaryAr, image FROM news WHERE id = ?");
            $stmt->execute([$id]);
            $item = $stmt->fetch();
            if ($item) {
                $title = $item['titleAr'];
                $description = mb_substr(strip_tags($item['summaryAr']), 0, 160);
                $image = $item['image'] ?: $image;
            }
        } elseif ($type === 'schools') {
            $stmt = $pdo->prepare("SELECT nameAr, aboutAr, logo, mainImage, mainimage FROM schools WHERE id = ?");
            $stmt->execute([$id]);
            $item = $stmt->fetch();
            if ($item) {
                $title = $item['nameAr'];
                $description = mb_substr(strip_tags($item['aboutAr']), 0, 160);
                // For schools, use logo first (brand identity), then mainImage/mainimage
                $image = !empty($item['logo']) ? $item['logo'] : (!empty($item['mainImage']) ? $item['mainImage'] : (!empty($item['mainimage']) ? $item['mainimage'] : $image));
            }
        } elseif ($type === 'alumni') {
             $stmt = $pdo->prepare("SELECT nameAr, testimonialAr, image FROM alumni WHERE id = ?");
             $stmt->execute([$id]);
             $item = $stmt->fetch();
             if ($item) {
                 $title = $item['nameAr'];
                 $description = mb_substr(strip_tags($item['testimonialAr']), 0, 160);
                 $image = $item['image'] ?: $image;
             }
        } elseif ($type === 'jobs') {
             $stmt = $pdo->prepare("SELECT titleAr, descriptionAr, image FROM jobs WHERE id = ?");
             $stmt->execute([$id]);
             $item = $stmt->fetch();
             if ($item) {
                 $title = $item['titleAr'];
                 $description = mb_substr(strip_tags($item['descriptionAr']), 0, 160);
                 $image = $item['image'] ?: $image;
             }
        }
    }
} catch (Exception $e) {
    // Ignore DB errors and serve default HTML
}

// Make the image URL absolute for social media crawlers
$protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http";
$host = $_SERVER['HTTP_HOST'];
$baseUrl = $protocol . "://" . $host;

if (!empty($image) && !preg_match('~^(?:f|ht)tps?://~i', $image)) {
    if (strpos($image, '/') !== 0) {
        $image = '/' . $image;
    }
    $image = $baseUrl . $image;
}

$pageUrl = $baseUrl . $requestUri;

// Replace existing title
$html = preg_replace('/<title>.*?<\/title>/s', '<title>' . htmlspecialchars($title) . ' | NIS</title>', $html);

// Replace existing meta description
$html = preg_replace('/<meta name="description"\s+content="[^"]*">/is', '<meta name="description" content="' . htmlspecialchars($description) . '">', $html);

// Prepare OG tags
$ogTags = "
    <meta property=\"og:title\" content=\"" . htmlspecialchars($title) . "\">
    <meta property=\"og:description\" content=\"" . htmlspecialchars($description) . "\">
    <meta property=\"og:image\" content=\"" . htmlspecialchars($image) . "\">
    <meta property=\"og:url\" content=\"" . htmlspecialchars($pageUrl) . "\">
    <meta property=\"og:type\" content=\"website\">
    <meta name=\"twitter:card\" content=\"summary_large_image\">
    <meta name=\"twitter:title\" content=\"" . htmlspecialchars($title) . "\">
    <meta name=\"twitter:description\" content=\"" . htmlspecialchars($description) . "\">
    <meta name=\"twitter:image\" content=\"" . htmlspecialchars($image) . "\">
</head>";

// Inject OG tags right before </head>
$html = str_replace('</head>', $ogTags, $html);

// Output the modified HTML
echo $html;
?>
