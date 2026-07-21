/** Achievements dérivés de la progression locale. */

import type { ProgressState } from "@/lib/progress";

export type Achievement = {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
};

function countPrefix(completed: string[], prefix: string): number {
  return completed.filter((id) => id.startsWith(prefix)).length;
}

function hasAll(completed: string[], ids: string[]): boolean {
  return ids.every((id) => completed.includes(id));
}

function countMatching(completed: string[], re: RegExp): number {
  return completed.filter((id) => re.test(id)).length;
}

const SHAPE_IDS = [
  "shape-c1",
  "shape-c2",
  "shape-c3",
  "shape-c4",
  "shape-c5",
  "shape-c6",
  "shape-c7",
  "shape-c8",
];

const POS_IDS = [
  "pos-side",
  "pos-chin",
  "pos-mouth",
  "pos-cheek",
  "pos-throat",
];

const SYLLABLE_RE =
  /^(pa|da|mi|tu|ma|la|li|ni|ra|ri|si|sa|ba|ou|va|cha|chi|ya|an|on)$/;

const WORD_RE =
  /^(papa|maman|bonjour|merci|salut|oui|non|eau|lait|pain|chat|ami|ecole|livre)(-\d+)?$/;

const PHRASE_RE =
  /^(bonjour-toi|merci-beaucoup|ca-va|oui-ca-va|au-revoir|je-taime|a-bientot|bonne-nuit)-\d+$/;

export function computeAchievements(
  progress: ProgressState,
  freeVisited: boolean,
): Achievement[] {
  const { xp, completed } = progress;
  const syllableKeys = countMatching(completed, SYLLABLE_RE);
  const wordKeys = countMatching(completed, WORD_RE);
  const phraseKeys = countMatching(completed, PHRASE_RE);

  return [
    {
      id: "first-step",
      title: "Premier pas",
      description: "Valider une première clé",
      unlocked: completed.length >= 1,
    },
    {
      id: "shapes-all",
      title: "Maître des formes",
      description: "Les 8 configurations de doigts",
      unlocked: hasAll(completed, SHAPE_IDS),
    },
    {
      id: "positions-all",
      title: "Cartographe",
      description: "Les 5 zones du visage",
      unlocked: hasAll(completed, POS_IDS),
    },
    {
      id: "syllables-5",
      title: "Syllabeur",
      description: "Valider 5 syllabes",
      unlocked: syllableKeys >= 5,
    },
    {
      id: "syllables-all",
      title: "Clé complète",
      description: "Presque toutes les syllabes (≥ 18)",
      unlocked: syllableKeys >= 18,
    },
    {
      id: "words-5",
      title: "Vocabul’air",
      description: "Au moins 5 clés de mots",
      unlocked: wordKeys >= 5,
    },
    {
      id: "phrases-1",
      title: "Première phrase",
      description: "Valider une clé de phrase",
      unlocked: phraseKeys >= 1,
    },
    {
      id: "phrases-pro",
      title: "Conteur",
      description: "Enchaîner 8 clés de phrases",
      unlocked: phraseKeys >= 8,
    },
    {
      id: "free-explorer",
      title: "Explorateur",
      description: "Ouvrir le mode libre",
      unlocked: freeVisited,
    },
    {
      id: "xp-100",
      title: "Centurion",
      description: "Atteindre 100 XP",
      unlocked: xp >= 100,
    },
    {
      id: "xp-500",
      title: "Semi-pro",
      description: "Atteindre 500 XP",
      unlocked: xp >= 500,
    },
    {
      id: "xp-1000",
      title: "Légende LPC",
      description: "Atteindre 1000 XP",
      unlocked: xp >= 1000,
    },
    {
      id: "dedicated",
      title: "Assidu",
      description: "20 leçons validées",
      unlocked: completed.length >= 20,
    },
    {
      id: "marathon",
      title: "Marathon",
      description: "40 leçons validées",
      unlocked: completed.length >= 40,
    },
    {
      id: "well-rounded",
      title: "Polyvalent",
      description: "Formes + positions + une syllabe",
      unlocked:
        countPrefix(completed, "shape-") >= 4 &&
        countPrefix(completed, "pos-") >= 3 &&
        syllableKeys >= 1,
    },
  ];
}

export function achievementStats(achievements: Achievement[]) {
  const unlocked = achievements.filter((a) => a.unlocked).length;
  return { unlocked, total: achievements.length };
}
