'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/common/logo';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { ArrowRight, Mic, MessageSquare, FileText, Clock, CheckCircle } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const [isStarting, setIsStarting] = useState(false);

  const handleStart = () => {
    setIsStarting(true);
    router.push('/session');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Logo />
          <Button variant="ghost" size="sm" asChild>
            <a href="https://galam.com" target="_blank" rel="noopener noreferrer">
              By Galam Arts
            </a>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16 lg:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-galam-blue">
            AI-Powered Brand Discovery
          </p>

          <h1 className="mt-6 text-4xl font-light tracking-tight text-miyara-navy lg:text-6xl">
            Discover Your Brand&apos;s <br></br>Core Values
          </h1>

          <p className="mt-6 text-lg text-miyara-navy/70 lg:text-xl">
            A 15-minute voice conversation with Miyara, your AI brand strategist.
            <br />
            Walk away with clarity on what makes your brand unique.
          </p>

          <div className="mt-10">
            <Button
              onClick={handleStart}
              disabled={isStarting}
              size="lg"
              className="gap-2 bg-miyara-navy px-8 py-6 text-lg text-white hover:bg-miyara-navy/90"
            >
              {isStarting ? (
                <>
                  <LoadingSpinner size="sm" className="text-white" />
                  Starting...
                </>
              ) : (
                <>
                  Start Your Session
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </Button>
          </div>

          <p className="mt-4 text-sm text-miyara-navy/50">
            No account required. Free during beta.
          </p>
        </div>

        {/* How it works */}
        <div className="mx-auto mt-24 max-w-5xl">
          <h2 className="text-center text-2xl font-semibold text-miyara-navy">
            How It Works
          </h2>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <Card className="border-transparent bg-galam-blue">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                  <Mic className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">1. Speak Naturally</CardTitle>
                <CardDescription className="text-white/80">
                  Have a real conversation with Miyara. She&apos;ll ask thoughtful questions
                  to understand what drives you.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-transparent bg-galam-blue">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">2. Explore Values</CardTitle>
                <CardDescription className="text-white/80">
                  Through rapid-fire exercises and deep conversations, uncover the values
                  that truly resonate with your brand.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-transparent bg-galam-blue">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">3. Get Your Values</CardTitle>
                <CardDescription className="text-white/80">
                  Receive a shareable document with your 3-5 core values, defined in your
                  own words.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Benefits */}
        <div className="mx-auto mt-24 max-w-3xl">
          <Card className="border-miyara-sky/20 bg-white">
            <CardContent className="p-8">
              <div className="flex flex-col gap-6 md:flex-row md:items-center">
                <div className="flex items-center gap-4">
                  <Clock className="h-8 w-8 text-miyara-sky" />
                  <div>
                    <p className="font-semibold text-miyara-navy">15-20 minutes</p>
                    <p className="text-sm text-miyara-navy/60">Average session time</p>
                  </div>
                </div>

                <div className="hidden h-12 w-px bg-miyara-sky/20 md:block" />

                <div className="flex items-center gap-4">
                  <CheckCircle className="h-8 w-8 text-miyara-sky" />
                  <div>
                    <p className="font-semibold text-miyara-navy">3-5 core values</p>
                    <p className="text-sm text-miyara-navy/60">Personalized to you</p>
                  </div>
                </div>

                <div className="hidden h-12 w-px bg-miyara-sky/20 md:block" />

                <div className="flex items-center gap-4">
                  <FileText className="h-8 w-8 text-miyara-sky" />
                  <div>
                    <p className="font-semibold text-miyara-navy">Shareable deliverable</p>
                    <p className="text-sm text-miyara-navy/60">For your team</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="mx-auto mt-24 max-w-2xl text-center">
          <h2 className="text-2xl font-semibold text-miyara-navy">
            Ready to discover your brand values?
          </h2>
          <p className="mt-4 text-miyara-navy/70">
            Like having a $500/hour brand strategist in your browser—available anytime,
            powered by AI, guided by voice.
          </p>
          <div className="mt-8">
            <Button
              onClick={handleStart}
              disabled={isStarting}
              size="lg"
              className="gap-2 bg-miyara-navy px-8 py-6 text-lg text-white hover:bg-miyara-navy/90"
            >
              {isStarting ? (
                <>
                  <LoadingSpinner size="sm" className="text-white" />
                  Starting...
                </>
              ) : (
                <>
                  Start Now
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white py-8">
        <div className="container mx-auto px-4 text-center text-sm text-miyara-navy/60">
          <p>&copy; 2025 Galam Arts. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
