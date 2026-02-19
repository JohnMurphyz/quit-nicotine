export interface TimelineMilestone {
  id: string;
  title: string;
  description: string;
  minutes: number; // minutes after quit date
  icon: string; // Ionicons name
}

export const TIMELINE_MILESTONES: TimelineMilestone[] = [
  {
    id: 'heart_rate_20min',
    title: 'Heart Rate Normalizes',
    description: 'Your heart rate and blood pressure begin to drop back to normal levels.',
    minutes: 20,
    icon: 'heart',
  },
  {
    id: 'carbon_monoxide_8hr',
    title: 'Carbon Monoxide Drops',
    description: 'Carbon monoxide levels in your blood drop to normal. Oxygen levels increase.',
    minutes: 8 * 60,
    icon: 'cloud-outline',
  },
  {
    id: 'heart_attack_24hr',
    title: 'Heart Attack Risk Decreases',
    description: 'Your risk of heart attack begins to decrease significantly.',
    minutes: 24 * 60,
    icon: 'shield-checkmark',
  },
  {
    id: 'nerve_endings_48hr',
    title: 'Taste & Smell Improve',
    description: 'Nerve endings begin to regrow. Your sense of taste and smell start to improve.',
    minutes: 48 * 60,
    icon: 'restaurant',
  },
  {
    id: 'breathing_72hr',
    title: 'Breathing Easier',
    description: 'Bronchial tubes relax, making breathing easier. Lung capacity begins to increase.',
    minutes: 72 * 60,
    icon: 'leaf',
  },
  {
    id: 'sleep_1week',
    title: 'Sleep Quality Improves',
    description: 'Your sleep patterns begin to normalize. You may feel more rested.',
    minutes: 7 * 24 * 60,
    icon: 'moon',
  },
  {
    id: 'circulation_2weeks',
    title: 'Circulation Improves',
    description: 'Your circulation significantly improves. Walking and exercise become easier.',
    minutes: 14 * 24 * 60,
    icon: 'fitness',
  },
  {
    id: 'lung_function_1month',
    title: 'Lung Function Increasing',
    description: 'Lung function increases up to 30%. Coughing and shortness of breath decrease.',
    minutes: 30 * 24 * 60,
    icon: 'body',
  },
  {
    id: 'coughing_3months',
    title: 'Coughing Decreases',
    description: 'Cilia in the lungs have recovered, reducing coughing and infection risk.',
    minutes: 90 * 24 * 60,
    icon: 'medkit',
  },
  {
    id: 'stress_6months',
    title: 'Stress & Fatigue Reduced',
    description: 'Energy levels rise significantly. Stress and fatigue are noticeably reduced.',
    minutes: 180 * 24 * 60,
    icon: 'sunny',
  },
  {
    id: 'heart_disease_1year',
    title: 'Heart Disease Risk Halved',
    description: 'Your risk of coronary heart disease is now half that of a nicotine user.',
    minutes: 365 * 24 * 60,
    icon: 'heart-circle',
  },
  {
    id: 'stroke_5years',
    title: 'Stroke Risk Equals Non-User',
    description: 'Your risk of stroke is now the same as someone who never used nicotine.',
    minutes: 5 * 365 * 24 * 60,
    icon: 'pulse',
  },
  {
    id: 'lung_cancer_10years',
    title: 'Lung Cancer Risk Halved',
    description: 'Your risk of dying from lung cancer is about half that of a continuing user.',
    minutes: 10 * 365 * 24 * 60,
    icon: 'ribbon',
  },
  {
    id: 'heart_15years',
    title: 'Heart Disease Risk Normal',
    description: 'Your risk of heart disease is now the same as someone who never used nicotine.',
    minutes: 15 * 365 * 24 * 60,
    icon: 'trophy',
  },
];
