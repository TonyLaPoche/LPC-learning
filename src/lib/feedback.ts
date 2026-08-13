/** Feedback pratiquants → JSON + e-mail (terrade.antoine.pro@gmail.com). */

import { APP_VERSION } from "@/lib/version";

export const FEEDBACK_EMAIL = "terrade.antoine.pro@gmail.com";

export type FeedbackCorrectionType =
  | "key_cue"
  | "detection_zone"
  | "word_keys"
  | "other";

export type FeedbackCueSlot = {
  id: string;
  /** Syllabe / son annoncé pour cette clé (ex. « bon », « jour ») */
  syllable: string;
  handshape: string;
  position: string;
};

export type ZoneIssueId =
  | "misplaced"
  | "too_large"
  | "too_small"
  | "false_positive"
  | "false_negative"
  | "other";

export const ZONE_ISSUE_OPTIONS: Array<{ id: ZoneIssueId; label: string }> = [
  { id: "misplaced", label: "Zone mal placée" },
  { id: "too_large", label: "Zone trop large" },
  { id: "too_small", label: "Zone trop petite" },
  { id: "false_positive", label: "Détecte trop souvent (faux positif)" },
  { id: "false_negative", label: "Ne détecte pas assez (faux négatif)" },
  { id: "other", label: "Autre souci de zone" },
];

export type FeedbackCorrection = {
  id: string;
  type: FeedbackCorrectionType;
  /** Syllabe, zone, mot… */
  target: string;
  comment: string;
  /** Clé (forme × zone) — ce que dit l’app */
  appHandshape: string;
  appPosition: string;
  /** Clé proposée */
  proposedHandshape: string;
  proposedPosition: string;
  /** Zone de détection concernée */
  zoneId: string;
  zoneIssue: ZoneIssueId | "";
  /** Mot découpé en clés */
  appKeyCount: number | null;
  proposedKeys: FeedbackCueSlot[];
};

export type FeedbackPayload = {
  app: "CléLPC";
  version: string;
  createdAt: string;
  to: string;
  contact: string;
  pack: string;
  /** Ce qui a été testé / contexte de pratique */
  testedSummary: string;
  /** Retours libres, contact commercial, suggestions */
  freeText: string;
  corrections: FeedbackCorrection[];
};

export function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function emptyCueSlot(): FeedbackCueSlot {
  return {
    id: newId("cue"),
    syllable: "",
    handshape: "",
    position: "",
  };
}

export function emptyCorrection(
  type: FeedbackCorrectionType = "key_cue",
): FeedbackCorrection {
  return {
    id: newId("fb"),
    type,
    target: "",
    comment: "",
    appHandshape: "",
    appPosition: "",
    proposedHandshape: "",
    proposedPosition: "",
    zoneId: "",
    zoneIssue: "",
    appKeyCount: null,
    proposedKeys: type === "word_keys" ? [emptyCueSlot(), emptyCueSlot()] : [],
  };
}

export function isCorrectionFilled(c: FeedbackCorrection): boolean {
  if (c.comment.trim() || c.target.trim()) return true;
  if (c.type === "key_cue") {
    return Boolean(
      c.appHandshape ||
        c.appPosition ||
        c.proposedHandshape ||
        c.proposedPosition,
    );
  }
  if (c.type === "detection_zone") {
    return Boolean(c.zoneId || c.zoneIssue);
  }
  if (c.type === "word_keys") {
    return (
      c.appKeyCount != null ||
      c.proposedKeys.some(
        (k) => k.syllable.trim() || k.handshape || k.position,
      )
    );
  }
  return false;
}

