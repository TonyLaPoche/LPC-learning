const STORAGE_KEY = "cle-lpc-progress-v1";
const ZOOM_KEY = "cle-lpc-face-zoom-v1";

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

export function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT };
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

export function saveProgress(state: ProgressState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function addXp(amount: number): ProgressState {
  const next = loadProgress();
  next.xp += amount;
  next.lastPlayedAt = new Date().toISOString();
  saveProgress(next);
  return next;
}

export function markCompleted(id: string, xp = 15): ProgressState {
  const next = loadProgress();
  if (!next.completed.includes(id)) {
    next.completed.push(id);
    next.xp += xp;
  }
  next.lastPlayedAt = new Date().toISOString();
  saveProgress(next);
  return next;
}
