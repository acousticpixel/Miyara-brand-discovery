'use client';

import { cn } from '@/lib/utils';
import { SessionHeader } from './session-header';
import type { SessionPhase } from '@/types/session';

interface SessionContainerProps {
  currentPhase: SessionPhase;
  onEndSession?: () => void;
  children: React.ReactNode;
  className?: string;
}

export function SessionContainer({
  currentPhase,
  onEndSession,
  children,
  className,
}: SessionContainerProps) {
  return (
    <div className={cn('flex h-screen flex-col bg-gray-50', className)}>
      <SessionHeader currentPhase={currentPhase} onEndSession={onEndSession} />

      <main className="flex flex-1 flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}

// Layout: full-width conversation on top, input bar pinned to bottom
export function SessionLayout({
  conversationSection,
  inputSection,
  className,
}: {
  conversationSection: React.ReactNode;
  inputSection: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-1 flex-col overflow-hidden', className)}>
      {/* Conversation area — scrollable, fills available space */}
      <div className="flex-1 overflow-auto">
        {conversationSection}
      </div>

      {/* Input bar — pinned to bottom */}
      <div className="shrink-0 border-t bg-white px-4 py-3 sm:px-6 sm:py-4">
        {inputSection}
      </div>
    </div>
  );
}
