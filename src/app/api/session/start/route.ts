// POST /api/session/start - Initialize a new brand discovery session

import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { createOrchestrator } from '@/lib/agent/orchestrator';
import type { SessionPhase } from '@/types/session';

interface StartSessionRequest {
  company_name?: string;
  user_name?: string;
}

interface StartSessionResponse {
  success: boolean;
  session: {
    id: string;
    current_phase: SessionPhase;
    created_at: string;
  };
  initial_message: {
    spoken_response: string;
    ui_actions: {
      showValueCards?: string[] | null;
      highlightValue?: string | null;
      updateProgress?: string | null;
    };
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as StartSessionRequest;

    // Create session in database
    const { data: session, error: sessionError } = await supabaseServer
      .from('sessions')
      .insert({
        company_name: body.company_name || null,
        user_name: body.user_name || null,
        status: 'active',
        current_phase: 'OPENING',
      })
      .select()
      .single();

    if (sessionError || !session) {
      console.error('Failed to create session:', sessionError);
      return NextResponse.json(
        { success: false, error: 'Failed to create session' },
        { status: 500 }
      );
    }

    // Initialize orchestrator and get opening message
    const orchestrator = createOrchestrator(session.id, {
      companyName: body.company_name,
      userName: body.user_name,
    });
    const result = await orchestrator.startSession();

    if (result.error) {
      console.error('Orchestrator error:', result.error);
      // Return a fallback response even on error
    }

    // Store the initial assistant message
    const { error: messageError } = await supabaseServer
      .from('conversation_messages')
      .insert({
        session_id: session.id,
        role: 'assistant',
        content: result.response.spokenResponse,
        response_data: result.response as unknown as Record<string, unknown>,
        sequence_number: 1,
      });

    if (messageError) {
      console.error('Failed to store message:', messageError);
    }

    const response: StartSessionResponse = {
      success: true,
      session: {
        id: session.id,
        current_phase: session.current_phase as SessionPhase,
        created_at: session.created_at,
      },
      initial_message: {
        spoken_response: result.response.spokenResponse,
        ui_actions: result.response.uiActions,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in session start:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
