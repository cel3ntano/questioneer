'use client';

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, ExternalLink } from 'lucide-react';

interface ResponseData {
  id: string;
  questionnaireId: string;
  questionnaireName: string;
  completionTime: number | null;
  createdAt: string;
}

interface LatestResponsesProps {
  responses: ResponseData[];
}

export default function LatestResponses({ responses }: LatestResponsesProps) {
  const formatTime = (seconds: number | null) => {
    if (!seconds) return 'N/A';

    if (seconds < 60) {
      return `${seconds} seconds`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.round(seconds % 60);
      return `${minutes} min${minutes !== 1 ? 's' : ''} ${
        remainingSeconds > 0 ? `${remainingSeconds} sec` : ''
      }`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours} hour${hours !== 1 ? 's' : ''} ${
        minutes > 0 ? `${minutes} min` : ''
      }`;
    }
  };

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-4">
      <CardHeader>
        <CardTitle>Latest Responses</CardTitle>
      </CardHeader>
      <CardContent>
        {responses.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No responses recorded yet
          </div>
        ) : (
          <div className="space-y-4">
            {responses.map((response) => (
              <div
                key={response.id}
                className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-md border"
              >
                <div className="space-y-1 mb-2 md:mb-0">
                  <Link
                    href={`/questionnaires/${response.questionnaireId}`}
                    className="font-medium hover:underline"
                  >
                    {response.questionnaireName}
                  </Link>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" />
                    {formatTime(response.completionTime)} to complete •{' '}
                    {formatDistanceToNow(new Date(response.createdAt), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
                <div className="flex items-center space-x-2 w-full md:w-auto">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full md:w-auto"
                  >
                    <Link
                      href={`/questionnaires/${response.questionnaireId}/stats`}
                    >
                      <ExternalLink className="mr-1 h-3 w-3" />
                      View Stats
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
