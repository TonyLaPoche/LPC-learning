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
 * Extrémités LPC utiles : un rond sur chaque doigt étendu
 * (ex. c2 = index + majeur, pas seulement le plus haut).
 */
export function cueFingerTips(landmarks: NormalizedLandmark[]): Point[] {
  const state = fingerState(landmarks);
  const flags = [
    state.thumb,
    state.index,
    state.middle,
    state.ring,
    state.pinky,
  ];
  const tips: Point[] = [];
  for (let i = 0; i < FINGER_TIPS.length; i++) {
    if (!flags[i]) continue;
    const tip = landmarks[FINGER_TIPS[i]!];
    if (tip) tips.push({ x: tip.x, y: tip.y });
  }
  if (tips.length > 0) return tips;
  return [highestFingerTip(landmarks)];
}

export function centroidOfPoints(points: Point[]): Point {
  const n = Math.max(1, points.length);
  let x = 0;
  let y = 0;
  for (const p of points) {
    x += p.x;
    y += p.y;
  }
  return { x: x / n, y: y / n };
}

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

function distPointToLine(p: Point, a: Point, b: Point): number {
  const abx = b.x - a.x;
  const aby = b.y - a.y;
  const apx = p.x - a.x;
  const apy = p.y - a.y;
  const ab2 = abx * abx + aby * aby + 1e-8;
  let t = (apx * abx + apy * aby) / ab2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(apx - t * abx, apy - t * aby);
}

type ThumbMode = "strict" | "lShape" | "twoFinger" | "openHand";

/**
 * Pouce étendu vs rentré.
 * Échelles = largeur de main + longueur d’index (stables face caméra).
 * - `openHand` : 4 doigts (c4/c5)
 * - `lShape` : index seul (c1/c6)
 * - `twoFinger` : index+majeur (c2/c7) — même sensibilité viewpoint que le L
 * - `strict` : autres cas
 */
export function isThumbExtended(
  landmarks: NormalizedLandmark[],
  mode: ThumbMode = "strict",
): boolean {
  const tip = landmarks[4];
  const ip = landmarks[3];
  const mcp = landmarks[2];
  const cmc = landmarks[1];
  const indexMcp = landmarks[5];
  const indexTip = landmarks[8];
  const pinkyMcp = landmarks[17];
  if (!tip || !ip || !mcp || !cmc || !indexMcp || !indexTip || !pinkyMcp) {
    return false;
  }

  const tipP = { x: tip.x, y: tip.y };
  const ipP = { x: ip.x, y: ip.y };
  const mcpP = { x: mcp.x, y: mcp.y };
  const cmcP = { x: cmc.x, y: cmc.y };
  const indexMcpP = { x: indexMcp.x, y: indexMcp.y };
  const indexTipP = { x: indexTip.x, y: indexTip.y };
  const pinkyMcpP = { x: pinkyMcp.x, y: pinkyMcp.y };

  const handWidth = Math.max(1e-4, dist(indexMcpP, pinkyMcpP));
  const indexLen = Math.max(1e-4, dist(indexMcpP, indexTipP));
  const scale = Math.max(handWidth, indexLen * 0.55);

  const thr =
    mode === "openHand"
      ? {
          tipIndex: 0.36,
          stretch: 1.06,
          angleDeg: 32,
          lateral: 0.32,
          outPinky: 1.0,
        }
      : mode === "lShape" || mode === "twoFinger"
        ? {
            tipIndex: 0.34,
            stretch: 1.05,
            angleDeg: 32,
            lateral: 0.36,
            outPinky: 1.0,
          }
        : {
            tipIndex: 0.42,
            stretch: 1.1,
            angleDeg: 40,
            lateral: 0.45,
            outPinky: 1.04,
          };

  if (dist(tipP, indexMcpP) / scale < thr.tipIndex) return false;
  if (dist(tipP, cmcP) < dist(ipP, cmcP) * thr.stretch) return false;

  const vThumb = { x: tipP.x - mcpP.x, y: tipP.y - mcpP.y };
  const vIndex = { x: indexTipP.x - indexMcpP.x, y: indexTipP.y - indexMcpP.y };
  const denom =
    Math.hypot(vThumb.x, vThumb.y) * Math.hypot(vIndex.x, vIndex.y) + 1e-6;
  const cos = (vThumb.x * vIndex.x + vThumb.y * vIndex.y) / denom;
  const angle = Math.acos(Math.min(1, Math.max(-1, cos)));
  if (angle < (thr.angleDeg * Math.PI) / 180) return false;

  if (distPointToLine(tipP, indexMcpP, indexTipP) / handWidth < thr.lateral) {
    return false;
  }

  if (dist(tipP, pinkyMcpP) < dist(indexMcpP, pinkyMcpP) * thr.outPinky) {
    return false;
  }

  return true;
}

export type FingerState = {
  thumb: boolean;
  index: boolean;
  middle: boolean;
  ring: boolean;
  pinky: boolean;
};

export function fingerState(landmarks: NormalizedLandmark[]): FingerState {
  const index = isFingerExtended(landmarks, 8, 6, 5);
  const middle = isFingerExtended(landmarks, 12, 10, 9);
  const ring = isFingerExtended(landmarks, 16, 14, 13);
  const pinky = isFingerExtended(landmarks, 20, 18, 17);

  const openHand = index && middle && ring && pinky;
  const lCandidate = index && !middle && !ring && !pinky;
  const twoFinger = index && middle && !ring && !pinky;
  const mode: ThumbMode = openHand
    ? "openHand"
    : lCandidate
      ? "lShape"
      : twoFinger
        ? "twoFinger"
        : "strict";

  return {
    thumb: isThumbExtended(landmarks, mode),
    index,
    middle,
    ring,
    pinky,
  };
}
