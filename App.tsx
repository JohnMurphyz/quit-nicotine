import './global.css';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useAuth } from '@/src/hooks/useAuth';
import { RootNavigator } from '@/src/navigation/RootNavigator';
import { linking } from '@/src/navigation/linking';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const { initialized } = useAuth();

  useEffect(() => {
    if (initialized) {
      SplashScreen.hideAsync();
    }
  }, [initialized]);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      (async () => {
        const Notifications = await import('expo-notifications');
        const subscription =
          Notifications.addNotificationResponseReceivedListener((_response) => {
            // Navigate to home when notification tapped
          });
        return () => subscription.remove();
      })();
    }
  }, []);

  if (!initialized) return null;

  return (
    <NavigationContainer linking={linking}>
      <RootNavigator />
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
