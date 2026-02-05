'use client';

import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import type { SessionPhase } from '@/types/session';
import { SESSION_PHASES } from '@/lib/utils/constants';

interface ProgressTrackerProps {
  currentPhase: SessionPhase;
  className?: string;
}

const DISPLAY_PHASES = [
  { id: 'OPENING', label: 'Opening', phases: ['OPENING'] },
  { id: 'RAPID_FIRE', label: 'Values', phases: ['RAPID_FIRE_INTRO', 'RAPID_FIRE', 'RAPID_FIRE_DEBRIEF'] },
  { id: 'DEEP_DIVE', label: 'Deep Dive', phases: ['DEEP_DIVE'] },
  { id: 'SCENARIO', label: 'Scenario', phases: ['SCENARIO'] },
  { id: 'SYNTHESIS', label: 'Synthesis', phases: ['SYNTHESIS', 'REFINEMENT'] },
  { id: 'COMPLETE', label: 'Complete', phases: ['COMPLETE'] },
] as const;

export function ProgressTracker({ currentPhase, className }: ProgressTrackerProps) {
  const currentOrder = SESSION_PHASES[currentPhase]?.order ?? 0;

  const getPhaseStatus = (displayPhase: (typeof DISPLAY_PHASES)[number]) => {
    const phaseOrders = displayPhase.phases.map(
      (p) => SESSION_PHASES[p as SessionPhase]?.order ?? 0
    );
    const minOrder = Math.min(...phaseOrders);
    const maxOrder = Math.max(...phaseOrders);

    if (currentOrder > maxOrder) return 'completed';
    if (currentOrder >= minOrder && currentOrder <= maxOrder) return 'current';
    return 'upcoming';
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Desktop view */}
      <div className="hidden sm:flex items-center justify-between">
        {DISPLAY_PHASES.map((phase, index) => {
          const status = getPhaseStatus(phase);
          const isLast = index === DISPLAY_PHASES.length - 1;

          return (
            <div key={phase.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                {/* Circle */}
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all',
                    {
                      'border-green-500 bg-green-500 text-white': status === 'completed',
                      'border-blue-500 bg-blue-500 text-white': status === 'current',
                      'border-gray-300 bg-white text-gray-400': status === 'upcoming',
                    }
                  )}
                >
                  {status === 'completed' ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span className="text-xs font-medium">{index + 1}</span>
                  )}
                </div>

                {/* Label */}
                <span
                  className={cn(
                    'mt-2 text-xs font-medium',
                    {
                      'text-green-600': status === 'completed',
                      'text-blue-600': status === 'current',
                      'text-gray-400': status === 'upcoming',
                    }
                  )}
                >
                  {phase.label}
                </span>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-2 mt-[-1.5rem]',
                    {
                      'bg-green-500': status === 'completed',
                      'bg-gradient-to-r from-blue-500 to-gray-300': status === 'current',
                      'bg-gray-300': status === 'upcoming',
                    }
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile view - simplified */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-miyara-navy">
            {SESSION_PHASES[currentPhase]?.label || currentPhase}
          </span>
          <span className="text-sm text-muted-foreground">
            Step {currentOrder + 1} of {Object.keys(SESSION_PHASES).length}
          </span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full bg-blue-500 transition-all duration-500"
            style={{
              width: `${((currentOrder + 1) / Object.keys(SESSION_PHASES).length) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
