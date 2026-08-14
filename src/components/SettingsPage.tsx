import { useCallback, useEffect, useState } from "react";
import {
  FACE_ZOOM_DEFAULT,
  FACE_ZOOM_MAX,
  FACE_ZOOM_MIN,
  loadFaceZoom,
  saveFaceZoom,
} from "@/lib/progress";
import {
  hasSavedZoneCalibration,
  resetActiveZoneCalibration,
} from "@/lib/zoneCalibration";

type PermState = "unknown" | "granted" | "denied" | "prompt" | "unsupported";

type SettingsPageProps = {
  onOpenZonePlacement: () => void;
  onOpenZoneEditor: () => void;
  onOpenCookieSettings: () => void;
};

async function queryMediaPerm(
  name: "camera" | "microphone",
): Promise<PermState> {
  try {
    if (!navigator.permissions?.query) return "unsupported";
    const status = await navigator.permissions.query({
      name: name as PermissionName,
    });
    if (
      status.state === "granted" ||
      status.state === "denied" ||
      status.state === "prompt"
    ) {
      return status.state;
    }
    return "unknown";
  } catch {
    return "unsupported";
  }
}

function permLabel(state: PermState): string {
  switch (state) {
    case "granted":
      return "Autorisé";
    case "denied":
      return "Refusé";
    case "prompt":
      return "Pas encore demandé";
    case "unsupported":
      return "Statut inconnu (navigateur)";
    default:
      return "…";
  }
}

function permClass(state: PermState): string {
  switch (state) {
    case "granted":
      return "text-ok";
    case "denied":
      return "text-coral";
    case "prompt":
      return "text-amber-200";
    default:
      return "text-mist";
  }
}

