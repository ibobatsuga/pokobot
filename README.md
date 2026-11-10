# Ping! Clone PoC (WAHA + Sakelar AI)

Proof of Concept (PoC) duplikasi sistem Chatbot AI & WhatsApp CRM bergaya **Ping!**, dengan arsitektur modern:
* **WhatsApp Engine:** Menggunakan **WAHA** (WhatsApp HTTP API via Docker) menggantikan Baileys custom & Meta WABA.
* **AI Model Gateway:** Menggunakan **Sakelar AI** (`https://api.sakelar.ai/v1`) untuk akses fleksibel ke DeepSeek, GPT-4o, Claude 3.5, dan Gemini.
* **Backend:** PHP 8+ dengan Webhook pipeline event-driven.

---

## 📁 Struktur Direktori

```
ping-clone-poc/
├── .env.example             # Template konfigurasi
├── .env                     # File konfigurasi utama
├── docker-compose.yml       # Konfigurasi container WAHA
├── config.php               # Environment parser
├── src/
│   ├── WahaService.php      # Client API WAHA (Session, QR, Send Message)
│   ├── SakelarAiService.php # Client AI Gateway (Sakelar AI / OpenAI SDK format)
│   └── ChatbotEngine.php    # Pipeline context, FAQ matcher, dan orchestration
├── webhook.php              # Webhook receiver untuk event WAHA
├── test-simulator.php       # Simulator terminal untuk uji coba balasan AI
├── scan-qr.php              # Helper status sesi WhatsApp & QR Code
└── storage/                 # Penyimpanan sesi chat JSON & log webhook
```

---

## 🚀 Panduan Memulai

### 1. Konfigurasi API Key
Buka file `.env` dan masukkan API Key Sakelar AI Anda:
```env
SAKELAR_API_BASE_URL=https://api.sakelar.ai/v1
SAKELAR_API_KEY=sk-sakelar-xxxxxxx
SAKELAR_MODEL=deepseek-chat
```

### 2. Uji Coba Simulator Terminal (Tanpa Perlu Docker)
Anda bisa langsung menguji kecerdasan balasan bot di terminal:
```bash
php test-simulator.php "Berapa harga paket dan apa saja fiturnya?"
```

### 3. Menjalankan WAHA (WhatsApp Gateway)
Nyalakan Docker Desktop di komputer Anda, lalu jalankan:
```bash
docker compose up -d
```
Cek status koneksi dan scan QR WhatsApp:
```bash
php scan-qr.php
```
Buka browser di **http://localhost:3000/dashboard** (Login: `admin` / `admin`) untuk scan QR Code dari aplikasi WhatsApp di HP Anda.

### 4. Menjalankan Webhook Listener
Jalankan server PHP lokal untuk menerima pesan masuk dari WhatsApp secara real-time:
```bash
php -S localhost:8000 webhook.php
```
Ketika ada pesan masuk dari nomor WhatsApp mana pun, WAHA akan otomatis menembak webhook ini, diproses oleh Sakelar AI, dan langsung dibalas ke WhatsApp pengirim!
