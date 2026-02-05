/**
 * Values Discovery Exercise Configuration
 *
 * Metadata and phase definitions for the Values Discovery exercise.
 */

import type { ExercisePhase, ExerciseUIConfig } from '../types';

// ============================================
// Exercise Metadata
// ============================================

export const EXERCISE_ID = 'values-discovery';
export const EXERCISE_NAME = 'Values Discovery';
export const EXERCISE_DESCRIPTION =
  'Uncover your core brand values through a guided conversation with rapid-fire assessment and deep-dive exploration.';
export const ESTIMATED_MINUTES = 30;

// ============================================
// Phase Definitions
// ============================================

export const PHASES: ExercisePhase[] = [
  {
    id: 'OPENING',
    name: 'Opening',
    description: 'Build rapport and understand motivation',
    minExchanges: 1,
    maxExchanges: 2,
    required: true,
  },
  {
    id: 'RAPID_FIRE_INTRO',
    name: 'Exercise Introduction',
    description: 'Explain the rapid-fire exercise',
    minExchanges: 1,
    maxExchanges: 1,
    required: true,
  },
  {
    id: 'RAPID_FIRE',
    name: 'Rapid Fire',
    description: 'Quick gut-check on value words',
    minExchanges: 5,
    maxExchanges: 10,
    required: true,
  },
  {
    id: 'RAPID_FIRE_DEBRIEF',
    name: 'Debrief',
    description: 'Reflect on patterns from rapid-fire',
    minExchanges: 1,
    maxExchanges: 2,
    required: true,
  },
  {
    id: 'DEEP_DIVE',
    name: 'Deep Dive',
    description: 'Explore what values really mean',
    minExchanges: 4,
    maxExchanges: 12,
    required: true,
  },
  {
    id: 'SCENARIO',
    name: 'Scenario Testing',
    description: 'Test values under pressure',
    minExchanges: 2,
    maxExchanges: 3,
    required: true,
  },
  {
    id: 'SYNTHESIS',
    name: 'Synthesis',
    description: 'Play back what was heard',
    minExchanges: 1,
    maxExchanges: 2,
    required: true,
  },
  {
    id: 'REFINEMENT',
    name: 'Refinement',
    description: 'Incorporate feedback',
    minExchanges: 1,
    maxExchanges: 2,
    required: true,
  },
  {
    id: 'COMPLETE',
    name: 'Complete',
    description: 'Wrap up and deliver',
    minExchanges: 1,
    maxExchanges: 1,
    required: true,
  },
];

// ============================================
// UI Configuration
// ============================================

export const UI_CONFIG: ExerciseUIConfig = {
  showCards: true,
  cardConfig: {
    itemLabel: 'values',
    multiSelect: false,
    responseOptions: ['yes', 'no', 'maybe'],
  },
  showProgressBar: true,
};

// ============================================
// Value Words Bank
// ============================================

export const VALUE_WORDS = [
  'Innovation',
  'Trust',
  'Excellence',
  'Authenticity',
  'Boldness',
  'Community',
  'Simplicity',
  'Transparency',
  'Creativity',
  'Reliability',
  'Empowerment',
  'Sustainability',
  'Speed',
  'Quality',
  'Accessibility',
  'Expertise',
  'Disruption',
  'Tradition',
  'Independence',
  'Collaboration',
  'Integrity',
  'Adventure',
  'Precision',
  'Warmth',
  'Ambition',
  'Humility',
  'Curiosity',
  'Resilience',
  'Joy',
  'Impact',
] as const;

export type ValueWord = (typeof VALUE_WORDS)[number];
