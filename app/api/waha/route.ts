import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Waha-Url, X-Waha-Api-Key",
};

function resolveWahaConfig(req: NextRequest, body?: any) {
  const headerUrl = req.headers.get("x-waha-url") || req.nextUrl.searchParams.get("wahaUrl") || body?.wahaUrl;
  const headerKey = req.headers.get("x-waha-api-key") || req.nextUrl.searchParams.get("wahaApiKey") || body?.wahaApiKey;

  const rawUrl = (headerUrl || process.env.WAHA_BASE_URL || "").trim().replace(/\/+$/, "");
  const apiKey = (headerKey || process.env.WAHA_API_KEY || "").trim();

  const isLocalUrl = /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?/i.test(rawUrl);
  const isCloudEnv = process.env.VERCEL === "1" || process.env.NODE_ENV === "production";

  if (!rawUrl) {
    return {
      configured: false,
      error: "Layanan WhatsApp Cloud sedang disiapkan oleh administrator.",
      code: "WAHA_NOT_CONFIGURED",
      wahaUrl: "",
      apiKey: "",
    };
  }

  if (isLocalUrl && isCloudEnv) {
    return {
      configured: false,
      error: "Backend WAHA tidak boleh menggunakan localhost pada server Cloud.",
      code: "WAHA_LOCALHOST_BLOCKED",
      wahaUrl: "",
      apiKey: "",
    };
  }

  return {
    configured: true,
    wahaUrl: rawUrl,
    apiKey,
    error: null,
    code: null,
  };
}

