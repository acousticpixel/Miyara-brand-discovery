# Miyara Brand Discovery - Development Setup Guide

## Prerequisites

- Node.js 20+
- npm
- Supabase account
- Anthropic API key
- Chrome or Edge browser (for speech recognition)

## Initial Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Copy the environment template and fill in your API keys:

```bash
cp .env.example .env.local
```

Required environment variables:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `ANTHROPIC_API_KEY` | Anthropic Claude API key |
| `NEXT_PUBLIC_APP_URL` | App URL (http://localhost:3000 for dev) |

### 3. Database Setup

#### Option A: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy the contents of `supabase/migrations/001_initial_schema.sql`
4. Run the SQL

#### Option B: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in **Chrome or Edge** (required for speech recognition).

## Project Structure

```
miyara-brand-discovery/
├── src/
│   ├── app/                # Next.js App Router pages
│   │   ├── api/session/    # Session API endpoints
│   │   ├── session/        # Main session page
│   │   └── deliverable/    # Deliverable view
│   ├── components/         # React components
│   │   ├── ui/             # shadcn/ui primitives
│   │   ├── common/         # Shared components
│   │   ├── session/        # Session-specific
│   │   ├── exercise/       # Exercise UI
│   │   └── deliverable/    # Deliverable display
│   ├── hooks/              # Custom React hooks
│   │   ├── use-agent.ts    # AI interaction
│   │   ├── use-session.ts  # Session state
│   │   └── use-speech.ts   # Speech recognition
│   ├── lib/                # Utilities and integrations
│   │   ├── agent/          # AI orchestration
│   │   ├── exercises/      # Exercise modules
│   │   ├── integrations/   # External services
│   │   └── supabase/       # Database clients
│   ├── stores/             # Zustand state stores
│   └── types/              # TypeScript types
├── docs/                   # Documentation
│   ├── PRD.md              # Product requirements
│   ├── FRONTEND_GUIDELINES.md # Design system
│   ├── AGENT_PROMPT.md     # AI persona docs
│   └── SETUP.md            # This file
├── supabase/
│   └── migrations/         # Database migrations
├── CLAUDE.md               # AI assistant context
├── progress.txt            # Development progress
└── lessons.md              # Technical lessons learned
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/session/start` | POST | Start a new session |
| `/api/session/message` | POST | Send a message to the agent |
| `/api/session/complete` | POST | Complete session and generate deliverable |

## Technology Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **State**: Zustand
- **Database**: Supabase (PostgreSQL)
- **AI**: Anthropic Claude API
- **Speech**: Web Speech API (browser-native)
- **Theming**: next-themes (dark mode support)

## Speech Recognition

Miyara uses the browser-native **Web Speech API** for speech-to-text. This means:

- ✅ No external API keys needed for speech
- ✅ Free and unlimited usage
- ✅ Real-time transcription
- ⚠️ **Chrome or Edge required** (Safari/Firefox not supported)
- ⚠️ Requires HTTPS in production (localhost works for development)

### How it works
- Click the microphone button to start listening
- Speak naturally - the app detects pauses
- After 1.8 seconds of silence, the transcript is sent to the AI
- Text input is available as a fallback

## Troubleshooting

### Microphone not working

1. **Check browser**: Must use Chrome or Edge
2. **Check permissions**: Allow microphone access when prompted
3. **Check HTTPS**: Production requires HTTPS (localhost works)
4. **Check browser console**: Look for permission errors

### Speech recognition not detecting speech

1. Speak clearly into the microphone
2. Check that the microphone is selected in browser settings
3. Try refreshing the page
4. Use text input as a fallback

### Session stuck / not progressing

1. Check browser console for errors
2. The AI controls phase transitions - it may need more input
3. Try answering questions more completely
4. Refresh and start a new session if stuck

### Database connection issues

1. Verify Supabase URL and keys in `.env.local`
2. Check that Row Level Security policies are set up
3. Ensure the database schema is applied
4. Check Supabase dashboard for connection issues

### Build errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm install

# Rebuild
npm run build
```

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

```bash
npx vercel
```

### Environment Variables in Vercel

Add all variables from `.env.local` to your Vercel project settings:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ANTHROPIC_API_KEY`
- `NEXT_PUBLIC_APP_URL` (your Vercel URL)

### Production Checklist

- [ ] All environment variables set
- [ ] Database migrations applied
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] Test full session flow
- [ ] Test deliverable generation

## Common Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Related Documentation

- [Product Requirements](./PRD.md)
- [Frontend Guidelines](./FRONTEND_GUIDELINES.md)
- [Agent Persona](./AGENT_PROMPT.md)
- [Project Context](../CLAUDE.md)
