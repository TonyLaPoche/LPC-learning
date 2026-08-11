import type { PositionId } from "@/data/lpc-fr";
import { positionById } from "@/data/lpc-fr";

/** Ordre pédagogique de l’affiche (haut → bas). */
export const VOWEL_POSITION_ORDER: PositionId[] = [
  "cheek",
  "side",
  "mouth",
  "chin",
  "throat",
];

export const POSITION_MNEMONICS: Record<
  PositionId,
  { sounds: string; example: string }
> = {
  cheek: { sounds: "in · eu", example: "pin bleu" },
  side: { sounds: "a · e · ô", example: "ah ! de l’eau" },
  mouth: { sounds: "i · an · on", example: "dix chansons" },
  chin: { sounds: "è · o · ou", example: "c’est comme vous" },
  throat: { sounds: "é · un · u", example: "chez un duc" },
};

export type PositionMismatchReport = {
  version: 1;
  kind: "lpc-position-mismatch";
  exportedAt: string;
  notes: string;
  expected: PositionId;
  expectedLabel: string;
  expectedVowels: string[];
  mnemonic: { sounds: string; example: string };
  detected: PositionId | null;
  detectedLabel: string | null;
  detectedConfidence: number;
  handshapeDetected: string | null;
  handedness: string | null;
};

export function buildPositionMismatchReport(input: {
  expected: PositionId;
  detected: PositionId | null;
  detectedConfidence: number;
  handshapeDetected: string | null;
  handedness: string | null;
}): PositionMismatchReport {
  const exp = positionById(input.expected);
  const det = input.detected ? positionById(input.detected) : null;
  return {
    version: 1,
    kind: "lpc-position-mismatch",
    exportedAt: new Date().toISOString(),
    notes:
      "Mismatch zone voyelle : attendu ≠ détecté. Servira à ajuster cuePosition / CALIBRATED_ZONE_REL.",
    expected: input.expected,
    expectedLabel: exp.label,
    expectedVowels: [...exp.vowels],
    mnemonic: POSITION_MNEMONICS[input.expected],
    detected: input.detected,
    detectedLabel: det?.label ?? null,
    detectedConfidence: input.detectedConfidence,
    handshapeDetected: input.handshapeDetected,
    handedness: input.handedness,
  };
}
