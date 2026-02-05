// Hook for agent interaction - combines session and speech

import { useCallback, useEffect, useState } from 'react';
import { useSession } from './use-session';
import { useMicrophone } from './use-microphone';
import { useDeepgram } from './use-deepgram';
import { useSessionStore } from '@/stores/session-store';

interface UseAgentReturn {
  // Session state
  isActive: boolean;
  isReady: boolean;
  currentPhase: string;
  error: string | null;

  // Agent controls
  startSession: (companyName?: string, userName?: string) => Promise<void>;
  endSession: () => void;

  // Voice controls
  isListening: boolean;
  canSpeak: boolean;
  toggleListening: () => Promise<void>;

  // Text input
  sendTextMessage: (text: string) => Promise<void>;

  // Transcript
  currentTranscript: string;
}

export function useAgent(): UseAgentReturn {
  const [isReady, setIsReady] = useState(false);
  const [combinedError, setCombinedError] = useState<string | null>(null);

  const session = useSession();
  const microphone = useMicrophone();

  const {
    avatarState,
    currentTranscript,
    isProcessing,
    setAvatarState,
    setError: setStoreError,
  } = useSessionStore();

  // Handle transcript completion - send to agent
  const handleTranscriptComplete = useCallback(
    async (transcript: string) => {
      if (!transcript.trim()) return;
      await session.sendMessage(transcript);
    },
    [session]
  );

  const deepgram = useDeepgram(handleTranscriptComplete);

  // Combine errors
  useEffect(() => {
    const errors = [
      session.error,
      microphone.error,
      deepgram.error,
    ].filter(Boolean);

    if (errors.length > 0) {
      setCombinedError(errors[0] || null);
      setStoreError(errors[0] || null);
    } else {
      setCombinedError(null);
    }
  }, [session.error, microphone.error, deepgram.error, setStoreError]);

  // Start a full session with all components
  const startSession = useCallback(
    async (companyName?: string, userName?: string) => {
      setIsReady(false);
      setCombinedError(null);

      try {
        // 1. Start the session
        const sessionId = await session.startSession(companyName, userName);
        if (!sessionId) {
          throw new Error('Failed to start session');
        }

        // 2. Request microphone permission
        const hasMic = await microphone.requestPermission();
        if (!hasMic) {
          console.warn('Microphone permission denied - voice input unavailable');
        }

        // 3. Connect to speech recognition
        const speechConnected = await deepgram.connect();
        if (!speechConnected) {
          console.warn('Speech recognition not available - use text input');
        }

        setIsReady(true);
        setAvatarState('idle');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to start session';
        setCombinedError(message);
        setStoreError(message);
      }
    },
    [session, microphone, deepgram, setAvatarState, setStoreError]
  );

  // End the session and clean up
  const endSession = useCallback(() => {
    deepgram.disconnect();
    microphone.stopCapture();
    session.endSession();
    setIsReady(false);
  }, [deepgram, microphone, session]);

  // Toggle voice listening
  const toggleListening = useCallback(async () => {
    if (deepgram.isListening) {
      deepgram.stopListening();
      microphone.stopCapture();
      setAvatarState('idle');
    } else {
      if (avatarState === 'speaking') {
        return;
      }

      const stream = await microphone.startCapture();
      if (stream) {
        deepgram.startListening(stream);
        setAvatarState('listening');
      }
    }
  }, [deepgram, microphone, avatarState, setAvatarState]);

  // Send a text message directly
  const sendTextMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return;
      await session.sendMessage(text);
    },
    [session]
  );

  // Can speak if session is active and not processing
  const canSpeak = session.isActive && !isProcessing && avatarState !== 'speaking';

  return {
    isActive: session.isActive,
    isReady,
    currentPhase: session.currentPhase,
    error: combinedError,

    startSession,
    endSession,

    isListening: deepgram.isListening,
    canSpeak,
    toggleListening,

    sendTextMessage,

    currentTranscript,
  };
}
