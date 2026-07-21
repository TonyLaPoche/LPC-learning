/**
 * Mapping phonème → forme / position LPC FR (pédagogique, inspiré ALPC).
 * Notation ASCII des phonèmes dans le lexique.
 */

import type { HandshapeId, PositionId } from "@/data/lpc-fr";

export type CueToken = {
  syllable: string;
  handshape: HandshapeId;
  position: PositionId;
};

/** Consonnes (dernière avant voyelle = forme de la clé) */
const CONSONANT_SHAPE: Record<string, HandshapeId> = {
  p: "c1",
  d: "c1",
  Z: "c1", // ʒ
  t: "c2",
  m: "c2",
  f: "c2",
  k: "c3",
  n: "c3",
  l: "c3",
  R: "c4", // ʁ
  g: "c4",
  N: "c4", // ɲ
  s: "c5",
  b: "c5",
  H: "c5", // ɥ
  v: "c6",
  z: "c6",
  S: "c7", // ʃ
  w: "c7",
  j: "c8",
};

/** Voyelles → position */
const VOWEL_POS: Record<string, PositionId> = {
  u: "side",
  o: "side",
  O: "side", // ɔ
  "e~": "chin", // ɛ̃
  "eu~": "chin", // œ̃
  "a~": "chin", // ɑ̃
  i: "mouth",
  e: "mouth",
  E: "mouth", // ɛ
  y: "cheek",
  eu: "cheek", // ø
  "o~": "cheek", // ɔ̃
  a: "throat",
  "@": "throat", // ə
  A: "throat", // ɑ
};

const VOWEL_SET = new Set(Object.keys(VOWEL_POS));
const CONS_SET = new Set(Object.keys(CONSONANT_SHAPE));

/** Tokens multi-caractères d’abord */
const PHONE_PATTERN =
  /e~|eu~|a~|o~|eu|@|[aAEeEiIoOuUy]|[pbtdkgmnNflRsvzZSjwhH]/g;

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

/**
 * Une syllabe phonétique → une clé LPC.
 * Ex. ["p","u","R"] → pour (forme p, position u) ; coda R ignorée pour la forme.
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

  // Consonne seule (coda) → côté
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

  // Attaque : dernière consonne avant la voyelle
  let handshape: HandshapeId = "c6";
  for (let i = vowelIdx - 1; i >= 0; i--) {
    const p = phones[i]!;
    if (CONS_SET.has(p)) {
      handshape = CONSONANT_SHAPE[p]!;
      break;
    }
  }

  // /wa/ (oi) : souvent codé avec forme w
  if (
    vowelIdx > 0 &&
    phones[vowelIdx - 1] === "w" &&
    (vowel === "a" || vowel === "A")
  ) {
    handshape = "c7";
  }

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
