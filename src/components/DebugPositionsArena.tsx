import { useEffect, useRef, useState } from "react";
import {
  POSITIONS,
  positionById,
  type PositionId,
} from "@/data/lpc-fr";
import { useCamera } from "@/hooks/useCamera";
import { useLpcVision } from "@/hooks/useLpcVision";
import {
  buildPositionMismatchReport,
  POSITION_MNEMONICS,
  VOWEL_POSITION_ORDER,
} from "@/lib/positionCalibration";
import {
  FACE_ZOOM_MAX,
  FACE_ZOOM_MIN,
  loadFaceZoom,
  saveFaceZoom,
} from "@/lib/progress";

type DebugPositionsArenaProps = {
  onExit: () => void;
};

export function DebugPositionsArena({ onExit }: DebugPositionsArenaProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [expected, setExpected] = useState<PositionId>("cheek");
  const [jsonOut, setJsonOut] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [faceZoom, setFaceZoom] = useState(() => loadFaceZoom());

  const camera = useCamera(videoRef);
  const vision = useLpcVision({
    videoRef,
    canvasRef,
    cameraReady: camera.ready,
    enabled: true,
    drawZones: true,
    target: { handshape: null, position: expected },
  });

  useEffect(() => {
    void camera.start();
    return () => camera.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount/unmount only
  }, []);

  const live = vision.reading;
  const hasHand = vision.status === "tracking";
  const hasFace = vision.faceFocus.hasFace || vision.anchors != null;
  const match = hasHand && live.position === expected;
  const mismatch = hasHand && live.position !== expected;
  const posMeta = positionById(expected);
  const mnemonic = POSITION_MNEMONICS[expected];

  const exportMismatch = () => {
    if (!hasHand) return;
    const report = buildPositionMismatchReport({
      expected,
      detected: live.position,
      detectedConfidence: live.positionConfidence,
      handshapeDetected: live.handshape,
      handedness: live.handedness,
    });
    setJsonOut(JSON.stringify(report, null, 2));
    setCopied(false);
  };

  const copyJson = async () => {
    if (!jsonOut) return;
    try {
      await navigator.clipboard.writeText(jsonOut);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const downloadJson = () => {
    if (!jsonOut) return;
    const blob = new Blob([jsonOut], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lpc-position-mismatch-${expected}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
        <p className="text-sm font-semibold text-amber-300">Debug · Voyelles</p>
      </div>

      <div className="shrink-0 rounded-2xl border border-amber-400/40 bg-amber-400/10 p-3 sm:p-4">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-200">
          Outil 3 · Positions
        </p>
        <h2 className="font-display text-xl font-bold leading-tight">
          Scanner une zone voyelle
        </h2>
        <p className="mt-1 text-xs text-mist sm:text-sm">
          Choisis la zone attendue, place ta main. Si l’app détecte autre chose,
          génère le JSON pour analyser l’écart.
        </p>
      </div>

      <div className="relative flex h-[min(36vh,300px)] w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-panel-2/80 bg-black sm:h-[min(40vh,340px)]">
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
          {!hasFace && (
            <div className="absolute inset-x-0 bottom-2 flex justify-center">
              <p className="rounded-full bg-ink/80 px-3 py-1 text-xs text-foam">
                Place ton visage face à la caméra…
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 rounded-xl border border-panel-2/60 bg-panel/50 px-3 py-1.5">
        <span className="shrink-0 text-[11px] text-mist" aria-hidden>
          −
        </span>
        <label className="sr-only" htmlFor="face-zoom-debug-positions">
          Zoom visage
        </label>
        <input
          id="face-zoom-debug-positions"
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

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pb-4">
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-sky">
            Zone attendue
          </p>
          <div className="flex flex-wrap gap-1.5">
            {VOWEL_POSITION_ORDER.map((id) => {
              const p = POSITIONS.find((x) => x.id === id)!;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setExpected(id);
                    setJsonOut(null);
                  }}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    expected === id
                      ? "bg-teal text-ink"
                      : "border border-panel-2/80 bg-panel/60 text-mist hover:border-teal/40"
                  }`}
                  title={p.hint}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-sm font-semibold text-foam">
            {posMeta.label} — {mnemonic.sounds}
          </p>
          <p className="text-xs text-mist">
            {posMeta.hint} · ex. <em>{mnemonic.example}</em>
          </p>
        </div>

        <div
          className={`rounded-2xl border p-3 ${
            !hasHand
              ? "border-panel-2/60 bg-panel/50"
              : match
                ? "border-ok/50 bg-ok/10"
                : "border-coral/50 bg-coral/10"
          }`}
        >
          <p className="text-[10px] font-semibold uppercase tracking-wider text-sky">
            Détection live
          </p>
          <p className="mt-1 font-display text-xl font-bold">
            {hasHand
              ? live.position
                ? positionById(live.position).label
                : "Aucune zone"
              : "—"}
          </p>
          <p className="text-xs text-mist">
            conf. {(live.positionConfidence * 100).toFixed(0)}%
            {live.handshape ? ` · forme ${live.handshape}` : ""}
            {live.handedness ? ` · MP ${live.handedness}` : ""}
          </p>
          {match && (
            <p className="mt-2 text-sm font-semibold text-ok">
              OK — match {posMeta.label}
            </p>
          )}
          {mismatch && (
            <p className="mt-2 text-sm font-semibold text-coral">
              Mismatch — attendu {posMeta.label}, détecté{" "}
              {live.position ? positionById(live.position).label : "aucune"}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={exportMismatch}
            disabled={!hasHand || match}
            className="rounded-full bg-amber-300 px-4 py-2 text-sm font-semibold text-ink disabled:opacity-40"
          >
            Générer JSON (mismatch)
          </button>
          {jsonOut && (
            <>
              <button
                type="button"
                onClick={() => void copyJson()}
                className="rounded-full border border-teal/50 px-4 py-2 text-sm text-teal"
              >
                {copied ? "Copié ✓" : "Copier"}
              </button>
              <button
                type="button"
                onClick={downloadJson}
                className="rounded-full border border-panel-2 px-4 py-2 text-sm text-mist hover:text-foam"
              >
                Télécharger
              </button>
            </>
          )}
        </div>

        {jsonOut && (
          <pre className="max-h-56 overflow-auto rounded-2xl border border-panel-2/70 bg-ink/80 p-3 text-[11px] leading-relaxed text-foam/90">
            {jsonOut}
          </pre>
        )}

        <figure className="overflow-hidden rounded-2xl border border-panel-2/70 bg-panel/40">
          <figcaption className="px-3 pt-3 text-[10px] font-semibold uppercase tracking-wider text-amber-200">
            Référence — 5 positions voyelles
          </figcaption>
          <img
            src={`${import.meta.env.BASE_URL}examples/cles-5-positions-voyelles.png`}
            alt="Les 5 positions des mains pour coder les sons voyelles"
            className="mt-2 w-full object-contain"
          />
        </figure>

        {(camera.error || vision.error) && (
          <p className="text-sm text-rose-300">
            {camera.error ?? vision.error}
          </p>
        )}
      </div>
    </div>
  );
}
