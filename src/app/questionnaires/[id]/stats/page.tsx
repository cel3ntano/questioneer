'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { QuestionnaireWithQuestions } from '@/types/questionnaire';
import StatsDashboard from '@/components/questionnaire/stats/stats-dashboard';
import { toast } from 'sonner';
import { use } from 'react';

interface StatsQuestionnairePageProps {
  params: Promise<{ id: string }>;
}

export default function StatsQuestionnairePage({ params }: StatsQuestionnairePageProps) {
  const [questionnaire, setQuestionnaire] = useState<QuestionnaireWithQuestions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id: questionnaireId } = use(params);
  useEffect(() => {
    const fetchQuestionnaire = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/questionnaires/${questionnaireId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch questionnaire');
        }
        
        const data = await response.json();
        setQuestionnaire(data);
      } catch (err) {
        console.error('Error fetching questionnaire:', err);
        setError('Failed to load questionnaire. Please try again.');
        toast.error('Failed to load questionnaire');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionnaire();
  }, [questionnaireId]);

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button asChild variant="ghost" size="sm" className="mr-2">
          <Link href="/questionnaires">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          {loading 
            ? 'Loading Statistics...' 
            : questionnaire 
              ? `${questionnaire.name} - Statistics` 
              : 'Questionnaire Not Found'
          }
        </h1>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="rounded-md bg-destructive/15 p-4 text-destructive">
          <p>{error}</p>
          <Button variant="outline" onClick={() => window.location.reload()} className="mt-2">
            Try Again
          </Button>
        </div>
      ) : questionnaire ? (
        <>
          {questionnaire.description && (
            <p className="text-muted-foreground">{questionnaire.description}</p>
          )}
          <StatsDashboard questionnaire={questionnaire} />
        </>
      ) : null}
    </div>
  );
}