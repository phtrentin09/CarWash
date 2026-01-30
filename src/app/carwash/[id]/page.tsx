import { AppShell } from '@/components/app-shell';
import CarWashDetails from '@/components/carwash-details';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function DetailsSkeleton() {
    return (
        <div className="p-4 md:p-8 space-y-6">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-6 w-3/4" />
            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-48 w-full" />
                </div>
                <div className="space-y-6">
                    <Skeleton className="h-96 w-full" />
                </div>
            </div>
        </div>
    )
}

export default function CarWashDetailsPage({ params }: { params: { id: string } }) {
  return (
    <AppShell>
      <Suspense fallback={<DetailsSkeleton />}>
        <CarWashDetails carWashId={params.id} />
      </Suspense>
    </AppShell>
  );
}
