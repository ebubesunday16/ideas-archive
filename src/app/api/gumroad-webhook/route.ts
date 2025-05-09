import { NextRequest, NextResponse } from 'next/server';
import { supabase } from "@/lib/supabaseClient";
import crypto from 'crypto';

// Gumroad webhook verification function
function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  try {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(payload);
    const digest = hmac.digest('hex');
    
    // Safe comparison of two strings
    return crypto.timingSafeEqual(
      Buffer.from(digest),
      Buffer.from(signature)
    );
  } catch (error) {
    console.error("Signature verification error:", error);
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    // Get raw body for signature verification
    const rawBody = await req.text();
    console.log("Received webhook payload:", rawBody);

    // Parse the webhook payload
    const payload = JSON.parse(rawBody);
    
    // Get signature from headers
    const signature = req.headers.get('X-Gumroad-Signature');
    
    // In production, always verify the signature
    if (process.env.NODE_ENV === 'production') {
      if (!signature || !process.env.GUMROAD_WEBHOOK_SECRET) {
        console.error("Missing signature or webhook secret");
        return NextResponse.json({ error: 'Invalid request' }, { status: 403 });
      }
      
      if (!verifyWebhookSignature(rawBody, signature, process.env.GUMROAD_WEBHOOK_SECRET)) {
        console.error("Invalid webhook signature");
        return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
      }
    }

    // Handle different webhook events
    const eventName = payload.event;
    console.log("Processing event:", eventName);

    if (!payload.purchaser_email) {
      console.error("Missing purchaser email in webhook payload");
      return NextResponse.json({ error: 'Missing purchaser email' }, { status: 400 });
    }

    // Get user from email
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', payload.purchaser_email)
      .single();
    
    if (userError || !userData) {
      console.error('User not found:', payload.purchaser_email, userError);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    const userId = userData.id;
    console.log("Found user ID:", userId);

    if (eventName === 'sale') {
      // Handle one-time purchases if needed
      console.log("Processing sale event");
      
      // Here you can add logic for one-time purchases if needed
      
    } else if (eventName === 'subscription_created' || eventName === 'subscription_updated') {
      console.log("Processing subscription event:", eventName);
      
      const {
        subscription_id,
        product_id,
        product_name,
        price_cents,
        recurrence,
        cancelled_at,
        ended_at,
      } = payload;
      
      // Calculate end date based on recurrence
      let periodEndDate;
      const now = new Date();
      
      if (recurrence === 'monthly') {
        periodEndDate = new Date(now.setMonth(now.getMonth() + 1));
      } else if (recurrence === 'yearly') {
        periodEndDate = new Date(now.setFullYear(now.getFullYear() + 1));
      } else {
        // Default to 30 days for unknown recurrence
        periodEndDate = new Date(now.setDate(now.getDate() + 30));
      }
      
      // Determine subscription status
      const status = (cancelled_at || ended_at) ? 'inactive' : 'active';
      
      // Check if subscription already exists
      const { data: existingSub, error: lookupError } = await supabase
        .from('subscriptions')
        .select('id')
        .eq('subscription_id', subscription_id)
        .maybeSingle();
      
      if (lookupError) {
        console.error('Error looking up subscription:', lookupError);
      }
      
      if (existingSub) {
        console.log("Updating existing subscription:", subscription_id);
        // Update existing subscription
        const { error } = await supabase
          .from('subscriptions')
          .update({
            status,
            current_period_end: periodEndDate,
            cancel_at_period_end: !!cancelled_at,
            updated_at: new Date()
          })
          .eq('subscription_id', subscription_id);
        
        if (error) {
          console.error('Error updating subscription:', error);
          return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }
      } else {
        console.log("Creating new subscription for user:", userId);
        // Create new subscription
        const { error } = await supabase
          .from('subscriptions')
          .insert({
            user_id: userId,
            subscription_id,
            product_id,
            product_name: product_name || 'Premium Subscription',
            status,
            plan_type: recurrence || 'one_time',
            price_cents: price_cents || 0,
            current_period_end: periodEndDate,
            cancel_at_period_end: !!cancelled_at,
            created_at: new Date(),
            updated_at: new Date()
          });
        
        if (error) {
          console.error('Error creating subscription:', error);
          return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }
      }
    } else if (eventName === 'subscription_cancelled') {
      console.log("Processing subscription cancellation");
      
      const { subscription_id } = payload;
      
      if (!subscription_id) {
        console.error("Missing subscription_id in cancellation event");
        return NextResponse.json({ error: 'Missing subscription ID' }, { status: 400 });
      }
      
      // Update subscription status
      const { error } = await supabase
        .from('subscriptions')
        .update({ 
          status: 'inactive',
          cancel_at_period_end: true,
          updated_at: new Date()
        })
        .eq('subscription_id', subscription_id);
      
      if (error) {
        console.error('Error updating subscription status:', error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
      }
    } else {
      console.log("Unhandled event type:", eventName);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}