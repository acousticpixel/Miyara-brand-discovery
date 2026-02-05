# Miyara Brand Discovery - Product Requirements Document

## Vision

Replicate the high-touch facilitation of top-tier brand strategists ($500/hour value) in an accessible, self-service format.

**Company:** Galam Arts ([galam.com](https://galam.com))
**Product:** Miyara Brand Discovery

---

## Target Users

### Primary: Founders & Entrepreneurs
- Early-stage startup founders defining their brand identity
- Solo entrepreneurs launching new ventures
- Small business owners rebranding or clarifying their values

### Secondary: Brand Teams
- Marketing teams at small companies without dedicated brand strategists
- Creative agencies seeking structured discovery tools for clients

### User Needs
- Clarity on what their brand stands for
- Articulated core values with personalized definitions
- Professional deliverable to share with team/stakeholders
- Efficient process (30-45 minutes vs. multi-week agency engagement)

---

## Core Features (MVP)

### 1. Voice-First Conversational Interface
- Browser-native speech recognition (Web Speech API)
- Real-time transcript display
- Text input fallback for accessibility
- Debounce-based auto-send (1.8s pause triggers submission)

### 2. AI-Guided Brand Values Workshop
- Persona: "Maya" - warm, direct, intellectually curious brand strategist
- Structured facilitation with probing follow-up questions
- Context-aware responses that reference user's product/industry
- Challenges generic answers with curiosity, not judgment

### 3. Structured Session Flow (9 Phases)
```
OPENING → RAPID_FIRE_INTRO → RAPID_FIRE → RAPID_FIRE_DEBRIEF →
DEEP_DIVE → SCENARIO → SYNTHESIS → REFINEMENT → COMPLETE
```

| Phase | Purpose | Duration |
|-------|---------|----------|
| OPENING | Build rapport, understand motivation | 1-2 exchanges |
| RAPID_FIRE_INTRO | Explain the exercise | 1 exchange |
| RAPID_FIRE | Quick gut-check on ~20 value words | Multiple |
| RAPID_FIRE_DEBRIEF | Reflect on patterns | 1-2 exchanges |
| DEEP_DIVE | Understand what values really mean | 3-4 per value |
| SCENARIO | Test values under pressure | 2-3 exchanges |
| SYNTHESIS | Play back what was heard | 1-2 exchanges |
| REFINEMENT | Incorporate feedback | 1-2 exchanges |
| COMPLETE | Wrap up and deliver | 1 exchange |

### 4. Real-Time UI Feedback
- Value cards displayed during rapid-fire exercise
- Progress indicator showing current phase
- Live transcript preview while speaking
- "Thinking" indicator when AI is processing

### 5. Shareable Brand Values Deliverable
- Unique shareable URL (share_slug)
- Personalized value definitions (not generic)
- Clean, printable format
- Future: PDF export

---

## Technical Architecture

### Tech Stack
| Category | Technology |
|----------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 |
| Database | Supabase (PostgreSQL) |
| AI | Anthropic Claude API |
| Speech | Web Speech API (browser-native) |
| State | Zustand |
| UI | shadcn/ui + custom components |

### AI Response Format
```typescript
interface AgentResponse {
  spokenResponse: string;      // What Maya says
  internalNotes: string;       // Analysis (for logging)
  stateUpdates: {
    phase: SessionPhase;
    newInsights: string[];
    identifiedValues: string[];
    valuesToExplore: string[];
  };
  uiActions: {
    showValueCards?: string[];
    highlightValue?: string;
    updateProgress?: string;
  };
}
```

### Phase Transitions
- AI controls transitions by setting `phase` in `stateUpdates`
- Session won't progress unless AI explicitly changes phase
- Documented in system prompt under `<phase_transition_rules>`

---

## Exercise Module Architecture

### Design Principles
- **Modular:** Each exercise is a self-contained module
- **Shared UI:** Common components with exercise-specific configuration
- **Sequential Flow:** MVP requires completing exercises in order
- **Combined Deliverable:** One unified brand guide at the end

### Exercise Module Interface
```typescript
interface ExerciseModule {
  id: string;
  name: string;
  description: string;
  estimatedMinutes: number;
  phases: ExercisePhase[];
  systemPromptAddition: string;
  getInitialState: () => ExerciseState;
  processResponse: (response, state) => ExerciseState;
  generateDeliverableSection: (state) => DeliverableSection;
  uiConfig?: ExerciseUIConfig;
}
```

### Exercise Registry Pattern
```
src/lib/exercises/
├── index.ts          # Registry exports
├── types.ts          # Shared interfaces
└── values-discovery/ # Exercise modules
    ├── index.ts
    ├── config.ts
    ├── prompt.ts
    ├── state.ts
    └── deliverable.ts
```

### Planned Exercises
1. **Values Discovery** ✅ (current)
   - Rapid-fire value word assessment
   - Deep-dive exploration of resonant values
   - Scenario-based value testing

2. **Brand Personality** (planned)
   - Define brand character and voice
   - Tone attributes
   - Communication style

3. **Brand Spectra** (planned)
   - Position on attribute scales (visual sliders)
   - Traditional ↔ Modern
   - Playful ↔ Serious
   - Luxurious ↔ Accessible

4. **Audience Definition** (planned)
   - Ideal customer persona
   - Pain points and aspirations
   - Communication preferences

5. **Competitive Positioning** (planned)
   - Differentiation statement
   - Unique value proposition
   - Market positioning

---

## Success Criteria

### User Experience
- [ ] User completes full session (all 9 phases)
- [ ] Session feels like talking to a real brand strategist
- [ ] Values are personalized, not generic
- [ ] Deliverable is shareable and professional

### Technical
- [ ] Speech recognition works reliably (Chrome/Edge)
- [ ] Session state persists across page refreshes
- [ ] Deliverable generates correctly
- [ ] Mobile-responsive UI

### Business
- [ ] Average session completion: >70%
- [ ] Time to complete: 30-45 minutes
- [ ] User satisfaction: would recommend to others

---

## Out of Scope (MVP)

- ❌ User authentication / accounts
- ❌ Session history / resume
- ❌ Multi-language support
- ❌ PDF export (deferred to future sprint)
- ❌ Payment / subscription
- ❌ Real-time avatar (removed - using intro video)
- ❌ Text-to-speech for AI responses

---

## Future Enhancements

### Near-Term
- [ ] PDF export for deliverables
- [ ] Additional exercises (Brand Personality, Brand Spectra)
- [ ] Combined deliverable from all exercises

### Medium-Term
- [ ] User authentication and saved sessions
- [ ] Session history and resume capability
- [ ] Text-to-speech for AI responses (ElevenLabs)

### Long-Term
- [ ] Analytics dashboard for session insights
- [ ] Admin panel for prompt tuning
- [ ] White-label version for agencies
- [ ] Team collaboration features

---

## References

- **Visual Style:** [galam.com](https://galam.com)
- **Agent Persona:** `docs/AGENT_PROMPT.md`
- **Design System:** `docs/FRONTEND_GUIDELINES.md`
- **Setup Guide:** `docs/SETUP.md`
