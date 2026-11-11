export interface WahaConfig {
  url: string;
  apiKey: string;
  session: string;
}

export interface WahaSessionInfo {
  name: string;
  status: "STOPPED" | "STARTING" | "SCAN_QR_CODE" | "WORKING" | "FAILED" | string;
  me?: {
    id?: string;
    pushName?: string;
  } | null;
}

const STORAGE_URL_KEY = "pokobot_waha_url";
const STORAGE_KEY_KEY = "pokobot_waha_api_key";
const STORAGE_SESSION_KEY = "pokobot_waha_session";
const STORAGE_CONNECTED_DEVICE_KEY = "pokobot_connected_device";

export function isLocalhostUrl(url: string): boolean {
  return /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?/i.test(url.trim());
}

export function getSavedWahaConfig(): WahaConfig {
  if (typeof window === "undefined") {
    return { url: "", apiKey: "", session: "default" };
  }
  const url = localStorage.getItem(STORAGE_URL_KEY) || "";
  const apiKey = localStorage.getItem(STORAGE_KEY_KEY) || "";
  const session = localStorage.getItem(STORAGE_SESSION_KEY) || "default";
  return { url, apiKey, session };
}

export function saveWahaConfig(config: Partial<WahaConfig>) {
  if (typeof window === "undefined") return;
  if (config.url !== undefined) localStorage.setItem(STORAGE_URL_KEY, config.url.trim().replace(/\/+$/, ""));
  if (config.apiKey !== undefined) localStorage.setItem(STORAGE_KEY_KEY, config.apiKey.trim());
  if (config.session !== undefined) localStorage.setItem(STORAGE_SESSION_KEY, config.session.trim() || "default");
  window.dispatchEvent(new Event("pokobot-waha-updated"));
}

export function saveConnectedDevice(device: { phone: string; name: string; session: string } | null) {
  if (typeof window === "undefined") return;
  if (device) {
    localStorage.setItem(STORAGE_CONNECTED_DEVICE_KEY, JSON.stringify(device));
  } else {
    localStorage.removeItem(STORAGE_CONNECTED_DEVICE_KEY);
  }
  window.dispatchEvent(new Event("pokobot-waha-updated"));
}

export function getSavedConnectedDevice(): { phone: string; name: string; session: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_CONNECTED_DEVICE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function formatWhatsAppNumber(jid?: string | null): string {
  if (!jid) return "";
  const digits = jid.split("@")[0].replace(/[^0-9]/g, "");
  if (!digits) return jid;
  if (digits.startsWith("62") && digits.length >= 10) {
    return `+62 ${digits.slice(2, 5)}-${digits.slice(5, 9)}-${digits.slice(9)}`;
  }
  return `+${digits}`;
}

export function buildWahaHeaders(config?: WahaConfig): Record<string, string> {
  const cfg = config || getSavedWahaConfig();
  const headers: Record<string, string> = {};
  if (cfg.url) headers["X-Waha-Url"] = cfg.url;
  if (cfg.apiKey) headers["X-Waha-Api-Key"] = cfg.apiKey;
  return headers;
}
