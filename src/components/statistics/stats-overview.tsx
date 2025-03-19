'use client';

import { ClipboardList, Clock, Users, HelpCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatsOverviewProps {
  totalQuestionnaires: number;
  totalResponses: number;
  totalQuestions: number;
  averageCompletionTime: number; 
}

export default function StatsOverview({
  totalQuestionnaires,
  totalResponses,
  totalQuestions,
  averageCompletionTime,
}: StatsOverviewProps) {
  const formatTime = (seconds: number) => {
    if (seconds === 0) return 'N/A';
    
    if (seconds < 60) {
      return `${seconds.toFixed(0)} seconds`;
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Questionnaires</CardTitle>
          <ClipboardList className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalQuestionnaires}</div>
          <p className="text-xs text-muted-foreground">
            {totalQuestions} questions created
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalResponses}</div>
          <p className="text-xs text-muted-foreground">
            {totalResponses > 0 
              ? `~${(totalResponses / totalQuestionnaires).toFixed(1)} responses per questionnaire`
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
            Across all responses
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
          <HelpCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalResponses > 0 && totalQuestions > 0
              ? `${(totalResponses / totalQuestions).toFixed(2)}`
              : 'N/A'
            }
          </div>
          <p className="text-xs text-muted-foreground">
            Responses per question
          </p>
        </CardContent>
      </Card>
    </div>
  );
}