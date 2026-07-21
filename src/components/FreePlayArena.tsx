import { useEffect, useRef, useState } from "react";
import { CueExample } from "@/components/CueExample";
import {
  HANDSHAPES,
  POSITIONS,
  handshapeById,
  positionById,
} from "@/data/lpc-fr";
import { useCamera } from "@/hooks/useCamera";
import { useLpcVision } from "@/hooks/useLpcVision";
import {
  FACE_ZOOM_MAX,
  FACE_ZOOM_MIN,
  loadFaceZoom,
  saveFaceZoom,
} from "@/lib/progress";

type FreePlayArenaProps = {
  onExit: () => void;
};

export function FreePlayArena({ onExit }: FreePlayArenaProps) {
  const [faceZoom, setFaceZoom] = useState(() => loadFaceZoom());
  const [showLegend, setShowLegend] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const camera = useCamera(videoRef);
  const vision = useLpcVision({
    videoRef,
    canvasRef,
    cameraReady: camera.ready,
    enabled: true,
    target: { handshape: null, position: null },
  });

  useEffect(() => {
    void camera.start();
    return () => camera.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount/unmount only
  }, []);

  const shapeId = vision.reading.handshape;
  const posId = vision.reading.position;
  const shapeLabel = shapeId ? handshapeById(shapeId).label : "—";
  const posLabel = posId ? positionById(posId).label : "—";

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
        <p className="text-sm text-mist">Mode libre</p>
      </div>

      <div className="grid shrink-0 grid-cols-[1fr_auto] items-center gap-3 rounded-2xl border border-panel-2/70 bg-panel/70 p-3 sm:p-4">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-sky">
            Exploration
          </p>
          <h2 className="font-display text-xl font-bold leading-tight sm:text-2xl">
            Code librement
          </h2>
          <p className="mt-0.5 text-xs text-mist sm:text-sm">
            Pas de cible : observe la forme et la zone détectées en direct.
          </p>
        </div>
        <CueExample handshape={shapeId} position={posId} compact />
      </div>

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
      </div>

      <div className="flex shrink-0 items-center gap-2 rounded-xl border border-panel-2/60 bg-panel/50 px-3 py-1.5">
        <span className="shrink-0 text-[11px] text-mist" aria-hidden>
          −
        </span>
        <label className="sr-only" htmlFor="face-zoom-free">
          Zoom visage
        </label>
        <input
          id="face-zoom-free"
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

      <div className="grid shrink-0 grid-cols-2 gap-1.5 text-center text-[11px] sm:text-xs">
        <div className="rounded-xl border border-teal/40 bg-panel/60 px-2 py-2">
          <p className="text-mist">Forme détectée</p>
          <p className="mt-0.5 font-semibold text-teal">{shapeLabel}</p>
        </div>
        <div className="rounded-xl border border-sky/40 bg-panel/60 px-2 py-2">
          <p className="text-mist">Zone détectée</p>
          <p className="mt-0.5 font-semibold text-sky">{posLabel}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setShowLegend((v) => !v)}
        className="shrink-0 rounded-full border border-panel-2 px-3 py-1 text-xs text-mist hover:text-foam"
      >
        {showLegend ? "Masquer le mémo" : "Mémo 8 formes · 5 zones"}
      </button>

      {showLegend && (
        <div className="min-h-0 shrink overflow-y-auto rounded-xl border border-panel-2/60 bg-panel/40 p-3 text-[11px]">
          <p className="mb-2 font-semibold text-foam">Formes</p>
          <ul className="mb-3 space-y-1 text-mist">
            {HANDSHAPES.map((h) => (
              <li key={h.id}>
                <span className="text-teal">{h.label}</span> — {h.hint}
              </li>
            ))}
          </ul>
          <p className="mb-2 font-semibold text-foam">Positions</p>
          <ul className="space-y-1 text-mist">
            {POSITIONS.map((p) => (
              <li key={p.id}>
                <span className="text-sky">{p.label}</span> — {p.hint}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
