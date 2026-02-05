// Zustand store for session state management

import { create } from 'zustand';
import type { SessionPhase } from '@/types/session';
import type { UIActions } from '@/types/agent';
import type { AvatarState } from '@/lib/utils/constants';

interface ConversationEntry {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface RapidFireEntry {
  word: string;
  response: 'yes' | 'no' | 'maybe';
  timestamp: string;
}

interface IdentifiedValueEntry {
  name: string;
  definition?: string;
  quotes: string[];
}

interface SessionStore {
  // Session state
  sessionId: string | null;
  isActive: boolean;
  currentPhase: SessionPhase;
  companyName: string | null;
  userName: string | null;

  // Conversation
  conversationHistory: ConversationEntry[];
  isProcessing: boolean;

  // Exercise state
  rapidFireResponses: RapidFireEntry[];
  identifiedValues: IdentifiedValueEntry[];
  displayedValueCards: string[];
  highlightedValue: string | null;

  // Avatar state
  avatarState: AvatarState;

  // Audio state
  isListening: boolean;
  currentTranscript: string;
  audioLevel: number;

  // UI state
  showTranscript: boolean;
  showSummary: boolean;
  error: string | null;

  // Actions
  startSession: (sessionId: string, companyName?: string, userName?: string) => void;
  endSession: () => void;
  setPhase: (phase: SessionPhase) => void;
  addMessage: (role: 'user' | 'assistant', content: string) => void;
  setProcessing: (isProcessing: boolean) => void;
  addRapidFireResponse: (word: string, response: 'yes' | 'no' | 'maybe') => void;
  addIdentifiedValue: (value: IdentifiedValueEntry) => void;
  updateIdentifiedValue: (name: string, updates: Partial<IdentifiedValueEntry>) => void;
  applyUIActions: (actions: UIActions) => void;
  setAvatarState: (state: AvatarState) => void;
  setListening: (isListening: boolean) => void;
  setCurrentTranscript: (transcript: string) => void;
  setAudioLevel: (level: number) => void;
  setShowTranscript: (show: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  sessionId: null,
  isActive: false,
  currentPhase: 'OPENING' as SessionPhase,
  companyName: null,
  userName: null,
  conversationHistory: [],
  isProcessing: false,
  rapidFireResponses: [],
  identifiedValues: [],
  displayedValueCards: [],
  highlightedValue: null,
  avatarState: 'idle' as AvatarState,
  isListening: false,
  currentTranscript: '',
  audioLevel: 0,
  showTranscript: true,
  showSummary: false,
  error: null,
};

export const useSessionStore = create<SessionStore>((set) => ({
  ...initialState,

  startSession: (sessionId, companyName, userName) => {
    set({
      sessionId,
      isActive: true,
      companyName: companyName || null,
      userName: userName || null,
      currentPhase: 'OPENING',
      conversationHistory: [],
      rapidFireResponses: [],
      identifiedValues: [],
      error: null,
    });
  },

  endSession: () => {
    set({
      isActive: false,
      isListening: false,
      avatarState: 'idle',
    });
  },

  setPhase: (phase) => {
    set({ currentPhase: phase });
  },

  addMessage: (role, content) => {
    const entry: ConversationEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      role,
      content,
      timestamp: new Date().toISOString(),
    };
    set((state) => ({
      conversationHistory: [...state.conversationHistory, entry],
    }));
  },

  setProcessing: (isProcessing) => {
    set({ isProcessing });
    if (isProcessing) {
      set({ avatarState: 'thinking' });
    }
  },

  addRapidFireResponse: (word, response) => {
    const entry: RapidFireEntry = {
      word,
      response,
      timestamp: new Date().toISOString(),
    };
    set((state) => ({
      rapidFireResponses: [...state.rapidFireResponses, entry],
    }));
  },

  addIdentifiedValue: (value) => {
    set((state) => ({
      identifiedValues: [...state.identifiedValues, value],
    }));
  },

  updateIdentifiedValue: (name, updates) => {
    set((state) => ({
      identifiedValues: state.identifiedValues.map((v) =>
        v.name === name ? { ...v, ...updates } : v
      ),
    }));
  },

  applyUIActions: (actions) => {
    const updates: Partial<SessionStore> = {};

    if (actions.showValueCards !== undefined) {
      updates.displayedValueCards = actions.showValueCards || [];
    }

    if (actions.highlightValue !== undefined) {
      updates.highlightedValue = actions.highlightValue;
    }

    if (actions.showSummary !== undefined) {
      updates.showSummary = actions.showSummary;
    }

    set(updates);
  },

  setAvatarState: (state) => {
    set({ avatarState: state });
  },

  setListening: (isListening) => {
    set({ isListening });
    if (isListening) {
      set({ avatarState: 'listening', currentTranscript: '' });
    }
  },

  setCurrentTranscript: (transcript) => {
    set({ currentTranscript: transcript });
  },

  setAudioLevel: (level) => {
    set({ audioLevel: Math.min(100, Math.max(0, level)) });
  },

  setShowTranscript: (show) => {
    set({ showTranscript: show });
  },

  setError: (error) => {
    set({ error });
  },

  reset: () => {
    set(initialState);
  },
}));

// Selectors
export const selectIsRapidFire = (state: SessionStore) =>
  state.currentPhase === 'RAPID_FIRE' || state.currentPhase === 'RAPID_FIRE_INTRO';

export const selectCanSpeak = (state: SessionStore) =>
  state.isActive && !state.isProcessing && state.avatarState !== 'speaking';

export const selectYesValues = (state: SessionStore) =>
  state.rapidFireResponses.filter((r) => r.response === 'yes').map((r) => r.word);

export const selectMaybeValues = (state: SessionStore) =>
  state.rapidFireResponses.filter((r) => r.response === 'maybe').map((r) => r.word);
