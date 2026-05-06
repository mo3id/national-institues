# خطة التنفيذ - المرحلة الثانية (7 إصلاحات)

> هذه الخطة مصممة لتنفيذها بواسطة Kimi K2.6

---

## ملخص الأخطاء المطلوب إصلاحها

1. **خطأ 500** عند اختيار نفس الحالة لطلب التوظيف
2. **ألوان الحالات** في جدول طلبات التوظيف كلها متشابهة
3. **صفحة تتبع التعديل** لا تدعم البحث برقم طلب القبول (APP-...)
4. **بحث الشكاوي** برقم COMP لا يعمل (تحقق فقط)
5. **فلتر طلبات التعديل** القيمة الافتراضية "قيد الانتظار" بدلاً من "الكل"
6. **اللوجو** لا يظهر عند مشاركة رابط الصفحة الرئيسية
7. **نوعية التعليم** إضافة "تربية خاصة / Special Education"

---

## المهمة 1: إصلاح خطأ 500 عند اختيار نفس الحالة

### السبب
`api.php` سطر 2238: `$stmt->rowCount() > 0` يرجع 0 عندما الحالة لم تتغير → يرمي Exception → HTTP 500

### الملف
`cpanel_deploy/api.php` سطر 2228-2244

### الكود الحالي
```php
case 'update_job_application':
    requireAuth();
    $input = json_decode(file_get_contents('php://input'), true);
    $id = $input['id'] ?? '';
    $status = $input['status'] ?? '';
    if (!$id) throw new Exception("ID required");

    $stmt = $pdo->prepare("UPDATE job_applications SET status = ? WHERE id = ?");
    $result = $stmt->execute([$status, $id]);

    if ($result && $stmt->rowCount() > 0) {
        bustCache();
        echo json_encode(["status" => "success", "message" => "Updated successfully."]);
    } else {
        throw new Exception("Application not found");
    }
    break;
```

### الكود الجديد (استبدل بالكامل)
```php
case 'update_job_application':
    requireAuth();
    $input = json_decode(file_get_contents('php://input'), true);
    $id = $input['id'] ?? '';
    $status = $input['status'] ?? '';
    if (!$id) throw new Exception("ID required");

    $stmt = $pdo->prepare("UPDATE job_applications SET status = ? WHERE id = ?");
    $result = $stmt->execute([$status, $id]);

    if (!$result) {
        throw new Exception("Failed to update application");
    }

    bustCache();
    echo json_encode(["status" => "success", "message" => "Updated successfully."]);
    break;
```

### التغييرات
- حذف شرط `$stmt->rowCount() > 0` لأنه يرجع 0 إذا الحالة لم تتغير
- `bustCache()` دوماً بعد التنفيذ الناجح
- رسالة نجاح دوماً ما دام الـ UPDATE نفذ

---

## المهمة 2: ألوان مميزة لحالات طلبات التوظيف

### الملف
`src/pages/Dashboard.tsx` سطر 1836-1841

### الكود الحالي
```tsx
<span style={{
  padding: '4px 10px', borderRadius: 999, fontSize: 10, fontWeight: 800, textTransform: 'uppercase',
  background: app.status === 'Hired' ? 'rgba(16,185,129,0.12)' : app.status === 'Rejected' ? 'rgba(239,68,68,0.1)' : 'rgba(99,102,241,0.1)',
  color: app.status === 'Hired' ? '#10b981' : app.status === 'Rejected' ? '#ef4444' : 'var(--accent)',
}}>{app.status}</span>
```

### الكود الجديد (استبدل سطر 1836-1841 بالكامل)
أولاً أضف قبل الـ return مباشرة (في نفس المكون حوالي سطر 1830):

