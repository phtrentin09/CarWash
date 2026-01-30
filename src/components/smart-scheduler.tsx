'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { getSmartSchedule, type FormState } from '@/lib/actions';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, Loader2, Sparkles } from 'lucide-react';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

const initialState: FormState = {
  message: '',
  success: false,
};

const daysOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];
const timesOfDay = [
  'Morning (8am-12pm)',
  'Afternoon (12pm-4pm)',
  'Evening (4pm-8pm)',
];

export function SmartScheduler() {
  const [state, formAction] = useFormState(getSmartSchedule, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message && !state.success) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.message,
      });
    }
  }, [state, toast]);

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <form action={formAction}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-accent" />
            AI Smart Scheduler
          </CardTitle>
          <CardDescription>
            Tell us when you'd like to go, and our AI will recommend the best
            times to avoid the crowds based on historical data.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="dayOfWeek">Day of the Week</Label>
            <Select name="dayOfWeek" required>
              <SelectTrigger id="dayOfWeek">
                <SelectValue placeholder="Select a day" />
              </SelectTrigger>
              <SelectContent>
                {daysOfWeek.map((day) => (
                  <SelectItem key={day} value={day}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="timeOfDay">Time of Day</Label>
            <Select name="timeOfDay" required>
              <SelectTrigger id="timeOfDay">
                <SelectValue placeholder="Select a time" />
              </SelectTrigger>
              <SelectContent>
                {timesOfDay.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-4">
          <SubmitButton />

          {state.success && state.recommendation && (
            <Card className="w-full bg-secondary/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CheckCircle className="h-5 w-5 text-[hsl(var(--chart-2))]" />
                  AI Recommendation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="font-semibold text-foreground">
                  {state.recommendation.recommendedTimes}
                </p>
                <p className="text-muted-foreground">
                  {state.recommendation.reasoning}
                </p>
              </CardContent>
            </Card>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full md:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Analyzing...
        </>
      ) : (
        'Get Recommendation'
      )}
    </Button>
  );
}
