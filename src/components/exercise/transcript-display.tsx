'use client';

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

export function ConversationTranscript({
  entries,
  className,
}: ConversationTranscriptProps) {
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
              {new Date(entry.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
          <p className="text-sm">{entry.content}</p>
        </div>
      ))}
    </div>
  );
}
