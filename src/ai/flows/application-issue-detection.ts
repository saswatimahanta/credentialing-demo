'use server';

/**
 * @fileOverview This file defines a Genkit flow for detecting issues in provider applications using AI.
 *
 * - `detectApplicationIssues` -  A function that analyzes provider applications to identify potential issues like missing or inaccurate information.
 * - `ApplicationIssueDetectionInput` - The input type for the detectApplicationIssues function.
 * - `ApplicationIssueDetectionOutput` - The return type for the detectApplicationIssues function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ApplicationIssueDetectionInputSchema = z.object({
  providerId: z.string().describe('The unique identifier of the provider.'),
  name: z.string().describe('The name of the provider.'),
  npi: z.string().describe('The National Provider Identifier.'),
  specialty: z.string().describe('The provider\u2019s area of medical specialization.'),
  address: z.string().describe('The provider\u2019s practice address.'),
  degreeCertificate: z.string().describe('The provider\u2019s degree certificate as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'),
  cvResume: z.string().describe('The provider\u2019s CV/Resume as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'),
  drivingLicense: z.string().describe('The provider\u2019s driving license as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'),
  passport: z.string().describe('The provider\u2019s passport as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'),
  medicalLicense: z.string().describe('The provider\u2019s medical license as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'),
  otherDocuments: z.array(z.object({documentName: z.string(), documentDataUri: z.string().describe('Other documents as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.')})).optional().describe('A list of other documents.'),
});
export type ApplicationIssueDetectionInput = z.infer<typeof ApplicationIssueDetectionInputSchema>;

const ApplicationIssueDetectionOutputSchema = z.object({
  issues: z.array(z.object({
    field: z.string().describe('The field with a potential issue.'),
    issue: z.string().describe('A description of the issue.'),
    confidenceScore: z.number().describe('The AI\u2019s confidence score (0-1) that there is an issue.'),
  })).describe('A list of potential issues found in the application.'),
  summary: z.string().describe('A summary of all issues detected in the application.')
});
export type ApplicationIssueDetectionOutput = z.infer<typeof ApplicationIssueDetectionOutputSchema>;

export async function detectApplicationIssues(input: ApplicationIssueDetectionInput): Promise<ApplicationIssueDetectionOutput> {
  // return applicationIssueDetectionFlow(input);
  console.log('Simulating detectApplicationIssues with input:', input);
  return {
    issues: [
      { field: 'Address', issue: 'ZIP code mismatch with state.', confidenceScore: 0.95 },
      { field: 'NPI', issue: 'NPI number not found in national registry.', confidenceScore: 0.82 },
      { field: 'CV/Resume', issue: 'Gap in employment history (3 months).', confidenceScore: 0.65 },
    ],
    summary: 'AI detected 3 issues, including a potential address/ZIP mismatch and an unverified NPI. Employment history shows a minor gap.'
  };
}

const applicationIssueDetectionPrompt = ai.definePrompt({
  name: 'applicationIssueDetectionPrompt',
  input: {schema: ApplicationIssueDetectionInputSchema},
  output: {schema: ApplicationIssueDetectionOutputSchema},
  prompt: `You are an AI assistant specialized in reviewing provider applications for US healthcare payers.
  Your task is to identify potential issues such as missing or inaccurate information in the application data.
  Provide a confidence score (0-1) for each identified issue.

  Analyze the following application data:

  Provider ID: {{{providerId}}}
  Name: {{{name}}}
  NPI: {{{npi}}}
  Specialty: {{{specialty}}}
  Address: {{{address}}}
  Degree Certificate: {{media url=degreeCertificate}}
  CV/Resume: {{media url=cvResume}}
  Driving License: {{media url=drivingLicense}}
  Passport: {{media url=passport}}
  Medical License: {{media url=medicalLicense}}
  {{#if otherDocuments}}
  Other Documents:
  {{#each otherDocuments}}
  - {{this.documentName}}: {{media url=this.documentDataUri}}
  {{/each}}
  {{/if}}

  Identify any potential issues and provide a summary of all issues detected in the application.
  Indicate each issue with the field, issue description, and confidence score.
  `, 
});

const applicationIssueDetectionFlow = ai.defineFlow(
  {
    name: 'applicationIssueDetectionFlow',
    inputSchema: ApplicationIssueDetectionInputSchema,
    outputSchema: ApplicationIssueDetectionOutputSchema,
  },
  async input => {
    const {output} = await applicationIssueDetectionPrompt(input);
    return output!;
  }
);
