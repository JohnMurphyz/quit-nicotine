import AccountabilityScreen from '@/src/screens/AccountabilityScreen';
import ArticlesScreen from '@/src/screens/ArticlesScreen';
import ContentDetailScreen from '@/src/screens/ContentDetailScreen';
import CravingSOSScreen from '@/src/screens/CravingSOSScreen';
import DestroyProductsScreen from '@/src/screens/DestroyProductsScreen';
import RelapseWizardScreen from '@/src/screens/RelapseWizardScreen';
import JournalDetailScreen from '@/src/screens/JournalDetailScreen';
import JournalEntryScreen from '@/src/screens/JournalEntryScreen';
import { PartnerDashboardScreen } from '@/src/screens/PartnerDashboardScreen';
import PaywallScreen from '@/src/screens/PaywallScreen';
import ReasonsScreen from '@/src/screens/ReasonsScreen';
import SettingsScreen from '@/src/screens/SettingsScreen';
import InviteScreen from '@/src/screens/auth/InviteScreen';
import JournalListScreen from '@/src/screens/tabs/JournalScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TabNavigator } from './TabNavigator';
import type { AppStackParamList } from './types';

const Stack = createNativeStackNavigator<AppStackParamList>();

export function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen
        name="Paywall"
        component={PaywallScreen}
        options={{ presentation: 'modal', headerShown: false }}
      />
      <Stack.Screen
        name="Accountability"
        component={AccountabilityScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ContentDetail"
        component={ContentDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CravingSOS"
        component={CravingSOSScreen}
        options={{ presentation: 'modal', headerShown: false }}
      />
      <Stack.Screen
        name="Articles"
        component={ArticlesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="JournalDetail"
        component={JournalDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="JournalEntry"
        component={JournalEntryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Reasons"
        component={ReasonsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="JournalList"
        component={JournalListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PartnerDashboardPreview"
        component={PartnerDashboardScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DestroyProducts"
        component={DestroyProductsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RelapseWizard"
        component={RelapseWizardScreen}
        options={{ presentation: 'fullScreenModal', headerShown: false }}
      />
      <Stack.Screen
        name="InvitePreview"
        component={InviteScreen as any}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
