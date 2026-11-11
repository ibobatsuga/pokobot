export interface ConnectedDeviceItem {
  session: string;
  label: string;
  phone: string;
  status: string;
}

const BASE_DEVICES_KEY = "pokobot_connected_devices";
const BASE_ACTIVE_SESSION_KEY = "pokobot_active_session";
const LEGACY_STORAGE_KEYS = [BASE_DEVICES_KEY, BASE_ACTIVE_SESSION_KEY];

let currentTenantKey = "anon";

function getDevicesStorageKey(): string {
  return `${BASE_DEVICES_KEY}:${currentTenantKey}`;
}

function getActiveStorageKey(): string {
  return `${BASE_ACTIVE_SESSION_KEY}:${currentTenantKey}`;
}

export function setActiveTenantEmail(email?: string | null) {
  const normalized = (email || "").trim().toLowerCase();
  currentTenantKey = normalized || "anon";
  if (typeof window !== "undefined") {
    // Clean up old unscoped global keys from before multi-tenant isolation
    for (const key of LEGACY_STORAGE_KEYS) {
      localStorage.removeItem(key);
    }
    window.dispatchEvent(new Event("pokobot-waha-updated"));
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

export function slugifySessionName(label: string): string {
  const base = label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 24);
  const suffix = Math.random().toString(36).slice(2, 6);
  return base ? `${base}-${suffix}` : `wa-${Date.now().toString(36)}`;
}

export function saveConnectedDevices(devices: ConnectedDeviceItem[]) {
  if (typeof window === "undefined") return;
  const devKey = getDevicesStorageKey();
  const actKey = getActiveStorageKey();

  localStorage.setItem(devKey, JSON.stringify(devices));

  const active = localStorage.getItem(actKey);
  if (devices.length > 0 && (!active || !devices.some((d) => d.session === active))) {
    localStorage.setItem(actKey, devices[0].session);
  } else if (devices.length === 0) {
    localStorage.removeItem(actKey);
  }

  window.dispatchEvent(new Event("pokobot-waha-updated"));
}

export function getSavedConnectedDevices(): ConnectedDeviceItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(getDevicesStorageKey());
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getActiveSessionName(): string {
  if (typeof window === "undefined") return "default";
  return localStorage.getItem(getActiveStorageKey()) || getSavedConnectedDevices()[0]?.session || "default";
}

export function setActiveSessionName(session: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(getActiveStorageKey(), session);
  window.dispatchEvent(new Event("pokobot-waha-updated"));
}

export function getSavedConnectedDevice(): ConnectedDeviceItem | null {
  const devices = getSavedConnectedDevices();
  if (devices.length === 0) return null;
  const active = getActiveSessionName();
  return devices.find((d) => d.session === active) || devices[0];
}
