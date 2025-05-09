import { NextRequest, NextResponse } from 'next/server';
import { supabase } from "@/lib/supabaseClient";
import crypto from 'crypto';

// Gumroad webhook verification function
function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload);
  const digest = hmac.digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(digest),
    Buffer.from(signature)
  );
}

export async function POST(req: NextRequest) {
  try {
    // Get raw body for signature verification
    const rawBody = await req.text();

    // Parse the webhook payload
    const payload = JSON.parse(rawBody);
    
    // For production, uncomment to verify webhook signature
    // const signature = req.headers.get('X-Gumroad-Signature');
    // if (!signature || !verifyWebhookSignature(rawBody, signature, process.env.GUMROAD_WEBHOOK_SECRET!)) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
    // }

    // Handle different webhook events
    const eventName = payload.event;

    if (eventName === 'subscription.created' || eventName === 'subscription.updated') {
      const {
        subscription_id,
        product_id,
        purchaser_email,
        price,
        recurrence,
        cancelled,
        ended,
      } = payload;
      
      // Get user from email
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', purchaser_email)
        .single();
      
      if (userError || !userData) {
        console.error('User not found:', purchaser_email);
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      
      const userId = userData.id;
      
      // Determine subscription status
      const status = cancelled || ended ? 'inactive' : 'active';
      
      // Check if subscription already exists
      const { data: existingSub } = await supabase
        .from('subscriptions')
        .select('id')
        .eq('subscription_id', subscription_id)
        .single();
      
      if (existingSub) {
        // Update existing subscription
        const { error } = await supabase
          .from('subscriptions')
          .update({
            status,
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Approx 30 days
            cancel_at_period_end: !!cancelled,
          })
          .eq('subscription_id', subscription_id);
        
        if (error) {
          console.error('Error updating subscription:', error);
          return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }
      } else {
        // Create new subscription
        const { error } = await supabase
          .from('subscriptions')
          .insert({
            user_id: userId,
            subscription_id,
            product_id,
            status,
            plan_type: recurrence || 'one_time',
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Approx 30 days
            cancel_at_period_end: !!cancelled,
          });
        
        if (error) {
          console.error('Error creating subscription:', error);
          return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }
      }
    } else if (eventName === 'subscription.cancelled' || eventName === 'subscription.ended') {
      const { subscription_id } = payload;
      
      // Update subscription status
      const { error } = await supabase
        .from('subscriptions')
        .update({ status: 'inactive' })
        .eq('subscription_id', subscription_id);
      
      if (error) {
        console.error('Error updating subscription status:', error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
      }
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}