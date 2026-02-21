import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRef, useState, useCallback } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { AppStackParamList } from '@/src/navigation/types';
import { CONTENT_ITEMS } from '@/src/screens/tabs/ContentScreen';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

type ContentDetailRoute = RouteProp<AppStackParamList, 'ContentDetail'>;
type Nav = NativeStackNavigationProp<AppStackParamList>;

// ── Article content ──────────────────────────────────────────────────
interface Section {
  heading?: string;
  body: string;
}

interface Article {
  title: string;
  readTime: string;
  sections: Section[];
}

const ARTICLES: Record<string, Article> = {
  'why-quit': {
    title: 'Why Quit Nicotine?',
    readTime: '7 min read',
    sections: [
      {
        body: 'Quitting nicotine is a journey home — back to a calm and quiet mind, back to reclaiming your priorities, your health, and your self-respect. The reasons go far beyond avoiding health risks. It\'s about ending a state of permanent chemical slavery.',
      },
      {
        heading: 'Reclaim Your Mind',
        body: 'Nicotine does not relieve stress — it causes it. Stress makes your urine acidic, which flushes nicotine out of your system faster, triggering immediate withdrawal. You interpret the relief of that withdrawal as resolving your stressor, but the original stress remains untouched.\n\nNicotine also destroys concentration. The "Little Monster" — the physical craving — creates a constant, nagging distraction that is only briefly silenced by a fix. Non-users never suffer this interruption to their focus.\n\nQuitting allows you to eventually reach a state of long-term quiet and calm, where entire days pass without your mind ever feeling an urge or wanting for nicotine.',
      },
      {
        heading: 'Your Body Heals Fast',
        body: 'Within 20 minutes of quitting, your blood pressure and heart rate return to normal. Within 12 hours, carbon monoxide levels drop and oxygen levels increase.\n\nWithin 72 hours, your body is 100% nicotine-free. Within three weeks, your brain down-regulates the millions of extra acetylcholine receptors it grew to handle the drug, returning to levels seen in non-smokers.\n\nCilia in your lungs regrow within one to nine months, restoring your body\'s ability to clean its own respiratory system. Quitting ends the daily assault of over 80 known cancer-causing chemicals in smoke — or 28 in smokeless tobacco — and dramatically improves the prognosis for every known disease.',
      },
      {
        heading: 'Reclaim Your Time and Money',
        body: 'Quitting can save a heavy user thousands of dollars every year. A pack-a-day smoker devotes approximately 13.6 forty-hour work weeks per year just to the act of smoking. That\'s an extra hour or more every single day that was previously spent servicing the addiction — time you get back permanently.',
      },
      {
        heading: 'Psychological Freedom',
        body: 'All nicotine addicts, regardless of their method of delivery, are controlled by a chemical clock. Quitting ends the self-imposed slavery of having to ensure a constant supply of a poison.\n\nIt removes the sinister black shadows at the back of the mind — the constant, suppressed fear of what the drug is doing to your health and wealth. Many users despise themselves for being dependent on something they detest. Quitting restores confidence, courage, and self-assurance.',
      },
      {
        heading: 'A Better Life With Others',
        body: 'Nicotine use is increasingly viewed as antisocial. Quitting means you no longer have to feel like a social outcast who must sneak away from meals or events to feed an addiction.\n\nWithin 48 hours, nerve endings begin to heal and your senses of smell and taste return to normal, allowing you to experience the true flavor of food and life.\n\nMany people quit because they don\'t want to set an example that nicotine use is normal or acceptable — especially for their children. Quitting is an act of freedom that ripples outward.',
      },
    ],
  },
  'cravings': {
    title: 'Managing Cravings',
    readTime: '8 min read',
    sections: [
      {
        body: 'Managing cravings is a two-fold process: dismantling the mental perception of nicotine as a "crutch" and navigating the brief physical sensations of withdrawal. The most important rule is the Law of Addiction — **one equals all.** Taking even a single puff re-activates the brain\'s hijacked dopamine pathways and has a 95% probability of causing full relapse. There is no such thing as "just one" fix to bridge a difficult moment.',
      },
      {
        heading: 'Understanding Crave Anatomy',
        body: 'Knowing what a craving actually is reduces the panic that often triggers relapse.\n\n**Duration:** A crave episode typically peaks and begins to subside within **3 to 5 minutes.**\n\n**Frequency:** On the hardest day of recovery (typically day three), the average person experiences about six episodes — totaling only about 30 minutes of real challenge for the entire day.\n\n**Time distortion:** Withdrawal often warps your sense of time, making a three-minute craving feel like it has lasted for hours.\n\n**Physical vs. mental:** The physical sensation (the "Little Monster") is a mild, empty feeling similar to hunger. The intense "AAARGH!" feeling is actually a physical reaction to the mental process of feeling deprived of a supposed pleasure.',
      },
      {
        heading: 'Reframe the Craving',
        body: 'Rather than using willpower to white-knuckle through a craving, change how your mind perceives the urge.\n\n**Rejoice in the pangs.** Instead of moping, think: "I\'m free!" View the craving as the death throes of the Little Monster parasite.\n\n**Remove the crutch illusion.** Remind yourself that nicotine does not relieve stress or boredom — it creates an extra layer of stress that is only briefly relieved by the next dose.\n\n**Brush it off.** Treat the thought of nicotine like a piece of fluff on your shoulder — acknowledge it momentarily, then simply brush it away and continue with your life.',
      },
      {
        heading: 'Real-Time Coping Tools',
        body: 'When a craving arrives, deploy these to navigate the episode:\n\n**The Four As:** Avoid high-risk situations initially. Alter your habits (drink juice instead of coffee). Find Alternatives (cinnamon sticks, gum). Engage in Activities to distract the mind.\n\n**Embrace the crave.** Instead of fighting or running, mentally reach out and "hug" the anxiety energy. Focus on the raw sensation without judgment until it fizzles out.\n\n**The alphabet game.** Say the ABCs, associating each letter with a favorite food or place ("A is for Apple Pie") to occupy your conscious mind until the episode passes.\n\n**Use a clock.** Note the exact time an urge begins to prove to yourself how quickly it actually ends. This combats time distortion directly.\n\n**Read your reasons.** Reach for a pre-written list of reasons for quitting. Reading it during a crisis brings your rational prefrontal cortex back in control of the impulsive limbic mind.',
      },
      {
        heading: 'Stabilize Your Body',
        body: 'Chemical shifts during withdrawal can intensify cravings if not managed:\n\n**Blood sugar:** Nicotine releases stored sugars into the blood. Once you quit, blood sugar swings can feel like cravings. Sip natural fruit juice (like cranberry) for the first three days and eat smaller, more frequent healthy meals.\n\n**Hydration:** Drinking lots of water satisfies the hand-to-mouth habit and provides a subtle, zero-calorie dopamine "aaah" sensation.\n\n**Deep breathing:** Slow, deliberate breathing resets the body to a calmer state and serves as a healthy substitute for the ritual of inhalation.',
      },
      {
        heading: 'A Note on Substitutes',
        body: 'You\'ll find conflicting advice on substitutes. Behavioral guides suggest non-tobacco substitutes like sunflower seeds, cinnamon sticks, or nicotine replacement therapy to manage urges.\n\nMindset-based approaches advise against all substitutes — including candy or NRT — arguing that they keep the mental addiction alive by reinforcing the idea that you\'re making a sacrifice or that a "void" needs to be filled.\n\nThe truth is personal. But either way, remember: **the craving will pass whether you do something about it or not.** Your only job is to not take nicotine.',
      },
    ],
  },
  'timeline': {
    title: 'Recovery Timeline',
    readTime: '7 min read',
    sections: [
      {
        body: 'Recovery from nicotine is a process of rapid physical detoxification followed by a more gradual psychological and emotional readjustment. Your body starts healing the moment you stop — and it never stops getting better.',
      },
      {
        heading: 'Immediate Physical Recovery',
        body: '**Within 20 minutes,** your blood pressure and heart rate return to normal and the temperature of your hands and feet stabilizes.\n\n**At 8 hours,** your body is already 97% nicotine-free. Remaining nicotine drops to about 6% of normal peak daily levels.\n\n**At 12 hours,** blood oxygen levels increase to normal and carbon monoxide drops to normal.\n\n**At 24 hours,** anxieties often peak. Most nicotine has left your system, and the "Little Monster" — the physical dependency — begins to starve.\n\n**At 48 hours,** damaged nerve endings begin to regrow. Your senses of smell and taste start returning to normal. Cessation-related anger and irritability typically peak now.',
      },
      {
        heading: 'The Peak Withdrawal Period',
        body: '**At 72 hours (3 days),** your body is 100% nicotine-free. Withdrawal symptoms peak in intensity and cue-induced crave episodes hit their highest frequency. But your lung bronchial tubes begin to relax, making breathing easier and increasing functional lung capacity.\n\n**Between days 5 and 8,** the average ex-user encounters about three crave episodes per day, each lasting less than three minutes. Most people experience a "moment of revelation" — a significant reduction in how much smoking occupies the mind.\n\n**By day 10,** crave episodes drop to fewer than two per day.',
      },
      {
        heading: 'Brain and Tissue Healing',
        body: '**At 2 weeks,** physical withdrawal symptoms like anger, anxiety, and difficulty concentrating generally end. Blood circulation in your gums and teeth reaches levels similar to non-users.\n\n**At 3 weeks (21 days),** the acetylcholine receptors in your brain — which multiplied to handle nicotine — return to levels seen in non-smokers. The physical craving for nicotine effectively disappears as the Little Monster dies.\n\n**Between 1 and 9 months,** cilia in your lungs regrow and recover their ability to clean your respiratory system, reducing infections and shortness of breath. Overall energy levels increase.',
      },
      {
        heading: 'Long-Term Health Milestones',
        body: '**At 2 to 4 months,** most people reach their first full day where they don\'t think about wanting nicotine at all.\n\n**At 1 year,** the excess risk of coronary heart disease is reduced to half that of a smoker.\n\n**At 5 to 15 years,** the risk of stroke declines to that of a person who has never smoked.\n\n**At 10 years,** the risk of death from lung cancer is roughly halved, and the risk of other cancers — mouth, throat, esophagus — decreases significantly.\n\n**At 15 years,** the risk of coronary heart disease returns to that of a never-smoker.',
      },
      {
        heading: 'You\'re Already Free',
        body: 'While the physical Little Monster dies within days, the "Big Monster" — the mental brainwashing and belief that nicotine is a crutch — can persist if not dismantled.\n\nBut here\'s what matters: you are a non-smoker the moment you finish your last dose. You don\'t have to wait for the timeline to be complete to claim your freedom. The healing is already happening.',
      },
    ],
  },
  'triggers': {
    title: 'Identifying Triggers',
    readTime: '6 min read',
    sections: [
      {
        body: 'Triggers — often called "cues" — are the subconscious associations your brain has formed between nicotine and specific activities, locations, emotions, or times of day. Through thousands of repetitions, your brain paired these neutral events with the "reward" of nicotine. Identifying them is the first step to dismantling them.',
      },
      {
        heading: 'How to Find Your Triggers',
        body: '**Track your use for 5–7 days** before quitting. Record the time of each dose, your mood, and the situation you\'re in.\n\n**Rate each dose 1–5** for how "important" it felt. This separates autopilot habits from high-stress or cue-driven use.\n\n**Analyze your routine.** Look at your commute, work breaks, the moments after a meal — anywhere "I want nicotine" thoughts automatically fire. Your journal in this app is the perfect place to capture these patterns.',
      },
      {
        heading: 'Common Trigger Categories',
        body: '**Paraphernalia:** The sight, smell, or touch of lighters, ashtrays, vape chargers, or spit cups can trigger an urge on their own.\n\n**Daily activities:** Drinking coffee, talking on the phone, driving, using the bathroom, finishing a meal — these are the most frequent triggers.\n\n**Emotional states:** Stress is a major trigger because it makes urine acidic, flushing nicotine out faster and triggering early withdrawal. Boredom makes you reach for nicotine to fill empty time. Anger and grief can trigger intense bargaining thoughts.\n\n**Social and environmental cues:** Being around other users, bars, celebrations like weddings and parties — long-standing associations fire automatically.\n\n**Seasonal or infrequent cues:** These are hidden triggers that may not appear for months — the first snowfall of winter, an annual vacation, a specific holiday. They catch people off guard because they seem to come from nowhere.',
      },
      {
        heading: 'How Triggers Actually Work',
        body: 'Triggers operate through **classical conditioning** — the same Pavlovian learning that makes a dog salivate at a bell. Through thousands of repetitions, your subconscious paired a neutral event (like your phone ringing) with the reward of nicotine. When that event happens, your brain automatically generates a conditioned response — an urge — in anticipation of the drug.\n\nThe good news: conditioned responses weaken every time they fire without being reinforced.',
      },
      {
        heading: 'Reframe Triggers as Victories',
        body: 'Instead of fearing a trigger, view it as an opportunity. **Each time you encounter a trigger and don\'t use nicotine, you weaken that subconscious link.** This is called extinction.\n\nSuccessfully navigating a trigger — your first phone call, your first meal, your first night out without nicotine — means that activity has been **reclaimed** for your nicotine-free life.\n\nRemember: a triggered crave episode usually peaks and passes within **3 to 5 minutes**, as long as you don\'t fixate on the thought. Just let it move through you.',
      },
    ],
  },
  'support': {
    title: 'Building Support',
    readTime: '7 min read',
    sections: [
      {
        body: 'Quitting is easier when you\'re not doing it alone. Research consistently shows that social support dramatically increases success rates. But it matters who you tell, how you tell them, and what you ask them to do.',
      },
      {
        heading: 'Announce Your Decision',
        body: 'Don\'t keep your decision to quit a secret. Making a **public commitment** helps you stay firm and ensures your social circle is aware of your journey.\n\n**Explain the process.** Tell them you\'re recovering from a chemical addiction and may be irritable or cranky during the initial withdrawal period.\n\n**Set expectations.** Let them know their encouragement is valuable, but remind yourself that their support is "dessert," not the "main meal" — your success ultimately depends on your own commitment to the Law of Addiction.',
      },
      {
        heading: 'Guide Your Supporters',
        body: 'Friends and family want to help but often don\'t know how. Give them specific guidelines.\n\n**What they should do:**\n\nCongratulate and compliment — positive feedback is far more effective than nagging. Celebrate your efforts and express confidence in your ability to stay quit. Provide distractions — if you\'re stressed or irritable, they should suggest an activity like a walk or a project.\n\n**What they should not do:**\n\nDon\'t nag or criticize past use — it makes you feel like a trapped animal and increases the desire to smoke. Don\'t express doubt about your ability to succeed. **Never offer nicotine,** even if you\'re in a bad mood. Don\'t suggest "just one" to calm down.',
      },
      {
        heading: 'Seek Peer Support',
        body: 'Interacting with others who have successfully quit provides insights that never-users can\'t offer.\n\n**Ex-users vs. never-users:** While never-users provide great general support, ex-users can share the reality that life is genuinely better on the free side and help dismantle the delusion that nicotine provides a boost.\n\n**A caution on quitting buddies:** The sources warn against leaning too heavily on a "quitting buddy" who is also in early recovery. If one partner relapses, the other is statistically much more likely to follow. It\'s safer to seek support from **seasoned ex-users** who are already comfortable in their freedom.',
      },
      {
        heading: 'Handle Negative Support',
        body: 'Be prepared for some people in your circle to intentionally or unintentionally sabotage your efforts.\n\n**The "sinking ship" mentality:** Other users may feel threatened by your success because it challenges their own belief that escape is impossible.\n\n**The response:** If someone repeatedly offers you nicotine after you\'ve asked them not to, try this: accept the cigarette or device, **immediately destroy it** — crumble it or throw it in the trash — and thank them. This sends a clear, unshakeable message that you are serious about your recovery.',
      },
      {
        heading: 'Use This App',
        body: 'Your accountability partner feature lets someone follow your streak without judgment. Your journal lets you process feelings privately. And the craving SOS is always one tap away. You\'ve already built your first support tool by being here.',
      },
    ],
  },
  'chemistry': {
    title: 'The Chemistry of Dependence',
    readTime: '6 min read',
    sections: [
      {
        body: 'Nicotine is one of the most perfectly engineered addictive substances on Earth — not because it was designed in a lab, but because it exploits the exact chemical pathways your brain already uses to learn, focus, and feel pleasure. Understanding this chemistry strips nicotine of its mystique and reveals it for what it is: a parasite that hijacks your own biology.',
      },
      {
        heading: 'The Acetylcholine Hijack',
        body: 'Your brain communicates through chemical messengers called neurotransmitters. One of the most important is **acetylcholine,** which regulates attention, memory, muscle movement, and arousal.\n\nNicotine is shaped almost identically to acetylcholine at the molecular level. When it enters your bloodstream — which takes just **7 to 10 seconds** after inhalation — it binds directly to acetylcholine receptors throughout your brain and body. Your nervous system cannot tell the difference between its own signaling molecule and the impostor.\n\nThis is why nicotine feels like it sharpens focus or calms nerves. It is literally impersonating one of your brain\'s most fundamental chemicals.',
      },
      {
        heading: 'The Dopamine Flood',
        body: 'When nicotine locks onto receptors in the **ventral tegmental area** (VTA), it triggers the release of **dopamine** — the neurotransmitter your brain uses to flag experiences as important and worth repeating.\n\nA single cigarette can increase dopamine levels in the nucleus accumbens by **25 to 40%.** This is the same reward circuit activated by food, sex, and social bonding — and the same pathway hijacked by heroin and cocaine.\n\nThe critical difference is that nicotine does not produce the intense euphoria of harder drugs. Instead, it delivers a subtle, repeatable "pay attention to this" signal that makes the brain quietly prioritize nicotine above almost everything else. This subtlety is what makes it so insidious — you barely notice the trap closing.',
      },
      {
        heading: 'Receptor Up-Regulation: The Trap Deepens',
        body: 'Your brain is adaptive. When it detects that acetylcholine receptors are being overstimulated by nicotine, it responds by **growing millions of additional receptors** — a process called up-regulation.\n\nA smoker\'s brain may have **two to three times** as many nicotinic receptors as a non-smoker\'s. This creates a devastating cycle: more receptors demand more nicotine to feel "normal," which causes even more receptors to grow.\n\nWhen nicotine levels drop — during sleep, meetings, or flights — these extra receptors sit empty and screaming for stimulation. That screaming is what you experience as a craving. You are not weak. Your brain has been physically restructured to need the drug.',
      },
      {
        heading: 'Withdrawal: The Biology of Discomfort',
        body: 'Withdrawal is not psychological weakness — it is a measurable chemical event.\n\nNicotine has a half-life of about **two hours.** Within 4 to 6 hours of your last dose, declining nicotine levels trigger a cascade: dopamine drops, norepinephrine surges (causing irritability and anxiety), and serotonin dips (causing low mood).\n\n**Peak withdrawal** occurs around **72 hours,** when the body is 100% nicotine-free. The physical symptoms — restlessness, difficulty concentrating, increased appetite, insomnia — are the direct result of millions of up-regulated receptors adjusting to life without the drug.\n\nThe good news: your brain begins **down-regulating** those extra receptors almost immediately. Within **three weeks,** receptor density returns to near-normal levels. The physical addiction is remarkably short-lived — it is the mental addiction that lingers.',
      },
      {
        heading: 'As Addictive as Heroin',
        body: 'This is not hyperbole. The Royal College of Physicians, the U.S. Surgeon General, and the World Health Organization have all concluded that nicotine is **as addictive as heroin and cocaine** based on four criteria: compulsive use despite harm, psychoactive effects on the brain, drug-reinforced behavior, and withdrawal symptoms upon cessation.\n\nThe difference is that nicotine\'s effects are milder per dose, which allows users to dose **hundreds of times per day** without losing consciousness or function. A pack-a-day smoker takes roughly **200 puffs** daily — 200 reinforcements of the addiction cycle, every single day, for years.\n\nUnderstanding this chemistry is not meant to scare you. It is meant to **empower** you. You are not fighting a bad habit or a lack of discipline. You are recovering from a sophisticated chemical dependency — and your brain already has the machinery to heal itself completely.',
      },
    ],
  },
  'habit-loops': {
    title: 'Breaking Habit Loops',
    readTime: '6 min read',
    sections: [
      {
        body: 'Every time you reached for nicotine, you were not making a conscious decision — you were running a program. Over thousands of repetitions, your brain encoded nicotine use into automatic habit loops that fire without your awareness or permission. Breaking free means understanding these loops and deliberately rewiring them.',
      },
      {
        heading: 'The Three-Part Loop',
        body: 'Every habit — good or bad — follows the same neurological structure, first identified by researchers at MIT:\n\n**1. Cue (Trigger):** A signal that tells your brain to initiate the routine. This can be a time of day, an emotion, a location, an activity, or even another person.\n\n**2. Routine (Behavior):** The automatic action itself — reaching for the vape, stepping outside, opening the tin.\n\n**3. Reward (Relief):** The payoff your brain receives — in nicotine\'s case, a brief spike of dopamine and the relief of withdrawal symptoms your brain misinterprets as genuine pleasure.\n\nThis loop is stored in the **basal ganglia,** a primitive brain region that operates below conscious awareness. This is why you can light a cigarette without even realizing you\'ve done it — the behavior has been delegated to autopilot.',
      },
      {
        heading: 'Why Willpower Alone Fails',
        body: 'Trying to break a habit loop through sheer willpower is like trying to stop blinking by concentrating. You might succeed for a while, but the moment your attention shifts, the automatic program runs again.\n\nWillpower is managed by the **prefrontal cortex** — the rational, decision-making part of your brain. But habit loops are stored in the **basal ganglia,** which doesn\'t respond to logic or reasoning. These two systems are literally in different parts of your brain.\n\nThis is why you can know with absolute certainty that nicotine is harmful and still find yourself reaching for it. **Knowledge alone cannot overwrite a habit loop.** You need a strategy that works at the level where the loop operates.',
      },
      {
        heading: 'The Golden Rule of Habit Change',
        body: 'Research by Charles Duhigg and others has shown that you cannot simply delete a habit loop — but you **can** overwrite the routine while keeping the same cue and reward.\n\n**Step 1: Identify the cue.** What exactly triggers the urge? Is it finishing a meal? Stress? Boredom? The more specific, the better.\n\n**Step 2: Identify the real reward.** Ask yourself: is the reward actually nicotine, or is it the break from work, the deep breathing, the social connection, or the moment of solitude? Often the true reward has nothing to do with the drug.\n\n**Step 3: Insert a new routine.** When the cue fires, execute a different behavior that delivers the same reward. If the real reward is a break, take a walk. If it\'s deep breathing, do a breathing exercise. If it\'s social connection, call a friend.\n\nThe cue still fires. The reward still arrives. But the destructive routine in the middle has been replaced.',
      },
      {
        heading: 'The 21-Day Myth vs. Reality',
        body: 'You have probably heard that it takes 21 days to form a new habit. This number comes from a misreading of a 1960s study by Dr. Maxwell Maltz on plastic surgery patients adjusting to their new appearance.\n\nThe actual research, most notably a 2009 study by Phillippa Lally at University College London, found that habit formation takes an average of **66 days** — with a range of 18 to 254 days depending on the complexity of the behavior and the individual.\n\nFor nicotine habit loops specifically, the physical withdrawal component resolves in about **three weeks** as receptors down-regulate. But the conditioned behavioral loops — the automatic reach after coffee, the urge during a phone call — can take **two to three months** of consistent practice to fully overwrite.\n\nDon\'t be discouraged by this. Each time you encounter a cue and execute the new routine instead, the old loop weakens and the new one strengthens. Progress is happening even when you can\'t feel it.',
      },
      {
        heading: 'Building Your New Loops',
        body: 'Here is a practical framework for the first weeks of recovery:\n\n**Map your loops.** Spend a day writing down every moment you feel an urge. Note the time, location, activity, emotion, and who you\'re with. Patterns will emerge quickly.\n\n**Pre-plan replacements.** For each identified cue, decide in advance what you will do instead. Decision fatigue during a craving is your enemy — remove the need to think by having a plan ready.\n\n**Make the new routine easy.** Keep gum in your pocket, a water bottle on your desk, a breathing app on your home screen. Reduce the friction for the new behavior.\n\n**Stack habits.** Attach your new routine to an existing habit. "After I pour my morning coffee, I will do three deep breaths" is more effective than "I will breathe deeply sometime in the morning."\n\nRemember: you are not losing a habit. You are **replacing** it with something better. The cue-routine-reward architecture of your brain is not your enemy — it is a tool you can reprogram.',
      },
    ],
  },
  'healing': {
    title: 'Physical Healing Milestones',
    readTime: '7 min read',
    sections: [
      {
        body: 'Your body is a remarkable self-healing machine. The moment you stop introducing nicotine and the thousands of chemicals that accompany it, every organ system begins a measurable recovery process. This article maps that recovery organ by organ, so you can appreciate what is already happening inside you right now.',
      },
      {
        heading: 'Lungs: Breathing Again',
        body: 'Your lungs take the most direct hit from smoking and vaping, and their recovery is both dramatic and gradual.\n\n**Within 72 hours,** bronchial tubes relax and airway resistance decreases. You may notice breathing feels slightly easier.\n\n**Within 1 to 3 months,** lung function improves by up to **30%.** The shortness of breath you accepted as normal begins to fade.\n\n**Within 1 to 9 months,** the **cilia** — tiny hair-like structures that sweep mucus and debris out of your airways — regrow and resume functioning. This is why many people experience a "smoker\'s cough" during early recovery: your lungs are finally able to clean themselves. This cough is a sign of healing, not illness.\n\n**At 10 years,** the risk of lung cancer is roughly **halved** compared to a continuing smoker. Precancerous cells are replaced with healthy tissue.\n\nFor vapers specifically, early research suggests that the inflammatory damage from propylene glycol and vegetable glycerin aerosol begins resolving within weeks, though long-term data is still emerging.',
      },
      {
        heading: 'Heart and Circulation',
        body: 'Cardiovascular damage from nicotine is significant — but recovery begins almost immediately.\n\n**Within 20 minutes,** your heart rate and blood pressure return to your natural baseline. Nicotine artificially elevates both by stimulating the adrenal glands to release adrenaline.\n\n**Within 2 weeks to 3 months,** circulation improves measurably. Walking becomes easier. Your hands and feet may feel warmer as blood flow to extremities normalizes.\n\n**At 1 year,** the excess risk of coronary heart disease drops to **half** that of a continuing smoker.\n\n**At 5 years,** the risk of stroke returns to that of a person who has never smoked. Artery walls that had been thickened by carbon monoxide and oxidative stress begin to normalize.\n\n**At 15 years,** your risk of heart disease is the same as someone who never smoked. The cardiovascular system achieves full recovery.',
      },
      {
        heading: 'Skin, Teeth, and Appearance',
        body: 'Nicotine constricts blood vessels in the skin, starving it of oxygen and nutrients. Smoking also degrades **collagen and elastin,** the proteins responsible for skin firmness.\n\n**Within 2 weeks,** increased blood flow gives your skin a healthier color and more natural glow. Friends may comment that you "look different" before they even know you\'ve quit.\n\n**Within 1 to 3 months,** your skin\'s ability to repair itself improves. Wounds heal faster. Fine wrinkles may soften as collagen production normalizes.\n\n**Teeth and gums** show rapid improvement. Blood flow to the gums returns to normal within about **2 weeks,** reducing the elevated risk of periodontal disease. Staining from tar slows and can be addressed with dental cleaning. Your dentist will likely notice the difference at your next visit.\n\n**Hair** becomes stronger and less prone to premature graying as follicle blood supply improves.',
      },
      {
        heading: 'Immune System and Healing',
        body: 'Smoking suppresses the immune system in multiple ways — reducing white blood cell counts, impairing antibody production, and increasing chronic inflammation throughout the body.\n\n**Within 2 to 4 weeks,** your white blood cell count begins normalizing. You may notice that you catch fewer colds and recover from minor illnesses faster.\n\n**Within 3 months,** markers of chronic inflammation — elevated C-reactive protein, elevated white cell counts — begin declining toward normal levels.\n\n**Within 1 year,** the overall frequency of respiratory infections like bronchitis and pneumonia drops significantly as your restored cilia and improved immune function work together.\n\nYour body\'s ability to heal wounds, fight infections, and recover from surgery improves steadily throughout the first year. Surgeons routinely recommend quitting at least **4 to 6 weeks** before any elective surgery because the difference in healing outcomes is so significant.',
      },
      {
        heading: 'Fertility, Hormones, and Senses',
        body: '**Fertility:** In women, the toxic effects of smoking on egg quality and uterine blood flow begin reversing within months. In men, sperm count, motility, and morphology improve measurably within **3 months** as the full spermatogenesis cycle completes with healthier raw materials.\n\n**Hormones:** Nicotine disrupts the balance of cortisol, insulin, and thyroid hormones. Within weeks of quitting, cortisol patterns normalize and insulin sensitivity improves — which is one reason some people experience temporary blood sugar fluctuations during withdrawal.\n\n**Taste and smell:** These return rapidly — often within **48 hours** — as damaged nerve endings in the nose and mouth begin to regenerate. Food tastes richer, scents become more vivid, and many people rediscover a sense of pleasure in eating that had been dulled for years.\n\nEvery single organ system in your body benefits from quitting. There is no tissue, no cell, no function that is not improved by removing nicotine and its accompanying chemicals. The healing has already begun.',
      },
    ],
  },
  'sleep-energy': {
    title: 'Sleep & Energy Recovery',
    readTime: '6 min read',
    sections: [
      {
        body: 'One of the most frustrating aspects of early recovery is the disruption to sleep and energy. You expected to feel better after quitting — instead, you may be tossing and turning at night and dragging through the day. This is temporary, it is well understood, and it resolves. Here is what is happening and how to manage it.',
      },
      {
        heading: 'Why Withdrawal Disrupts Sleep',
        body: 'Nicotine has complex effects on sleep architecture that create problems both while using and after quitting.\n\n**While using,** nicotine acts as a stimulant that delays sleep onset and reduces total sleep time. But your body adapted to this — it compensated by adjusting its internal sleep pressure systems around the drug.\n\n**After quitting,** those compensations are suddenly mismatched. Your brain is recalibrating its production of **adenosine** (the chemical that builds sleep pressure), **melatonin** (the hormone that signals darkness and bedtime), and **acetylcholine** (which regulates REM sleep cycles).\n\nThe result is a temporary period — usually **1 to 3 weeks** — of disrupted sleep that can include difficulty falling asleep, frequent waking, vivid or disturbing dreams, and lighter sleep overall.\n\n**Vivid dreams** deserve special mention. Nicotine suppresses REM sleep, which is the dreaming stage. When you quit, your brain enters a period of **REM rebound** — making up for lost dreaming time with unusually intense, vivid, and sometimes disturbing dreams. This is a sign of healing, not a sign of something wrong.',
      },
      {
        heading: 'The Adenosine-Caffeine Connection',
        body: 'Here is something most quitters don\'t know: nicotine speeds up caffeine metabolism by up to **56%.** This means that while you were using nicotine, your body was processing caffeine nearly twice as fast.\n\n**When you quit nicotine,** your caffeine metabolism slows dramatically. The same cup of coffee that barely affected you as a smoker now delivers nearly **double the effective dose** — and lasts much longer in your system.\n\nThis is a hidden cause of post-quit insomnia, anxiety, and jitteriness that many people mistake for nicotine withdrawal symptoms. The fix is simple: **cut your caffeine intake in half** during the first few weeks of recovery, then adjust based on how you feel.\n\nIf you drink three cups of coffee a day, drop to one and a half. If you\'re having trouble sleeping, make your last caffeinated drink before noon.',
      },
      {
        heading: 'Sleep Hygiene During Recovery',
        body: 'Good sleep practices matter more during recovery than at any other time. Your brain is rebuilding its natural sleep regulation, and you can help by providing consistent signals:\n\n**Keep a consistent schedule.** Go to bed and wake up at the same time every day — including weekends. This anchors your circadian rhythm while it recalibrates.\n\n**Create a wind-down routine.** Spend 30 to 60 minutes before bed doing something calm — reading, gentle stretching, a warm shower. Avoid screens, as blue light suppresses melatonin production.\n\n**Manage your environment.** Keep your bedroom cool (around 65°F / 18°C), dark, and quiet. Consider a white noise machine if you\'re experiencing the heightened sensory sensitivity common in early withdrawal.\n\n**Don\'t fight insomnia in bed.** If you can\'t fall asleep within 20 minutes, get up, go to another room, and do something quiet until you feel drowsy. Lying in bed frustrated creates an association between your bed and wakefulness.\n\n**Avoid alcohol as a sleep aid.** While alcohol may help you fall asleep faster, it fragments sleep architecture and suppresses the REM sleep your brain desperately needs right now.',
      },
      {
        heading: 'Energy Dips and When They Resolve',
        body: 'Nicotine is a stimulant. Without it, many people experience a noticeable dip in energy and alertness during the first **1 to 4 weeks.**\n\nThis happens for several reasons: your brain is adjusting to lower baseline dopamine levels, your blood sugar regulation is recalibrating (nicotine released stored glycogen), and disrupted sleep compounds daytime fatigue.\n\n**Week 1:** Energy is often lowest. Many people describe feeling foggy, sluggish, or like they\'re "thinking through mud." This is the peak of neurochemical adjustment.\n\n**Weeks 2 to 3:** Energy begins returning in waves. You may have good days followed by surprisingly tired days. This is normal fluctuation as your brain rebalances.\n\n**Weeks 4 to 8:** Most people report energy levels that meet or **exceed** their pre-quit baseline. Without the constant cycle of stimulation and withdrawal, your energy becomes more stable and sustained throughout the day.\n\n**By 3 months,** the vast majority of people report sleeping better and having more consistent energy than they ever did as a nicotine user.',
      },
      {
        heading: 'Exercise: Your Recovery Accelerator',
        body: 'If there is one single habit that improves every aspect of nicotine recovery — sleep, energy, mood, cravings — it is **regular exercise.**\n\n**For sleep:** Exercise increases adenosine buildup (natural sleep pressure), promotes deeper slow-wave sleep, and helps regulate circadian rhythm. Even a 30-minute walk makes a measurable difference in sleep quality.\n\n**For energy:** Exercise triggers the release of endorphins, norepinephrine, and serotonin — providing a natural, non-addictive boost that nicotine was poorly imitating.\n\n**For cravings:** Studies show that just **10 minutes of moderate exercise** — a brisk walk, a set of push-ups, climbing stairs — significantly reduces the intensity and frequency of nicotine cravings.\n\n**Timing matters.** Morning or afternoon exercise is ideal. Vigorous exercise within 2 to 3 hours of bedtime can be stimulating and delay sleep onset.\n\nYou don\'t need to run marathons. Walking, cycling, swimming, yoga — anything that elevates your heart rate for 20 to 30 minutes will accelerate your recovery. Your body is already healing. Exercise simply turns up the speed.',
      },
    ],
  },
  'freedom': {
    title: 'The Freedom Mindset',
    readTime: '6 min read',
    sections: [
      {
        body: 'The difference between people who quit and stay free versus those who quit and relapse often has nothing to do with willpower, discipline, or how badly they were addicted. It comes down to mindset — specifically, whether they see quitting as **losing something** or **gaining everything.**',
      },
      {
        heading: 'The Great Illusion',
        body: 'Nicotine addiction survives on a single, powerful lie: that it provides a genuine benefit — stress relief, concentration, pleasure, comfort — that you will lose when you quit.\n\nThis is the **Big Monster.** Not the physical craving (the Little Monster, which dies in days), but the deeply embedded belief that nicotine does something positive for you.\n\nExamine it honestly: does nicotine relieve stress, or does it **create** the stress of withdrawal and then partially relieve its own creation? Does it help you concentrate, or does the craving **destroy** concentration until you dose? Does it provide pleasure, or do you feel pleasure only because the discomfort of withdrawal is temporarily lifted?\n\nA non-smoker sitting beside you in a restaurant feels no stress, no lack of concentration, no missing pleasure. They are already in the state you are trying to reach — and they got there by never taking the drug in the first place.',
      },
      {
        heading: 'Moping vs. Rejoicing',
        body: 'There are two ways to experience the quitting process, and they lead to radically different outcomes.\n\n**The moper** believes they are making a sacrifice. They tell themselves: "I\'d love a cigarette right now, but I\'m not allowed to have one." Every craving is torture. Every social event is a test of endurance. Every day is one more day of deprivation. The moper may white-knuckle through weeks or months — but because they still believe nicotine had value, they are always one bad day away from "rewarding" themselves with a relapse.\n\n**The rejoicer** understands the truth: there is nothing to give up. They think: "Isn\'t it wonderful — I\'m free from that slavery!" Every craving is celebrated as the death throes of the addiction. Every social event is enjoyed fully for the first time. Every day is a day of liberation.\n\nThe rejoicer doesn\'t need willpower because there is no internal conflict. You don\'t need willpower to refuse something you don\'t want.',
      },
      {
        heading: 'Why Willpower Alone Fails',
        body: 'The willpower method frames quitting as a tug-of-war: one side of your mind wants to quit, the other side wants nicotine, and you have to hold on until the urge fades.\n\nThis method has the **lowest long-term success rate** of any approach because it does not address the underlying belief that nicotine provides a benefit. The person using willpower is essentially saying: "I believe this thing is valuable, but I\'m going to use force to deny myself access to it."\n\nThis creates a state of permanent internal conflict. Willpower is a **finite resource** — it depletes over the course of a day, especially during stress. Eventually, a moment comes when willpower runs out, and the deeply held belief that nicotine is valuable wins.\n\nThe alternative is not harder willpower. It is **removing the desire** entirely by understanding that nicotine provides nothing. You cannot miss something that never gave you anything real.',
      },
      {
        heading: 'Becoming a Non-Smoker',
        body: 'There is a profound difference between "someone who is trying not to smoke" and "a non-smoker." The first is a person in conflict. The second is a person at peace.\n\n**Identity shift** is one of the most powerful tools in recovery. Instead of thinking "I\'m quitting smoking," reframe it as "**I am a non-smoker.**" This is not a trick — it is the truth. You became a non-smoker the moment you finished your last dose.\n\nNon-smokers don\'t struggle through dinner parties wishing they could step outside. They don\'t white-knuckle through traffic or work stress. They simply don\'t smoke — it\'s not part of who they are.\n\nAdopt this identity now. When someone offers you a cigarette, don\'t say "I\'m trying to quit" (which implies you might fail). Say "**I don\'t smoke**" (which is a statement of identity, not effort).',
      },
      {
        heading: 'What You Actually Gain',
        body: 'When the Big Monster\'s illusion is fully dismantled, you can see quitting for what it truly is — **pure gain, zero loss.**\n\nYou gain freedom from the slavery of planning your life around a chemical. You gain the end of the sinister, lurking fear of what the drug is doing to your health. You gain back your self-respect — the end of despising yourself for being controlled by something you know is destructive.\n\nYou gain genuine confidence and courage — not the false, temporary boost of a dopamine hit, but the deep, permanent knowledge that you conquered one of the most addictive substances on Earth.\n\nYou gain the ability to enjoy meals, conversations, holidays, and ordinary moments without the constant interruption of chemical need. You gain the quiet mind.\n\nThere is nothing to give up. There is everything to gain. You are not "giving up smoking." You are **escaping from a trap** — and the door is already open.',
      },
    ],
  },
  'staying-quit': {
    title: 'Staying Quit Long-Term',
    readTime: '7 min read',
    sections: [
      {
        body: 'The hardest part of quitting is not the first week — it is the months and years that follow when the memory of how difficult withdrawal was fades, and a quiet voice suggests that maybe, just maybe, you could have "just one." This article is your defense against complacency.',
      },
      {
        heading: 'The Complacency Trap',
        body: 'Paradoxically, the better you feel, the more vulnerable you become. When you are deep in withdrawal, the reasons for quitting are vivid and urgent. But as months pass and you feel genuinely free, a dangerous thought emerges: "I\'ve beaten this. I\'m in control now. One won\'t hurt."\n\nThis is the **complacency trap,** and it is the single most common cause of long-term relapse. It works because your brain selectively remembers the "pleasure" of nicotine (which was actually just withdrawal relief) while conveniently forgetting the slavery, the expense, the self-loathing, and the health anxiety.\n\nThe ex-smoker who relapses after two years of freedom does not do so because the addiction grew stronger over time. They relapse because they **forgot the Law of Addiction:** one dose has a 95% probability of restoring full dependency.',
      },
      {
        heading: 'The "Just One" Delusion',
        body: 'No one who relapses intends to go back to daily use. Every relapse begins with the belief that a single cigarette, puff, or dip can be an isolated event.\n\n**Why "just one" is impossible:** Your brain\'s up-regulated nicotinic receptors, while dormant, never fully disappear. A single dose of nicotine re-awakens them, flooding your reward circuit and re-establishing the craving cycle in as little as **one to three doses.**\n\nCommon rationalizations for "just one":\n\n"It\'s a special occasion" — but every week has a birthday, holiday, or celebration.\n\n"I\'ll just have one to see if I still like it" — the experiment can only have two outcomes: you don\'t like it (so why bother?) or you do (and you\'re addicted again).\n\n"I\'ve been so good, I deserve a reward" — the reward for escaping a trap is not climbing back into it.\n\nThe only guaranteed protection against relapse is **absolute, unconditional, permanent abstinence from nicotine.** Not one puff. Not ever. Not in any form.',
      },
      {
        heading: 'Handling Life Events Sober',
        body: 'Major life events — both positive and negative — are the moments when long-term quitters are most vulnerable. The brain searches for familiar coping mechanisms during times of intense emotion.\n\n**Grief and loss:** The death of a loved one, a divorce, a job loss. These trigger a primal desire for comfort, and the addicted brain whispers that nicotine provided comfort. It didn\'t — it provided a brief chemical distraction that left you with the original pain plus renewed addiction.\n\n**Celebration and joy:** Weddings, promotions, the birth of a child. The brain associates "special moments" with its strongest reward pathways. Remind yourself that you are celebrating **because** you are free, not in spite of it.\n\n**Boredom and routine:** Ironically, the most dangerous trigger may be an ordinary Tuesday afternoon. Without the drama of early withdrawal to keep you vigilant, boredom can make the old habit seem appealing.\n\nThe solution is the same in every case: **remember what you are.** You are a non-smoker. Non-smokers do not deal with grief, joy, or boredom by ingesting poison. They never have and they never will.',
      },
      {
        heading: 'Seasonal and Hidden Triggers',
        body: 'Some triggers do not appear until months or even years after quitting, because they are tied to infrequent events.\n\n**Seasonal triggers:** The first warm spring evening on a patio. The first snowfall. A summer barbecue. The smell of autumn leaves. These sensory experiences were paired with nicotine use over many years, and the conditioned association fires when the season returns.\n\n**Annual events:** A specific holiday, a yearly trip, a work conference you attended as a smoker. The environment recreates the cue, and the craving can feel shockingly strong even years later.\n\n**Emotional echoes:** A specific type of stress — a fight with a partner, a work deadline, a financial worry — that you haven\'t experienced since quitting. The brain retrieves the old coping routine along with the emotional memory.\n\nThese hidden triggers are startling but not dangerous, as long as you recognize them for what they are: **ghosts,** not threats. The craving lasts the same 3 to 5 minutes it always did, and responding to it correctly extinguishes it permanently for that specific cue.',
      },
      {
        heading: 'Maintaining Your Freedom',
        body: 'Long-term success is not about constant vigilance — it is about maintaining clarity.\n\n**Never question your decision.** The decision to quit was made by your rational mind with full knowledge of the facts. Do not allow a fleeting craving to reopen a debate that was already settled.\n\n**Stay grateful.** Periodically remind yourself what you escaped from — the expense, the health damage, the slavery, the social stigma, the self-contempt. Gratitude is the antidote to complacency.\n\n**If you slip:** A single lapse does not have to become a full relapse, but the odds are heavily against you. If you do take a puff, the most important thing is to **stop immediately,** recognize what happened, and recommit without using the slip as an excuse to continue. Do not tell yourself "I\'ve already blown it, so I might as well keep going." That single thought has destroyed more quits than any other.\n\n**Help others.** One of the most powerful ways to maintain your own freedom is to support someone else who is trying to quit. Teaching reinforces your own understanding, and witnessing their struggle reminds you of what you overcame.\n\nYou have done the hardest thing. The door is open, and you walked through it. All that remains is to **never go back through it** — and why would you? There is nothing on the other side but a trap.',
      },
    ],
  },
  'law-of-addiction': {
    title: 'The Law of Addiction',
    readTime: '5 min read',
    sections: [
      {
        body: 'The Law of Addiction is a fundamental principle of recovery: "Administration of a drug to an addict will cause re-establishment of chemical dependence upon the addictive substance." Understanding this law — and never forgetting it — is the single most important thing you can do to stay free.',
      },
      {
        heading: 'The 95% Rule: One Equals All',
        body: 'The 1992 Garvey study followed adult smokers for a full year after they attempted to quit. It found that individuals who had even a single lapse — smoking any nicotine at all after their quit date — had a 95% probability of resuming their regular pattern of use.\n\nThis is often summarized as "1 = All." For a person who is chemically dependent, there is no such thing as "just one" puff, vape, or dip. A single dose is almost guaranteed to lead back to full-blown addiction.',
      },
      {
        heading: 'The Biology: Receptor Saturation',
        body: 'The power of this law is rooted in brain chemistry, not a lack of willpower. Brain PET scans show that just one puff of nicotine can saturate up to 50% of the brain\'s nicotinic-type acetylcholine receptors.\n\nThis massive jolt immediately re-activates the hijacked dopamine "pay-attention" pathways, making the resulting relief sensation nearly impossible for the brain to ignore or forget in the short term. One puff literally flips the switch back on.',
      },
      {
        heading: 'Three Facts You Must Accept',
        body: 'To master the Law of Addiction, you must accept three things:\n\nFirst, true chemical addiction. Nicotine dependency is a real physical addiction that captivates the same brain pathways as heroin or cocaine.\n\nSecond, arrested — not cured. Once established, an addiction cannot be killed or cured, only arrested through total abstinence.\n\nThird, permanent vulnerability. Regardless of how many years you\'ve been nicotine-free, your brain remains permanently wired for relapse. The receptors quiet down, but they never disappear.',
      },
      {
        heading: 'The False Confidence Trap',
        body: 'Some people take a puff and don\'t immediately feel re-hooked, which leads to a dangerous false sense of confidence. They believe they can "cheat" the law and have an occasional fix.\n\nBut this thinking inevitably leads to a series of perpetual relapses until full dependency is resumed. The only way to guarantee 100% success is to strictly adhere to one simple commitment: no nicotine today.',
      },
    ],
  },
};

