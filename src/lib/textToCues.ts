/**
 * Texte FR → clés LPC (approximation pédagogique).
 * Pas un équivalent TextCueS / formation certifiante.
 */

import type { HandshapeId, PositionId } from "@/data/lpc-fr";

export type CueToken = {
  syllable: string;
  handshape: HandshapeId;
  position: PositionId;
};

export type TextToCuesResult = {
  keys: CueToken[];
  words: string[];
  warnings: string[];
};

/** Voyelles / digraphes → position (plus longs d’abord) */
const VOWEL_RULES: Array<{ g: string; pos: PositionId }> = [
  { g: "eau", pos: "side" },
  { g: "ain", pos: "chin" },
  { g: "ein", pos: "chin" },
  { g: "aim", pos: "chin" },
  { g: "eim", pos: "chin" },
  { g: "oin", pos: "chin" },
  { g: "ien", pos: "chin" },
  { g: "an", pos: "chin" },
  { g: "en", pos: "chin" },
  { g: "am", pos: "chin" },
  { g: "em", pos: "chin" },
  { g: "in", pos: "chin" },
  { g: "im", pos: "chin" },
  { g: "un", pos: "chin" },
  { g: "um", pos: "chin" },
  { g: "on", pos: "cheek" },
  { g: "om", pos: "cheek" },
  { g: "ou", pos: "side" },
  { g: "au", pos: "side" },
  { g: "oi", pos: "throat" }, // /wa/ ≈ w+a pédagogique
  { g: "ui", pos: "mouth" },
  { g: "eu", pos: "cheek" },
  { g: "œu", pos: "cheek" },
  { g: "ai", pos: "mouth" },
  { g: "ei", pos: "mouth" },
  { g: "ay", pos: "mouth" },
  { g: "oy", pos: "side" },
  { g: "ée", pos: "mouth" },
  { g: "é", pos: "mouth" },
  { g: "è", pos: "mouth" },
  { g: "ê", pos: "mouth" },
  { g: "ë", pos: "mouth" },
  { g: "à", pos: "throat" },
  { g: "â", pos: "throat" },
  { g: "ô", pos: "side" },
  { g: "î", pos: "mouth" },
  { g: "ï", pos: "mouth" },
  { g: "û", pos: "cheek" },
  { g: "ù", pos: "cheek" },
  { g: "a", pos: "throat" },
  { g: "e", pos: "mouth" },
  { g: "i", pos: "mouth" },
  { g: "o", pos: "side" },
  { g: "u", pos: "cheek" },
  { g: "y", pos: "mouth" },
];

const CONS_RULES: Array<{ g: string; shape: HandshapeId }> = [
  { g: "ch", shape: "c7" },
  { g: "gn", shape: "c4" },
  { g: "qu", shape: "c3" },
  { g: "ph", shape: "c2" },
  { g: "gu", shape: "c4" },
  { g: "ç", shape: "c5" },
  { g: "p", shape: "c1" },
  { g: "b", shape: "c5" },
  { g: "t", shape: "c2" },
  { g: "d", shape: "c1" },
  { g: "k", shape: "c3" },
  { g: "m", shape: "c2" },
  { g: "n", shape: "c3" },
  { g: "f", shape: "c2" },
  { g: "v", shape: "c6" },
  { g: "s", shape: "c5" },
  { g: "z", shape: "c6" },
  { g: "l", shape: "c3" },
  { g: "r", shape: "c4" },
  { g: "j", shape: "c1" },
  { g: "w", shape: "c7" },
  { g: "x", shape: "c5" },
  { g: "h", shape: "c6" },
];

function consonantAt(
  word: string,
  i: number,
): { shape: HandshapeId; len: number; g: string } | null {
  const rest = word.slice(i);
  // c soft / hard
  if (rest.startsWith("c")) {
    const next = rest[1];
    if (next && "eéiîy".includes(next)) {
      return { shape: "c5", len: 1, g: "c" };
    }
    return { shape: "c3", len: 1, g: "c" };
  }
  // g soft / hard
  if (rest.startsWith("g") && !rest.startsWith("gu") && !rest.startsWith("gn")) {
    const next = rest[1];
    if (next && "eéiîy".includes(next)) {
      return { shape: "c1", len: 1, g: "g" };
    }
    return { shape: "c4", len: 1, g: "g" };
  }
  for (const r of CONS_RULES) {
    if (word.startsWith(r.g, i)) {
      return { shape: r.shape, len: r.g.length, g: r.g };
    }
  }
  return null;
}

function vowelAt(
  word: string,
  i: number,
): { pos: PositionId; len: number; g: string } | null {
  for (const r of VOWEL_RULES) {
    if (word.startsWith(r.g, i)) {
      return { pos: r.pos, len: r.g.length, g: r.g };
    }
  }
  return null;
}

function stripMuteE(word: string): string {
  if (word.length <= 2) return word;
  if (!word.endsWith("e")) return word;
  const before = word[word.length - 2]!;
  if ("aeiouyàâéèêëïîôùûü".includes(before)) return word;
  // e muet final fréquent
  return word.slice(0, -1);
}

function cueWord(raw: string): CueToken[] {
  let word = raw.replace(/'/g, "");
  if (!word) return [];
  word = stripMuteE(word);

  const keys: CueToken[] = [];
  let i = 0;

  while (i < word.length) {
    // onset consonants
    let shape: HandshapeId = "c6"; // voyelle seule
    let onset = "";
    while (i < word.length) {
      const c = consonantAt(word, i);
      if (!c) break;
      shape = c.shape;
      onset += c.g;
      i += c.len;
      // garder la dernière consonne de l’attaque pour la forme
    }

    const v = vowelAt(word, i);
    if (!v) {
      // consonne orpheline : schwa pédagogique
      if (onset) {
        keys.push({
          syllable: onset,
          handshape: shape,
          position: "throat",
        });
      } else {
        i += 1; // caractère inconnu
      }
      continue;
    }

    const syllable = onset + v.g;
    // oi pédagogique : forme w (c7)
    const handshape: HandshapeId =
      v.g === "oi" ? "c7" : onset ? shape : "c6";

    keys.push({
      syllable,
      handshape,
      position: v.pos,
    });
    i += v.len;
  }

  return keys;
}

export function normalizePhrase(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFC")
    .replace(/œ/g, "oe")
    .replace(/æ/g, "ae")
    .replace(/['’]/g, "'")
    .replace(/-/g, " ")
    .replace(/[^a-zàâäéèêëïîôùûüç'\s]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const MAX_KEYS = 28;

export function textToCues(text: string): TextToCuesResult {
  const warnings: string[] = [];
  const normalized = normalizePhrase(text);
  if (!normalized) {
    return { keys: [], words: [], warnings: ["Écris une phrase."] };
  }

  const words = normalized.split(" ").filter(Boolean);
  const keys: CueToken[] = [];

  for (const w of words) {
    keys.push(...cueWord(w));
  }

  if (keys.length === 0) {
    warnings.push("Impossible d’extraire des clés — essaie d’autres mots.");
  }
  if (keys.length > MAX_KEYS) {
    warnings.push(
      `Phrase longue : seules les ${MAX_KEYS} premières clés seront codées.`,
    );
  }

  return {
    keys: keys.slice(0, MAX_KEYS),
    words,
    warnings,
  };
}
