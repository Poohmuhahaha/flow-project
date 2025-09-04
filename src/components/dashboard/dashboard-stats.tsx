import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Key, Activity, TrendingUp } from 'lucide-react';
import { getUserApiKeys, getUserUsageStats } from '@/lib/db/queries';
import { getCurrentUser } from '@/lib/db/auth-db/auth-utils-server';

interface DashboardStatsProps {
  userId: string;
}

export async function DashboardStats({ userId }: DashboardStatsProps) {
  const user = await getCurrentUser();
  
  let apiKeys: any[] = [];
  let usageStats: any[] = [];
  
  try {
    apiKeys = await getUserApiKeys(userId);
  } catch (error) {
    console.error('Failed to fetch API keys:', error);
    apiKeys = [];
  }
  
  try {
    usageStats = await getUserUsageStats(userId, 30);
  } catch (error) {
    console.error('Failed to fetch usage stats:', error);
    usageStats = [];
  }

  const activeApiKeys = Array.isArray(apiKeys) ? apiKeys.filter(key => key.isActive).length : 0;
  const totalRequests = Array.isArray(usageStats) ? usageStats.reduce((sum, stat) => sum + (stat.requests || 0), 0) : 0;
  const totalCreditsUsed = Array.isArray(usageStats) ? usageStats.reduce((sum, stat) => sum + (stat.creditsUsed || 0), 0) : 0;
  const avgSuccessRate = Array.isArray(usageStats) && usageStats.length > 0 
    ? usageStats.reduce((sum, stat) => sum + (stat.successRate || 0), 0) / usageStats.length 
    : 0;

  const stats = [
    {
      title: 'Available Credits',
      value: (user?.credits || 0).toLocaleString(),
      icon: CreditCard,
      description: 'Credits remaining',
      color: 'text-green-600',
    },
    {
      title: 'Active API Keys',
      value: activeApiKeys.toString(),
      icon: Key,
      description: `${Array.isArray(apiKeys) ? apiKeys.length : 0} total keys`,
      color: 'text-blue-600',
    },
    {
      title: 'Requests (30d)',
      value: totalRequests.toLocaleString(),
      icon: Activity,
      description: `${totalCreditsUsed} credits used`,
      color: 'text-purple-600',
    },
    {
      title: 'Success Rate',
      value: `${avgSuccessRate.toFixed(1)}%`,
      icon: TrendingUp,
      description: 'Last 30 days',
      color: avgSuccessRate >= 95 ? 'text-green-600' : avgSuccessRate >= 90 ? 'text-yellow-600' : 'text-red-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const IconComponent = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <IconComponent className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}