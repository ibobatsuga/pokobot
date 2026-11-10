<?php

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/src/WahaService.php';
require_once __DIR__ . '/src/SakelarAiService.php';
require_once __DIR__ . '/src/ChatbotEngine.php';

use App\Services\WahaService;
use App\Services\SakelarAiService;
use App\Services\ChatbotEngine;

echo "========================================================\n";
echo "       POKO: WAHA + SAKELAR AI SIMULATOR              \n";
echo "========================================================\n\n";

$waha = new WahaService();
$ai = new SakelarAiService();
$engine = new ChatbotEngine();

// 1. Cek Konektivitas WAHA
echo "[1/2] Memeriksa WAHA WhatsApp Gateway (http://localhost:3000)... ";
if ($waha->isRunning()) {
    echo "✅ ONLINE\n";
} else {
    echo "⚠️  OFFLINE (Docker WAHA belum berjalan. Jalankan 'docker compose up -d' untuk mengaktifkannya)\n";
}

// 2. Cek Konfigurasi Sakelar AI
echo "[2/2] Memeriksa Konfigurasi Sakelar AI... ";
$sakelarKey = env('SAKELAR_API_KEY');
if (empty($sakelarKey) || $sakelarKey === 'sk-sakelar-demo-key') {
    echo "⚠️  Peringatan: SAKELAR_API_KEY masih menggunakan demo key di .env\n";
} else {
    echo "✅ OK (Model: " . env('SAKELAR_MODEL', 'deepseek-chat') . ")\n";
}

echo "\n--------------------------------------------------------\n";
echo "Simulasi Pertanyaan Pelanggan:\n";

// Pertanyaan uji coba
$testQuestion = $argv[1] ?? "Halo, fitur apa saja yang ada di Ping dan berapa biaya paketnya?";
echo "👤 Pelanggan: \"$testQuestion\"\n";
echo "🤖 Sedang memproses balasan AI via Sakelar AI...\n\n";

$res = $engine->processMessage("6281299990001", $testQuestion, "Budi Santoso");

echo "💬 Balasan Bot:\n";
echo "--------------------------------------------------------\n";
echo $res['ai_reply'] . "\n";
echo "--------------------------------------------------------\n";
echo "Model Digunakan : " . $res['ai_model'] . "\n";
echo "Status Kirim WA : " . ($res['waha_sent'] ? "Terkirim ke WhatsApp ✅" : "Tersimulasi (WAHA Offline / Mode Test)") . "\n\n";

echo "💡 Tips: Anda dapat mencoba pertanyaan lain dengan menjalankan:\n";
echo "   php test-simulator.php \"Pertanyaan Anda di sini\"\n\n";
