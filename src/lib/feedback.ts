/** Feedback codeurs → JSON à envoyer par e-mail. */

export const FEEDBACK_EMAIL = "terrade.antoine.pro@gmail.com";

export type FeedbackCorrectionType =
  | "cue_correction"
  | "form_label"
  | "bug"
  | "other";

export type FeedbackCorrection = {
  id: string;
  type: FeedbackCorrectionType;
  /** Ex. « ma », « bonjour », « forme Index » */
  target: string;
  /** Ce que l’app affiche aujourd’hui (optionnel) */
  appHandshape: string;
  appPosition: string;
  /** Proposition du codeur */
  proposedHandshape: string;
  proposedPosition: string;
  comment: string;
};

export type FeedbackPayload = {
  app: "CléLPC";
  version: string;
  createdAt: string;
  to: string;
  contact: string;
  pack: string;
  freeText: string;
  corrections: FeedbackCorrection[];
};

export function newCorrectionId(): string {
  return `fb-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function emptyCorrection(): FeedbackCorrection {
  return {
    id: newCorrectionId(),
    type: "cue_correction",
    target: "",
    appHandshape: "",
    appPosition: "",
    proposedHandshape: "",
    proposedPosition: "",
    comment: "",
  };
}

export function buildFeedbackPayload(opts: {
  contact: string;
  pack: string;
  freeText: string;
  corrections: FeedbackCorrection[];
  version?: string;
}): FeedbackPayload {
  return {
    app: "CléLPC",
    version: opts.version ?? "0.1.0",
    createdAt: new Date().toISOString(),
    to: FEEDBACK_EMAIL,
    contact: opts.contact.trim(),
    pack: opts.pack,
    freeText: opts.freeText.trim(),
    corrections: opts.corrections.map((c) => ({
      ...c,
      target: c.target.trim(),
      comment: c.comment.trim(),
    })),
  };
}

export function downloadFeedbackJson(payload: FeedbackPayload): string {
  const json = JSON.stringify(payload, null, 2);
  const blob = new Blob([json], { type: "application/json;charset=utf-8" });
  const stamp = payload.createdAt.slice(0, 19).replace(/[:T]/g, "-");
  const filename = `cle-lpc-feedback-${stamp}.json`;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  return filename;
}

/** Ouvre le client mail avec résumé + JSON (si assez court) ou consigne d’attache. */
export function openFeedbackMailto(
  payload: FeedbackPayload,
  filename: string,
): void {
  const json = JSON.stringify(payload, null, 2);
  const n = payload.corrections.length;
  const subject = encodeURIComponent(
    `CléLPC — retour codeur (${n} correction${n > 1 ? "s" : ""})`,
  );

  const summaryLines = [
    "Bonjour,",
    "",
    "Retour depuis l’app CléLPC.",
    payload.contact ? `Contact : ${payload.contact}` : "",
    `Pack : ${payload.pack}`,
    `Corrections : ${n}`,
    payload.freeText ? `Message libre : ${payload.freeText}` : "",
    "",
    `Fichier joint à joindre manuellement : ${filename}`,
    "(Le fichier JSON a été téléchargé sur cet appareil.)",
    "",
  ].filter(Boolean);

  // Beaucoup de clients limitent la taille du body mailto
  const withJson =
    json.length < 1200
      ? [...summaryLines, "--- JSON ---", json]
      : summaryLines;

  const body = encodeURIComponent(withJson.join("\n"));
  window.location.href = `mailto:${FEEDBACK_EMAIL}?subject=${subject}&body=${body}`;
}
