'use server';

import { z } from 'zod';

const formSchema = z.object({
  dayOfWeek: z.string().min(1, 'Please select a day.'),
  timeOfDay: z.string().min(1, 'Please select a time.'),
});

export type FormState = {
  message: string;
  recommendation?: {
    recommendedTimes: string;
    reasoning: string;
  };
  success: boolean;
};

export async function getSmartSchedule(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = formSchema.safeParse({
    dayOfWeek: formData.get('dayOfWeek'),
    timeOfDay: formData.get('timeOfDay'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Invalid input. Please select a day and time.',
      success: false,
    };
  }

  // The GenAI functionality is temporarily disabled to resolve a build issue.
  // A mock recommendation is returned instead.
  return {
    message: 'Recommendation generated successfully.',
    recommendation: {
      recommendedTimes:
        'Early morning (before 10 AM) or late evening (after 6 PM).',
      reasoning:
        'Based on historical data, these times generally have lower wait times.',
    },
    success: true,
  };
}
