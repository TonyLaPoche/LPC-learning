import type { HandshapeId } from "@/data/lpc-fr";
import type { FingerState } from "@/lib/handGeometry";
import {
  HANDSHAPE_SIGNATURES,
  scoreHandshapeFingers,
  V_SPAN_MCP_RATIO,
  V_SPAN_PALM_THRESHOLD,
} from "@/lib/handshape";

export type HandshapeMismatchReport = {
  version: 1;
  kind: "lpc-handshape-mismatch";
  exportedAt: string;
  notes: string;
  expected: HandshapeId;
  expectedSignature: FingerState;
  detected: HandshapeId | null;
  detectedConfidence: number;
  observedFingers: FingerState;
  fingerDiffs: Array<{
    finger: keyof FingerState;
    expected: boolean;
    observed: boolean;
    ok: boolean;
  }>;
  scores: Array<{ id: HandshapeId; score: number }>;
  indexMiddleSpan: number;
  vSpanPalmThreshold: number;
  vSpanMcpRatio: number;
  handedness: string | null;
};

export function buildMismatchReport(input: {
  expected: HandshapeId;
  detected: HandshapeId | null;
  detectedConfidence: number;
  observedFingers: FingerState;
  indexMiddleSpan: number;
  handedness: string | null;
}): HandshapeMismatchReport {
  const expectedSignature = { ...HANDSHAPE_SIGNATURES[input.expected] };
  const fingerDiffs = (
    Object.keys(expectedSignature) as Array<keyof FingerState>
  ).map((finger) => {
    const expected = expectedSignature[finger];
    const observed = input.observedFingers[finger];
    return { finger, expected, observed, ok: expected === observed };
  });

  return {
    version: 1,
    kind: "lpc-handshape-mismatch",
    exportedAt: new Date().toISOString(),
    notes:
      "Mismatch détection forme : attendu ≠ détecté. fingerDiffs + scores pour ajuster handshape.ts.",
    expected: input.expected,
    expectedSignature,
    detected: input.detected,
    detectedConfidence: input.detectedConfidence,
    observedFingers: { ...input.observedFingers },
    fingerDiffs,
    scores: scoreHandshapeFingers(input.observedFingers),
    indexMiddleSpan: input.indexMiddleSpan,
    vSpanPalmThreshold: V_SPAN_PALM_THRESHOLD,
    vSpanMcpRatio: V_SPAN_MCP_RATIO,
    handedness: input.handedness,
  };
}

export const FINGER_LABELS: Array<{ key: keyof FingerState; label: string }> = [
  { key: "thumb", label: "Pouce" },
  { key: "index", label: "Index" },
  { key: "middle", label: "Majeur" },
  { key: "ring", label: "Annulaire" },
  { key: "pinky", label: "Auriculaire" },
];
