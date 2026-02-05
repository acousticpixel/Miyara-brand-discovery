// App-wide constants

export const APP_NAME = 'Miyara Brand Discovery';
export const APP_DESCRIPTION = 'AI-powered brand discovery for founders';

// Session phases with display labels
export const SESSION_PHASES = {
  OPENING: { label: 'Opening', order: 0 },
  RAPID_FIRE_INTRO: { label: 'Value Words', order: 1 },
  RAPID_FIRE: { label: 'Value Words', order: 1 },
  RAPID_FIRE_DEBRIEF: { label: 'Reflection', order: 2 },
  DEEP_DIVE: { label: 'Deep Dive', order: 3 },
  SCENARIO: { label: 'Scenario', order: 4 },
  SYNTHESIS: { label: 'Synthesis', order: 5 },
  REFINEMENT: { label: 'Refinement', order: 6 },
  COMPLETE: { label: 'Complete', order: 7 },
} as const;

// Value words bank for rapid fire exercise
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

// Avatar states
export const AVATAR_STATES = {
  IDLE: 'idle',
  LISTENING: 'listening',
  THINKING: 'thinking',
  SPEAKING: 'speaking',
} as const;

export type AvatarState = (typeof AVATAR_STATES)[keyof typeof AVATAR_STATES];

// API endpoints
export const API_ENDPOINTS = {
  SESSION_START: '/api/session/start',
  SESSION_MESSAGE: '/api/session/message',
  SESSION_COMPLETE: '/api/session/complete',
} as const;

// Timeouts and limits
export const LIMITS = {
  MAX_SESSION_DURATION_MS: 30 * 60 * 1000, // 30 minutes
  SPEECH_SILENCE_THRESHOLD_MS: 1500,
  MAX_RAPID_FIRE_WORDS: 20,
  MIN_IDENTIFIED_VALUES: 3,
  MAX_IDENTIFIED_VALUES: 5,
} as const;
