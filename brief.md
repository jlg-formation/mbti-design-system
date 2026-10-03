# Morphing UI — Brief

## Concept

Une page web unique qui présente les **10 composants les plus utilisés dans les design systems**. Dans un coin de l'écran, un panneau contient **4 curseurs MBTI**. Quand on les bouge, l'ensemble du design system se transforme **en continu et en temps réel** pour refléter la personnalité choisie.

Le but est de convaincre : chaque position des curseurs doit produire une interface cohérente et crédible, qui « ressemble » au profil choisi.

## Les 10 composants

1. Button (primaire, secondaire, ghost)
2. Text Input (avec label, placeholder, état d'erreur)
3. Checkbox
4. Radio Group
5. Toggle / Switch
6. Select / Dropdown
7. Date Picker (calendrier)
8. Slider
9. Tabs
10. Modal (ou Card / Alert, au choix)

Chaque composant est présenté dans une section de démo, avec ses états principaux (normal, hover, focus, désactivé), et il est interactif.

## Le panneau MBTI

- 4 curseurs **continus** (pas de valeurs binaires), chacun allant d'un pôle à l'autre.
- Sous chaque curseur : le nom des deux pôles et une courte description de leur effet visuel.
- Affichage du type résultant à 4 lettres (ex. « ENFP ») avec le pourcentage de chaque axe.
- **Pas de bouton « Valider »** : chaque mouvement de curseur met immédiatement l'interface à jour, de façon fluide.
- Un bouton « Aléatoire » et un bouton « Réinitialiser » (position neutre à 50 %).

## Accessible sans connaître le MBTI

Le site doit être compréhensible par quelqu'un qui n'a jamais entendu parler du MBTI.

- **Intro courte en haut de page** (2-3 phrases) : le MBTI est un modèle de personnalité qui décrit chacun selon 4 axes ; ici, on imagine à quoi ressemblerait une interface pour chaque personnalité.
- **Libellés en langage courant** sur chaque curseur, les lettres MBTI ne venant qu'en second :
  - « Énergie : tourné vers les autres (E) ↔ tourné vers soi (I) »
  - « Perception : concret et factuel (S) ↔ imaginatif et abstrait (N) »
  - « Décision : logique et objectif (T) ↔ empathique et humain (F) »
  - « Organisation : planifié et structuré (J) ↔ spontané et flexible (P) »
- **Une phrase d'exemple par pôle**, lisible sans clic (ex. « I : préfère recharger ses batteries seul, au calme »).
- **Une icône d'info (ⓘ)** par axe, qui ouvre une explication un peu plus longue au survol ou au clic : ce que mesure l'axe et pourquoi il change tel aspect visuel.
- **Un portrait en une phrase du profil courant**, mis à jour en direct sous le type à 4 lettres (ex. « ENFP — enthousiaste, créatif, toujours partant pour une nouvelle idée »). Les 16 profils ont chacun un surnom et une description courte.
- **Pas de jargon** : on évite les termes comme « fonctions cognitives » et on n'oublie pas de rappeler que le MBTI est un modèle ludique, pas un diagnostic scientifique.

## Correspondance axes → style (interprétation libre)

Le MBTI ne définit rien de visuel. Les correspondances ci-dessous sont un choix créatif, pensé pour être parlant.

### E ↔ I — Extraversion / Introversion (énergie, présence)
- **E** : couleurs saturées et lumineuses, composants plus grands, espacements généreux, graisse typographique forte, ombres marquées, légère lueur (glow).
- **I** : palette sourde et désaturée, composants compacts, typo légère, ombres quasi absentes, interface discrète.

### S ↔ N — Sensation / Intuition (concret vs abstrait)
- **S** : aplats de couleur, palette monochrome ou analogue, formes symétriques, bordures nettes, rien de superflu.
- **N** : dégradés, palette complémentaire ou inattendue, effets de verre (backdrop-blur), rayons asymétriques, motifs décoratifs.

### T ↔ F — Pensée / Sentiment (logique vs émotion)
- **T** : teintes froides (bleus, gris), coins vifs, typo géométrique et rigoureuse, contrastes francs, bordures fines.
- **F** : teintes chaudes (corail, rose, pêche), coins très arrondis, typo douce et « casual », ombres diffuses et colorées.

### J ↔ P — Jugement / Perception (structure vs spontanéité)
- **J** : alignements stricts, grille régulière, animations courtes et sobres (ease-out), aucun décalage.
- **P** : animations élastiques avec rebond (spring / overshoot), légères rotations aléatoires des cartes, typo inclinée, espacement des lettres plus libre, côté ludique.

## Variables à faire varier (le plus possible)

Toutes doivent être **interpolées en continu** à partir de la valeur des 4 curseurs :

- **Couleurs** : teinte, saturation, luminosité, contraste, couleur d'accent, couleur de fond, dégradés
- **Formes** : border-radius (y compris asymétrique), épaisseur et style de bordure
- **Typographie** : graisse, inclinaison, caractère « casual », taille, interlignage, letter-spacing (via une **police variable**, par ex. *Recursive* avec ses axes `wght`, `slnt`, `CASL`, pour une interpolation vraiment continue)
- **Profondeur** : ombres (décalage, flou, opacité, couleur), glow, backdrop-blur
- **Espacements** : padding, gap, densité générale, échelle des composants
- **Mouvement** : durée des transitions, courbe d'easing (paramètres de cubic-bezier interpolés, avec overshoot côté P), amplitude des effets au hover
- **Désordre** : rotation et décalage léger des éléments (côté P), régularité de la grille

## Technique

- **React + Vite** (TypeScript bienvenu).
- Le style repose sur des **variables CSS** (design tokens) définies sur `:root`, recalculées en JavaScript à chaque mouvement de curseur.
- Les composants consomment uniquement ces variables. Pas de librairie UI externe : les 10 composants sont codés à la main.
- Le rendu doit rester fluide (60 fps) pendant le déplacement des curseurs.

## Critères de réussite

- Les 10 composants fonctionnent et réagissent tous aux 4 curseurs.
- Les changements sont continus, sans saut visuel ni bouton de validation.
- Les profils extrêmes (ex. ESTJ à 100 % vs INFP à 100 %) produisent des interfaces radicalement différentes et immédiatement reconnaissables.
- La position neutre (50 % partout) donne un design system sobre et équilibré.
- Un visiteur qui ne connaît pas le MBTI comprend en quelques secondes ce que représente chaque curseur.
