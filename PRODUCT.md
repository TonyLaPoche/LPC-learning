# CléLPC — Doc produit

## Vision

Apprendre le LPC (Cued Speech adapté au français) de façon **ludique**, **locale** et **accessible**, avec un coach caméra qui valide formes de main et positions autour du visage.

Publics cibles :

- Parents / entourage d’enfants sourds ou malentendants
- Codeurs en formation
- Curieux / étudiants en sciences du langage
- Plus tard : packs Suisse (contenu), anglais Cued Speech (autre table phonémique)

## LPC en 30 secondes

Le LPC n’est **pas** la LSF. C’est un **code manuel** qui complète la lecture labiale :

- **8 configurations** de doigts → groupes de consonnes
- **5 positions** autour du visage → groupes de voyelles
- Une **clé** = forme × position (souvent 1 syllabe CV)

Exemple : *pa / ba / ma* se ressemblent sur les lèvres ; le LPC les différencie par la forme de main.

> Note MVP : le référentiel gestuel est **pédagogique** (inspiré du code ALPC). Ce n’est pas un substitut à une formation certifiante.

## Références

| Source | URL | Usage |
|--------|-----|--------|
| ALPC | https://alpc.asso.fr/ | Référence associative, clés officielles |
| Coquelicot | https://www.coquelicot.asso.fr/lpc/lpcmain.php | Exercices / vidéos |
| TextCueS | https://auto-cuedspeech.org/textcues.html | Texte → sons → clés |
| Auto-CS / SPPAS | https://autocs.sourceforge.io/ | Pipeline open source |
| Fondation pour l’audition | https://www.fondationpourlaudition.org/ | Vulgarisation |
| Surdités Info Service | https://surdites-info-service.fr/ | Schéma 5×8 |

**LPC Suisse** : même code gestuel que la France francophone ; différencier via packs de **vocabulaire / exemples**, pas un second alphabet manuel.

**Autres langues** : adapter la table phonème → (forme, position) (ex. English Cued Speech).

## Référentiel MVP (`fr-FR`)

### Positions (voyelles)

| Id | Zone | Voyelles (ex.) |
|----|------|----------------|
| `side` | Côté | u, o, ɔ |
| `chin` | Menton | ɛ̃, œ̃, ɑ̃ |
| `mouth` | Bouche | i, e, ɛ |
| `cheek` | Joue | y, ø, ɔ̃ |
| `throat` | Gorge | a, ə, ɑ |

### Configurations (consonnes)

| Id | Forme | Consonnes (ex.) |
|----|-------|-----------------|
| `c1` | Doigts joints | p, d, ʒ |
| `c2` | Index | t, m, f |
| `c3` | Index + majeur | k, n, l |
| `c4` | Index + majeur + annulaire | ʁ, ɡ, ɲ |
| `c5` | Quatre doigts | s, b, ɥ |
| `c6` | Poing | ∅, v, z |
| `c7` | Pouce + index | ʃ, w |
| `c8` | Pouce + index + majeur | j |

## Parcours pédagogique MVP

1. **Formes** — tenir chaque config 1,2 s
2. **Positions** — placer la main dans chaque zone
3. **Syllabes** — combiner (ex. *pa, mi, la*)
4. **Mots** — enchaîner 2–4 clés (*bonjour*, *merci*…)

Modes prévus (post-MVP) : miroir coach, dictée visuelle, arcade rythme, défis quotidiens, sandbox libre.

## Gamification

- XP par réussite maintenue (hold)
- Combo si enchaînement sans erreur
- Leçons « complétées » en localStorage
- Streak quotidien (v1.5)
- Badges Formes / Positions / Premiers mots

## Layout publicité

```
┌─────────┬──────────────────────┬─────────┐
│  Ad L   │   Contenu (cam/jeu)  │  Ad R   │
│ ~160px  │   max ~960px         │ ~160px  │
└─────────┴──────────────────────┴─────────┘
```

- Desktop : rails gauche/droite (placeholders « Pub — v2 »)
- Mobile : pas de rails → slot bas optionnel
- La caméra / leçon ne passe jamais sous la pub

Services v2 candidats : AdSense, régie éthique, partenariat associatif / mécénat.

## Architecture technique

```
Caméra → MediaPipe Hand + Face
       → handshape classifier (doigts étendus)
       → cue position (main vs ancres visage)
       → match vs cible leçon
       → HUD + XP local
```

Réutiliser les patterns CamBateSoloTraining (`useCamera`, perf mobile, cache modèles PWA) **sans** le domaine score solo adulte.

## Roadmap

| Phase | Contenu |
|-------|---------|
| **MVP** (ici) | Shell PWA, pubs placeholders, cam, formes/positions/syllabes/mots FR |
| **v1.5** | Plus de mots, streaks, TextCueS-like offline |
| **v2** | Pubs réelles, pack CH, i18n UI, English CS optionnel |
| **v3** | Miroir coach vidéo, multi-joueurs famille |

## Risques & garde-fous

- Précision webcam ≠ juge parfait → feedback « proche / OK », pas verdict clinique
- Droits schémas / vidéos ALPC → contenus originaux + liens
- Accessibilité : contrastes, textes clairs, pas dépendre uniquement de la couleur
