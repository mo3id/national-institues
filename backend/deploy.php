<?php
// GitHub Webhook Deployment Script
// يتم تشغيله تلقائياً عند كل push على main branch

// تحقق من أن الطلب آمن (من GitHub فقط)
$webhookSecret = 'your-webhook-secret-change-this'; // غيّر هذا لشيء عشوائي قوي

// الحصول على التوقيع من GitHub
$signature = $_SERVER['HTTP_X_HUB_SIGNATURE_256'] ?? '';
$payload = file_get_contents('php://input');

// التحقق من التوقيع
$expectedSignature = 'sha256=' . hash_hmac('sha256', $payload, $webhookSecret);
if (!hash_equals($signature, $expectedSignature)) {
    http_response_code(403);
    die('Forbidden: Invalid signature');
}

// تحليل البيانات من GitHub
$data = json_decode($payload, true);
if (!$data) {
    die('Invalid JSON');
}

// تحقق من أن الـ push كان على main branch
if ($data['ref'] !== 'refs/heads/main') {
    die('Not main branch');
}

// سجل التحديث
$logFile = __DIR__ . '/deploy.log';
$timestamp = date('Y-m-d H:i:s');
$logMessage = "[$timestamp] Deployment triggered by push\n";
file_put_contents($logFile, $logMessage, FILE_APPEND);

// المجلد الذي به المشروع (غيّره حسب مساره الفعلي)
$deployDir = '/home/username/public_html'; // غيّر username

// تنفيذ git pull
$output = shell_exec("cd {$deployDir} && git pull origin main 2>&1");
file_put_contents($logFile, "Output: $output\n", FILE_APPEND);

// إذا كانت هناك database migrations
// يمكنك تشغيلها هنا

http_response_code(200);
echo json_encode(['status' => 'success', 'message' => 'Deployment started']);
?>
