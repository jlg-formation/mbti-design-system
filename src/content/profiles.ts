import type { Axes } from '../tokens/types';

export interface Profile {
  code: string;
  nickname: string;
  description: string;
}

export const PROFILES: Profile[] = [
  { code: 'ISTJ', nickname: 'Le gardien méthodique', description: 'Fiable et rigoureux, attaché aux faits et aux engagements tenus.' },
  { code: 'ISFJ', nickname: 'Le protecteur attentionné', description: 'Discret et dévoué, toujours là pour prendre soin des autres.' },
  { code: 'INFJ', nickname: 'Le confident visionnaire', description: 'Réservé et idéaliste, guidé par des convictions profondes.' },
  { code: 'INTJ', nickname: 'Le stratège', description: 'Indépendant et exigeant, avec un plan pour chaque chose.' },
  { code: 'ISTP', nickname: 'Le bricoleur', description: 'Calme et pratique, curieux de comprendre comment tout fonctionne.' },
  { code: 'ISFP', nickname: 'L’artiste discret', description: 'Sensible et doux, il vit l’instant et l’exprime à sa façon.' },
  { code: 'INFP', nickname: 'Le rêveur idéaliste', description: 'Imaginatif et bienveillant, en quête de sens et d’authenticité.' },
  { code: 'INTP', nickname: 'Le penseur', description: 'Curieux et analytique, toujours en train de décortiquer une idée.' },
  { code: 'ESTP', nickname: 'Le fonceur', description: 'Énergique et direct, il préfère agir plutôt que discuter.' },
  { code: 'ESFP', nickname: 'L’animateur', description: 'Spontané et chaleureux, il transforme chaque moment en fête.' },
  { code: 'ENFP', nickname: 'L’enthousiaste', description: 'Créatif et chaleureux, toujours partant pour une nouvelle idée.' },
  { code: 'ENTP', nickname: 'Le débatteur', description: 'Vif et provocateur, il adore confronter et tester les idées.' },
  { code: 'ESTJ', nickname: 'L’organisateur', description: 'Efficace et carré, il fait avancer les choses selon les règles.' },
  { code: 'ESFJ', nickname: 'L’hôte bienveillant', description: 'Sociable et serviable, attentif à l’harmonie du groupe.' },
  { code: 'ENFJ', nickname: 'Le mentor', description: 'Charismatique et empathique, il aime faire grandir les autres.' },
  { code: 'ENTJ', nickname: 'Le meneur', description: 'Décidé et ambitieux, il fixe le cap et entraîne l’équipe.' },
];

const LOW = 0.15;
const HIGH = 0.85;

/** Letters at each position of the code map to the left (0) or right (1) pole. */
export function profileAxes(code: string): Axes {
  const [a, b, c, d] = code.toUpperCase();
  return {
    ei: a === 'E' ? LOW : HIGH,
    sn: b === 'S' ? LOW : HIGH,
    tf: c === 'T' ? LOW : HIGH,
    jp: d === 'J' ? LOW : HIGH,
  };
}

/** The dominant pole wins; exactly 50 % goes to the left letter. */
export function typeCode(axes: Axes): string {
  return (
    (axes.ei <= 0.5 ? 'E' : 'I') +
    (axes.sn <= 0.5 ? 'S' : 'N') +
    (axes.tf <= 0.5 ? 'T' : 'F') +
    (axes.jp <= 0.5 ? 'J' : 'P')
  );
}

export const findProfile = (code: string) => PROFILES.find((p) => p.code === code)!;
