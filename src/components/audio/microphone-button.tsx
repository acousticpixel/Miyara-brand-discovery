'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { CircularAudioVisualizer } from './audio-visualizer';

interface MicrophoneButtonProps {
  isListening: boolean;
  isDisabled: boolean;
  isLoading?: boolean;
  audioLevel?: number;
  onToggle: () => void;
  className?: string;
}

export function MicrophoneButton({
  isListening,
  isDisabled,
  isLoading,
  audioLevel = 0,
  onToggle,
  className,
}: MicrophoneButtonProps) {
  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      {/* Audio visualizer background */}
      {isListening && (
        <CircularAudioVisualizer
          audioLevel={audioLevel}
          isActive={isListening}
          className="absolute"
        />
      )}

      {/* Button */}
      <Button
        onClick={onToggle}
        disabled={isDisabled || isLoading}
        variant={isListening ? 'default' : 'outline'}
        size="lg"
        className={cn(
          'relative z-10 h-16 w-16 rounded-full p-0 transition-all',
          {
            'bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30':
              isListening,
            'border-2 border-gray-300 hover:border-gray-400': !isListening,
            'opacity-50 cursor-not-allowed': isDisabled,
          }
        )}
      >
        {isLoading ? (
          <Loader2 className="h-6 w-6 animate-spin" />
        ) : isListening ? (
          <Mic className="h-6 w-6" />
        ) : (
          <MicOff className="h-6 w-6 text-gray-500" />
        )}
      </Button>

      {/* Label */}
      <span
        className={cn(
          'absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm',
          isListening ? 'text-blue-600 font-medium' : 'text-gray-500'
        )}
      >
        {isLoading
          ? 'Connecting...'
          : isListening
            ? 'Listening...'
            : isDisabled
              ? 'Wait for Miyara'
              : 'Click to speak'}
      </span>
    </div>
  );
}

// Compact variant for inline use
export function MicrophoneButtonCompact({
  isListening,
  isDisabled,
  onToggle,
  className,
}: Omit<MicrophoneButtonProps, 'audioLevel' | 'isLoading'>) {
  return (
    <Button
      onClick={onToggle}
      disabled={isDisabled}
      variant={isListening ? 'default' : 'ghost'}
      size="sm"
      className={cn(
        'h-9 w-9 rounded-full p-0',
        {
          'bg-blue-500 hover:bg-blue-600': isListening,
        },
        className
      )}
    >
      {isListening ? (
        <Mic className="h-4 w-4" />
      ) : (
        <MicOff className="h-4 w-4" />
      )}
    </Button>
  );
}
