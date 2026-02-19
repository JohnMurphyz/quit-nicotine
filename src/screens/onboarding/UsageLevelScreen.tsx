import { View, Text, Keyboard, Pressable } from 'react-native';
import { useState, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useOnboardingStore } from '@/src/stores/onboardingStore';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { OnboardingLayout } from '@/src/components/onboarding/OnboardingLayout';
import type { UsageDetails, VapeType, NicotineType } from '@/src/types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from '@/src/navigation/types';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'UsageLevel'>;

type SingleType = Exclude<NicotineType, 'multiple'>;

const MULTI_OPTIONS: { value: SingleType; label: string }[] = [
  { value: 'cigarettes', label: 'Cigarettes' },
  { value: 'vapes', label: 'Vapes / E-cigs' },
  { value: 'pouches', label: 'Pouches / Snus' },
  { value: 'chewing', label: 'Chewing Tobacco' },
];

// --- Sub-forms for each product type ---

function CigarettesForm({ values, onChange }: {
  values: { perDay: string; years: string };
  onChange: (v: { perDay: string; years: string }) => void;
}) {
  return (
    <>
      <Input
        label="How many cigarettes per day?"
        keyboardType="number-pad"
        value={values.perDay}
        onChangeText={(t) => onChange({ ...values, perDay: t })}
      />
      <Input
        label="How many years have you smoked?"
        keyboardType="number-pad"
        value={values.years}
        onChangeText={(t) => onChange({ ...values, years: t })}
      />
    </>
  );
}

function VapesForm({ values, onChange }: {
  values: { vapeType: VapeType | null; disposablesPerWeek: string; nicStrength: string; mlPerDay: string; years: string };
  onChange: (v: typeof values) => void;
}) {
  return (
    <>
      <Text className="text-sm font-medium text-warm-600 mb-2">Disposable or reusable?</Text>
      <View className="flex-row gap-3 mb-4">
        {(['disposable', 'reusable'] as const).map((type) => (
          <Pressable
            key={type}
            onPress={() => onChange({ ...values, vapeType: type })}
            className={`flex-1 items-center p-4 rounded-xl ${
              values.vapeType === type
                ? 'bg-warm-500'
                : 'bg-warm-100'
            }`}
          >
            <Ionicons
              name={type === 'disposable' ? 'battery-dead-outline' : 'battery-charging-outline'}
              size={24}
              color={values.vapeType === type ? '#ffffff' : '#b09a82'}
            />
            <Text className={`mt-1 text-sm font-medium ${
              values.vapeType === type ? 'text-white' : 'text-warm-600'
            }`}>
              {type === 'disposable' ? 'Disposable' : 'Reusable'}
            </Text>
          </Pressable>
        ))}
      </View>
      {values.vapeType === 'disposable' && (
        <Input
          label="How many disposables per week?"
          keyboardType="number-pad"
          value={values.disposablesPerWeek}
          onChangeText={(t) => onChange({ ...values, disposablesPerWeek: t })}
        />
      )}
      {values.vapeType === 'reusable' && (
        <>
          <Input
            label="What nicotine strength? (mg)"
            keyboardType="decimal-pad"
            value={values.nicStrength}
            onChangeText={(t) => onChange({ ...values, nicStrength: t })}
          />
          <Input
            label="How much liquid per day? (ml)"
            keyboardType="decimal-pad"
            value={values.mlPerDay}
            onChangeText={(t) => onChange({ ...values, mlPerDay: t })}
          />
        </>
      )}
      <Input
        label="How many years have you vaped?"
        keyboardType="number-pad"
        value={values.years}
        onChangeText={(t) => onChange({ ...values, years: t })}
      />
    </>
  );
}

function PouchesForm({ values, onChange }: {
  values: { strength: string; pouchesPerDay: string; years: string };
  onChange: (v: typeof values) => void;
}) {
  return (
    <>
      <Input
        label="What strength are your pouches? (mg)"
        keyboardType="decimal-pad"
        value={values.strength}
        onChangeText={(t) => onChange({ ...values, strength: t })}
      />
      <Input
        label="How many pouches per day?"
        keyboardType="number-pad"
        value={values.pouchesPerDay}
        onChangeText={(t) => onChange({ ...values, pouchesPerDay: t })}
      />
      <Input
        label="How many years have you used pouches?"
        keyboardType="number-pad"
        value={values.years}
        onChangeText={(t) => onChange({ ...values, years: t })}
      />
    </>
  );
}

