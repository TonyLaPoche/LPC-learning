import { useEffect, useRef, useState } from "react";
import type { HandshapeId, PositionId } from "@/data/lpc-fr";
import { classifyCuePosition, faceAnchors } from "@/lib/cuePosition";
import {
  clearCanvas,
  drawFaceZones,
  drawHandSkeleton,
  drawPointerMarker,
} from "@/lib/drawVision";
import { classifyHandshape } from "@/lib/handshape";
import {
  isMobilePerfProfile,
  visionPerfProfile,
} from "@/lib/devicePerf";
import {
  FaceLandmarker,
  FilesetResolver,
  HandLandmarker,
  type NormalizedLandmark,
} from "@mediapipe/tasks-vision";

const WASM_URL =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.32/wasm";
const HAND_MODEL =
  "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";
const FACE_MODEL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

type VisionDelegate = "GPU" | "CPU";

function canCreateWebGl(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: false }) ??
      canvas.getContext("webgl", { failIfMajorPerformanceCaveat: false });
    if (!gl) return false;
    const lose = gl.getExtension("WEBGL_lose_context");
    lose?.loseContext();
    return true;
  } catch {
    return false;
  }
}

function friendlyVisionError(raw: string): string {
  if (/kGpuService|webgl|GPU|egl/i.test(raw)) {
    return "Le coach caméra n’a pas pu démarrer (accélération graphique). Réessaie dans Chrome ou Edge, active l’accélération matérielle, et ferme les autres onglets gourmands.";
  }
  return raw || "Erreur chargement MediaPipe";
}

export type VisionStatus =
  | "idle"
  | "loading"
  | "ready"
  | "tracking"
  | "no-hand"
  | "error";

export type LpcVisionReading = {
  handshape: HandshapeId | null;
  handConfidence: number;
  position: PositionId | null;
  positionConfidence: number;
  matchHand: boolean;
  matchPosition: boolean;
  matchAll: boolean;
};

/** Point de focus zoom (%, espace affiché après miroir horizontal). */
export type FaceFocus = {
  xPercent: number;
  yPercent: number;
  hasFace: boolean;
};

type Target = {
  handshape: HandshapeId | null;
  position: PositionId | null;
};

const DEFAULT_FOCUS: FaceFocus = {
  xPercent: 50,
  yPercent: 38,
  hasFace: false,
};

