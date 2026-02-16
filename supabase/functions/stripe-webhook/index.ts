import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@13.0.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16',
});

const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

serve(async (req) => {
  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return new Response('Missing signature', { status: 400 });
  }

  try {
    const body = await req.text();
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id;
        if (!userId) break;

        await supabase
          .from('profiles')
          .update({
            subscription_status: 'active',
            subscription_platform: 'web',
          })
          .eq('id', userId);

        if (session.subscription) {
          const sub = await stripe.subscriptions.retrieve(
            session.subscription as string
          );
          await supabase.from('subscriptions').upsert({
            user_id: userId,
            platform: 'web',
            external_id: sub.id,
            status: 'active',
            current_period_end: new Date(
              sub.current_period_end * 1000
            ).toISOString(),
          });
        }
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        const { data: existing } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('external_id', sub.id)
          .single();

        if (existing) {
          const isActive = sub.status === 'active' || sub.status === 'trialing';

          await supabase
            .from('subscriptions')
            .update({
              status: sub.status === 'active' ? 'active' : 'expired',
              current_period_end: new Date(
                sub.current_period_end * 1000
              ).toISOString(),
            })
            .eq('external_id', sub.id);

          await supabase
            .from('profiles')
            .update({
              subscription_status: isActive ? 'active' : 'expired',
              subscription_expires_at: new Date(
                sub.current_period_end * 1000
              ).toISOString(),
            })
            .eq('id', existing.user_id);
        }
        break;
      }
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
