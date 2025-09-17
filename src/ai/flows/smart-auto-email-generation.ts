'use server';
/**
 * @fileOverview An AI agent that automatically generates draft emails with relevant attachments for communication with providers and verification centers.
 *
 * - smartAutoEmailGeneration - A function that handles the email generation process.
 * - SmartAutoEmailGenerationInput - The input type for the smartAutoEmailGeneration function.
 * - SmartAutoEmailGenerationOutput - The return type for the smartAutoEmailGeneration function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartAutoEmailGenerationInputSchema = z.object({
  recipientType: z
    .enum(['provider', 'verificationCenter'])
    .describe('The type of recipient for the email.'),
  recipientName: z.string().describe('The name of the recipient.'),
  subject: z.string().describe('The subject of the email.'),
  context: z
    .string()
    .describe(
      'The context or reason for the email, providing necessary details for the email generation.'
    ),
  relevantAttachments: z
    .array(z.string())
    .optional()
    .describe(
      'A list of relevant attachments to include with the email, specified as data URIs that must include a MIME type and use Base64 encoding. Expected format: data:<mimetype>;base64,<encoded_data>.'
    ),
});
export type SmartAutoEmailGenerationInput = z.infer<typeof SmartAutoEmailGenerationInputSchema>;

const SmartAutoEmailGenerationOutputSchema = z.object({
  emailDraft: z.string().describe('The generated email draft, ready for review and sending.'),
});
export type SmartAutoEmailGenerationOutput = z.infer<typeof SmartAutoEmailGenerationOutputSchema>;

export async function smartAutoEmailGeneration(
  input: SmartAutoEmailGenerationInput
): Promise<SmartAutoEmailGenerationOutput> {
  // return smartAutoEmailGenerationFlow(input);
  console.log('Simulating smartAutoEmailGeneration with input:', input);

  let draft = `Dear ${input.recipientName},\n\n`;
  draft += `${input.context}\n Please <a href="{{{applicationFormLink}}}">click here to view your application</a>. \n\n`;
  draft += `Thank you,\nCredentialing Department`;

  return {
    emailDraft: draft
  };
}

const prompt = ai.definePrompt({
  name: 'smartAutoEmailGenerationPrompt',
  input: {schema: SmartAutoEmailGenerationInputSchema},
  output: {schema: SmartAutoEmailGenerationOutputSchema},
  prompt: `You are an AI assistant specializing in drafting emails for credentialing specialists.

  Based on the provided context, recipient type, and any relevant attachments, generate a professional and informative email draft.

  Recipient Type: {{{recipientType}}}
  Recipient Name: {{{recipientName}}}
  Subject: {{{subject}}}
  Context: {{{context}}}
  {{#if relevantAttachments}}
  Relevant Attachments:
  {{#each relevantAttachments}}
  - {{media url=this}}
  {{/each}}
  {{/if}}

  Please provide a complete email draft that addresses the context and is ready for the specialist to review and send. 
  Make sure the you proivde the placeholder for the link to applicaiton form as {{{applicationFormLink}}}. `,
});

const smartAutoEmailGenerationFlow = ai.defineFlow(
  {
    name: 'smartAutoEmailGenerationFlow',
    inputSchema: SmartAutoEmailGenerationInputSchema,
    outputSchema: SmartAutoEmailGenerationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
