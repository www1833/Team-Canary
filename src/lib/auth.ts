import { getAdminHash, saveAdminHash, getAdminSession, saveAdminSession, clearAdminSession } from "./storage";

const DEFAULT_USERNAME = "admin";
const DEFAULT_PASSWORD = "change-me";
const SESSION_TIMEOUT = 1000 * 60 * 60 * 2; // 2 hours

async function sha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function ensureDefaultHash(): Promise<void> {
  const current = getAdminHash();
  if (!current) {
    const hash = await sha256(`${DEFAULT_USERNAME}:${DEFAULT_PASSWORD}`);
    saveAdminHash(hash);
  }
}

export async function login(username: string, password: string): Promise<boolean> {
  await ensureDefaultHash();
  const stored = getAdminHash();
  if (!stored) return false;
  const hash = await sha256(`${username}:${password}`);
  const success = stored === hash;
  if (success) {
    const session = JSON.stringify({ token: crypto.randomUUID(), expiresAt: Date.now() + SESSION_TIMEOUT });
    saveAdminSession(session);
  }
  return success;
}

export function isSessionActive(): boolean {
  const session = getAdminSession();
  if (!session) return false;
  try {
    const parsed = JSON.parse(session) as { token: string; expiresAt: number };
    if (Date.now() > parsed.expiresAt) {
      clearAdminSession();
      return false;
    }
    saveAdminSession(JSON.stringify({ ...parsed, expiresAt: Date.now() + SESSION_TIMEOUT }));
    return true;
  } catch (error) {
    console.error(error);
    clearAdminSession();
    return false;
  }
}

export async function changePassword(current: string, next: string): Promise<boolean> {
  await ensureDefaultHash();
  const stored = getAdminHash();
  if (!stored) return false;
  const currentHash = await sha256(`${DEFAULT_USERNAME}:${current}`);
  if (currentHash !== stored) {
    return false;
  }
  const nextHash = await sha256(`${DEFAULT_USERNAME}:${next}`);
  saveAdminHash(nextHash);
  return true;
}

export function logout(): void {
  clearAdminSession();
}

export const authInfo = {
  username: DEFAULT_USERNAME
};
