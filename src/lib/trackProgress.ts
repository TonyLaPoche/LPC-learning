/** Progression par parcours (local, sans compte). */

import type { LessonTrack } from "@/data/lpc-fr";
import {
  getPackContent,
  getPackHandshapes,
  getPackPositions,
  getPackSyllables,
  type PackId,
} from "@/data/packs";
import type { ProgressState } from "@/lib/progress";

const CURSOR_KEY = "cle-lpc-track-cursor-v1";
const INTRO_KEY = "cle-lpc-intro-seen-v1";

type CursorMap = Record<string, number>;

function cursorStorageKey(pack: PackId, track: string): string {
  return `${pack}:${track}`;
}

function loadCursorMap(): CursorMap {
  try {
    const raw = localStorage.getItem(CURSOR_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as CursorMap;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function loadTrackCursor(pack: PackId, track: LessonTrack): number {
  const n = loadCursorMap()[cursorStorageKey(pack, track)];
  return typeof n === "number" && n >= 0 ? Math.floor(n) : 0;
}

export function saveTrackCursor(
  pack: PackId,
  track: LessonTrack,
  index: number,
): void {
  try {
    const map = loadCursorMap();
    map[cursorStorageKey(pack, track)] = Math.max(0, Math.floor(index));
    localStorage.setItem(CURSOR_KEY, JSON.stringify(map));
  } catch {
    /* ignore */
  }
}

export function clearTrackCursor(pack: PackId, track: LessonTrack): void {
  try {
    const map = loadCursorMap();
    delete map[cursorStorageKey(pack, track)];
    localStorage.setItem(CURSOR_KEY, JSON.stringify(map));
  } catch {
    /* ignore */
  }
}

export function loadIntroSeen(): boolean {
  try {
    return localStorage.getItem(INTRO_KEY) === "1";
  } catch {
    return false;
  }
}

export function markIntroSeen(): void {
  try {
    localStorage.setItem(INTRO_KEY, "1");
  } catch {
    /* ignore */
  }
}

export type TrackStats = {
  done: number;
  total: number;
  /** Index suggéré pour reprendre (première étape non validée). */
  resumeIndex: number;
  status: "todo" | "progress" | "done";
};

function statsFromIds(ids: string[], completed: string[]): TrackStats {
  const total = ids.length;
  if (total === 0) {
    return { done: 0, total: 0, resumeIndex: 0, status: "todo" };
  }
  let done = 0;
  let resumeIndex = 0;
  let foundGap = false;
  ids.forEach((id, i) => {
    if (completed.includes(id)) {
      done += 1;
    } else if (!foundGap) {
      resumeIndex = i;
      foundGap = true;
    }
  });
  if (!foundGap) resumeIndex = Math.max(0, total - 1);
  const status =
    done >= total ? "done" : done > 0 || resumeIndex > 0 ? "progress" : "todo";
  return { done, total, resumeIndex, status };
}

/** IDs d’étapes d’un parcours (même logique que PracticeArena). */
export function trackStepIds(
  track: Exclude<LessonTrack, "free" | "custom">,
  pack: PackId,
): string[] {
  const { words, phrases } = getPackContent(pack);
  if (track === "shapes") {
    return getPackHandshapes(pack).map((h) => `shape-${h.id}`);
  }
  if (track === "positions") {
    return getPackPositions(pack).map((p) => `pos-${p.id}`);
  }
  if (track === "syllables") {
    return getPackSyllables(pack).map((s) => s.id);
  }
  if (track === "words") {
    const ids: string[] = [];
    for (const w of words) {
      w.keys.forEach((_, i) => ids.push(`${w.id}-learn-${i}`));
      if (w.keys.length >= 2) ids.push(`${w.id}-chain`);
    }
    return ids;
  }
  if (track === "phrases") {
    const ids: string[] = [];
    for (const p of phrases) {
      p.keys.forEach((_, i) => ids.push(`${p.id}-${i}`));
    }
    return ids;
  }
  if (track === "reps-syllables") {
    return getPackSyllables(pack).flatMap((s, i, arr) => {
      const guided = [0, 1, 2].map((r) => `reps-syl-${s.id}-g${r}`);
      if (i < 1) return guided;
      const prev = arr[i - 1]!;
      return [...guided, `reps-recall-${prev.id}`];
    });
  }
  if (track === "reps-words") {
    const slice = words.slice(0, 12);
    const ids: string[] = [];
    for (let i = 0; i < slice.length; i++) {
      const cur = slice[i]!;
      for (let r = 0; r < 3; r++) {
        cur.keys.forEach((_, ki) => ids.push(`reps-w-${cur.id}-g${r}-${ki}`));
      }
      if (i >= 1) {
        const prev = slice[i - 1]!;
        prev.keys.forEach((_, ki) => ids.push(`reps-recall-${prev.id}-${ki}`));
      }
    }
    return ids;
  }
  if (track === "reps-phrases") {
    const slice = phrases.slice(0, 10);
    const ids: string[] = [];
    for (let i = 0; i < slice.length; i++) {
      const cur = slice[i]!;
      for (let r = 0; r < 3; r++) {
        cur.keys.forEach((_, ki) => ids.push(`reps-p-${cur.id}-g${r}-${ki}`));
      }
      if (i >= 1) {
        const prev = slice[i - 1]!;
        prev.keys.forEach((_, ki) => ids.push(`reps-recall-${prev.id}-${ki}`));
      }
    }
    return ids;
  }
  return [];
}

export function getTrackStats(
  track: Exclude<LessonTrack, "free" | "custom">,
  pack: PackId,
  progress: ProgressState,
): TrackStats {
  const ids = trackStepIds(track, pack);
  const base = statsFromIds(ids, progress.completed);
  const cursor = loadTrackCursor(pack, track);
  // Reprendre au max(curseur, première non faite) si curseur cohérent
  const resumeIndex = Math.min(
    base.total > 0 ? base.total - 1 : 0,
    Math.max(base.resumeIndex, cursor > 0 && base.status !== "done" ? cursor : 0),
  );
  return { ...base, resumeIndex };
}