function ChewingForm({ values, onChange }: {
  values: { tinsPerWeek: string; years: string };
  onChange: (v: typeof values) => void;
}) {
  return (
    <>
      <Input
        label="How many tins per week?"
        keyboardType="number-pad"
        value={values.tinsPerWeek}
        onChangeText={(t) => onChange({ ...values, tinsPerWeek: t })}
      />
      <Input
        label="How many years have you used chewing tobacco?"
        keyboardType="number-pad"
        value={values.years}
        onChangeText={(t) => onChange({ ...values, years: t })}
      />
    </>
  );
}

// --- Helpers ---

const defaultCigarettes = () => ({ perDay: '', years: '' });
const defaultVapes = (): { vapeType: VapeType | null; disposablesPerWeek: string; nicStrength: string; mlPerDay: string; years: string } =>
  ({ vapeType: null, disposablesPerWeek: '', nicStrength: '', mlPerDay: '', years: '' });
const defaultPouches = () => ({ strength: '', pouchesPerDay: '', years: '' });
const defaultChewing = () => ({ tinsPerWeek: '', years: '' });

function isCigarettesValid(v: ReturnType<typeof defaultCigarettes>) {
  return v.perDay.length > 0 && v.years.length > 0;
}

function isVapesValid(v: ReturnType<typeof defaultVapes>) {
  if (!v.vapeType || v.years.length === 0) return false;
  if (v.vapeType === 'disposable') return v.disposablesPerWeek.length > 0;
  return v.nicStrength.length > 0 && v.mlPerDay.length > 0;
}

function isPouchesValid(v: ReturnType<typeof defaultPouches>) {
  return v.strength.length > 0 && v.pouchesPerDay.length > 0 && v.years.length > 0;
}

function isChewingValid(v: ReturnType<typeof defaultChewing>) {
  return v.tinsPerWeek.length > 0 && v.years.length > 0;
}

function buildCigarettesDetails(v: ReturnType<typeof defaultCigarettes>): UsageDetails {
  return { kind: 'cigarettes', perDay: parseInt(v.perDay, 10) || 0, years: parseInt(v.years, 10) || 0 };
}

function buildVapesDetails(v: ReturnType<typeof defaultVapes>): UsageDetails {
  return {
    kind: 'vapes',
    vapeType: v.vapeType!,
    ...(v.vapeType === 'disposable'
      ? { disposablesPerWeek: parseInt(v.disposablesPerWeek, 10) || 0 }
      : { nicStrength: parseFloat(v.nicStrength) || 0, mlPerDay: parseFloat(v.mlPerDay) || 0 }),
    years: parseInt(v.years, 10) || 0,
  };
}

function buildPouchesDetails(v: ReturnType<typeof defaultPouches>): UsageDetails {
  return { kind: 'pouches', strength: parseFloat(v.strength) || 0, pouchesPerDay: parseInt(v.pouchesPerDay, 10) || 0, years: parseInt(v.years, 10) || 0 };
}

function buildChewingDetails(v: ReturnType<typeof defaultChewing>): UsageDetails {
  return { kind: 'chewing', tinsPerWeek: parseInt(v.tinsPerWeek, 10) || 0, years: parseInt(v.years, 10) || 0 };
}

// --- Main screen ---

