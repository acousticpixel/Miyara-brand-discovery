'use client';

import { cn } from '@/lib/utils';
import { Check, X, HelpCircle } from 'lucide-react';

interface ValueCardProps {
  word: string;
  isHighlighted?: boolean;
  response?: 'yes' | 'no' | 'maybe';
  onClick?: () => void;
  showResponseButtons?: boolean;
  onResponse?: (response: 'yes' | 'no' | 'maybe') => void;
  className?: string;
}

export function ValueCard({
  word,
  isHighlighted,
  response,
  onClick,
  showResponseButtons,
  onResponse,
  className,
}: ValueCardProps) {
  return (
    <div
      className={cn(
        'group relative rounded-lg border bg-white p-4 shadow-sm transition-all',
        {
          'border-gray-200 hover:border-gray-300 hover:shadow-md': !isHighlighted && !response,
          'border-blue-300 bg-blue-50 shadow-md ring-2 ring-blue-200': isHighlighted,
          'border-green-300 bg-green-50': response === 'yes',
          'border-red-300 bg-red-50': response === 'no',
          'border-amber-300 bg-amber-50': response === 'maybe',
          'cursor-pointer': onClick && !showResponseButtons,
        },
        className
      )}
      onClick={onClick && !showResponseButtons ? onClick : undefined}
    >
      <span
        className={cn(
          'block text-center text-lg font-medium',
          {
            'text-miyara-navy': !response,
            'text-green-700': response === 'yes',
            'text-red-700': response === 'no',
            'text-amber-700': response === 'maybe',
          }
        )}
      >
        {word}
      </span>

      {/* Response indicator */}
      {response && (
        <div className="absolute -right-2 -top-2">
          <div
            className={cn(
              'flex h-6 w-6 items-center justify-center rounded-full',
              {
                'bg-green-500': response === 'yes',
                'bg-red-500': response === 'no',
                'bg-amber-500': response === 'maybe',
              }
            )}
          >
            {response === 'yes' && <Check className="h-3.5 w-3.5 text-white" />}
            {response === 'no' && <X className="h-3.5 w-3.5 text-white" />}
            {response === 'maybe' && <HelpCircle className="h-3.5 w-3.5 text-white" />}
          </div>
        </div>
      )}

      {/* Response buttons (for fallback/touch interaction) */}
      {showResponseButtons && !response && (
        <div className="mt-3 flex justify-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onResponse?.('yes');
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-700 transition-colors hover:bg-green-200"
          >
            <Check className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onResponse?.('maybe');
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-700 transition-colors hover:bg-amber-200"
          >
            <HelpCircle className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onResponse?.('no');
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-700 transition-colors hover:bg-red-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
