import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { supabase } from '@/lib/supabaseClient';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ subscribed: false, error: 'Not authenticated' }, { status: 401 });
    }
    
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single();
    
    if (userError || !userData) {
      return NextResponse.json({ subscribed: false, error: 'User not found' }, { status: 404 });
    }
    
    const { data: subscriptionData, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userData.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (subError && subError.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
      console.error('Subscription check error:', subError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
    
    // Return subscription details
    if (subscriptionData) {
      return NextResponse.json({
        subscribed: true,
        plan: subscriptionData.plan_type,
        expiresAt: subscriptionData.current_period_end,
        cancelAtPeriodEnd: subscriptionData.cancel_at_period_end,
      });
    } else {
      return NextResponse.json({ subscribed: false });
    }
  } catch (error) {
    console.error('Check subscription error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}