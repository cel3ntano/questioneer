'use client';

import { formatDistance } from 'date-fns';
import { ArrowRight, Clock, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QuestionnaireWithQuestions } from '@/types/questionnaire';
import { QuestionType } from '@prisma/client';

interface Answer {
  textAnswer?: string;
  singleOptionId?: string;
  selectedOptions?: string[];
  imageAnswer?: string;
}

interface QuestionnaireSummaryProps {
  questionnaire: QuestionnaireWithQuestions;
  answers: Record<string, Answer>;
  startTime: Date;
  responseId: string | null;
  onClose: () => void;
}

export default function QuestionnaireSummary({
  questionnaire,
  answers,
  startTime,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  responseId,
  onClose,
}: QuestionnaireSummaryProps) {
  const endTime = new Date();
  const completionTime = formatDistance(endTime, startTime, {
    includeSeconds: true,
  });

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Card className="bg-primary text-primary-foreground mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">
            <CheckCircle className="h-6 w-6 inline-block mr-2" />
            Questionnaire Completed!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Completion time: {completionTime}
          </p>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-semibold">Your Responses</h2>

      <div className="space-y-6">
        {questionnaire.questions.map((question) => {
          const answer = answers[question.id] || {};

          let displayAnswer;

          switch (question.questionType) {
            case QuestionType.TEXT:
              displayAnswer = answer.textAnswer || 'No answer provided';
              break;

            case QuestionType.SINGLE_CHOICE:
              if (answer.singleOptionId) {
                const option = question.options.find(
                  (o) => o.id === answer.singleOptionId
                );
                displayAnswer = option
                  ? option.text
                  : 'Invalid option selected';
              } else {
                displayAnswer = 'No option selected';
              }
              break;

            case QuestionType.MULTIPLE_CHOICE:
              if (answer.selectedOptions && answer.selectedOptions.length > 0) {
                const optionIds: string[] = answer.selectedOptions;
                const selectedOptions = question.options
                  .filter((o) => optionIds.includes(o.id))
                  .map((o) => o.text);
                displayAnswer = selectedOptions.join(', ');
              } else {
                displayAnswer = 'No options selected';
              }
              break;

            case QuestionType.IMAGE:
              displayAnswer = answer.imageAnswer ? (
                <Image
                  src={answer.imageAnswer}
                  alt="Your answer"
                  className="max-h-40 object-contain mt-2"
                  width={300}
                  height={200}
                />
              ) : (
                'No image uploaded'
              );
              break;

            default:
              displayAnswer = 'Unsupported question type';
          }

          return (
            <Card key={question.id} className="overflow-hidden">
              <CardHeader className="bg-muted/30 pb-3">
                <CardTitle className="text-base font-medium">
                  {question.questionText}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">
                    Your Answer:
                  </div>
                  <div className="font-medium">{displayAnswer}</div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-end pt-6">
        <Button onClick={onClose}>
          Back to Questionnaires
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
