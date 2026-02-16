import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { NOTIFICATION_HOUR, NOTIFICATION_MINUTE, PROJECT_ID } from '@/src/constants/config';

const DAILY_REMINDER_ID = 'daily-reminder';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') return false;

  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function getPermissionStatus(): Promise<boolean> {
  if (Platform.OS === 'web') return false;

  const { status } = await Notifications.getPermissionsAsync();
  return status === 'granted';
}

export async function getPushToken(): Promise<string | null> {
  if (Platform.OS === 'web') return null;

  try {
    const token = await Notifications.getExpoPushTokenAsync({
      projectId: PROJECT_ID,
    });
    return token.data;
  } catch {
    return null;
  }
}

export async function scheduleDailyReminder() {
  if (Platform.OS === 'web') return;

  // Cancel existing reminder first
  await Notifications.cancelScheduledNotificationAsync(DAILY_REMINDER_ID).catch(
    () => {}
  );

  await Notifications.scheduleNotificationAsync({
    identifier: DAILY_REMINDER_ID,
    content: {
      title: "Don't break the chain!",
      body: "Have you confirmed today's nicotine-free day yet?",
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: NOTIFICATION_HOUR,
      minute: NOTIFICATION_MINUTE,
    },
  });
}

export async function cancelAllNotifications() {
  if (Platform.OS === 'web') return;
  await Notifications.cancelAllScheduledNotificationsAsync();
}
