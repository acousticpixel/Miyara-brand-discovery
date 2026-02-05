// POST /api/session/complete - Finalize session and generate deliverable

import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import type { DeliverableContent, IdentifiedValue } from '@/types/session';

interface CompleteRequest {
  session_id: string;
}

interface CompleteResponse {
  success: boolean;
  deliverable: {
    id: string;
    share_slug: string;
    content: DeliverableContent;
  };
  share_url: string;
}

function generateShareSlug(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let slug = '';
  for (let i = 0; i < 8; i++) {
    slug += chars[Math.floor(Math.random() * chars.length)];
  }
  return slug;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CompleteRequest;

    if (!body.session_id) {
      return NextResponse.json(
        { success: false, error: 'Missing session_id' },
        { status: 400 }
      );
    }

    // Get session
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sessionResult: any = await supabaseServer
      .from('sessions')
      .select('*')
      .eq('id', body.session_id)
      .single();

    if (sessionResult.error || !sessionResult.data) {
      return NextResponse.json(
        { success: false, error: 'Session not found', code: 'SESSION_NOT_FOUND' },
        { status: 404 }
      );
    }

    const session = sessionResult.data;

    // Get identified values
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const valuesResult: any = await supabaseServer
      .from('identified_values')
      .select('*')
      .eq('session_id', body.session_id)
      .order('display_order', { ascending: true });

    if (valuesResult.error) {
      console.error('Failed to fetch values:', valuesResult.error);
    }

    const values = valuesResult.data || [];

    // Transform values for deliverable
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const finalValues: IdentifiedValue[] = values.map((v: any) => ({
      id: v.id,
      session_id: v.session_id,
      created_at: v.created_at,
      updated_at: v.updated_at,
      value_name: v.value_name,
      personalized_definition: v.personalized_definition || undefined,
      in_practice: v.in_practice || undefined,
      anti_pattern: v.anti_pattern || undefined,
      user_quotes: (v.user_quotes as string[]) || [],
      confidence_score: v.confidence_score,
      is_final: true,
      display_order: v.display_order || undefined,
    }));

    // Generate deliverable content
    const deliverableContent: DeliverableContent = {
      company_name: session.company_name || 'Your Brand',
      generated_at: new Date().toISOString(),
      values: finalValues,
      session_summary: `Brand values discovered through an interactive session on ${new Date(session.started_at).toLocaleDateString()}.`,
    };

    // Check if deliverable already exists
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const existingResult: any = await supabaseServer
      .from('deliverables')
      .select('*')
      .eq('session_id', body.session_id)
      .single();

    let deliverable;

    if (existingResult.data) {
      // Update existing deliverable
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updateResult: any = await supabaseServer
        .from('deliverables')
        .update({ content: deliverableContent })
        .eq('id', existingResult.data.id)
        .select()
        .single();

      if (updateResult.error) {
        throw updateResult.error;
      }
      deliverable = updateResult.data;
    } else {
      // Create new deliverable
      const shareSlug = generateShareSlug();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const createResult: any = await supabaseServer
        .from('deliverables')
        .insert({
          session_id: body.session_id,
          content: deliverableContent,
          share_slug: shareSlug,
        })
        .select()
        .single();

      if (createResult.error) {
        throw createResult.error;
      }
      deliverable = createResult.data;
    }

    // Update session status
    const completedAt = new Date();
    const startedAt = new Date(session.started_at);
    const durationSeconds = Math.floor(
      (completedAt.getTime() - startedAt.getTime()) / 1000
    );

    await supabaseServer
      .from('sessions')
      .update({
        status: 'completed',
        current_phase: 'COMPLETE',
        completed_at: completedAt.toISOString(),
        duration_seconds: durationSeconds,
      })
      .eq('id', body.session_id);

    // Mark all values as final
    await supabaseServer
      .from('identified_values')
      .update({ is_final: true })
      .eq('session_id', body.session_id);

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const shareUrl = `${baseUrl}/deliverable/${deliverable.share_slug}`;

    const response: CompleteResponse = {
      success: true,
      deliverable: {
        id: deliverable.id,
        share_slug: deliverable.share_slug!,
        content: deliverableContent,
      },
      share_url: shareUrl,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error completing session:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
