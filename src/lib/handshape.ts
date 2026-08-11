import type { HandshapeId, PositionId } from "@/data/lpc-fr";
import { handshapeById, positionById } from "@/data/lpc-fr";
import { dist, fingerState, type FingerState } from "@/lib/handGeometry";
import type { NormalizedLandmark } from "@mediapipe/tasks-vision";

export type HandshapeGuess = {
  id: HandshapeId | null;
  confidence: number;
  fingers: FingerState;
  indexMiddleSpan: number;
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

export function scoreHandshapeFingers(fingers: FingerState): Array<{
  id: HandshapeId;
  score: number;
}> {
  return (Object.keys(HANDSHAPE_SIGNATURES) as HandshapeId[])
    .map((id) => {
      let s = scoreMatch(fingers, HANDSHAPE_SIGNATURES[id]);
      if (id === "c2" || id === "c8") s -= 0.02;
      return { id, score: s };
    })
    .sort((a, b) => b.score - a.score);
}

/**
 * Signatures idéales des 8 configs LfPC.
 * c3 = pouce + index pliés, 3 doigts tendus (majeur/annulaire/auriculaire).
 * c2/c8 partagent index+majeur → heuristique d’écartement.
 */
export const HANDSHAPE_SIGNATURES: Record<HandshapeId, FingerState> = {
  c1: { thumb: false, index: true, middle: false, ring: false, pinky: false },
  c2: { thumb: false, index: true, middle: true, ring: false, pinky: false },
  c3: { thumb: false, index: false, middle: true, ring: true, pinky: true },
  c4: { thumb: false, index: true, middle: true, ring: true, pinky: true },
  c5: { thumb: true, index: true, middle: true, ring: true, pinky: true },
  c6: { thumb: true, index: true, middle: false, ring: false, pinky: false },
  c7: { thumb: true, index: true, middle: true, ring: false, pinky: false },
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

/** Écart index–majeur normalisé (utile c2 vs c8). */
export function indexMiddleSpan(landmarks: NormalizedLandmark[]): number {
  const i = landmarks[8];
  const m = landmarks[12];
  if (!i || !m) return 0;
  return dist({ x: i.x, y: i.y }, { x: m.x, y: m.y }) / palmScale(landmarks);
}

/** Seuil palm pour un V net (c8). En dessous → c2 jointif. */
export const V_SPAN_PALM_THRESHOLD = 0.38;
/** Les bouts doivent être nettement plus écartés que les MCP. */
export const V_SPAN_MCP_RATIO = 1.65;

/**
 * V vrai (c8) si écart des tips grand ET > écart des base (MCP).
 * Sinon on préfère c2 (doigts jointifs) — évite le faux positif
 * quand le span est juste au-dessus d’un seuil unique bas.
 */
export function isVHandshape(landmarks: NormalizedLandmark[]): boolean {
  const iTip = landmarks[8];
  const mTip = landmarks[12];
  const iMcp = landmarks[5];
  const mMcp = landmarks[9];
  if (!iTip || !mTip || !iMcp || !mMcp) return false;
  const tipSpan = dist(
    { x: iTip.x, y: iTip.y },
    { x: mTip.x, y: mTip.y },
  );
  const mcpSpan = Math.max(
    1e-4,
    dist({ x: iMcp.x, y: iMcp.y }, { x: mMcp.x, y: mMcp.y }),
  );
  const palm = palmScale(landmarks);
  return (
    tipSpan / palm >= V_SPAN_PALM_THRESHOLD &&
    tipSpan / mcpSpan >= V_SPAN_MCP_RATIO
  );
}

/** c2 (jointif) vs c8 (V écarté). */
function preferVOrTogether(
  landmarks: NormalizedLandmark[],
  base: HandshapeId,
): HandshapeId {
  if (base !== "c2" && base !== "c8") return base;
  return isVHandshape(landmarks) ? "c8" : "c2";
}

export function classifyHandshape(
  landmarks: NormalizedLandmark[] | null,
): HandshapeGuess {
  const empty: FingerState = {
    thumb: false,
    index: false,
    middle: false,
    ring: false,
    pinky: false,
  };
  if (!landmarks?.length) {
    return { id: null, confidence: 0, fingers: empty, indexMiddleSpan: 0 };
  }

  const fingers = fingerState(landmarks);
  const span = indexMiddleSpan(landmarks);
  let best: HandshapeId = "c5";
  let bestScore = -1;

  for (const id of Object.keys(HANDSHAPE_SIGNATURES) as HandshapeId[]) {
    let s = scoreMatch(fingers, HANDSHAPE_SIGNATURES[id]);
    if (id === "c2" || id === "c8") s -= 0.02;
    if (s > bestScore) {
      bestScore = s;
      best = id;
    }
  }

  best = preferVOrTogether(landmarks, best);

  return {
    id: bestScore >= 0.6 ? best : null,
    confidence: bestScore,
    fingers,
    indexMiddleSpan: span,
  };
}

export type CueMeaning = {
  handshapeId: HandshapeId;
  positionId: PositionId | null;
  handLabel: string;
  positionLabel: string | null;
  consonants: string[];
  vowels: string[];
  summary: string;
};

export function describeCue(
  handshapeId: HandshapeId,
  positionId: PositionId | null,
): CueMeaning {
  const hs = handshapeById(handshapeId);
  const pos = positionId ? positionById(positionId) : null;
  const consonants = hs.consonants;
  const vowels = pos?.vowels ?? [];
  let summary: string;
  if (!pos) {
    summary = `Forme ${hs.label} (${handshapeId}) — consonnes ${consonants.join(", ")} ; place la main dans une zone pour le son vocalique.`;
  } else if (handshapeId === "c5" && consonants.includes("∅")) {
    summary = `Zone ${pos.label} : voyelle seule possible (${vowels.join(", ")}) ou consonne m/t/f + voyelle.`;
  } else {
    summary = `${hs.label} @ ${pos.label} → consonnes [${consonants.join(", ")}] + voyelles [${vowels.join(", ")}]`;
  }
  return {
    handshapeId,
    positionId,
    handLabel: hs.label,
    positionLabel: pos?.label ?? null,
    consonants,
    vowels,
    summary,
  };
}
