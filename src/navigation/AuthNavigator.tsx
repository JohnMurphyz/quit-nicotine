import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { AuthStackParamList } from './types';
import LoginScreen from '@/src/screens/auth/LoginScreen';
import SignupScreen from '@/src/screens/auth/SignupScreen';
import InviteScreen from '@/src/screens/auth/InviteScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Invite" component={InviteScreen} />
    </Stack.Navigator>
  );
}
