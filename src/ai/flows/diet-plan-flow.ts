
'use server';
/**
 * @fileOverview Generates a diet plan based on a physical activity and dietary preference.
 *
 * - getDietPlan - A function that generates a diet plan.
 * - DietPlanInput - The input type for the getDietPlan function.
 * - DietPlan - The return type for the getDietPlan function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const DietPlanInputSchema = z.object({
  activityName: z.string().describe('The name of the physical activity, e.g., Yoga, Bharatanatyam.'),
  dietaryPreference: z.string().describe("The user's dietary preference, e.g., Vegetarian, Vegan, High-Protein."),
});
export type DietPlanInput = z.infer<typeof DietPlanInputSchema>;

const DietPlanSchema = z.object({
    meals: z.object({
        Breakfast: z.object({
            time: z.string().describe("Suggested time for the meal, e.g., 8:00 AM"),
            items: z.array(z.string()).describe("A list of 2-3 food items for breakfast."),
            reasoning: z.string().describe("A brief explanation of why these food choices are suitable for the activity."),
        }),
        Lunch: z.object({
            time: z.string().describe("Suggested time for the meal, e.g., 1:00 PM"),
            items: z.array(z.string()).describe("A list of 2-3 food items for lunch."),
            reasoning: z.string().describe("A brief explanation of why these food choices are suitable for the activity."),
        }),
        Snacks: z.object({
            time: z.string().describe("Suggested time for the meal, e.g., 4:30 PM"),
            items: z.array(z.string()).describe("A list of 1-2 healthy snack items."),
            reasoning: z.string().describe("A brief explanation of why these food choices are suitable for the activity."),
        }),
        Dinner: z.object({
            time: z.string().describe("Suggested time for the meal, e.g., 7:30 PM"),
            items: z.array(z.string()).describe("A list of 2-3 food items for a light dinner."),
            reasoning: z.string().describe("A brief explanation of why these food choices are suitable for the activity."),
        }),
    }),
});
export type DietPlan = z.infer<typeof DietPlanSchema>;

export async function getDietPlan(input: DietPlanInput): Promise<DietPlan | null> {
  return generateDietPlanFlow(input);
}

const dietPlanPrompt = ai.definePrompt({
  name: 'dietPlanPrompt',
  input: { schema: DietPlanInputSchema },
  output: { schema: DietPlanSchema },
  prompt: `You are a professional nutritionist specializing in diet plans for athletes and artists in India.
  
  Generate a simple, balanced, one-day sample diet plan for a person who actively practices {{activityName}}.
  
  The diet plan must follow a strict {{dietaryPreference}} preference.
  
  The diet should be healthy, providing sustained energy. Focus on whole foods commonly available in India.
  
  For each meal (Breakfast, Lunch, Snacks, Dinner), provide 2-3 food item suggestions and a short, simple reasoning (1-2 sentences) explaining how it helps the practitioner of {{activityName}}.
  
  For example, for a Yoga practitioner, you might suggest light, easily digestible foods. For a Kalaripayattu martial artist, you might suggest foods for muscle recovery and stamina.`,
});

const generateDietPlanFlow = ai.defineFlow(
  {
    name: 'generateDietPlanFlow',
    inputSchema: DietPlanInputSchema,
    outputSchema: DietPlanSchema.nullable(),
  },
  async (input) => {
    const { output } = await dietPlanPrompt(input);
    return output;
  }
);
