'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Download, Check, Loader2, Share2, Copy } from 'lucide-react';

interface DownloadButtonProps {
  deliverableId: string;
  className?: string;
}

export function DownloadButton({ deliverableId, className }: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);

    try {
      // For MVP, we'll trigger a print dialog
      // In production, this would call an API to generate a PDF
      window.print();
      setIsComplete(true);

      setTimeout(() => {
        setIsComplete(false);
      }, 2000);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={isDownloading}
      className={cn('gap-2', className)}
    >
      {isDownloading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Preparing...
        </>
      ) : isComplete ? (
        <>
          <Check className="h-4 w-4" />
          Downloaded
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          Download PDF
        </>
      )}
    </Button>
  );
}

interface ShareButtonProps {
  shareUrl: string;
  className?: string;
}

export function ShareButton({ shareUrl, className }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    // Try native share first
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Brand Values',
          text: 'Check out the brand values I discovered with Miyara',
          url: shareUrl,
        });
        return;
      } catch (error) {
        // User cancelled or share failed, fall back to copy
        if ((error as Error).name === 'AbortError') return;
      }
    }

    // Fall back to clipboard
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <Button
      onClick={handleShare}
      variant="outline"
      className={cn('gap-2', className)}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" />
          Copied!
        </>
      ) : typeof navigator !== 'undefined' && 'share' in navigator ? (
        <>
          <Share2 className="h-4 w-4" />
          Share
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          Copy Link
        </>
      )}
    </Button>
  );
}
