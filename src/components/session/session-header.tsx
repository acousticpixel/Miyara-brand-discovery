'use client';

import { cn } from '@/lib/utils';
import { Logo } from '@/components/common/logo';
import { Button } from '@/components/ui/button';
import { X, HelpCircle } from 'lucide-react';
import { ProgressTracker } from '@/components/exercise/progress-tracker';
import type { SessionPhase } from '@/types/session';

interface SessionHeaderProps {
  currentPhase: SessionPhase;
  onEndSession?: () => void;
  onHelp?: () => void;
  className?: string;
}

export function SessionHeader({
  currentPhase,
  onEndSession,
  onHelp,
  className,
}: SessionHeaderProps) {
  return (
    <header
      className={cn(
        'flex flex-col gap-4 border-b bg-white px-4 py-3 sm:px-6',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <Logo size="sm" />

        <div className="flex items-center gap-2">
          {onHelp && (
            <Button variant="ghost" size="sm" onClick={onHelp}>
              <HelpCircle className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only sm:ml-2">Help</span>
            </Button>
          )}

          {onEndSession && (
            <Button variant="ghost" size="sm" onClick={onEndSession}>
              <X className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only sm:ml-2">End</span>
            </Button>
          )}
        </div>
      </div>

      <ProgressTracker currentPhase={currentPhase} />
    </header>
  );
}
