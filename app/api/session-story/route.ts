import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import Anthropic from '@anthropic-ai/sdk';
import crypto from 'crypto';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { data: story } = await supabase
      .from('session_stories')
      .select('*')
      .eq('user_id', user.id)
      .order('generated_at', { ascending: false })
      .limit(1)
      .single();

    if (!story) {
      return NextResponse.json({ success: true, story: null });
    }

    return NextResponse.json({ success: true, story });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const firstName = user.user_metadata?.first_name || "a pessoa";

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const cutoffIso = sevenDaysAgo.toISOString().split('T')[0];

    const { data: checkins } = await supabase
      .from('checkins')
      .select('*')
      .eq('user_id', user.id)
      .gte('checked_in_date', cutoffIso)
      .order('checked_in_date', { ascending: true });

    if (!checkins || checkins.length < 3) {
      return NextResponse.json(
        { success: false, error: 'INSUFFICIENT_DATA', message: 'Faz pelo menos 3 check-ins esta semana para gerar a tua Session Story.' }, 
        { status: 400 }
      );
    }

    // Format checkins for Claude
    const checkinsText = checkins.map(c => `
Date: ${c.checked_in_date}
Mood (1-10): ${c.mood}
Context: ${c.context || 'N/A'}
Event: ${c.event || 'N/A'}
Thought: ${c.thought || 'N/A'}
Action: ${c.action || 'N/A'}
`).join('\n---');

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const systemPrompt = `You are generating a Session Story for a therapy patient. 
Write 150-200 words in European Portuguese, warm human language, never clinical.

Structure:
1. How the week started emotionally
2. Any significant event or turning point  
3. Recurring thought or pattern detected
4. What the person tried to do about it
5. How the week ended / current state

Rules:
- Never use clinical language or diagnoses
- Write in third person using the user's first name (${firstName})
- Be specific — reference actual events from the data
- End with 1 sentence suggesting a focus for the session
- Tone: warm, precise, non-judgmental`;

    let generatedText = "";
    try {
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        system: systemPrompt,
        messages: [
          { role: "user", content: `Here is the check-in data from the last 7 days:\n${checkinsText}` }
        ]
      });
      // Handle the text block content correctly in Anthropic SDK v3+
      generatedText = (response.content.find((block: any) => block.type === 'text') as any)?.text || "";
    } catch (apiError: any) {
      console.warn("Primary model claude-sonnet-4-6 failed, falling back to claude-3-5-sonnet-latest", apiError);
      const fallbackResponse = await anthropic.messages.create({
        model: "claude-3-5-sonnet-latest",
        max_tokens: 1000,
        system: systemPrompt,
        messages: [
          { role: "user", content: `Here is the check-in data from the last 7 days:\n${checkinsText}` }
        ]
      });
      generatedText = (fallbackResponse.content.find((block: any) => block.type === 'text') as any)?.text || "";
    }

    if (!generatedText) {
      throw new Error("Failed to generate response from Anthropic");
    }

    const shareToken = crypto.randomUUID();
    
    // Save to session_stories
    const { data: insertedStory, error: insertError } = await supabase
      .from('session_stories')
      .insert({
        user_id: user.id,
        content: generatedText,
        week_start: cutoffIso,
        share_token: shareToken,
        generated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) {
      throw new Error(`DB Insert Error: ${insertError.message}`);
    }

    return NextResponse.json({ success: true, story: insertedStory });
  } catch (error: any) {
    console.error("Session Story POST error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
