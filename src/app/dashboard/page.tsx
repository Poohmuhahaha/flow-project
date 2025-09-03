import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/db/auth-db/auth-utils-server';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DashboardStats } from '@/components/dashboard/dashboard-stats';
import { ApiKeysSection } from '@/components/dashboard/api-keys-section';
import { UsageChart } from '@/components/dashboard/usage-chart';
import { RecentActivity } from '@/components/dashboard/recent-activity';

export default async function DashboardPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-muted-choice">
      <DashboardHeader user={user} />
      
      <main className="container mx-auto py-8 px-4">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user.firstName}!</h1>
            <p className="text-muted-foreground mt-2">
              Manage your API keys, monitor usage, and track your logistics data.
            </p>
          </div>

          {/* Stats Overview */}
          <DashboardStats userId={user.id} />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* API Keys Management */}
            <div className="space-y-6">
              <ApiKeysSection userId={user.id} />
            </div>

            {/* Usage Analytics */}
            <div className="space-y-6">
              <UsageChart userId={user.id} />
              <RecentActivity userId={user.id} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}