-- Migration: Add default admin user
-- Run this after creating the users table

-- Create the default admin user
-- IMPORTANT: Change the password after first login!
-- Default password: admin123
-- Password hash generated with: password_hash('admin123', PASSWORD_BCRYPT, ['cost' => 12])

INSERT INTO users (id, email, passwordHash, name, role, isActive, createdAt) VALUES (
  'admin_001',
  'admin@nis.edu.eg',
  '$2y$12$8J0z7E8e8I8e8I8e8I8e8O8e8I8e8I8e8I8e8I8e8I8e8I8e8I8e8I', -- PLACEHOLDER - see below
  'System Administrator',
  'super_admin',
  1,
  NOW()
)
ON DUPLICATE KEY UPDATE
  passwordHash = VALUES(passwordHash),
  name = VALUES(name),
  role = VALUES(role),
  isActive = VALUES(isActive);

-- NOTE: The password hash above is a placeholder.
-- You need to generate a real hash using PHP:
-- <?php echo password_hash('admin123', PASSWORD_BCRYPT, ['cost' => 12]); ?>
-- 
-- Or run this PHP code to create the user with correct hash:
-- 
-- <?php
-- require_once 'db_config.php';
-- $hash = password_hash('admin123', PASSWORD_BCRYPT, ['cost' => 12]);
-- $stmt = $pdo->prepare("INSERT INTO users (id, email, passwordHash, name, role) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE passwordHash = VALUES(passwordHash)");
-- $stmt->execute(['admin_001', 'admin@nis.edu.eg', $hash, 'System Administrator', 'super_admin']);
-- echo "Admin user created/updated. Hash: " . $hash;
-- ?>
