# دليل اختبار نظام التحاق وتعديل الرغبات

## 🧪 خطوات الاختبار الشامل

### المرحلة 1: اختبار الـ Database & Migration

#### 1.1 تشغيل Migration Script
```bash
cd /Users/mohamedeidali/Desktop/national-institues/backend
php migrate_json_to_tables.php
```

**النتيجة المتوقعة:**
- ✅ جميع البيانات القديمة محفوظة
- ✅ IDs القديمة لم تتغير
- ✅ أرقام جديدة لن تُنشأ (الـ old entries application_number = null)

#### 1.2 التحقق من الجداول
```sql
-- التحقق من وجود الجداول
SHOW TABLES LIKE 'admissions';
SHOW TABLES LIKE 'admission_preferences';
SHOW TABLES LIKE 'modification_requests';
SHOW TABLES LIKE 'complaints';
SHOW TABLES LIKE 'contact_messages';
SHOW TABLES LIKE 'job_applications';
SHOW TABLES LIKE 'job_departments';
```

---

### المرحلة 2: اختبار Backend APIs

#### 2.1 تقديم طلب التحاق جديد (Success Case)
```bash
curl -X POST "https://gani.edu.eg/api.php?action=add_admission" \
  -F "studentName=محمد أحمد" \
  -F "studentNationalId=30207250100587" \
  -F "gradeStage=الثانوي" \
  -F "parentPhone=01012345678" \
  -F "preferences=[{\"schoolId\":\"sch_001\",\"schoolNameAr\":\"مدرسة النيل\"}]"
```

**النتيجة المتوقعة:**
```json
{
  "status": "success",
  "data": {
    "applicationNumber": "APP-2026-001-0587"
  }
}
```

#### 2.2 محاولة تقديم طلب مكرر (Duplicate Check)
```bash
# نفس الرقم القومي
curl -X POST "https://gani.edu.eg/api.php?action=add_admission" \
  -F "studentNationalId=30207250100587" \
  ...
```

**النتيجة المتوقعة:**
```json
{
  "status": "error",
  "error_code": "ALREADY_APPLIED",
  "message": "لقد قدمت طلباً مسبقاً بهذا الرقم القومي"
}
```

#### 2.3 استعلام عن حالة الطلب
```bash
# بالرقم الجديد
curl "https://gani.edu.eg/api.php?action=get_admission_status&applicationNumber=APP-2026-001-0587"

# بالرقم القومي
curl "https://gani.edu.eg/api.php?action=get_admission_status&nationalId=30207250100587"
```

#### 2.4 طلب تعديل الرغبات
```bash
curl -X POST "https://gani.edu.eg/api.php?action=request_modification" \
  -H "Content-Type: application/json" \
  -d '{
    "admissionId": "ADM_xxxxx",
    "requestedPreferences": [{"schoolId": "sch_002"}],
    "reason": "تغير مكان السكن"
  }'
```

**النتيجة المتوقعة:**
```json
{
  "status": "success",
  "data": {
    "requestNumber": "MOD-2026-001-0587"
  }
}
```

#### 2.5 مراجعة طلب التعديل (Admin)
```bash
curl -X POST "https://gani.edu.eg/api.php?action=review_modification" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "requestId": "MODREQ_xxxxx",
    "action": "approve",
    "adminResponse": "تمت الموافقة"
  }'
```

---

### المرحلة 3: اختبار Frontend

#### 3.1 Student Workflow Test
1. افتح `/admissions` - قدم طلب جديد
2. حاول تقديم نفس الطلب مرة أخرى - يجب ظهور رسالة "قدمت طلباً مسبقاً"
3. اضغط على "طلب تعديل الرغبات"
4. اختر مدارس جديدة وقدم طلب التعديل
5. احفظ رقم طلب التعديل (MOD-YYYY-XXX-NNNN)
6. افتح `/modifications/track` - تابع الطلب

#### 3.2 Admin Workflow Test
1. سجل دخول للـ Dashboard
2. اذهب لقسم "طلبات تعديل الرغبات"
3. اضغط على طلب معلق
4. اختبر:
   - الموافقة على الطلب
   - الرفض مع سبب
   - التحقق من ظهور الرد للطالب

---

### المرحلة 4: اختبار السنة الديناميكية

#### 4.1 تغيير السنة (Testing Purpose)
```php
// في api.php، أضف مؤقتاً:
// $year = date('Y'); 
$year = '2027'; // للاختبار
```

#### 4.2 قدم طلب جديد
يجب أن يكون الرقم: `APP-2027-XXX-NNNN`

#### 4.3 عدل للسنة الحقيقية
```php
$year = date('Y'); // 2026
```

---

### المرحلة 5: Performance Testing

#### 5.1 Rate Limiting Test
```bash
# حاول تقديم طلبين خلال 60 ثانية من نفس رقم التليفون
for i in 1 2; do
  curl -X POST "https://gani.edu.eg/api.php?action=add_admission" \
    -F "parentPhone=01012345678" ...
done
```

**النتيجة المتوقعة:** الثاني يفشل مع HTTP 429

#### 5.2 Large Dataset Test
```sql
-- اختبار استعلام مع بيانات كثيرة
SELECT * FROM admissions WHERE student_national_id = '...';
-- يجب أن يكون الاستعلام سريع (< 100ms)
```

---

### 📋 Checklist قبل الـ Production Deploy

- [ ] Migration script نجح بدون أخطاء
- [ ] جميع الـ APIs تعمل (اختبر كل واحد)
- [ ] Frontend pages load بدون errors
- [ ] Admin Dashboard يعرض طلبات التعديل
- [ ] Security: JWT tokens تعمل
- [ ] Rate limiting يمنع الـ spam
- [ ] File uploads تعمل للمستندات
- [ ] Email notifications (لو موجودة)
- [ ] Backup من الـ database قبل التغييرات

---

### 🔧 Troubleshooting

#### مشكلة: "Table doesn't exist"
**الحل:** شغل `schema.sql` أولاً ثم `migrate_json_to_tables.php`

#### مشكلة: "Authorization header missing"
**الحل:** تحقق من `.htaccess` rules

#### مشكلة: رقم الطلب متكرر
**الحل:** التحقق من الـ counter في دالة `generateAdmissionNumber`

---

### 📞 للمساعدة

لو واجهت أي مشكلة، افحص:
1. `error_log` على الـ server
2. Browser DevTools → Network tab
3. Database logs

**تاريخ التحديث:** 2026-04-29
