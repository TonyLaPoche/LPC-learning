import type { PositionId } from "@/data/lpc-fr";
import type { FaceAnchors, NormRect } from "@/lib/cuePosition";

/** Rectangle relatif au nez, unités = faceWidth. */
export type RelRect = {
  dx: number;
  dy: number;
  dw: number;
  dh: number;
};

export type ZoneRelMap = Record<PositionId, RelRect[]>;

export type ZoneCalibrationExport = {
  version: 1;
  kind: "lpc-zone-calibration";
  exportedAt: string;
  notes: string;
  referenceAnchors: FaceAnchors;
  zonesAbs: Record<PositionId, NormRect[]>;
  zonesRel: ZoneRelMap;
};

/**
 * Calibration manuelle (2026-08-11) — un seul côté (droite écran / MediaPipe gauche).
 * Œil & côté gauches retirés.
 */
export const CALIBRATED_ZONE_REL: ZoneRelMap = {
  mouth: [
    {
      dx: -0.566957993256535,
      dy: 0.11608051290210772,
      dw: 0.3704269732311074,
      dh: 0.45621485596747174,
    },
  ],
  chin: [
    {
      dx: -0.3813155467155966,
      dy: 0.6096257533659943,
      dw: 0.3204756755243653,
      dh: 0.47174092454330985,
    },
  ],
  throat: [
    {
      dx: -0.1720307070395451,
      dy: 1.3452090675841595,
      dw: 0.4,
      dh: 0.48,
    },
  ],
  // Index 0 de l’export = droite écran (MediaPipe gauche)
  cheek: [
    {
      dx: -0.6129239621060507,
      dy: -0.9118643893917948,
      dw: 0.2171819167115558,
      dh: 0.7149914560347562,
    },
  ],
  side: [
    {
      dx: -1.5393992289097789,
      dy: -0.7106340352326781,
      dw: 0.6561887177897151,
      dh: 2.113849835059181,
    },
  ],
};

export function cloneZoneRel(src: ZoneRelMap = CALIBRATED_ZONE_REL): ZoneRelMap {
  const out = {} as ZoneRelMap;
  for (const id of Object.keys(src) as PositionId[]) {
    out[id] = src[id].map((r) => ({ ...r }));
  }
  return out;
}

export function rectToRel(rect: NormRect, anchors: FaceAnchors): RelRect {
  const fw = anchors.faceWidth;
  return {
    dx: (rect.x - anchors.nose.x) / fw,
    dy: (rect.y - anchors.nose.y) / fw,
    dw: rect.w / fw,
    dh: rect.h / fw,
  };
}

export function relToRect(rel: RelRect, anchors: FaceAnchors): NormRect {
  const fw = anchors.faceWidth;
  return {
    x: anchors.nose.x + rel.dx * fw,
    y: anchors.nose.y + rel.dy * fw,
    w: rel.dw * fw,
    h: rel.dh * fw,
  };
}

/** Reset debug → calibration courante (unilatérale). */
export function zonesFromAlgo(_anchors?: FaceAnchors): ZoneRelMap {
  return cloneZoneRel(CALIBRATED_ZONE_REL);
}

export function zonesToAbs(
  zones: ZoneRelMap,
  anchors: FaceAnchors,
): Record<PositionId, NormRect[]> {
  const out = {} as Record<PositionId, NormRect[]>;
  for (const id of Object.keys(zones) as PositionId[]) {
    out[id] = zones[id].map((r) => relToRect(r, anchors));
  }
  return out;
}

export function buildExport(
  zones: ZoneRelMap,
  anchors: FaceAnchors,
): ZoneCalibrationExport {
  return {
    version: 1,
    kind: "lpc-zone-calibration",
    exportedAt: new Date().toISOString(),
    notes:
      "zonesRel : top-left relatif au nez, unités = faceWidth. Un seul côté (droite écran).",
    referenceAnchors: anchors,
    zonesAbs: zonesToAbs(zones, anchors),
    zonesRel: zones,
  };
}

export const ZONE_ORDER: PositionId[] = [
  "cheek",
  "side",
  "mouth",
  "chin",
  "throat",
];

export const ZONE_COLORS: Record<PositionId, string> = {
  side: "rgba(56, 189, 248, 0.45)",
  chin: "rgba(251, 113, 133, 0.45)",
  mouth: "rgba(45, 212, 191, 0.45)",
  cheek: "rgba(250, 204, 21, 0.45)",
  throat: "rgba(167, 139, 250, 0.45)",
};
