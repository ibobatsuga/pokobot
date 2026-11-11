export interface ConnectedDeviceItem {
  session: string;
  label: string;
  phone: string;
  status: string;
}

const STORAGE_DEVICES_KEY = "pokobot_connected_devices";
const STORAGE_ACTIVE_SESSION_KEY = "pokobot_active_session";

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
  localStorage.setItem(STORAGE_DEVICES_KEY, JSON.stringify(devices));

  const active = localStorage.getItem(STORAGE_ACTIVE_SESSION_KEY);
  if (devices.length > 0 && (!active || !devices.some((d) => d.session === active))) {
    localStorage.setItem(STORAGE_ACTIVE_SESSION_KEY, devices[0].session);
  } else if (devices.length === 0) {
    localStorage.removeItem(STORAGE_ACTIVE_SESSION_KEY);
  }

  window.dispatchEvent(new Event("pokobot-waha-updated"));
}

export function getSavedConnectedDevices(): ConnectedDeviceItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_DEVICES_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getActiveSessionName(): string {
  if (typeof window === "undefined") return "default";
  return localStorage.getItem(STORAGE_ACTIVE_SESSION_KEY) || getSavedConnectedDevices()[0]?.session || "default";
}

export function setActiveSessionName(session: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_ACTIVE_SESSION_KEY, session);
  window.dispatchEvent(new Event("pokobot-waha-updated"));
}

export function getSavedConnectedDevice(): ConnectedDeviceItem | null {
  const devices = getSavedConnectedDevices();
  if (devices.length === 0) return null;
  const active = getActiveSessionName();
  return devices.find((d) => d.session === active) || devices[0];
}
