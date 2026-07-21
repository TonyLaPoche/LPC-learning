/** Contenu pack English Cued Speech — mots & phrases. */

import type { PhraseDrill, WordDrill } from "@/data/lpc-fr";

export const CONTENT_EN = {
  words: [
    {
      id: "hello",
      word: "hello",
      keys: [
        { syllable: "he", handshape: "c3", position: "chin" },
        { syllable: "llo", handshape: "c6", position: "side" },
      ],
    },
    {
      id: "thanks",
      word: "thanks",
      keys: [
        { syllable: "tha", handshape: "c7", position: "throat" },
        { syllable: "nks", handshape: "c2", position: "side" },
      ],
    },
    {
      id: "yes",
      word: "yes",
      keys: [{ syllable: "yes", handshape: "c8", position: "chin" }],
    },
    {
      id: "no",
      word: "no",
      keys: [{ syllable: "no", handshape: "c4", position: "side" }],
    },
    {
      id: "please",
      word: "please",
      keys: [
        { syllable: "plea", handshape: "c1", position: "mouth" },
        { syllable: "se", handshape: "c3", position: "side" },
      ],
    },
    {
      id: "water",
      word: "water",
      keys: [
        { syllable: "wa", handshape: "c6", position: "throat" },
        { syllable: "ter", handshape: "c5", position: "mouth" },
      ],
    },
    {
      id: "milk",
      word: "milk",
      keys: [
        { syllable: "mi", handshape: "c5", position: "throat" },
        { syllable: "lk", handshape: "c6", position: "side" },
      ],
    },
    {
      id: "bread",
      word: "bread",
      keys: [
        { syllable: "brea", handshape: "c4", position: "chin" },
        { syllable: "d", handshape: "c1", position: "side" },
      ],
    },
    {
      id: "cat",
      word: "cat",
      keys: [
        { syllable: "ca", handshape: "c2", position: "throat" },
        { syllable: "t", handshape: "c5", position: "side" },
      ],
    },
    {
      id: "dog",
      word: "dog",
      keys: [
        { syllable: "do", handshape: "c1", position: "chin" },
        { syllable: "g", handshape: "c7", position: "side" },
      ],
    },
    {
      id: "friend",
      word: "friend",
      keys: [
        { syllable: "frie", handshape: "c5", position: "chin" },
        { syllable: "nd", handshape: "c4", position: "side" },
      ],
    },
    {
      id: "school",
      word: "school",
      keys: [
        { syllable: "schoo", handshape: "c3", position: "throat" },
        { syllable: "l", handshape: "c6", position: "side" },
      ],
    },
    {
      id: "book",
      word: "book",
      keys: [
        { syllable: "boo", handshape: "c4", position: "throat" },
        { syllable: "k", handshape: "c2", position: "side" },
      ],
    },
    {
      id: "house",
      word: "house",
      keys: [
        { syllable: "hou", handshape: "c3", position: "throat" },
        { syllable: "se", handshape: "c3", position: "side" },
      ],
    },
    {
      id: "sun",
      word: "sun",
      keys: [
        { syllable: "su", handshape: "c3", position: "side" },
        { syllable: "n", handshape: "c4", position: "side" },
      ],
    },
    {
      id: "mom",
      word: "mom",
      keys: [
        { syllable: "mo", handshape: "c5", position: "chin" },
        { syllable: "m", handshape: "c5", position: "side" },
      ],
    },
    {
      id: "dad",
      word: "dad",
      keys: [
        { syllable: "da", handshape: "c1", position: "throat" },
        { syllable: "d", handshape: "c1", position: "side" },
      ],
    },
    {
      id: "baby",
      word: "baby",
      keys: [
        { syllable: "ba", handshape: "c4", position: "throat" },
        { syllable: "by", handshape: "c4", position: "mouth" },
      ],
    },
    {
      id: "good",
      word: "good",
      keys: [
        { syllable: "goo", handshape: "c7", position: "throat" },
        { syllable: "d", handshape: "c1", position: "side" },
      ],
    },
    {
      id: "night",
      word: "night",
      keys: [
        { syllable: "nigh", handshape: "c4", position: "throat" },
        { syllable: "t", handshape: "c5", position: "side" },
      ],
    },
    {
      id: "day",
      word: "day",
      keys: [{ syllable: "day", handshape: "c1", position: "chin" }],
    },
    {
      id: "love",
      word: "love",
      keys: [
        { syllable: "lo", handshape: "c6", position: "side" },
        { syllable: "ve", handshape: "c2", position: "side" },
      ],
    },
    {
      id: "food",
      word: "food",
      keys: [
        { syllable: "foo", handshape: "c5", position: "throat" },
        { syllable: "d", handshape: "c1", position: "side" },
      ],
    },
    {
      id: "happy",
      word: "happy",
      keys: [
        { syllable: "ha", handshape: "c3", position: "throat" },
        { syllable: "ppy", handshape: "c1", position: "mouth" },
      ],
    },
  ] satisfies WordDrill[],

  phrases: [
    {
      id: "hello-there",
      phrase: "Hello!",
      keys: [
        { syllable: "he", handshape: "c3", position: "chin" },
        { syllable: "llo", handshape: "c6", position: "side" },
      ],
    },
    {
      id: "thank-you",
      phrase: "Thank you",
      keys: [
        { syllable: "tha", handshape: "c7", position: "throat" },
        { syllable: "nk", handshape: "c2", position: "side" },
        { syllable: "you", handshape: "c8", position: "chin" },
      ],
    },
    {
      id: "how-are-you",
      phrase: "How are you?",
      keys: [
        { syllable: "how", handshape: "c3", position: "side" },
        { syllable: "are", handshape: "c5", position: "side" },
        { syllable: "you", handshape: "c8", position: "chin" },
      ],
    },
    {
      id: "i-am-fine",
      phrase: "I am fine",
      keys: [
        { syllable: "I", handshape: "c5", position: "throat" },
        { syllable: "am", handshape: "c5", position: "throat" },
        { syllable: "fine", handshape: "c5", position: "throat" },
      ],
    },
    {
      id: "see-you",
      phrase: "See you",
      keys: [
        { syllable: "see", handshape: "c3", position: "mouth" },
        { syllable: "you", handshape: "c8", position: "chin" },
      ],
    },
    {
      id: "good-morning",
      phrase: "Good morning",
      keys: [
        { syllable: "good", handshape: "c7", position: "throat" },
        { syllable: "mor", handshape: "c5", position: "chin" },
        { syllable: "ning", handshape: "c4", position: "throat" },
      ],
    },
    {
      id: "good-night",
      phrase: "Good night",
      keys: [
        { syllable: "good", handshape: "c7", position: "throat" },
        { syllable: "night", handshape: "c4", position: "throat" },
      ],
    },
    {
      id: "i-love-you",
      phrase: "I love you",
      keys: [
        { syllable: "I", handshape: "c5", position: "throat" },
        { syllable: "love", handshape: "c6", position: "side" },
        { syllable: "you", handshape: "c8", position: "chin" },
      ],
    },
    {
      id: "please-help",
      phrase: "Please help",
      keys: [
        { syllable: "please", handshape: "c1", position: "mouth" },
        { syllable: "help", handshape: "c3", position: "chin" },
      ],
    },
    {
      id: "yes-please",
      phrase: "Yes, please",
      keys: [
        { syllable: "yes", handshape: "c8", position: "chin" },
        { syllable: "please", handshape: "c1", position: "mouth" },
      ],
    },
    {
      id: "no-thanks",
      phrase: "No, thanks",
      keys: [
        { syllable: "no", handshape: "c4", position: "side" },
        { syllable: "thanks", handshape: "c7", position: "throat" },
      ],
    },
    {
      id: "come-here",
      phrase: "Come here",
      keys: [
        { syllable: "come", handshape: "c2", position: "side" },
        { syllable: "here", handshape: "c3", position: "mouth" },
      ],
    },
    {
      id: "lets-go",
      phrase: "Let’s go",
      keys: [
        { syllable: "lets", handshape: "c6", position: "chin" },
        { syllable: "go", handshape: "c7", position: "side" },
      ],
    },
    {
      id: "good-job",
      phrase: "Good job",
      keys: [
        { syllable: "good", handshape: "c7", position: "throat" },
        { syllable: "job", handshape: "c7", position: "chin" },
      ],
    },
  ] satisfies PhraseDrill[],
};