```tsx
const jobStatusColors: Record<string, { bg: string; color: string }> = {
  'Pending':   { bg: 'rgba(245,158,11,0.12)',  color: '#f59e0b' },
  'Interview': { bg: 'rgba(99,102,241,0.12)',  color: 'var(--accent)' },
  'Hired':     { bg: 'rgba(16,185,129,0.12)',  color: '#10b981' },
  'Rejected':  { bg: 'rgba(239,68,68,0.12)',   color: '#ef4444' },
  'On Hold':   { bg: 'rgba(107,114,128,0.12)', color: '#6b7280' },
};
```

ثم استبدل span الحالي بـ:
```tsx
<span style={{
  padding: '4px 10px', borderRadius: 999, fontSize: 10, fontWeight: 800, textTransform: 'uppercase',
  background: (jobStatusColors[app.status] || jobStatusColors['Pending']).bg,
  color: (jobStatusColors[app.status] || jobStatusColors['Pending']).color,
}}>{app.status}</span>
```

### ملاحظة مهمة
حالات طلبات التوظيف في الـ DB قد تكون lowercase (`pending`) بينما الـ dropdown يستخدم Capitalized (`Pending`). تحتاج تعديل `get_entries` لـ `jobApplications` في api.php ليتضمن normalization مثل admissions:

في `cpanel_deploy/api.php`، ابحث عن `jobApplications` في `get_entries` (حوالي سطر 1210-1229) وأضف:
```php
// After fetching job applications, normalize status
$statusMap = [
    'pending' => 'Pending',
    'interview' => 'Interview',
    'hired' => 'Hired',
    'rejected' => 'Rejected',
    'on_hold' => 'On Hold',
    'on hold' => 'On Hold',
];
foreach ($data as &$app) {
    $raw = strtolower($app['status'] ?? '');
    $app['status'] = $statusMap[$raw] ?? ($app['status'] ?? 'Pending');
}
```

وكذلك في `update_job_application` أضف reverse mapping قبل الـ UPDATE:
```php
// Add BEFORE the UPDATE query:
$validStatuses = ['Pending', 'Interview', 'Hired', 'Rejected', 'On Hold'];
$statusMap = ['pending' => 'Pending', 'interview' => 'Interview', 'hired' => 'Hired', 'rejected' => 'Rejected', 'on_hold' => 'On Hold', 'on hold' => 'On Hold'];
$normalized = $statusMap[strtolower($status)] ?? $status;
if (!in_array($normalized, $validStatuses)) throw new Exception("Invalid status: $status");
$status = $normalized;
```

---

## المهمة 3: البحث التلقائي برقم طلب القبول في صفحة تتبع التعديل

### الملفات للتغيير
1. `src/pages/ModificationInquiry.tsx`
2. `src/services/admissionsApi.ts` (دالة `getModificationStatus`)
3. `cpanel_deploy/api.php` (case `get_modification_status`)

### 3.1 تعديل api.php (سطر 2612-2672)

استبدل الكود الحالي لـ `get_modification_status` بـ:

```php
case 'get_modification_status':
    // Track modification request status — supports request_number OR application_number
    $requestNumber = sanitizeInput($_GET['requestNumber'] ?? '');
    $applicationNumber = sanitizeInput($_GET['applicationNumber'] ?? '');
    $nationalIdSuffix = sanitizeInput($_GET['nationalIdSuffix'] ?? '');
    
    if (empty($requestNumber) && empty($applicationNumber)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Request number or application number is required"]);
        break;
    }
    
    $sql = "
        SELECT mr.*, a.student_name, a.student_national_id, a.application_number
        FROM modification_requests mr
        JOIN admissions a ON mr.admission_id = a.id
    ";
    $params = [];
    
    if (!empty($requestNumber)) {
        $sql .= " WHERE mr.request_number = ?";
        $params[] = $requestNumber;
    } else {
        $sql .= " WHERE a.application_number = ? OR a.id = ?";
        $params[] = $applicationNumber;
        $params[] = $applicationNumber;
    }
    
    if (!empty($nationalIdSuffix)) {
        $sql .= " AND mr.national_id_suffix = ?";
        $params[] = $nationalIdSuffix;
    }
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $request = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$request) {
        http_response_code(404);
        echo json_encode(["status" => "error", "message" => "Request not found"]);
        break;
    }
    
    // Mask student name
    $studentName = $request['student_name'] ?? '';
    $maskedName = mb_strlen($studentName) > 3
        ? mb_substr($studentName, 0, 3) . '***'
        : $studentName . '***';
    
    echo json_encode([
        "status" => "success",
        "data" => [
            "requestNumber" => $request['request_number'],
            "studentName" => $maskedName,
            "status" => $request['status'],
            "statusLabel" => getModificationStatusLabel($request['status']),
            "reason" => $request['request_reason'],
            "adminResponse" => $request['admin_response'],
            "requestedAt" => $request['created_at'],
            "reviewedAt" => $request['reviewed_at'],
            "completedAt" => $request['completed_at'],
            "requestedPreferences" => json_decode($request['requested_preferences'], true),
            "applicationNumber" => $request['application_number'] ?? '',
            "actions" => [
                "canResubmit" => $request['status'] === 'rejected',
                "canEdit" => $request['status'] === 'approved'
            ]
        ]
    ]);
    break;
```

