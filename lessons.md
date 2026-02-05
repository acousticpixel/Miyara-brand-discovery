# Lessons Learned - Miyara Brand Discovery

## Technical Lessons

### Speech Recognition

**Problem**: Deepgram WebSocket connections kept failing with 1006 errors in the browser.

**Root Cause**: The Deepgram SDK uses the same subprotocol-based authentication in the browser that works server-side, but browser WebSocket security restrictions cause issues.

**Solution**: Replaced Deepgram entirely with the browser-native Web Speech API (`window.SpeechRecognition` / `webkitSpeechRecognition`). It's free, requires no API keys, and works reliably in Chrome/Edge.

**Lesson**: Don't fight against browser security restrictions. Native APIs often work better than third-party services for browser-based features.

---

### Transcript Completion Timing

**Problem**: The `onspeechend` event from Web Speech API fired unreliably, sometimes too early (mid-sentence) or not at all.

**Solution**: Implemented debounce-based auto-send - after 1.8 seconds of silence, automatically send the accumulated transcript to the AI.

**Lesson**: Don't rely on single events for state transitions. Use time-based thresholds as a more reliable signal.

---

### AI Phase Transitions

**Problem**: The AI agent would get stuck in SYNTHESIS phase, never progressing to COMPLETE to generate the deliverable.

**Root Cause**: The system prompt didn't explicitly tell the AI it controls phase transitions by setting `phase` in `stateUpdates`.

**Solution**: Added explicit `<phase_transition_rules>` section to the system prompt with clear instructions:
- "You control phase transitions by setting the 'phase' field"
- "The session will NOT progress unless you explicitly change the phase"
- Specific rules for when to move from SYNTHESIS → REFINEMENT → COMPLETE

**Lesson**: LLMs need explicit instructions about their responsibilities. Don't assume they'll infer control flow from context.

---

### State Reconstruction

**Problem**: The orchestrator's state wasn't being properly reconstructed from the database on each API request (stateless architecture).

**Solution**: Carefully reconstruct all derived state flags (like `synthesisDelivered`) when loading session from database:
```typescript
synthesisDelivered: session.current_phase === 'SYNTHESIS' ||
                    session.current_phase === 'REFINEMENT' ||
                    session.current_phase === 'COMPLETE'
```

**Lesson**: In stateless architectures, be explicit about deriving state from persisted data. Test state reconstruction paths.

---

### Avatar State Blocking

**Problem**: After the AI responded, users couldn't speak again because `avatarState` stayed as 'speaking'.

**Root Cause**: The code set `avatarState` to 'speaking' when AI responded, but without audio playback, it never reset to 'idle'.

**Solution**: Since there's no audio playback, immediately set `avatarState` to 'idle' after AI response.

**Lesson**: Trace the full state lifecycle. If a state is set, ensure there's always a path to transition out of it.

---

## Architecture Lessons

### Separation of Concerns

The agent architecture works well with clear separation:
- `system-prompt.ts` - AI persona and instructions
- `orchestrator.ts` - Conversation flow control
- `state-machine.ts` - State transitions and validation
- `response-parser.ts` - JSON parsing and validation

**Lesson**: Keep AI-related code modular. The prompt, orchestration, and parsing are distinct concerns.

---

### Structured AI Output

Requiring JSON output from the AI with a defined schema (`AgentResponse`) makes the system predictable:
- Spoken response for the user
- Internal notes for debugging
- State updates for the application
- UI actions for the frontend

**Lesson**: Structured output > free-form text when AI needs to drive application state.

---

## Process Lessons

### Debugging Voice Applications

Voice apps are hard to debug because:
- Transcripts are ephemeral
- Timing matters (pauses, interruptions)
- Browser permissions add complexity

**Solution**: Add generous logging, show live transcript preview in UI, and use text input as a fallback for testing.

---

### Iterative Prompt Engineering

The system prompt evolved significantly:
1. Started with basic persona
2. Added session structure
3. Added facilitation rules
4. Added phase transition rules (critical fix)

**Lesson**: Treat the system prompt as code - iterate based on observed behavior, be explicit about edge cases.
## NOTES FOR NEXT SESSION
- Need to define Exercise interface before adding new exercises
- Visual consistency needs work - lock design tokens