export function useLpcVision(opts: {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  cameraReady: boolean;
  target: Target;
  enabled: boolean;
}) {
  const { videoRef, canvasRef, cameraReady, target, enabled } = opts;
  const [status, setStatus] = useState<VisionStatus>("idle");
  const [modelsReady, setModelsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reading, setReading] = useState<LpcVisionReading>({
    handshape: null,
    handConfidence: 0,
    position: null,
    positionConfidence: 0,
    matchHand: false,
    matchPosition: false,
    matchAll: false,
  });
  const [faceFocus, setFaceFocus] = useState<FaceFocus>(DEFAULT_FOCUS);

  const handRef = useRef<HandLandmarker | null>(null);
  const faceRef = useRef<FaceLandmarker | null>(null);
  const rafRef = useRef(0);
  const lastHandTs = useRef(0);
  const lastFaceTs = useRef(0);
  const handLmRef = useRef<NormalizedLandmark[] | null>(null);
  const faceLmRef = useRef<NormalizedLandmark[] | null>(null);
  const targetRef = useRef(target);
  const focusSmoothRef = useRef({ x: 50, y: 38 });
  const lastFocusUiTs = useRef(0);
  targetRef.current = target;

  useEffect(() => {
    if (!enabled || !cameraReady) {
      setModelsReady(false);
      setStatus("idle");
      return;
    }

    let cancelled = false;

    async function createLandmarkers(
      vision: Awaited<ReturnType<typeof FilesetResolver.forVisionTasks>>,
      delegate: VisionDelegate,
    ) {
      const mobile = isMobilePerfProfile();
      const perf = visionPerfProfile(mobile);

      const hand = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: HAND_MODEL,
          delegate,
        },
        runningMode: "VIDEO",
        numHands: 1,
        minHandDetectionConfidence: perf.handDetection,
        minHandPresenceConfidence: perf.handPresence,
        minTrackingConfidence: perf.handTracking,
      });

      try {
        const face = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: FACE_MODEL,
            delegate,
          },
          runningMode: "VIDEO",
          numFaces: 1,
          minFaceDetectionConfidence: 0.4,
          minFacePresenceConfidence: 0.4,
          minTrackingConfidence: 0.4,
        });
        return { hand, face };
      } catch (err) {
        hand.close();
        throw err;
      }
    }

    async function init() {
      setStatus("loading");
      setModelsReady(false);
      setError(null);
      try {
        const vision = await FilesetResolver.forVisionTasks(WASM_URL);
        if (cancelled) return;

        // GPU d’abord ; si WebGL indisponible ou kGpuService → CPU
        const order: VisionDelegate[] = canCreateWebGl()
          ? ["GPU", "CPU"]
          : ["CPU", "GPU"];

        let lastErr: unknown;
        for (const delegate of order) {
          if (cancelled) return;
          try {
            const { hand, face } = await createLandmarkers(vision, delegate);
            if (cancelled) {
              hand.close();
              face.close();
              return;
            }
            handRef.current = hand;
            faceRef.current = face;
            setStatus("ready");
            setModelsReady(true);
            return;
          } catch (e) {
            lastErr = e;
            handRef.current?.close();
            faceRef.current?.close();
            handRef.current = null;
            faceRef.current = null;
          }
        }

        const raw =
          lastErr instanceof Error ? lastErr.message : String(lastErr ?? "");
        setError(friendlyVisionError(raw));
        setStatus("error");
        setModelsReady(false);
      } catch (e) {
        const raw = e instanceof Error ? e.message : "Erreur chargement MediaPipe";
        setError(friendlyVisionError(raw));
        setStatus("error");
        setModelsReady(false);
      }
    }

    void init();

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
      handRef.current?.close();
      faceRef.current?.close();
      handRef.current = null;
      faceRef.current = null;
      setModelsReady(false);
    };
  }, [enabled, cameraReady]);

  useEffect(() => {
    if (!enabled || !cameraReady || !modelsReady) return;

    const mobile = isMobilePerfProfile();
    const perf = visionPerfProfile(mobile);
    let alive = true;

    const loop = () => {
      if (!alive) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const hand = handRef.current;
      const face = faceRef.current;
      if (!video || !canvas || !hand || !face || video.readyState < 2) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      const now = performance.now();
      const vw = video.videoWidth;
      const vh = video.videoHeight;
      if (!vw || !vh) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      const scale = Math.min(1, perf.maxCanvasWidth / vw);
      const cw = Math.round(vw * scale);
      const ch = Math.round(vh * scale);
      if (canvas.width !== cw || canvas.height !== ch) {
        canvas.width = cw;
        canvas.height = ch;
      }

      if (now - lastHandTs.current >= perf.handIntervalMs) {
        lastHandTs.current = now;
        try {
          const hr = hand.detectForVideo(video, now);
          handLmRef.current = hr.landmarks?.[0] ?? null;
        } catch {
          handLmRef.current = null;
        }
      }

      if (now - lastFaceTs.current >= perf.faceIntervalMs) {
        lastFaceTs.current = now;
        try {
          const fr = face.detectForVideo(video, now);
          faceLmRef.current = fr.faceLandmarks?.[0] ?? null;
        } catch {
          faceLmRef.current = null;
        }
      }

      const handLm = handLmRef.current;
      const faceLm = faceLmRef.current;
      const shape = classifyHandshape(handLm);
      const pos = classifyCuePosition(handLm, faceLm);
      const t = targetRef.current;
      const matchHand =
        t.handshape == null ||
        (shape.id !== null &&
          shape.id === t.handshape &&
          shape.confidence >= 0.6);
      const matchPosition =
        t.position == null ||
        (pos.id !== null &&
          pos.id === t.position &&
          pos.confidence >= 0.35);
      const matchAll =
        (t.handshape != null || t.position != null) &&
        matchHand &&
        matchPosition &&
        handLm != null;

      const nextReading: LpcVisionReading = {
        handshape: shape.id,
        handConfidence: shape.confidence,
        position: pos.id,
        positionConfidence: pos.confidence,
        matchHand,
        matchPosition,
        matchAll,
      };

      setReading((prev) => {
        if (
          prev.handshape === nextReading.handshape &&
          prev.position === nextReading.position &&
          prev.matchHand === nextReading.matchHand &&
          prev.matchPosition === nextReading.matchPosition &&
          prev.matchAll === nextReading.matchAll &&
          Math.abs(prev.handConfidence - nextReading.handConfidence) < 0.05 &&
          Math.abs(prev.positionConfidence - nextReading.positionConfidence) <
            0.05
        ) {
          return prev;
        }
        return nextReading;
      });

      const nextStatus: VisionStatus = handLm ? "tracking" : "no-hand";
      setStatus((prev) => (prev === nextStatus ? prev : nextStatus));

      const ctx = canvas.getContext("2d");
      if (ctx) {
        clearCanvas(ctx, cw, ch);
        const anchors = faceAnchors(faceLm);
        if (anchors) {
          drawFaceZones(
            ctx,
            anchors,
            cw,
            ch,
            t.position ?? pos.id,
            perf.liteDraw,
          );

          // Focus zoom : nez un peu au-dessus du centre (meilleur cadrage)
          // Après miroir CSS scaleX(-1), x affiché = 1 - x MediaPipe
          const rawX = (1 - anchors.nose.x) * 100;
          const rawY = (anchors.nose.y * 0.55 + anchors.mouth.y * 0.45) * 100;
          const sm = focusSmoothRef.current;
          const alpha = 0.18;
          sm.x += (rawX - sm.x) * alpha;
          sm.y += (rawY - sm.y) * alpha;

          if (now - lastFocusUiTs.current > 80) {
            lastFocusUiTs.current = now;
            const nextFocus: FaceFocus = {
              xPercent: sm.x,
              yPercent: sm.y,
              hasFace: true,
            };
            setFaceFocus((prev) => {
              if (
                prev.hasFace &&
                Math.abs(prev.xPercent - nextFocus.xPercent) < 0.4 &&
                Math.abs(prev.yPercent - nextFocus.yPercent) < 0.4
              ) {
                return prev;
              }
              return nextFocus;
            });
          }
        } else if (now - lastFocusUiTs.current > 200) {
          lastFocusUiTs.current = now;
          setFaceFocus((prev) => (prev.hasFace ? DEFAULT_FOCUS : prev));
        }
        if (handLm) {
          drawHandSkeleton(ctx, handLm, cw, ch);
          if (pos.pointer) {
            drawPointerMarker(ctx, pos.pointer, cw, ch, matchAll);
          }
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      alive = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [enabled, cameraReady, modelsReady, videoRef, canvasRef]);

  return { status, error, reading, faceFocus };
}