### 3.2 تعديل admissionsApi.ts (سطر 192-206)

استبدل دالة `getModificationStatus` بـ:

```typescript
export const getModificationStatus = async (
  requestNumber?: string,
  nationalIdSuffix?: string,
  applicationNumber?: string
): Promise<{
  status: string;
  data?: ModificationStatus;
  message?: string;
}> => {
  const params = new URLSearchParams();
  if (requestNumber) params.append('requestNumber', requestNumber);
  if (nationalIdSuffix) params.append('nationalIdSuffix', nationalIdSuffix);
  if (applicationNumber) params.append('applicationNumber', applicationNumber);
  
  const response = await apiClient.get(`?action=get_modification_status&${params.toString()}`);
  return response.data;
};
```

### 3.3 تعديل ModificationInquiry.tsx (كامل تقريباً)

**التغيير الرئيسي:** البحث التلقائي — المستخدم يدخل رقم واحد (سواء MOD أو APP) والسيرفر يجرّب الاتنين.

استبدل قسم `handleInquiry` والإدخال:

```tsx
const handleInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = requestNumber.trim().toUpperCase();
    if (!num) return;
    
    setIsLoading(true);
    setError(null);
    setRequest(null);
    
    try {
      // Auto-detect: if starts with MOD, search by requestNumber; if starts with APP, search by applicationNumber
      let result;
      if (num.startsWith('MOD-')) {
        result = await getModificationStatus(num, nationalIdSuffix.trim() || undefined);
      } else if (num.startsWith('APP-')) {
        result = await getModificationStatus(undefined, nationalIdSuffix.trim() || undefined, num);
      } else {
        // Try both — request number first, then application number
        result = await getModificationStatus(num, nationalIdSuffix.trim() || undefined);
        if (result.status !== 'success' || !result.data) {
          result = await getModificationStatus(undefined, nationalIdSuffix.trim() || undefined, num);
        }
      }
      
      if (result.status === 'success' && result.data) {
        setRequest(result.data);
      } else {
        setError(lang === 'ar' ? 'لم يتم العثور على طلب بهذا الرقم.' : 'No request found with this number.');
      }
    } catch (err: any) {
      setError(err.message || (lang === 'ar' ? 'حدث خطأ، يرجى المحاولة مرة أخرى.' : 'An error occurred, please try again.'));
    } finally {
      setIsLoading(false);
    }
  };
```

وغيّر placeholder حقل الإدخال ليدعم النوعين:

```tsx
<input
  type="text"
  value={requestNumber}
  onChange={e => { setRequestNumber(e.target.value.toUpperCase()); setError(null); }}
  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all text-lg font-mono tracking-widest text-center"
  placeholder="MOD-2026-XXX-NNNN أو APP-2026-XXX-NNNN"
  dir="ltr"
  autoComplete="off"
  spellCheck={false}
/>
```

