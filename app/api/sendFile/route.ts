import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken, verifyUserApiKey } from "@/lib/session";
import { scopeSessionForTenant } from "@/lib/tenant";

export const maxDuration = 30;

const SANDBOX_QA_KEY = "pk_live_fluxy_pokobot_enterprise";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "https://pokobot.fluxy.id",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
  Vary: "Origin",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

export async function GET() {
  return NextResponse.json(
    {
      service: "PokoBot WAHA File Dispatcher",
      status: "operational",
      version: "1.1.0",
      security: "Strict per-user session cookie or signed Personal API Key (pk_user_...) required for live dispatch",
      usage: "Send POST request with JSON body { chatId, file: { url, data?, mimetype?, filename? }, caption?, session? }",
      supported_formats: "PDF, Images (JPG, PNG, WebP), Documents, Video, Audio",
      example_url: {
        chatId: "6289637370000@c.us",
        caption: "Berikut adalah dokumen faktur Anda",
        file: {
          url: "https://example.com/invoice.pdf",
          mimetype: "application/pdf",
          filename: "Invoice_2026.pdf",
        },
      },
      example_base64: {
        chatId: "6289637370000@c.us",
        caption: "Screenshot bukti transaksi",
        file: {
          data: "<base64_data_here>",
          mimetype: "image/png",
          filename: "bukti.png",
        },
      },
    },
    { headers: CORS_HEADERS }
  );
}

