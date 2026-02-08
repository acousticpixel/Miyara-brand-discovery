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
  // Try multiple extraction methods for robustness
  const extractors = [
    // Method 1: Direct parse (response is already valid JSON)
    (s: string) => JSON.parse(s.trim()),
    // Method 2: Extract from markdown code blocks
    (s: string) => {
      const match = s.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (!match) return null;
      return JSON.parse(match[1].trim());
    },
    // Method 3: Find first { to last } (handles extra text around JSON)
    (s: string) => {
      const start = s.indexOf('{');
      const end = s.lastIndexOf('}');
      if (start < 0 || end <= start) return null;
      return JSON.parse(s.slice(start, end + 1));
    },
  ];

  let parsed: unknown = null;
  let lastError: Error | null = null;

  for (const extractor of extractors) {
    try {
      const result = extractor(rawResponse);
      if (result !== null) {
        parsed = result;
        break;
      }
    } catch (e) {
      lastError = e instanceof Error ? e : new Error(String(e));
      // Continue to next extractor
    }
  }

  if (parsed === null) {
    throw new AgentResponseParseError(
      `Failed to parse agent response as JSON: ${lastError?.message || 'Unknown error'}`,
      rawResponse
    );
  }

  // Normalize and validate the structure
  const normalized = normalizeResponse(parsed);

  if (!isValidAgentResponse(normalized)) {
    throw new AgentResponseParseError(
      'Agent response does not match expected structure',
      rawResponse
    );
  }

  return normalized;
}

// Normalize response to handle common issues
function normalizeResponse(obj: unknown): unknown {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  const response = obj as Record<string, unknown>;

  // Normalize stateUpdates
  if (response.stateUpdates && typeof response.stateUpdates === 'object') {
    const updates = response.stateUpdates as Record<string, unknown>;

    // Normalize phase to uppercase
    if (typeof updates.phase === 'string') {
      updates.phase = updates.phase.toUpperCase();
    }

    // Provide default empty arrays for optional array fields
    updates.newInsights = updates.newInsights ?? [];
    updates.identifiedValues = updates.identifiedValues ?? [];
    updates.valuesToExplore = updates.valuesToExplore ?? [];
  }

  // Ensure uiActions exists
  if (!response.uiActions) {
    response.uiActions = {};
  }

  return response;
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
