/**
 * Texte EN → clés Cued Speech (approximation pédagogique).
 */

import type { HandshapeId, PositionId } from "@/data/lpc-fr";
import type { CueToken, TextToCuesResult } from "@/lib/textToCues";

/** Digraphes voyelles EN → position CS */
const VOWEL_RULES: Array<{ g: string; pos: PositionId }> = [
  { g: "ee", pos: "mouth" },
  { g: "ea", pos: "mouth" },
  { g: "oo", pos: "throat" },
  { g: "ou", pos: "throat" }, // /aʊ/ approx start
  { g: "ow", pos: "side" },
  { g: "oi", pos: "chin" },
  { g: "oy", pos: "chin" },
  { g: "ai", pos: "chin" },
  { g: "ay", pos: "chin" },
  { g: "au", pos: "chin" },
  { g: "aw", pos: "chin" },
  { g: "ue", pos: "chin" },
  { g: "ui", pos: "chin" },
  { g: "ie", pos: "throat" },
  { g: "ey", pos: "mouth" },
  { g: "a", pos: "throat" },
  { g: "e", pos: "chin" },
  { g: "i", pos: "throat" },
  { g: "o", pos: "side" },
  { g: "u", pos: "side" },
  { g: "y", pos: "mouth" },
];

const CONS_RULES: Array<{ g: string; shape: HandshapeId }> = [
  { g: "ch", shape: "c8" },
  { g: "sh", shape: "c6" },
  { g: "th", shape: "c7" }, // unvoiced default; voiced TH ≈ c2
  { g: "wh", shape: "c4" },
  { g: "ng", shape: "c8" },
  { g: "ph", shape: "c5" },
  { g: "ck", shape: "c2" },
  { g: "qu", shape: "c2" },
  { g: "b", shape: "c4" },
  { g: "c", shape: "c2" },
  { g: "d", shape: "c1" },
  { g: "f", shape: "c5" },
  { g: "g", shape: "c7" },
  { g: "h", shape: "c3" },
  { g: "j", shape: "c7" },
  { g: "k", shape: "c2" },
  { g: "l", shape: "c6" },
  { g: "m", shape: "c5" },
  { g: "n", shape: "c4" },
  { g: "p", shape: "c1" },
  { g: "r", shape: "c3" },
  { g: "s", shape: "c3" },
  { g: "t", shape: "c5" },
  { g: "v", shape: "c2" },
  { g: "w", shape: "c6" },
  { g: "x", shape: "c2" },
  { g: "y", shape: "c8" },
  { g: "z", shape: "c2" },
];

function consonantAt(
  word: string,
  i: number,
): { shape: HandshapeId; len: number; g: string } | null {
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

function cueWord(raw: string): CueToken[] {
  const word = raw.toLowerCase().replace(/'/g, "");
  if (!word) return [];

  const keys: CueToken[] = [];
  let i = 0;

  while (i < word.length) {
    let shape: HandshapeId = "c5"; // vowel alone = HS5
    let onset = "";
    while (i < word.length) {
      const c = consonantAt(word, i);
      if (!c) break;
      shape = c.shape;
      onset += c.g;
      i += c.len;
    }

    const v = vowelAt(word, i);
    if (!v) {
      if (onset) {
        keys.push({
          syllable: onset,
          handshape: shape,
          position: "side", // consonant alone
        });
      } else {
        i += 1;
      }
      continue;
    }

    keys.push({
      syllable: onset + v.g,
      handshape: onset ? shape : "c5",
      position: v.pos,
    });
    i += v.len;
  }

  return keys;
}

export function normalizePhraseEn(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFC")
    .replace(/['']/g, "'")
    .replace(/-/g, " ")
    .replace(/[^a-z'\s]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const MAX_KEYS = 28;

export function textToCuesEn(text: string): TextToCuesResult {
  const warnings: string[] = [];
  const normalized = normalizePhraseEn(text);
  if (!normalized) {
    return { keys: [], words: [], warnings: ["Type a phrase."] };
  }

  const words = normalized.split(" ").filter(Boolean);
  const keys: CueToken[] = [];
  for (const w of words) {
    keys.push(...cueWord(w));
  }

  if (keys.length === 0) {
    warnings.push("No cues found — try other words.");
  }
  if (keys.length > MAX_KEYS) {
    warnings.push(`Long phrase: only the first ${MAX_KEYS} cues will be used.`);
  }

  return {
    keys: keys.slice(0, MAX_KEYS),
    words,
    warnings,
  };
}
