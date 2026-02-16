import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { AppStackParamList } from './types';
import { TabNavigator } from './TabNavigator';
import PaywallScreen from '@/src/screens/PaywallScreen';
import AccountabilityScreen from '@/src/screens/AccountabilityScreen';
import ContentDetailScreen from '@/src/screens/ContentDetailScreen';

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
        options={{ headerShown: true, title: 'Content' }}
      />
    </Stack.Navigator>
  );
}
