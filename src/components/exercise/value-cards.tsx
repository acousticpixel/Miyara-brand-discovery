'use client';

import { cn } from '@/lib/utils';
import { ValueCard } from './value-card';

interface ValueCardsProps {
  words: string[];
  highlightedWord?: string;
  responses?: Record<string, 'yes' | 'no' | 'maybe'>;
  onResponse?: (word: string, response: 'yes' | 'no' | 'maybe') => void;
  mode?: 'display' | 'interactive';
  className?: string;
}

export function ValueCards({
  words,
  highlightedWord,
  responses = {},
  onResponse,
  mode = 'display',
  className,
}: ValueCardsProps) {
  if (words.length === 0) {
    return null;
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex flex-wrap justify-center gap-3">
        {words.map((word) => (
          <ValueCard
            key={word}
            word={word}
            isHighlighted={word === highlightedWord}
            response={responses[word]}
            showResponseButtons={mode === 'interactive'}
            onResponse={
              onResponse ? (response) => onResponse(word, response) : undefined
            }
          />
        ))}
      </div>

      {mode === 'display' && words.length > 0 && (
        <p className="text-center text-sm text-muted-foreground">
          Respond by saying "yes", "no", or "maybe" for each word
        </p>
      )}
    </div>
  );
}

// Compact grid view for showing all responses
export function ValueCardsGrid({
  responses,
  className,
}: {
  responses: Record<string, 'yes' | 'no' | 'maybe'>;
  className?: string;
}) {
  const words = Object.keys(responses);

  if (words.length === 0) {
    return null;
  }

  const yesWords = words.filter((w) => responses[w] === 'yes');
  const maybeWords = words.filter((w) => responses[w] === 'maybe');
  const noWords = words.filter((w) => responses[w] === 'no');

  return (
    <div className={cn('space-y-4', className)}>
      {yesWords.length > 0 && (
        <div>
          <h4 className="mb-2 text-sm font-medium text-green-700">
            Resonated ({yesWords.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {yesWords.map((word) => (
              <span
                key={word}
                className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700"
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      )}

      {maybeWords.length > 0 && (
        <div>
          <h4 className="mb-2 text-sm font-medium text-amber-700">
            Uncertain ({maybeWords.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {maybeWords.map((word) => (
              <span
                key={word}
                className="rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-700"
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      )}

      {noWords.length > 0 && (
        <div>
          <h4 className="mb-2 text-sm font-medium text-gray-500">
            Did not resonate ({noWords.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {noWords.map((word) => (
              <span
                key={word}
                className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-500"
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
