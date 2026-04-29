# دليل تنفيذ نظام المصادقة (Authentication)

## ✅ تم التنفيذ بنجاح

تم تحويل نظام المصادقة من mock frontend-only لـ backend authentication حقيقي بـ JWT tokens.

---

## الخطوات المطلوبة للتشغيل

### 1. تحديث قاعدة البيانات

شغل الـ SQL ده في phpMyAdmin أو MySQL:

```sql
-- تأكد إن جدول users موجود
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(50) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  passwordHash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role ENUM('super_admin', 'school_admin') DEFAULT 'super_admin',
  schoolId VARCHAR(50) NULL,
  isActive TINYINT(1) DEFAULT 1,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  lastLogin DATETIME,
  INDEX idx_email (email),
  INDEX idx_role (role)
);
```

### 2. إنشاء Admin User

#### الطريقة 1: باستخدام PHP Script (الأسهل)

```bash
cd backend
php create_admin.php
```

ده هيولد output زي كده:
```
✅ Admin user created/updated successfully!
   Email: admin@nis.edu.eg
   Password: admin123
   Role: super_admin

⚠️  IMPORTANT: Change the password after first login!
   You can login at: /login
```

#### الطريقة 2: Manual SQL

لو الطريقة الأولى مشتغلتش، شغل الـ SQL ده:

```sql
-- Generate hash using PHP first
-- <?php echo password_hash('admin123', PASSWORD_BCRYPT, ['cost' => 12]); ?>
-- Copy the hash and paste it below

INSERT INTO users (id, email, passwordHash, name, role, isActive, createdAt) VALUES (
  'admin_001',
  'admin@nis.edu.eg',
  '$2y$12$... paste_hash_here ...',
  'System Administrator',
  'super_admin',
  1,
  NOW()
)
ON DUPLICATE KEY UPDATE
  passwordHash = VALUES(passwordHash),
  name = VALUES(name),
  role = VALUES(role);
```

### 3. اختبار الـ Login

1. افتح `/login` في المتصفح
2. دخل الـ credentials:
   - Email: `admin@nis.edu.eg`
   - Password: `admin123`
3. لو نجح → هيوديك للـ dashboard
4. لو فشل → هيظهر error message من الـ backend

### 4. تأمين الإنتاج (Production Security)

#### أ. غير الـ JWT Secret

أضف السطر ده في `.htaccess` أو `php.ini` أو كـ environment variable:

```bash
# In .htaccess (if using Apache)
SetEnv JWT_SECRET "your-random-secret-key-here-min-32-chars"

# Or in PHP code (temporary solution)
# Edit backend/api.php and change:
# return $_ENV['JWT_SECRET'] ?? $_SERVER['JWT_SECRET'] ?? 'nis-default-secret-change-in-production-2024';
# To use a hardcoded secret for now (not recommended for production)
```

#### ب. غير كلمة المرور الافتراضية

بعد ما تدخل أول مرة، غير كلمة المرور:

```php
// Run this in a secure PHP script
require_once 'backend/db_config.php';
$newPassword = 'your-new-secure-password';
$hash = password_hash($newPassword, PASSWORD_BCRYPT, ['cost' => 12]);
$stmt = $pdo->prepare("UPDATE users SET passwordHash = ? WHERE email = 'admin@nis.edu.eg'");
$stmt->execute([$hash]);
echo "Password updated!";
```

---

## الملفات اللي اتعدلت

| الملف | التغيير |
|-------|---------|
| `backend/schema.sql` | إضافة جدول `users` |
| `backend/api.php` | +JWT functions, login endpoint, requireAuth() protection |
| `src/services/authApi.ts` | جديد - API calls للـ auth |
| `src/context/AuthContext.tsx` | JWT-based auth مع auto token verification |
| `src/pages/Login.tsx` | Real API call بدل hardcoded check |
| `src/App.tsx` | Loading state في ProtectedRoute |
| `src/services/api.ts` | Authorization header على كل requests |

---

## الـ API Endpoints المحمية

كل الـ endpoints دي بقت محتاجة Authorization header:

- `POST ?action=save_school`
- `POST ?action=save_news`
- `POST ?action=save_job`
- `POST ?action=save_alumni`
- `POST ?action=save_governorate`
- `GET ?action=delete_school&id=x`
- `GET ?action=delete_news&id=x`
- `GET ?action=delete_job&id=x`
- `GET ?action=delete_alumni&id=x`
- `GET ?action=delete_governorate&id=x`
- `POST ?action=update_category`
- `POST ?action=update_complaint`
- `POST ?action=update_admission`
- `POST ?action=update_job_application`
- `POST ?action=delete_entry`

### الـ Public Endpoints (مش محتاجة auth)

- `POST ?action=login` - عشان تقدر تدخل 😊
- `POST ?action=verify_token` - للـ auto-login
- `GET ?action=get_site_data` - للـ public site
- `GET ?action=get_live_stats` - للـ public stats
- `POST ?action=add_admission` - للطلاب
- `POST ?action=add_complaint` - للشكاوى
- `POST ?action=add_contact_message` - للتواصل
- `POST ?action=add_job_application` - للوظايف

---

## كيف الـ JWT بيشتغل

```
1. Login
   Frontend: POST /api.php?action=login {email, password}
   Backend: Verify → Generate JWT → Return {token, user}

2. Store Token
   Frontend: localStorage.setItem('auth_token', token)

3. API Calls
   Frontend: Add header "Authorization: Bearer {token}"
   Backend: verifyJWT() → Proceed or 401

4. Auto-login
   Frontend: On app load, call verify_token endpoint
   If valid → stay logged in
   If invalid → redirect to login

5. Logout
   Frontend: localStorage.removeItem('auth_token')
```

---

## استكشاف الأخطاء

### مشكلة: Login بيرجع "Invalid credentials"
- اتأكد إن جدول `users` موجود
- شغل `php create_admin.php`
- اتأكد من الـ email/password

### مشكلة: "Authentication required" لما بدخل dashboard
- اتأكد إن `auth_token` موجود في localStorage
- افتح DevTools → Application → Local Storage
- لو مفيش token → login تاني

### مشكلة: API بيرجع 401 على protected endpoints
- الـ token خلص (expires بعد 24 ساعة)
- Logout و login تاني
- أو الـ token مش بيتبعت في headers (check Network tab)

### مشكلة: "Invalid or expired token"
- غير الـ JWT Secret (ممكن يكون مختلف)
- Logout و login تاني عشان token جديد

---

## الأمان (Security)

✅ كلمة المرور مشفرة بـ bcrypt (cost 12)
✅ JWT tokens بتنتهي بعد 24 ساعة
✅ كل الـ API calls المحمية بـ requireAuth()
✅ 401 errors بيرجع للـ login تلقائياً
✅ Protected endpoints مش بتشتغل من غير token

---

## Future: إضافة مستخدمين جدد

لما عايز تضيف admin جديد:

```php
require_once 'backend/db_config.php';

$newUser = [
    'id' => uniqid('user_'),
    'email' => 'newadmin@example.com',
    'password' => 'temppassword123',
    'name' => 'New Admin',
    'role' => 'super_admin' // or 'school_admin'
];

$hash = password_hash($newUser['password'], PASSWORD_BCRYPT, ['cost' => 12]);
$stmt = $pdo->prepare("INSERT INTO users (id, email, passwordHash, name, role) VALUES (?, ?, ?, ?, ?)");
$stmt->execute([$newUser['id'], $newUser['email'], $hash, $newUser['name'], $newUser['role']]);
```

---

تم التنفيذ بواسطة Cascade AI 🎉
