# Fix Dashboard Bugs Plan

## Bug 1: Complaint Number Shows Internal ID

### Root Cause
- `Dashboard.tsx:2258` shows `c.id` (e.g., `comp_664a1b2c3d4e5`) instead of `c.complaintNumber` (e.g., `COMP-2026-042`)
- `Complaints.tsx:77` saves `result.data?.id` (internal ID) instead of complaint number
- `ComplaintInquiry.tsx:135` placeholder says `CMP-XXXX` but format is `COMP-YYYY-XXX`
- `ComplaintInquiry.tsx:171` shows `complaint.id` instead of `complaint.complaint_number`

### Fix 1a: Dashboard.tsx:2258
Change:
```tsx
{c.id || '—'}
```
To:
```tsx
{c.complaintNumber || c.id || '—'}
```

### Fix 1b: Complaints.tsx - Store complaintNumber after submission
Line 77, change:
```tsx
setComplaintId(result.data?.id || null);
```
To:
```tsx
setComplaintId(result.data?.complaint_number || result.data?.id || null);
```

### Fix 1c: ComplaintInquiry.tsx:135 - Fix placeholder
Change:
```tsx
placeholder="CMP-XXXX"
```
To:
```tsx
placeholder="COMP-YYYY-XXX"
```

### Fix 1d: ComplaintInquiry.tsx:171 - Show complaint number
Change:
```tsx
<h3 className="text-2xl font-black text-[#1e3a8a] tracking-tight">{complaint.id}</h3>
```
To:
```tsx
<h3 className="text-2xl font-black text-[#1e3a8a] tracking-tight">{complaint.complaint_number || complaint.id}</h3>
```

### Fix 1e: ComplaintInquiry.tsx:53-54 - Copy complaint number
Change:
```tsx
if (!complaint?.id) return;
navigator.clipboard.writeText(complaint.id);
```
To:
```tsx
if (!complaint?.complaint_number && !complaint?.id) return;
navigator.clipboard.writeText(complaint.complaint_number || complaint.id);
```

---

## Bug 2: Complaint Status Not Showing in Detail Modal

### Root Cause - Two sub-issues

**a. Status value mismatch**: DB ENUM is `('pending','under_review','resolved','rejected')` but Dashboard dropdown uses `['Pending', 'In Progress', 'Responded']`. Raw DB values don't match capitalized dropdown options, so the select appears unselected.

**b. Field name mismatch**: Modal uses `selectedComplaint.response` (Dashboard.tsx:2738), but API returns `adminResponse` (mapped from `admin_response`). No `response` field exists, so it's always undefined.

### Fix 2a: Both api.php files - Add status normalization in complaints list

In `get_entries` → `complaints` section, change:
```php
foreach ($data as &$c) {
    $c['fullName'] = $c['full_name'] ?? '';
    $c['messageType'] = $c['message_type'] ?? '';
    $c['adminResponse'] = $c['admin_response'] ?? '';
    $c['createdAt'] = $c['created_at'] ?? '';
    $c['complaintNumber'] = $c['complaint_number'] ?? '';
}
```
To:
```php
$statusMap = ['pending' => 'Pending', 'under_review' => 'In Progress', 'resolved' => 'Responded', 'rejected' => 'Rejected'];
foreach ($data as &$c) {
    $c['fullName'] = $c['full_name'] ?? '';
    $c['messageType'] = $c['message_type'] ?? '';
    $c['adminResponse'] = $c['admin_response'] ?? '';
    $c['response'] = $c['admin_response'] ?? '';
    $c['createdAt'] = $c['created_at'] ?? '';
    $c['complaintNumber'] = $c['complaint_number'] ?? '';
    $raw = strtolower($c['status'] ?? '');
    $c['status'] = $statusMap[$raw] ?? ($c['status'] ?? 'Pending');
}
```

### Fix 2b: Both api.php files - Fix get_complaint_status to return camelCase + normalized status

