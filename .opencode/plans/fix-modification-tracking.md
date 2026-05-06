# خطة التنفيذ - إصلاح مشكلة تتبع طلب التعديل

## المشكلة
عند البحث عن `MOD-2026-107-0389` في صفحة `/admissions/track`، الكود القديم بيستدعي `get_admission_status` بدل ما يحول لصفحة تتبع التعديل. الخطأ الظاهر:
```
GET https://gani.edu.eg/api.php?action=get_admission_status&applicationNumber=MOD-2026-107-0389 404 (Not Found)
```

## السبب
الملف على السيرفر لسه **قديم** (اسمه `index-D9QRmuL6.js`). الكود الجديد (اللي فيه redirect لـ MOD-) في ملف اسمه `index-DXUq4bOz.js`.

## الحل
رفع ملفات `deploy-package-phase2.zip` الجديدة واستبدال الملفات القديمة على السيرفر كامل.

### خطوات الرفع:
1. ارفع `deploy-package-phase2.zip` لـ cPanel
2. استخرج في `public_html` (overwrite all)
3. **مهم:** امسح ملفات JS/CSS القديمة من `assets/` اللي مش موجودة في الـ build الجديد:
   - احذف `index-D9QRmuL6.js` (القديم)
   - احذف أي ملفات قديمة مش موجودة في الـ zip الجديد
4. تأكد إن ملف `index.html` الجديد يشير لـ `index-DXUq4bOz.js` (ده اللي فيه redirect لـ MOD-)

### بديل سريع (بدون رفع كامل):
لو عايز تحل المشكلة بسرعة، ممكن تعدل ملف `index.html` على السيرفر وتشيل الكاش:

الملف `index.html` لازم يشير لـ:
```html
<script type="module" crossorigin src="/assets/index-DXUq4bOz.js"></script>
```

لو لسه بيشير لـ `index-D9QRmuL6.js`، يبقى لازم تتأكد إن `index.html` الجديد اترفع.

### تحقق بعد الرفع:
1. افتح `https://gani.edu.eg/admissions/track`
2. اختار "طلب تعديل"
3. ادخل `MOD-2026-107-0389`
4. لازم يتحول لـ `/modifications/track?requestNumber=MOD-2026-107-0389`