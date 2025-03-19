'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { QuestionnaireWithQuestions } from '@/types/questionnaire';
import QuestionDisplay from './question-display';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { STORAGE_KEY_PREFIX } from '@/lib/constants';
import QuestionnaireSummary from './questionnaire-summary';

// Match the interface from question-display.tsx
interface QuestionAnswer {
  textAnswer?: string;
  selectedOptions?: string[];
  singleOptionId?: string;
  imageAnswer?: string;
}

interface QuestionnaireRunnerProps {
  questionnaire: QuestionnaireWithQuestions;
}

export default function QuestionnaireRunner({
  questionnaire,
}: QuestionnaireRunnerProps) {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, QuestionAnswer>>({});
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [responseId, setResponseId] = useState<string | null>(null);

  const currentQuestion = questionnaire.questions[currentQuestionIndex];
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion =
    currentQuestionIndex === questionnaire.questions.length - 1;

  const storageKey = `${STORAGE_KEY_PREFIX}${questionnaire.id}`;

  useEffect(() => {
    const savedData = localStorage.getItem(storageKey);

    if (savedData) {
      try {
        const {
          answers: savedAnswers,
          questionIndex,
          startTime: savedStartTime,
        } = JSON.parse(savedData);
        setAnswers(savedAnswers || {});
        setCurrentQuestionIndex(questionIndex || 0);

        if (savedStartTime) {
          setStartTime(new Date(savedStartTime));
          const timeSinceSaved = formatDistanceToNow(new Date(savedStartTime), {
            addSuffix: true,
          });
          toast.info(
            `Resumed from your previous session (started ${timeSinceSaved})`
          );
        }
      } catch (error) {
        console.error('Error parsing saved progress:', error);
      }
    }
  }, [storageKey]);

  useEffect(() => {
    if (!isCompleted) {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          answers,
          questionIndex: currentQuestionIndex,
          startTime: startTime.toISOString(),
        })
      );
    }
  }, [answers, currentQuestionIndex, startTime, isCompleted, storageKey]);

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questionnaire.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleAnswerChange = (
    questionId: string,
    answer: Partial<QuestionAnswer>
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        ...answer,
      },
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      const endTime = new Date();
      const completionTime = Math.floor(
        (endTime.getTime() - startTime.getTime()) / 1000
      );

      const formattedAnswers = Object.entries(answers).map(
        ([questionId, answer]) => ({
          questionId,
          ...answer,
        })
      );

      const response = await fetch(
        `/api/questionnaires/${questionnaire.id}/responses`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            completionTime,
            answers: formattedAnswers,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Something went wrong');
      }

      const result = await response.json();
      setResponseId(result.id);

      localStorage.removeItem(storageKey);
      setIsCompleted(true);

      toast.success('Questionnaire completed successfully!');
    } catch (error) {
      console.error('Error submitting questionnaire:', error);
      toast.error((error as Error).message || 'Failed to submit questionnaire');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCompleted) {
    return (
      <QuestionnaireSummary
        questionnaire={questionnaire}
        answers={answers}
        startTime={startTime}
        responseId={responseId}
        onClose={() => router.push('/questionnaires')}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          Question {currentQuestionIndex + 1} of{' '}
          {questionnaire.questions.length}
        </h2>
        <div className="text-sm text-muted-foreground">
          {Math.floor(
            ((currentQuestionIndex + 1) / questionnaire.questions.length) * 100
          )}
          % completed
        </div>
      </div>

      <div className="relative w-full bg-secondary h-2 rounded-full overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full bg-primary transition-all duration-300"
          style={{
            width: `${
              ((currentQuestionIndex + 1) / questionnaire.questions.length) *
              100
            }%`,
          }}
        />
      </div>

      {currentQuestion ? (
        <QuestionDisplay
          question={currentQuestion}
          answer={answers[currentQuestion.id] || {}}
          onChange={(answer) => handleAnswerChange(currentQuestion.id, answer)}
        />
      ) : (
        <Card className="p-6">
          <CardContent className="flex items-center justify-center p-12">
            <AlertTriangle className="h-12 w-12 text-destructive" />
            <p className="ml-4">Question not found.</p>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={handlePrevious}
          disabled={isFirstQuestion || isSubmitting}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        {isLastQuestion ? (
          <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Complete
              </>
            )}
          </Button>
        ) : (
          <Button type="button" onClick={handleNext} disabled={isSubmitting}>
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
