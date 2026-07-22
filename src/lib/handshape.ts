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

/**
 * Signatures idéales des 8 configs LfPC (approx MediaPipe).
 * c2/c8 et c3/c6 partagent la même extension de doigts → heuristiques plus bas.
 */
const SIGNATURES: Record<HandshapeId, FingerState> = {
  c1: { thumb: false, index: true, middle: false, ring: false, pinky: false },
  c2: { thumb: false, index: true, middle: true, ring: false, pinky: false },
  c3: { thumb: true, index: true, middle: false, ring: false, pinky: false },
  c4: { thumb: false, index: true, middle: true, ring: true, pinky: true },
  c5: { thumb: true, index: true, middle: true, ring: true, pinky: true },
  c6: { thumb: true, index: true, middle: false, ring: false, pinky: false },
  c7: { thumb: false, index: true, middle: true, ring: true, pinky: false },
  c8: { thumb: false, index: true, middle: true, ring: false, pinky: false },
};

function palmScale(landmarks: NormalizedLandmark[]): number {
  return Math.max(
    1e-4,
    Math.hypot(
      landmarks[0]!.x - landmarks[9]!.x,
      landmarks[0]!.y - landmarks[9]!.y,
    ),
  );
}

/** c2 (jointif) vs c8 (V écarté). */
function preferVOrTogether(
  landmarks: NormalizedLandmark[],
  base: HandshapeId,
): HandshapeId {
  if (base !== "c2" && base !== "c8") return base;
  const i = landmarks[8];
  const m = landmarks[12];
  if (!i || !m) return base;
  const span = Math.hypot(i.x - m.x, i.y - m.y) / palmScale(landmarks);
  return span > 0.28 ? "c8" : "c2";
}

/** c3 (cercle pouce↔index) vs c6 (L). */
function preferCircleOrL(
  landmarks: NormalizedLandmark[],
  base: HandshapeId,
): HandshapeId {
  if (base !== "c3" && base !== "c6") return base;
  const thumbTip = landmarks[4];
  const indexTip = landmarks[8];
  if (!thumbTip || !indexTip) return base;
  const dist =
    Math.hypot(thumbTip.x - indexTip.x, thumbTip.y - indexTip.y) /
    palmScale(landmarks);
  return dist < 0.22 ? "c3" : "c6";
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
  let best: HandshapeId = "c5";
  let bestScore = -1;

  for (const id of Object.keys(SIGNATURES) as HandshapeId[]) {
    let s = scoreMatch(fingers, SIGNATURES[id]);
    // paires ambiguës : léger malus, départage heuristique ensuite
    if (id === "c2" || id === "c8" || id === "c3" || id === "c6") s -= 0.02;
    if (s > bestScore) {
      bestScore = s;
      best = id;
    }
  }

  best = preferVOrTogether(landmarks, best);
  best = preferCircleOrL(landmarks, best);

  return {
    id: bestScore >= 0.6 ? best : null,
    confidence: bestScore,
    fingers,
  };
}
