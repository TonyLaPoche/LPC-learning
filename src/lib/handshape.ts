import type { HandshapeId } from "@/data/lpc-fr";
import { fingerState, type FingerState } from "@/lib/handGeometry";
import type { NormalizedLandmark } from "@mediapipe/tasks-vision";

export type HandshapeGuess = {
  id: HandshapeId | null;
  confidence: number;
  fingers: FingerState;
};

function scoreMatch(f: FingerState, expected: FingerState): number {
  let ok = 0;
  const keys: (keyof FingerState)[] = [
    "thumb",
    "index",
    "middle",
    "ring",
    "pinky",
  ];
  for (const k of keys) {
    if (f[k] === expected[k]) ok += 1;
  }
  return ok / keys.length;
}

/** Signatures idéales des 8 configs LPC (approx MediaPipe). */
const SIGNATURES: Record<HandshapeId, FingerState> = {
  c1: { thumb: false, index: true, middle: true, ring: true, pinky: true },
  c2: { thumb: false, index: true, middle: false, ring: false, pinky: false },
  c3: { thumb: false, index: true, middle: true, ring: false, pinky: false },
  c4: { thumb: false, index: true, middle: true, ring: true, pinky: false },
  c5: { thumb: false, index: true, middle: true, ring: true, pinky: true },
  c6: { thumb: false, index: false, middle: false, ring: false, pinky: false },
  c7: { thumb: true, index: true, middle: false, ring: false, pinky: false },
  c8: { thumb: true, index: true, middle: true, ring: false, pinky: false },
};

/**
 * c1 vs c5 : joints vs écartés — MVP traite les deux comme « quatre doigts ».
 * On préfère c1 si les tips sont proches (doigts joints).
 */
function preferJoinedOrSpread(
  landmarks: NormalizedLandmark[],
  base: HandshapeId,
): HandshapeId {
  if (base !== "c1" && base !== "c5") return base;
  const i = landmarks[8];
  const m = landmarks[12];
  const r = landmarks[16];
  const p = landmarks[20];
  if (!i || !m || !r || !p) return base;
  const span =
    Math.hypot(i.x - p.x, i.y - p.y) /
    Math.max(1e-4, Math.hypot(landmarks[0]!.x - landmarks[9]!.x, landmarks[0]!.y - landmarks[9]!.y));
  return span < 0.55 ? "c1" : "c5";
}

export function classifyHandshape(
  landmarks: NormalizedLandmark[] | null,
): HandshapeGuess {
  if (!landmarks?.length) {
    return {
      id: null,
      confidence: 0,
      fingers: {
        thumb: false,
        index: false,
        middle: false,
        ring: false,
        pinky: false,
      },
    };
  }

  const fingers = fingerState(landmarks);
  let best: HandshapeId = "c6";
  let bestScore = -1;

  for (const id of Object.keys(SIGNATURES) as HandshapeId[]) {
    let s = scoreMatch(fingers, SIGNATURES[id]);
    // c1 et c5 partagent la même signature doigts ; départage plus bas
    if (id === "c1" || id === "c5") s -= 0.02;
    if (s > bestScore) {
      bestScore = s;
      best = id;
    }
  }

  best = preferJoinedOrSpread(landmarks, best);

  return {
    id: bestScore >= 0.6 ? best : null,
    confidence: bestScore,
    fingers,
  };
}
