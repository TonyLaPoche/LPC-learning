import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { POSITIONS, positionById, type PositionId } from "@/data/lpc-fr";
import { useCamera } from "@/hooks/useCamera";
import { useLpcVision } from "@/hooks/useLpcVision";
import type { FaceAnchors, NormRect } from "@/lib/cuePosition";
import {
  FACE_ZOOM_MAX,
  FACE_ZOOM_MIN,
  loadFaceZoom,
  saveFaceZoom,
} from "@/lib/progress";
import {
  buildExport,
  ZONE_COLORS,
  ZONE_ORDER,
  zonesFromAlgo,
  zonesToAbs,
  type RelRect,
  type ZoneRelMap,
} from "@/lib/zoneCalibration";

type DebugZonesArenaProps = {
  onExit: () => void;
};

type Sel = { id: PositionId; part: number };

type DragMode = "move" | "resize-se" | "resize-nw";

function partLabel(id: PositionId, part: number, total: number): string {
  const base = positionById(id).label;
  if (total <= 1) return base;
  return `${base} · ${part + 1}`;
}

function nudgeRel(
  rel: RelRect,
  key: "dx" | "dy" | "dw" | "dh",
  delta: number,
): RelRect {
  const next = { ...rel, [key]: rel[key] + delta };
  next.dw = Math.max(0.08, next.dw);
  next.dh = Math.max(0.08, next.dh);
  return next;
}

