// Exercise-related types

export interface ValueWord {
  word: string;
  category?: 'core' | 'growth' | 'culture' | 'impact';
}

export interface RapidFireState {
  currentIndex: number;
  totalWords: number;
  responses: RapidFireWordResponse[];
  isComplete: boolean;
}

export interface RapidFireWordResponse {
  word: string;
  response: 'yes' | 'no' | 'maybe';
  responseTimeMs?: number;
  timestamp: string;
}

export interface DeepDiveValue {
  name: string;
  explorationQuestions: string[];
  userResponses: string[];
  synthesizedDefinition?: string;
}

export interface ScenarioState {
  scenarioText: string;
  userResponse?: string;
  followUpAsked: boolean;
  complete: boolean;
}

export interface SynthesisState {
  proposedValues: Array<{
    name: string;
    definition: string;
    supportingQuotes: string[];
  }>;
  userFeedback?: string;
  refinementRequested: boolean;
}
