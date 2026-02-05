// Session state machine for conversation flow

import type { SessionPhase } from '@/types/session';

export interface SessionState {
  phase: SessionPhase;
  rapidFireIndex: number;
  rapidFireResponses: Array<{
    word: string;
    response: 'yes' | 'no' | 'maybe';
  }>;
  deepDiveValuesExplored: string[];
  identifiedValues: Array<{
    name: string;
    definition?: string;
    quotes: string[];
  }>;
  scenarioCompleted: boolean;
  synthesisDelivered: boolean;
}

export const INITIAL_STATE: SessionState = {
  phase: 'OPENING',
  rapidFireIndex: 0,
  rapidFireResponses: [],
  deepDiveValuesExplored: [],
  identifiedValues: [],
  scenarioCompleted: false,
  synthesisDelivered: false,
};

// Valid phase transitions
const VALID_TRANSITIONS: Record<SessionPhase, SessionPhase[]> = {
  OPENING: ['OPENING', 'RAPID_FIRE_INTRO'],
  RAPID_FIRE_INTRO: ['RAPID_FIRE_INTRO', 'RAPID_FIRE'],
  RAPID_FIRE: ['RAPID_FIRE', 'RAPID_FIRE_DEBRIEF'],
  RAPID_FIRE_DEBRIEF: ['RAPID_FIRE_DEBRIEF', 'DEEP_DIVE'],
  DEEP_DIVE: ['DEEP_DIVE', 'SCENARIO'],
  SCENARIO: ['SCENARIO', 'SYNTHESIS'],
  SYNTHESIS: ['SYNTHESIS', 'REFINEMENT'],
  REFINEMENT: ['REFINEMENT', 'SYNTHESIS', 'COMPLETE'],
  COMPLETE: ['COMPLETE'],
};

export function shouldTransitionPhase(
  currentState: SessionState,
  agentPhase: SessionPhase
): SessionPhase {
  // Agent controls transitions, but we validate them
  if (VALID_TRANSITIONS[currentState.phase].includes(agentPhase)) {
    return agentPhase;
  }

  // Stay in current phase if invalid transition requested
  console.warn(
    `Invalid phase transition attempted: ${currentState.phase} -> ${agentPhase}`
  );
  return currentState.phase;
}

export function canTransitionTo(
  currentPhase: SessionPhase,
  targetPhase: SessionPhase
): boolean {
  return VALID_TRANSITIONS[currentPhase].includes(targetPhase);
}

export function getNextPhase(currentPhase: SessionPhase): SessionPhase | null {
  const validNext = VALID_TRANSITIONS[currentPhase];
  // Return the next logical phase (not the same phase)
  const nextPhase = validNext.find((p) => p !== currentPhase);
  return nextPhase || null;
}

export function isPhaseComplete(
  state: SessionState,
  phase: SessionPhase
): boolean {
  switch (phase) {
    case 'OPENING':
      // Opening is complete when we've had at least one meaningful exchange
      return state.phase !== 'OPENING';

    case 'RAPID_FIRE_INTRO':
      return state.phase !== 'RAPID_FIRE_INTRO';

    case 'RAPID_FIRE':
      // Rapid fire is complete when we've gone through enough words
      return state.rapidFireResponses.length >= 15;

    case 'RAPID_FIRE_DEBRIEF':
      return state.phase !== 'RAPID_FIRE_DEBRIEF';

    case 'DEEP_DIVE':
      // Deep dive complete when we've explored 2-3 values
      return state.deepDiveValuesExplored.length >= 2;

    case 'SCENARIO':
      return state.scenarioCompleted;

    case 'SYNTHESIS':
      return state.synthesisDelivered;

    case 'REFINEMENT':
      // Refinement can loop back, but eventually ends at COMPLETE
      return state.phase === 'COMPLETE';

    case 'COMPLETE':
      return true;

    default:
      return false;
  }
}

export function updateState(
  currentState: SessionState,
  updates: Partial<SessionState>
): SessionState {
  const newState = { ...currentState, ...updates };

  // Validate phase transition if phase is being updated
  if (updates.phase && updates.phase !== currentState.phase) {
    newState.phase = shouldTransitionPhase(currentState, updates.phase);
  }

  return newState;
}
