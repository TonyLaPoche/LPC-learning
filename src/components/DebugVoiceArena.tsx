import { useEffect, useMemo, useRef, useState } from "react";
import { CueExample } from "@/components/CueExample";
import {
  HANDSHAPES,
  POSITIONS,
  type HandshapeId,
  type PositionId,
} from "@/data/lpc-fr";
import { getPackSyllables, type PackId } from "@/data/packs";
import { useCamera } from "@/hooks/useCamera";
import { useLpcVision } from "@/hooks/useLpcVision";
import { useVoiceActivity } from "@/hooks/useVoiceActivity";
import {
  FACE_ZOOM_MAX,
  FACE_ZOOM_MIN,
  loadFaceZoom,
  saveFaceZoom,
} from "@/lib/progress";

type DebugVoiceArenaProps = {
  pack: PackId;
  onExit: () => void;
};

export function DebugVoiceArena({ pack, onExit }: DebugVoiceArenaProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drills = useMemo(() => getPackSyllables(pack), [pack]);
  const [expectedHs, setExpectedHs] = useState<HandshapeId>("c5");
  const [expectedPos, setExpectedPos] = useState<PositionId>("side");
  const [presetId, setPresetId] = useState<string | null>("ma");
  const [micOn, setMicOn] = useState(false);
  const [threshold, setThreshold] = useState(0.08);
  const [voiceHoldMs, setVoiceHoldMs] = useState(200);
  const [gateHoldMs, setGateHoldMs] = useState(500);
  const [faceZoom, setFaceZoom] = useState(() => loadFaceZoom());
  const [gatePct, setGatePct] = useState(0);
  const [flashOk, setFlashOk] = useState(false);

  const camera = useCamera(videoRef);
  const vision = useLpcVision({
    videoRef,
    canvasRef,
    cameraReady: camera.ready,
    enabled: true,
    drawZones: true,
    target: { handshape: expectedHs, position: expectedPos },
  });
  const voice = useVoiceActivity({
    enabled: micOn,
    threshold,
    holdMs: voiceHoldMs,
  });

  const holdAcc = useRef(0);
  const lastTs = useRef<number | null>(null);
  const completing = useRef(false);

  useEffect(() => {
    void camera.start();
    return () => camera.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount/unmount only
  }, []);

  useEffect(() => {
    holdAcc.current = 0;
    lastTs.current = null;
    completing.current = false;
    setGatePct(0);
    setFlashOk(false);
  }, [expectedHs, expectedPos, gateHoldMs, micOn]);

  const live = vision.reading;
  const matchCue = live.matchAll;
  const matchVoice = !micOn || voice.reading.active;
  const matchAll = matchCue && matchVoice && vision.status === "tracking";

  useEffect(() => {
    let raf = 0;
    let alive = true;
    const tick = (ts: number) => {
      if (!alive) return;
      if (lastTs.current == null) lastTs.current = ts;
      const dt = Math.min(80, ts - lastTs.current);
      lastTs.current = ts;

      if (completing.current) {
        raf = requestAnimationFrame(tick);
        return;
      }

      if (matchAll) {
        holdAcc.current += dt;
      } else {
        holdAcc.current = Math.max(0, holdAcc.current - dt * 1.6);
      }
      const pct = Math.min(100, Math.round((holdAcc.current / gateHoldMs) * 100));
      setGatePct(pct);

      if (holdAcc.current >= gateHoldMs) {
        completing.current = true;
        setFlashOk(true);
        holdAcc.current = 0;
        window.setTimeout(() => {
          setFlashOk(false);
          completing.current = false;
        }, 900);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
    };
  }, [matchAll, gateHoldMs]);

  const applyPreset = (id: string) => {
    const drill = drills.find((d) => d.id === id);
    if (!drill) return;
    setPresetId(id);
    setExpectedHs(drill.cue.handshape);
    setExpectedPos(drill.cue.position);
  };

  const presetLabel =
    presetId != null
      ? (drills.find((d) => d.id === presetId)?.display ?? presetId)
      : null;

  const voiceLevelPct = Math.round(voice.reading.level * 100);

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
        <p className="text-sm font-semibold text-amber-300">Debug · Voice gate</p>
      </div>

      <div className="shrink-0 rounded-2xl border border-amber-400/40 bg-amber-400/10 p-3 sm:p-4">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-200">
          Preview · micro local
        </p>
        <h2 className="font-display text-xl font-bold leading-tight">
          Clé + zone + voix
        </h2>
        <p className="mt-1 text-xs text-mist sm:text-sm">
          Active le micro, code la syllabe et parle. Rien n’est envoyé : audio
          analysé localement (niveau sonore / VAD). Si fiable, on branchera ça
          sur l’initiation 3–5.
        </p>
      </div>

      <div className="relative flex h-[min(34vh,280px)] w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-panel-2/80 bg-black sm:h-[min(38vh,320px)]">
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
        {flashOk && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-ok/25">
            <p className="rounded-2xl bg-ok px-4 py-2 font-display text-lg font-bold text-ink">
              Validé (clé + zone + voix)
            </p>
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2 rounded-xl border border-panel-2/60 bg-panel/50 px-3 py-1.5">
        <label className="sr-only" htmlFor="face-zoom-debug-voice">
          Zoom visage
        </label>
        <input
          id="face-zoom-debug-voice"
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
        <span className="w-10 shrink-0 text-right text-[11px] font-medium text-sky tabular-nums">
          {Math.round(faceZoom * 100)}%
        </span>
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pb-4">
        <CueExample
          handshape={expectedHs}
          position={expectedPos}
          lipsLabel={presetLabel}
          compact
        />

        <div className="grid grid-cols-4 gap-1.5 text-center text-[11px]">
          <div
            className={`rounded-xl border px-2 py-1.5 ${
              live.matchHand ? "border-ok/50 bg-ok/10" : "border-panel-2/70 bg-panel/50"
            }`}
          >
            <p className="text-mist">Clé</p>
            <p className="font-medium">{live.matchHand ? "OK" : "…"}</p>
          </div>
          <div
            className={`rounded-xl border px-2 py-1.5 ${
              live.matchPosition
                ? "border-ok/50 bg-ok/10"
                : "border-panel-2/70 bg-panel/50"
            }`}
          >
            <p className="text-mist">Zone</p>
            <p className="font-medium">{live.matchPosition ? "OK" : "…"}</p>
          </div>
          <div
            className={`rounded-xl border px-2 py-1.5 ${
              !micOn
                ? "border-panel-2/70 bg-panel/40"
                : voice.reading.active
                  ? "border-ok/50 bg-ok/10"
                  : voice.reading.aboveThreshold
                    ? "border-amber-300/50 bg-amber-300/10"
                    : "border-coral/40 bg-coral/10"
            }`}
          >
            <p className="text-mist">Voix</p>
            <p className="font-medium">
              {!micOn
                ? "off"
                : voice.reading.active
                  ? "OK"
                  : voice.reading.aboveThreshold
                    ? "…"
                    : "—"}
            </p>
          </div>
          <div className="rounded-xl border border-panel-2/70 bg-panel/50 px-2 py-1.5">
            <p className="text-mist">Gate</p>
            <p className="font-medium tabular-nums">{gatePct}%</p>
          </div>
        </div>

        <section className="space-y-3 rounded-2xl border border-sky/35 bg-sky/10 p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-display text-base font-bold text-foam">Micro</h3>
            <button
              type="button"
              onClick={() => setMicOn((v) => !v)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                micOn
                  ? "bg-coral/90 text-ink"
                  : "bg-teal text-ink hover:bg-teal/90"
              }`}
            >
              {micOn ? "Couper le micro" : "Activer le micro"}
            </button>
          </div>
          <p className="text-xs text-mist">
            Statut :{" "}
            <span className="text-foam">
              {voice.status === "listening"
                ? "écoute locale"
                : voice.status === "requesting"
                  ? "demande permission…"
                  : voice.status === "denied"
                    ? "refusé"
                    : voice.status === "error"
                      ? "erreur"
                      : "inactif"}
            </span>
            {voice.error ? ` — ${voice.error}` : ""}
          </p>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-mist">
              <span>Niveau</span>
              <span className="tabular-nums text-foam">{voiceLevelPct}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-ink">
              <div
                className={`h-full transition-[width] duration-75 ${
                  voice.reading.active
                    ? "bg-ok"
                    : voice.reading.aboveThreshold
                      ? "bg-amber-300"
                      : "bg-sky"
                }`}
                style={{ width: `${voiceLevelPct}%` }}
              />
            </div>
            <div
              className="relative -mt-2 h-0"
              aria-hidden
            >
              <div
                className="absolute top-0 h-2 w-0.5 bg-foam/80"
                style={{ left: `${Math.min(100, threshold * 100)}%` }}
              />
            </div>
          </div>

          <label className="block space-y-1">
            <span className="text-[11px] text-mist">
              Seuil voix ({Math.round(threshold * 100)}%)
            </span>
            <input
              type="range"
              min={0.02}
              max={0.35}
              step={0.01}
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-ink accent-teal"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-[11px] text-mist">
              Hold voix mini ({voiceHoldMs} ms)
            </span>
            <input
              type="range"
              min={50}
              max={600}
              step={25}
              value={voiceHoldMs}
              onChange={(e) => setVoiceHoldMs(Number(e.target.value))}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-ink accent-teal"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-[11px] text-mist">
              Hold validation complète ({gateHoldMs} ms)
            </span>
            <input
              type="range"
              min={200}
              max={1500}
              step={50}
              value={gateHoldMs}
              onChange={(e) => setGateHoldMs(Number(e.target.value))}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-ink accent-teal"
            />
          </label>
        </section>

        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-sky">
            Preset syllabe
          </p>
          <div className="flex flex-wrap gap-1.5">
            {drills.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => applyPreset(d.id)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  presetId === d.id
                    ? "bg-teal text-ink"
                    : "border border-panel-2 text-mist hover:border-teal/40 hover:text-foam"
                }`}
              >
                {d.display}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <label className="block space-y-1">
            <span className="text-[11px] text-mist">Clé attendue</span>
            <select
              value={expectedHs}
              onChange={(e) => {
                setExpectedHs(e.target.value as HandshapeId);
                setPresetId(null);
              }}
              className="w-full rounded-xl border border-panel-2/80 bg-ink/40 px-3 py-2 text-sm text-foam"
            >
              {HANDSHAPES.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-1">
            <span className="text-[11px] text-mist">Zone attendue</span>
            <select
              value={expectedPos}
              onChange={(e) => {
                setExpectedPos(e.target.value as PositionId);
                setPresetId(null);
              }}
              className="w-full rounded-xl border border-panel-2/80 bg-ink/40 px-3 py-2 text-sm text-foam"
            >
              {POSITIONS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </div>
  );
}
