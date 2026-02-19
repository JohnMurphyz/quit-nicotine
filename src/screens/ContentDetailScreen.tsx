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