وغيّر label الحقل:
```tsx
<label className={`block font-bold text-slate-700 mb-2 ${isRTL ? 'text-sm' : 'text-xs uppercase tracking-widest'}`}>
  {lang === 'ar' ? 'رقم طلب التعديل أو رقم طلب القبول' : 'Modification Request Number or Application Number'}
</label>
```

وغيّر العنوان الفرعي:
```tsx
<p className="text-blue-100/70 text-lg font-medium">
  {lang === 'ar' ? 'أدخل رقم طلب التعديل أو رقم طلب القبول' : 'Enter the modification request number or application number'}
</p>
```

---

## المهمة 4: التحقق من بحث الشكاوي

### الحالة
الكود الموجود في `cpanel_deploy/api.php` سطر 999 صحيح:
```php
$stmt = $pdo->prepare("SELECT id, complaint_number, status, admin_response, created_at, full_name FROM complaints WHERE complaint_number = ? OR id = ?");
```

وهذا يدعم البحث بـ `complaint_number` (COMP-2026-014) أو بـ `id`.

### المشكلة المحتملة
إذا كانت الشكوى غير موجودة في الداتابيز (أو الـ `complaint_number` مختلف عن اللي المستخدم بيكتبه)، مش هيظهر نتائج. حاول:
1. تأكد إن `complaint_number` محفوظ capitalize بشكل موحد (مثلاً `COMP-2026-014` وليس `comp-2026-014`)
2. أضف `UPPER()` في البحث:

في `cpanel_deploy/api.php` سطر 999، غيّر:
```php
$stmt = $pdo->prepare("SELECT id, complaint_number, status, admin_response, created_at, full_name FROM complaints WHERE complaint_number = ? OR id = ?");
```
إلى:
```php
$stmt = $pdo->prepare("SELECT id, complaint_number, status, admin_response, created_at, full_name FROM complaints WHERE UPPER(complaint_number) = UPPER(?) OR id = ?");
```

وكذلك في `get_entries` للشكاوي أضف نفس الـ case-insensitive search.

**ملاحظة:** تأكد أيضاً أن الـ Frontend يرسل `complaintId` parameter بشكل صحيح في `ComplaintInquiry.tsx`.

---

## المهمة 5: فلتر طلبات التعديل الافتراضي

### الملف
`src/pages/Dashboard.tsx` سطر 2949

### الكود الحالي
```tsx
const [filterStatus, setFilterStatus] = useState('pending');
```

### الكود الجديد
```tsx
const [filterStatus, setFilterStatus] = useState('all');
```

---

## المهمة 6: اللوجو في مشاركة الصفحة الرئيسية

### المشكلة
الصفحة الرئيسية هي React SPA بـ `index.html` ثابت. الـ `seo_router.php` يعالج فقط صفحات المدارس. لكن Facebook/Twitter crawlers لا تنفذ JavaScript، فالـ OG tags اللي React بتحطها مش هتشتفع.

### الحل
أضف OG meta tags ثابتة في `cpanel_deploy/index.html` (أو `index.html` في root اللي بيتبنى).

في ملف `index.html` (أو الملف الأساسي في الموقع)، أضف في الـ `<head>`:

```html
<meta property="og:title" content="المعاهد القومية | National Institutes" />
<meta property="og:description" content="أكبر مؤسسة تعليمية في مصر - شبكة المدارس القومية" />
<meta property="og:image" content="https://gani.edu.eg/og-default.jpg" />
<meta property="og:url" content="https://gani.edu.eg/" />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="المعاهد القومية | National Institutes" />
<meta name="twitter:description" content="أكبر مؤسسة تعليمية في مصر - شبكة المدارس القومية" />
<meta name="twitter:image" content="https://gani.edu.eg/og-default.jpg" />
```

وكذلك تأكد إن `og-default.jpg` موجود في `public/` directory وسيتم نسخه أثناء البناء.

