import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getUserUsage } from '@/lib/db/queries';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface RecentActivityProps {
  userId: string;
}

export async function RecentActivity({ userId }: RecentActivityProps) {
  let recentUsage: any[] = [];
  
  try {
    recentUsage = await getUserUsage(userId, 10); // Last 10 activities
  } catch (error) {
    console.error('Failed to fetch recent usage:', error);
    recentUsage = [];
  }

  // ตรวจสอบว่าเป็น array
  if (!Array.isArray(recentUsage)) {
    recentUsage = [];
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-100 text-green-800">Success</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'warning':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {recentUsage.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No recent activity</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentUsage.map((activity) => (
              <div 
                key={activity.id}
                className="flex items-start space-x-3 p-3 border rounded-lg"
              >
                {getStatusIcon(activity.status)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate">
                      {activity.endpoint}
                    </p>
                    {getStatusBadge(activity.status)}
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-muted-foreground">
                      {formatTime(activity.createdAt)}
                    </p>
                    <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                      <span>{activity.creditsUsed || 0} credits</span>
                      {activity.processingTime && (
                        <span>{activity.processingTime}ms</span>
                      )}
                    </div>
                  </div>
                  {activity.errorMessage && (
                    <p className="text-xs text-red-600 mt-1 truncate">
                      {activity.errorMessage}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}