// Hook for session management

import { useCallback, useState } from 'react';
import { useSessionStore } from '@/stores/session-store';
import { API_ENDPOINTS } from '@/lib/utils/constants';
import type { SessionPhase } from '@/types/session';
import type { UIActions } from '@/types/agent';

interface UseSessionReturn {
  isActive: boolean;
  sessionId: string | null;
  currentPhase: SessionPhase;
  isLoading: boolean;
  error: string | null;
  startSession: (companyName?: string, userName?: string) => Promise<string | null>;
  sendMessage: (message: string) => Promise<void>;
  completeSession: () => Promise<string | null>;
  endSession: () => void;
}

interface StartSessionResponse {
  success: boolean;
  session: {
    id: string;
    current_phase: SessionPhase;
    created_at: string;
  };
  initial_message: {
    spoken_response: string;
    ui_actions: UIActions;
  };
  error?: string;
}

interface MessageResponse {
  success: boolean;
  response: {
    spoken_response: string;
    internal_notes: string;
    state_updates: {
      phase: SessionPhase;
      new_insights: string[];
      identified_values: string[];
      values_to_explore: string[];
    };
    ui_actions: UIActions;
  };
  session: {
    current_phase: SessionPhase;
  };
  error?: string;
}

interface CompleteResponse {
  success: boolean;
  deliverable: {
    id: string;
    share_slug: string;
  };
  share_url: string;
  error?: string;
}

export function useSession(): UseSessionReturn {
  const [isLoading, setIsLoading] = useState(false);

  const {
    isActive,
    sessionId,
    currentPhase,
    error,
    startSession: storeStartSession,
    endSession: storeEndSession,
    addMessage,
    setPhase,
    setProcessing,
    applyUIActions,
    setAvatarState,
    setError,
    addIdentifiedValue,
  } = useSessionStore();

  const startSession = useCallback(
    async (companyName?: string, userName?: string): Promise<string | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(API_ENDPOINTS.SESSION_START, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            company_name: companyName,
            user_name: userName,
          }),
        });

        const data: StartSessionResponse = await response.json();

        if (!data.success || !data.session) {
          throw new Error(data.error || 'Failed to start session');
        }

        // Initialize store state
        storeStartSession(data.session.id, companyName, userName);

        // Add initial message to conversation
        addMessage('assistant', data.initial_message.spoken_response);

        // Apply UI actions
        if (data.initial_message.ui_actions) {
          applyUIActions(data.initial_message.ui_actions);
        }

        // No audio playback — avatar goes to idle, ready for user input
        setAvatarState('idle');

        return data.session.id;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to start session';
        setError(message);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [storeStartSession, addMessage, applyUIActions, setAvatarState, setError]
  );

  const sendMessage = useCallback(
    async (message: string): Promise<void> => {
      if (!sessionId) {
        setError('No active session');
        return;
      }

      setProcessing(true);
      setError(null);

      try {
        // Add user message to conversation
        addMessage('user', message);

        const response = await fetch(API_ENDPOINTS.SESSION_MESSAGE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session_id: sessionId,
            user_message: message,
            timestamp: new Date().toISOString(),
          }),
        });

        const data: MessageResponse = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Failed to process message');
        }

        // Add assistant response to conversation
        addMessage('assistant', data.response.spoken_response);

        // Update phase if changed
        if (data.session.current_phase !== currentPhase) {
          setPhase(data.session.current_phase);
        }

        // Add any new identified values
        for (const value of data.response.state_updates.identified_values) {
          addIdentifiedValue({ name: value, quotes: [] });
        }

        // Apply UI actions
        applyUIActions(data.response.ui_actions);

        // Since there's no audio playback, go straight to idle after response
        setAvatarState('idle');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to send message';
        setError(message);
        setAvatarState('idle');
      } finally {
        setProcessing(false);
      }
    },
    [
      sessionId,
      currentPhase,
      addMessage,
      setPhase,
      setProcessing,
      applyUIActions,
      setAvatarState,
      setError,
      addIdentifiedValue,
    ]
  );

  const completeSession = useCallback(async (): Promise<string | null> => {
    if (!sessionId) {
      setError('No active session');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(API_ENDPOINTS.SESSION_COMPLETE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId }),
      });

      const data: CompleteResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to complete session');
      }

      setPhase('COMPLETE');
      storeEndSession();

      return data.share_url;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to complete session';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, setPhase, storeEndSession, setError]);

  const endSession = useCallback(() => {
    storeEndSession();
  }, [storeEndSession]);

  return {
    isActive,
    sessionId,
    currentPhase,
    isLoading,
    error,
    startSession,
    sendMessage,
    completeSession,
    endSession,
  };
}
