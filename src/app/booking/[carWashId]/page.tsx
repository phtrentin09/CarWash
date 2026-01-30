import { AppShell } from '@/components/app-shell';
import BookingForm from '@/components/booking-form';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function BookingSkeleton() {
    return (
        <div className="p-4 md:p-8">
            <Skeleton className="h-96 w-full max-w-2xl mx-auto" />
        </div>
    )
}

export default function BookingPage({ params }: { params: { carWashId: string } }) {
  return (
    <AppShell>
      <Suspense fallback={<BookingSkeleton />}>
        <BookingForm carWashId={params.carWashId} />
      </Suspense>
    </AppShell>
  );
}
