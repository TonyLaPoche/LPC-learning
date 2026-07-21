import { useEffect, useMemo, useRef, useState } from "react";
import {
  HANDSHAPES,
  POSITIONS,
  SYLLABLE_DRILLS,
  WORD_DRILLS,
  handshapeById,
  positionById,
  type HandshapeId,
  type LessonTrack,
  type PositionId,
} from "@/data/lpc-fr";
import { CueExample } from "@/components/CueExample";
import { useCamera } from "@/hooks/useCamera";
import { useLpcVision } from "@/hooks/useLpcVision";
import { addXp, markCompleted, loadFaceZoom, saveFaceZoom, FACE_ZOOM_MIN, FACE_ZOOM_MAX } from "@/lib/progress";

type PracticeArenaProps = {
  track: LessonTrack;
  onExit: () => void;
  onProgress: () => void;
};

type Step = {
  id: string;
  title: string;
  subtitle: string;
  handshape: HandshapeId | null;
  position: PositionId | null;
};

function buildSteps(track: LessonTrack): Step[] {
  if (track === "shapes") {
    return HANDSHAPES.map((h) => ({
      id: `shape-${h.id}`,
      title: h.label,
      subtitle: `${h.hint} · ${h.consonants.join(", ")}`,
      handshape: h.id,
      position: null,
    }));
  }
  if (track === "positions") {
    return POSITIONS.map((p) => ({
      id: `pos-${p.id}`,
      title: p.label,
      subtitle: `${p.hint} · ${p.vowels.join(", ")}`,
      handshape: null,
      position: p.id,
    }));
  }
  if (track === "syllables") {
    return SYLLABLE_DRILLS.map((s) => ({
      id: s.id,
      title: s.display,
      subtitle: s.tip ?? s.label,
      handshape: s.cue.handshape,
      position: s.cue.position,
    }));
  }
  const steps: Step[] = [];
  for (const w of WORD_DRILLS) {
    w.keys.forEach((k, i) => {
      steps.push({
        id: `${w.id}-${i}`,
        title: `${w.word} · ${k.syllable}`,
        subtitle: `Clé ${i + 1}/${w.keys.length}`,
        handshape: k.handshape,
        position: k.position,
      });
    });
  }
  return steps;
}

const HOLD_MS = 1200;

