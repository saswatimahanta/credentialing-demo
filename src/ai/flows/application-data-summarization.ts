'use server';

/**
 * @fileOverview Summarizes issues and analyst history/comments within an application.
 *
 * - summarizeApplicationData - A function that handles the application data summarization process.
 * - SummarizeApplicationDataInput - The input type for the summarizeApplicationData function.
 * - SummarizeApplicationDataOutput - The return type for the summarizeApplicationData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeApplicationDataInputSchema = z.object({
  applicationDetails: z
    .string()
    .describe('The full details of the application, including all fields and uploaded documents.'),
  analystComments: z
    .string()
    .describe('The history of analyst comments and actions taken on the application.'),
});
export type SummarizeApplicationDataInput = z.infer<typeof SummarizeApplicationDataInputSchema>;

const SummarizeApplicationDataOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A concise summary of the key issues identified in the application and a summary of the analyst history/comments.'
    ),
});
export type SummarizeApplicationDataOutput = z.infer<typeof SummarizeApplicationDataOutputSchema>;

export async function summarizeApplicationData(
  input: SummarizeApplicationDataInput
): Promise<SummarizeApplicationDataOutput> {
  // return summarizeApplicationDataFlow(input);
  console.log('Simulating summarizeApplicationData with input:', input);
  return {
    summary: 'The application has three detected issues: a ZIP code mismatch, an unverified NPI, and a 3-month gap in employment history. Analysts have started the review and assigned it for verification.'
  };
}

const summarizeApplicationDataPrompt = ai.definePrompt({
  name: 'summarizeApplicationDataPrompt',
  input: {schema: SummarizeApplicationDataInputSchema},
  output: {schema: SummarizeApplicationDataOutputSchema},
  prompt: `You are an AI assistant helping application reviewers quickly understand key issues in an application and analyst history.

  Summarize the following application details and analyst comments into a concise summary that highlights the main problems and important actions taken by analysts.

  Application Details: {{{applicationDetails}}}
  Analyst Comments: {{{analystComments}}}

  Summary: `,
});

const summarizeApplicationDataFlow = ai.defineFlow(
  {
    name: 'summarizeApplicationDataFlow',
    inputSchema: SummarizeApplicationDataInputSchema,
    outputSchema: SummarizeApplicationDataOutputSchema,
  },
  async input => {
    const {output} = await summarizeApplicationDataPrompt(input);
    return output!;
  }
);
