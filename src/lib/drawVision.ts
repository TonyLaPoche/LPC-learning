import type { PositionId } from "@/data/lpc-fr";
import { buildZoneRects, type FaceAnchors } from "@/lib/cuePosition";
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
  side: "rgba(56, 189, 248, 0.32)",
  chin: "rgba(251, 113, 133, 0.32)",
  mouth: "rgba(45, 212, 191, 0.32)",
  cheek: "rgba(250, 204, 21, 0.32)",
  throat: "rgba(167, 139, 250, 0.32)",
};

const ZONE_LABELS: Record<PositionId, string> = {
  side: "Côté",
  chin: "Menton",
  mouth: "Bouche",
  cheek: "Joue",
  throat: "Gorge",
};

function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  rw: number,
  rh: number,
  radius: number,
) {
  const r = Math.min(radius, rw / 2, rh / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + rw, y, x + rw, y + rh, r);
  ctx.arcTo(x + rw, y + rh, x, y + rh, r);
  ctx.arcTo(x, y + rh, x, y, r);
  ctx.arcTo(x, y, x + rw, y, r);
  ctx.closePath();
}

export function drawFaceZones(
  ctx: CanvasRenderingContext2D,
  anchors: FaceAnchors,
  w: number,
  h: number,
  highlight: PositionId | null,
  lite: boolean,
) {
  const zones = buildZoneRects(anchors);

  for (const id of Object.keys(zones) as PositionId[]) {
    const active = highlight === id;
    const fill = active
      ? ZONE_COLORS[id].replace("0.32", "0.5")
      : ZONE_COLORS[id];
    const stroke = active ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.25)";

    for (const rect of zones[id]) {
      const x = rect.x * w;
      const y = rect.y * h;
      const rw = rect.w * w;
      const rh = rect.h * h;
      roundRectPath(ctx, x, y, rw, rh, 8);
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.strokeStyle = stroke;
      ctx.lineWidth = active ? 2 : 1;
      ctx.stroke();

      if (!lite || active) {
        const cx = x + rw / 2;
        const cy = y + rh / 2;
        ctx.fillStyle = "rgba(255,255,255,0.95)";
        ctx.font = `${active ? 16 : 13}px Figtree, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(-1, 1);
        ctx.fillText(ZONE_LABELS[id], 0, 0);
        ctx.restore();
      }
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
