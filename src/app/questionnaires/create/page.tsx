import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CreateQuestionnairePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button asChild variant="ghost" size="sm" className="mr-2">
          <Link href="/questionnaires">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Create Questionnaire</h1>
      </div>
      
      <div className="flex items-center justify-center p-12 border rounded-lg bg-muted/40">
        <p className="text-muted-foreground">
          Questionnaire builder coming in the next implementation phase...
        </p>
      </div>
    </div>
  );
}