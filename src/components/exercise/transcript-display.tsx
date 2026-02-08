'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

// Conversation transcript showing history
interface ConversationEntry {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ConversationTranscriptProps {
  entries: ConversationEntry[];
  className?: string;
}

// Format time consistently to avoid hydration mismatch
function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function ConversationTranscript({
  entries,
  className,
}: ConversationTranscriptProps) {
  const [mounted, setMounted] = useState(false);

  // Mark as mounted to enable client-side formatting (prevents hydration mismatch)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional: mounted state pattern for hydration
    setMounted(true);
  }, []);

  if (entries.length === 0) {
    return null;
  }

  return (
    <div className={cn('space-y-4', className)}>
      {entries.map((entry) => (
        <div
          key={entry.id}
          className={cn(
            'rounded-lg p-3',
            entry.role === 'user'
              ? 'ml-8 bg-blue-50 text-miyara-navy'
              : 'mr-8 bg-gray-50 text-miyara-navy'
          )}
        >
          <div className="mb-1 flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500">
              {entry.role === 'user' ? 'You' : 'Miyara'}
            </span>
            <span className="text-xs text-gray-400">
              {mounted ? formatTime(entry.timestamp) : '--:--'}
            </span>
          </div>
          <p className="text-sm">{entry.content}</p>
        </div>
      ))}
    </div>
  );
}
