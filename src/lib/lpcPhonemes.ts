/**
 * Mapping phonème → forme / position LPC FR (référentiel LfPC / ALPC).
 * Notation ASCII des phonèmes dans le lexique.
 */

import type { HandshapeId, PositionId } from "@/data/lpc-fr";

export type CueToken = {
  syllable: string;
  handshape: HandshapeId;
  position: PositionId;
};

/**
 * Configs 1–8 (ALPC) :
 * 1 index · 2 index+majeur · 3 trois doigts · 4 quatre doigts ·
 * 5 cinq doigts / ∅ · 6 L · 7 pouce+2 · 8 V
 */
const CONSONANT_SHAPE: Record<string, HandshapeId> = {
  p: "c1",
  d: "c1",
  Z: "c1", // ʒ
  k: "c2",
  v: "c2",
  z: "c2",
  s: "c3",
  R: "c3", // ʁ
  b: "c4",
  n: "c4",
  H: "c4", // ɥ
  m: "c5",
  t: "c5",
  f: "c5",
  l: "c6",
  S: "c6", // ʃ
  N: "c6", // ɲ
  w: "c6",
  g: "c7", // ɡ
  j: "c8",
  Ng: "c8", // ŋ (rare en FR)
};

/** Voyelles → position (ALPC) */
const VOWEL_POS: Record<string, PositionId> = {
  // Côté
  a: "side",
  o: "side",
  "9": "side", // œ
  "@": "side", // ə
  // Pommette
  "e~": "cheek", // ɛ̃
  eu: "cheek", // ø
  // Bouche
  i: "mouth",
  "o~": "mouth", // ɔ̃
  "a~": "mouth", // ɑ̃
  // Menton
  E: "chin", // ɛ
  u: "chin",
  O: "chin", // ɔ
  // Gorge
  y: "throat",
  e: "throat",
  "eu~": "throat", // œ̃
};

const EMPTY_SHAPE: HandshapeId = "c5"; // config 5 = aussi voyelle seule
const GLIDES = new Set(["j", "w", "H"]);

const VOWEL_SET = new Set(Object.keys(VOWEL_POS));
const CONS_SET = new Set(Object.keys(CONSONANT_SHAPE));

/** Tokens multi-caractères d’abord */
const PHONE_PATTERN =
  /e~|eu~|a~|o~|eu|Ng|@|9|[aAEeEiIoOuUy]|[pbtdkgmnNflRsvzZSjwhH]/;

export function tokenizePhones(syllablePhones: string): string[] {
  const compact = syllablePhones.replace(/\s+/g, "");
  const out: string[] = [];
  let i = 0;
  while (i < compact.length) {
    const rest = compact.slice(i);
    const m = rest.match(PHONE_PATTERN);
    if (!m || m.index !== 0) {
      i += 1;
      continue;
    }
    out.push(m[0]!);
    i += m[0]!.length;
  }
  return out;
}

function onsetHandshape(phones: string[], vowelIdx: number): HandshapeId {
  let fallback: HandshapeId | null = null;
  for (let i = vowelIdx - 1; i >= 0; i--) {
    const p = phones[i]!;
    if (!CONS_SET.has(p)) continue;
    if (GLIDES.has(p)) {
      fallback ??= CONSONANT_SHAPE[p]!;
      continue;
    }
    return CONSONANT_SHAPE[p]!;
  }
  return fallback ?? EMPTY_SHAPE;
}

/**
 * Une syllabe phonétique → une clé LPC.
 * Ex. ["p","a"] → pa (index + côté) ; coda ignorée pour la forme.
 */
export function syllablePhonesToCue(
  phones: string[],
  display: string,
): CueToken | null {
  if (phones.length === 0) return null;

  let vowelIdx = -1;
  for (let i = 0; i < phones.length; i++) {
    if (VOWEL_SET.has(phones[i]!)) {
      vowelIdx = i;
      break;
    }
  }

  // Consonne seule → côté (voyelle ∅)
  if (vowelIdx < 0) {
    const last = [...phones].reverse().find((p) => CONS_SET.has(p));
    if (!last) return null;
    return {
      syllable: display || last,
      handshape: CONSONANT_SHAPE[last]!,
      position: "side",
    };
  }

  const vowel = phones[vowelIdx]!;
  const position = VOWEL_POS[vowel]!;
  const handshape = onsetHandshape(phones, vowelIdx);

  return {
    syllable: display || phones.join(""),
    handshape,
    position,
  };
}

/**
 * Prononciation syllabée : "p u R . k w a" ou "puR.kwa"
 * + labels optionnels "pour|quoi"
 */
export function phonesToCues(
  phonemic: string,
  displays?: string[],
): CueToken[] {
  const parts = phonemic
    .split(".")
    .map((s) => s.trim())
    .filter(Boolean);

  const keys: CueToken[] = [];
  parts.forEach((part, idx) => {
    const phones = tokenizePhones(part);
    const label = displays?.[idx] ?? part.replace(/\s+/g, "");
    const cue = syllablePhonesToCue(phones, label);
    if (cue) keys.push(cue);
  });
  return keys;
}

export function isKnownPhone(token: string): boolean {
  return VOWEL_SET.has(token) || CONS_SET.has(token);
}
