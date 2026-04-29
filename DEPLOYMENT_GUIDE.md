# دليل نشر نظام التحاق وتعديل الرغبات

## 🚀 خطوات النشر على cPanel

### المتطلبات الأساسية
- PHP 8.0+
- MySQL 5.7+ أو MariaDB 10.3+
- Apache with mod_rewrite enabled
- cPanel File Manager أو FTP access

---

### المرحلة 1: Backup (مهم جداً!)

#### 1.1 Backup الـ Database
```bash
# SSH إلى الـ server
mysqldump -u username -p database_name > backup_$(date +%Y%m%d).sql

# أو من cPanel → phpMyAdmin → Export
```

#### 1.2 Backup الملفات
```bash
cd /home/username/public_html
tar -czvf backup_$(date +%Y%m%d).tar.gz .
```

---

### المرحلة 2: تحديث Database

#### 2.1 تشغيل Schema الجديد
```bash
# SSH إلى الـ server
mysql -u username -p database_name < schema.sql
```

#### 2.2 تشغيل Migration
```bash
cd /home/username/public_html/backend
php migrate_json_to_tables.php
```

**⚠️ انتبه:** هذا السكربت يهاجر البيانات من JSON إلى الجداول الجديدة.

---

### المرحلة 3: رفع الملفات الجديدة

#### 3.1 Build الـ Frontend
```bash
cd /Users/mohamedeidali/Desktop/national-institues
npm run build
```

#### 3.2 رفع الملفات للـ cPanel
```bash
# استخدم FTP أو cPanel File Manager
# ارفع:
# - dist/ (build output)
# - backend/api.php (مُحدث)
# - backend/schema.sql
# - backend/migrate_json_to_tables.php
# - backend/migrate_json_to_tables.php
# - .htaccess (مُحدث)
```

#### 3.3 مسح الـ Cache
```bash
# في cPanel File Manager
# احذف أي ملفات cache قديمة
```

---

### المرحلة 4: إعدادات الأمان

#### 4.1 التحقق من .htaccess
```apache
# يجب أن يحتوي على:
RewriteEngine On
RewriteCond %{HTTP:Authorization} ^(.*)
RewriteRule .* - [e=HTTP_AUTHORIZATION:%1]
```

#### 4.2 إعدادات الـ Database
تحقق من `backend/db_config.php`:
```php
$host = 'localhost';
$dbname = 'your_database';
$username = 'your_username';
$password = 'your_strong_password';
```

#### 4.3 JWT Secret
في `backend/api.php`، غير الـ secret:
```php
$secret = 'your-new-random-secret-key-here-min-32-chars';
```

---

### المرحلة 5: اختبار ما بعد النشر

#### 5.1 Test API Connectivity
```bash
curl https://gani.edu.eg/api.php?action=get_schools
```

#### 5.2 Test Authentication
```bash
curl -X POST https://gani.edu.eg/api.php?action=login \
  -d '{"email":"admin@nis.edu.eg","password":"admin123"}'
```

#### 5.3 Test Admission Submission
```bash
curl -X POST https://gani.edu.eg/api.php?action=add_admission \
  -F "studentName=Test Student" \
  -F "studentNationalId=30207250100587" \
  -F "gradeStage=الثانوي" \
  -F "parentPhone=01012345678"
```

#### 5.4 Check Frontend
افتح في المتصفح:
- https://gani.edu.eg/admissions
- https://gani.edu.eg/admissions/track
- https://gani.edu.eg/dashboard

---

### المرحلة 6: Monitoring & Maintenance

#### 6.1 إعداد Log Files
```bash
# في cPanel → File Manager
touch /home/username/public_html/backend/error.log
chmod 644 /home/username/public_html/backend/error.log
```

#### 6.2 Monthly Tasks
- مراجعة طلبات التعديل المعلقة
- Backup الـ database
- فحص الـ error logs

---

### 📋 Post-Deployment Checklist

- [ ] جميع الـ APIs تعمل
- [ ] Frontend يعرض بدون errors
- [ ] Admin login يعمل
- [ ] Database migration نجح
- [ ] New admission يولد رقم صحيح (APP-2026-XXX-NNNN)
- [ ] Modification request يعمل
- [ ] Admin approval workflow يعمل
- [ ] Email notifications (لو متوفرة)
- [ ] SSL certificate صالح
- [ ] .htaccess rules تعمل

---

### 🐛 Troubleshooting Common Issues

#### "404 Not Found" على API endpoints
**الحل:**
```apache
# تأكد من .htaccess
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
</IfModule>
```

#### "401 Unauthorized" بعد login
**الحل:**
```apache
# أضف لـ .htaccess
RewriteCond %{HTTP:Authorization} ^(.*)
RewriteRule .* - [e=HTTP_AUTHORIZATION:%1]
```

#### Database Connection Error
**الحل:**
- تحقق من credentials في `db_config.php`
- تحقق أن الـ database موجودة
- تحقق من صلاحيات الـ user

#### CORS Errors
**الحل:**
```php
// في api.php، أضف:
header("Access-Control-Allow-Origin: https://gani.edu.eg");
header("Access-Control-Allow-Headers: Authorization, Content-Type");
```

---

### 📞 Contact

لو واجهت مشاكل في النشر:
1. افحص error logs
2. جرب تdebug بـ `error_log()` في PHP
3. استخدم Browser DevTools Network tab

**تاريخ التحديث:** 2026-04-29
