// POST /api/session/message - Process a user message and get agent response

import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { createOrchestrator } from '@/lib/agent/orchestrator';
import type { SessionState } from '@/lib/agent/state-machine';
import type { SessionPhase, ConversationMessage } from '@/types/session';
import type { AgentResponse as _AgentResponse } from '@/types/agent'; // eslint-disable-line @typescript-eslint/no-unused-vars

interface MessageRequest {
  session_id: string;
  user_message: string;
  timestamp?: string;
}

interface MessageResponse {
  success: boolean;
  response: {
    spoken_response: string;
    internal_notes: string;
    state_updates: {
      phase: SessionPhase;
      new_insights: string[];
      identified_values: string[];
      values_to_explore: string[];
    };
    ui_actions: {
      show_value_cards?: string[] | null;
      highlight_value?: string | null;
      update_progress?: string | null;
      show_summary?: boolean;
    };
  };
  session: {
    current_phase: SessionPhase;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as MessageRequest;

    if (!body.session_id || !body.user_message) {
      return NextResponse.json(
        { success: false, error: 'Missing session_id or user_message' },
        { status: 400 }
      );
    }

    // Get session from database
    const { data: session, error: sessionError } = await supabaseServer
      .from('sessions')
      .select('*')
      .eq('id', body.session_id)
      .single();

    if (sessionError || !session) {
      return NextResponse.json(
        { success: false, error: 'Session not found', code: 'SESSION_NOT_FOUND' },
        { status: 404 }
      );
    }

    if (session.status !== 'active') {
      return NextResponse.json(
        { success: false, error: 'Session is not active' },
        { status: 400 }
      );
    }

    // Get conversation history
    const { data: messages, error: messagesError } = await supabaseServer
      .from('conversation_messages')
      .select('*')
      .eq('session_id', body.session_id)
      .order('sequence_number', { ascending: true });

    if (messagesError) {
      console.error('Failed to fetch messages:', messagesError);
    }

    // Get rapid fire responses
    const { data: rapidFireResponses } = await supabaseServer
      .from('rapid_fire_responses')
      .select('*')
      .eq('session_id', body.session_id)
      .order('sequence_number', { ascending: true });

    // Get identified values
    const { data: identifiedValues } = await supabaseServer
      .from('identified_values')
      .select('*')
      .eq('session_id', body.session_id);

    // Build conversation history
    const conversationHistory = (messages || []).map((m: ConversationMessage) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));

    // Reconstruct state from database
    const state: SessionState = {
      phase: session.current_phase as SessionPhase,
      rapidFireIndex: rapidFireResponses?.length || 0,
      rapidFireResponses: (rapidFireResponses || []).map((r) => ({
        word: r.value_word,
        response: r.response as 'yes' | 'no' | 'maybe',
      })),
      deepDiveValuesExplored: (identifiedValues || [])
        .filter((v) => v.personalized_definition)
        .map((v) => v.value_name),
      identifiedValues: (identifiedValues || []).map((v) => ({
        name: v.value_name,
        definition: v.personalized_definition || undefined,
        quotes: (v.user_quotes as string[]) || [],
      })),
      scenarioCompleted: session.current_phase === 'SYNTHESIS' || session.current_phase === 'REFINEMENT' || session.current_phase === 'COMPLETE',
      synthesisDelivered: session.current_phase === 'SYNTHESIS' || session.current_phase === 'REFINEMENT' || session.current_phase === 'COMPLETE',
    };

    // Create orchestrator with current state
    const orchestrator = createOrchestrator(
      body.session_id,
      {
        initialState: state,
        conversationHistory,
        companyName: session.company_name || undefined,
        userName: session.user_name || undefined,
      }
    );

    // Process the message
    const result = await orchestrator.processMessage(body.user_message);

    if (result.error) {
      console.error('Orchestrator error:', result.error);
    }

    const nextSequence = (messages?.length || 0) + 1;

    // Store user message
    await supabaseServer.from('conversation_messages').insert({
      session_id: body.session_id,
      role: 'user',
      content: body.user_message,
      sequence_number: nextSequence,
    });

    // Store assistant response
    await supabaseServer.from('conversation_messages').insert({
      session_id: body.session_id,
      role: 'assistant',
      content: result.response.spokenResponse,
      response_data: result.response as unknown as Record<string, unknown>,
      sequence_number: nextSequence + 1,
    });

    // Update session phase if changed
    if (result.newState.phase !== session.current_phase) {
      await supabaseServer
        .from('sessions')
        .update({ current_phase: result.newState.phase })
        .eq('id', body.session_id);
    }

    // Store any new identified values
    const newValues = result.response.stateUpdates.identifiedValues.filter(
      (v) => !identifiedValues?.find((iv) => iv.value_name === v)
    );

    if (newValues.length > 0) {
      await supabaseServer.from('identified_values').insert(
        newValues.map((name, idx) => ({
          session_id: body.session_id,
          value_name: name,
          display_order: (identifiedValues?.length || 0) + idx + 1,
        }))
      );
    }

    const response: MessageResponse = {
      success: true,
      response: {
        spoken_response: result.response.spokenResponse,
        internal_notes: result.response.internalNotes,
        state_updates: {
          phase: result.response.stateUpdates.phase,
          new_insights: result.response.stateUpdates.newInsights,
          identified_values: result.response.stateUpdates.identifiedValues,
          values_to_explore: result.response.stateUpdates.valuesToExplore,
        },
        ui_actions: {
          show_value_cards: result.response.uiActions.showValueCards,
          highlight_value: result.response.uiActions.highlightValue,
          update_progress: result.response.uiActions.updateProgress,
          show_summary: result.response.uiActions.showSummary,
        },
      },
      session: {
        current_phase: result.newState.phase,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in session message:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
