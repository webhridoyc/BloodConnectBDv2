'use server';
/**
 * @fileOverview This file defines the AI Matching Tool flow for matching blood donors and requesters.
 *
 * - aiMatchingTool - A function that handles the AI matching process.
 * - AiMatchingToolInput - The input type for the aiMatchingTool function.
 * - AiMatchingToolOutput - The return type for the aiMatchingTool function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiMatchingToolInputSchema = z.object({
  bloodRequest: z.object({
    patientName: z.string().describe('Patient name'),
    requesterName: z.string().describe('Requester name'),
    bloodGroup: z.string().describe('Blood group of the patient (e.g., A+, O-, B+)'),
    location: z.string().describe('Location where blood is needed'),
    contactInfo: z.string().describe('Contact information of the requester'),
    urgency: z.string().describe('Urgency level of the request (e.g., high, medium, low)'),
    notes: z.string().describe('Additional notes or information about the request'),
  }).describe('Blood request details'),
  donors: z.array(z.object({
    fullName: z.string().describe('Full name of the donor'),
    bloodGroup: z.string().describe('Blood group of the donor (e.g., A+, O-, B+)'),
    location: z.string().describe('Location of the donor'),
    contactNumber: z.string().describe('Contact number of the donor'),
  })).describe('List of available blood donors'),
});

export type AiMatchingToolInput = z.infer<typeof AiMatchingToolInputSchema>;

const AiMatchingToolOutputSchema = z.array(z.object({
  donorName: z.string().describe('Name of the potential donor'),
  matchReason: z.string().describe('Reason for the match (e.g., blood group compatibility, location proximity, urgency)'),
  contactNumber: z.string().describe('Contact number of the donor'),
})).describe('List of potential donor matches with reasons.');

export type AiMatchingToolOutput = z.infer<typeof AiMatchingToolOutputSchema>;

export async function aiMatchingTool(input: AiMatchingToolInput): Promise<AiMatchingToolOutput> {
  return aiMatchingToolFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiMatchingToolPrompt',
  input: {schema: AiMatchingToolInputSchema},
  output: {schema: AiMatchingToolOutputSchema},
  prompt: `You are an AI assistant specialized in matching blood donors with blood requests.

Given the following blood request:

Patient Name: {{{bloodRequest.patientName}}}
Requester Name: {{{bloodRequest.requesterName}}}
Blood Group: {{{bloodRequest.bloodGroup}}}
Location: {{{bloodRequest.location}}}
Contact Info: {{{bloodRequest.contactInfo}}}
Urgency: {{{bloodRequest.urgency}}}
Notes: {{{bloodRequest.notes}}}

And the following list of potential donors:

{{#each donors}}
- Name: {{{fullName}}}, Blood Group: {{{bloodGroup}}}, Location: {{{location}}}, Contact Number: {{{contactNumber}}}
{{/each}}

Identify potential donor matches based on blood group compatibility, location proximity, and request urgency. Provide a list of potential donor matches with reasons for each match, and the contact number of the donor.

Consider blood group compatibility (e.g., O- can donate to all, A+ can donate to A+ and AB+), location proximity (closer is better), and request urgency (high urgency should be prioritized).

Format your response as a JSON array of objects, where each object has the following fields:
- donorName: string (Name of the potential donor)
- matchReason: string (Reason for the match)
- contactNumber: string (Contact number of the donor)
`,
});

const aiMatchingToolFlow = ai.defineFlow(
  {
    name: 'aiMatchingToolFlow',
    inputSchema: AiMatchingToolInputSchema,
    outputSchema: AiMatchingToolOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
