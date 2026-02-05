/**
 * Values Discovery Exercise Module
 *
 * The first exercise in Miyara Brand Discovery.
 * Guides founders through discovering their core brand values.
 */

import type { ExerciseModule } from '../types';
import {
  EXERCISE_ID,
  EXERCISE_NAME,
  EXERCISE_DESCRIPTION,
  ESTIMATED_MINUTES,
  PHASES,
  UI_CONFIG,
} from './config';
import { getInitialState, processResponse } from './state';
import { generateDeliverableSection } from './deliverable';
import { SYSTEM_PROMPT_ADDITION } from './prompt';

// ============================================
// Exercise Module Export
// ============================================

/**
 * Values Discovery exercise module.
 * Implements the ExerciseModule interface for pluggable architecture.
 */
export const valuesDiscoveryExercise: ExerciseModule = {
  id: EXERCISE_ID,
  name: EXERCISE_NAME,
  description: EXERCISE_DESCRIPTION,
  estimatedMinutes: ESTIMATED_MINUTES,
  phases: PHASES,
  systemPromptAddition: SYSTEM_PROMPT_ADDITION,
  getInitialState,
  processResponse,
  generateDeliverableSection,
  uiConfig: UI_CONFIG,
};

// ============================================
// Re-exports
// ============================================

// Config
export {
  EXERCISE_ID,
  EXERCISE_NAME,
  EXERCISE_DESCRIPTION,
  ESTIMATED_MINUTES,
  PHASES,
  UI_CONFIG,
  VALUE_WORDS,
} from './config';
export type { ValueWord } from './config';

// State
export {
  getInitialState,
  processResponse,
  addRapidFireResponse,
  markValueExplored,
  updateValueDefinition,
  addValueQuote,
  getUnexploredValues,
  getYesResponses,
  getMaybeResponses,
} from './state';

// Deliverable
export {
  generateDeliverableSection,
  generateValuesSummary,
  generateValueMarkdown,
} from './deliverable';

// Prompt
export { SYSTEM_PROMPT_ADDITION, getSystemPrompt } from './prompt';

// Default export
export default valuesDiscoveryExercise;
