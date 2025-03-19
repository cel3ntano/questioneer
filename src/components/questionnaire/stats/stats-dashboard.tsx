'use client';

import { useState, useEffect, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { QuestionnaireWithQuestions } from '@/types/questionnaire';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import StatsOverview from './stats-overview';
import CompletionChart from './completion-chart';
import AnswerDistribution from './answer-distribution';

interface StatsDashboardProps {
  questionnaire: QuestionnaireWithQuestions;
}

interface QuestionStat {
  questionId: string;
  questionText: string;
  questionType: string;
  answerDistribution: Array<{
    label: string;
    value: number;
  }>;
}

interface StatsData {
  totalResponses: number;
  averageCompletionTime: number;
  dailyCompletions: Array<{
    date: string;
    count: number;
  }>;
  weeklyCompletions: Array<{
    week: string;
    count: number;
  }>;
  monthlyCompletions: Array<{
    month: string;
    count: number;
  }>;
  questionStats: QuestionStat[];
}

export default function StatsDashboard({ questionnaire }: StatsDashboardProps) {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/questionnaires/${questionnaire.id}/stats`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch statistics');
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching statistics:', err);
      setError('Failed to load statistics. Please try again.');
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  }, [questionnaire.id]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-destructive/15 p-4 text-destructive">
        <p>{error}</p>
        <Button variant="outline" onClick={fetchStats} className="mt-2">
          Try Again
        </Button>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const hasResponses = stats.totalResponses > 0;

  return (
    <div className="space-y-6">
      <StatsOverview
        totalResponses={stats.totalResponses}
        averageCompletionTime={stats.averageCompletionTime}
      />

      {hasResponses ? (
        <>
          <CompletionChart
            dailyData={stats.dailyCompletions}
            weeklyData={stats.weeklyCompletions}
            monthlyData={stats.monthlyCompletions}
          />

          <h2 className="text-xl font-semibold mt-8 mb-4">Question Analysis</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stats.questionStats.map((question) => (
              <AnswerDistribution
                key={question.questionId}
                questionText={question.questionText}
                questionType={question.questionType}
                data={question.answerDistribution}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="rounded-md bg-muted p-8 text-center">
          <h3 className="text-lg font-medium mb-2">
            No Response Data Available
          </h3>
          <p className="text-muted-foreground mb-4">
            Statistics will appear here once people start completing this
            questionnaire.
          </p>
          <Button asChild>
            <a href={`/questionnaires/${questionnaire.id}/run`}>
              Try the questionnaire
            </a>
          </Button>
        </div>
      )}
    </div>
  );
}
