<?php

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/src/WahaService.php';
require_once __DIR__ . '/src/SakelarAiService.php';
require_once __DIR__ . '/src/ChatbotEngine.php';

use App\Services\ChatbotEngine;

header('Content-Type: application/json');

// Tangkap payload raw JSON dari WAHA
$rawPayload = file_get_contents('php://input');
$payload = json_decode($rawPayload, true) ?? [];

if (empty($payload)) {
    // Jika diakses via browser GET biasa
    echo json_encode([
        'status'  => 'online',
        'service' => 'Ping Clone WAHA + Sakelar AI Webhook Endpoint',
        'time'    => date('c')
    ], JSON_PRETTY_PRINT);
    exit;
}

// Log incoming payload ke storage/webhook.log untuk inspeksi debugging
$logEntry = "[" . date('Y-m-d H:i:s') . "] " . $rawPayload . PHP_EOL;
@file_put_contents(__DIR__ . '/storage/webhook.log', $logEntry, FILE_APPEND);

// Proses pesan masuk melalui engine chatbot
$engine = new ChatbotEngine();
$result = $engine->handleIncomingWebhook($payload);

echo json_encode($result, JSON_PRETTY_PRINT);
