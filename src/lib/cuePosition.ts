import type { PositionId } from "@/data/lpc-fr";
import { dist, highestFingerTip, type Point } from "@/lib/handGeometry";
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
  pointer: Point | null;
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
 * Zones LPC en rectangles non superposés :
 * - Centre vertical : bouche → menton → gorge (empilés, bords joints)
 * - Latéral : joue (dans le visage) | côté (hors visage), séparés à la joue
 */
export function buildZoneRects(
  anchors: FaceAnchors,
): Record<PositionId, NormRect[]> {
  const midX = anchors.nose.x;
  const fw = anchors.faceWidth;
  const faceL = Math.min(anchors.cheekL.x, anchors.templeL.x);
  const faceR = Math.max(anchors.cheekR.x, anchors.templeR.x);

  const colHalf = fw * 0.2;
  const colL = midX - colHalf;
  const colR = midX + colHalf;
  const colW = Math.max(0.02, colR - colL);

  // Séparations verticales : gap menton↔gorge (barbe) + gorge étirée vers le bas
  const mouthTop = anchors.mouth.y - fw * 0.12;
  const mouthBot = (anchors.mouth.y + anchors.chin.y) * 0.5;
  const chinBot = anchors.chin.y + fw * 0.04;
  const throatGap = fw * 0.07;
  const throatTop = chinBot + throatGap;
  const throatBot = throatTop + fw * 0.48;

  const mouth: NormRect = {
    x: colL,
    y: mouthTop,
    w: colW,
    h: Math.max(0.02, mouthBot - mouthTop),
  };
  const chin: NormRect = {
    x: colL,
    y: mouthBot,
    w: colW,
    h: Math.max(0.02, chinBot - mouthBot),
  };
  const throat: NormRect = {
    x: colL,
    y: throatTop,
    w: colW,
    h: Math.max(0.02, throatBot - throatTop),
  };

  // Joue / côté : même bande verticale, séparés en x à faceL / faceR
  const bandTop = Math.min(anchors.templeL.y, anchors.templeR.y) - fw * 0.02;
  const bandBot = anchors.mouth.y + fw * 0.08;
  const bandH = Math.max(0.04, bandBot - bandTop);
  const sideW = fw * 0.42;

  const cheekL: NormRect = {
    x: faceL,
    y: bandTop,
    w: Math.max(0.02, colL - faceL),
    h: bandH,
  };
  const cheekR: NormRect = {
    x: colR,
    y: bandTop,
    w: Math.max(0.02, faceR - colR),
    h: bandH,
  };
  const sideL: NormRect = {
    x: faceL - sideW,
    y: bandTop,
    w: sideW,
    h: bandH,
  };
  const sideR: NormRect = {
    x: faceR,
    y: bandTop,
    w: sideW,
    h: bandH,
  };

  return {
    mouth: [mouth],
    chin: [chin],
    throat: [throat],
    cheek: [cheekL, cheekR],
    side: [sideL, sideR],
  };
}

/**
 * Hit-test rectangles non superposés + score de confiance (proximité du centre).
 */
export function classifyCuePosition(
  hand: NormalizedLandmark[] | null,
  face: NormalizedLandmark[] | null,
): PositionGuess {
  if (!hand?.length) {
    return { id: null, confidence: 0, pointer: null };
  }
  const pointer = highestFingerTip(hand);
  const anchors = faceAnchors(face);
  if (!anchors) {
    return { id: null, confidence: 0, pointer };
  }

  const zones = buildZoneRects(anchors);
  const hits: Array<{ id: PositionId; score: number }> = [];

  for (const id of Object.keys(zones) as PositionId[]) {
    for (const rect of zones[id]) {
      if (!pointInRect(pointer, rect)) continue;
      const c = rectCenter(rect);
      const fw = anchors.faceWidth;
      const d = dist(pointer, c) / fw;
      // Dans le rectangle : score élevé, meilleur près du centre
      const score = 0.75 + 0.25 * (1 - Math.min(1, d / 0.35));
      hits.push({ id, score });
    }
  }

  if (hits.length === 0) {
    // Soft fallback : zone dont le centre est le plus proche (rayon limité)
    let best: { id: PositionId; score: number } | null = null;
    for (const id of Object.keys(zones) as PositionId[]) {
      for (const rect of zones[id]) {
        const c = rectCenter(rect);
        const d = dist(pointer, c) / anchors.faceWidth;
        const score = 1 - Math.min(1, d / 0.45);
        if (!best || score > best.score) best = { id, score };
      }
    }
    if (!best || best.score < 0.45) {
      return { id: null, confidence: 0, pointer };
    }
    return { id: best.id, confidence: best.score * 0.7, pointer };
  }

  hits.sort((a, b) => b.score - a.score);
  const top = hits[0]!;
  return {
    id: top.id,
    confidence: Math.min(1, top.score),
    pointer,
  };
}
