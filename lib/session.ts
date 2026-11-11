export const SESSION_COOKIE_NAME = "pokobot_session";
export const ACCOUNT_COOKIE_NAME = "pokobot_account";
export const OAUTH_STATE_COOKIE_NAME = "pokobot_oauth_state";
export const USER_API_KEY_PREFIX = "pk_user_";

export interface AuthUser {
  email: string;
  name: string;
  avatar?: string;
  provider: "google" | "email";
}

interface SignedSessionPayload extends AuthUser {
  exp: number;
}

interface SignedUserApiKeyPayload {
  typ: "user_api_key";
  email: string;
  iat: number;
}

export interface StoredAccountPayload {
  email: string;
  name: string;
  passwordHash: string;
  createdAt: string;
}

function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET || process.env.WAHA_API_KEY;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("AUTH_SECRET is required in production");
    }
    return "pokobot-fluxy-dev-only-secret";
  }
  return secret;
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(str: string): Uint8Array {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (str.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function importHmacKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(getAuthSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function signPayload<T extends object>(payload: T): Promise<string> {
  const enc = new TextEncoder();
  const dataB64 = toBase64Url(enc.encode(JSON.stringify(payload)));
  const key = await importHmacKey();
  const sigBuffer = await crypto.subtle.sign("HMAC", key, enc.encode(dataB64));
  const sigB64 = toBase64Url(new Uint8Array(sigBuffer));
  return `${dataB64}.${sigB64}`;
}

export async function verifyPayload<T>(token?: string | null): Promise<T | null> {
  if (!token || !token.includes(".")) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [dataB64, sigB64] = parts;
  if (!dataB64 || !sigB64) return null;

  try {
    const enc = new TextEncoder();
    const key = await importHmacKey();
    const sigBytes = fromBase64Url(sigB64);
    const sigCopy = new Uint8Array(sigBytes.length);
    sigCopy.set(sigBytes);
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigCopy,
      enc.encode(dataB64)
    );
    if (!valid) return null;

    const jsonStr = new TextDecoder().decode(fromBase64Url(dataB64));
    return JSON.parse(jsonStr) as T;
  } catch {
    return null;
  }
}

export async function createSessionToken(user: AuthUser, ttlSeconds = 60 * 60 * 24 * 7): Promise<string> {
  const payload: SignedSessionPayload = {
    email: user.email,
    name: user.name,
    avatar: user.avatar,
    provider: user.provider,
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
  };
  return signPayload(payload);
}

export async function verifySessionToken(token?: string | null): Promise<AuthUser | null> {
  const payload = await verifyPayload<SignedSessionPayload>(token);
  if (!payload || !payload.email || !payload.exp) return null;
  if (payload.exp < Math.floor(Date.now() / 1000)) return null;
  return {
    email: payload.email.toLowerCase(),
    name: payload.name,
    avatar: payload.avatar,
    provider: payload.provider,
  };
}

export async function createUserApiKey(email: string): Promise<string> {
  const payload: SignedUserApiKeyPayload = {
    typ: "user_api_key",
    email: email.trim().toLowerCase(),
    iat: Math.floor(Date.now() / 1000),
  };
  const signed = await signPayload(payload);
  return `${USER_API_KEY_PREFIX}${signed}`;
}

export async function verifyUserApiKey(authHeader?: string | null): Promise<string | null> {
  if (!authHeader) return null;
  const raw = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : authHeader.trim();
  if (!raw.startsWith(USER_API_KEY_PREFIX)) return null;
  const token = raw.slice(USER_API_KEY_PREFIX.length);
  const payload = await verifyPayload<SignedUserApiKeyPayload>(token);
  if (!payload || payload.typ !== "user_api_key" || !payload.email) return null;
  return payload.email.trim().toLowerCase();
}
