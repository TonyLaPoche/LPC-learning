/**
 * American English Cued Speech — référentiel pédagogique.
 * 8 handshapes × 4 positions (pas de joue, contrairement au LPC FR).
 * Mapping c1…c8 ≈ handshapes 1…8 NCSA (approximation caméra).
 */

import type {
  DrillItem,
  HandshapeDef,
  HandshapeId,
  PositionDef,
  PositionId,
} from "@/data/lpc-fr";

/** Positions CS anglais (4) — `cheek` absent du système EN. */
export const POSITIONS_EN: PositionDef[] = [
  {
    id: "mouth",
    label: "Mouth",
    hint: "At the corner of the mouth / lips",
    vowels: ["ee", "ur"],
  },
  {
    id: "chin",
    label: "Chin",
    hint: "At the chin",
    vowels: ["aw", "ue", "e"],
  },
  {
    id: "throat",
    label: "Throat",
    hint: "At the throat / larynx",
    vowels: ["oo", "i", "a"],
  },
  {
    id: "side",
    label: "Side",
    hint: "Beside the face — consonant alone, /oe/ /ah/ /uh/",
    vowels: ["oe", "ah", "uh", "∅"],
  },
];

export const HANDSHAPES_EN: HandshapeDef[] = [
  {
    id: "c1",
    label: "Handshape 1",
    hint: "Four fingers together (CS #1)",
    consonants: ["d", "p", "zh"],
  },
  {
    id: "c2",
    label: "Handshape 2",
    hint: "Index + middle (CS #2)",
    consonants: ["TH", "k", "v", "z"],
  },
  {
    id: "c3",
    label: "Handshape 3",
    hint: "Index + middle + ring (CS #3)",
    consonants: ["s", "h", "r"],
  },
  {
    id: "c4",
    label: "Handshape 4",
    hint: "Four fingers spread (CS #4)",
    consonants: ["wh", "b", "n"],
  },
  {
    id: "c5",
    label: "Handshape 5",
    hint: "Thumb + fingers / vowel alone (CS #5)",
    consonants: ["m", "t", "f", "∅"],
  },
  {
    id: "c6",
    label: "Handshape 6",
    hint: "Index + thumb (CS #6)",
    consonants: ["w", "sh", "l"],
  },
  {
    id: "c7",
    label: "Handshape 7",
    hint: "Fist variants (CS #7)",
    consonants: ["th", "j", "g"],
  },
  {
    id: "c8",
    label: "Handshape 8",
    hint: "Y-shape / three fingers (CS #8)",
    consonants: ["y", "ng", "ch"],
  },
];

export const SYLLABLE_DRILLS_EN: DrillItem[] = [
  {
    id: "me",
    label: "me",
    display: "me",
    cue: { handshape: "c5", position: "mouth" },
    tip: "m + ee → HS5 + mouth",
  },
  {
    id: "see",
    label: "see",
    display: "see",
    cue: { handshape: "c3", position: "mouth" },
    tip: "s + ee → HS3 + mouth",
  },
  {
    id: "to",
    label: "to",
    display: "to",
    cue: { handshape: "c5", position: "throat" },
    tip: "t + oo → HS5 + throat",
  },
  {
    id: "no",
    label: "no",
    display: "no",
    cue: { handshape: "c4", position: "side" },
    tip: "n + oe → HS4 + side",
  },
  {
    id: "you",
    label: "you",
    display: "you",
    cue: { handshape: "c8", position: "chin" },
    tip: "y + ue → HS8 + chin",
  },
  {
    id: "go",
    label: "go",
    display: "go",
    cue: { handshape: "c7", position: "side" },
    tip: "g + oe → HS7 + side",
  },
  {
    id: "she",
    label: "she",
    display: "she",
    cue: { handshape: "c6", position: "mouth" },
    tip: "sh + ee → HS6 + mouth",
  },
  {
    id: "the",
    label: "the",
    display: "the",
    cue: { handshape: "c2", position: "side" },
    tip: "TH + uh → HS2 + side",
  },
  {
    id: "hi",
    label: "hi",
    display: "hi",
    cue: { handshape: "c3", position: "throat" },
    tip: "h + i → HS3 + throat",
  },
  {
    id: "bye",
    label: "bye",
    display: "bye",
    cue: { handshape: "c4", position: "throat" },
    tip: "b + ie (approx.) → HS4 + throat",
  },
  {
    id: "yes",
    label: "yes",
    display: "yes",
    cue: { handshape: "c8", position: "chin" },
    tip: "y + e → HS8 + chin",
  },
  {
    id: "be",
    label: "be",
    display: "be",
    cue: { handshape: "c4", position: "mouth" },
    tip: "b + ee → HS4 + mouth",
  },
  {
    id: "we",
    label: "we",
    display: "we",
    cue: { handshape: "c6", position: "mouth" },
    tip: "w + ee → HS6 + mouth",
  },
  {
    id: "tea",
    label: "tea",
    display: "tea",
    cue: { handshape: "c5", position: "mouth" },
    tip: "t + ee → HS5 + mouth",
  },
  {
    id: "do",
    label: "do",
    display: "do",
    cue: { handshape: "c1", position: "throat" },
    tip: "d + oo → HS1 + throat",
  },
  {
    id: "so",
    label: "so",
    display: "so",
    cue: { handshape: "c3", position: "side" },
    tip: "s + oe → HS3 + side",
  },
  {
    id: "my",
    label: "my",
    display: "my",
    cue: { handshape: "c5", position: "throat" },
    tip: "m + ie (approx.) → HS5 + throat",
  },
  {
    id: "too",
    label: "too",
    display: "too",
    cue: { handshape: "c5", position: "throat" },
    tip: "t + oo → HS5 + throat",
  },
];

export function handshapeByIdEn(id: HandshapeId): HandshapeDef {
  return HANDSHAPES_EN.find((h) => h.id === id)!;
}

export function positionByIdEn(id: PositionId): PositionDef {
  const p = POSITIONS_EN.find((x) => x.id === id);
  if (p) return p;
  // Fallback si une clé pointe encore sur cheek
  return {
    id,
    label: id,
    hint: "Unused in English CS",
    vowels: [],
  };
}