Change:
```php
echo json_encode(["status" => "success", "data" => [
    'id' => $complaint['id'],
    'complaint_number' => $complaint['complaint_number'],
    'status' => $complaint['status'],
    'admin_response' => $complaint['admin_response'] ?? '',
    'created_at' => $complaint['created_at'],
    'fullName' => $complaint['full_name'] ?? '***'
]]);
```
To:
```php
$statusMap = ['pending' => 'Pending', 'under_review' => 'In Progress', 'resolved' => 'Responded', 'rejected' => 'Rejected'];
$raw = strtolower($complaint['status'] ?? '');
$normStatus = $statusMap[$raw] ?? ($complaint['status'] ?? 'Pending');
echo json_encode(["status" => "success", "data" => [
    'id' => $complaint['id'],
    'complaintNumber' => $complaint['complaint_number'],
    'complaint_number' => $complaint['complaint_number'],
    'status' => $normStatus,
    'adminResponse' => $complaint['admin_response'] ?? '',
    'response' => $complaint['admin_response'] ?? '',
    'createdAt' => $complaint['created_at'],
    'fullName' => $complaint['full_name'] ?? '***'
]]);
```

### Fix 2c: Both api.php files - Fix update_complaint to handle normalized status

In `update_complaint`, add reverse status mapping before UPDATE:

After `$response = $input['response'] ?? '';` add:
```php
// Map frontend status values back to DB ENUM values
$reverseStatusMap = ['Pending' => 'pending', 'In Progress' => 'under_review', 'Responded' => 'resolved', 'Rejected' => 'rejected'];
$dbStatus = $reverseStatusMap[$status] ?? strtolower($status);
```

Then change the execute to use `$dbStatus`:
```php
$result = $stmt->execute([$dbStatus, $response, $id]);
```

### Fix 2d: Dashboard.tsx - Add Rejected to status dropdown + fix status badge

Line 2728, change:
```tsx
options={['Pending', 'In Progress', 'Responded'].map(st => ({
```
To:
```tsx
options={['Pending', 'In Progress', 'Responded', 'Rejected'].map(st => ({
```

Line 2271-2276, update the status badge to handle Rejected:
```tsx
<span style={{
    padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700,
    background: c.status === 'Responded' ? 'rgba(16,185,129,0.15)' : c.status === 'In Progress' ? 'rgba(245,158,11,0.15)' : c.status === 'Rejected' ? 'rgba(239,68,68,0.15)' : 'rgba(99,102,241,0.12)',
    color: c.status === 'Responded' ? '#10b981' : c.status === 'In Progress' ? '#f59e0b' : c.status === 'Rejected' ? '#ef4444' : 'var(--accent)',
}}>{c.status || 'Pending'}</span>
```

### Fix 2e: ComplaintInquiry.tsx - Fix field name references

The `get_complaint_status` API will now return camelCase fields (after Fix 2b). Update the frontend:

Line 194, change:
```tsx
{formatDate(complaint.createdAt)}
```
(Already works after Fix 2b since we add `createdAt`)

Line 204-206, change:
```tsx
{complaint.response ? (
    <p className="text-slate-700 leading-relaxed font-medium">
        {complaint.response}
    </p>
```
(Already works after Fix 2b since we add `response`)

### Fix 2f: ComplaintInquiry.tsx - Add Rejected status case

Line 74-91, add 'rejected' case:
```tsx
case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
```
And for icon:
```tsx
case 'rejected': return <XCircle className="w-4 h-4" />;
```
Need to import XCircle from lucide-react.

---

## Bug 3: No CV Preview in Job Application Details

### Root Cause
The backend stores only `resume_path` (filename) in the DB. The `cvData` (base64 file content) sent by the frontend is discarded. The Dashboard expects `selectedApplicant.cvData` for the iframe preview and download link, but it's always undefined.

