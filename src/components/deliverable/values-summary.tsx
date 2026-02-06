'use client';

import { cn } from '@/lib/utils';
import { ValueBlock } from './value-block';
import type { IdentifiedValue } from '@/types/session';

interface ValuesSummaryProps {
  companyName: string;
  values: IdentifiedValue[];
  generatedAt: string;
  sessionSummary?: string;
  className?: string;
}

export function ValuesSummary({
  companyName,
  values,
  generatedAt,
  sessionSummary,
  className,
}: ValuesSummaryProps) {
  const formattedDate = new Date(generatedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className={cn('bg-white', className)}>
      {/* Header */}
      <div className="border-b border-miyara-sky/20 px-8 py-12 text-center lg:px-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-galam-blue">
          Brand Values
        </p>
        <h1 className="mt-4 text-4xl font-light text-miyara-navy lg:text-5xl">
          {companyName}
        </h1>
        <p className="mt-4 text-sm text-miyara-navy/60">
          Discovered on {formattedDate}
        </p>
      </div>

      {/* Session Summary (if available) */}
      {sessionSummary && (
        <div className="border-b border-miyara-sky/20 bg-miyara-sky/5 px-8 py-10 lg:px-12">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-galam-blue">
            Overview
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-miyara-navy">
            {sessionSummary}
          </p>
        </div>
      )}

      {/* Values at a Glance */}
      <div className="border-b border-miyara-sky/20 px-8 py-10 lg:px-12">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-galam-blue">
          Your Core Values
        </h2>
        <div className="mt-6 flex flex-wrap gap-3">
          {values.map((value, index) => (
            <div
              key={value.id}
              className="flex items-center gap-2 rounded-full border border-miyara-sky/30 bg-white px-4 py-2"
            >
              <span className="text-sm font-medium text-galam-blue">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="font-semibold text-miyara-navy">{value.value_name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Values */}
      <div className="divide-y divide-miyara-sky/10">
        {values.map((value, index) => (
          <div key={value.id} className="px-8 py-10 lg:px-12">
            <ValueBlock value={value} index={index} />
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-miyara-sky/20 bg-miyara-sky/5 px-8 py-8 text-center lg:px-12">
        <p className="text-sm text-miyara-navy/60">
          Generated with{' '}
          <span className="font-medium text-miyara-navy">Miyara Brand Discovery</span>
        </p>
        <p className="mt-1 text-xs text-miyara-navy/40">
          Your values are unique to you. Use them to guide every decision.
        </p>
      </div>
    </div>
  );
}