export function buildFeedbackPayload(opts: {
  contact: string;
  pack: string;
  testedSummary: string;
  freeText: string;
  corrections: FeedbackCorrection[];
  version?: string;
}): FeedbackPayload {
  return {
    app: "CléLPC",
    version: opts.version ?? APP_VERSION,
    createdAt: new Date().toISOString(),
    to: FEEDBACK_EMAIL,
    contact: opts.contact.trim(),
    pack: opts.pack,
    testedSummary: opts.testedSummary.trim(),
    freeText: opts.freeText.trim(),
    corrections: opts.corrections.map((c) => ({
      ...c,
      target: c.target.trim(),
      comment: c.comment.trim(),
      proposedKeys: c.proposedKeys.map((k) => ({
        ...k,
        syllable: k.syllable.trim(),
      })),
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

function typeLabel(type: FeedbackCorrectionType): string {
  switch (type) {
    case "key_cue":
      return "Clé (forme / zone)";
    case "detection_zone":
      return "Zone de détection";
    case "word_keys":
      return "Découpage mot → clés";
    default:
      return "Autre";
  }
}

function correctionBullet(c: FeedbackCorrection, index: number): string {
  const head = `${index + 1}. [${typeLabel(c.type)}] ${c.target || "sans cible"}`;
  if (c.type === "word_keys") {
    const keys = c.proposedKeys
      .filter((k) => k.syllable || k.handshape || k.position)
      .map(
        (k, i) =>
          `  clé ${i + 1}: ${k.syllable || "?"} · ${k.handshape || "?"} @ ${k.position || "?"}`,
      )
      .join("\n");
    return [
      head,
      c.appKeyCount != null ? `   App = ${c.appKeyCount} clé(s)` : "",
      keys,
      c.comment ? `   Note: ${c.comment}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }
  if (c.type === "key_cue") {
    return [
      head,
      c.appHandshape || c.appPosition
        ? `   App: ${c.appHandshape || "—"} @ ${c.appPosition || "—"}`
        : "",
      c.proposedHandshape || c.proposedPosition
        ? `   Proposé: ${c.proposedHandshape || "—"} @ ${c.proposedPosition || "—"}`
        : "",
      c.comment ? `   Note: ${c.comment}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }
  if (c.type === "detection_zone") {
    return [
      head,
      c.zoneId ? `   Zone: ${c.zoneId}` : "",
      c.zoneIssue ? `   Problème: ${c.zoneIssue}` : "",
      c.comment ? `   Note: ${c.comment}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }
  return [head, c.comment ? `   Note: ${c.comment}` : ""]
    .filter(Boolean)
    .join("\n");
}

/** Ouvre le client mail avec résumé textuel + consigne d’attache JSON. */
export function openFeedbackMailto(
  payload: FeedbackPayload,
  filename: string,
): void {
  const json = JSON.stringify(payload, null, 2);
  const n = payload.corrections.length;
  const subject = encodeURIComponent(
    n > 0
      ? `CléLPC — feedback (${n} correction${n > 1 ? "s" : ""})`
      : "CléLPC — message / contact",
  );

  const bullets =
    n > 0
      ? payload.corrections.map((c, i) => correctionBullet(c, i)).join("\n")
      : "(aucune correction structurée)";

  const summaryLines = [
    "Bonjour Antoine,",
    "",
    "Retour depuis l’app CléLPC.",
    payload.contact ? `Qui : ${payload.contact}` : "",
    `Pack : ${payload.pack} · v${payload.version}`,
    "",
    "— Ce qui a été testé —",
    payload.testedSummary || "(non précisé)",
    "",
    "— Corrections —",
    bullets,
    "",
    "— Message libre / contact / suggestions —",
    payload.freeText || "(vide)",
    "",
    `Fichier JSON à joindre : ${filename}`,
    "(Téléchargé automatiquement sur cet appareil.)",
    "",
  ].filter((line, i, arr) => {
    // garder les lignes vides utiles pour la lisibilité, sauf doubles en tête
    if (i === 0) return true;
    return !(line === "" && arr[i - 1] === "" && i < 3);
  });

  const withJson =
    json.length < 1400
      ? [...summaryLines, "--- JSON ---", json]
      : summaryLines;

  const body = encodeURIComponent(withJson.join("\n"));
  window.location.href = `mailto:${FEEDBACK_EMAIL}?subject=${subject}&body=${body}`;
}

/** Mailto ultra-simple pour contact commercial / idée (sans JSON). */
export function openSimpleContactMailto(opts: {
  contact: string;
  message: string;
}): void {
  const subject = encodeURIComponent("CléLPC — contact / suggestion");
  const body = encodeURIComponent(
    [
      "Bonjour Antoine,",
      "",
      opts.contact ? `Qui : ${opts.contact}` : "",
      "",
      opts.message.trim() || "(message vide)",
      "",
    ]
      .filter(Boolean)
      .join("\n"),
  );
  window.location.href = `mailto:${FEEDBACK_EMAIL}?subject=${subject}&body=${body}`;
}
