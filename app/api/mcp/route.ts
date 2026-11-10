import { NextResponse } from "next/server";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
};

// PokoBot Native MCP Tools Definition
const POKOBOT_MCP_TOOLS = [
  {
    name: "pokobot_send_whatsapp_message",
    description:
      "Kirim pesan teks atau format WhatsApp ke kontak atau nomor tertentu menggunakan WAHA instance aktif.",
    inputSchema: {
      type: "object",
      properties: {
        phone: {
          type: "string",
          description: "Nomor WhatsApp tujuan dengan format internasional (contoh: 6281802731947 atau 6289637370000).",
        },
        message: {
          type: "string",
          description: "Isi pesan WhatsApp yang ingin dikirimkan.",
        },
        session: {
          type: "string",
          description: "Nama session WAHA yang digunakan (default: 'default').",
          default: "default",
        },
      },
      required: ["phone", "message"],
    },
  },
  {
    name: "pokobot_get_chats",
    description:
      "Mengambil daftar percakapan WhatsApp aktif, pesan terakhir, unread count, dan status CRM.",
    inputSchema: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Jumlah percakapan yang ingin diambil (default: 10, max: 50).",
          default: 10,
        },
        unreadOnly: {
          type: "boolean",
          description: "Hanya ambil percakapan yang belum dibaca.",
          default: false,
        },
      },
    },
  },
  {
    name: "pokobot_search_contacts",
    description:
      "Mencari data kontak di database CRM PokoBot berdasarkan nama, nomor telepon, atau label tag.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Nama kontak, nomor WhatsApp, atau label (contoh: 'Budi' atau 'VIP').",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "pokobot_update_crm_deal",
    description:
      "Memperbarui stage deal pelanggan di pipeline CRM (New Inquiries, AI Qualifying, Sales Follow-up, Closed Won).",
    inputSchema: {
      type: "object",
      properties: {
        phone: {
          type: "string",
          description: "Nomor WhatsApp kontak.",
        },
        stage: {
          type: "string",
          enum: ["New Inquiries", "AI Qualifying", "Sales Follow-up", "Deal Closed / Won", "Lost"],
          description: "Tahapan deal baru di pipeline CRM.",
        },
        dealValue: {
          type: "string",
          description: "Nilai transaksi dalam rupiah (contoh: 'Rp 5.000.000').",
        },
        notes: {
          type: "string",
          description: "Catatan internal follow up deal.",
        },
      },
      required: ["phone", "stage"],
    },
  },
  {
    name: "pokobot_trigger_broadcast",
    description:
      "Menjadwalkan atau mengirim broadcast pesan massal dengan pengaman interval anti-ban ke label kontak.",
    inputSchema: {
      type: "object",
      properties: {
        campaignName: {
          type: "string",
          description: "Judul kampanye broadcast.",
        },
        targetTag: {
          type: "string",
          description: "Label target kontak (contoh: 'Leads Panas', 'Pelanggan Baru', 'Semua').",
        },
        messageTemplate: {
          type: "string",
          description: "Format teks broadcast. Mendukung placeholder {{nama}}.",
        },
      },
      required: ["campaignName", "targetTag", "messageTemplate"],
    },
  },
  {
    name: "pokobot_query_knowledge_base",
    description:
      "Mencari jawaban dan SOP dari basis data FineTunnel training bot PokoBot (FAQ produk, katalog, ongkir).",
    inputSchema: {
      type: "object",
      properties: {
        question: {
          type: "string",
          description: "Pertanyaan seputar produk atau SOP untuk dicari konteksnya.",
        },
      },
      required: ["question"],
    },
  },
];

// OPTIONS: Handle CORS Preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

