<?php

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/src/WahaService.php';

use App\Services\WahaService;

echo "========================================================\n";
echo "   WAHA (WhatsApp HTTP API) - SESSION & QR MANAGER      \n";
echo "========================================================\n\n";

$waha = new WahaService();

if (!$waha->isRunning()) {
    echo "❌ WAHA belum berjalan di http://localhost:3000.\n";
    echo "Jalankan perintah berikut di terminal terlebih dahulu:\n";
    echo "  docker compose up -d\n\n";
    exit(1);
}

$sessionName = env('WAHA_SESSION_NAME', 'default');
echo "Memeriksa sesi WhatsApp: '$sessionName'...\n";

$statusRes = $waha->getSessionStatus($sessionName);

if (($statusRes['status'] ?? 0) === 404) {
    echo "Sesi belum dibuat. Memulai sesi baru...\n";
    $waha->startSession($sessionName);
    sleep(2);
    $statusRes = $waha->getSessionStatus($sessionName);
}

$sessionStatus = $statusRes['data']['status'] ?? 'UNKNOWN';
echo "Status Sesi Saat Ini: [$sessionStatus]\n\n";

if ($sessionStatus === 'WORKING') {
    echo "🎉 WhatsApp SUDAH TERHUBUNG dan siap menerima/mengirim pesan!\n";
} else {
    echo "📲 Silakan buka browser untuk scan QR Code:\n";
    echo "   🔗 Dashboard: " . $waha->getQrCodeUrl($sessionName) . "\n\n";
    echo "Setelah di-scan, nomor WhatsApp Anda akan otomatis terhubung ke sistem.\n";
}
