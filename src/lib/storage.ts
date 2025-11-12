import { Member } from "@/types/member";
import { Photo } from "@/types/photo";
import { seedMembers, seedPhotos } from "@/data/seedMembers";

const MEMBER_KEY = "team.members.v1";
const PHOTO_KEY = "team.photos.v1";
const ADMIN_HASH_KEY = "team.admin.hash";
const ADMIN_SESSION_KEY = "team.admin.session";

const isBrowser = typeof window !== "undefined";

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.error("Failed to parse storage", error);
    return fallback;
  }
}

export function loadMembers(): Member[] {
  if (!isBrowser) return seedMembers;
  const data = safeParse<Member[]>(localStorage.getItem(MEMBER_KEY), []);
  if (data.length === 0) {
    localStorage.setItem(MEMBER_KEY, JSON.stringify(seedMembers));
    return seedMembers;
  }
  return data;
}

export function saveMembers(members: Member[]): void {
  if (!isBrowser) return;
  localStorage.setItem(MEMBER_KEY, JSON.stringify(members));
}

export function exportMembers(): string {
  return JSON.stringify(loadMembers(), null, 2);
}

export function importMembers(json: string): Member[] {
  const parsed = JSON.parse(json) as Member[];
  if (!Array.isArray(parsed)) {
    throw new Error("メンバーデータの形式が正しくありません。");
  }
  saveMembers(parsed);
  return parsed;
}

export function loadPhotos(): Photo[] {
  if (!isBrowser) return seedPhotos;
  const data = safeParse<Photo[]>(localStorage.getItem(PHOTO_KEY), []);
  if (data.length === 0) {
    localStorage.setItem(PHOTO_KEY, JSON.stringify(seedPhotos));
    return seedPhotos;
  }
  return data;
}

export function savePhotos(photos: Photo[]): void {
  if (!isBrowser) return;
  localStorage.setItem(PHOTO_KEY, JSON.stringify(photos));
}

export function exportPhotos(): string {
  return JSON.stringify(loadPhotos(), null, 2);
}

export function importPhotos(json: string): Photo[] {
  const parsed = JSON.parse(json) as Photo[];
  if (!Array.isArray(parsed)) {
    throw new Error("写真データの形式が正しくありません。");
  }
  savePhotos(parsed);
  return parsed;
}

export function getAdminHash(): string | null {
  if (!isBrowser) return null;
  return localStorage.getItem(ADMIN_HASH_KEY);
}

export function saveAdminHash(hash: string): void {
  if (!isBrowser) return;
  localStorage.setItem(ADMIN_HASH_KEY, hash);
}

export function getAdminSession(): string | null {
  if (!isBrowser) return null;
  return localStorage.getItem(ADMIN_SESSION_KEY);
}

export function saveAdminSession(token: string): void {
  if (!isBrowser) return;
  localStorage.setItem(ADMIN_SESSION_KEY, token);
}

export function clearAdminSession(): void {
  if (!isBrowser) return;
  localStorage.removeItem(ADMIN_SESSION_KEY);
}
