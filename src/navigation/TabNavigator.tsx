import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import type { TabParamList } from './types';
import { PaywallGate } from '@/src/components/PaywallGate';
import { useAuthStore } from '@/src/stores/authStore';
import { GuestStreakView } from '@/src/components/GuestStreakView';
import HomeScreen from '@/src/screens/tabs/HomeScreen';
import ProgressScreen from '@/src/screens/tabs/ProgressScreen';
import ContentScreen from '@/src/screens/tabs/ContentScreen';
import SettingsScreen from '@/src/screens/tabs/SettingsScreen';

const Tab = createBottomTabNavigator<TabParamList>();

export function TabNavigator() {
  const { profile } = useAuthStore();

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
        screenOptions={{
          tabBarActiveTintColor: '#16a34a',
          tabBarInactiveTintColor: '#9ca3af',
          headerShown: false,
          tabBarStyle: {
            borderTopWidth: 1,
            borderTopColor: '#f3f4f6',
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Progress"
          component={ProgressScreen}
          options={{
            title: 'Progress',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="calendar" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Content"
          component={ContentScreen}
          options={{
            title: 'Content',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="book" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </PaywallGate>
  );
}
