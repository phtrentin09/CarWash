import { AppShell } from '@/components/app-shell';
import { ProfileClient } from '@/components/profile-client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function ProfilePage() {
  return (
    <AppShell>
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">User Profile</h2>
            </div>
            <ProfileClient />
        </div>
    </AppShell>
  );
}
