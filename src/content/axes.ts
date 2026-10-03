import type { AxisKey } from '../tokens/types';

export interface AxisContent {
  key: AxisKey;
  name: string;
  left: { letter: string; label: string; example: string };
  right: { letter: string; label: string; example: string };
  info: { measures: string; visual: string };
  /** Short labels shown live while the slider moves. */
  effects: string[];
}

export const AXES: AxisContent[] = [
  {
    key: 'ei',
    name: 'Énergie',
    left: {
      letter: 'E',
      label: 'tourné vers les autres',
      example: 'Recharge ses batteries entouré de monde, pense à voix haute.',
    },
    right: {
      letter: 'I',
      label: 'tourné vers soi',
      example: 'Préfère recharger ses batteries seul, au calme.',
    },
    info: {
      measures: 'D’où vient votre énergie : des échanges avec les autres, ou des moments passés seul.',
      visual:
        'Côté E, l’interface prend toute la place : fond coloré, couleurs vives, composants plus grands, texte très gras, ombres et lueurs (et, avec T, des ombres pleines décalées façon affiche). Côté I, elle se fait discrète : fond gris papier, palette sourde, composants compacts, typo fine, aucune ombre.',
    },
    effects: ['fond', 'saturation', 'taille', 'graisse', 'ombres', 'lueur'],
  },
  {
    key: 'sn',
    name: 'Perception',
    left: {
      letter: 'S',
      label: 'concret et factuel',
      example: 'Fait confiance aux faits, aux détails et à l’expérience.',
    },
    right: {
      letter: 'N',
      label: 'imaginatif et abstrait',
      example: 'S’intéresse aux idées, aux possibilités et aux « et si ? ».',
    },
    info: {
      measures: 'La manière de recueillir l’information : ce qui est là, concret, ou ce qui pourrait être.',
      visual:
        'Côté S, tout est net : aplats, une seule famille de couleurs, formes symétriques, bordures marquées. Côté N, l’imaginaire s’invite : dégradés, couleurs inattendues, formes colorées qui dérivent en fond, verre dépoli, grain, coins asymétriques.',
    },
    effects: ['dégradés', 'palette', 'verre dépoli', 'formes en fond', 'coins asymétriques'],
  },
  {
    key: 'tf',
    name: 'Décision',
    left: {
      letter: 'T',
      label: 'logique et objectif',
      example: 'Tranche avec la logique, même quand c’est inconfortable.',
    },
    right: {
      letter: 'F',
      label: 'empathique et humain',
      example: 'Tient compte des personnes et des valeurs avant tout.',
    },
    info: {
      measures: 'Ce qui pèse le plus dans une décision : les arguments objectifs, ou l’impact sur les gens.',
      visual:
        'Côté T, l’interface est rigoureuse : teintes froides, coins à angle droit, typo à chasse fixe, titres en capitales espacées. Côté F, elle devient chaleureuse : teintes rosées, coins très arrondis, typo douce et manuscrite, ombres diffuses et colorées.',
    },
    effects: ['teinte', 'arrondis', 'style de typo', 'capitales', 'ombres colorées'],
  },
  {
    key: 'jp',
    name: 'Organisation',
    left: {
      letter: 'J',
      label: 'planifié et structuré',
      example: 'Aime les plans, les listes et les choses terminées.',
    },
    right: {
      letter: 'P',
      label: 'spontané et flexible',
      example: 'Garde ses options ouvertes et improvise volontiers.',
    },
    info: {
      measures: 'Le rapport au cadre : tout prévoir à l’avance, ou s’adapter au fil de l’eau.',
      visual:
        'Côté J, tout est aligné sur une grille visible en fond et les animations sont courtes et sobres. Côté P, les animations rebondissent, les cartes penchent, le texte s’incline et les lettres prennent leurs aises.',
    },
    effects: ['grille', 'rebond', 'cartes penchées', 'italique', 'espacement des lettres'],
  },
];
