# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with this codebase.

## Project Overview

Miyara Brand Discovery is an AI-powered voice-first brand discovery application that guides founders through interactive brand strategy workshops. The app uses conversational AI to help users discover their core brand values through a structured session flow.

**Company**: Galam Arts (galam.com)
**Product**: Miyara Brand Discovery
**Goal**: Replicate the high-touch facilitation of top-tier brand strategists ($500/hour value) in an accessible, self-service format.

---

## Tech Stack (Locked)

Do not add new dependencies without explicit approval.

|
 Category 
|
 Technology 
|
 Version/Notes 
|
|
----------
|
------------
|
---------------
|
|
 Framework 
|
 Next.js 14 
|
 App Router 
|
|
 Language 
|
 TypeScript 
|
 Strict mode 
|
|
 Styling 
|
 Tailwind CSS 
|
 Custom design tokens 
|
|
 Database 
|
 Supabase 
|
 PostgreSQL 
|
|
 AI 
|
 Anthropic Claude API 
|
 claude-3-5-sonnet 
|
|
 Speech 
|
 Web Speech API 
|
 Browser-native (Chrome/Edge) 
|
|
 State 
|
 Zustand 
|
 Client-side state 
|
|
 UI 
|
 shadcn/ui 
|
 Primitives + custom components 
|

---

## Design Tokens (Locked)

These values are canonical. Use them consistently across all components.

