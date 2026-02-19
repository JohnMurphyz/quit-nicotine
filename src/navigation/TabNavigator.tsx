import { useRef, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import type { TabParamList } from './types';
import { PaywallGate } from '@/src/components/PaywallGate';
import { useAuthStore } from '@/src/stores/authStore';
import { useOnboardingStore } from '@/src/stores/onboardingStore';
import { useThemeColors } from '@/src/hooks/useThemeColors';
import { GuestStreakView } from '@/src/components/GuestStreakView';
import HomeScreen from '@/src/screens/tabs/HomeScreen';
import TimelineScreen from '@/src/screens/tabs/TimelineScreen';
import JournalScreen from '@/src/screens/tabs/JournalScreen';
import ContentScreen from '@/src/screens/tabs/ContentScreen';
import SettingsScreen from '@/src/screens/tabs/SettingsScreen';

const Tab = createBottomTabNavigator<TabParamList>();

export function TabNavigator() {
  const { profile } = useAuthStore();
  const initialTab = useRef(useOnboardingStore.getState().initialTab).current;
  const colors = useThemeColors();

  // Clear the flag after mount so future mounts default to Home
  useEffect(() => {
    useOnboardingStore.getState().clearInitialTab();
  }, []);

  if (profile?.role === 'guest' && profile.linked_to) {
    return (
      <GuestStreakView
        userId={profile.linked_to}
        displayName={profile.display_name}
      />
    );
  }

  return (
    <PaywallGate>
      <Tab.Navigator
        initialRouteName={initialTab}
        screenOptions={{
          tabBarActiveTintColor: colors.tabBarActive,
          tabBarInactiveTintColor: colors.tabBarInactive,
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: colors.tabBarBg,
            borderTopWidth: 1,
            borderTopColor: colors.tabBarBorder,
            paddingTop: 8,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => (
              <Ionicons name="home" size={28} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Timeline"
          component={TimelineScreen}
          options={{
            title: 'Timeline',
            tabBarIcon: ({ color }) => (
              <Ionicons name="stats-chart" size={28} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Journal"
          component={JournalScreen}
          options={{
            tabBarItemStyle: { display: 'none' },
          }}
        />
        <Tab.Screen
          name="Learn"
          component={ContentScreen}
          options={{
            title: 'Learn',
            tabBarIcon: ({ color }) => (
              <Ionicons name="library" size={28} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={SettingsScreen}
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => (
              <Ionicons name="person" size={28} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </PaywallGate>
  );
}
