/**
 * Values Discovery Deliverable Generator
 *
 * Generates the deliverable section for the Values Discovery exercise.
 */

import type { ExerciseState, DeliverableSection, ValuesDiscoveryData } from '../types';

/**
 * Generate the deliverable section for Values Discovery.
 * This creates the "Core Values" section of the final brand guide.
 */
export function generateDeliverableSection(
  state: ExerciseState
): DeliverableSection {
  const data = state.data as ValuesDiscoveryData;
  const { identifiedValues, insights } = data;

  // Build markdown content
  let content = '';

  // Values section
  if (identifiedValues.length > 0) {
    identifiedValues.forEach((value, index) => {
      content += `### ${index + 1}. ${value.name}\n\n`;

      if (value.definition) {
        content += `${value.definition}\n\n`;
      }

      if (value.quotes.length > 0) {
        content += `**In your words:**\n`;
        value.quotes.forEach((quote) => {
          content += `> "${quote}"\n\n`;
        });
      }

      content += '\n';
    });
  } else {
    content += '*Values will be identified during your session.*\n\n';
  }

  // Insights section (if any notable insights were captured)
  if (insights.length > 0) {
    content += `---\n\n`;
    content += `### Key Insights\n\n`;
    insights.slice(0, 5).forEach((insight) => {
      content += `- ${insight}\n`;
    });
  }

  return {
    title: 'Core Values',
    subtitle: 'The principles that guide your brand',
    content,
    order: 1, // First section in deliverable
    metadata: {
      exerciseId: 'values-discovery',
      valueCount: identifiedValues.length,
      completedAt: new Date().toISOString(),
    },
  };
}

/**
 * Generate a summary of values for display.
 */
export function generateValuesSummary(state: ExerciseState): string {
  const data = state.data as ValuesDiscoveryData;
  const { identifiedValues } = data;

  if (identifiedValues.length === 0) {
    return 'No values identified yet.';
  }

  const valueNames = identifiedValues.map((v) => v.name);
  if (valueNames.length === 1) {
    return valueNames[0];
  }
  if (valueNames.length === 2) {
    return `${valueNames[0]} and ${valueNames[1]}`;
  }
  const last = valueNames.pop();
  return `${valueNames.join(', ')}, and ${last}`;
}

/**
 * Generate markdown for a single value (for preview/sharing).
 */
export function generateValueMarkdown(value: {
  name: string;
  definition?: string;
  quotes: string[];
}): string {
  let md = `## ${value.name}\n\n`;

  if (value.definition) {
    md += `${value.definition}\n\n`;
  }

  if (value.quotes.length > 0) {
    md += `### What this means for your brand:\n\n`;
    value.quotes.forEach((quote) => {
      md += `> "${quote}"\n\n`;
    });
  }

  return md;
}
