<?php

namespace App\Services;

class WahaService
{
    private string $baseUrl;
    private string $apiKey;
    private string $defaultSession;

    public function __construct()
    {
        $this->baseUrl = rtrim(env('WAHA_BASE_URL', ''), '/');
        $this->apiKey = env('WAHA_API_KEY', '');
        $this->defaultSession = env('WAHA_SESSION_NAME', 'default');
    }

    /**
     * Cek apakah server WAHA sedang running dan dapat dijangkau
     */
    public function isRunning(): bool
    {
        if (empty($this->baseUrl)) {
            return false;
        }
        $res = $this->request('GET', '/api/sessions');
        return $res['status'] >= 200 && $res['status'] < 300;
    }

    /**
     * Dapatkan daftar sesi yang aktif
     */
    public function getSessions(): array
    {
        return $this->request('GET', '/api/sessions');
    }

    /**
     * Mulai sesi WhatsApp baru atau lanjutkan sesi yang ada
     */
    public function startSession(?string $session = null): array
    {
        $session = $session ?: $this->defaultSession;
        return $this->request('POST', '/api/sessions/start', [
            'name' => $session
        ]);
    }

    /**
     * Periksa status sesi (misal: SCAN_QR_CODE, WORKING, STOPPED)
     */
    public function getSessionStatus(?string $session = null): array
    {
        $session = $session ?: $this->defaultSession;
        return $this->request('GET', "/api/sessions/{$session}");
    }

    /**
     * Dapatkan URL atau representasi QR Code untuk di-scan oleh WhatsApp HP
     */
    public function getQrCodeUrl(?string $session = null): string
    {
        $session = $session ?: $this->defaultSession;
        return "{$this->baseUrl}/dashboard/#/sessions/{$session}";
    }

    /**
     * Kirim pesan teks ke nomor WhatsApp (chatId format: 628123456789@c.us)
     */
    public function sendText(string $chatId, string $text, ?string $session = null): array
    {
        $session = $session ?: $this->defaultSession;

        // Normalisasi format chatId jika nomor diawali tanpa @c.us
        if (!str_contains($chatId, '@')) {
            $chatId = preg_replace('/[^0-9]/', '', $chatId) . '@c.us';
        }

        return $this->request('POST', '/api/sendText', [
            'session' => $session,
            'chatId'  => $chatId,
            'text'    => $text,
        ]);
    }

    /**
     * Kirim pesan gambar beserta caption ke nomor WhatsApp
     */
    public function sendImage(string $chatId, string $imageUrl, string $caption = '', ?string $session = null): array
    {
        $session = $session ?: $this->defaultSession;

        if (!str_contains($chatId, '@')) {
            $chatId = preg_replace('/[^0-9]/', '', $chatId) . '@c.us';
        }

        return $this->request('POST', '/api/sendImage', [
            'session' => $session,
            'chatId'  => $chatId,
            'file'    => [
                'url' => $imageUrl
            ],
            'caption' => $caption
        ]);
    }

    /**
     * Helper HTTP Request via cURL
     */
    private function request(string $method, string $endpoint, array $data = []): array
    {
        $url = $this->baseUrl . $endpoint;
        $ch = curl_init($url);

        $headers = [
            'Content-Type: application/json',
            'Accept: application/json'
        ];

        if (!empty($this->apiKey)) {
            $headers[] = 'X-Api-Key: ' . $this->apiKey;
        }

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_TIMEOUT, 15);

        if ($method === 'POST') {
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        } elseif ($method === 'DELETE') {
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE');
        }

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);

        if ($error) {
            return [
                'status' => $httpCode ?: 500,
                'error'  => $error,
                'data'   => null
            ];
        }

        return [
            'status' => $httpCode,
            'data'   => json_decode($response, true) ?? $response
        ];
    }
}
