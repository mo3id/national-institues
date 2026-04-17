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

            // Handle dynamic image serving without relying on folder write permissions
            if (count($pathParts) >= 2 && $pathParts[0] === 'dyn_images') {
                $filename = $pathParts[1];
                if (preg_match('/^([a-zA-Z0-9]+)_([a-zA-Z0-9]+)\./', $filename, $matches)) {
                    $reqType = $matches[1];
                    $reqId = $matches[2];
                    if (isset($data[$reqType])) {
                        foreach ($data[$reqType] as $item) {
                            if (strval($item['id']) === $reqId) {
                                // Determine the right image field based on entity type
                                $rawImg = '';
                                if ($reqType === 'schools') {
                                    $rawImg = !empty($item['mainImage']) ? $item['mainImage'] : (!empty($item['logo']) ? $item['logo'] : '');
                                } else {
                                    $rawImg = $item['image'] ?? '';
                                }

                                if (strpos($rawImg, 'data:image') === 0 && preg_match('/^data:image\/(\w+);base64,/', $rawImg, $imgMatches)) {
                                    $ext = $imgMatches[1] === 'jpeg' ? 'jpg' : $imgMatches[1];
                                    $base64Data = substr($rawImg, strpos($rawImg, ',') + 1);
                                    $decodedData = base64_decode($base64Data);
                                    if ($decodedData !== false) {
                                        header('Content-Type: image/' . $imgMatches[1]);
                                        header('Cache-Control: public, max-age=86400'); // Cache for 1 day
                                        echo $decodedData;
                                        exit;
                                    }
                                }
                            }
                        }
                    }
                }
                // If failed, return 404
                header("HTTP/1.0 404 Not Found");
                exit;
            }

            // Helper function to return the dynamic URL instead of writing the file
            $extractImage = function($rawImage, $entityType, $entityId) {
                if (empty($rawImage)) return null;
                if (strpos($rawImage, 'data:image') === 0) {
                    if (preg_match('/^data:image\/(\w+);base64,/', $rawImage, $matches)) {
                        $ext = $matches[1];
                        if ($ext === 'jpeg') $ext = 'jpg';
                        $cleanType = preg_replace('/[^a-zA-Z0-9_-]/', '', $entityType);
                        $cleanId = preg_replace('/[^a-zA-Z0-9_-]/', '', $entityId);
                        return "/dyn_images/{$cleanType}_{$cleanId}.{$ext}";
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
