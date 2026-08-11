import type { PositionId } from "@/data/lpc-fr";
import {
  centroidOfPoints,
  cueFingerTips,
  dist,
  type Point,
} from "@/lib/handGeometry";
import { CALIBRATED_ZONE_REL, relToRect } from "@/lib/zoneCalibration";
import type { NormalizedLandmark } from "@mediapipe/tasks-vision";

/** Indices Face Mesh utiles (MediaPipe). */
const NOSE = 1;
const CHIN = 152;
const MOUTH = 13;
const LEFT_CHEEK = 234;
const RIGHT_CHEEK = 454;
const FOREHEAD = 10;
const LEFT_TEMPLE = 127;
const RIGHT_TEMPLE = 356;

export type FaceAnchors = {
  nose: Point;
  chin: Point;
  mouth: Point;
  cheekL: Point;
  cheekR: Point;
  forehead: Point;
  templeL: Point;
  templeR: Point;
  faceWidth: number;
};

/** Rectangle normalisé 0–1 (espace MediaPipe, avant miroir CSS). */
export type NormRect = { x: number; y: number; w: number; h: number };

export function faceAnchors(
  face: NormalizedLandmark[] | null,
): FaceAnchors | null {
  if (!face?.length) return null;
  const pick = (i: number): Point => {
    const p = face[i];
    return p ? { x: p.x, y: p.y } : { x: 0.5, y: 0.5 };
  };
  const cheekL = pick(LEFT_CHEEK);
  const cheekR = pick(RIGHT_CHEEK);
  return {
    nose: pick(NOSE),
    chin: pick(CHIN),
    mouth: pick(MOUTH),
    cheekL,
    cheekR,
    forehead: pick(FOREHEAD),
    templeL: pick(LEFT_TEMPLE),
    templeR: pick(RIGHT_TEMPLE),
    faceWidth: Math.max(1e-4, dist(cheekL, cheekR)),
  };
}

export type PositionGuess = {
  id: PositionId | null;
  confidence: number;
  /** Centroïde des bouts utiles (hit-test zone). */
  pointer: Point | null;
  /** Tous les bouts de doigts étendus (rendu des ronds). */
  pointers: Point[];
};

export function pointInRect(p: Point, r: NormRect): boolean {
  return (
    p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h
  );
}

function rectCenter(r: NormRect): Point {
  return { x: r.x + r.w / 2, y: r.y + r.h / 2 };
}

/**
 * Zones LPC calibrées (un seul côté : droite écran / main dominante).
 * Offsets relatifs au nez — cf. CALIBRATED_ZONE_REL.
 */
export function buildZoneRects(
  anchors: FaceAnchors,
): Record<PositionId, NormRect[]> {
  const out = {} as Record<PositionId, NormRect[]>;
  for (const id of Object.keys(CALIBRATED_ZONE_REL) as PositionId[]) {
    out[id] = CALIBRATED_ZONE_REL[id].map((r) => relToRect(r, anchors));
  }
  return out;
}

/**
 * Combien de tips doivent toucher la zone pour valider un hit.
 * c5 (5 doigts) → 2 suffisent ; c1 (1 tip) → 1 ; c2 (2) → 1.
 */
function minTipsInZone(tipCount: number): number {
  if (tipCount <= 1) return 1;
  if (tipCount === 2) return 1;
  return 2;
}

/**
 * Hit-test rectangles : compte les tips étendus dans chaque zone
 * (pas le centroïde seul — avec c5 le centre tombe souvent hors zone
 * alors que 2 doigts sont déjà correctement placés).
 */
export function classifyCuePosition(
  hand: NormalizedLandmark[] | null,
  face: NormalizedLandmark[] | null,
): PositionGuess {
  if (!hand?.length) {
    return { id: null, confidence: 0, pointer: null, pointers: [] };
  }
  const pointers = cueFingerTips(hand);
  const pointer = centroidOfPoints(pointers);
  const anchors = faceAnchors(face);
  if (!anchors) {
    return { id: null, confidence: 0, pointer, pointers };
  }

  const zones = buildZoneRects(anchors);
  const need = minTipsInZone(pointers.length);
  const hits: Array<{
    id: PositionId;
    score: number;
    tipCount: number;
    hitPointer: Point;
  }> = [];

  for (const id of Object.keys(zones) as PositionId[]) {
    for (const rect of zones[id]) {
      const inside = pointers.filter((p) => pointInRect(p, rect));
      if (inside.length < need) continue;
      const hitPointer = centroidOfPoints(inside);
      const c = rectCenter(rect);
      const fw = anchors.faceWidth;
      const d = dist(hitPointer, c) / fw;
      const proximity = 1 - Math.min(1, d / 0.4);
      const coverage = inside.length / pointers.length;
      // Couverture tips + proximité du sous-centroïde dans la zone
      const score = 0.45 + 0.35 * coverage + 0.2 * proximity;
      hits.push({ id, score, tipCount: inside.length, hitPointer });
    }
  }

  if (hits.length === 0) {
    // Fallback : zone avec le plus de tips (même 1), seuil plus bas
    let best: {
      id: PositionId;
      score: number;
      hitPointer: Point;
    } | null = null;
    for (const id of Object.keys(zones) as PositionId[]) {
      for (const rect of zones[id]) {
        const inside = pointers.filter((p) => pointInRect(p, rect));
        if (inside.length === 0) continue;
        const hitPointer = centroidOfPoints(inside);
        const c = rectCenter(rect);
        const d = dist(hitPointer, c) / anchors.faceWidth;
        const proximity = 1 - Math.min(1, d / 0.45);
        const coverage = inside.length / pointers.length;
        const score = 0.35 * coverage + 0.65 * proximity;
        if (!best || score > best.score) {
          best = { id, score, hitPointer };
        }
      }
    }
    if (!best || best.score < 0.35) {
      return { id: null, confidence: 0, pointer, pointers };
    }
    return {
      id: best.id,
      confidence: Math.min(1, best.score * 0.85),
      pointer: best.hitPointer,
      pointers,
    };
  }

  hits.sort((a, b) => {
    if (b.tipCount !== a.tipCount) return b.tipCount - a.tipCount;
    return b.score - a.score;
  });
  const top = hits[0]!;
  return {
    id: top.id,
    confidence: Math.min(1, top.score),
    pointer: top.hitPointer,
    pointers,
  };
}
