# Miyara Brand Discovery

AI-powered brand discovery for founders. Discover your core values through an interactive voice conversation with Miyara, your AI brand strategist.

**Built by [Galam Arts](https://galam.com)**

## Overview

Miyara Brand Discovery replicates the high-touch facilitation of top-tier brand strategists ($500/hour value) in an accessible, self-service format. Through a guided conversation, founders uncover 3-5 core values that will guide their brand identity.

### Features

- **Voice-first interface** — Speak naturally, like talking to a real brand strategist
- **AI-guided workshop** — Structured 9-phase session flow
- **Real-time feedback** — Value cards, progress indicators, live transcript
- **Shareable deliverable** — Professional brand values summary with unique URL
- **Dark mode support** — Light and dark themes

## Quick Start

### Prerequisites

- Node.js 20+
- Supabase account
- Anthropic API key
- Chrome or Edge browser (for speech recognition)

### Installation

```bash
# Clone the repository
git clone https://github.com/acousticpixel/Miyara-brand-discovery.git
cd miyara-brand-discovery

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Add your API keys to .env.local
# Then start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in Chrome or Edge.

### Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `ANTHROPIC_API_KEY` | Anthropic Claude API key |

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | Supabase (PostgreSQL) |
| AI | Anthropic Claude API |
| Speech | Web Speech API (browser-native) |
| State | Zustand |
| UI | shadcn/ui + custom components |

## Session Flow

The brand discovery session guides users through 9 phases:

```
OPENING → RAPID_FIRE_INTRO → RAPID_FIRE → RAPID_FIRE_DEBRIEF →
DEEP_DIVE → SCENARIO → SYNTHESIS → REFINEMENT → COMPLETE
```

1. **Opening** — Build rapport, understand motivation
2. **Rapid Fire** — Quick gut-check on value words
3. **Deep Dive** — Explore what values really mean
4. **Scenario** — Test values under pressure
5. **Synthesis** — Play back what was heard
6. **Complete** — Generate shareable deliverable

## Documentation

- [Product Requirements](./docs/PRD.md) — Features, architecture, roadmap
- [Frontend Guidelines](./docs/FRONTEND_GUIDELINES.md) — Design system, components
- [Setup Guide](./docs/SETUP.md) — Development setup, troubleshooting
- [Agent Persona](./docs/AGENT_PROMPT.md) — AI facilitator documentation

## Development

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run start    # Start production server
```

## Deployment

Deploy to Vercel:

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

```bash
npx vercel
```

## Roadmap

- [ ] PDF export for deliverables
- [ ] Additional exercises (Brand Personality, Brand Spectra)
- [ ] User authentication and saved sessions
- [ ] Text-to-speech for AI responses

## License

Private — Galam Arts

---

Built with [Next.js](https://nextjs.org) and [Anthropic Claude](https://anthropic.com)
