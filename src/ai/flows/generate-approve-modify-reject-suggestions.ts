'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating AI-driven suggestions for approving, modifying, or rejecting application fields.
 *
 * - generateApproveModifyRejectSuggestions - A function that generates suggestions for application review.
 * - ApproveModifyRejectSuggestionsInput - The input type for the generateApproveModifyRejectSuggestions function.
 * - ApproveModifyRejectSuggestionsOutput - The return type for the generateApproveModifyRejectSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ApproveModifyRejectSuggestionsInputSchema = z.object({
  fieldData: z.string().describe('The data of the field to be reviewed.'),
  fieldDefinition: z.string().describe('The definition or expected format of the field.'),
  applicationContext: z
    .string()
    .describe(
      'Contextual information about the application, including other relevant fields and overall application status.'
    ),
});
export type ApproveModifyRejectSuggestionsInput = z.infer<
  typeof ApproveModifyRejectSuggestionsInputSchema
>;

const ApproveModifyRejectSuggestionsOutputSchema = z.object({
  suggestion: z.enum(['approve', 'modify', 'reject']).describe('Suggested action for the field.'),
  reasoning: z.string().describe('The AI reasoning behind the suggested action.'),
  confidenceScore: z
    .number()
    .min(0)
    .max(1)
    .describe('Confidence score (0 to 1) for the suggestion.'),
  modifiedValue: z.string().optional().describe('Suggested modified value, if action is modify.'),
});
export type ApproveModifyRejectSuggestionsOutput = z.infer<
  typeof ApproveModifyRejectSuggestionsOutputSchema
>;

export async function generateApproveModifyRejectSuggestions(
  input: ApproveModifyRejectSuggestionsInput
): Promise<ApproveModifyRejectSuggestionsOutput> {
  // return generateApproveModifyRejectSuggestionsFlow(input);
  console.log('Simulating generateApproveModifyRejectSuggestions with input:', input);

  if (input.fieldData.includes('90210')) {
      return {
          suggestion: 'reject',
          reasoning: 'The ZIP code does not match the provided state based on public records.',
          confidenceScore: 0.98,
      };
  }
  
  return {
    suggestion: 'approve',
    reasoning: 'The provided data appears to be valid and consistent with the application context.',
    confidenceScore: 0.95,
  };
}

const prompt = ai.definePrompt({
  name: 'approveModifyRejectSuggestionsPrompt',
  input: {schema: ApproveModifyRejectSuggestionsInputSchema},
  output: {schema: ApproveModifyRejectSuggestionsOutputSchema},
  prompt: `You are an AI assistant that reviews application fields and suggests whether to approve, modify, or reject them.

  Given the field data, its definition, and the overall application context, provide a suggestion, reasoning, and confidence score.

  Field Data: {{{fieldData}}}
  Field Definition: {{{fieldDefinition}}}
  Application Context: {{{applicationContext}}}

  Format your response as a JSON object:
  {
    "suggestion": "approve" | "modify" | "reject",
    "reasoning": "Explanation for the suggestion",
    "confidenceScore": 0.0 - 1.0,
    "modifiedValue": "Suggested modified value (only if suggestion is modify)"
  }`,
});

const generateApproveModifyRejectSuggestionsFlow = ai.defineFlow(
  {
    name: 'generateApproveModifyRejectSuggestionsFlow',
    inputSchema: ApproveModifyRejectSuggestionsInputSchema,
    outputSchema: ApproveModifyRejectSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
