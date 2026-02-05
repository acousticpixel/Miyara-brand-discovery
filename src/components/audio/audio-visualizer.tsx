'use client';

import { cn } from '@/lib/utils';

interface AudioVisualizerProps {
  audioLevel: number; // 0-100
  isActive: boolean;
  className?: string;
}

export function AudioVisualizer({
  audioLevel,
  isActive,
  className,
}: AudioVisualizerProps) {
  // Generate bar heights based on audio level with some randomization
  const bars = 5;
  const getBarHeight = (index: number) => {
    if (!isActive) return 4;
    const baseHeight = audioLevel * 0.4;
    const variation = Math.sin(Date.now() / 100 + index * 0.5) * 10;
    return Math.max(4, Math.min(40, baseHeight + variation));
  };

  return (
    <div className={cn('flex items-end gap-0.5', className)}>
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'w-1 rounded-full transition-all duration-75',
            isActive ? 'bg-blue-500' : 'bg-gray-300'
          )}
          style={{
            height: `${getBarHeight(i)}px`,
          }}
        />
      ))}
    </div>
  );
}

// Circular audio visualizer variant
export function CircularAudioVisualizer({
  audioLevel,
  isActive,
  className,
}: AudioVisualizerProps) {
  const scale = isActive ? 1 + audioLevel / 200 : 1;

  return (
    <div
      className={cn(
        'relative flex items-center justify-center',
        className
      )}
    >
      {/* Outer ring */}
      <div
        className={cn(
          'absolute rounded-full transition-all duration-150',
          isActive ? 'bg-blue-400/20' : 'bg-gray-200/50'
        )}
        style={{
          width: `${80 * scale}px`,
          height: `${80 * scale}px`,
        }}
      />

      {/* Inner ring */}
      <div
        className={cn(
          'absolute rounded-full transition-all duration-100',
          isActive ? 'bg-blue-400/40' : 'bg-gray-300/50'
        )}
        style={{
          width: `${60 * (isActive ? 1 + audioLevel / 300 : 1)}px`,
          height: `${60 * (isActive ? 1 + audioLevel / 300 : 1)}px`,
        }}
      />

      {/* Center dot */}
      <div
        className={cn(
          'h-4 w-4 rounded-full transition-colors',
          isActive ? 'bg-blue-500' : 'bg-gray-400'
        )}
      />
    </div>
  );
}
