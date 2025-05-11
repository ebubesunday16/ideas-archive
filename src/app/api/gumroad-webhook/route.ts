import { NextRequest, NextResponse } from 'next/server';
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: NextRequest) {
  try {
    // Gumroad sends data as form-urlencoded
    const formData = await req.formData();
    
    // Convert FormData to a regular object
    const payload: Record<string, any> = {};
    formData.forEach((value, key) => {
      // Try to parse nested objects (like url_params, variants, custom_fields)
      if (key === 'url_params' || key === 'variants' || key === 'custom_fields' || key === 'shipping_information') {
        try {
          payload[key] = JSON.parse(value as string);
        } catch (e) {
          payload[key] = value;
        }
      } else {
        payload[key] = value;
      }
    });
    
    console.log('Received Gumroad ping:', payload);
    
    // Extract key information from the payload
    const {
      sale_id,
      product_id,
      email,
      price, // in cents
      recurrence,
      refunded,
      subscription_id,
      test
    } = payload;
    
    // Skip test purchases if configured to do so
    if (test === 'true' && process.env.IGNORE_TEST_PURCHASES === 'true') {
      return NextResponse.json({ success: true, message: 'Test purchase ignored' });
    }
    
    // Get user from email
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();
    
    if (userError || !userData) {
      console.error('User not found:', email);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    const userId = userData.id;
    
    // Determine subscription status
    const status = refunded === 'true' ? 'inactive' : 'active';
    
    // Handle subscription
    if (subscription_id) {
      // Check if subscription already exists
      const { data: existingSub } = await supabase
        .from('subscriptions')
        .select('id')
        .eq('subscription_id', subscription_id)
        .single();
      
      // Calculate next billing date (30 days for monthly, 365 for yearly by default)
      let daysUntilRenewal = 30;
      if (recurrence === 'yearly') {
        daysUntilRenewal = 365;
      } else if (recurrence === 'quarterly') {
        daysUntilRenewal = 90;
      }
      
      const nextBillingDate = new Date();
      nextBillingDate.setDate(nextBillingDate.getDate() + daysUntilRenewal);
      
      if (existingSub) {
        // Update existing subscription
        const { error } = await supabase
          .from('subscriptions')
          .update({
            status,
            current_period_end: nextBillingDate,
            cancel_at_period_end: refunded === 'true',
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
            current_period_end: nextBillingDate,
            cancel_at_period_end: refunded === 'true',
          });
        
        if (error) {
          console.error('Error creating subscription:', error);
          return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }
      }
    } else {
      // Handle one-time purchase
      const { error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: userId,
          subscription_id: sale_id, // Use sale_id as a unique identifier
          product_id,
          status,
          plan_type: 'one_time',
          current_period_end: new Date(2099, 11, 31), // Far future date for one-time purchases
          cancel_at_period_end: false,
        });
      
      if (error) {
        console.error('Error recording one-time purchase:', error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
      }
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}