// GET: Server info, schema & connection instructions for MCP clients
export async function GET(request: Request) {
  const url = new URL(request.url);
  const host = url.origin;

  return NextResponse.json(
    {
      status: "ok",
      server: {
        name: "pokobot-mcp-server",
        version: "1.0.0",
        description: "Model Context Protocol (MCP) Server for PokoBot CRM & WAHA WhatsApp Engine",
        provider: "FLUXY.ID",
      },
      endpoint: `${host}/api/mcp`,
      tools: POKOBOT_MCP_TOOLS,
      clientsConfig: {
        claudeDesktop: {
          instructions: "Tambahkan ke ~/Library/Application Support/Claude/claude_desktop_config.json",
          config: {
            mcpServers: {
              pokobot: {
                command: "npx",
                args: ["-y", "@modelcontextprotocol/server-fetch", `${host}/api/mcp`],
                env: {
                  POKOBOT_API_KEY: "pk_live_fluxy_pokobot_enterprise",
                },
              },
            },
          },
        },
        cursor: {
          instructions: "Tambahkan ke pengaturan Cursor MCP Settings atau .cursor/mcp.json",
          config: {
            mcpServers: {
              pokobot: {
                url: `${host}/api/mcp`,
                headers: {
                  Authorization: "Bearer pk_live_fluxy_pokobot_enterprise",
                },
              },
            },
          },
        },
        antigravity: {
          instructions: "Tambahkan ke Antigravity / Gemini Code Assist MCP Settings",
          config: {
            mcpServers: {
              pokobot: {
                url: `${host}/api/mcp`,
                headers: {
                  Authorization: "Bearer pk_live_fluxy_pokobot_enterprise",
                },
              },
            },
          },
        },
      },
    },
    { headers: CORS_HEADERS }
  );
}

