// Main conversation controller - orchestrates the agent interactions

import type { AgentContext, AgentResponse } from '@/types/agent';
import type { SessionPhase } from '@/types/session';
import { getAgentResponse } from '@/lib/integrations/anthropic';
import {
  SessionState,
  INITIAL_STATE,
  updateState,
  shouldTransitionPhase,
} from './state-machine';
import { buildUserMessage, buildInitialMessage } from './prompt-builder';
import { parseAgentResponse } from './response-parser';

export interface OrchestratorResult {
  response: AgentResponse;
  newState: SessionState;
  error?: string;
}

export class ConversationOrchestrator {
  private state: SessionState;
  private conversationHistory: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  private sessionId: string;
  private companyName?: string;
  private userName?: string;

  constructor(
    sessionId: string,
    initialState?: SessionState,
    conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>,
    companyName?: string,
    userName?: string
  ) {
    this.sessionId = sessionId;
    this.state = initialState || INITIAL_STATE;
    this.conversationHistory = conversationHistory || [];
    this.companyName = companyName;
    this.userName = userName;
  }

  async startSession(): Promise<OrchestratorResult> {
    try {
      const initialMessage = buildInitialMessage(
        this.companyName,
        this.userName
      );
      const rawResponse = await getAgentResponse(initialMessage);
      const response = parseAgentResponse(rawResponse);

      // Update conversation history with the assistant's response
      this.conversationHistory.push({
        role: 'assistant',
        content: response.spokenResponse,
      });

      // Update state based on agent's response
      this.state = this.applyStateUpdates(response);

      return {
        response,
        newState: this.state,
      };
    } catch (error) {
      console.error('Error starting session:', error);
      return {
        response: this.createErrorResponse(),
        newState: this.state,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async processMessage(userMessage: string): Promise<OrchestratorResult> {
    try {
      // Add user message to history
      this.conversationHistory.push({
        role: 'user',
        content: userMessage,
      });

      // Build context for the agent
      const context: AgentContext = {
        sessionId: this.sessionId,
        currentPhase: this.state.phase,
        conversationHistory: this.conversationHistory,
        rapidFireResponses: this.state.rapidFireResponses,
        identifiedValues: this.state.identifiedValues,
        deepDiveValuesExplored: this.state.deepDiveValuesExplored,
        companyName: this.companyName,
        userName: this.userName,
      };

      // Build the full message with context
      const fullMessage = buildUserMessage(context, userMessage);

      // Get response from Claude
      const rawResponse = await getAgentResponse(fullMessage);
      const response = parseAgentResponse(rawResponse);

      // Add assistant response to history
      this.conversationHistory.push({
        role: 'assistant',
        content: response.spokenResponse,
      });

      // Update state based on agent's response
      this.state = this.applyStateUpdates(response);

      return {
        response,
        newState: this.state,
      };
    } catch (error) {
      console.error('Error processing message:', error);
      return {
        response: this.createErrorResponse(),
        newState: this.state,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private applyStateUpdates(response: AgentResponse): SessionState {
    const { stateUpdates } = response;

    // Build updates object
    const updates: Partial<SessionState> = {};

    // Handle phase transition
    if (stateUpdates.phase) {
      updates.phase = shouldTransitionPhase(this.state, stateUpdates.phase);
    }

    // Handle rapid fire responses from identified values
    if (
      this.state.phase === 'RAPID_FIRE' &&
      stateUpdates.identifiedValues.length > 0
    ) {
      // During rapid fire, identifiedValues might contain the user's responses
      // This is tracked separately in the actual rapid fire tracking
    }

    // Update identified values
    if (stateUpdates.identifiedValues.length > 0) {
      const existingNames = new Set(
        this.state.identifiedValues.map((v) => v.name)
      );
      const newValues = stateUpdates.identifiedValues
        .filter((name) => !existingNames.has(name))
        .map((name) => ({ name, quotes: [] }));

      if (newValues.length > 0) {
        updates.identifiedValues = [
          ...this.state.identifiedValues,
          ...newValues,
        ];
      }
    }

    // Track values being explored in deep dive
    if (stateUpdates.valuesToExplore.length > 0) {
      const explored = new Set(this.state.deepDiveValuesExplored);
      stateUpdates.valuesToExplore.forEach((v) => explored.add(v));
      updates.deepDiveValuesExplored = Array.from(explored);
    }

    // Track scenario completion (moving from SCENARIO to SYNTHESIS)
    if (stateUpdates.phase === 'SYNTHESIS' && this.state.phase === 'SCENARIO') {
      updates.scenarioCompleted = true;
    }

    // Track synthesis delivery — mark it when AI is in or enters SYNTHESIS
    // (the synthesis content IS the delivery)
    if (this.state.phase === 'SYNTHESIS' || stateUpdates.phase === 'SYNTHESIS') {
      updates.synthesisDelivered = true;
    }

    return updateState(this.state, updates);
  }

  private createErrorResponse(): AgentResponse {
    return {
      spokenResponse:
        "I apologize, but I'm having a bit of trouble right now. Could you repeat what you just said?",
      internalNotes: 'Error occurred, requesting user to repeat',
      stateUpdates: {
        phase: this.state.phase,
        newInsights: [],
        identifiedValues: [],
        valuesToExplore: [],
      },
      uiActions: {},
    };
  }

  // Methods to record rapid fire responses
  recordRapidFireResponse(
    word: string,
    response: 'yes' | 'no' | 'maybe'
  ): void {
    this.state = updateState(this.state, {
      rapidFireResponses: [
        ...this.state.rapidFireResponses,
        { word, response },
      ],
      rapidFireIndex: this.state.rapidFireIndex + 1,
    });
  }

  // Getters
  getState(): SessionState {
    return this.state;
  }

  getConversationHistory(): Array<{
    role: 'user' | 'assistant';
    content: string;
  }> {
    return this.conversationHistory;
  }

  getCurrentPhase(): SessionPhase {
    return this.state.phase;
  }

  getIdentifiedValues(): Array<{
    name: string;
    definition?: string;
    quotes: string[];
  }> {
    return this.state.identifiedValues;
  }
}

// Factory function for creating orchestrators
export function createOrchestrator(
  sessionId: string,
  options?: {
    initialState?: SessionState;
    conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
    companyName?: string;
    userName?: string;
  }
): ConversationOrchestrator {
  return new ConversationOrchestrator(
    sessionId,
    options?.initialState,
    options?.conversationHistory,
    options?.companyName,
    options?.userName
  );
}