export function DebugZonesArena({ onExit }: DebugZonesArenaProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const [frozen, setFrozen] = useState<FaceAnchors | null>(null);
  const [zones, setZones] = useState<ZoneRelMap | null>(null);
  const [sel, setSel] = useState<Sel>({ id: "mouth", part: 0 });
  const [jsonOut, setJsonOut] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [faceZoom, setFaceZoom] = useState(() => loadFaceZoom());

  const dragRef = useRef<{
    mode: DragMode;
    id: PositionId;
    part: number;
    startX: number;
    startY: number;
    start: RelRect;
    fw: number;
  } | null>(null);

  const camera = useCamera(videoRef);
  const vision = useLpcVision({
    videoRef,
    canvasRef,
    cameraReady: camera.ready,
    enabled: true,
    drawZones: false,
    target: { handshape: null, position: null },
  });

  const liveAnchors = vision.anchors;
  const anchors = frozen ?? liveAnchors;

  useEffect(() => {
    void camera.start();
    return () => camera.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount/unmount only
  }, []);

  useEffect(() => {
    if (!anchors || zones) return;
    setZones(zonesFromAlgo(anchors));
  }, [anchors, zones]);

  const absZones = useMemo(() => {
    if (!anchors || !zones) return null;
    return zonesToAbs(zones, anchors);
  }, [anchors, zones]);

  const resetAlgo = () => {
    if (!anchors) return;
    setZones(zonesFromAlgo(anchors));
    setJsonOut(null);
  };

  const resetSelected = () => {
    if (!anchors || !zones) return;
    const algo = zonesFromAlgo(anchors);
    setZones({
      ...zones,
      [sel.id]: [...algo[sel.id]],
    });
  };

  const updateSelected = (fn: (r: RelRect) => RelRect) => {
    setZones((prev) => {
      if (!prev) return prev;
      const list = [...prev[sel.id]];
      const cur = list[sel.part];
      if (!cur) return prev;
      list[sel.part] = fn(cur);
      return { ...prev, [sel.id]: list };
    });
  };

  const onPointerDown = (
    e: React.PointerEvent,
    mode: DragMode,
    id: PositionId,
    part: number,
  ) => {
    if (!anchors || !zones) return;
    e.preventDefault();
    e.stopPropagation();
    setSel({ id, part });
    const start = zones[id][part];
    if (!start) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = {
      mode,
      id,
      part,
      startX: e.clientX,
      startY: e.clientY,
      start: { ...start },
      fw: anchors.faceWidth,
    };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const drag = dragRef.current;
    const stage = stageRef.current;
    if (!drag || !stage) return;
    const rect = stage.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    // Espace affiché (miroir) → MediaPipe
    const dDispX = (e.clientX - drag.startX) / rect.width;
    const dDispY = (e.clientY - drag.startY) / rect.height;
    const dMpX = -dDispX;
    const dMpY = dDispY;
    const fw = drag.fw;

    setZones((prev) => {
      if (!prev) return prev;
      const list = [...prev[drag.id]];
      const base = drag.start;
      let next: RelRect;
      if (drag.mode === "move") {
        next = {
          ...base,
          dx: base.dx + dMpX / fw,
          dy: base.dy + dMpY / fw,
        };
      } else if (drag.mode === "resize-se") {
        next = {
          ...base,
          dw: Math.max(0.08, base.dw + dMpX / fw),
          dh: Math.max(0.08, base.dh + dMpY / fw),
        };
      } else {
        // resize-nw : déplace top-left + inverse la taille
        next = {
          dx: base.dx + dMpX / fw,
          dy: base.dy + dMpY / fw,
          dw: Math.max(0.08, base.dw - dMpX / fw),
          dh: Math.max(0.08, base.dh - dMpY / fw),
        };
      }
      list[drag.part] = next;
      return { ...prev, [drag.id]: list };
    });
  };

  const endDrag = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    dragRef.current = null;
  };

  const exportJson = useCallback(() => {
    if (!anchors || !zones) return;
    const payload = buildExport(zones, anchors);
    const text = JSON.stringify(payload, null, 2);
    setJsonOut(text);
    setCopied(false);
  }, [anchors, zones]);

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
    a.download = `lpc-zones-${Date.now()}.json`;
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
        <p className="text-sm font-semibold text-amber-300">Debug · Zones</p>
      </div>

      <div className="shrink-0 rounded-2xl border border-amber-400/40 bg-amber-400/10 p-3 sm:p-4">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-200">
          Outil dev
        </p>
        <h2 className="font-display text-xl font-bold leading-tight">
          Placement des zones trigger
        </h2>
        <p className="mt-1 text-xs text-mist sm:text-sm">
          Choisis une zone, déplace / redimensionne, puis exporte le JSON.
          Prefère figer le visage pour un placement précis.
        </p>
      </div>

      <div className="relative flex h-[min(38vh,320px)] w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-panel-2/80 bg-black sm:h-[min(42vh,360px)]">
        <div
          ref={stageRef}
          className="relative h-full max-w-full touch-none"
          style={{
            aspectRatio:
              camera.width > 0 && camera.height > 0
                ? `${camera.width} / ${camera.height}`
                : "16 / 9",
            transform: `scale(${faceZoom})`,
            transformOrigin: `${vision.faceFocus.xPercent}% ${vision.faceFocus.yPercent}%`,
          }}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
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

          {/* Overlays en espace affiché (déjà miroir) */}
          {absZones &&
            (Object.keys(absZones) as PositionId[]).flatMap((id) =>
              absZones[id].map((rect: NormRect, part: number) => {
                const active = sel.id === id && sel.part === part;
                const label = partLabel(id, part, absZones[id].length);
                return (
                  <div
                    key={`${id}-${part}`}
                    className={`absolute box-border border-2 ${
                      active
                        ? "z-20 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.4)]"
                        : "z-10 border-white/40"
                    }`}
                    style={{
                      left: `${(1 - rect.x - rect.w) * 100}%`,
                      top: `${rect.y * 100}%`,
                      width: `${rect.w * 100}%`,
                      height: `${rect.h * 100}%`,
                      background: ZONE_COLORS[id],
                    }}
                    onPointerDown={(e) => onPointerDown(e, "move", id, part)}
                    onPointerMove={onPointerMove}
                    onPointerUp={endDrag}
                    onPointerCancel={endDrag}
                  >
                    <span className="pointer-events-none absolute left-1 top-0.5 rounded bg-ink/70 px-1 text-[10px] font-semibold text-foam">
                      {label}
                    </span>
                    {active && (
                      <>
                        <button
                          type="button"
                          aria-label="Redimensionner coin NW"
                          className="absolute -left-1.5 -top-1.5 h-3.5 w-3.5 rounded-sm bg-white"
                          onPointerDown={(e) =>
                            onPointerDown(e, "resize-nw", id, part)
                          }
                          onPointerMove={onPointerMove}
                          onPointerUp={endDrag}
                          onPointerCancel={endDrag}
                        />
                        <button
                          type="button"
                          aria-label="Redimensionner coin SE"
                          className="absolute -bottom-1.5 -right-1.5 h-3.5 w-3.5 rounded-sm bg-white"
                          onPointerDown={(e) =>
                            onPointerDown(e, "resize-se", id, part)
                          }
                          onPointerMove={onPointerMove}
                          onPointerUp={endDrag}
                          onPointerCancel={endDrag}
                        />
                      </>
                    )}
                  </div>
                );
              }),
            )}

          {!anchors && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <p className="rounded-full bg-ink/80 px-3 py-1.5 text-sm text-foam">
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
        <label className="sr-only" htmlFor="face-zoom-debug-zones">
          Zoom visage
        </label>
        <input
          id="face-zoom-debug-zones"
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
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() =>
              setFrozen((f) => (f ? null : liveAnchors ? { ...liveAnchors } : null))
            }
            disabled={!liveAnchors && !frozen}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              frozen
                ? "bg-amber-300 text-ink"
                : "border border-amber-300/50 text-amber-100"
            }`}
          >
            {frozen ? "Visage figé · Défiger" : "Figer le visage"}
          </button>
          <button
            type="button"
            onClick={resetAlgo}
            disabled={!anchors}
            className="rounded-full border border-panel-2 px-3 py-1.5 text-xs text-mist hover:border-teal/40 hover:text-foam disabled:opacity-40"
          >
            Reset toutes (algo)
          </button>
          <button
            type="button"
            onClick={resetSelected}
            disabled={!anchors || !zones}
            className="rounded-full border border-panel-2 px-3 py-1.5 text-xs text-mist hover:border-teal/40 hover:text-foam disabled:opacity-40"
          >
            Reset zone sélectionnée
          </button>
        </div>

        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-sky">
            Zone à placer
          </p>
          <div className="flex flex-wrap gap-2">
            {ZONE_ORDER.map((id) => {
              const def = POSITIONS.find((p) => p.id === id)!;
              const parts = zones?.[id]?.length ?? 1;
              const active = sel.id === id;
              return (
                <div key={id} className="flex flex-wrap gap-1">
                  {Array.from({ length: parts }, (_, part) => (
                    <button
                      key={`${id}-${part}`}
                      type="button"
                      onClick={() => setSel({ id, part })}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                        active && sel.part === part
                          ? "bg-teal text-ink"
                          : "border border-panel-2/80 bg-panel/60 text-mist hover:border-teal/40"
                      }`}
                    >
                      {partLabel(id, part, parts)}
                    </button>
                  ))}
                  <span className="sr-only">{def.hint}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-sky">
            Réglages fins
          </p>
          <div className="grid grid-cols-4 gap-2 sm:max-w-md">
            {(
              [
                ["←", "dx", -0.04],
                ["→", "dx", 0.04],
                ["↑", "dy", -0.04],
                ["↓", "dy", 0.04],
                ["W−", "dw", -0.04],
                ["W+", "dw", 0.04],
                ["H−", "dh", -0.04],
                ["H+", "dh", 0.04],
              ] as const
            ).map(([label, key, delta]) => (
              <button
                key={label}
                type="button"
                disabled={!zones}
                onClick={() => updateSelected((r) => nudgeRel(r, key, delta))}
                className="rounded-xl border border-panel-2/70 bg-panel/70 py-2 text-sm font-semibold text-foam hover:border-teal/50 disabled:opacity-40"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={exportJson}
            disabled={!anchors || !zones}
            className="rounded-full bg-teal px-4 py-2 text-sm font-semibold text-ink disabled:opacity-40"
          >
            Générer JSON
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
          <pre className="max-h-48 overflow-auto rounded-2xl border border-panel-2/70 bg-ink/80 p-3 text-[11px] leading-relaxed text-foam/90">
            {jsonOut}
          </pre>
        )}

        {(camera.error || vision.error) && (
          <p className="text-sm text-rose-300">
            {camera.error ?? vision.error}
          </p>
        )}
      </div>
    </div>
  );
}
