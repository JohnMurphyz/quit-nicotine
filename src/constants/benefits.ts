export interface BenefitInfo {
  key: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  timelineDays: number;
}

export const BENEFITS: BenefitInfo[] = [
  {
    key: 'Health',
    title: 'Better health',
    description: 'Heart rate & blood pressure normalize, lung function improves',
    icon: '❤️',
    color: '#c4364a',
    timelineDays: 90,
  },
  {
    key: 'Family',
    title: 'Stronger relationships',
    description: 'More present for the people who matter most',
    icon: '👨‍👩‍👧',
    color: '#2563eb',
    timelineDays: 30,
  },
  {
    key: 'Money',
    title: 'More money saved',
    description: 'Keep the cash you used to burn through',
    icon: '💰',
    color: '#16a34a',
    timelineDays: 365,
  },
  {
    key: 'Fitness',
    title: 'Improved fitness',
    description: 'Better endurance, breathing, and workout recovery',
    icon: '💪',
    color: '#ea580c',
    timelineDays: 30,
  },
  {
    key: 'Self-control',
    title: 'Improved self-control',
    description: 'Break the cycle and take back control of your choices',
    icon: '🧠',
    color: '#7c8ea6',
    timelineDays: 21,
  },
  {
    key: 'Appearance',
    title: 'Better appearance',
    description: 'Clearer skin, whiter teeth, and fewer wrinkles',
    icon: '✨',
    color: '#a855f7',
    timelineDays: 60,
  },
  {
    key: 'Smell & taste',
    title: 'Smell & taste restored',
    description: 'Food tastes better and your senses sharpen',
    icon: '👃',
    color: '#b8860b',
    timelineDays: 7,
  },
  {
    key: 'Energy',
    title: 'More energy',
    description: 'Feel less tired and more motivated throughout the day',
    icon: '⚡',
    color: '#ca8a04',
    timelineDays: 14,
  },
  {
    key: 'Longevity',
    title: 'Longer life',
    description: 'Reduce your risk of cancer, heart disease, and stroke',
    icon: '🕊️',
    color: '#0d9488',
    timelineDays: 365,
  },
  {
    key: 'Setting an example',
    title: 'Setting an example',
    description: 'Show others that quitting is possible',
    icon: '🌟',
    color: '#6d28d9',
    timelineDays: 30,
  },
];

const BENEFITS_MAP = new Map(BENEFITS.map((b) => [b.key, b]));

export function getBenefitsForMotivations(motivations: string[]): BenefitInfo[] {
  const result: BenefitInfo[] = [];
  for (const m of motivations) {
    const info = BENEFITS_MAP.get(m);
    if (info) result.push(info);
  }
  return result;
}
