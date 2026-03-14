<?php
// upload_handler.php - Handles image uploads and returns file paths instead of base64

function saveBase64Image($base64Data, $prefix = 'img') {
    // Remove data:image/xxx;base64, prefix if exists
    if (preg_match('/^data:image\/(\w+);base64,/', $base64Data, $matches)) {
        $imageType = $matches[1];
        $base64Data = substr($base64Data, strpos($base64Data, ',') + 1);
    } else {
        $imageType = 'png';
    }
    
    // Decode base64
    $imageData = base64_decode($base64Data);
    if ($imageData === false) {
        throw new Exception('Invalid base64 image data');
    }
    
    // Generate unique filename
    $filename = $prefix . '_' . uniqid() . '_' . time() . '.' . $imageType;
    $uploadDir = __DIR__ . '/uploads/';
    $filePath = $uploadDir . $filename;
    
    // Ensure uploads directory exists
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    
    // Save file
    if (file_put_contents($filePath, $imageData) === false) {
        throw new Exception('Failed to save image file');
    }
    
    // Return relative URL path
    return '/uploads/' . $filename;
}

function deleteImageFile($imagePath) {
    if (empty($imagePath)) return true;
    
    // Only delete if it's in our uploads folder
    if (strpos($imagePath, '/uploads/') === 0) {
        $filePath = __DIR__ . '/uploads/' . basename($imagePath);
        if (file_exists($filePath)) {
            return unlink($filePath);
        }
    }
    return true;
}

function processImageField($value, $prefix = 'img') {
    if (empty($value)) return '';
    
    // If it's already a URL path, return as is
    if (strpos($value, '/uploads/') === 0 || strpos($value, 'http') === 0) {
        return $value;
    }
    
    // If it's base64, convert to file
    if (strpos($value, 'data:image') === 0 || strlen($value) > 500) {
        try {
            return saveBase64Image($value, $prefix);
        } catch (Exception $e) {
            error_log("Image conversion error: " . $e->getMessage());
            return '';
        }
    }
    
    return $value;
}
