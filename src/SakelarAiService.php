<?php

namespace App\Services;

class SakelarAiService
{
    private string $baseUrl;
    private string $apiKey;
    private string $model;

    public function __construct()
    {
        $this->baseUrl = rtrim(env('SAKELAR_API_BASE_URL', 'https://api.sakelar.ai/v1'), '/');
        $this->apiKey = env('SAKELAR_API_KEY', '');
        $this->model = env('SAKELAR_MODEL', 'deepseek-chat');
    }

    /**
     * Meminta balasan cerdas dari model AI di Sakelar AI
     * 
     * @param string $userMessage Pesan teks dari pelanggan
     * @param array $conversationHistory Riwayat percakapan sebelumnya jika ada
     * @param string|null $customSystemPrompt Instruksi khusus atau data FAQ bisnis
     * @return array ['success' => bool, 'reply' => string, 'raw' => array]
     */
    public function generateReply(string $userMessage, array $conversationHistory = [], ?string $customSystemPrompt = null): array
    {
        $systemPrompt = $customSystemPrompt ?: $this->getDefaultSystemPrompt();

        $messages = [
            ['role' => 'system', 'content' => $systemPrompt]
        ];

        // Masukkan riwayat pesan percakapan (memory context)
        foreach ($conversationHistory as $msg) {
            $messages[] = [
                'role'    => $msg['role'] ?? 'user',
                'content' => $msg['content'] ?? ''
            ];
        }

        // Pesan terkini dari customer
        $messages[] = [
            'role'    => 'user',
            'content' => $userMessage
        ];

        $payload = [
            'model'       => $this->model,
            'messages'    => $messages,
            'temperature' => 0.7,
            'max_tokens'  => 800
        ];

        $res = $this->request('/chat/completions', $payload);

        if (!$res['success']) {
            return [
                'success' => false,
                'reply'   => "Mohon maaf, saat ini asisten AI sedang sibuk. Customer Service kami akan segera membalas pesan Anda.",
                'error'   => $res['error'] ?? 'Unknown error'
            ];
        }

        $reply = $res['data']['choices'][0]['message']['content'] ?? '';

        return [
            'success' => true,
            'reply'   => trim($reply),
            'model'   => $res['data']['model'] ?? $this->model,
            'usage'   => $res['data']['usage'] ?? []
        ];
    }

    /**
     * System Prompt default bergaya CRM Assistant UMKM (mirip persona Ping!)
     */
    private function getDefaultSystemPrompt(): string
    {
        $botName = env('BOT_NAME', 'Poko');
        $businessName = env('BUSINESS_NAME', 'Poko');
        $description = env('BUSINESS_DESCRIPTION', 'Layanan CRM dan Otomasi WhatsApp.');
        $faq = env('BUSINESS_FAQ', '');

        return <<<PROMPT
Anda adalah $botName, Customer Service AI resmi dari "$businessName".
Profil Bisnis: $description

Pedoman Menjawab:
1. Bersikaplah sangat ramah, profesional, solutif, dan gunakan Bahasa Indonesia yang sopan serta luwes (khas customer service modern).
2. Jawaban harus padat, informatif, dan tidak bertele-tele (cocok dibaca di layar chat WhatsApp).
3. Gunakan formatting WhatsApp yang rapi (seperti *tebal* untuk poin penting, emoji secukupnya).
4. Jika ditanya hal yang relevan dengan FAQ berikut, jawab berdasarkan fakta ini:
$faq
5. Jika ada pertanyaan di luar pengetahuan di atas, katakan dengan sopan bahwa Anda akan meneruskan pertanyaan tersebut ke tim admin / CS manusia.
PROMPT;
    }

    /**
     * HTTP POST Request ke Sakelar AI Gateway
     */
    private function request(string $endpoint, array $payload): array
    {
        $url = $this->baseUrl . $endpoint;
        $ch = curl_init($url);

        $headers = [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $this->apiKey,
            'Accept: application/json'
        ];

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);

        if ($error) {
            return [
                'success' => false,
                'error'   => "Curl Error: {$error}",
                'code'    => $httpCode
            ];
        }

        $data = json_decode($response, true);

        if ($httpCode < 200 || $httpCode >= 300) {
            $msg = $data['error']['message'] ?? $response ?: "HTTP Error {$httpCode}";
            return [
                'success' => false,
                'error'   => $msg,
                'code'    => $httpCode
            ];
        }

        return [
            'success' => true,
            'data'    => $data
        ];
    }
}
