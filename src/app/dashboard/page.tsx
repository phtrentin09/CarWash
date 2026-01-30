import { ClientDashboard } from '@/components/client-dashboard';
import { AppShell } from '@/components/app-shell';

export default function DashboardPage() {
  return (
    <AppShell>
      <ClientDashboard />
    </AppShell>
  );
}
