import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getUserUsageStats } from '@/lib/db/queries';

interface UsageChartProps {
  userId: string;
}

export async function UsageChart({ userId }: UsageChartProps) {
  let usageStats: any[] = [];
  
  try {
    usageStats = await getUserUsageStats(userId, 7); // Last 7 days
  } catch (error) {
    console.error('Error loading usage stats:', error);
    usageStats = [];
  }

  // ตรวจสอบว่าเป็น array และมีข้อมูล
  if (!Array.isArray(usageStats)) {
    usageStats = [];
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const maxRequests = usageStats.length > 0 ? Math.max(...usageStats.map(stat => stat.requests || 0), 1) : 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage (Last 7 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        {usageStats.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No usage data available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {usageStats.map((stat) => (
              <div key={stat.date} className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <span className="text-sm font-medium w-16">
                    {formatDate(stat.date)}
                  </span>
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className="bg-primary rounded-full h-2"
                      style={{ 
                        width: `${(stat.requests / maxRequests) * 100}%` 
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-muted-foreground">
                    {stat.requests || 0} req
                  </span>
                  <span className="text-muted-foreground">
                    {stat.creditsUsed || 0} credits
                  </span>
                  <span className="text-green-600">
                    {(stat.successRate || 0).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}