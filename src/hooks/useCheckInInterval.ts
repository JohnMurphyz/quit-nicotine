import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_INTERVAL = 'check_in_interval_hours';
const KEY_LAST_CHECK_IN = 'last_check_in_at';
const DEFAULT_INTERVAL = 24;

export function useCheckInInterval() {
  const [intervalHours, setIntervalHoursState] = useState(DEFAULT_INTERVAL);
  const [lastCheckInAt, setLastCheckInAt] = useState<Date | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      const [intervalRaw, lastRaw] = await Promise.all([
        AsyncStorage.getItem(KEY_INTERVAL),
        AsyncStorage.getItem(KEY_LAST_CHECK_IN),
      ]);
      if (intervalRaw) setIntervalHoursState(Number(intervalRaw));
      if (lastRaw) setLastCheckInAt(new Date(lastRaw));
      setLoaded(true);
    }
    load();
  }, []);

  const isCheckInDue =
    loaded &&
    (!lastCheckInAt ||
      Date.now() - lastCheckInAt.getTime() > intervalHours * 3_600_000);

  const setIntervalHours = useCallback(async (hours: number) => {
    setIntervalHoursState(hours);
    await AsyncStorage.setItem(KEY_INTERVAL, String(hours));
  }, []);

  const recordCheckIn = useCallback(async () => {
    const now = new Date();
    setLastCheckInAt(now);
    await AsyncStorage.setItem(KEY_LAST_CHECK_IN, now.toISOString());
  }, []);

  const resetCheckIn = useCallback(async () => {
    setLastCheckInAt(null);
    await AsyncStorage.removeItem(KEY_LAST_CHECK_IN);
  }, []);

  return { intervalHours, lastCheckInAt, isCheckInDue, setIntervalHours, recordCheckIn, resetCheckIn };
}