export function SettingsPage({
  onOpenZonePlacement,
  onOpenZoneEditor,
  onOpenCookieSettings,
}: SettingsPageProps) {
  const [cameraPerm, setCameraPerm] = useState<PermState>("unknown");
  const [micPerm, setMicPerm] = useState<PermState>("unknown");
  const [camMsg, setCamMsg] = useState<string | null>(null);
  const [micMsg, setMicMsg] = useState<string | null>(null);
  const [faceZoom, setFaceZoom] = useState(() => loadFaceZoom());
  const [hasCustomZones, setHasCustomZones] = useState(() =>
    hasSavedZoneCalibration(),
  );
  const [zoneMsg, setZoneMsg] = useState<string | null>(null);

  const refreshPerms = useCallback(async () => {
    const [cam, mic] = await Promise.all([
      queryMediaPerm("camera"),
      queryMediaPerm("microphone"),
    ]);
    setCameraPerm(cam);
    setMicPerm(mic);
  }, []);

  useEffect(() => {
    void refreshPerms();
  }, [refreshPerms]);

  const testCamera = async () => {
    setCamMsg(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      stream.getTracks().forEach((t) => t.stop());
      setCamMsg("Caméra OK — accès autorisé.");
      await refreshPerms();
    } catch {
      setCamMsg(
        "Caméra inaccessible. Vérifie les réglages du navigateur / du système.",
      );
      await refreshPerms();
    }
  };

  const testMic = async () => {
    setMicMsg(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      stream.getTracks().forEach((t) => t.stop());
      setMicMsg("Micro OK — accès autorisé (utilisé en preview Voice gate).");
      await refreshPerms();
    } catch {
      setMicMsg(
        "Micro inaccessible. Vérifie les réglages du navigateur / du système.",
      );
      await refreshPerms();
    }
  };

  const resetZoom = () => {
    setFaceZoom(FACE_ZOOM_DEFAULT);
    saveFaceZoom(FACE_ZOOM_DEFAULT);
  };

  const resetZones = () => {
    resetActiveZoneCalibration();
    setHasCustomZones(false);
    setZoneMsg("Calibration perso effacée — zones par défaut réactivées.");
  };

  return (
    <div className="space-y-6 pb-4">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-sky">
          Préférences
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold text-foam">
          Réglages
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-mist">
          Permissions, cadrage et calibration — tout reste sur ton appareil.
        </p>
      </header>

      <section className="space-y-3 rounded-2xl border border-panel-2/70 bg-panel/60 p-4">
        <h2 className="font-display text-lg font-bold text-foam">
          Permissions
        </h2>
        <p className="text-sm text-mist">
          La caméra sert à détecter clés et zones. Le micro n’est demandé que
          pour les tests voix (Voice gate) ou plus tard en initiation.
        </p>

        <div className="space-y-3">
          <div className="rounded-xl border border-panel-2/60 bg-ink/30 p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-semibold text-foam">Caméra</p>
                <p className={`text-xs ${permClass(cameraPerm)}`}>
                  {permLabel(cameraPerm)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => void testCamera()}
                className="rounded-full bg-teal px-4 py-2 text-xs font-bold text-ink"
              >
                Tester / autoriser
              </button>
            </div>
            {camMsg && (
              <p className="mt-2 text-xs text-foam/90" role="status">
                {camMsg}
              </p>
            )}
            {cameraPerm === "denied" && (
              <p className="mt-2 text-xs text-mist">
                Si c’est bloqué : icône cadenas / caméra dans la barre d’adresse
                du navigateur → Autoriser, puis recharge la page.
              </p>
            )}
          </div>

          <div className="rounded-xl border border-panel-2/60 bg-ink/30 p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-semibold text-foam">Microphone</p>
                <p className={`text-xs ${permClass(micPerm)}`}>
                  {permLabel(micPerm)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => void testMic()}
                className="rounded-full border border-sky/40 bg-sky/10 px-4 py-2 text-xs font-semibold text-sky"
              >
                Tester / autoriser
              </button>
            </div>
            {micMsg && (
              <p className="mt-2 text-xs text-foam/90" role="status">
                {micMsg}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-3 rounded-2xl border border-panel-2/70 bg-panel/60 p-4">
        <h2 className="font-display text-lg font-bold text-foam">
          Cadrage caméra
        </h2>
        <p className="text-sm text-mist">
          Zoom sur le visage pendant la pratique (appliqué dès la prochaine
          session).
        </p>
        <label className="block space-y-2">
          <div className="flex justify-between text-xs text-mist">
            <span>Zoom visage</span>
            <span className="tabular-nums text-sky">
              {Math.round(faceZoom * 100)}%
            </span>
          </div>
          <input
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
        </label>
        <button
          type="button"
          onClick={resetZoom}
          className="text-xs text-mist underline-offset-2 hover:text-foam hover:underline"
        >
          Remettre le zoom par défaut ({Math.round(FACE_ZOOM_DEFAULT * 100)}%)
        </button>
      </section>

      <section className="space-y-3 rounded-2xl border border-panel-2/70 bg-panel/60 p-4">
        <h2 className="font-display text-lg font-bold text-foam">
          Zones de détection
        </h2>
        <p className="text-sm text-mist">
          Ajuste les rectangles autour du visage si la détection rate souvent
          (menton / gorge, etc.).
        </p>
        <p className="text-xs text-mist">
          Calibration perso :{" "}
          <span className={hasCustomZones ? "text-teal" : "text-mist"}>
            {hasCustomZones ? "active" : "zones par défaut"}
          </span>
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <button
            type="button"
            onClick={onOpenZonePlacement}
            className="rounded-2xl bg-teal px-4 py-3 text-sm font-bold text-ink"
          >
            Placer les zones
          </button>
          <button
            type="button"
            onClick={onOpenZoneEditor}
            className="rounded-2xl border border-teal/40 bg-teal/10 px-4 py-3 text-sm font-semibold text-teal"
          >
            Éditeur avancé
          </button>
          {hasCustomZones && (
            <button
              type="button"
              onClick={resetZones}
              className="rounded-2xl border border-coral/40 px-4 py-3 text-sm text-coral"
            >
              Réinitialiser
            </button>
          )}
        </div>
        {zoneMsg && (
          <p className="text-xs text-foam" role="status">
            {zoneMsg}
          </p>
        )}
      </section>

      <section className="space-y-3 rounded-2xl border border-panel-2/70 bg-panel/60 p-4">
        <h2 className="font-display text-lg font-bold text-foam">
          Confidentialité
        </h2>
        <p className="text-sm text-mist">
          Mesure d’audience et replay de session (PostHog) — uniquement avec ton
          accord.
        </p>
        <button
          type="button"
          onClick={onOpenCookieSettings}
          className="rounded-2xl border border-sky/40 bg-sky/10 px-4 py-3 text-sm font-semibold text-sky"
        >
          Gérer les cookies
        </button>
      </section>
    </div>
  );
}