### Colors
```css
/* Primary Palette (from brand PDF) */
--miyara-navy: #1B2A4E        /* Primary text, headings, dark accents */
--miyara-sky: #7DD3FC          /* Background accent, section backgrounds */
--miyara-sky-light: #BAE6FD    /* Lighter accent, hover states */
--miyara-white: #FFFFFF        /* Card backgrounds, content areas */

/* Semantic Colors */
--miyara-accent: #3B82F6       /* Interactive elements, links, buttons */
--miyara-success: #22C55E      /* Positive states, "yes" responses */
--miyara-warning: #F59E0B      /* Uncertain states, "maybe" responses */
--miyara-error: #EF4444        /* Negative states, "no" responses, errors */

/* Neutrals */
--miyara-gray-50: #F9FAFB      /* Page backgrounds */
--miyara-gray-100: #F3F4F6     /* Subtle backgrounds */
--miyara-gray-200: #E5E7EB     /* Borders, dividers */
--miyara-gray-400: #9CA3AF     /* Placeholder text */
--miyara-gray-600: #4B5563     /* Secondary text */
--miyara-gray-900: #111827     /* Primary text alternative */
Spacing Scale
All spacing uses 4px base increments:

1 = 4px, 2 = 8px, 3 = 12px, 4 = 16px
6 = 24px, 8 = 32px, 12 = 48px, 16 = 64px
Border Radius
Cards, buttons, inputs: rounded-lg (8px)
Pills, tags, badges: rounded-full
Modals, large containers: rounded-xl (12px)
Typography
Display headings: font-light (300 weight), large sizes
Section labels: uppercase tracking-wider text-xs text-miyara-sky
Body text: font-normal (400 weight)
Emphasis: font-medium (500 weight)
Shadows
Cards: shadow-sm default, shadow-md on hover
Modals: shadow-lg
Elevated elements: shadow-xl
Key Architecture
Session Flow (Current: Values Discovery)
The app guides users through 9 phases:

OPENING → RAPID_FIRE_INTRO → RAPID_FIRE → RAPID_FIRE_DEBRIEF → DEEP_DIVE → SCENARIO → SYNTHESIS → REFINEMENT → COMPLETE
Core Directories
src/
├── app/                    # Next.js App Router pages and API routes
│   ├── api/session/        # Session management endpoints
│   ├── session/            # Main session UI
│   └── deliverable/        # Deliverable view pages
├── components/             # React components
│   ├── session/            # Session-specific components
│   ├── exercise/           # Exercise UI (value cards, etc.)
│   ├── deliverable/        # Deliverable display components
│   ├── common/             # Shared components (logo, loading, etc.)
│   └── ui/                 # shadcn/ui primitives
├── hooks/                  # Custom React hooks
│   ├── use-agent.ts        # AI interaction hook
│   ├── use-session.ts      # Session state hook
│   └── use-speech.ts       # Speech recognition (Web Speech API)
├── lib/
│   ├── agent/              # AI orchestration
│   │   ├── system-prompt.ts    # Miyara persona and instructions
│   │   ├── orchestrator.ts     # Conversation flow controller
│   │   ├── state-machine.ts    # Phase transitions
│   │   └── response-parser.ts  # JSON parsing/validation
│   ├── integrations/       # External services (Anthropic)
│   └── supabase/           # Database clients
├── stores/                 # Zustand state stores
└── types/                  # TypeScript definitions
Key Files

File	Purpose
src/lib/agent/system-prompt.ts	Miyara persona, session structure, facilitation rules
src/lib/agent/orchestrator.ts	Conversation flow controller, context assembly
src/app/api/session/message/route.ts	Main API endpoint for AI messages
src/app/session/page.tsx	Main session UI
src/hooks/use-speech.ts	Speech recognition (Web Speech API)
Important Patterns
AI Response Format
The AI agent returns structured JSON matching the AgentResponse type:

typescript
interface AgentResponse {
  spokenResponse: string;      // What Miyara says to the user
  internalNotes: string;       // Analysis notes (for debugging/logging)
  stateUpdates: {
    phase: SessionPhase;       // Current or next phase
    newInsights: string[];     // Insights discovered this turn
    identifiedValues: string[]; // Values emerging as core
    valuesToExplore: string[]; // Values to dig into
  };
  uiActions: {
    showValueCards?: string[]; // Words to display as cards
    highlightValue?: string;   // Word to highlight
    updateProgress?: string;   // Phase name for progress indicator
  };
}
Open in CodePen 
Phase Transitions
Critical: The AI controls phase transitions by setting phase in stateUpdates. The session will NOT progress unless the AI explicitly changes the phase. This is documented in the system prompt under <phase_transition_rules>.

Speech Recognition
Uses browser-native Web Speech API with:

Debounce-based auto-send (1.8s pause triggers submission)
Visual feedback for listening state
Chrome/Edge required (Safari/Firefox not supported)
State Management
Client state: Zustand store (src/stores/session-store.ts)
Persistent state: Supabase (sessions, identified_values, deliverables tables)
Stateless API: State reconstructed from database on each request
Exercise Module Architecture (Future)
When adding new exercises beyond Values Discovery, follow this pattern:

Exercise Directory Structure
src/lib/exercises/
├── index.ts                    # Exercise registry - exports all exercises
├── types.ts                    # Shared exercise types and interfaces
├── values-discovery/           # Values Discovery exercise (implemented)
│   ├── index.ts                # Module export
│   ├── config.ts               # Exercise metadata, phases, VALUE_WORDS
│   ├── state.ts                # State management helpers
│   ├── deliverable.ts          # Deliverable section generator
│   └── prompt.ts               # Exercise-specific system prompt additions
├── brand-personality/          # Future exercise
│   └── ...
└── brand-spectra/              # Future exercise
    └── ...
Exercise Interface
Each exercise module must implement:

typescript
interface ExerciseModule {
  id: string;                           // Unique identifier
  name: string;                         // Display name
  description: string;                  // Brief description
  estimatedMinutes: number;             // Expected duration
  phases: ExercisePhase[];              // Phase definitions
  systemPromptAddition: string;         // Prompt content for this exercise
  getInitialState: () => ExerciseState; // Initial state factory
  processResponse: (response: AgentResponse, state: ExerciseState) => ExerciseState;
  generateDeliverableSection: (state: ExerciseState) => DeliverableSection;
}
Open in CodePen 
Planned Exercises
Values Discovery ✅ (current)
Brand Personality (define character, voice, tone)
Brand Spectra (position on attribute scales - like the PDF sliders)
Audience Definition (ideal customer persona)
Competitive Positioning (differentiation statement)
Session Tracking Rules
Start of every session: Read progress.txt and lessons.md before any work
After completing a feature: Update progress.txt with what was completed
After any correction: Add entry to lessons.md with problem, solution, and lesson
Before committing: Ensure progress.txt reflects current state
End of session: Update "Recent Changes" in progress.txt
Rules and Constraints
✅ DO
Use existing design tokens from the Design Tokens section above
Follow established component patterns in src/components/
Use Zustand for client state, Supabase for persistence
Return structured JSON from AI agent (AgentResponse type)
Handle loading and error states in all async operations
Test on mobile viewport before completing any UI work
Use TypeScript strict mode—everything should be typed
Use Tailwind classes for all styling
Commit to git after each working feature
Update progress.txt after completing features
Update lessons.md after any significant correction
❌ DO NOT
Add new npm dependencies without explicit approval
Use inline styles—always use Tailwind classes
Skip TypeScript types
Create new color values—use design tokens only
Modify core session flow without updating this document
Assume phase transitions—AI must explicitly set them
Leave TODO comments without tracking in progress.txt
Ignore mobile responsiveness
Commit broken code to main branch
Common Commands
bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Build for production
npm run lint     # Run ESLint
npm run start    # Start production server
Environment Variables
Required in .env.local:

bash
# Anthropic (Claude AI)
ANTHROPIC_API_KEY=sk-ant-...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
Security: Never commit .env.local. It's in .gitignore.

Documentation References
For detailed specifications, see:

progress.txt - Current state, completed features, next steps
lessons.md - Technical lessons learned, patterns to follow/avoid
docs/PRD.md - Product requirements and scope (if exists)
docs/FRONTEND_GUIDELINES.md - Complete design system (if exists)
Current Focus
Next milestone: Implement modular exercise architecture to support multiple brand exercises beyond Values Discovery.

Architecture decisions made:

Exercises share context (Brand Personality can reference discovered values)
One combined deliverable at the end (like the brand PDF)
Sequential exercise flow for MVP (all exercises in order)
Next exercise to implement: Brand Spectra (visual sliders, matches PDF style)
Exercise module architecture is now implemented:

✅ src/lib/exercises/ directory structure created
✅ ExerciseModule interface defined in types.ts
✅ Values Discovery refactored into module pattern
✅ Exercise registry created in index.ts

To add a new exercise:
1. Create new directory: src/lib/exercises/<exercise-name>/
2. Implement ExerciseModule interface (config, state, deliverable, prompt)
3. Add to exerciseRegistry in src/lib/exercises/index.ts
4. Update orchestrator to handle new exercise phases

---

## How to Use This File

Simply copy everything above and replace your existing `CLAUDE.md` file. 

When you start a new Claude Code session, it will automatically read this file and have full context about:
- Your tech stack and constraints
- Your design system
- Your architecture patterns
- What to do and what not to do
- Where you are in the project
- What's coming next