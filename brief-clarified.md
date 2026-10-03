# MBTI Design System — Un design system qui change selon la personnalité

## Contexte

Projet de démo et de portfolio personnel. L'idée : montrer qu'un même design system peut prendre des « personnalités » visuelles très différentes. On s'appuie pour ça sur le MBTI, un modèle de personnalité populaire à 4 axes. Le site doit impressionner visuellement, tout en restant compréhensible pour un visiteur qui ne connaît pas le MBTI.

## Objectif

Une page web unique qui présente **10 composants d'interface courants**. Un panneau contient **4 curseurs MBTI continus**. Quand on bouge un curseur, tout le style des composants se transforme **en temps réel et sans à-coup**. Chaque position doit donner une interface cohérente, crédible et lisible, qui « ressemble » au profil choisi.

## Utilisateurs cibles

- Visiteurs d'un portfolio : recruteurs, designers, développeurs, curieux.
- Aucune connaissance du MBTI supposée.
- Usage sur **ordinateur uniquement**.

## Périmètre fonctionnel

### 1. Les 10 composants de démo

Tous codés à la main, sans librairie UI externe, interactifs, et présentés avec leurs états principaux : normal, survol, focus, désactivé.

1. Button (primaire, secondaire, ghost)
2. Text Input (label, placeholder, état d'erreur)
3. Checkbox
4. Radio Group
5. Toggle / Switch
6. Select / Dropdown
7. Date Picker (calendrier)
8. Slider
9. Tabs
10. Modal (déclenchée par un bouton)

### 2. Panneau MBTI

- Placé dans un coin de l'écran, toujours visible (position fixe).
- 4 curseurs **continus** de 0 à 100 %, d'un pôle à l'autre.
- **Pas de bouton « Valider »** : chaque mouvement met l'interface à jour immédiatement.
- Affichage du type à 4 lettres (ex. « ENFP ») et du pourcentage de chaque axe. La lettre affichée est celle du pôle dominant.
- **Portrait du profil courant**, mis à jour en direct : surnom et description d'une phrase (16 profils rédigés).
- Boutons **Aléatoire** et **Réinitialiser** (tous les axes à 50 %).
- **16 raccourcis de profils** : un clic place les 4 curseurs sur le profil choisi (valeurs franches, ex. 15 % / 85 %), avec une transition animée.

### 3. Compréhension sans connaître le MBTI

- **Intro en haut de page** (2-3 phrases) : ce qu'est le MBTI, et le principe du site.
- **Libellés en langage courant** sur chaque curseur, les lettres venant en second :
  - Énergie : tourné vers les autres (E) ↔ tourné vers soi (I)
  - Perception : concret et factuel (S) ↔ imaginatif et abstrait (N)
  - Décision : logique et objectif (T) ↔ empathique et humain (F)
  - Organisation : planifié et structuré (J) ↔ spontané et flexible (P)
- **Une phrase d'exemple par pôle**, visible sans clic.
- **Une icône ⓘ par axe**, qui affiche au survol ou au clic ce que mesure l'axe et l'effet visuel qu'il produit.
- **Pas de jargon**, et une mention claire : le MBTI est un modèle ludique, pas un outil scientifique.

### 4. Mini-questionnaire « Trouve ton profil »

- Lancé depuis un bouton du panneau, il s'ouvre dans une modale (qui utilise elle-même le design system en cours).
- **8 questions, 2 par axe**, rédigées en langage courant.
- Réponse sur une échelle à 5 niveaux (« pas du tout moi » → « tout à fait moi »).
- Le résultat place les curseurs sur une **valeur continue**, calculée à partir de la moyenne des 2 réponses de chaque axe, puis l'interface se transforme avec une transition animée.

### 5. Mode clair / sombre

- Un interrupteur clair/sombre **indépendant des curseurs**.
- Les tokens de couleur sont calculés pour chaque mode à partir des mêmes valeurs d'axes.

### 6. Partage et mémorisation

- L'état (4 axes + mode clair/sombre) est **sauvegardé dans le localStorage** et **reflété dans l'URL** (paramètres de requête, ex. `?ei=72&sn=30&tf=85&jp=40&theme=dark`).
- Au chargement, l'URL est prioritaire, puis le localStorage, puis les valeurs par défaut (50 %).
- L'URL est mise à jour sans recharger la page et sans créer une entrée d'historique par mouvement de curseur.
- Un bouton « Copier le lien » est disponible.

### 7. Export du thème

- Export des tokens de la position courante sous **deux formats** :
  - **CSS** : un bloc `:root { --… }` avec toutes les variables.
  - **JSON** : les mêmes tokens, sous forme structurée (couleurs, formes, typo, ombres, espacements, mouvement).
- Pour chaque format : **copier dans le presse-papier** et **télécharger le fichier**.

## Correspondance axes → style

Interprétation créative, à rendre aussi parlante que possible.

| Axe | Pôle gauche | Pôle droit |
|---|---|---|
| **E ↔ I** — énergie, présence | **E** : couleurs saturées et lumineuses, composants plus grands, espacements généreux, typo grasse, ombres marquées, glow | **I** : palette sourde, composants compacts, typo légère, ombres quasi absentes, interface discrète |
| **S ↔ N** — concret vs abstrait | **S** : aplats, palette monochrome ou analogue, formes symétriques, bordures nettes | **N** : dégradés, palette complémentaire ou inattendue, effet verre (backdrop-blur), rayons asymétriques, motifs décoratifs |
| **T ↔ F** — logique vs émotion | **T** : teintes froides, coins vifs, typo géométrique, contrastes francs, bordures fines | **F** : teintes chaudes, coins très arrondis, typo douce et « casual », ombres diffuses et colorées |
| **J ↔ P** — structure vs spontanéité | **J** : grille stricte, alignements parfaits, animations courtes en ease-out | **P** : animations élastiques avec rebond, légères rotations des cartes, typo inclinée, letter-spacing plus libre |

### Variables interpolées en continu

- **Couleurs** : teinte, saturation, luminosité, contraste, accent, fond, dégradés
- **Formes** : border-radius (y compris asymétrique), épaisseur et style de bordure
- **Typographie** : police variable **Recursive** (axes `wght`, `slnt`, `CASL`), taille, interlignage, letter-spacing
- **Profondeur** : ombres (décalage, flou, opacité, couleur), glow, backdrop-blur
- **Espacements** : padding, gap, densité, échelle des composants
- **Mouvement** : durée, cubic-bezier interpolé (avec overshoot côté P), amplitude au survol
- **Désordre** : rotation et décalage légers (côté P), régularité de la grille

## Accessibilité

- **Contraste WCAG AA garanti à toute position des curseurs**, en mode clair comme en mode sombre : 4,5:1 pour le texte normal, 3:1 pour le texte large et les éléments d'interface. Les couleurs calculées sont corrigées automatiquement (ajustement de la luminosité) si le seuil n'est pas atteint.
- Les rotations et décalages restent assez faibles pour ne jamais gêner la lecture.
- Navigation au clavier complète (curseurs, composants, modales, questionnaire) et focus toujours visible.
- `prefers-reduced-motion` respecté : rebonds et rotations neutralisés.
- Sémantique et attributs ARIA corrects sur les composants faits main.

## Contraintes techniques

- **React + Vite + TypeScript**.
- Le style repose sur des **variables CSS** définies sur `:root`. Une fonction pure `computeTokens(axes, theme)` calcule toutes les valeurs, qui sont appliquées en JavaScript à chaque mouvement de curseur.
- Les composants ne consomment que ces variables. Aucune librairie UI ni CSS-in-JS lourd.
- Rendu fluide (**60 fps**) pendant le déplacement des curseurs : mise à jour regroupée par `requestAnimationFrame`, sans re-rendu React inutile des composants de démo.
- Police Recursive auto-hébergée ou chargée depuis Google Fonts.
- **Ordinateur uniquement** : mise en page pensée pour 1280 px et plus. En dessous de 1024 px, un message invite à ouvrir le site sur un ordinateur.
- Site **en français uniquement**.

## Tests

- **Tests unitaires (Vitest)** :
  - `computeTokens` : valeurs attendues aux positions extrêmes et neutres, continuité (aucun saut entre deux positions proches).
  - Contraste AA respecté sur un échantillonnage de positions (grille des 4 axes × 2 modes).
  - Calcul du résultat du questionnaire.
  - Lecture et écriture de l'état URL / localStorage.
  - Export CSS / JSON.
- **Tests E2E (Playwright)** :
  - Déplacer un curseur modifie les variables CSS sur `:root`.
  - Les raccourcis de profil, Aléatoire et Réinitialiser fonctionnent.
  - Le questionnaire complet positionne les curseurs.
  - Une URL avec paramètres restaure l'état ; le rechargement restaure l'état du localStorage.
  - La bascule clair/sombre fonctionne.
  - L'export copie et télécharge les fichiers attendus.

## Déploiement

- Hébergement sur **GitHub Pages**.
- Workflow **GitHub Actions** : installation, tests unitaires, tests E2E, build, puis publication sur Pages à chaque push sur `main`.
- `base` de Vite configuré sur le chemin du dépôt.

## Hors périmètre

- Version mobile ou tablette.
- Traduction (autre langue que le français).
- Backend, comptes utilisateurs, sauvegarde côté serveur.
- Questionnaire MBTI « officiel » ou scientifiquement validé.
- Export vers d'autres formats (Figma, Tailwind, Style Dictionary…).

## Critères de succès

- Les 10 composants fonctionnent et réagissent tous aux 4 curseurs.
- Les changements sont continus, sans saut visuel ni bouton de validation, à 60 fps.
- Les profils extrêmes (ex. ESTJ vs INFP à 100 %) donnent des interfaces radicalement différentes et reconnaissables.
- La position neutre (50 % partout) donne un design system sobre et équilibré.
- Un visiteur qui ne connaît pas le MBTI comprend en quelques secondes ce que représente chaque curseur.
- Contraste AA respecté à toute position, dans les deux modes.
- Un lien partagé reproduit exactement le même thème.
- Les exports CSS et JSON sont utilisables tels quels.
- Tous les tests unitaires et E2E passent en CI, et le site est en ligne sur GitHub Pages.

## Points en suspens

- Contenu exact des 16 portraits, des 8 questions du questionnaire et des textes d'aide des axes (à rédiger pendant le développement).
- Nom de domaine personnalisé ou URL GitHub Pages par défaut.
