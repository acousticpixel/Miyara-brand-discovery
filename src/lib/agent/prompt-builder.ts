// Assembles prompts with context for the agent

import type { AgentContext } from '@/types/agent';
import type { SessionState } from './state-machine';

export function buildContextMessage(context: AgentContext): string {
  const conversationHistory = context.conversationHistory
    .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
    .join('\n');

  const rapidFireSummary =
    context.rapidFireResponses.length > 0
      ? `
Rapid Fire Responses:
${context.rapidFireResponses.map((r) => `- ${r.word}: ${r.response}`).join('\n')}`
      : '';

  const valuesSummary =
    context.identifiedValues.length > 0
      ? `
Identified Values:
${context.identifiedValues.map((v) => `- ${v.name}${v.definition ? `: ${v.definition}` : ''}`).join('\n')}`
      : '';

  const exploredValues =
    context.deepDiveValuesExplored.length > 0
      ? `Values Already Explored in Deep Dive: ${context.deepDiveValuesExplored.join(', ')}`
      : '';

  return `
<session_context>
Current Phase: ${context.currentPhase}
${context.companyName ? `Company Name: ${context.companyName}` : ''}
${context.userName ? `User Name: ${context.userName}` : ''}
${rapidFireSummary}
${valuesSummary}
${exploredValues}
</session_context>

<conversation_history>
${conversationHistory}
</conversation_history>
`.trim();
}

export function buildUserMessage(
  context: AgentContext,
  userMessage: string
): string {
  const contextMessage = buildContextMessage(context);

  return `
${contextMessage}

<current_user_message>
${userMessage}
</current_user_message>
`.trim();
}

export function buildInitialMessage(
  companyName?: string,
  userName?: string
): string {
  const context = companyName
    ? `The founder's company is called "${companyName}".`
    : '';
  const greeting = userName ? `The founder's name is ${userName}.` : '';

  return `
<session_context>
Current Phase: OPENING
${context}
${greeting}
This is the start of the session. Deliver your opening greeting and first question.
</session_context>

<conversation_history>
(No previous messages - this is the session start)
</conversation_history>

<current_user_message>
[SESSION START - Deliver opening greeting]
</current_user_message>
`.trim();
}

export function contextFromState(
  state: SessionState,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>,
  sessionId: string,
  companyName?: string,
  userName?: string
): AgentContext {
  return {
    sessionId,
    currentPhase: state.phase,
    conversationHistory,
    rapidFireResponses: state.rapidFireResponses,
    identifiedValues: state.identifiedValues,
    deepDiveValuesExplored: state.deepDiveValuesExplored,
    companyName,
    userName,
  };
}
