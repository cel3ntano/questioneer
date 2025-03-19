'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, Loader2, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import StatsOverview from '@/components/statistics/stats-overview';
import ActivityChart from '@/components/statistics/activity-chart';
import TopQuestionnaires from '@/components/statistics/top-questionnaires';
import QuestionTypes from '@/components/statistics/question-types';
import LatestResponses from '@/components/statistics/latest-responses';
import { QuestionType } from '@prisma/client';

interface StatisticsData {
  totalQuestionnaires: number;
  totalResponses: number;
  totalQuestions: number;
  averageCompletionTime: number;
  topQuestionnaires: Array<{
    id: string;
    name: string;
    responseCount: number;
  }>;
  questionTypeDistribution: Array<{
    type: string;
    count: number;
  }>;
  dailyActivity: Array<{
    date: string;
    count: number;
  }>;
  latestResponses: Array<{
    id: string;
    questionnaireId: string;
    questionnaireName: string;
    completionTime: number | null;
    createdAt: string;
  }>;
}

export default function StatisticsPage() {
  const [stats, setStats] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/statistics');

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
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center">
          <Button asChild variant="ghost" size="sm" className="mr-2">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Home
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            Global Statistics
          </h1>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchStats}
          disabled={loading}
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`}
          />
          Refresh
        </Button>
      </div>

      {loading && !stats ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="rounded-md bg-destructive/15 p-4 text-destructive">
          <p>{error}</p>
          <Button variant="outline" onClick={fetchStats} className="mt-2">
            Try Again
          </Button>
        </div>
      ) : stats ? (
        <div className="space-y-6">
          <StatsOverview
            totalQuestionnaires={stats.totalQuestionnaires}
            totalResponses={stats.totalResponses}
            totalQuestions={stats.totalQuestions}
            averageCompletionTime={stats.averageCompletionTime}
          />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <ActivityChart data={stats.dailyActivity} />
            <TopQuestionnaires questionnaires={stats.topQuestionnaires} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <QuestionTypes
              data={stats.questionTypeDistribution.map((item) => ({
                type: item.type as QuestionType,
                count: item.count,
              }))}
            />

            <Card className="col-span-1 lg:col-span-1">
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Link
                      href="/questionnaires"
                      className="text-primary hover:underline text-sm font-medium"
                    >
                      View All Questionnaires ({stats.totalQuestionnaires})
                    </Link>
                  </div>
                  <div>
                    <Link
                      href="/questionnaires/create"
                      className="text-primary hover:underline text-sm font-medium"
                    >
                      Create New Questionnaire
                    </Link>
                  </div>
                  {stats.topQuestionnaires[0] && (
                    <div>
                      <Link
                        href={`/questionnaires/${stats.topQuestionnaires[0].id}/stats`}
                        className="text-primary hover:underline text-sm font-medium"
                      >
                        View Top Questionnaire Stats
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <LatestResponses responses={stats.latestResponses} />
        </div>
      ) : null}
    </div>
  );
}

function Card({ className, children, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={`bg-card text-card-foreground shadow-sm rounded-lg border p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={`pb-4 ${className}`} {...props} />;
}

function CardTitle({ className, ...props }: React.ComponentProps<'h3'>) {
  return <h3 className={`font-semibold text-lg ${className}`} {...props} />;
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={className} {...props} />;
}
