<?php

namespace App\Services;

class ChatbotEngine
{
    private WahaService $waha;
    private SakelarAiService $ai;
    private string $storagePath;

    public function __construct()
    {
        $this->waha = new WahaService();
        $this->ai = new SakelarAiService();
        $this->storagePath = __DIR__ . '/../storage';

        if (!is_dir($this->storagePath)) {
            @mkdir($this->storagePath, 0777, true);
        }
    }

    /**
     * Memproses event webhook pesan masuk dari WAHA
     */
    public function handleIncomingWebhook(array $payload): ?array
    {
        // Event WAHA: 'message' atau 'message.any'
        $event = $payload['event'] ?? '';
        $data = $payload['payload'] ?? $payload;

        // Abaikan jika bukan event pesan
        if (!in_array($event, ['message', 'message.any', ''])) {
            return ['status' => 'ignored', 'reason' => "Event {$event} bukan pesan teks"];
        }

        $chatId = $data['chatId'] ?? $data['from'] ?? '';
        $from = $data['from'] ?? '';
        $to = $data['to'] ?? '';
        $body = trim($data['body'] ?? $data['text'] ?? '');
        $msgId = $data['id'] ?? '';

        // Cegah duplikasi event (karena WAHA mengirim message dan message.any)
        if (!empty($msgId) && $this->isMessageAlreadyProcessed($msgId)) {
            return ['status' => 'ignored', 'reason' => 'Pesan dengan ID ini sudah diproses'];
        }

        // Abaikan update status WhatsApp
        if (str_contains($from, 'status@broadcast') || str_contains($chatId, 'status@broadcast')) {
            return ['status' => 'ignored', 'reason' => 'Status broadcast'];
        }

        // Abaikan semua chat dari Grup WhatsApp (@g.us) - Bot HANYA membalas chat pribadi (1-on-1)
        if (str_contains($from, '@g.us') || str_contains($chatId, '@g.us')) {
            return ['status' => 'ignored', 'reason' => 'Pesan grup diabaikan (@g.us), bot hanya membalas chat pribadi'];
        }

        // Dapatkan identitas diri bot/pemilik sesi dari metadata WAHA
        $myId = $payload['me']['id'] ?? '';       // contoh: 628xxxxxxxxxx@c.us
        $myLid = $payload['me']['lid'] ?? '';     // contoh: id_device@lid
        $myNumber = preg_replace('/[^0-9]/', '', $myId);

        // Ekstrak remoteJid dan alternatif nomor telepon jika WhatsApp menggunakan LID
        $remoteJid = $data['_data']['key']['remoteJid'] ?? $chatId;
        $remoteJidAlt = $data['_data']['key']['remoteJidAlt'] ?? $data['_data']['key']['participantAlt'] ?? '';

        // Double-check: pastikan remoteJid bukan grup
        if (str_contains($remoteJid, '@g.us')) {
            return ['status' => 'ignored', 'reason' => 'Pesan grup diabaikan (@g.us)'];
        }

        // Cek apakah pesan dikirim dari diri sendiri (fromMe)
        if (!empty($data['fromMe'])) {
            // HANYA izinkan jika ini adalah "Chat ke Nomor Sendiri" (Message Yourself)
            $isSelfChat = (!empty($myLid) && $remoteJid === $myLid)
                       || (!empty($myNumber) && str_contains($remoteJidAlt, $myNumber))
                       || (!empty($myId) && $from === $myId);

            if (!$isSelfChat) {
                return ['status' => 'ignored', 'reason' => 'Pesan dikirim Anda ke kontak lain (fromMe=true, bukan self-chat)'];
            }

            // Arahkan tujuan balasan ke nomor diri sendiri
            $chatId = $myId ?: ($myNumber . '@c.us');
        }

        // Resolusi nomor telepon pengirim
        $senderNumber = '';
        if (!empty($remoteJidAlt)) {
            $senderNumber = preg_replace('/[^0-9]/', '', $remoteJidAlt);
        }
        if (empty($senderNumber)) {
            $senderNumber = preg_replace('/[^0-9]/', '', $chatId);
        }

        // Cegah bot membalas pesannya sendiri (Infinite Loop Protection)
        if ($this->isSentByBot($body)) {
            return ['status' => 'ignored', 'reason' => 'Pesan ini adalah balasan yang baru saja dikirim oleh bot'];
        }

        if (empty($chatId) || empty($body)) {
            return ['status' => 'ignored', 'reason' => 'Pesan kosong atau chatId tidak ada'];
        }

        if (!empty($msgId)) {
            $this->markMessageAsProcessed($msgId);
        }

        return $this->processMessage($chatId, $body, $data['pushName'] ?? 'Pelanggan', $senderNumber);
    }

