// Hook for speech-to-text using the Web Speech API (browser-native)
// Falls back gracefully if not supported

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSessionStore } from '@/stores/session-store';

interface UseSpeechReturn {
  isConnected: boolean;
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  error: string | null;
  connect: () => Promise<boolean>;
  disconnect: () => void;
  startListening: (stream: MediaStream) => void;
  stopListening: () => void;
}

// Extend Window to include SpeechRecognition types
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
  onaudiostart: (() => void) | null;
  onspeechstart: (() => void) | null;
  onspeechend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

function getSpeechRecognitionConstructor(): (new () => SpeechRecognition) | null {
  if (typeof window === 'undefined') return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

// How long to wait after the last final result before auto-sending to AI
const UTTERANCE_END_DELAY_MS = 1800;

export function useSpeech(
  onTranscriptComplete?: (transcript: string) => void
): UseSpeechReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const accumulatedTranscriptRef = useRef<string>('');
  const isActiveRef = useRef(false);
  const restartTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const utteranceEndTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { setCurrentTranscript, setListening } = useSessionStore();

  // Stable ref for the callback - updated via effect to avoid render-time ref assignment
  const onTranscriptCompleteRef = useRef(onTranscriptComplete);
  useEffect(() => {
    onTranscriptCompleteRef.current = onTranscriptComplete;
  }, [onTranscriptComplete]);

  // Flush accumulated transcript to the AI
  const flushTranscript = useCallback(() => {
    if (utteranceEndTimerRef.current) {
      clearTimeout(utteranceEndTimerRef.current);
      utteranceEndTimerRef.current = null;
    }

    const text = accumulatedTranscriptRef.current.trim();
    if (text) {
      console.log('Sending transcript to AI:', text);
      onTranscriptCompleteRef.current?.(text);
      accumulatedTranscriptRef.current = '';
      setTranscript('');
      setInterimTranscript('');
      setCurrentTranscript('');
    }
  }, [setCurrentTranscript]);

  // Schedule a flush after a pause in speech
  const scheduleFlush = useCallback(() => {
    if (utteranceEndTimerRef.current) {
      clearTimeout(utteranceEndTimerRef.current);
    }
    utteranceEndTimerRef.current = setTimeout(() => {
      flushTranscript();
    }, UTTERANCE_END_DELAY_MS);
  }, [flushTranscript]);

  const connect = useCallback(async (): Promise<boolean> => {
    try {
      const SpeechRecognitionClass = getSpeechRecognitionConstructor();

      if (!SpeechRecognitionClass) {
        setError(
          'Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.'
        );
        return false;
      }

      // Just verify it's available — we create the actual instance in startListening
      setIsConnected(true);
      setError(null);
      console.log('Speech recognition ready (Web Speech API)');
      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to initialize speech recognition';
      setError(message);
      console.error('Speech recognition init error:', err);
      return false;
    }
  }, []);

  const disconnect = useCallback(() => {
    isActiveRef.current = false;

    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }

    if (utteranceEndTimerRef.current) {
      clearTimeout(utteranceEndTimerRef.current);
      utteranceEndTimerRef.current = null;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.onend = null; // Prevent auto-restart
        recognitionRef.current.abort();
      } catch {
        // Ignore errors during cleanup
      }
      recognitionRef.current = null;
    }

    setIsConnected(false);
    setIsListening(false);
    setTranscript('');
    setInterimTranscript('');
    accumulatedTranscriptRef.current = '';
  }, []);

  const startListening = useCallback(
    (_stream: MediaStream) => { // eslint-disable-line @typescript-eslint/no-unused-vars
      // The MediaStream param is kept for API compatibility but Web Speech API
      // handles its own audio capture internally.

      const SpeechRecognitionClass = getSpeechRecognitionConstructor();
      if (!SpeechRecognitionClass) {
        setError('Speech recognition not supported');
        return;
      }

      // Clean up any existing instance
      if (recognitionRef.current) {
        try {
          recognitionRef.current.onend = null;
          recognitionRef.current.abort();
        } catch {
          // Ignore
        }
      }

      const recognition = new SpeechRecognitionClass();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        console.log('Speech recognition started');
        setIsListening(true);
        setListening(true);
        setError(null);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interim = '';
        let finalText = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const text = result[0].transcript;

          if (result.isFinal) {
            finalText += text;
          } else {
            interim += text;
          }
        }

        if (finalText) {
          accumulatedTranscriptRef.current += ' ' + finalText;
          const full = accumulatedTranscriptRef.current.trim();
          setTranscript(full);
          setCurrentTranscript(full);
          setInterimTranscript('');

          // We got a final result — schedule sending to AI after a pause.
          // This timer resets each time new final text arrives, so it only
          // fires once the user stops speaking for UTTERANCE_END_DELAY_MS.
          scheduleFlush();
        } else if (interim) {
          // Cancel any pending flush while user is still talking
          if (utteranceEndTimerRef.current) {
            clearTimeout(utteranceEndTimerRef.current);
            utteranceEndTimerRef.current = null;
          }

          setInterimTranscript(interim);
          setCurrentTranscript(
            (accumulatedTranscriptRef.current + ' ' + interim).trim()
          );
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        // 'no-speech' and 'aborted' are non-fatal - skip logging
        if (event.error === 'no-speech' || event.error === 'aborted') {
          return;
        }

        // Log actual errors for debugging
        console.error('Speech recognition error:', event.error);

        if (event.error === 'not-allowed') {
          setError(
            'Microphone access was denied. Please allow microphone permissions.'
          );
          isActiveRef.current = false;
          return;
        }

        if (event.error === 'network') {
          setError(
            'Network error during speech recognition. Please check your connection.'
          );
          return;
        }

        setError(`Speech recognition error: ${event.error}`);
      };

      recognition.onend = () => {
        console.log('Speech recognition ended');

        // Auto-restart if still active (Web Speech API can stop unexpectedly)
        if (isActiveRef.current) {
          restartTimeoutRef.current = setTimeout(() => {
            if (isActiveRef.current && recognitionRef.current) {
              try {
                console.log('Restarting speech recognition...');
                recognitionRef.current.start();
              } catch (err) {
                console.error('Failed to restart speech recognition:', err);
              }
            }
          }, 300);
        } else {
          setIsListening(false);
          setListening(false);
        }
      };

      recognitionRef.current = recognition;
      isActiveRef.current = true;
      accumulatedTranscriptRef.current = '';
      setTranscript('');
      setInterimTranscript('');

      try {
        recognition.start();
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
        setError('Failed to start speech recognition');
      }
    },
    [setCurrentTranscript, setListening, scheduleFlush]
  );

  const stopListening = useCallback(() => {
    isActiveRef.current = false;

    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.onend = null; // Prevent auto-restart
        recognitionRef.current.stop();
      } catch {
        // Ignore
      }
      recognitionRef.current = null;
    }

    setIsListening(false);
    setListening(false);

    // Immediately flush anything remaining when user stops
    flushTranscript();
  }, [setListening, flushTranscript]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isActiveRef.current = false;
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
      if (utteranceEndTimerRef.current) {
        clearTimeout(utteranceEndTimerRef.current);
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.onend = null;
          recognitionRef.current.abort();
        } catch {
          // Ignore
        }
      }
    };
  }, []);

  return {
    isConnected,
    isListening,
    transcript,
    interimTranscript,
    error,
    connect,
    disconnect,
    startListening,
    stopListening,
  };
}
