/**
 * Values Discovery State Management
 *
 * Functions for managing exercise state during a session.
 */

import type { AgentResponse } from '@/types/agent';
import type { ExerciseState, ValuesDiscoveryData } from '../types';

// ============================================
// Initial State
// ============================================

/**
 * Create initial state for a new Values Discovery session.
 */
export function getInitialState(): ExerciseState {
  const data: ValuesDiscoveryData = {
    insights: [],
    rapidFireResponses: [],
    identifiedValues: [],
    deepDiveValuesExplored: [],
    valuesToExplore: [],
  };

  return {
    currentPhase: 'OPENING',
    completed: false,
    exchangeCount: 0,
    data,
  };
}

// ============================================
// State Processing
// ============================================

/**
 * Process an AI response and update exercise state.
 * Called after each AI response to track progress.
 */
export function processResponse(
  response: AgentResponse,
  currentState: ExerciseState
): ExerciseState {
  const data = currentState.data as ValuesDiscoveryData;
  const newData = { ...data };

  // Update phase if changed
  const newPhase = response.stateUpdates.phase || currentState.currentPhase;
  const phaseChanged = newPhase !== currentState.currentPhase;

  // Track insights
  if (response.stateUpdates.newInsights?.length > 0) {
    newData.insights = [...newData.insights, ...response.stateUpdates.newInsights];
  }

  // Track identified values
  if (response.stateUpdates.identifiedValues?.length > 0) {
    const existingValueNames = newData.identifiedValues.map((v) => v.name);
    const newValues = response.stateUpdates.identifiedValues
      .filter((name) => !existingValueNames.includes(name))
      .map((name) => ({
        name,
        definition: undefined,
        quotes: [],
      }));
    newData.identifiedValues = [...newData.identifiedValues, ...newValues];
  }

  // Track values to explore
  if (response.stateUpdates.valuesToExplore?.length > 0) {
    const existingToExplore = new Set(newData.valuesToExplore);
    const newToExplore = response.stateUpdates.valuesToExplore.filter(
      (v) => !existingToExplore.has(v)
    );
    newData.valuesToExplore = [...newData.valuesToExplore, ...newToExplore];
  }

  // Check if exercise is complete
  const completed = newPhase === 'COMPLETE';

  return {
    currentPhase: newPhase,
    completed,
    exchangeCount: phaseChanged ? 1 : currentState.exchangeCount + 1,
    data: newData,
  };
}

// ============================================
// State Helpers
// ============================================

/**
 * Add a rapid-fire response to the state.
 */
export function addRapidFireResponse(
  state: ExerciseState,
  word: string,
  response: 'yes' | 'no' | 'maybe'
): ExerciseState {
  const data = state.data as ValuesDiscoveryData;
  return {
    ...state,
    data: {
      ...data,
      rapidFireResponses: [...data.rapidFireResponses, { word, response }],
    },
  };
}

/**
 * Mark a value as explored in deep-dive.
 */
export function markValueExplored(
  state: ExerciseState,
  valueName: string
): ExerciseState {
  const data = state.data as ValuesDiscoveryData;
  if (data.deepDiveValuesExplored.includes(valueName)) {
    return state;
  }
  return {
    ...state,
    data: {
      ...data,
      deepDiveValuesExplored: [...data.deepDiveValuesExplored, valueName],
    },
  };
}

/**
 * Update a value's definition.
 */
export function updateValueDefinition(
  state: ExerciseState,
  valueName: string,
  definition: string
): ExerciseState {
  const data = state.data as ValuesDiscoveryData;
  const updatedValues = data.identifiedValues.map((v) =>
    v.name === valueName ? { ...v, definition } : v
  );
  return {
    ...state,
    data: {
      ...data,
      identifiedValues: updatedValues,
    },
  };
}

/**
 * Add a quote to a value.
 */
export function addValueQuote(
  state: ExerciseState,
  valueName: string,
  quote: string
): ExerciseState {
  const data = state.data as ValuesDiscoveryData;
  const updatedValues = data.identifiedValues.map((v) =>
    v.name === valueName ? { ...v, quotes: [...v.quotes, quote] } : v
  );
  return {
    ...state,
    data: {
      ...data,
      identifiedValues: updatedValues,
    },
  };
}

/**
 * Get values that have been identified but not yet explored in deep-dive.
 */
export function getUnexploredValues(state: ExerciseState): string[] {
  const data = state.data as ValuesDiscoveryData;
  const exploredSet = new Set(data.deepDiveValuesExplored);
  return data.identifiedValues
    .map((v) => v.name)
    .filter((name) => !exploredSet.has(name));
}

/**
 * Get "yes" responses from rapid-fire.
 */
export function getYesResponses(state: ExerciseState): string[] {
  const data = state.data as ValuesDiscoveryData;
  return data.rapidFireResponses
    .filter((r) => r.response === 'yes')
    .map((r) => r.word);
}

/**
 * Get "maybe" responses from rapid-fire.
 */
export function getMaybeResponses(state: ExerciseState): string[] {
  const data = state.data as ValuesDiscoveryData;
  return data.rapidFireResponses
    .filter((r) => r.response === 'maybe')
    .map((r) => r.word);
}
