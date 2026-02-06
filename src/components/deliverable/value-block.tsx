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
    <div className={cn('space-y-6', className)}>
      {/* Section number and title */}
      <div className="flex items-baseline gap-4">
        <span className="text-5xl font-light text-galam-blue-light">{number}</span>
        <h3 className="text-2xl font-semibold text-miyara-navy">{value.value_name}</h3>
      </div>

      {/* Main Definition - This is the primary explainer for the value */}
      {value.personalized_definition && (
        <div className="rounded-lg bg-miyara-sky/5 p-6">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-galam-blue">
            What it means for you
          </h4>
          <p className="mt-3 text-lg leading-relaxed text-miyara-navy">
            {value.personalized_definition}
          </p>
        </div>
      )}

      {/* Practical applications grid */}
      {(value.in_practice || value.anti_pattern) && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* In practice */}
          {value.in_practice && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-galam-blue">
                How we live this
              </h4>
              <p className="text-miyara-navy/80">{value.in_practice}</p>
            </div>
          )}

          {/* Anti-pattern */}
          {value.anti_pattern && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-galam-blue">
                What we avoid
              </h4>
              <p className="text-miyara-navy/80">{value.anti_pattern}</p>
            </div>
          )}
        </div>
      )}

      {/* User quotes */}
      {value.user_quotes && value.user_quotes.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-galam-blue">
            In your words
          </h4>
          <div className="space-y-3">
            {value.user_quotes.map((quote, i) => (
              <blockquote
                key={i}
                className="border-l-2 border-galam-blue/30 pl-4 italic text-miyara-navy/70"
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
