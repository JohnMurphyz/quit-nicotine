export type SymptomCategory = 'Physical' | 'Oral & Respiratory' | 'Psychological' | 'Cognitive';

export interface SymptomInfo {
  key: string;
  title: string;
  icon: string;
  color: string;
  category: SymptomCategory;
  recoveryDays: number;
  recoveryLabel: string;
}

export const SYMPTOMS: SymptomInfo[] = [
  // Physical
  {
    key: 'elevated_heart_rate',
    title: 'Elevated heart rate & BP',
    icon: '💓',
    color: '#c4364a',
    category: 'Physical',
    recoveryDays: 1,
    recoveryLabel: '~1 day',
  },
  {
    key: 'poor_circulation',
    title: 'Poor circulation',
    icon: '🥶',
    color: '#3b82f6',
    category: 'Physical',
    recoveryDays: 84,
    recoveryLabel: '~12 weeks',
  },
  {
    key: 'dizziness_nausea',
    title: 'Dizziness & nausea',
    icon: '😵‍💫',
    color: '#8b5cf6',
    category: 'Physical',
    recoveryDays: 3,
    recoveryLabel: '~3 days',
  },
  {
    key: 'fatigue',
    title: 'Fatigue & low energy',
    icon: '🔋',
    color: '#64748b',
    category: 'Physical',
    recoveryDays: 28,
    recoveryLabel: '~4 weeks',
  },
  {
    key: 'headaches',
    title: 'Headaches',
    icon: '🤕',
    color: '#ef4444',
    category: 'Physical',
    recoveryDays: 14,
    recoveryLabel: '~2 weeks',
  },
  {
    key: 'tinnitus',
    title: 'Tinnitus',
    icon: '👂',
    color: '#f59e0b',
    category: 'Physical',
    recoveryDays: 28,
    recoveryLabel: '~4 weeks',
  },
  {
    key: 'skin_issues',
    title: 'Skin issues & acne',
    icon: '🧴',
    color: '#ec4899',
    category: 'Physical',
    recoveryDays: 84,
    recoveryLabel: '~12 weeks',
  },
  {
    key: 'hair_thinning',
    title: 'Hair thinning',
    icon: '💇',
    color: '#a16207',
    category: 'Physical',
    recoveryDays: 180,
    recoveryLabel: '~6 months',
  },
  {
    key: 'acid_reflux',
    title: 'Acid reflux & stomach',
    icon: '🫃',
    color: '#d97706',
    category: 'Physical',
    recoveryDays: 28,
    recoveryLabel: '~4 weeks',
  },
  {
    key: 'reduced_sexual_function',
    title: 'Reduced libido',
    icon: '💔',
    color: '#be185d',
    category: 'Physical',
    recoveryDays: 84,
    recoveryLabel: '~12 weeks',
  },
  {
    key: 'restless_legs',
    title: 'Restless legs',
    icon: '🦵',
    color: '#0891b2',
    category: 'Physical',
    recoveryDays: 28,
    recoveryLabel: '~4 weeks',
  },
  // Oral & Respiratory
  {
    key: 'bad_breath',
    title: 'Bad breath & stained teeth',
    icon: '🦷',
    color: '#14b8a6',
    category: 'Oral & Respiratory',
    recoveryDays: 28,
    recoveryLabel: '~4 weeks',
  },
  {
    key: 'bleeding_gums',
    title: 'Bleeding gums',
    icon: '🩸',
    color: '#dc2626',
    category: 'Oral & Respiratory',
    recoveryDays: 28,
    recoveryLabel: '~4 weeks',
  },
  {
    key: 'cough_wheezing',
    title: 'Cough & wheezing',
    icon: '🫁',
    color: '#6366f1',
    category: 'Oral & Respiratory',
    recoveryDays: 270,
    recoveryLabel: '~9 months',
  },
  {
    key: 'shortness_of_breath',
    title: 'Shortness of breath',
    icon: '😮‍💨',
    color: '#0284c7',
    category: 'Oral & Respiratory',
    recoveryDays: 84,
    recoveryLabel: '~12 weeks',
  },
  {
    key: 'dry_throat',
    title: 'Dry throat & phlegm',
    icon: '🗣️',
    color: '#7c3aed',
    category: 'Oral & Respiratory',
    recoveryDays: 28,
    recoveryLabel: '~4 weeks',
  },
  {
    key: 'dulled_smell_taste',
    title: 'Dulled smell & taste',
    icon: '👃',
    color: '#b8860b',
    category: 'Oral & Respiratory',
    recoveryDays: 7,
    recoveryLabel: '~7 days',
  },
  // Psychological
  {
    key: 'restlessness',
    title: 'Restlessness',
    icon: '😶',
    color: '#78716c',
    category: 'Psychological',
    recoveryDays: 28,
    recoveryLabel: '~4 weeks',
  },
  {
    key: 'panic_anxiety',
    title: 'Panic & anxiety',
    icon: '😰',
    color: '#ea580c',
    category: 'Psychological',
    recoveryDays: 28,
    recoveryLabel: '~4 weeks',
  },
  {
    key: 'irritability',
    title: 'Irritability & anger',
    icon: '😤',
    color: '#dc2626',
    category: 'Psychological',
    recoveryDays: 28,
    recoveryLabel: '~4 weeks',
  },
  {
    key: 'depression',
    title: 'Depression & low mood',
    icon: '😔',
    color: '#475569',
    category: 'Psychological',
    recoveryDays: 84,
    recoveryLabel: '~12 weeks',
  },
  {
    key: 'shame',
    title: 'Shame & self-loathing',
    icon: '😞',
    color: '#57534e',
    category: 'Psychological',
    recoveryDays: 84,
    recoveryLabel: '~12 weeks',
  },
  {
    key: 'increased_appetite',
    title: 'Increased appetite',
    icon: '🍽️',
    color: '#16a34a',
    category: 'Psychological',
    recoveryDays: 84,
    recoveryLabel: '~12 weeks',
  },
  // Cognitive
  {
    key: 'poor_concentration',
    title: 'Poor concentration',
    icon: '🎯',
    color: '#2563eb',
    category: 'Cognitive',
    recoveryDays: 28,
    recoveryLabel: '~4 weeks',
  },
  {
    key: 'brain_fog',
    title: 'Brain fog',
    icon: '🌫️',
    color: '#94a3b8',
    category: 'Cognitive',
    recoveryDays: 28,
    recoveryLabel: '~4 weeks',
  },
  {
    key: 'memory_issues',
    title: 'Memory issues',
    icon: '🧩',
    color: '#a855f7',
    category: 'Cognitive',
    recoveryDays: 84,
    recoveryLabel: '~12 weeks',
  },
];

const SYMPTOMS_MAP = new Map(SYMPTOMS.map((s) => [s.key, s]));

const CATEGORY_ORDER: SymptomCategory[] = ['Physical', 'Oral & Respiratory', 'Psychological', 'Cognitive'];

export function getSymptomsForKeys(keys: string[]): SymptomInfo[] {
  const result: SymptomInfo[] = [];
  for (const k of keys) {
    const info = SYMPTOMS_MAP.get(k);
    if (info) result.push(info);
  }
  return result;
}

export function getSymptomsByCategory(): { category: SymptomCategory; symptoms: SymptomInfo[] }[] {
  return CATEGORY_ORDER.map((category) => ({
    category,
    symptoms: SYMPTOMS.filter((s) => s.category === category),
  }));
}
