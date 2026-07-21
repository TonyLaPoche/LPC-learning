# CléLPC

> PWA pour apprendre le **LPC** (Langue française Parlée Complétée) de façon ludique, avec feedback caméra local.

Tu t’entraînes devant ta webcam. Le navigateur suit **main** et **visage** (MediaPipe), compare ta clé (forme × position) à la cible, et enregistre ta progression — entièrement sur l’appareil.

**Live :** [https://tonylapoche.github.io/LPC-learning/](https://tonylapoche.github.io/LPC-learning/)

**Stack alignée sur** [CamBateSoloTraining](../CamBateSoloTraining) : Vite + React + TypeScript + Tailwind + `@mediapipe/tasks-vision` + PWA.

## Confidentialité

- Flux caméra traité **uniquement dans le navigateur**
- Progression en **localStorage**
- Pas de backend dans le MVP

## Lancer en local

```bash
npm install
npm run dev
```

Ouvre `http://localhost:5174/LPC-learning/` (le `base` Vite est celui de GitHub Pages).  
La caméra exige **localhost** ou **HTTPS**.

## PWA

Installable (standalone). Le service worker met en cache l’app + les modèles MediaPipe.

## MVP inclus

1. Accueil + parcours (formes → positions → syllabes → mots)
2. Layout 3 colonnes avec **encarts pub** (placeholders v2)
3. Tracking Main + Visage
4. Exemples photo de formes + feedback temps réel
5. Pack contenu **fr-FR** (clés LPC pédagogiques)
6. Progression locale (XP / leçons complétées)

## Doc produit

Voir [PRODUCT.md](./PRODUCT.md) — références, gamification, roadmap, pubs.

## Déploiement GitHub Pages

Le workflow build `dist/` et le pousse sur la branche **`gh-pages`** à chaque push sur `main`.

**Activation (une fois) :**

1. Ouvre [Settings → Pages](https://github.com/TonyLaPoche/LPC-learning/settings/pages)
2. **Build and deployment → Source** : **Deploy from a branch**
3. **Branch** : `gh-pages` / `/ (root)` → Save  
   *(si `gh-pages` n’existe pas encore : push ce workflow, attends le run vert, puis reviens choisir la branche)*

URL : https://tonylapoche.github.io/LPC-learning/

## Scripts

| Commande          | Rôle             |
|-------------------|------------------|
| `npm run dev`     | Dev server       |
| `npm run build`   | Build production |
| `npm run preview` | Preview du build |
