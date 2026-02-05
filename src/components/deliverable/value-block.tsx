'use client';

import { cn } from '@/lib/utils';
import type { IdentifiedValue } from '@/types/session';

interface ValueBlockProps {
  value: IdentifiedValue;
  index: number;
  className?: string;
}

export function ValueBlock({ value, index, className }: ValueBlockProps) {
  const number = String(index + 1).padStart(2, '0');

  return (
    <div className={cn('space-y-4', className)}>
      {/* Section number and title */}
      <div className="flex items-baseline gap-4">
        <span className="text-5xl font-light text-miyara-sky">{number}</span>
        <h3 className="text-2xl font-semibold text-miyara-navy">{value.value_name}</h3>
      </div>

      {/* Definition */}
      {value.personalized_definition && (
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-miyara-sky">
            What it means for you
          </h4>
          <p className="text-miyara-navy">{value.personalized_definition}</p>
        </div>
      )}

      {/* In practice */}
      {value.in_practice && (
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-miyara-sky">
            In practice
          </h4>
          <p className="text-miyara-navy">{value.in_practice}</p>
        </div>
      )}

      {/* Anti-pattern */}
      {value.anti_pattern && (
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-miyara-sky">
            What we don&apos;t do
          </h4>
          <p className="text-miyara-navy">{value.anti_pattern}</p>
        </div>
      )}

      {/* User quotes */}
      {value.user_quotes && value.user_quotes.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-miyara-sky">
            In your words
          </h4>
          <div className="space-y-2">
            {value.user_quotes.map((quote, i) => (
              <blockquote
                key={i}
                className="border-l-2 border-miyara-sky/30 pl-4 italic text-miyara-navy/80"
              >
                &ldquo;{quote}&rdquo;
              </blockquote>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
