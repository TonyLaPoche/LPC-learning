import type { PositionId } from "@/data/lpc-fr";
import { dist, palmCenter, type Point } from "@/lib/handGeometry";
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
  /** Largeur visage approx (pour normaliser) */
  faceWidth: number;
};

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
  palm: Point | null;
};

/**
 * Classifie la zone LPC de la paume par rapport au visage.
 * Caméra en miroir : la main dominante est souvent côté opposé au rendu.
 */
export function classifyCuePosition(
  hand: NormalizedLandmark[] | null,
  face: NormalizedLandmark[] | null,
): PositionGuess {
  if (!hand?.length) {
    return { id: null, confidence: 0, palm: null };
  }
  const palm = palmCenter(hand);
  const anchors = faceAnchors(face);
  if (!anchors) {
    return { id: null, confidence: 0, palm };
  }

  const fw = anchors.faceWidth;
  const midX = anchors.nose.x;

  // Candidats : distance normalisée à chaque ancre / zone
  const candidates: Array<{ id: PositionId; score: number }> = [];

  // Mouth : près de la bouche
  const dMouth = dist(palm, anchors.mouth) / fw;
  candidates.push({ id: "mouth", score: 1 - Math.min(1, dMouth / 0.55) });

  // Chin
  const dChin = dist(palm, anchors.chin) / fw;
  candidates.push({ id: "chin", score: 1 - Math.min(1, dChin / 0.55) });

  // Cheek : proche pommette (la plus proche)
  const dCheek = Math.min(
    dist(palm, anchors.cheekL),
    dist(palm, anchors.cheekR),
  ) / fw;
  candidates.push({ id: "cheek", score: 1 - Math.min(1, dCheek / 0.5) });

  // Throat : sous le menton, proche axe vertical
  const belowChin = palm.y > anchors.chin.y - 0.02;
  const nearCenter = Math.abs(palm.x - midX) / fw < 0.55;
  const dThroat =
    dist(palm, { x: midX, y: anchors.chin.y + fw * 0.25 }) / fw;
  let throatScore = 1 - Math.min(1, dThroat / 0.65);
  if (belowChin && nearCenter) throatScore += 0.15;
  candidates.push({ id: "throat", score: throatScore });

  // Side : à l’extérieur du visage, hauteur yeux/tempes
  const dTemple = Math.min(
    dist(palm, anchors.templeL),
    dist(palm, anchors.templeR),
  ) / fw;
  const outside =
    palm.x < anchors.cheekL.x - fw * 0.05 ||
    palm.x > anchors.cheekR.x + fw * 0.05;
  let sideScore = 1 - Math.min(1, dTemple / 0.7);
  if (outside) sideScore += 0.2;
  if (palm.y < anchors.chin.y && palm.y > anchors.forehead.y - 0.05) {
    sideScore += 0.1;
  }
  candidates.push({ id: "side", score: sideScore });

  candidates.sort((a, b) => b.score - a.score);
  const top = candidates[0]!;
  const second = candidates[1]?.score ?? 0;
  const confidence = Math.max(0, Math.min(1, top.score - second * 0.15));

  return {
    id: top.score > 0.35 ? top.id : null,
    confidence,
    palm,
  };
}

export function zoneCenters(anchors: FaceAnchors): Record<PositionId, Point> {
  const midX = anchors.nose.x;
  const fw = anchors.faceWidth;
  // En miroir, on montre les deux côtés pour « side »
  return {
    mouth: anchors.mouth,
    chin: anchors.chin,
    cheek: anchors.cheekR,
    throat: { x: midX, y: anchors.chin.y + fw * 0.28 },
    side: { x: anchors.templeR.x + fw * 0.35, y: anchors.templeR.y },
  };
}
