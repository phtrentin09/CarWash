'use server';

/**
 * @fileOverview Recommends the best times to visit car washes based on historical data.
 *
 * - `recommendBestTimes` - A function that recommends the best times to visit car washes.
 * - `SmartScheduleRecommendationInput` - The input type for the `recommendBestTimes` function.
 * - `SmartScheduleRecommendationOutput` - The return type for the `recommendBestTimes` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartScheduleRecommendationInputSchema = z.object({
  dayOfWeek: z
    .string()
    .describe("The day of the week the user wants to visit the car wash."),
  timeOfDay: z
    .string()
    .describe("The time of day the user wants to visit the car wash."),
  historicalData: z
    .string()
    .describe("Historical data about car wash congestion, including day of week and time of day."),
});
export type SmartScheduleRecommendationInput = z.infer<
  typeof SmartScheduleRecommendationInputSchema
>;

const SmartScheduleRecommendationOutputSchema = z.object({
  recommendedTimes: z
    .string()
    .describe("The best times to visit the car wash to avoid peak congestion."),
  reasoning: z.string().describe("The reasoning behind the recommendation."),
});
export type SmartScheduleRecommendationOutput = z.infer<
  typeof SmartScheduleRecommendationOutputSchema
>;

export async function recommendBestTimes(
  input: SmartScheduleRecommendationInput
): Promise<SmartScheduleRecommendationOutput> {
  return smartScheduleRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartScheduleRecommendationPrompt',
  input: {schema: SmartScheduleRecommendationInputSchema},
  output: {schema: SmartScheduleRecommendationOutputSchema},
  prompt: `You are an AI assistant specializing in recommending the best times to visit car washes based on historical congestion data.

  Given the following information, analyze the historical data and recommend the best times for the user to visit the car wash to avoid peak congestion.

  Day of Week: {{{dayOfWeek}}}
  Time of Day: {{{timeOfDay}}}
  Historical Data: {{{historicalData}}}

  Consider the user's preferred day and time, and suggest alternative times that are typically less busy. Explain your reasoning for the recommendation.
  Format your output as a JSON object with 'recommendedTimes' and 'reasoning' fields.
  `,
});

const smartScheduleRecommendationFlow = ai.defineFlow(
  {
    name: 'smartScheduleRecommendationFlow',
    inputSchema: SmartScheduleRecommendationInputSchema,
    outputSchema: SmartScheduleRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
