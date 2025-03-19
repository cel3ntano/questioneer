import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface StatsQuestionnairePageProps {
  params: {
    id: string;
  };
}

export default function StatsQuestionnairePage({ params }: StatsQuestionnairePageProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button asChild variant="ghost" size="sm" className="mr-2">
          <Link href="/questionnaires">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Questionnaire Statistics</h1>
      </div>
      
      <div className="flex items-center justify-center p-12 border rounded-lg bg-muted/40">
        <p className="text-muted-foreground">
          Statistics dashboard for questionnaire ID: {params.id} coming in the next implementation phase...
        </p>
      </div>
    </div>
  );
}