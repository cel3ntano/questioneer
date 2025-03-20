'use client';

import { Clock, Users, BarChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';

interface StatsOverviewProps {
  totalResponses: number;
  averageCompletionTime: number;
  latestCompletion?: Date;
}

export default function StatsOverview({
  totalResponses,
  averageCompletionTime,
  latestCompletion,
}: StatsOverviewProps) {
  const formatTime = (seconds: number) => {
    if (seconds < 60) {
      return `${Math.round(seconds)} seconds`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.round(seconds % 60);
      return `${minutes} min${minutes !== 1 ? 's' : ''} ${remainingSeconds > 0 ? `${remainingSeconds} sec` : ''}`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes > 0 ? `${minutes} min` : ''}`;
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalResponses}</div>
          <p className="text-xs text-muted-foreground">
            {latestCompletion 
              ? `Last response ${formatDistanceToNow(new Date(latestCompletion), { addSuffix: true })}` 
              : 'No responses yet'}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Completion Time</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatTime(averageCompletionTime)}</div>
          <p className="text-xs text-muted-foreground">
            Based on {totalResponses} completion{totalResponses !== 1 ? 's' : ''}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Question Insights</CardTitle>
          <BarChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalResponses > 0 ? 'Available' : 'No Data'}
          </div>
          <p className="text-xs text-muted-foreground">
            {totalResponses > 0 
              ? 'Scroll down to see question statistics' 
              : 'Waiting for responses to show insights'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}