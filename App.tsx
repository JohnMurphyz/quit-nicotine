import { useAuth } from '@/src/hooks/useAuth';
import { RootNavigator } from '@/src/navigation/RootNavigator';
import { linking } from '@/src/navigation/linking';
import { useSkyThemeStore } from '@/src/stores/skyThemeStore';
import { initRevenueCat } from '@/src/lib/revenueCat';
import {
  AbrilFatface_400Regular,
} from '@expo-google-fonts/abril-fatface';
import {
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold, useFonts
} from '@expo-google-fonts/nunito';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import './global.css';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const { initialized } = useAuth();
  const [fontsLoaded] = useFonts({
    AbrilFatface_400Regular,
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });

  useEffect(() => {
    useSkyThemeStore.getState().load();
    // Init RC anonymously so offerings are available before the user logs in
    initRevenueCat();
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
