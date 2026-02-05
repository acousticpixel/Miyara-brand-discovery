// Parses and validates agent JSON responses

import type { AgentResponse, StateUpdates, UIActions } from '@/types/agent';
import type { SessionPhase } from '@/types/session';

const VALID_PHASES: SessionPhase[] = [
  'OPENING',
  'RAPID_FIRE_INTRO',
  'RAPID_FIRE',
  'RAPID_FIRE_DEBRIEF',
  'DEEP_DIVE',
  'SCENARIO',
  'SYNTHESIS',
  'REFINEMENT',
  'COMPLETE',
];

export class AgentResponseParseError extends Error {
  constructor(
    message: string,
    public rawResponse: string
  ) {
    super(message);
    this.name = 'AgentResponseParseError';
  }
}

export function parseAgentResponse(rawResponse: string): AgentResponse {
  // Try to extract JSON from the response
  let jsonString = rawResponse.trim();

  // Handle case where response might be wrapped in markdown code blocks
  const jsonMatch = jsonString.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (jsonMatch) {
    jsonString = jsonMatch[1].trim();
  }

  // Try to parse the JSON
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonString);
  } catch {
    throw new AgentResponseParseError(
      'Failed to parse agent response as JSON',
      rawResponse
    );
  }

  // Validate the structure
  if (!isValidAgentResponse(parsed)) {
    throw new AgentResponseParseError(
      'Agent response does not match expected structure',
      rawResponse
    );
  }

  return parsed;
}

function isValidAgentResponse(obj: unknown): obj is AgentResponse {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  const response = obj as Record<string, unknown>;

  // Check required fields
  if (typeof response.spokenResponse !== 'string') {
    return false;
  }

  if (typeof response.internalNotes !== 'string') {
    return false;
  }

  if (!isValidStateUpdates(response.stateUpdates)) {
    return false;
  }

  if (!isValidUIActions(response.uiActions)) {
    return false;
  }

  return true;
}

function isValidStateUpdates(obj: unknown): obj is StateUpdates {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  const updates = obj as Record<string, unknown>;

  // Phase must be a valid session phase
  if (
    typeof updates.phase !== 'string' ||
    !VALID_PHASES.includes(updates.phase as SessionPhase)
  ) {
    return false;
  }

  // Arrays must be string arrays
  if (!isStringArray(updates.newInsights)) {
    return false;
  }

  if (!isStringArray(updates.identifiedValues)) {
    return false;
  }

  if (!isStringArray(updates.valuesToExplore)) {
    return false;
  }

  return true;
}

function isValidUIActions(obj: unknown): obj is UIActions {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  const actions = obj as Record<string, unknown>;

  // showValueCards: string[] | null | undefined
  if (
    actions.showValueCards !== null &&
    actions.showValueCards !== undefined &&
    !isStringArray(actions.showValueCards)
  ) {
    return false;
  }

  // highlightValue: string | null | undefined
  if (
    actions.highlightValue !== null &&
    actions.highlightValue !== undefined &&
    typeof actions.highlightValue !== 'string'
  ) {
    return false;
  }

  // updateProgress: string | null | undefined
  if (
    actions.updateProgress !== null &&
    actions.updateProgress !== undefined &&
    typeof actions.updateProgress !== 'string'
  ) {
    return false;
  }

  // showSummary: boolean | undefined
  if (
    actions.showSummary !== undefined &&
    typeof actions.showSummary !== 'boolean'
  ) {
    return false;
  }

  return true;
}

function isStringArray(arr: unknown): arr is string[] {
  return Array.isArray(arr) && arr.every((item) => typeof item === 'string');
}

export function extractSpokenText(response: AgentResponse): string {
  return response.spokenResponse;
}

export function extractUIActions(response: AgentResponse): UIActions {
  return response.uiActions;
}

export function extractStateUpdates(response: AgentResponse): StateUpdates {
  return response.stateUpdates;
}
