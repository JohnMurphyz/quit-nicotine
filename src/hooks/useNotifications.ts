import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { useAuthStore } from '@/src/stores/authStore';

export function useNotifications() {
  const { user, updateProfile } = useAuthStore();
  const [enabled, setEnabled] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'web') return;

    (async () => {
      const { getPermissionStatus, scheduleDailyReminder } = await import(
        '@/src/lib/notifications'
      );
      const status = await getPermissionStatus();
      setPermissionGranted(status);
      setEnabled(status);

      if (status) {
        await scheduleDailyReminder();
      }
    })();
  }, []);

  const requestPermission = async () => {
    if (Platform.OS === 'web') return;

    const { requestPermissions, scheduleDailyReminder, getPushToken } =
      await import('@/src/lib/notifications');

    const granted = await requestPermissions();
    setPermissionGranted(granted);
    setEnabled(granted);

    if (granted) {
      await scheduleDailyReminder();

      // Save push token
      if (user) {
        const token = await getPushToken();
        if (token) {
          await updateProfile({ push_token: token });
        }
      }
    }
  };

  const toggleNotifications = async (value: boolean) => {
    if (Platform.OS === 'web') return;

    const { scheduleDailyReminder, cancelAllNotifications } = await import(
      '@/src/lib/notifications'
    );

    if (value && !permissionGranted) {
      await requestPermission();
      return;
    }

    setEnabled(value);
    if (value) {
      await scheduleDailyReminder();
    } else {
      await cancelAllNotifications();
    }
  };

  return {
    enabled,
    permissionGranted,
    requestPermission,
    toggleNotifications,
  };
}
