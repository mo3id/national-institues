<?php
/**
 * Create Default Admin User
 * Run this script after deploying the authentication system
 * Usage: php create_admin.php
 */

require_once 'db_config.php';

// Admin credentials - CHANGE THESE AFTER FIRST LOGIN!
$adminId = 'admin_001';
$adminEmail = 'admin@nis.edu.eg';
$adminPassword = 'admin123'; // Change this after first login!
$adminName = 'System Administrator';
$adminRole = 'super_admin';

try {
    // Generate password hash
    $passwordHash = password_hash($adminPassword, PASSWORD_BCRYPT, ['cost' => 12]);
    
    // Check if users table exists
    $tables = $pdo->query("SHOW TABLES LIKE 'users'")->fetchAll();
    if (empty($tables)) {
        echo "ERROR: Users table does not exist. Please run schema.sql first.\n";
        exit(1);
    }
    
    // Insert or update admin user
    $stmt = $pdo->prepare("INSERT INTO users (id, email, passwordHash, name, role, isActive, createdAt) VALUES (?, ?, ?, ?, ?, 1, NOW()) ON DUPLICATE KEY UPDATE passwordHash = VALUES(passwordHash), name = VALUES(name), role = VALUES(role), isActive = VALUES(isActive)");
    $stmt->execute([$adminId, $adminEmail, $passwordHash, $adminName, $adminRole]);
    
    echo "✅ Admin user created/updated successfully!\n";
    echo "   Email: {$adminEmail}\n";
    echo "   Password: {$adminPassword}\n";
    echo "   Role: {$adminRole}\n";
    echo "\n";
    echo "⚠️  IMPORTANT: Change the password after first login!\n";
    echo "   You can login at: /login\n";
    
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    exit(1);
}