    /**
     * Pipeline inti: Ambil konteks -> Tanya Sakelar AI -> Balas via WAHA
     */
    public function processMessage(string $chatId, string $userMessage, string $senderName = 'Pelanggan', string $senderNumber = ''): array
    {
        // 1. Ambil memory riwayat obrolan kontak ini (5 pesan terakhir)
        $history = $this->getConversationHistory($chatId);

        // 2. Minta jawaban cerdas dari Sakelar AI
        $aiResult = $this->ai->generateReply($userMessage, $history);
        $replyText = $aiResult['reply'];

        // 3. Simpan riwayat chat terbaru ke storage
        $this->saveConversation($chatId, $userMessage, $replyText);

        // 4. Kirim balasan ke WhatsApp via WAHA (Mode Aman: Whitelist Nomor)
        $autoReplyEnabled = filter_var(env('AUTO_REPLY_ENABLED', false), FILTER_VALIDATE_BOOLEAN);
        $whitelist = array_filter(array_map('trim', explode(',', env('AUTO_REPLY_WHITELIST', ''))));
        
        // Ekstrak angka murni dari nomor pengirim
        $digitsInChatId = preg_replace('/[^0-9]/', '', $chatId);
        $cleanSenderNumber = $senderNumber ?: $digitsInChatId;

        $isWhitelisted = !empty($whitelist) && (
            in_array($cleanSenderNumber, $whitelist) || in_array($digitsInChatId, $whitelist)
        );

        $wahaSendResult = null;

        if ($autoReplyEnabled && $isWhitelisted && $this->waha->isRunning()) {
            // Catat pesan yang dikirim bot agar tidak membalas dirinya sendiri
            $this->recordBotMessage($replyText);
            $wahaSendResult = $this->waha->sendText($chatId, $replyText);
        } else {
            // Mode Aman: Chat disimpan ke log/storage, tapi bot TIDAK membalas
            $reason = !$autoReplyEnabled 
                ? 'AUTO_REPLY_ENABLED=false' 
                : "Nomor {$senderNumber} tidak terdaftar di AUTO_REPLY_WHITELIST";

            $wahaSendResult = [
                'status'  => 'skipped',
                'reason'  => $reason,
                'message' => 'Mode Aman: Chat diproses secara pasif tanpa membalas ke kontak WhatsApp Anda'
            ];
        }

        return [
            'status'         => 'success',
            'chat_id'        => $chatId,
            'customer_name'  => $senderName,
            'user_message'   => $userMessage,
            'ai_reply'       => $replyText,
            'ai_model'       => $aiResult['model'] ?? 'unknown',
            'waha_sent'      => $wahaSendResult !== null && ($wahaSendResult['status'] ?? 0) < 300,
            'waha_response'  => $wahaSendResult
        ];
    }

    /**
     * Ambil riwayat percakapan sederhana dari file JSON
     */
    private function getConversationHistory(string $chatId): array
    {
        $file = $this->storagePath . '/' . md5($chatId) . '.json';
        if (!file_exists($file)) {
            return [];
        }

        $data = json_decode(file_get_contents($file), true) ?? [];
        return array_slice($data, -6); // 3 pasang percakapan terakhir
    }

    /**
     * Simpan pesan user dan bot ke file JSON
     */
    private function saveConversation(string $chatId, string $userMsg, string $botReply): void
    {
        $file = $this->storagePath . '/' . md5($chatId) . '.json';
        $history = file_exists($file) ? json_decode(file_get_contents($file), true) ?? [] : [];

        $history[] = ['role' => 'user', 'content' => $userMsg, 'time' => time()];
        $history[] = ['role' => 'assistant', 'content' => $botReply, 'time' => time()];

        // Batasi maksimal simpan 20 chat terakhir
        if (count($history) > 20) {
            $history = array_slice($history, -20);
        }

        file_put_contents($file, json_encode($history, JSON_PRETTY_PRINT));
    }

    /**
     * Catat pesan yang baru dikirim oleh bot untuk mencegah looping
     */
    private function recordBotMessage(string $text): void
    {
        $logFile = $this->storagePath . '/bot_sent_cache.json';
        $cache = file_exists($logFile) ? json_decode(file_get_contents($logFile), true) ?? [] : [];

        $now = time();
        $cache[md5(trim($text))] = $now;

        // Bersihkan cache yang lebih dari 60 detik
        foreach ($cache as $hash => $timestamp) {
            if ($now - $timestamp > 60) {
                unset($cache[$hash]);
            }
        }

        file_put_contents($logFile, json_encode($cache));
    }

    /**
     * Cek apakah pesan teks ini baru saja dikirim oleh bot sendiri
     */
    private function isSentByBot(string $text): bool
    {
        $logFile = $this->storagePath . '/bot_sent_cache.json';
        if (!file_exists($logFile)) {
            return false;
        }

        $cache = json_decode(file_get_contents($logFile), true) ?? [];
        $hash = md5(trim($text));

        return isset($cache[$hash]) && (time() - $cache[$hash] <= 60);
    }

    /**
     * Catat ID pesan yang sudah diproses agar tidak ganda
     */
    private function markMessageAsProcessed(string $msgId): void
    {
        $logFile = $this->storagePath . '/processed_ids.json';
        $cache = file_exists($logFile) ? json_decode(file_get_contents($logFile), true) ?? [] : [];

        $now = time();
        $cache[$msgId] = $now;

        // Bersihkan cache yang lebih dari 120 detik
        foreach ($cache as $id => $timestamp) {
            if ($now - $timestamp > 120) {
                unset($cache[$id]);
            }
        }

        file_put_contents($logFile, json_encode($cache));
    }

    /**
     * Cek apakah ID pesan ini sudah pernah diproses
     */
    private function isMessageAlreadyProcessed(string $msgId): bool
    {
        $logFile = $this->storagePath . '/processed_ids.json';
        if (!file_exists($logFile)) {
            return false;
        }

        $cache = json_decode(file_get_contents($logFile), true) ?? [];
        return isset($cache[$msgId]) && (time() - $cache[$msgId] <= 120);
    }
}
