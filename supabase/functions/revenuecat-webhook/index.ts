import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

serve(async (req) => {
  try {
    const body = await req.json();
    const event = body.event;

    if (!event) {
      return new Response('Missing event', { status: 400 });
    }

    const userId = event.app_user_id;
    if (!userId) {
      return new Response('Missing user ID', { status: 400 });
    }

    const eventType = event.type;
    const isActive = [
      'INITIAL_PURCHASE',
      'RENEWAL',
      'PRODUCT_CHANGE',
      'UNCANCELLATION',
    ].includes(eventType);

    const isExpired = [
      'EXPIRATION',
      'BILLING_ISSUE',
      'CANCELLATION',
    ].includes(eventType);

    if (isActive) {
      await supabase
        .from('profiles')
        .update({
          subscription_status: 'active',
          subscription_platform: event.store === 'APP_STORE' ? 'ios' : 'android',
          subscription_expires_at: event.expiration_at_ms
            ? new Date(event.expiration_at_ms).toISOString()
            : null,
        })
        .eq('id', userId);
    } else if (isExpired) {
      await supabase
        .from('profiles')
        .update({ subscription_status: 'expired' })
        .eq('id', userId);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
