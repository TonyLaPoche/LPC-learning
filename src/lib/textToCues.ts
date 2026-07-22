/**
 * Texte FR → clés LPC (approximation pédagogique).
 * Pas un équivalent TextCueS / formation certifiante.
 * Référentiel LfPC / ALPC.
 */

import type { HandshapeId, PositionId } from "@/data/lpc-fr";
import type { PackId } from "@/data/packs";
import { lookupLexiconFr } from "@/data/lexicon-fr";
import { phonesToCues, type CueToken } from "@/lib/lpcPhonemes";
import { textToCuesEn } from "@/lib/textToCuesEn";

export type { CueToken };

export type TextToCuesResult = {
  keys: CueToken[];
  words: string[];
  warnings: string[];
  /** Combien de mots issus du lexique phonétique */
  fromLexicon?: number;
  fromRules?: number;
};

const EMPTY_SHAPE: HandshapeId = "c5";

/** Voyelles / digraphes → position (plus longs d’abord) — LfPC */
const VOWEL_RULES: Array<{ g: string; pos: PositionId }> = [
  { g: "eau", pos: "side" },
  { g: "ain", pos: "cheek" },
  { g: "ein", pos: "cheek" },
  { g: "aim", pos: "cheek" },
  { g: "eim", pos: "cheek" },
  { g: "oin", pos: "cheek" },
  { g: "ien", pos: "cheek" },
  { g: "ent", pos: "mouth" },
  { g: "ant", pos: "mouth" },
  { g: "ont", pos: "mouth" },
  { g: "int", pos: "cheek" },
  { g: "unt", pos: "throat" },
  { g: "and", pos: "mouth" },
  { g: "end", pos: "mouth" },
  { g: "ond", pos: "mouth" },
  { g: "èces", pos: "chin" },
  { g: "èce", pos: "chin" },
  { g: "eces", pos: "chin" },
  { g: "ece", pos: "chin" },
  { g: "és", pos: "throat" },
  { g: "ès", pos: "chin" },
  { g: "es", pos: "chin" },
  { g: "our", pos: "chin" },
  { g: "oir", pos: "side" },
  { g: "eur", pos: "side" },
  { g: "aur", pos: "side" },
  { g: "an", pos: "mouth" },
  { g: "en", pos: "mouth" },
  { g: "am", pos: "mouth" },
  { g: "em", pos: "mouth" },
  { g: "in", pos: "cheek" },
  { g: "im", pos: "cheek" },
  { g: "un", pos: "throat" },
  { g: "um", pos: "throat" },
  { g: "on", pos: "mouth" },
  { g: "om", pos: "mouth" },
  { g: "ou", pos: "chin" },
  { g: "au", pos: "side" },
  { g: "oi", pos: "side" }, // /wa/ → a côté, forme w
  { g: "ui", pos: "mouth" },
  { g: "eu", pos: "cheek" },
  { g: "œu", pos: "side" },
  { g: "ai", pos: "chin" },
  { g: "ei", pos: "chin" },
  { g: "ay", pos: "chin" },
  { g: "oy", pos: "side" },
  { g: "ée", pos: "throat" },
  { g: "é", pos: "throat" },
  { g: "è", pos: "chin" },
  { g: "ê", pos: "chin" },
  { g: "ë", pos: "chin" },
  { g: "à", pos: "side" },
  { g: "â", pos: "side" },
  { g: "ô", pos: "side" },
  { g: "î", pos: "mouth" },
  { g: "ï", pos: "mouth" },
  { g: "û", pos: "throat" },
  { g: "ù", pos: "throat" },
  { g: "a", pos: "side" },
  { g: "e", pos: "throat" },
  { g: "i", pos: "mouth" },
  { g: "o", pos: "side" },
  { g: "u", pos: "throat" }, // /y/ ; « ou » géré plus haut
  { g: "y", pos: "mouth" },
];

