-- ============================================================================
-- Miyara Brand Discovery - Database Schema
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- SESSIONS TABLE
-- Stores each brand discovery session
-- ============================================================================
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Session status
    status TEXT NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'completed', 'abandoned')),

    -- Current phase in the exercise
    current_phase TEXT NOT NULL DEFAULT 'OPENING'
        CHECK (current_phase IN (
            'OPENING',
            'RAPID_FIRE_INTRO',
            'RAPID_FIRE',
            'RAPID_FIRE_DEBRIEF',
            'DEEP_DIVE',
            'SCENARIO',
            'SYNTHESIS',
            'REFINEMENT',
            'COMPLETE'
        )),

    -- Optional: user-provided info at start
    company_name TEXT,
    user_name TEXT,

    -- Session metadata
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    duration_seconds INTEGER
);

-- ============================================================================
-- CONVERSATION_MESSAGES TABLE
-- Stores the full conversation history
-- ============================================================================
CREATE TABLE conversation_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),

    -- Message details
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,

    -- For assistant messages, store the full response
    response_data JSONB,

    -- Ordering
    sequence_number INTEGER NOT NULL
);

CREATE INDEX idx_messages_session ON conversation_messages(session_id);
CREATE INDEX idx_messages_sequence ON conversation_messages(session_id, sequence_number);

-- ============================================================================
-- RAPID_FIRE_RESPONSES TABLE
-- Stores user responses to value word prompts
-- ============================================================================
CREATE TABLE rapid_fire_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),

    -- The value word presented
    value_word TEXT NOT NULL,

    -- User's response
    response TEXT NOT NULL CHECK (response IN ('yes', 'no', 'maybe')),

    -- Optional: track hesitation time (milliseconds)
    response_time_ms INTEGER,

    -- Order in which it was presented
    sequence_number INTEGER NOT NULL
);

CREATE INDEX idx_rapid_fire_session ON rapid_fire_responses(session_id);

-- ============================================================================
-- IDENTIFIED_VALUES TABLE
-- Stores the values identified during the session
-- ============================================================================
CREATE TABLE identified_values (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- The value
    value_name TEXT NOT NULL,

    -- Personalized definition (from user's own words)
    personalized_definition TEXT,

    -- What this means in practice
    in_practice TEXT,

    -- Anti-pattern: what we won't do
    anti_pattern TEXT,

    -- Supporting quotes from the user
    user_quotes JSONB DEFAULT '[]'::JSONB,

    -- Confidence/strength (1-5)
    confidence_score INTEGER DEFAULT 3 CHECK (confidence_score BETWEEN 1 AND 5),

    -- Is this a final value (included in deliverable)?
    is_final BOOLEAN DEFAULT FALSE,

    -- Order for display
    display_order INTEGER
);

CREATE INDEX idx_values_session ON identified_values(session_id);

-- ============================================================================
-- DELIVERABLES TABLE
-- Stores the final generated deliverable
-- ============================================================================
CREATE TABLE deliverables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),

    -- The rendered deliverable content
    content JSONB NOT NULL,

    -- PDF URL if generated
    pdf_url TEXT,

    -- Shareable link slug
    share_slug TEXT UNIQUE
);

CREATE INDEX idx_deliverables_session ON deliverables(session_id);
CREATE INDEX idx_deliverables_slug ON deliverables(share_slug);

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sessions_updated_at
    BEFORE UPDATE ON sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER values_updated_at
    BEFORE UPDATE ON identified_values
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- For MVP with anonymous access, we'll use permissive policies
-- ============================================================================

ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE rapid_fire_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE identified_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliverables ENABLE ROW LEVEL SECURITY;

-- Permissive policies for anonymous access (MVP)
-- In production, you'd want proper authentication
CREATE POLICY "Allow all for sessions" ON sessions FOR ALL USING (true);
CREATE POLICY "Allow all for messages" ON conversation_messages FOR ALL USING (true);
CREATE POLICY "Allow all for rapid_fire" ON rapid_fire_responses FOR ALL USING (true);
CREATE POLICY "Allow all for values" ON identified_values FOR ALL USING (true);
CREATE POLICY "Allow all for deliverables" ON deliverables FOR ALL USING (true);