function buildWahaHeaders(apiKey: string, extra: Record<string, string> = {}) {
  const headers: Record<string, string> = {
    Accept: "application/json, image/png, */*",
    ...extra,
  };
  if (apiKey) {
    headers["X-Api-Key"] = apiKey;
  }
  return headers;
}

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 10000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal, cache: "no-store" });
  } finally {
    clearTimeout(id);
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(req: NextRequest) {
  const action = req.nextUrl.searchParams.get("action") || "sessions";
  const session = req.nextUrl.searchParams.get("session") || "default";
  const label = req.nextUrl.searchParams.get("label") || session;

  const config = resolveWahaConfig(req);
  if (!config.configured) {
    return NextResponse.json(
      {
        configured: false,
        code: config.code,
        error: config.error,
        sessions: [],
      },
      { status: 200, headers: CORS_HEADERS }
    );
  }

  const { wahaUrl, apiKey } = config;
  const headers = buildWahaHeaders(apiKey);

  try {
    // 1. LIST ALL SESSIONS (Multi-WhatsApp)
    if (action === "sessions") {
      const res = await fetchWithTimeout(`${wahaUrl}/api/sessions?all=true`, { headers });
      if (!res.ok) {
        const errText = await res.text();
        return NextResponse.json(
          {
            configured: true,
            connected: false,
            error: `Gateway merespons ${res.status}: ${errText.slice(0, 150)}`,
            sessions: [],
          },
          { status: 200, headers: CORS_HEADERS }
        );
      }

      const data = await res.json();
      const sessions = Array.isArray(data) ? data : [];
      return NextResponse.json(
        {
          configured: true,
          connected: true,
          sessions,
        },
        { headers: CORS_HEADERS }
      );
    }

    // 2. FETCH LIVE QR CODE FOR SPECIFIC SESSION + LABEL
    if (action === "qr") {
      let sessionStatus = "STOPPED";
      let sessionInfo: any = null;

      const infoRes = await fetchWithTimeout(
        `${wahaUrl}/api/sessions/${encodeURIComponent(session)}`,
        { headers }
      );

      if (infoRes.ok) {
        sessionInfo = await infoRes.json();
        sessionStatus = sessionInfo?.status || "STOPPED";
      } else if (infoRes.status === 404) {
        const origin = req.nextUrl.origin;
        const createRes = await fetchWithTimeout(`${wahaUrl}/api/sessions`, {
          method: "POST",
          headers: buildWahaHeaders(apiKey, { "Content-Type": "application/json" }),
          body: JSON.stringify({
            name: session,
            label,
            start: true,
            config: {
              webhooks: [
                {
                  url: `${origin}/api/webhook`,
                  events: ["message", "session.status"],
                },
              ],
            },
          }),
        });
        if (createRes.ok) {
          sessionInfo = await createRes.json();
          sessionStatus = sessionInfo?.status || "STARTING";
        }
      }

      if (sessionStatus === "STOPPED" || sessionStatus === "FAILED") {
        await fetchWithTimeout(`${wahaUrl}/api/sessions/${encodeURIComponent(session)}/start`, {
          method: "POST",
          headers,
        });
        sessionStatus = "STARTING";
      }

      if (sessionStatus === "WORKING") {
        return NextResponse.json(
          {
            configured: true,
            connected: true,
            session,
            label: sessionInfo?.label || label,
            status: "WORKING",
            me: sessionInfo?.me || null,
            qrImageDataUrl: null,
          },
          { headers: CORS_HEADERS }
        );
      }

      const qrRes = await fetchWithTimeout(
        `${wahaUrl}/api/${encodeURIComponent(session)}/auth/qr?format=image`,
        { headers }
      );

      if (qrRes.ok) {
        const contentType = qrRes.headers.get("content-type") || "";
        if (contentType.includes("image/")) {
          const arrayBuffer = await qrRes.arrayBuffer();
          const base64 = Buffer.from(arrayBuffer).toString("base64");
          return NextResponse.json(
            {
              configured: true,
              connected: true,
              session,
              label,
              status: "SCAN_QR_CODE",
              qrImageDataUrl: `data:${contentType};base64,${base64}`,
            },
            { headers: CORS_HEADERS }
          );
        }

        const qrJson = await qrRes.json();
        const rawValue = qrJson?.value || qrJson?.qr || qrJson?.data;
        if (rawValue && typeof rawValue === "string") {
          const qrImageDataUrl = rawValue.startsWith("data:image/")
            ? rawValue
            : await QRCode.toDataURL(rawValue, {
                width: 320,
                margin: 2,
                color: { dark: "#171717", light: "#FFFFFF" },
              });
          return NextResponse.json(
            {
              configured: true,
              connected: true,
              session,
              label,
              status: "SCAN_QR_CODE",
              qrImageDataUrl,
            },
            { headers: CORS_HEADERS }
          );
        }
      }

      return NextResponse.json(
        {
          configured: true,
          connected: true,
          session,
          label,
          status: sessionStatus || "STARTING",
          qrImageDataUrl: null,
          message: "Menyiapkan QR Code WhatsApp...",
        },
        { headers: CORS_HEADERS }
      );
    }

    return NextResponse.json({ error: "Action tidak dikenal" }, { status: 400, headers: CORS_HEADERS });
  } catch (error: any) {
    return NextResponse.json(
      {
        configured: true,
        connected: false,
        error: `Koneksi ke gateway WhatsApp tertunda: ${error.name === "AbortError" ? "Timeout" : error.message}`,
        sessions: [],
      },
      { status: 200, headers: CORS_HEADERS }
    );
  }
}

export async function POST(req: NextRequest) {
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400, headers: CORS_HEADERS });
  }

  const { action = "start", session = "default", label = "" } = body;
  const config = resolveWahaConfig(req, body);

  if (!config.configured) {
    return NextResponse.json(
      {
        ok: false,
        configured: false,
        code: config.code,
        error: config.error,
      },
      { status: 200, headers: CORS_HEADERS }
    );
  }

  const { wahaUrl, apiKey } = config;
  const headers = buildWahaHeaders(apiKey, { "Content-Type": "application/json" });

  try {
    if (action === "test") {
      const start = Date.now();
      const res = await fetchWithTimeout(`${wahaUrl}/api/version`, { headers: buildWahaHeaders(apiKey) });
      const latencyMs = Date.now() - start;
      if (!res.ok) {
        return NextResponse.json({ ok: false, error: `Gateway status ${res.status}` }, { status: 200, headers: CORS_HEADERS });
      }
      const versionData = await res.json().catch(() => ({}));
      return NextResponse.json({ ok: true, latencyMs, version: versionData?.version || "Active" }, { headers: CORS_HEADERS });
    }

    if (action === "start") {
      const origin = req.nextUrl.origin;
      const createRes = await fetchWithTimeout(`${wahaUrl}/api/sessions`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: session,
          label: label || session,
          start: true,
          config: {
            webhooks: [
              {
                url: `${origin}/api/webhook`,
                events: ["message", "session.status"],
              },
            ],
          },
        }),
      });

      if (createRes.status === 422 || createRes.status === 409) {
        const startRes = await fetchWithTimeout(`${wahaUrl}/api/sessions/${encodeURIComponent(session)}/start`, {
          method: "POST",
          headers: buildWahaHeaders(apiKey),
        });
        const data = await startRes.json().catch(() => ({}));
        return NextResponse.json({ ok: startRes.ok, session: data }, { headers: CORS_HEADERS });
      }

      const data = await createRes.json().catch(() => ({}));
      return NextResponse.json({ ok: createRes.ok, session: data }, { headers: CORS_HEADERS });
    }

    if (action === "logout" || action === "stop" || action === "delete") {
      await fetchWithTimeout(`${wahaUrl}/api/sessions/${encodeURIComponent(session)}/logout`, {
        method: "POST",
        headers: buildWahaHeaders(apiKey),
      }).catch(() => {});
      await fetchWithTimeout(`${wahaUrl}/api/sessions/${encodeURIComponent(session)}`, {
        method: "DELETE",
        headers: buildWahaHeaders(apiKey),
      }).catch(() => {});
      return NextResponse.json({ ok: true, status: "STOPPED" }, { headers: CORS_HEADERS });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400, headers: CORS_HEADERS });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error.message || "Gagal memproses aksi WhatsApp" },
      { status: 200, headers: CORS_HEADERS }
    );
  }
}
