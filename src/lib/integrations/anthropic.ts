// Anthropic Claude API wrapper

import Anthropic from '@anthropic-ai/sdk';
import { BRAND_STRATEGIST_SYSTEM_PROMPT } from '@/lib/agent/system-prompt';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

// Default model - can be upgraded to claude-3-opus for higher quality
const DEFAULT_MODEL = 'claude-sonnet-4-20250514';

export async function getAgentResponse(contextMessage: string): Promise<string> {
  console.log('[Anthropic] Sending request to Claude...');
  console.log('[Anthropic] Model:', DEFAULT_MODEL);
  console.log('[Anthropic] Context message length:', contextMessage.length);

  try {
    const response = await anthropic.messages.create({
      model: DEFAULT_MODEL,
      max_tokens: 1024,
      system: BRAND_STRATEGIST_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: contextMessage,
        },
      ],
    });

    console.log('[Anthropic] Response received, stop_reason:', response.stop_reason);

    // Extract text content from response
    const content = response.content[0];
    if (content.type !== 'text') {
      console.error('[Anthropic] Unexpected content type:', content.type);
      throw new Error('Unexpected response type from Claude');
    }

    console.log('[Anthropic] Response text length:', content.text.length);
    console.log('[Anthropic] Response preview:', content.text.substring(0, 300));

    return content.text;
  } catch (error) {
    console.error('[Anthropic] API call failed:', error);
    throw error;
  }
}

export async function getAgentResponseStreaming(
  contextMessage: string,
  onToken: (token: string) => void
): Promise<string> {
  const stream = anthropic.messages.stream({
    model: DEFAULT_MODEL,
    max_tokens: 1024,
    system: BRAND_STRATEGIST_SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: contextMessage,
      },
    ],
  });

  let fullResponse = '';

  for await (const event of stream) {
    if (
      event.type === 'content_block_delta' &&
      event.delta.type === 'text_delta'
    ) {
      const token = event.delta.text;
      fullResponse += token;
      onToken(token);
    }
  }

  return fullResponse;
}

// For testing/development - mock response
export function getMockAgentResponse(phase: string): string {
  const mockResponses: Record<string, object> = {
    OPENING: {
      spokenResponse:
        "Welcome! I'm Miyara, and I'm here to help you discover your brand's core values. Before we dive in, I'm curious—what brought you here today? What's the moment that made you think 'I need to figure out my brand'?",
      internalNotes: 'Session start. Need to understand founder motivation.',
      stateUpdates: {
        phase: 'OPENING',
        newInsights: [],
        identifiedValues: [],
        valuesToExplore: [],
      },
      uiActions: {
        updateProgress: 'Opening',
      },
    },
    RAPID_FIRE_INTRO: {
      spokenResponse:
        "I'm going to show you some words—values that brands often hold. For each one, just tell me 'yes' if it resonates, 'no' if it doesn't, or 'maybe' if you're unsure. Go with your gut—don't overthink it. Ready?",
      internalNotes: 'Transitioning to rapid fire exercise.',
      stateUpdates: {
        phase: 'RAPID_FIRE_INTRO',
        newInsights: [],
        identifiedValues: [],
        valuesToExplore: [],
      },
      uiActions: {
        updateProgress: 'Value Words',
      },
    },
    RAPID_FIRE: {
      spokenResponse:
        "Here we go. How about: Innovation... Trust... Excellence?",
      internalNotes: 'Starting rapid fire with first batch of values.',
      stateUpdates: {
        phase: 'RAPID_FIRE',
        newInsights: [],
        identifiedValues: [],
        valuesToExplore: [],
      },
      uiActions: {
        showValueCards: ['Innovation', 'Trust', 'Excellence'],
        updateProgress: 'Value Words',
      },
    },
  };

  return JSON.stringify(mockResponses[phase] || mockResponses.OPENING);
}
