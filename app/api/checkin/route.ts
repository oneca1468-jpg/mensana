import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { mood, event, context, thought, action } = body;

    // Map to the user's explicit schema: id, user_id, mood, event, context, thought, action, checked_in_at, checked_in_date
    const payload = {
      user_id: user.id,
      mood: mood,
      event: event || null,
      context: Array.isArray(context) ? context.join(', ') : (context || null),
      thought: thought || null,
      action: action || null,
      checked_in_at: new Date().toISOString(),
      checked_in_date: new Date().toISOString().split('T')[0],
    };

    const { error } = await supabase
      .from('checkins')
      .insert(payload);

    if (error) {
      console.error('Supabase checkin insert error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Check-in saved successfully.' });
  } catch (error: any) {
    console.error('API exception:', error);
    return NextResponse.json({ success: false, error: 'Failed to process check-in.' }, { status: 500 });
  }
}