export function PracticeArena({ track, onExit, onProgress }: PracticeArenaProps) {
  const steps = useMemo(() => buildSteps(track), [track]);
  const [index, setIndex] = useState(0);
  const [holdPct, setHoldPct] = useState(0);
  const [flashOk, setFlashOk] = useState(false);
  const [sessionDone, setSessionDone] = useState(false);
  const [faceZoom, setFaceZoom] = useState(() => loadFaceZoom());
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const holdAcc = useRef(0);
  const lastTs = useRef<number | null>(null);
  const completingRef = useRef(false);
  const indexRef = useRef(0);
  const stepsLenRef = useRef(steps.length);
  const stepIdRef = useRef(steps[0]!.id);
  const onProgressRef = useRef(onProgress);
  const matchAllRef = useRef(false);
  const sessionDoneRef = useRef(false);

  indexRef.current = index;
  stepsLenRef.current = steps.length;
  stepIdRef.current = steps[index]!.id;
  onProgressRef.current = onProgress;
  sessionDoneRef.current = sessionDone;

  const camera = useCamera(videoRef);
  const step = steps[index]!;

  const vision = useLpcVision({
    videoRef,
    canvasRef,
    cameraReady: camera.ready,
    enabled: true,
    target: {
      handshape: sessionDone ? null : step.handshape,
      position: sessionDone ? null : step.position,
    },
  });

  matchAllRef.current = vision.reading.matchAll;

  useEffect(() => {
    void camera.start();
    return () => camera.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount/unmount only
  }, []);

  useEffect(() => {
    holdAcc.current = 0;
    lastTs.current = null;
    completingRef.current = false;
    setHoldPct(0);
    setFlashOk(false);
  }, [index, track]);

  useEffect(() => {
    let raf = 0;
    let alive = true;
    let lastUiPct = -1;

    const tick = (ts: number) => {
      if (!alive) return;
      if (lastTs.current == null) lastTs.current = ts;
      const dt = Math.min(100, ts - lastTs.current);
      lastTs.current = ts;

      if (sessionDoneRef.current || completingRef.current) {
        raf = requestAnimationFrame(tick);
        return;
      }

      if (matchAllRef.current) {
        holdAcc.current = Math.min(HOLD_MS, holdAcc.current + dt);
      } else {
        holdAcc.current = Math.max(0, holdAcc.current - dt * 1.5);
      }

      const pct = Math.round((holdAcc.current / HOLD_MS) * 100);
      if (pct !== lastUiPct) {
        lastUiPct = pct;
        setHoldPct(pct);
      }

      if (holdAcc.current >= HOLD_MS) {
        completingRef.current = true;
        setFlashOk(true);
        markCompleted(stepIdRef.current);
        addXp(5);
        onProgressRef.current();

        const isLast = indexRef.current >= stepsLenRef.current - 1;
        window.setTimeout(() => {
          if (!alive) return;
          if (isLast) {
            setSessionDone(true);
            return;
          }
          setIndex((i) => Math.min(i + 1, stepsLenRef.current - 1));
        }, 650);
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
    };
  }, [track]);

  const restart = () => {
    holdAcc.current = 0;
    lastTs.current = null;
    completingRef.current = false;
    setFlashOk(false);
    setHoldPct(0);
    setIndex(0);
    setSessionDone(false);
  };

  const shapeLabel = vision.reading.handshape
    ? handshapeById(vision.reading.handshape).label
    : "—";
  const posLabel = vision.reading.position
    ? positionById(vision.reading.position).label
    : "—";

  return (
    <div className="flex h-full min-h-0 flex-col gap-2">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={onExit}
          className="rounded-full border border-panel-2 px-3 py-1 text-sm text-mist hover:border-foam/40 hover:text-foam"
        >
          ← Accueil
        </button>
        <p className="text-sm text-mist">
          {sessionDone ? "Terminé" : `${index + 1} / ${steps.length}`}
        </p>
      </div>

      {sessionDone ? (
        <div className="shrink-0 rounded-2xl border border-teal/30 bg-panel/80 p-4 text-center sm:p-5">
          <h2 className="font-display text-2xl font-bold text-teal">Bravo !</h2>
          <p className="mt-1 text-sm text-mist">
            {steps.length} étapes validées.
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={restart}
              className="rounded-full bg-teal px-4 py-2 text-sm font-semibold text-ink"
            >
              Recommencer
            </button>
            <button
              type="button"
              onClick={onExit}
              className="rounded-full border border-panel-2 px-4 py-2 text-sm text-foam"
            >
              Accueil
            </button>
          </div>
        </div>
      ) : (
        <div className="grid shrink-0 grid-cols-[1fr_auto] items-center gap-3 rounded-2xl border border-panel-2/70 bg-panel/70 p-3 sm:gap-4 sm:p-4">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-sky">
              Cible
            </p>
            <h2 className="font-display text-xl font-bold leading-tight sm:text-2xl">
              {step.title}
            </h2>
            <p className="mt-0.5 line-clamp-2 text-xs text-mist sm:text-sm">
              {step.subtitle}
            </p>
            <div className="mt-1.5 flex flex-wrap gap-1.5 text-[10px] sm:text-xs">
              {step.handshape && (
                <span className="rounded-full bg-ink/70 px-2 py-0.5 text-teal">
                  {handshapeById(step.handshape).label}
                </span>
              )}
              {step.position && (
                <span className="rounded-full bg-ink/70 px-2 py-0.5 text-sky">
                  {positionById(step.position).label}
                </span>
              )}
            </div>
          </div>
          <CueExample
            handshape={step.handshape}
            position={step.position}
            compact
          />
        </div>
      )}

      {/* Caméra — zoom ancré sur le visage (MediaPipe), boîte au ratio natif */}
      <div className="relative flex h-[min(41vh,345px)] w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-panel-2/80 bg-black sm:h-[min(46vh,390px)]">
        <div
          className="relative h-full max-w-full"
          style={{
            aspectRatio:
              camera.width > 0 && camera.height > 0
                ? `${camera.width} / ${camera.height}`
                : "16 / 9",
            transform: `scale(${faceZoom})`,
            transformOrigin: `${vision.faceFocus.xPercent}% ${vision.faceFocus.yPercent}%`,
          }}
        >
          <div
            className="absolute inset-0"
            style={{ transform: "scaleX(-1)", transformOrigin: "center center" }}
          >
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full bg-black object-fill"
              playsInline
              muted
              autoPlay
            />
            <canvas
              ref={canvasRef}
              className="pointer-events-none absolute inset-0 h-full w-full"
            />
          </div>
        </div>
        {!camera.ready && !camera.error && (
          <div className="absolute inset-0 flex items-center justify-center bg-ink/80 text-sm">
            Démarrage caméra…
          </div>
        )}
        {(camera.error || vision.error) && (
          <div className="absolute inset-0 flex items-center justify-center bg-ink/90 p-4 text-center text-sm text-coral">
            {camera.error ?? vision.error}
          </div>
        )}

        {flashOk && !sessionDone && (
          <div className="absolute inset-x-0 top-2 z-10 flex justify-center">
            <span className="rounded-full bg-ok px-3 py-1 text-xs font-semibold text-ink shadow-lg">
              Bravo !
            </span>
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2 rounded-xl border border-panel-2/60 bg-panel/50 px-3 py-1.5">
        <span className="shrink-0 text-[11px] text-mist" aria-hidden>
          −
        </span>
        <label className="sr-only" htmlFor="face-zoom">
          Zoom visage
        </label>
        <input
          id="face-zoom"
          type="range"
          min={FACE_ZOOM_MIN}
          max={FACE_ZOOM_MAX}
          step={0.02}
          value={faceZoom}
          onChange={(e) => {
            const z = Number(e.target.value);
            setFaceZoom(z);
            saveFaceZoom(z);
          }}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-ink accent-teal"
        />
        <span className="shrink-0 text-[11px] text-mist" aria-hidden>
          +
        </span>
        <span className="w-10 shrink-0 text-right text-[11px] font-medium text-sky tabular-nums">
          {Math.round(faceZoom * 100)}%
        </span>
      </div>
      {!sessionDone && (
        <div className="flex shrink-0 flex-col gap-1.5">
          <div className="grid grid-cols-3 gap-1.5 text-center text-[11px] sm:text-xs">
            <div
              className={`rounded-xl border bg-panel/60 px-2 py-1.5 ${
                step.handshape == null
                  ? "border-panel-2/70"
                  : vision.reading.matchHand
                    ? "border-ok/50"
                    : "border-coral/40"
              }`}
            >
              <p className="text-mist">Forme</p>
              <p className="truncate font-medium">{shapeLabel}</p>
            </div>
            <div
              className={`rounded-xl border bg-panel/60 px-2 py-1.5 ${
                step.position == null
                  ? "border-panel-2/70"
                  : vision.reading.matchPosition
                    ? "border-ok/50"
                    : "border-coral/40"
              }`}
            >
              <p className="text-mist">Zone</p>
              <p className="truncate font-medium">{posLabel}</p>
            </div>
            <div className="rounded-xl border border-panel-2/70 bg-panel/60 px-2 py-1.5">
              <p className="text-mist">Hold {holdPct}%</p>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-ink">
                <div
                  className="h-full rounded-full bg-teal"
                  style={{ width: `${holdPct}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={index === 0 || flashOk}
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              className="rounded-full border border-panel-2 px-3 py-1 text-xs disabled:opacity-40 sm:text-sm"
            >
              Précédent
            </button>
            <button
              type="button"
              disabled={index >= steps.length - 1 || flashOk}
              onClick={() => setIndex((i) => Math.min(steps.length - 1, i + 1))}
              className="rounded-full border border-panel-2 px-3 py-1 text-xs disabled:opacity-40 sm:text-sm"
            >
              Passer
            </button>
            <p className="ml-auto self-center text-[10px] text-mist/80 sm:text-xs">
              {vision.status === "no-hand"
                ? "Montre une main"
                : vision.status === "loading"
                  ? "Modèles…"
                  : "Imite l’exemple"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
