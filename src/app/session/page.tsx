'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAgent } from '@/hooks/use-agent';
import { useSessionStore } from '@/stores/session-store';
import {
  SessionContainer,
  SessionLayout,
} from '@/components/session/session-container';
import { SessionInput } from '@/components/session/session-input';
import { ValueCards } from '@/components/exercise/value-cards';
import { ConversationTranscript } from '@/components/exercise/transcript-display';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { Logo } from '@/components/common/logo';
import { Button } from '@/components/ui/button';
import { FileText, ArrowRight, CheckCircle } from 'lucide-react';

export default function SessionPage() {
  const router = useRouter();
  const [showPermissions, setShowPermissions] = useState(true);
  const [showCompletion, setShowCompletion] = useState(false);
  const [deliverableSlug, setDeliverableSlug] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState('');
  const [isInitializing, setIsInitializing] = useState(false);
  const conversationEndRef = useRef<HTMLDivElement>(null);

  const agent = useAgent();
  const {
    conversationHistory,
    displayedValueCards,
    highlightedValue,
    rapidFireResponses,
    currentPhase,
    isProcessing,
    currentTranscript,
  } = useSessionStore();

  // Convert rapid fire responses to record
  const responseRecord = rapidFireResponses.reduce(
    (acc, r) => {
      acc[r.word] = r.response;
      return acc;
    },
    {} as Record<string, 'yes' | 'no' | 'maybe'>
  );

  // Auto-scroll conversation to bottom when new messages arrive
  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationHistory, currentTranscript]);

  // Start the session when permissions are granted
  const handleStartSession = async () => {
    setIsInitializing(true);
    await agent.startSession(companyName || undefined);
    setShowPermissions(false);
    setIsInitializing(false);
  };

  // Handle end session
  const handleEndSession = () => {
    if (confirm('Are you sure you want to end this session?')) {
      agent.endSession();
      router.push('/');
    }
  };

  // Handle text message submission
  const handleSendText = (text: string) => {
    if (!text.trim()) return;
    agent.sendTextMessage(text.trim());
  };

  // When the session reaches COMPLETE, generate the deliverable (but don't auto-navigate)
  // Using a ref to track if we've started generating to avoid duplicate calls
  const hasStartedGenerating = useRef(false);

  useEffect(() => {
    if (currentPhase === 'COMPLETE' && !showCompletion && !hasStartedGenerating.current) {
      const store = useSessionStore.getState();
      if (store.sessionId) {
        hasStartedGenerating.current = true;
        // Call the complete API to generate the deliverable
        fetch('/api/session/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: store.sessionId }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success && data.deliverable?.share_slug) {
              setDeliverableSlug(data.deliverable.share_slug);
            } else {
              // Fallback: use session ID
              setDeliverableSlug(store.sessionId);
            }
            setShowCompletion(true);
          })
          .catch(() => {
            // Fallback: use session ID
            setDeliverableSlug(store.sessionId);
            setShowCompletion(true);
          });
      }
    }
  }, [currentPhase, showCompletion]);

  // Handle viewing the deliverable
  const handleViewDeliverable = () => {
    if (deliverableSlug) {
      router.push(`/deliverable/${deliverableSlug}`);
    }
  };

  // Show completion screen with option to view deliverable
  if (showCompletion) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white p-4">
        <div className="w-full max-w-lg space-y-8 text-center">
          {/* Success icon */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-miyara-success/10">
            <CheckCircle className="h-10 w-10 text-miyara-success" />
          </div>

          {/* Logo */}
          <Logo size="lg" />

          {/* Message */}
          <div className="space-y-4">
            <h1 className="text-3xl font-light text-miyara-navy">
              Session Complete!
            </h1>
            <p className="text-lg text-miyara-navy/70">
              Congratulations! You&apos;ve discovered your brand&apos;s core values.
              Your personalized brand values document is ready.
            </p>
          </div>

          {/* What you'll get */}
          <div className="rounded-lg border border-miyara-sky/20 bg-miyara-sky/5 p-6">
            <h3 className="font-semibold text-miyara-navy">Your Brand Values Document Includes:</h3>
            <ul className="mt-4 space-y-2 text-left text-miyara-navy/70">
              <li className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-miyara-success" />
                <span>3-5 core values personalized to your brand</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-miyara-success" />
                <span>Detailed definitions of what each value means for you</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-miyara-success" />
                <span>Practical applications and anti-patterns</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-miyara-success" />
                <span>Key quotes from your session</span>
              </li>
            </ul>
          </div>

          {/* CTA Button */}
          <Button
            onClick={handleViewDeliverable}
            disabled={!deliverableSlug}
            size="lg"
            className="w-full gap-2 bg-miyara-navy px-8 py-6 text-lg text-white hover:bg-miyara-navy/90"
          >
            {!deliverableSlug ? (
              <>
                <LoadingSpinner size="sm" className="text-white" />
                Preparing your document...
              </>
            ) : (
              <>
                <FileText className="h-5 w-5" />
                View My Brand Values
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </Button>

          <p className="text-sm text-miyara-navy/50">
            You can share or download your document from the next page.
          </p>
        </div>
      </div>
    );
  }

  // Show permissions/setup screen with intro video
  if (showPermissions) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white p-4">
        <div className="w-full max-w-lg space-y-6">
          {/* Intro video */}
          <div className="overflow-hidden rounded-2xl shadow-lg">
            <video
              autoPlay
              playsInline
              controls
              className="w-full"
              src="/intro.mp4"
            />
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-semibold text-miyara-navy">
              Welcome to Miyara
            </h1>
            <p className="mt-2 text-miyara-navy/70">
              Let&apos;s get you set up for your brand discovery session.
            </p>
          </div>

          {/* Optional company name */}
          <div className="space-y-2">
            <label
              htmlFor="company"
              className="block text-sm font-medium text-miyara-navy"
            >
              Company name (optional)
            </label>
            <input
              id="company"
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter your company name"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {agent.error && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
              {agent.error}
            </div>
          )}

          <Button
            onClick={handleStartSession}
            disabled={isInitializing}
            className="w-full gap-2"
            size="lg"
          >
            {isInitializing ? (
              <>
                <LoadingSpinner size="sm" className="text-white" />
                Setting up...
              </>
            ) : (
              'Start Session'
            )}
          </Button>

          <p className="text-center text-xs text-gray-500">
            You&apos;ll need to allow microphone access to speak with Miyara.
          </p>
        </div>
      </div>
    );
  }

  // Main session UI
  return (
    <SessionContainer currentPhase={currentPhase} onEndSession={handleEndSession}>
      <SessionLayout
        conversationSection={
          <div className="mx-auto w-full max-w-4xl p-4 sm:p-6">
            {/* Value cards */}
            {displayedValueCards.length > 0 && (
              <div className="mb-6">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-galam-blue">
                  Values
                </h3>
                <ValueCards
                  words={displayedValueCards}
                  highlightedWord={highlightedValue || undefined}
                  responses={responseRecord}
                  mode="display"
                />
              </div>
            )}

            {/* Conversation history */}
            {conversationHistory.length > 0 ? (
              <ConversationTranscript entries={conversationHistory} />
            ) : (
              <p className="py-8 text-center text-sm text-gray-400">
                Your conversation with Miyara will appear here.
              </p>
            )}

            {/* Live transcript preview */}
            {currentTranscript && (
              <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3">
                <p className="text-sm text-miyara-navy/70">{currentTranscript}</p>
              </div>
            )}

            {/* Processing indicator */}
            {isProcessing && (
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                <LoadingSpinner size="sm" />
                <span>Miyara is thinking...</span>
              </div>
            )}

            {/* Scroll anchor */}
            <div ref={conversationEndRef} />
          </div>
        }
        inputSection={
          <SessionInput
            isListening={agent.isListening}
            canSpeak={agent.canSpeak}
            isProcessing={isProcessing}
            error={agent.error}
            onToggleListening={agent.toggleListening}
            onSendText={handleSendText}
          />
        }
      />
    </SessionContainer>
  );
}
