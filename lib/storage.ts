// =============================================
// localStorage ユーティリティ
// =============================================

import { Site, UserSettings } from "./types";

export const MAX_PHOTOS = 20; // 1現場あたりの写真上限

const KEY = {
  SITES: "gm_sites",
  SETTINGS: "gm_settings",
  INIT: "gm_initialized",
} as const;

// ── 初期化 ────────────────────────────────────
export const isInitialized = () =>
  localStorage.getItem(KEY.INIT) === "true";
export const markInitialized = () =>
  localStorage.setItem(KEY.INIT, "true");

// ── 設定 ──────────────────────────────────────
export function getSettings(): UserSettings {
  const raw = localStorage.getItem(KEY.SETTINGS);
  if (!raw) return { companyName: "", staffName: "", phone: "", logoBase64: "" };
  return JSON.parse(raw);
}
export const saveSettings = (s: UserSettings) =>
  localStorage.setItem(KEY.SETTINGS, JSON.stringify(s));

// ── 現場 ──────────────────────────────────────
export function getSites(): Site[] {
  const raw = localStorage.getItem(KEY.SITES);
  if (!raw) return [];
  return (JSON.parse(raw) as Site[]).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}
export function getSiteById(id: string): Site | null {
  return getSites().find((s) => s.id === id) ?? null;
}
export function saveSite(site: Site) {
  const list = getSites().filter((s) => s.id !== site.id);
  list.unshift(site);
  localStorage.setItem(KEY.SITES, JSON.stringify(list));
}
export function deleteSite(id: string) {
  localStorage.setItem(
    KEY.SITES,
    JSON.stringify(getSites().filter((s) => s.id !== id))
  );
}

// ── ユーティリティ ────────────────────────────
export const uid = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
export const today = () => new Date().toISOString().split("T")[0];
