export interface AchievementDef {
  key: string;
  title: string;
  description: string;
  icon: string; // Ionicons name
  category: 'streak' | 'health' | 'money' | 'craving' | 'journal';
}

export const ACHIEVEMENTS: AchievementDef[] = [
  // Streak milestones
  { key: 'streak_1d', title: 'First Step', description: '1 day nicotine-free', icon: 'footsteps', category: 'streak' },
  { key: 'streak_3d', title: 'Three Strong', description: '3 days nicotine-free', icon: 'flame', category: 'streak' },
  { key: 'streak_1w', title: 'One Week Wonder', description: '1 week nicotine-free', icon: 'star', category: 'streak' },
  { key: 'streak_2w', title: 'Two Week Triumph', description: '2 weeks nicotine-free', icon: 'star-half', category: 'streak' },
  { key: 'streak_1m', title: 'Monthly Master', description: '1 month nicotine-free', icon: 'medal', category: 'streak' },
  { key: 'streak_3m', title: 'Quarter Champion', description: '3 months nicotine-free', icon: 'diamond', category: 'streak' },
  { key: 'streak_6m', title: 'Half Year Hero', description: '6 months nicotine-free', icon: 'shield', category: 'streak' },
  { key: 'streak_1y', title: 'Year of Freedom', description: '1 year nicotine-free', icon: 'trophy', category: 'streak' },

  // Money milestones
  { key: 'money_50', title: 'First Fifty', description: 'Saved $50', icon: 'wallet', category: 'money' },
  { key: 'money_100', title: 'Hundred Club', description: 'Saved $100', icon: 'cash', category: 'money' },
  { key: 'money_250', title: 'Quarter Grand', description: 'Saved $250', icon: 'card', category: 'money' },
  { key: 'money_500', title: 'Half Grand', description: 'Saved $500', icon: 'trending-up', category: 'money' },
  { key: 'money_1000', title: 'Thousand Saver', description: 'Saved $1,000', icon: 'sparkles', category: 'money' },

  // Craving warrior
  { key: 'craving_10', title: 'Craving Fighter', description: 'Resisted 10 cravings', icon: 'shield-checkmark', category: 'craving' },
  { key: 'craving_25', title: 'Craving Warrior', description: 'Resisted 25 cravings', icon: 'flash', category: 'craving' },
  { key: 'craving_50', title: 'Craving Champion', description: 'Resisted 50 cravings', icon: 'ribbon', category: 'craving' },
  { key: 'craving_100', title: 'Craving Legend', description: 'Resisted 100 cravings', icon: 'star', category: 'craving' },

  // Journal milestones
  { key: 'journal_7', title: 'Reflective Mind', description: '7 journal entries', icon: 'book', category: 'journal' },
  { key: 'journal_30', title: 'Dedicated Writer', description: '30 journal entries', icon: 'pencil', category: 'journal' },
  { key: 'journal_100', title: 'Journal Master', description: '100 journal entries', icon: 'library', category: 'journal' },
];

export function getAchievementDef(key: string): AchievementDef | undefined {
  return ACHIEVEMENTS.find((a) => a.key === key);
}