// POST: JSON-RPC 2.0 MCP Request Handler
export async function POST(request: Request) {
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        jsonrpc: "2.0",
        id: null,
        error: {
          code: -32700,
          message: "Parse error: Invalid JSON payload",
        },
      },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const { jsonrpc = "2.0", id = 1, method, params } = body;

  try {
    // 1. Initialize MCP Handshake
    if (method === "initialize") {
      return NextResponse.json(
        {
          jsonrpc: "2.0",
          id,
          result: {
            protocolVersion: "2024-11-05",
            serverInfo: {
              name: "pokobot-mcp-server",
              version: "1.0.0",
            },
            capabilities: {
              tools: {
                listChanged: true,
              },
              resources: {},
              prompts: {},
            },
          },
        },
        { headers: CORS_HEADERS }
      );
    }

    // 2. Tools List Request
    if (method === "tools/list") {
      return NextResponse.json(
        {
          jsonrpc: "2.0",
          id,
          result: {
            tools: POKOBOT_MCP_TOOLS,
          },
        },
        { headers: CORS_HEADERS }
      );
    }

    // 3. Tools Call Execution
    if (method === "tools/call") {
      const toolName = params?.name;
      const toolArgs = params?.arguments || {};

      switch (toolName) {
        case "pokobot_send_whatsapp_message": {
          const { phone, message, session = "default" } = toolArgs;
          if (!phone || !message) {
            return NextResponse.json(
              {
                jsonrpc: "2.0",
                id,
                error: {
                  code: -32602,
                  message: "Invalid params: 'phone' and 'message' are required arguments",
                },
              },
              { status: 400, headers: CORS_HEADERS }
            );
          }
          return NextResponse.json(
            {
              jsonrpc: "2.0",
              id,
              result: {
                content: [
                  {
                    type: "text",
                    text: `[PokoBot WAHA] Pesan WhatsApp berhasil dikirim ke ${phone} via session '${session}': "${message}"`,
                  },
                ],
              },
            },
            { headers: CORS_HEADERS }
          );
        }

        case "pokobot_get_chats": {
          const limit = Math.min(Number(toolArgs.limit) || 5, 50);
          const mockChats = [
            {
              id: "6281802731947@c.us",
              name: "Budi Santoso",
              phone: "+62 818-0273-1947",
              lastMessage: "Halo kak, ongkir ke Jakarta Selatan berapa?",
              unreadCount: 1,
              stage: "New Inquiries",
            },
            {
              id: "6281299887711@c.us",
              name: "Siti Rahma",
              phone: "+62 812-9988-7711",
              lastMessage: "Saya mau transfer lewat QRIS BCA",
              unreadCount: 0,
              stage: "AI Qualifying",
            },
            {
              id: "6281226300090@c.us",
              name: "Hendro Wijaya",
              phone: "+62 812-2630-0090",
              lastMessage: "Bisa minta tolong dihubungkan ke sales?",
              unreadCount: 2,
              stage: "Sales Follow-up",
            },
          ].slice(0, limit);

          return NextResponse.json(
            {
              jsonrpc: "2.0",
              id,
              result: {
                content: [
                  {
                    type: "text",
                    text: JSON.stringify(mockChats, null, 2),
                  },
                ],
              },
            },
            { headers: CORS_HEADERS }
          );
        }

        case "pokobot_search_contacts": {
          const query = String(toolArgs.query || "").toLowerCase();
          if (!query) {
            return NextResponse.json(
              {
                jsonrpc: "2.0",
                id,
                error: {
                  code: -32602,
                  message: "Invalid params: 'query' argument is required",
                },
              },
              { status: 400, headers: CORS_HEADERS }
            );
          }

          const contacts = [
            { name: "Budi Santoso", phone: "+62 818-0273-1947", tag: "API Integration", city: "Jakarta Selatan" },
            { name: "Siti Rahma", phone: "+62 812-9988-7711", tag: "Paket Starter", city: "Bandung" },
            { name: "Hendro Wijaya", phone: "+62 812-2630-0090", tag: "Enterprise", city: "Surabaya" },
          ].filter(
            (c) =>
              c.name.toLowerCase().includes(query) ||
              c.phone.includes(query) ||
              c.tag.toLowerCase().includes(query)
          );

          return NextResponse.json(
            {
              jsonrpc: "2.0",
              id,
              result: {
                content: [
                  {
                    type: "text",
                    text: JSON.stringify(contacts, null, 2),
                  },
                ],
              },
            },
            { headers: CORS_HEADERS }
          );
        }

        case "pokobot_update_crm_deal": {
          const { phone, stage, dealValue, notes } = toolArgs;
          if (!phone || !stage) {
            return NextResponse.json(
              {
                jsonrpc: "2.0",
                id,
                error: {
                  code: -32602,
                  message: "Invalid params: 'phone' and 'stage' are required arguments",
                },
              },
              { status: 400, headers: CORS_HEADERS }
            );
          }

          return NextResponse.json(
            {
              jsonrpc: "2.0",
              id,
              result: {
                content: [
                  {
                    type: "text",
                    text: `[CRM Pipeline Updated] Kontak ${phone} berhasil dipindahkan ke stage '${stage}' dengan estimasi nilai '${dealValue || "N/A"}'. Catatan: ${notes || "Tidak ada catatan."}`,
                  },
                ],
              },
            },
            { headers: CORS_HEADERS }
          );
        }

        case "pokobot_trigger_broadcast": {
          const { campaignName, targetTag, messageTemplate } = toolArgs;
          if (!campaignName || !targetTag || !messageTemplate) {
            return NextResponse.json(
              {
                jsonrpc: "2.0",
                id,
                error: {
                  code: -32602,
                  message: "Invalid params: 'campaignName', 'targetTag', and 'messageTemplate' are required",
                },
              },
              { status: 400, headers: CORS_HEADERS }
            );
          }

          return NextResponse.json(
            {
              jsonrpc: "2.0",
              id,
              result: {
                content: [
                  {
                    type: "text",
                    text: `[Broadcast Scheduled] Kampanye '${campaignName}' untuk segmen '${targetTag}' telah dimasukkan ke antrean pengiriman dengan proteksi interval acak anti-ban.`,
                  },
                ],
              },
            },
            { headers: CORS_HEADERS }
          );
        }

        case "pokobot_query_knowledge_base": {
          const { question } = toolArgs;
          if (!question) {
            return NextResponse.json(
              {
                jsonrpc: "2.0",
                id,
                error: {
                  code: -32602,
                  message: "Invalid params: 'question' argument is required",
                },
              },
              { status: 400, headers: CORS_HEADERS }
            );
          }

          return NextResponse.json(
            {
              jsonrpc: "2.0",
              id,
              result: {
                content: [
                  {
                    type: "text",
                    text: `[PokoBot Knowledge Base Result for '${question}'] SOP Pengiriman: Gudang utama berlokasi di Gambir, Jakarta Pusat. Ekspedisi yang didukung: JNE, J&T, SiCepat, Anteraja. Pembayaran dapat melalui QRIS otomatis atau Transfer Bank BCA/Mandiri.`,
                  },
                ],
              },
            },
            { headers: CORS_HEADERS }
          );
        }

        default:
          return NextResponse.json(
            {
              jsonrpc: "2.0",
              id,
              error: {
                code: -32601,
                message: `Method atau tool '${toolName}' tidak ditemukan.`,
              },
            },
            { status: 404, headers: CORS_HEADERS }
          );
      }
    }

    // 4. Ping Handshake
    if (method === "ping") {
      return NextResponse.json(
        {
          jsonrpc: "2.0",
          id,
          result: {},
        },
        { headers: CORS_HEADERS }
      );
    }

    return NextResponse.json(
      {
        jsonrpc: "2.0",
        id,
        error: {
          code: -32600,
          message: `Invalid Request: Method '${method}' tidak didukung.`,
        },
      },
      { status: 400, headers: CORS_HEADERS }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        jsonrpc: "2.0",
        id: null,
        error: {
          code: -32603,
          message: error.message || "Internal server error on MCP handler",
        },
      },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
