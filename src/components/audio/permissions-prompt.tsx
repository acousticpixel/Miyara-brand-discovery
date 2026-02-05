'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PermissionsPromptProps {
  onRequestPermission: () => void;
  isLoading?: boolean;
  error?: string | null;
  className?: string;
}

export function PermissionsPrompt({
  onRequestPermission,
  isLoading,
  error,
  className,
}: PermissionsPromptProps) {
  return (
    <Card className={cn('w-full max-w-md', className)}>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
          <Mic className="h-8 w-8 text-blue-600" />
        </div>
        <CardTitle>Enable Microphone</CardTitle>
        <CardDescription>
          To have a voice conversation with Miyara, we need access to your microphone.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <Button
          onClick={onRequestPermission}
          disabled={isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? 'Requesting access...' : 'Allow Microphone Access'}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          Your audio is processed in real-time and is not stored.
        </p>
      </CardContent>
    </Card>
  );
}
