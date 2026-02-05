// Agent response types

import type { SessionPhase } from './session';

export interface AgentResponse {
  spokenResponse: string;
  internalNotes: string;
  stateUpdates: StateUpdates;
  uiActions: UIActions;
}

export interface StateUpdates {
  phase: SessionPhase;
  newInsights: string[];
  identifiedValues: string[];
  valuesToExplore: string[];
}

export interface UIActions {
  showValueCards?: string[] | null;
  highlightValue?: string | null;
  updateProgress?: string | null;
  showSummary?: boolean;
}

export interface AgentContext {
  sessionId: string;
  currentPhase: SessionPhase;
  conversationHistory: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  rapidFireResponses: Array<{
    word: string;
    response: 'yes' | 'no' | 'maybe';
  }>;
  identifiedValues: Array<{
    name: string;
    definition?: string;
    quotes: string[];
  }>;
  deepDiveValuesExplored: string[];
  companyName?: string;
  userName?: string;
}
