'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Logo } from '@/components/common/logo';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { ValuesSummary } from '@/components/deliverable/values-summary';
import { DownloadButton, ShareButton } from '@/components/deliverable/download-button';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import type { DeliverableContent, IdentifiedValue } from '@/types/session';

interface DeliverableData {
  id: string;
  content: DeliverableContent;
  share_slug: string;
}

export default function DeliverablePage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const [deliverable, setDeliverable] = useState<DeliverableData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDeliverable() {
      try {
        // First, check if sessionId is a share_slug
        let { data, error: fetchError } = await supabase
          .from('deliverables')
          .select('*')
          .eq('share_slug', sessionId)
          .single();

        // If not found by slug, try by session_id
        if (fetchError || !data) {
          const result = await supabase
            .from('deliverables')
            .select('*')
            .eq('session_id', sessionId)
            .single();

          data = result.data;
          fetchError = result.error;
        }

        if (fetchError || !data) {
          // If still not found, try to generate it
          const response = await fetch('/api/session/complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session_id: sessionId }),
          });

          if (!response.ok) {
            throw new Error('Deliverable not found');
          }

          const result = await response.json();
          if (result.success) {
            setDeliverable({
              id: result.deliverable.id,
              content: result.deliverable.content,
              share_slug: result.deliverable.share_slug,
            });
            return;
          }

          throw new Error('Failed to generate deliverable');
        }

        setDeliverable({
          id: data.id,
          content: data.content as unknown as DeliverableContent,
          share_slug: data.share_slug || sessionId,
        });
      } catch (err) {
        console.error('Failed to load deliverable:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to load deliverable'
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadDeliverable();
  }, [sessionId]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner size="lg" />
          <p className="text-miyara-navy/70">Loading your brand values...</p>
        </div>
      </div>
    );
  }

  if (error || !deliverable) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-xl font-semibold text-miyara-navy">
            Deliverable Not Found
          </h1>
          <p className="mt-2 text-miyara-navy/70">
            {error || "We couldn't find this deliverable. It may have been removed or the link is incorrect."}
          </p>
          <Button
            onClick={() => router.push('/')}
            className="mt-6"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/deliverable/${deliverable.share_slug}`
      : '';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur-sm print:hidden">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Home
          </Button>

          <Logo size="sm" />

          <div className="flex items-center gap-2">
            <ShareButton shareUrl={shareUrl} />
            <DownloadButton deliverableId={deliverable.id} />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto max-w-3xl px-4 py-8 print:max-w-none print:p-0">
        <ValuesSummary
          companyName={deliverable.content.company_name}
          values={deliverable.content.values}
          generatedAt={deliverable.content.generated_at}
          className="rounded-lg shadow-lg print:rounded-none print:shadow-none"
        />
      </main>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          @page {
            margin: 0.5in;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
}
