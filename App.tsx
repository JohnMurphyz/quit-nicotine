import './global.css';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from '@expo-google-fonts/nunito';
import {
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
} from '@expo-google-fonts/nunito';
import { useAuth } from '@/src/hooks/useAuth';
import { useSkyThemeStore } from '@/src/stores/skyThemeStore';
import { RootNavigator } from '@/src/navigation/RootNavigator';
import { linking } from '@/src/navigation/linking';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const { initialized } = useAuth();
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });

  useEffect(() => {
    useSkyThemeStore.getState().load();
  }, []);

  useEffect(() => {
    if (initialized && fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [initialized, fontsLoaded]);

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

  if (!initialized || !fontsLoaded) return null;

  return (
    <NavigationContainer linking={linking}>
      <RootNavigator />
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
