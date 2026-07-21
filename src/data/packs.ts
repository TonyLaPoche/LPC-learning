/** Packs : LPC français vs English Cued Speech (tables différentes). */

import type {
  DrillItem,
  HandshapeDef,
  HandshapeId,
  PhraseDrill,
  PositionDef,
  PositionId,
  WordDrill,
} from "@/data/lpc-fr";
import {
  HANDSHAPES,
  POSITIONS,
  SYLLABLE_DRILLS,
  handshapeById,
  positionById,
} from "@/data/lpc-fr";
import {
  HANDSHAPES_EN,
  POSITIONS_EN,
  SYLLABLE_DRILLS_EN,
  handshapeByIdEn,
  positionByIdEn,
} from "@/data/cs-en";
import { CONTENT_EN } from "@/data/content-en";
import { CONTENT_FR } from "@/data/content-fr";

export type PackId = "fr" | "en";

export type PackMeta = {
  id: PackId;
  label: string;
  short: string;
  subtitle: string;
};

export type PackContent = {
  words: WordDrill[];
  phrases: PhraseDrill[];
};

export const PACKS: PackMeta[] = [
  {
    id: "fr",
    label: "Français (LPC)",
    short: "FR",
    subtitle: "Langue française parlée complétée",
  },
  {
    id: "en",
    label: "English (CS)",
    short: "EN",
    subtitle: "American English Cued Speech",
  },
];

const PACK_STORAGE = "cle-lpc-pack-v1";

export function loadPack(): PackId {
  try {
    const raw = localStorage.getItem(PACK_STORAGE);
    if (raw === "en" || raw === "fr") return raw;
    // Ancien pack Suisse → Français
    if (raw === "ch") {
      localStorage.setItem(PACK_STORAGE, "fr");
      return "fr";
    }
  } catch {
    /* ignore */
  }
  return "fr";
}

export function savePack(id: PackId) {
  localStorage.setItem(PACK_STORAGE, id);
}

export function packById(id: PackId): PackMeta {
  return PACKS.find((p) => p.id === id)!;
}

export function getPackContent(id: PackId): PackContent {
  return id === "en" ? CONTENT_EN : CONTENT_FR;
}

export function getPackHandshapes(id: PackId): HandshapeDef[] {
  return id === "en" ? HANDSHAPES_EN : HANDSHAPES;
}

export function getPackPositions(id: PackId): PositionDef[] {
  return id === "en" ? POSITIONS_EN : POSITIONS;
}

export function getPackSyllables(id: PackId): DrillItem[] {
  return id === "en" ? SYLLABLE_DRILLS_EN : SYLLABLE_DRILLS;
}

export function packHandshape(
  pack: PackId,
  id: HandshapeId,
): HandshapeDef {
  return pack === "en" ? handshapeByIdEn(id) : handshapeById(id);
}

export function packPosition(pack: PackId, id: PositionId): PositionDef {
  return pack === "en" ? positionByIdEn(id) : positionById(id);
}
