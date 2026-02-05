// Hook for microphone permissions and audio capture

import { useCallback, useEffect, useRef, useState } from 'react';

interface UseMicrophoneReturn {
  isSupported: boolean;
  hasPermission: boolean | null;
  isCapturing: boolean;
  audioLevel: number;
  error: string | null;
  requestPermission: () => Promise<boolean>;
  startCapture: () => Promise<MediaStream | null>;
  stopCapture: () => void;
  getAudioStream: () => MediaStream | null;
}

export function useMicrophone(): UseMicrophoneReturn {
  const [isSupported, setIsSupported] = useState(true);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const analyzeAudioRef = useRef<(() => void) | null>(null);

  // Check if getUserMedia is supported
  // This is necessary for SSR/hydration - we need to detect browser capabilities
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const supported = !!(
        navigator.mediaDevices && navigator.mediaDevices.getUserMedia
      );
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsSupported(supported);

      if (!supported) {
        setError('Microphone access is not supported in this browser');
      }
    }
  }, []);

  // Check initial permission state
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.permissions) {
      navigator.permissions
        .query({ name: 'microphone' as PermissionName })
        .then((result) => {
          setHasPermission(result.state === 'granted');
          result.onchange = () => {
            setHasPermission(result.state === 'granted');
          };
        })
        .catch(() => {
          // Permissions API not fully supported
          setHasPermission(null);
        });
    }
  }, []);

  // Analyze audio levels - use ref to avoid self-reference in useCallback
  useEffect(() => {
    analyzeAudioRef.current = () => {
      if (!analyserRef.current) return;

      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);

      // Calculate average volume level
      const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
      const normalizedLevel = Math.min(100, (average / 128) * 100);

      setAudioLevel(normalizedLevel);

      if (analyzeAudioRef.current) {
        animationFrameRef.current = requestAnimationFrame(analyzeAudioRef.current);
      }
    };
  }, []);

  const analyzeAudio = useCallback(() => {
    analyzeAudioRef.current?.();
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      setError('Microphone access is not supported');
      return false;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      // Permission granted, but stop the stream for now
      stream.getTracks().forEach((track) => track.stop());
      setHasPermission(true);
      setError(null);
      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to get microphone permission';

      if (message.includes('NotAllowedError') || message.includes('Permission denied')) {
        setError('Microphone permission denied. Please allow access in your browser settings.');
      } else if (message.includes('NotFoundError')) {
        setError('No microphone found. Please connect a microphone and try again.');
      } else {
        setError(message);
      }

      setHasPermission(false);
      return false;
    }
  }, [isSupported]);

  const startCapture = useCallback(async (): Promise<MediaStream | null> => {
    if (!isSupported) {
      setError('Microphone access is not supported');
      return null;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      streamRef.current = stream;
      setIsCapturing(true);
      setHasPermission(true);
      setError(null);

      // Set up audio analysis for level monitoring
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;

      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      // Start analyzing audio levels
      analyzeAudio();

      return stream;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to start audio capture';
      setError(message);
      setHasPermission(false);
      return null;
    }
  }, [isSupported, analyzeAudio]);

  const stopCapture = useCallback(() => {
    // Stop animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // Close audio context
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    // Stop all tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    analyserRef.current = null;
    setIsCapturing(false);
    setAudioLevel(0);
  }, []);

  const getAudioStream = useCallback(() => {
    return streamRef.current;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCapture();
    };
  }, [stopCapture]);

  return {
    isSupported,
    hasPermission,
    isCapturing,
    audioLevel,
    error,
    requestPermission,
    startCapture,
    stopCapture,
    getAudioStream,
  };
}
