import type { NormalizedLandmark } from "@mediapipe/tasks-vision";

export type Point = { x: number; y: number };

export const HAND_CONNECTIONS: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [0, 5],
  [5, 6],
  [6, 7],
  [7, 8],
  [0, 9],
  [9, 10],
  [10, 11],
  [11, 12],
  [0, 13],
  [13, 14],
  [14, 15],
  [15, 16],
  [0, 17],
  [17, 18],
  [18, 19],
  [19, 20],
  [5, 9],
  [9, 13],
  [13, 17],
];

export function palmCenter(landmarks: NormalizedLandmark[]): Point {
  const wrist = landmarks[0];
  const middle = landmarks[9];
  if (!wrist || !middle) return { x: 0.5, y: 0.5 };
  return { x: (wrist.x + middle.x) / 2, y: (wrist.y + middle.y) / 2 };
}

/** Bouts de doigts MediaPipe (pouce → auriculaire). */
const FINGER_TIPS = [4, 8, 12, 16, 20] as const;

/**
 * Pointeur LPC : bout du doigt le plus haut à l’écran (y min).
 * Préfère les doigts étendus ; sinon tous les tips.
 */
export function highestFingerTip(landmarks: NormalizedLandmark[]): Point {
  const state = fingerState(landmarks);
  const extendedFlags = [
    state.thumb,
    state.index,
    state.middle,
    state.ring,
    state.pinky,
  ];
  const anyExtended = extendedFlags.some(Boolean);

  let best: Point | null = null;
  let bestY = Infinity;

  for (let i = 0; i < FINGER_TIPS.length; i++) {
    if (anyExtended && !extendedFlags[i]) continue;
    const tip = landmarks[FINGER_TIPS[i]!];
    if (!tip) continue;
    if (tip.y < bestY) {
      bestY = tip.y;
      best = { x: tip.x, y: tip.y };
    }
  }

  if (best) return best;

  // Fallback : tip du majeur, sinon centre paume
  const mid = landmarks[12];
  if (mid) return { x: mid.x, y: mid.y };
  return palmCenter(landmarks);
}

export function dist(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** Doigt étendu si tip plus loin du poignet que le PIP (approx). */
export function isFingerExtended(
  landmarks: NormalizedLandmark[],
  tipIdx: number,
  pipIdx: number,
  mcpIdx: number,
): boolean {
  const tip = landmarks[tipIdx];
  const pip = landmarks[pipIdx];
  const mcp = landmarks[mcpIdx];
  const wrist = landmarks[0];
  if (!tip || !pip || !mcp || !wrist) return false;
  const tipDist = dist({ x: tip.x, y: tip.y }, { x: wrist.x, y: wrist.y });
  const pipDist = dist({ x: pip.x, y: pip.y }, { x: wrist.x, y: wrist.y });
  // Aussi : tip plus « haut » que pip selon axe doigt
  const tipFromMcp = dist({ x: tip.x, y: tip.y }, { x: mcp.x, y: mcp.y });
  const pipFromMcp = dist({ x: pip.x, y: pip.y }, { x: mcp.x, y: mcp.y });
  return tipDist > pipDist * 1.05 && tipFromMcp > pipFromMcp * 1.1;
}

export function isThumbExtended(landmarks: NormalizedLandmark[]): boolean {
  const tip = landmarks[4];
  const ip = landmarks[3];
  const mcp = landmarks[2];
  const wrist = landmarks[0];
  const indexMcp = landmarks[5];
  if (!tip || !ip || !mcp || !wrist || !indexMcp) return false;
  const tipToIndex = dist(
    { x: tip.x, y: tip.y },
    { x: indexMcp.x, y: indexMcp.y },
  );
  const mcpToIndex = dist(
    { x: mcp.x, y: mcp.y },
    { x: indexMcp.x, y: indexMcp.y },
  );
  return tipToIndex > mcpToIndex * 1.15;
}

export type FingerState = {
  thumb: boolean;
  index: boolean;
  middle: boolean;
  ring: boolean;
  pinky: boolean;
};

export function fingerState(landmarks: NormalizedLandmark[]): FingerState {
  return {
    thumb: isThumbExtended(landmarks),
    index: isFingerExtended(landmarks, 8, 6, 5),
    middle: isFingerExtended(landmarks, 12, 10, 9),
    ring: isFingerExtended(landmarks, 16, 14, 13),
    pinky: isFingerExtended(landmarks, 20, 18, 17),
  };
}
