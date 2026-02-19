export const AFFIRMATIONS = [
  "You're stronger than any craving.",
  "Every minute without nicotine is a victory.",
  "Your body is healing right now.",
  "You deserve to breathe freely.",
  "The hardest part is behind you.",
  "You're not giving something up — you're gaining everything.",
  "Each day gets a little easier.",
  "Your future self will thank you for today.",
  "You're doing this for the people who love you.",
  "Cravings are temporary. Your freedom is permanent.",
  "You've already proven you can do hard things.",
  "Your lungs are thanking you right now.",
  "One day at a time. You've got this.",
  "You're rewriting your story, one day at a time.",
  "The craving will pass whether you give in or not.",
  "You are not your addiction.",
  "Every smoke-free hour is healing you.",
  "You chose freedom. That takes real courage.",
  "Your body is recovering faster than you think.",
  "The best time to quit was years ago. The second best time is now.",
  "You're saving money, time, and your health.",
  "Breathe deep — you can do that now.",
  "You're setting an example for everyone around you.",
  "This moment of strength is building your new life.",
  "You're not missing out. You're leveling up.",
  "Nicotine had its turn. Now it's your turn.",
  "You're already a non-smoker. Believe it.",
  "Today is another day you chose yourself.",
  "Your taste buds are coming back to life.",
  "Freedom feels better than any hit ever could.",
];

export function getDailyAffirmation(daysSinceQuit: number): string {
  const index = daysSinceQuit % AFFIRMATIONS.length;
  return AFFIRMATIONS[index];
}
