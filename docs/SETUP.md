# Miyara Brand Discovery - Development Setup Guide

## Prerequisites

- Node.js 20+
- npm
- Supabase account
- Anthropic API key
- Deepgram API key
- HeyGen API key (optional, for avatar feature)

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
| `DEEPGRAM_API_KEY` | Deepgram speech-to-text API key |
| `HEYGEN_API_KEY` | HeyGen streaming avatar API key (optional) |

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

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
miyara-brand-discovery/
├── src/
│   ├── app/                # Next.js App Router pages
│   ├── components/         # React components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities and integrations
│   ├── stores/             # Zustand state stores
│   └── types/              # TypeScript types
├── supabase/
│   └── migrations/         # Database migrations
└── docs/                   # Documentation
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/session/start` | POST | Start a new session |
| `/api/session/message` | POST | Send a message to the agent |
| `/api/session/complete` | POST | Complete session and generate deliverable |
| `/api/deepgram/token` | GET | Get temporary Deepgram auth token |
| `/api/heygen/session` | POST | Initialize HeyGen avatar session |

## Technology Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: Zustand
- **Database**: Supabase (PostgreSQL)
- **AI**: Anthropic Claude
- **Speech-to-Text**: Deepgram
- **Avatar**: HeyGen Streaming Avatar

## Troubleshooting

### Microphone not working

1. Check browser permissions
2. Ensure HTTPS is being used (or localhost)
3. Check that Deepgram API key is valid

### Avatar not appearing

1. HeyGen requires a separate API key and avatar ID
2. The app works without HeyGen (falls back to a placeholder)
3. Check HeyGen API key and avatar configuration

### Database connection issues

1. Verify Supabase URL and keys in `.env.local`
2. Check that Row Level Security policies are set up
3. Ensure the database schema is applied

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

Add all variables from `.env.local` to your Vercel project settings.
