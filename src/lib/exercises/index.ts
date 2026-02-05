/**
 * Exercise Registry
 *
 * Central registry for all exercise modules in Miyara Brand Discovery.
 * Exercises are loaded and executed in the order they appear in the registry.
 *
 * To add a new exercise:
 * 1. Create the exercise module in src/lib/exercises/<exercise-name>/
 * 2. Import and add to exerciseRegistry array
 * 3. Update orchestrator to handle new exercise phases
 */

import type {
  ExerciseModule,
  ExerciseState,
  SessionExerciseProgress,
  ExerciseStatus,
} from './types';

// Import exercise modules
import { valuesDiscoveryExercise } from './values-discovery';

// ============================================
// Exercise Registry
// ============================================

/**
 * Registry of all available exercises in execution order.
 * MVP: Sequential execution (all exercises in order).
 * Future: May support skip/choose order.
 */
export const exerciseRegistry: ExerciseModule[] = [
  valuesDiscoveryExercise,
  // Future: brandPersonalityExercise,
  // Future: brandSpectraExercise,
  // Future: audienceDefinitionExercise,
  // Future: competitivePositioningExercise,
];

// ============================================
// Registry Helper Functions
// ============================================

/**
 * Get an exercise module by its ID.
 * @param id - Exercise identifier
 * @returns Exercise module or undefined if not found
 */
export function getExercise(id: string): ExerciseModule | undefined {
  return exerciseRegistry.find((exercise) => exercise.id === id);
}

/**
 * Get all exercises in their execution sequence.
 * @returns Array of exercise modules in order
 */
export function getExerciseSequence(): ExerciseModule[] {
  return [...exerciseRegistry];
}

/**
 * Get the first exercise in the sequence.
 * @returns First exercise module or undefined if registry is empty
 */
export function getFirstExercise(): ExerciseModule | undefined {
  return exerciseRegistry[0];
}

/**
 * Get the next exercise after the given one.
 * @param currentId - Current exercise ID
 * @returns Next exercise module or undefined if at end
 */
export function getNextExercise(currentId: string): ExerciseModule | undefined {
  const currentIndex = exerciseRegistry.findIndex((e) => e.id === currentId);
  if (currentIndex === -1 || currentIndex >= exerciseRegistry.length - 1) {
    return undefined;
  }
  return exerciseRegistry[currentIndex + 1];
}

/**
 * Check if an exercise is the last in the sequence.
 * @param id - Exercise identifier
 * @returns True if this is the final exercise
 */
export function isLastExercise(id: string): boolean {
  const lastExercise = exerciseRegistry[exerciseRegistry.length - 1];
  return lastExercise?.id === id;
}

/**
 * Get total estimated time for all exercises.
 * @returns Total minutes
 */
export function getTotalEstimatedTime(): number {
  return exerciseRegistry.reduce(
    (total, exercise) => total + exercise.estimatedMinutes,
    0
  );
}

// ============================================
// Session Progress Helpers
// ============================================

/**
 * Initialize progress tracking for all exercises.
 * @returns Array of progress objects for each exercise
 */
export function initializeExerciseProgress(): SessionExerciseProgress[] {
  return exerciseRegistry.map((exercise) => ({
    exerciseId: exercise.id,
    status: 'pending' as ExerciseStatus,
    state: null,
  }));
}

/**
 * Get initial state for an exercise.
 * @param exerciseId - Exercise identifier
 * @returns Initial exercise state or null if exercise not found
 */
export function getInitialExerciseState(
  exerciseId: string
): ExerciseState | null {
  const exercise = getExercise(exerciseId);
  if (!exercise) return null;
  return exercise.getInitialState();
}

/**
 * Calculate overall session progress percentage.
 * @param progress - Array of exercise progress objects
 * @returns Progress percentage (0-100)
 */
export function calculateOverallProgress(
  progress: SessionExerciseProgress[]
): number {
  if (progress.length === 0) return 0;

  const completedCount = progress.filter(
    (p) => p.status === 'completed' || p.status === 'skipped'
  ).length;

  return Math.round((completedCount / progress.length) * 100);
}

// ============================================
// Type Re-exports
// ============================================

export type {
  ExerciseModule,
  ExercisePhase,
  ExerciseState,
  ExerciseData,
  ValuesDiscoveryData,
  DeliverableSection,
  Deliverable,
  ExerciseUIConfig,
  ExerciseStatus,
  SessionExerciseProgress,
  SessionPhase,
} from './types';
