/** Packs linguistiques : même code gestuel LPC, contenus différents. */

import type { PhraseDrill, WordDrill } from "@/data/lpc-fr";
import { CONTENT_CH } from "@/data/content-ch";
import { CONTENT_FR } from "@/data/content-fr";

export type PackId = "fr" | "ch";

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
    label: "Français",
    short: "FR",
    subtitle: "Vocabulaire France",
  },
  {
    id: "ch",
    label: "Suisse",
    short: "CH",
    subtitle: "Vocabulaire helvétique",
  },
];

const PACK_STORAGE = "cle-lpc-pack-v1";

export function loadPack(): PackId {
  try {
    const raw = localStorage.getItem(PACK_STORAGE);
    if (raw === "ch" || raw === "fr") return raw;
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
  return id === "ch" ? CONTENT_CH : CONTENT_FR;
}
