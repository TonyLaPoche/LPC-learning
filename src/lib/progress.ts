import type { PackId } from "@/data/packs";
import { loadPack } from "@/data/packs";

const LEGACY_KEY = "cle-lpc-progress-v1";
const ZOOM_KEY = "cle-lpc-face-zoom-v1";

function progressKey(pack: PackId): string {
  return `cle-lpc-progress-${pack}-v1`;
}

export type ProgressState = {
  xp: number;
  completed: string[];
  lastPlayedAt: string | null;
};

const DEFAULT: ProgressState = {
  xp: 0,
  completed: [],
  lastPlayedAt: null,
};

/** Zoom visage : 1 = sans zoom, défaut léger 1.16 */
export const FACE_ZOOM_MIN = 1;
export const FACE_ZOOM_MAX = 1.8;
export const FACE_ZOOM_DEFAULT = 1.16;

export function loadFaceZoom(): number {
  try {
    const raw = localStorage.getItem(ZOOM_KEY);
    if (raw == null) return FACE_ZOOM_DEFAULT;
    const n = Number(raw);
    if (!Number.isFinite(n)) return FACE_ZOOM_DEFAULT;
    return Math.min(FACE_ZOOM_MAX, Math.max(FACE_ZOOM_MIN, n));
  } catch {
    return FACE_ZOOM_DEFAULT;
  }
}

export function saveFaceZoom(zoom: number) {
  const clamped = Math.min(FACE_ZOOM_MAX, Math.max(FACE_ZOOM_MIN, zoom));
  localStorage.setItem(ZOOM_KEY, String(clamped));
}

function parseProgress(raw: string | null): ProgressState {
  if (!raw) return { ...DEFAULT };
  try {
    const parsed = JSON.parse(raw) as ProgressState;
    return {
      xp: parsed.xp ?? 0,
      completed: Array.isArray(parsed.completed) ? parsed.completed : [],
      lastPlayedAt: parsed.lastPlayedAt ?? null,
    };
  } catch {
    return { ...DEFAULT };
  }
}

function migrateLegacyToFr() {
  try {
    const frKey = progressKey("fr");
    if (localStorage.getItem(frKey)) return;
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      localStorage.setItem(frKey, legacy);
    }
  } catch {
    /* ignore */
  }
}

export function loadProgress(pack?: PackId): ProgressState {
  const id = pack ?? loadPack();
  if (id === "fr") migrateLegacyToFr();
  try {
    return parseProgress(localStorage.getItem(progressKey(id)));
  } catch {
    return { ...DEFAULT };
  }
}

export function saveProgress(state: ProgressState, pack?: PackId) {
  const id = pack ?? loadPack();
  localStorage.setItem(progressKey(id), JSON.stringify(state));
}

export function addXp(amount: number, pack?: PackId): ProgressState {
  const id = pack ?? loadPack();
  const next = loadProgress(id);
  next.xp += amount;
  next.lastPlayedAt = new Date().toISOString();
  saveProgress(next, id);
  return next;
}

export function markCompleted(
  lessonId: string,
  xp = 15,
  pack?: PackId,
): ProgressState {
  const id = pack ?? loadPack();
  const next = loadProgress(id);
  if (!next.completed.includes(lessonId)) {
    next.completed.push(lessonId);
    next.xp += xp;
  }
  next.lastPlayedAt = new Date().toISOString();
  saveProgress(next, id);
  return next;
}
