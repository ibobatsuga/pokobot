import crypto from "crypto";

export function getTenantPrefix(email: string): string {
  const normalized = email.trim().toLowerCase();
  const hash = crypto.createHash("sha256").update(normalized).digest("hex").slice(0, 12);
  return `t_${hash}_`;
}

export function scopeSessionForTenant(email: string, session: string): string {
  const prefix = getTenantPrefix(email);
  const cleaned = (session || "default")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  if (cleaned.startsWith(prefix)) return cleaned.slice(0, 64);
  return `${prefix}${cleaned || "default"}`.slice(0, 64);
}

export function unscopeSessionForTenant(email: string, scoped: string): string {
  const prefix = getTenantPrefix(email);
  return scoped.startsWith(prefix) ? scoped.slice(prefix.length) : scoped;
}
