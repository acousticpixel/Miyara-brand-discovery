'use client';

import { cn } from '@/lib/utils';
import { ValueBlock } from './value-block';
import type { IdentifiedValue } from '@/types/session';

interface ValuesSummaryProps {
  companyName: string;
  values: IdentifiedValue[];
  generatedAt: string;
  className?: string;
}

export function ValuesSummary({
  companyName,
  values,
  generatedAt,
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
        <p className="text-xs font-semibold uppercase tracking-widest text-miyara-sky">
          Brand Values
        </p>
        <h1 className="mt-4 text-4xl font-light text-miyara-navy lg:text-5xl">
          {companyName}
        </h1>
        <p className="mt-4 text-sm text-miyara-navy/60">
          Discovered on {formattedDate}
        </p>
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