### Fix 3a: phpMyAdmin - Add resume_data column
Run in phpMyAdmin SQL:
```sql
ALTER TABLE job_applications ADD COLUMN resume_data LONGTEXT AFTER resume_path;
```

### Fix 3b: Both api.php files - Save cvData in add_job_application

Change the INSERT query from:
```php
$stmt = $pdo->prepare("INSERT INTO job_applications (id, application_number, job_id, full_name, email, phone, experience_years, cover_letter, resume_path, status, applied_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->execute([
    $appId,
    $appNumber,
    $input['job'] ?? '',
    $input['fullName'] ?? '',
    $input['email'] ?? '',
    $input['phone'] ?? '',
    (int)($input['experience'] ?? 0),
    $input['coverLetter'] ?? '',
    $fileName,
    'pending',
    date('Y-m-d H:i:s')
]);
```
To:
```php
$stmt = $pdo->prepare("INSERT INTO job_applications (id, application_number, job_id, full_name, email, phone, experience_years, cover_letter, resume_path, resume_data, status, applied_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->execute([
    $appId,
    $appNumber,
    $input['job'] ?? '',
    $input['fullName'] ?? '',
    $input['email'] ?? '',
    $input['phone'] ?? '',
    (int)($input['experience'] ?? 0),
    $input['coverLetter'] ?? '',
    $fileName,
    $input['cvData'] ?? '',
    'pending',
    date('Y-m-d H:i:s')
]);
```

### Fix 3c: Both api.php files - Return cvData in get_job_application detail

After `$app['cvName'] = $app['resume_path'] ?? '';` add:
```php
$app['cvData'] = $app['resume_data'] ?? '';
```

### Fix 3d: Both api.php files - Do NOT return resume_data in list endpoint

In the `get_entries` → `jobApplications` section, after the foreach loop that normalizes fields, add:
```php
// Remove heavy resume_data from list responses to avoid bloating
foreach ($data as &$app) {
    unset($app['resume_data']);
}
unset($app);
```

Actually, better to just not include it. Since `SELECT *` fetches all columns, we need to explicitly unset it. Add this AFTER the existing foreach normalization loop for jobApplications.

Wait - the existing loop already creates the `$data` array from `SELECT *`. The `resume_data` will be in the raw rows. We should unset it per row:

Add inside the existing jobApplications foreach, after `$app['cvName'] = ...`:
```php
unset($app['resume_data']);
```

---

## Files to Edit Summary

| # | File | Change |
|---|------|--------|
| 1 | `backend/api.php` | Complaints list: status normalization + response alias |
| 2 | `backend/api.php` | get_complaint_status: camelCase + status normalization |
| 3 | `backend/api.php` | update_complaint: reverse status mapping |
| 4 | `backend/api.php` | add_job_application: save cvData to resume_data |
| 5 | `backend/api.php` | get_job_application: return cvData |
| 6 | `backend/api.php` | get_entries jobApplications: unset resume_data |
| 7 | `cpanel_deploy/api.php` | Same changes as #1-6 |
| 8 | `Dashboard.tsx:2258` | c.id → c.complaintNumber || c.id |
| 9 | `Dashboard.tsx:2271-2276` | Add Rejected status badge color |
| 10 | `Dashboard.tsx:2728` | Add Rejected to dropdown |
| 11 | `Complaints.tsx:77` | Store complaint_number |
| 12 | `ComplaintInquiry.tsx:135` | Fix placeholder |
| 13 | `ComplaintInquiry.tsx:53-54` | Copy complaint_number |
| 14 | `ComplaintInquiry.tsx:171` | Show complaint_number |
| 15 | `ComplaintInquiry.tsx:74-91` | Add rejected status case |

## Post-Implementation Steps

1. Run `npm run build`
2. Copy dist files to `cpanel_deploy/`
3. Run ALTER TABLE SQL in phpMyAdmin
4. Upload files to production
5. Test all 3 bugs