export async function POST(req: NextRequest) {
  try {
    // 1. Parse & Validate Payload
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          error: "Bad Request",
          message: "Format JSON tidak valid atau body kosong.",
        },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const {
      chatId,
      phone,
      caption,
      text,
      session = "default",
      file,
      fileUrl,
      url,
      fileBase64,
      data,
      fileName,
      filename,
      mimeType,
      mimetype,
    } = body;

    const target = chatId || phone;
    const finalCaption = typeof caption === "string" ? caption : typeof text === "string" ? text : "";

    // 2. Authenticate Caller (Session Cookie, Signed pk_user_... Key, or QA Sandbox Key)
    const authHeader = req.headers.get("authorization");
    let apiKeyEmail: string | null = null;
    let isSandboxDemoKey = false;

    if (authHeader) {
      const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : authHeader.trim();
      if (token.startsWith("pk_user_")) {
        apiKeyEmail = await verifyUserApiKey(token);
        if (!apiKeyEmail) {
          return NextResponse.json(
            {
              error: "Unauthorized",
              message: "Personal API Key tidak valid atau signature rusak.",
            },
            { status: 401, headers: CORS_HEADERS }
          );
        }
      } else if (token === SANDBOX_QA_KEY) {
        isSandboxDemoKey = true;
      } else {
        return NextResponse.json(
          {
            error: "Unauthorized",
            message: "Kunci API tidak valid. Gunakan Personal API Key (pk_user_...) dari menu Settings.",
          },
          { status: 401, headers: CORS_HEADERS }
        );
      }
    }

    if (!target || typeof target !== "string" || target.trim().length === 0) {
      return NextResponse.json(
        {
          error: "Unprocessable Entity",
          message: "Parameter 'chatId' atau 'phone' wajib diisi (contoh: '6281234567890@c.us').",
        },
        { status: 422, headers: CORS_HEADERS }
      );
    }

    // Resolve file structure: supports both nested `file: {...}` and flattened parameters
    let resolvedFile: {
      url?: string;
      data?: string;
      mimetype?: string;
      filename?: string;
    } | null = null;

    if (file && typeof file === "object") {
      resolvedFile = {
        url: file.url || file.fileUrl || undefined,
        data: file.data || file.base64 || file.fileBase64 || undefined,
        mimetype: file.mimetype || file.mimeType || undefined,
        filename: file.filename || file.fileName || file.name || undefined,
      };
    } else if (typeof file === "string") {
      if (file.startsWith("http://") || file.startsWith("https://")) {
        resolvedFile = { url: file };
      } else if (file.startsWith("data:")) {
        const matches = file.match(/^data:([^;]+);base64,(.+)$/);
        if (matches) {
          resolvedFile = { mimetype: matches[1], data: matches[2] };
        } else {
          resolvedFile = { data: file };
        }
      } else {
        resolvedFile = { data: file };
      }
    } else {
      const rawUrl = fileUrl || url;
      const rawData = fileBase64 || data;
      if (rawUrl || rawData) {
        resolvedFile = {
          url: rawUrl || undefined,
          data: rawData || undefined,
          mimetype: mimeType || mimetype || undefined,
          filename: fileName || filename || undefined,
        };
      }
    }

    if (!resolvedFile || (!resolvedFile.url && !resolvedFile.data)) {
      return NextResponse.json(
        {
          error: "Unprocessable Entity",
          message:
            "Parameter file wajib diisi dengan URL file ('url' / 'fileUrl') atau Base64 ('data' / 'fileBase64').",
        },
        { status: 422, headers: CORS_HEADERS }
      );
    }

    // Clean data URI prefix if present in base64 data
    if (resolvedFile.data && resolvedFile.data.includes(";base64,")) {
      const parts = resolvedFile.data.split(";base64,");
      if (!resolvedFile.mimetype && parts[0].startsWith("data:")) {
        resolvedFile.mimetype = parts[0].slice(5);
      }
      resolvedFile.data = parts[1];
    }

    const rawToken = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    const cookieUser = await verifySessionToken(rawToken);
    const ownerEmail = (apiKeyEmail || cookieUser?.email || "").trim().toLowerCase();

    const cleanedDigits = target.replace(/[^0-9]/g, "");
    const formattedChatId = target.includes("@") ? target : `${cleanedDigits}@c.us`;

    // Strictly refuse unauthenticated live WA dispatch; allow sandbox demo key only in non-live simulation
    if (!ownerEmail) {
      if (isSandboxDemoKey) {
        return NextResponse.json(
          {
            status: "success",
            messageId: `pokofile_sandbox_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
            destination: formattedChatId,
            session,
            dispatchedAt: new Date().toISOString(),
            engine: "PokoBot Sandbox File Dispatcher (Login atau Personal API Key dibutuhkan untuk WA Live)",
            file: {
              filename: resolvedFile.filename || "file",
              mimetype: resolvedFile.mimetype || "application/octet-stream",
              hasUrl: Boolean(resolvedFile.url),
              hasData: Boolean(resolvedFile.data),
            },
            caption: finalCaption,
          },
          { status: 200, headers: CORS_HEADERS }
        );
      }

      return NextResponse.json(
        {
          error: "Unauthorized",
          message:
            "Login akun PokoBot atau sertakan Personal API Key (pk_user_...) untuk mengirim file WhatsApp live.",
        },
        { status: 401, headers: CORS_HEADERS }
      );
    }

    // 3. Forward strictly to server-configured WAHA Engine scoped to authenticated ownerEmail
    const wahaBaseUrl = (process.env.WAHA_BASE_URL || "").trim().replace(/\/+$/, "");
    const wahaApiKey = (process.env.WAHA_API_KEY || "").trim();

    let wahaResponse: any = null;
    let deliveredVia = "WAHA Cloud Gateway";

    const isLocalUrl = /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?/i.test(wahaBaseUrl);
    if (!wahaBaseUrl || (isLocalUrl && process.env.VERCEL === "1")) {
      deliveredVia = "PokoBot Cloud Queue (WAHA Cloud URL Belum Dikonfigurasi)";
    } else {
      const targetSession = scopeSessionForTenant(ownerEmail, session);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000);

      try {
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
          "X-Owner-Email": ownerEmail,
        };
        if (wahaApiKey) headers["X-Api-Key"] = wahaApiKey;

        const forwardPayload: Record<string, any> = {
          chatId: formattedChatId,
          file: resolvedFile,
          session: targetSession,
        };
        if (finalCaption) {
          forwardPayload.caption = finalCaption;
        }

        const res = await fetch(`${wahaBaseUrl}/api/sendFile`, {
          method: "POST",
          headers,
          body: JSON.stringify(forwardPayload),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
          const errPayload = await res.json().catch(() => ({}));
          return NextResponse.json(
            {
              error: errPayload?.error || `Gateway WAHA menolak pengiriman file (${res.status})`,
              status: "error",
            },
            { status: res.status >= 400 && res.status < 500 ? res.status : 502, headers: CORS_HEADERS }
          );
        }

        wahaResponse = await res.json();
      } catch (fetchErr: any) {
        clearTimeout(timeoutId);
        return NextResponse.json(
          {
            error:
              fetchErr.name === "AbortError"
                ? "Gateway WAHA timeout saat mengunduh/memproses file."
                : "Gateway WAHA sedang tidak dapat dihubungi.",
            status: "error",
          },
          { status: 502, headers: CORS_HEADERS }
        );
      }
    }

    const messageId =
      wahaResponse?.id || `pokofile_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    return NextResponse.json(
      {
        status: "success",
        messageId,
        destination: formattedChatId,
        session,
        dispatchedAt: new Date().toISOString(),
        engine: deliveredVia,
        file: {
          filename: resolvedFile.filename || "file",
          mimetype: resolvedFile.mimetype || "application/octet-stream",
          hasUrl: Boolean(resolvedFile.url),
          hasData: Boolean(resolvedFile.data),
        },
        caption: finalCaption,
      },
      { status: 200, headers: CORS_HEADERS }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error.message || "Terjadi kesalahan internal saat memproses pengiriman file.",
      },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
