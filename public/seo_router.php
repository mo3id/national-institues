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
$image = "/layer-1-small.webp"; // Default fallback image from the site

// Read site_data.json
try {
    $siteDataStr = @file_get_contents(__DIR__ . '/site_data.json');
    if ($siteDataStr) {
        $siteData = json_decode($siteDataStr, true);
        if ($siteData && isset($siteData['data'])) {
            $data = $siteData['data'];

            // Helper function to extract and save base64 images
            $extractImage = function($rawImage, $entityType, $entityId) {
                if (empty($rawImage)) return null;
                if (strpos($rawImage, 'data:image') === 0) {
                    $ogImageDir = __DIR__ . '/og_images';
                    if (!is_dir($ogImageDir)) {
                        @mkdir($ogImageDir, 0755, true);
                    }
                    if (preg_match('/^data:image\/(\w+);base64,/', $rawImage, $matches)) {
                        $ext = $matches[1];
                        if ($ext === 'jpeg') $ext = 'jpg';
                        $cleanType = preg_replace('/[^a-zA-Z0-9_-]/', '', $entityType);
                        $cleanId = preg_replace('/[^a-zA-Z0-9_-]/', '', $entityId);
                        $filename = "{$cleanType}_{$cleanId}.{$ext}";
                        $filepath = $ogImageDir . '/' . $filename;
                        if (!file_exists($filepath)) {
                            $base64Data = substr($rawImage, strpos($rawImage, ',') + 1);
                            $decodedData = base64_decode($base64Data);
                            if ($decodedData !== false) {
                                @file_put_contents($filepath, $decodedData);
                            }
                        }
                        return '/og_images/' . $filename;
                    }
                    return null;
                }
                return $rawImage;
            };

            if (count($pathParts) >= 2) {
                $type = $pathParts[0];
                $id = $pathParts[1];

                if ($type === 'news' && isset($data['news'])) {
                    foreach ($data['news'] as $item) {
                        if (strval($item['id']) === $id) {
                            $title = $item['titleAr'] ?: $item['title'];
                            $description = mb_substr(strip_tags($item['summaryAr'] ?: $item['summary']), 0, 160);
                            $extractedImg = $extractImage($item['image'] ?? '', 'news', $id);
                            $image = !empty($extractedImg) ? $extractedImg : $image;
                            break;
                        }
                    }
                } elseif ($type === 'schools' && isset($data['schools'])) {
                    foreach ($data['schools'] as $item) {
                        if (strval($item['id']) === $id) {
                            $title = $item['nameAr'] ?: $item['name'];
                            $description = mb_substr(strip_tags($item['aboutAr'] ?: $item['about']), 0, 160);
                            $rawImg = !empty($item['mainImage']) ? $item['mainImage'] : (!empty($item['logo']) ? $item['logo'] : '');
                            $extractedImg = $extractImage($rawImg, 'schools', $id);
                            $image = !empty($extractedImg) ? $extractedImg : $image;
                            break;
                        }
                    }
                } elseif ($type === 'alumni' && isset($data['alumni'])) {
                    foreach ($data['alumni'] as $item) {
                        if (strval($item['id']) === $id) {
                            $title = $item['nameAr'] ?: $item['name'];
                            $description = mb_substr(strip_tags($item['testimonialAr'] ?: $item['testimonial']), 0, 160);
                            $extractedImg = $extractImage($item['image'] ?? '', 'alumni', $id);
                            $image = !empty($extractedImg) ? $extractedImg : $image;
                            break;
                        }
                    }
                } elseif ($type === 'jobs' && isset($data['jobs'])) {
                    foreach ($data['jobs'] as $item) {
                        if (strval($item['id']) === $id) {
                            $title = $item['titleAr'] ?: $item['title'];
                            $description = mb_substr(strip_tags($item['descriptionAr'] ?: $item['description']), 0, 160);
                            $extractedImg = $extractImage($item['image'] ?? '', 'jobs', $id);
                            $image = !empty($extractedImg) ? $extractedImg : $image;
                            break;
                        }
                    }
                }
            }
        }
    }
} catch (Exception $e) {
    // Ignore JSON errors and serve default HTML
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