/** Consonnes finales souvent muettes (hors liaison). */
const MUTE_FINAL = new Set(["t", "d", "s", "x", "z"]);
const CONS_RULES: Array<{ g: string; shape: HandshapeId }> = [
  { g: "ch", shape: "c6" },
  { g: "gn", shape: "c6" },
  { g: "qu", shape: "c2" },
  { g: "ph", shape: "c5" },
  { g: "gu", shape: "c7" },
  { g: "ç", shape: "c3" },
  { g: "p", shape: "c1" },
  { g: "b", shape: "c4" },
  { g: "t", shape: "c5" },
  { g: "d", shape: "c1" },
  { g: "k", shape: "c2" },
  { g: "m", shape: "c5" },
  { g: "n", shape: "c4" },
  { g: "f", shape: "c5" },
  { g: "v", shape: "c2" },
  { g: "s", shape: "c3" },
  { g: "z", shape: "c2" },
  { g: "l", shape: "c6" },
  { g: "r", shape: "c3" },
  { g: "j", shape: "c1" },
  { g: "w", shape: "c6" },
  { g: "x", shape: "c2" },
  { g: "h", shape: "c5" },
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
      return { shape: "c3", len: 1, g: "c" };
    }
    return { shape: "c2", len: 1, g: "c" };
  }
  // g soft / hard
  if (rest.startsWith("g") && !rest.startsWith("gu") && !rest.startsWith("gn")) {
    const next = rest[1];
    if (next && "eéiîy".includes(next)) {
      return { shape: "c1", len: 1, g: "g" };
    }
    return { shape: "c7", len: 1, g: "g" };
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
  onsetLen = 0,
): { pos: PositionId; len: number; g: string } | null {
  for (const r of VOWEL_RULES) {
    if (!word.startsWith(r.g, i)) continue;
    if (
      (r.g === "aim" ||
        r.g === "ain" ||
        r.g === "eim" ||
        r.g === "ein") &&
      word.startsWith("ent", i + r.g.length)
    ) {
      continue;
    }
    if (
      (r.g === "es" || r.g === "és" || r.g === "ès") &&
      onsetLen > 0
    ) {
      continue;
    }
    return { pos: r.pos, len: r.g.length, g: r.g };
  }
  return null;
}

function stripMuteE(word: string): string {
  if (word.length <= 2) return word;
  if (!word.endsWith("e")) return word;
  const before = word[word.length - 2]!;
  if ("aeiouyàâéèêëïîôùûü".includes(before)) return word;
  return word.slice(0, -1);
}

/** Ignore une consonne finale typiquement muette (ex. t de comment). */
function isMuteFinalCluster(onset: string, atEnd: boolean): boolean {
  if (!atEnd || !onset) return false;
  return [...onset].every((ch) => MUTE_FINAL.has(ch));
}

function cueWord(raw: string): CueToken[] {
  let word = raw.replace(/'/g, "");
  if (!word) return [];
  word = stripMuteE(word);

  const keys: CueToken[] = [];
  let i = 0;

  while (i < word.length) {
    let shape: HandshapeId = EMPTY_SHAPE;
    let onset = "";
    while (i < word.length) {
      const c = consonantAt(word, i);
      if (!c) break;
      shape = c.shape;
      onset += c.g;
      i += c.len;
    }

    const v = vowelAt(word, i, onset.length);
    if (!v) {
      const atEnd = i >= word.length;
      if (onset && isMuteFinalCluster(onset, atEnd)) {
        continue;
      }
      if (onset) {
        keys.push({
          syllable: onset,
          handshape: shape,
          position: "side",
        });
      } else {
        i += 1;
      }
      continue;
    }

    const syllable = onset + v.g;
    const handshape: HandshapeId =
      v.g === "oi" ? "c6" : onset ? shape : EMPTY_SHAPE;

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

/** Orthographe → clés via règles (fallback). */
export function cueWordOrthographic(raw: string): CueToken[] {
  return cueWord(raw);
}

export function textToCues(text: string): TextToCuesResult {
  const warnings: string[] = [];
  const normalized = normalizePhrase(text);
  if (!normalized) {
    return { keys: [], words: [], warnings: ["Écris une phrase."] };
  }

  const words = normalized.split(" ").filter(Boolean);
  const keys: CueToken[] = [];
  let fromLexicon = 0;
  let fromRules = 0;

  for (const w of words) {
    const entry = lookupLexiconFr(w);
    if (entry) {
      const lexKeys = phonesToCues(entry.phones, entry.display);
      if (lexKeys.length > 0) {
        keys.push(...lexKeys);
        fromLexicon += 1;
        continue;
      }
    }
    keys.push(...cueWord(w));
    fromRules += 1;
  }

  if (keys.length === 0) {
    warnings.push("Impossible d’extraire des clés — essaie d’autres mots.");
  }
  if (fromRules > 0) {
    warnings.push(
      fromLexicon > 0
        ? `${fromRules} mot(s) hors dico → règles orthographiques (approx.).`
        : "Hors dico phonétique → règles orthographiques (approximation).",
    );
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
    fromLexicon,
    fromRules,
  };
}

export function textToCuesForPack(
  pack: PackId,
  text: string,
): TextToCuesResult {
  return pack === "en" ? textToCuesEn(text) : textToCues(text);
}
