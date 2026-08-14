import { useCallback, useEffect, useRef, useState } from "react";

export type VoiceActivityStatus =
  | "idle"
  | "requesting"
  | "listening"
  | "denied"
  | "error";

export type VoiceActivityReading = {
  /** Niveau RMS normalisé 0–1 (après gain). */
  level: number;
  /** true si level ≥ seuil pendant au moins holdMs. */
  active: boolean;
  /** Instantané au-dessus du seuil (sans hold). */
  aboveThreshold: boolean;
};

const DEFAULT_THRESHOLD = 0.08;
const DEFAULT_HOLD_MS = 200;

/**
 * Détection d’activité vocale locale (Web Audio) — aucun envoi réseau.
 * Sert de « voice gate » pour valider clé + zone + parole.
 */
export function useVoiceActivity(opts?: {
  threshold?: number;
  holdMs?: number;
  enabled?: boolean;
}) {
  const threshold = opts?.threshold ?? DEFAULT_THRESHOLD;
  const holdMs = opts?.holdMs ?? DEFAULT_HOLD_MS;
  const enabled = opts?.enabled ?? false;

  const [status, setStatus] = useState<VoiceActivityStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [reading, setReading] = useState<VoiceActivityReading>({
    level: 0,
    active: false,
    aboveThreshold: false,
  });

  const streamRef = useRef<MediaStream | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef(0);
  const aboveSinceRef = useRef<number | null>(null);
  const thresholdRef = useRef(threshold);
  const holdMsRef = useRef(holdMs);
  thresholdRef.current = threshold;
  holdMsRef.current = holdMs;

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
    aboveSinceRef.current = null;
    analyserRef.current = null;
    if (ctxRef.current) {
      void ctxRef.current.close().catch(() => undefined);
      ctxRef.current = null;
    }
    if (streamRef.current) {
      for (const t of streamRef.current.getTracks()) t.stop();
      streamRef.current = null;
    }
    setReading({ level: 0, active: false, aboveThreshold: false });
    setStatus("idle");
    setError(null);
  }, []);

  const start = useCallback(async () => {
    stop();
    setStatus("requesting");
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
        video: false,
      });
      streamRef.current = stream;

      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = new AudioCtx();
      ctxRef.current = ctx;
      if (ctx.state === "suspended") await ctx.resume();

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.55;
      source.connect(analyser);
      analyserRef.current = analyser;

      const data = new Uint8Array(analyser.fftSize);

      const tick = (now: number) => {
        const a = analyserRef.current;
        if (!a) return;
        a.getByteTimeDomainData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
          const v = (data[i]! - 128) / 128;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / data.length);
        // Courbe un peu plus lisible pour la jauge UI
        const level = Math.min(1, rms * 2.4);
        const thr = thresholdRef.current;
        const above = level >= thr;

        if (above) {
          if (aboveSinceRef.current == null) aboveSinceRef.current = now;
        } else {
          aboveSinceRef.current = null;
        }
        const held =
          aboveSinceRef.current != null &&
          now - aboveSinceRef.current >= holdMsRef.current;

        setReading((prev) => {
          if (
            Math.abs(prev.level - level) < 0.01 &&
            prev.active === held &&
            prev.aboveThreshold === above
          ) {
            return prev;
          }
          return { level, active: held, aboveThreshold: above };
        });

        rafRef.current = requestAnimationFrame(tick);
      };

      setStatus("listening");
      rafRef.current = requestAnimationFrame(tick);
    } catch (e) {
      stop();
      const name = e instanceof DOMException ? e.name : "";
      if (name === "NotAllowedError" || name === "PermissionDeniedError") {
        setStatus("denied");
        setError("Micro refusé — autorise l’accès dans le navigateur.");
      } else {
        setStatus("error");
        setError(
          e instanceof Error ? e.message : "Impossible d’accéder au micro.",
        );
      }
    }
  }, [stop]);

  useEffect(() => {
    if (!enabled) {
      stop();
      return;
    }
    void start();
    return () => stop();
  }, [enabled, start, stop]);

  return { status, error, reading, start, stop };
}
