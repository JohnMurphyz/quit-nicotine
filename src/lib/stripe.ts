import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/src/constants/config';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

export async function createCheckoutSession(
  userId: string,
  priceId: string
): Promise<void> {
  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/create-checkout-session`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ userId, priceId }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to create checkout session');
  }

  const { url } = await response.json();

  if (Platform.OS === 'web') {
    window.location.href = url;
  } else {
    await WebBrowser.openBrowserAsync(url);
  }
}
