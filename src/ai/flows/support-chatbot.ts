'use server';

/**
 * @fileOverview A support chatbot AI agent.
 *
 * - supportChatbot - A function that handles the support chatbot process.
 * - SupportChatbotInput - The input type for the supportChatbot function.
 * - SupportChatbotOutput - The return type for the supportChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SupportChatbotInputSchema = z.object({
  question: z.string().describe('The user\u0027s question about the app\u0027s features.'),
});
export type SupportChatbotInput = z.infer<typeof SupportChatbotInputSchema>;

const SupportChatbotOutputSchema = z.object({
  answer: z.string().describe('The answer to the user\u0027s question.'),
});
export type SupportChatbotOutput = z.infer<typeof SupportChatbotOutputSchema>;

export async function supportChatbot(input: SupportChatbotInput): Promise<SupportChatbotOutput> {
  return supportChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'supportChatbotPrompt',
  input: {schema: SupportChatbotInputSchema},
  output: {schema: SupportChatbotOutputSchema},
  prompt: `You are a support chatbot for the BloodLink BD app. Answer the user's questions about the app's features.

Question: {{{question}}}`,
});

const supportChatbotFlow = ai.defineFlow(
  {
    name: 'supportChatbotFlow',
    inputSchema: SupportChatbotInputSchema,
    outputSchema: SupportChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
