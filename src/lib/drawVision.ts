import type { PositionId } from "@/data/lpc-fr";
import { zoneCenters, type FaceAnchors } from "@/lib/cuePosition";
import { HAND_CONNECTIONS, type Point } from "@/lib/handGeometry";
import type { NormalizedLandmark } from "@mediapipe/tasks-vision";

export function clearCanvas(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
) {
  ctx.clearRect(0, 0, w, h);
}

/** Coordonnées MediaPipe brutes — le miroir est géré en CSS sur video+canvas. */
function toPx(p: Point, w: number, h: number): Point {
  return { x: p.x * w, y: p.y * h };
}

export function drawHandSkeleton(
  ctx: CanvasRenderingContext2D,
  landmarks: NormalizedLandmark[],
  w: number,
  h: number,
  color = "rgba(45, 212, 191, 0.9)",
) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  for (const [a, b] of HAND_CONNECTIONS) {
    const pa = landmarks[a];
    const pb = landmarks[b];
    if (!pa || !pb) continue;
    const A = toPx({ x: pa.x, y: pa.y }, w, h);
    const B = toPx({ x: pb.x, y: pb.y }, w, h);
    ctx.beginPath();
    ctx.moveTo(A.x, A.y);
    ctx.lineTo(B.x, B.y);
    ctx.stroke();
  }
  for (const lm of landmarks) {
    const p = toPx({ x: lm.x, y: lm.y }, w, h);
    ctx.fillStyle = "rgba(56, 189, 248, 0.95)";
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

const ZONE_COLORS: Record<PositionId, string> = {
  side: "rgba(56, 189, 248, 0.35)",
  chin: "rgba(251, 113, 133, 0.35)",
  mouth: "rgba(45, 212, 191, 0.35)",
  cheek: "rgba(250, 204, 21, 0.35)",
  throat: "rgba(167, 139, 250, 0.35)",
};

const ZONE_LABELS: Record<PositionId, string> = {
  side: "Côté",
  chin: "Menton",
  mouth: "Bouche",
  cheek: "Joue",
  throat: "Gorge",
};

export function drawFaceZones(
  ctx: CanvasRenderingContext2D,
  anchors: FaceAnchors,
  w: number,
  h: number,
  highlight: PositionId | null,
  lite: boolean,
) {
  const centers = zoneCenters(anchors);
  const r = Math.max(18, anchors.faceWidth * w * 0.22);

  for (const id of Object.keys(centers) as PositionId[]) {
    const c = toPx(centers[id], w, h);
    const active = highlight === id;
    ctx.beginPath();
    ctx.arc(c.x, c.y, active ? r * 1.15 : r, 0, Math.PI * 2);
    ctx.fillStyle = active
      ? ZONE_COLORS[id].replace("0.35", "0.55")
      : ZONE_COLORS[id];
    ctx.fill();
    if (!lite || active) {
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.font = `${active ? 13 : 11}px Figtree, sans-serif`;
      ctx.textAlign = "center";
      // Miroir CSS : on inverse le sens du texte pour qu’il reste lisible
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.scale(-1, 1);
      ctx.fillText(ZONE_LABELS[id], 0, 4);
      ctx.restore();
    }
  }
}

export function drawPointerMarker(
  ctx: CanvasRenderingContext2D,
  pointer: Point,
  w: number,
  h: number,
  ok: boolean,
) {
  const p = toPx(pointer, w, h);
  ctx.beginPath();
  ctx.arc(p.x, p.y, 10, 0, Math.PI * 2);
  ctx.fillStyle = ok ? "rgba(52, 211, 153, 0.95)" : "rgba(251, 113, 133, 0.9)";
  ctx.fill();
  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  ctx.stroke();
}