export default function UsageLevelScreen({ navigation }: Props) {
  const { nicotineType, setUsageDetails } = useOnboardingStore();

  // Multi-type selection
  const [selectedTypes, setSelectedTypes] = useState<SingleType[]>([]);

  // Form state for each type
  const [cigarettes, setCigarettes] = useState(defaultCigarettes);
  const [vapes, setVapes] = useState(defaultVapes);
  const [pouches, setPouches] = useState(defaultPouches);
  const [chewing, setChewing] = useState(defaultChewing);

  const toggleMultiType = useCallback((type: SingleType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  }, []);

  const isValid = useCallback((): boolean => {
    if (nicotineType === 'multiple') {
      if (selectedTypes.length === 0) return false;
      return selectedTypes.every((type) => {
        switch (type) {
          case 'cigarettes': return isCigarettesValid(cigarettes);
          case 'vapes': return isVapesValid(vapes);
          case 'pouches': return isPouchesValid(pouches);
          case 'chewing': return isChewingValid(chewing);
          default: return false;
        }
      });
    }
    switch (nicotineType) {
      case 'cigarettes': return isCigarettesValid(cigarettes);
      case 'vapes': return isVapesValid(vapes);
      case 'pouches': return isPouchesValid(pouches);
      case 'chewing': return isChewingValid(chewing);
      default: return false;
    }
  }, [nicotineType, selectedTypes, cigarettes, vapes, pouches, chewing]);

  const handleContinue = () => {
    Keyboard.dismiss();

    let details: UsageDetails;

    if (nicotineType === 'multiple') {
      const items: UsageDetails[] = selectedTypes.map((type) => {
        switch (type) {
          case 'cigarettes': return buildCigarettesDetails(cigarettes);
          case 'vapes': return buildVapesDetails(vapes);
          case 'pouches': return buildPouchesDetails(pouches);
          case 'chewing': return buildChewingDetails(chewing);
        }
      });
      details = { kind: 'multiple', items };
    } else {
      switch (nicotineType) {
        case 'cigarettes': details = buildCigarettesDetails(cigarettes); break;
        case 'vapes': details = buildVapesDetails(vapes); break;
        case 'pouches': details = buildPouchesDetails(pouches); break;
        case 'chewing': details = buildChewingDetails(chewing); break;
        default: return;
      }
    }

    setUsageDetails(details);
    navigation.navigate('CostQuitDate');
  };

  const renderTypeForm = (type: SingleType) => {
    switch (type) {
      case 'cigarettes':
        return <CigarettesForm values={cigarettes} onChange={setCigarettes} />;
      case 'vapes':
        return <VapesForm values={vapes} onChange={setVapes} />;
      case 'pouches':
        return <PouchesForm values={pouches} onChange={setPouches} />;
      case 'chewing':
        return <ChewingForm values={chewing} onChange={setChewing} />;
    }
  };

  const TYPE_LABELS: Record<SingleType, string> = {
    cigarettes: 'Cigarettes',
    vapes: 'Vapes / E-cigs',
    pouches: 'Pouches / Snus',
    chewing: 'Chewing Tobacco',
  };

  return (
    <OnboardingLayout
      step={2}
      companionMessage="Thanks for sharing."
      onBack={() => navigation.goBack()}
      scrollable
      footer={
        <Button
          title="Continue"
          size="lg"
          disabled={!isValid()}
          onPress={handleContinue}
        />
      }
    >
      <Pressable className="px-6 pt-4" onPress={Keyboard.dismiss}>
        <Text className="text-3xl font-light text-warm-800 mb-2">
          How much do you use?
        </Text>
        <Text className="text-base text-warm-400 mb-8">
          No judgment here — this helps us understand your journey.
        </Text>

        {nicotineType === 'multiple' ? (
          <>
            <Text className="text-sm font-medium text-warm-600 mb-2">
              Which types do you use?
            </Text>
            <View className="flex-row flex-wrap gap-3 mb-6">
              {MULTI_OPTIONS.map((opt) => {
                const isSelected = selectedTypes.includes(opt.value);
                return (
                  <Pressable
                    key={opt.value}
                    onPress={() => toggleMultiType(opt.value)}
                    className={`flex-row items-center px-4 py-3 rounded-xl ${
                      isSelected ? 'bg-warm-500' : 'bg-warm-100'
                    }`}
                  >
                    <Ionicons
                      name={isSelected ? 'checkbox' : 'square-outline'}
                      size={20}
                      color={isSelected ? '#ffffff' : '#b09a82'}
                    />
                    <Text className={`ml-2 text-sm font-medium ${
                      isSelected ? 'text-white' : 'text-warm-600'
                    }`}>
                      {opt.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {selectedTypes.map((type) => (
              <View key={type} className="mb-6">
                <Text className="text-base font-semibold text-warm-800 mb-3">
                  {TYPE_LABELS[type]}
                </Text>
                {renderTypeForm(type)}
              </View>
            ))}
          </>
        ) : (
          nicotineType && renderTypeForm(nicotineType as SingleType)
        )}
      </Pressable>
    </OnboardingLayout>
  );
}