// ── Rich text helper ─────────────────────────────────────────────────
// Supports **bold** markup inside body strings.
function RichBody({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <Text className="text-base text-warm-600 leading-7">
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <Text key={i} className="font-bold text-warm-800">
            {part.slice(2, -2)}
          </Text>
        ) : (
          part
        ),
      )}
    </Text>
  );
}

// ── Component ────────────────────────────────────────────────────────

export default function ContentDetailScreen() {
  const route = useRoute<ContentDetailRoute>();
  const navigation = useNavigation<Nav>();
  const { slug } = route.params;

  const currentIndex = CONTENT_ITEMS.findIndex((i) => i.slug === slug);
  const hasNext = currentIndex < CONTENT_ITEMS.length - 1;

  const article = ARTICLES[slug];
  const scrollRef = useRef<ScrollView>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
      const maxScroll = contentSize.height - layoutMeasurement.height;
      if (maxScroll > 0) {
        setScrollProgress(Math.min(contentOffset.y / maxScroll, 1));
      }
    },
    [],
  );

  const goNext = () => {
    if (hasNext) {
      navigation.replace('ContentDetail', {
        slug: CONTENT_ITEMS[currentIndex + 1].slug,
      });
    } else {
      navigation.goBack();
    }
  };

  if (!article) {
    return (
      <SafeAreaView className="flex-1 bg-warm-50 items-center justify-center">
        <Text className="text-warm-400">Article not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-warm-50" edges={['top', 'bottom']}>
      {/* Header bar */}
      <View className="flex-row items-center px-4 pt-2 pb-3">
        <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color="#8c7a66" />
        </Pressable>

        {/* Progress bar */}
        <View className="flex-1 h-1.5 bg-warm-200 rounded-full mx-3 overflow-hidden">
          <View
            className="h-full bg-warm-400 rounded-full"
            style={{ width: `${Math.max(scrollProgress * 100, 2)}%` }}
          />
        </View>

        <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
          <Ionicons name="close" size={24} color="#8c7a66" />
        </Pressable>
      </View>

      {/* Content */}
      <ScrollView
        ref={scrollRef}
        className="flex-1"
        contentContainerClassName="px-6 pt-8 pb-32"
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <Text
          className="text-3xl text-warm-800 leading-snug mb-3"
          style={{ fontFamily: 'serif' }}
        >
          {article.title}
        </Text>

        <Text className="text-sm text-warm-400 mb-8">
          {article.readTime}
        </Text>

        {article.sections.map((section, i) => (
          <View key={i} className="mb-6">
            {section.heading && (
              <Text
                className="text-lg text-warm-700 mb-2"
                style={{ fontFamily: 'serif' }}
              >
                {section.heading}
              </Text>
            )}
            <RichBody text={section.body} />
          </View>
        ))}
      </ScrollView>

      {/* Next FAB */}
      <View className="absolute bottom-8 right-6">
        <Pressable
          className="w-14 h-14 rounded-full bg-warm-500 items-center justify-center shadow-lg"
          onPress={goNext}
        >
          <Ionicons
            name={hasNext ? 'arrow-forward' : 'checkmark'}
            size={24}
            color="#fff"
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
