import type { HandshapeId, PositionId } from "@/data/lpc-fr";
import { handshapeById, positionById } from "@/data/lpc-fr";
import type { FingerState } from "@/lib/handGeometry";
import {
  HANDSHAPE_SIGNATURES,
  scoreHandshapeFingers,
} from "@/lib/handshape";
import { POSITION_MNEMONICS } from "@/lib/positionCalibration";

export type CueMismatchReport = {
  version: 1;
  kind: "lpc-cue-mismatch";
  exportedAt: string;
  notes: string;
  syllablePreset: string | null;
  expected: {
    handshape: HandshapeId;
    handshapeLabel: string;
    position: PositionId;
    positionLabel: string;
    positionVowels: string[];
    mnemonic: { sounds: string; example: string };
  };
  detected: {
    handshape: HandshapeId | null;
    handConfidence: number;
    position: PositionId | null;
    positionConfidence: number;
  };
  match: {
    hand: boolean;
    position: boolean;
    all: boolean;
  };
  expectedSignature: FingerState;
  observedFingers: FingerState;
  fingerDiffs: Array<{
    finger: keyof FingerState;
    expected: boolean;
    observed: boolean;
    ok: boolean;
  }>;
  handshapeScores: Array<{ id: HandshapeId; score: number }>;
  indexMiddleSpan: number;
  handedness: string | null;
};

export function buildCueMismatchReport(input: {
  syllablePreset: string | null;
  expectedHandshape: HandshapeId;
  expectedPosition: PositionId;
  detectedHandshape: HandshapeId | null;
  handConfidence: number;
  detectedPosition: PositionId | null;
  positionConfidence: number;
  matchHand: boolean;
  matchPosition: boolean;
  matchAll: boolean;
  observedFingers: FingerState;
  indexMiddleSpan: number;
  handedness: string | null;
}): CueMismatchReport {
  const hs = handshapeById(input.expectedHandshape);
  const pos = positionById(input.expectedPosition);
  const expectedSignature = { ...HANDSHAPE_SIGNATURES[input.expectedHandshape] };
  const fingerDiffs = (
    Object.keys(expectedSignature) as Array<keyof FingerState>
  ).map((finger) => {
    const expected = expectedSignature[finger];
    const observed = input.observedFingers[finger];
    return { finger, expected, observed, ok: expected === observed };
  });

  return {
    version: 1,
    kind: "lpc-cue-mismatch",
    exportedAt: new Date().toISOString(),
    notes:
      "Mismatch clé complète (forme × zone) : utile pour ajuster handshape.ts / cuePosition / zones.",
    syllablePreset: input.syllablePreset,
    expected: {
      handshape: input.expectedHandshape,
      handshapeLabel: hs.label,
      position: input.expectedPosition,
      positionLabel: pos.label,
      positionVowels: [...pos.vowels],
      mnemonic: POSITION_MNEMONICS[input.expectedPosition],
    },
    detected: {
      handshape: input.detectedHandshape,
      handConfidence: input.handConfidence,
      position: input.detectedPosition,
      positionConfidence: input.positionConfidence,
    },
    match: {
      hand: input.matchHand,
      position: input.matchPosition,
      all: input.matchAll,
    },
    expectedSignature,
    observedFingers: { ...input.observedFingers },
    fingerDiffs,
    handshapeScores: scoreHandshapeFingers(input.observedFingers),
    indexMiddleSpan: input.indexMiddleSpan,
    handedness: input.handedness,
  };
}
