import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { AppStackParamList } from './types';
import { TabNavigator } from './TabNavigator';
import PaywallScreen from '@/src/screens/PaywallScreen';
import AccountabilityScreen from '@/src/screens/AccountabilityScreen';
import ContentDetailScreen from '@/src/screens/ContentDetailScreen';
import CravingSOSScreen from '@/src/screens/CravingSOSScreen';
import ArticlesScreen from '@/src/screens/ArticlesScreen';
import SettingsScreen from '@/src/screens/SettingsScreen';

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
        options={{ headerShown: true, title: 'Accountability Partners' }}
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
    </Stack.Navigator>
  );
}
