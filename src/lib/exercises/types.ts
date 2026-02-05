/**
 * Exercise Module Types
 *
 * These types define the interface for exercise modules in Miyara Brand Discovery.
 * Each exercise (Values Discovery, Brand Personality, etc.) implements this interface.
 *
 * Design principles:
 * - Modular: Each exercise is self-contained
 * - Shared UI: Common components with exercise-specific configuration
 * - Sequential: MVP requires completing exercises in order
 * - Combined Deliverable: One unified brand guide at the end
 */

import type { AgentResponse } from '@/types/agent';

// ============================================
// Core Exercise Module Interface
// ============================================

/**
 * Main interface that all exercise modules must implement.
 * This enables a pluggable architecture where new exercises
 * can be added without modifying core orchestration logic.
 */
export interface ExerciseModule {
  /** Unique identifier (e.g., 'values-discovery', 'brand-personality') */
  id: string;

  /** Display name shown in UI */
  name: string;

  /** Brief description for UI and onboarding */
  description: string;

  /** Expected duration in minutes */
  estimatedMinutes: number;

  /** Phase definitions for this exercise */
  phases: ExercisePhase[];

  /** System prompt content specific to this exercise */
  systemPromptAddition: string;

  /** Factory function to create initial state for a new session */
  getInitialState: () => ExerciseState;

  /**
   * Process an AI response and update exercise state.
   * Called after each AI response to track progress.
   */
  processResponse: (
    response: AgentResponse,
    currentState: ExerciseState
  ) => ExerciseState;

  /**
   * Generate the deliverable section for this exercise.
   * Called when all exercises are complete to build final document.
   */
  generateDeliverableSection: (state: ExerciseState) => DeliverableSection;

  /** Optional UI configuration overrides */
  uiConfig?: ExerciseUIConfig;
}

// ============================================
// Phase Configuration
// ============================================

/**
 * Defines a phase within an exercise.
 * Exercises can have multiple phases that guide the conversation flow.
 */
export interface ExercisePhase {
  /** Unique identifier within the exercise */
  id: string;

  /** Display name for progress indicator */
  name: string;

  /** Description of what happens in this phase */
  description: string;

  /** Minimum conversation exchanges before moving on */
  minExchanges?: number;

  /** Maximum exchanges before forcing progression */
  maxExchanges?: number;

  /** Whether this phase is required or can be skipped (future) */
  required?: boolean;
}

// ============================================
// Exercise State
// ============================================

/**
 * Runtime state for an exercise instance.
 * Tracks progress and data collected during the exercise.
 */
export interface ExerciseState {
  /** Current phase ID */
  currentPhase: string;

  /** Whether the exercise is complete */
  completed: boolean;

  /** Number of exchanges in current phase */
  exchangeCount: number;

  /** Exercise-specific data (varies by exercise type) */
  data: ExerciseData;
}

/**
 * Base interface for exercise-specific data.
 * Each exercise extends this with its own fields.
 */
export interface ExerciseData {
  /** Generic insights collected during exercise */
  insights: string[];

  /** Any additional exercise-specific fields */
  [key: string]: unknown;
}

// ============================================
// Values Discovery Specific Types
// ============================================

/**
 * Data specific to the Values Discovery exercise.
 */
export interface ValuesDiscoveryData extends ExerciseData {
  /** Rapid-fire word responses */
  rapidFireResponses: Array<{
    word: string;
    response: 'yes' | 'no' | 'maybe';
  }>;

  /** Values identified through deep-dive */
  identifiedValues: Array<{
    name: string;
    definition?: string;
    quotes: string[];
  }>;

  /** Values that have been explored in deep-dive */
  deepDiveValuesExplored: string[];

  /** Values to explore next */
  valuesToExplore: string[];
}

// ============================================
// Deliverable Types
// ============================================

/**
 * A section of the final deliverable document.
 * Each exercise generates one or more sections.
 */
export interface DeliverableSection {
  /** Section title (e.g., "Core Values") */
  title: string;

  /** Section content in Markdown format */
  content: string;

  /** Order in the final document (lower = earlier) */
  order: number;

  /** Optional subtitle */
  subtitle?: string;

  /** Optional metadata for rendering */
  metadata?: Record<string, unknown>;
}

/**
 * Complete deliverable combining all exercise sections.
 */
export interface Deliverable {
  /** Unique identifier */
  id: string;

  /** Session this deliverable belongs to */
  sessionId: string;

  /** Shareable URL slug */
  shareSlug: string;

  /** Sections from all completed exercises */
  sections: DeliverableSection[];

  /** When the deliverable was generated */
  generatedAt: Date;

  /** Company name if provided */
  companyName?: string;
}

// ============================================
// UI Configuration
// ============================================

/**
 * Optional UI configuration for an exercise.
 * Allows exercises to customize their appearance.
 */
export interface ExerciseUIConfig {
  /** Show card-based UI (like value cards) */
  showCards?: boolean;

  /** Card configuration if showCards is true */
  cardConfig?: {
    /** What the cards represent (e.g., "values", "traits") */
    itemLabel: string;
    /** Allow multi-select vs single response */
    multiSelect: boolean;
    /** Response options */
    responseOptions: string[];
  };

  /** Show progress bar within exercise */
  showProgressBar?: boolean;

  /** Custom component names to render */
  customComponents?: string[];

  /** Theme overrides */
  theme?: {
    primaryColor?: string;
    accentColor?: string;
  };
}

// ============================================
// Registry Types
// ============================================

/**
 * Exercise status in a session.
 */
export type ExerciseStatus = 'pending' | 'in_progress' | 'completed' | 'skipped';

/**
 * Tracks exercise progress within a session.
 */
export interface SessionExerciseProgress {
  exerciseId: string;
  status: ExerciseStatus;
  state: ExerciseState | null;
  startedAt?: Date;
  completedAt?: Date;
}

// ============================================
// Helper Types
// ============================================

/**
 * Session phase type (re-exported for convenience).
 * Maps exercise phases to session-level phases.
 */
export type SessionPhase =
  | 'OPENING'
  | 'RAPID_FIRE_INTRO'
  | 'RAPID_FIRE'
  | 'RAPID_FIRE_DEBRIEF'
  | 'DEEP_DIVE'
  | 'SCENARIO'
  | 'SYNTHESIS'
  | 'REFINEMENT'
  | 'COMPLETE';
