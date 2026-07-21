const STORAGE_KEY = "cle-lpc-progress-v1";

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
