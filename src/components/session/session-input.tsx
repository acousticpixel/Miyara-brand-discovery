'use client';

import { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Send, Loader2, AlertCircle } from 'lucide-react';

interface SessionInputProps {
  isListening: boolean;
  canSpeak: boolean;
  isProcessing?: boolean;
  error?: string | null;
  onToggleListening: () => void;
  onSendText: (text: string) => void;
  className?: string;
}

export function SessionInput({
  isListening,
  canSpeak,
  isProcessing,
  error,
  onToggleListening,
  onSendText,
  className,
}: SessionInputProps) {
  const [textInput, setTextInput] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = useCallback(() => {
    const text = textInput.trim();
    if (!text) return;
    onSendText(text);
    setTextInput('');
    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
  }, [textInput, onSendText]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  // Auto-resize textarea
  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setTextInput(e.target.value);
      const el = e.target;
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 120) + 'px';
    },
    []
  );

  const canSendText = textInput.trim().length > 0 && !isProcessing;

  return (
    <div className={cn('mx-auto w-full max-w-4xl', className)}>
      {/* Error banner */}
      {error && (
        <div className="mb-3 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span className="truncate">{error}</span>
        </div>
      )}

      {/* Input row: text input + mic button */}
      <div className="flex items-end gap-3">
        {/* Text input area */}
        <div className="relative flex-1">
          <textarea
            ref={inputRef}
            value={textInput}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={
              isListening
                ? 'Listening... or type here'
                : 'Type a message or click the mic to speak'
            }
            disabled={isProcessing}
            rows={1}
            className={cn(
              'w-full resize-none rounded-xl border bg-gray-50 px-4 py-3 pr-12 text-sm text-miyara-navy',
              'placeholder:text-gray-400',
              'focus:border-miyara-sky focus:bg-white focus:outline-none focus:ring-1 focus:ring-miyara-sky',
              'disabled:cursor-not-allowed disabled:opacity-50',
              isListening && 'border-blue-300 bg-blue-50/50'
            )}
          />

          {/* Send button inside input */}
          <Button
            onClick={handleSubmit}
            disabled={!canSendText}
            variant="ghost"
            size="sm"
            className={cn(
              'absolute bottom-1.5 right-1.5 h-8 w-8 rounded-lg p-0',
              canSendText
                ? 'text-miyara-sky hover:bg-miyara-sky/10'
                : 'text-gray-300'
            )}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Microphone button */}
        <Button
          onClick={onToggleListening}
          disabled={!canSpeak || isProcessing}
          variant={isListening ? 'default' : 'outline'}
          className={cn(
            'h-[46px] w-[46px] shrink-0 rounded-xl p-0 transition-all',
            {
              'bg-blue-500 hover:bg-blue-600 text-white shadow-md shadow-blue-500/25':
                isListening,
              'border-gray-300 hover:border-gray-400 text-gray-500':
                !isListening && canSpeak,
              'opacity-50 cursor-not-allowed': !canSpeak || isProcessing,
            }
          )}
        >
          {isProcessing ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : isListening ? (
            <Mic className="h-5 w-5" />
          ) : (
            <MicOff className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Status text */}
      <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
        <span>
          {isListening ? (
            <span className="flex items-center gap-1.5 text-blue-500">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
              </span>
              Listening...
            </span>
          ) : isProcessing ? (
            'Processing...'
          ) : (
            'Press Enter to send, Shift+Enter for new line'
          )}
        </span>
      </div>
    </div>
  );
}