**ملف إضافي:** ابحث عن ملف `index.html` في المشروع:
- `index.html` في الـ root أو في `public/`
- أضف الـ meta tags فيه

---

## المهمة 7: إضافة "تربية خاصة" / "Special Education" لنوعية التعليم

### 7 مواقع للتغيير:

#### 7.1 `src/types/index.ts` سطر 15
```typescript
// الحالي:
type: 'Arabic' | 'Languages' | 'American' | 'British' | 'French';
// الجديد:
type: 'Arabic' | 'Languages' | 'American' | 'British' | 'French' | 'Special Education';
```

#### 7.2 `src/pages/Schools.tsx` سطر 158
```typescript
// الحالي:
const schoolTypes = ['Arabic', 'Languages', 'American', 'British', 'French'];
// الجديد:
const schoolTypes = ['Arabic', 'Languages', 'American', 'British', 'French', 'Special Education'];
```

#### 7.3 `src/pages/Admissions.tsx` سطر 218
```typescript
// الحالي:
label: lang === 'ar' ? ({ Arabic: 'عربي', Languages: 'لغات', American: 'أمريكي', British: 'بريطاني', French: 'فرنسي' }[t] || t) : t
// الجديد:
label: lang === 'ar' ? ({ Arabic: 'عربي', Languages: 'لغات', American: 'أمريكي', British: 'بريطاني', French: 'فرنسي', 'Special Education': 'تربية خاصة' }[t] || t) : t
```

#### 7.4 `src/pages/Dashboard.tsx` سطر 1183
```typescript
// الحالي:
const allowed = new Set(['Arabic', 'Languages', 'American', 'British', 'French']);
// الجديد:
const allowed = new Set(['Arabic', 'Languages', 'American', 'British', 'French', 'Special Education']);
```

وكذلك في سطر 1201-1206 أضف mapping:
```typescript
// الحالي:
const mapped = toArray(type).map((v) => {
    if (v === 'National') return 'Arabic';
    if (v === 'Language') return 'Languages';
    if (v === 'International') return 'American';
    return v;
});
// الجديد:
const mapped = toArray(type).map((v) => {
    if (v === 'National') return 'Arabic';
    if (v === 'Language') return 'Languages';
    if (v === 'International') return 'American';
    if (v === 'Special') return 'Special Education';
    if (v === 'تربية خاصة' || v === 'تربيه خاصه') return 'Special Education';
    return v;
});
```

#### 7.5 `src/pages/dashboard-components/Modals.tsx` سطر 366-371
أضف بعد خيار French:
```tsx
{ value: 'Special Education', label: lang === 'ar' ? 'تربية خاصة' : 'Special Education' }
```

#### 7.6 `src/i18n/locales/en.ts` سطر 192-198
```typescript
types: {
    Arabic: "Arabic",
    Languages: "Languages",
    American: "American",
    British: "British",
    French: "French",
    "Special Education": "Special Education"
}
```

#### 7.7 `src/i18n/locales/ar.ts` سطر 192-198
```typescript
types: {
    Arabic: "عربي",
    Languages: "لغات",
    American: "أمريكي",
    British: "بريطاني",
    French: "فرنسي",
    "Special Education": "تربية خاصة"
}
```

---

## المرحلة 4: بناء وتغليف

بعد الانتهاء من كل التعديلات:

1. `npm run build`
2. نسخ محتويات `dist/` إلى `cpanel_deploy/` (ما عدا api.php والـ PHP files)
3. إنشاء `deploy-package.zip` يحتوي على كل ملفات `cpanel_deploy/`

---

## ترتيب التنفيذ المقترح

1. **أولاً:** api.php (المهام 1, 3.1, 4) — لأنه backend
2. **ثانياً:** Frontend (المهام 2, 3.2, 3.3, 5, 7) — تعديلات TypeScript/React
3. **ثالثاً:** index.html (المهمة 6) — OG meta tags
4. **رابعاً:** بناء وتغليف