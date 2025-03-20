'use client';

import { formatDistance } from 'date-fns';
import { ArrowRight, Clock, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 25 }
  }
};

const successCardVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25
    }
  }
};

const Confetti = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(50)].map((_, i) => {
        const size = Math.random() * 8 + 5;
        const duration = Math.random() * 2 + 2;
        const rotation = Math.random() * 360;
        const delay = Math.random() * 0.5;
        const xStart = Math.random() * 100;
        
        return (
          <motion.div
            key={i}
            className="absolute top-0 w-2 h-2 rounded-full"
            style={{
              left: `${xStart}%`,
              backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
              width: size,
              height: size,
            }}
            initial={{ y: -20, opacity: 0, rotate: 0 }}
            animate={{
              y: "110vh",
              opacity: [0, 1, 1, 0],
              rotate: rotation * 2,
              x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50],
            }}
            transition={{
              duration,
              delay,
              ease: "easeOut",
              times: [0, 0.2, 0.8, 1]
            }}
          />
        );
      })}
    </div>
  );
};

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
    <motion.div 
      className="space-y-6 max-w-3xl mx-auto relative"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Confetti />
      
      <motion.div variants={successCardVariants}>
        <Card className="bg-primary text-primary-foreground mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ 
                  scale: 1, 
                  transition: { 
                    type: "spring",
                    stiffness: 500,
                    delay: 0.5
                  }
                }}
              >
                <CheckCircle className="h-6 w-6 inline-block mr-2" />
              </motion.div>
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  transition: { delay: 0.6, duration: 0.4 }
                }}
              >
                Questionnaire Completed!
              </motion.span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <motion.p className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Completion time: {completionTime}
            </motion.p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.h2 
        className="text-2xl font-semibold"
        variants={itemVariants}
      >
        Your Responses
      </motion.h2>

      <div className="space-y-6">
        {questionnaire.questions.map((question, index) => {
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
            <motion.div
              key={question.id}
              variants={itemVariants}
              custom={index}
            >
              <Card className="overflow-hidden">
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
            </motion.div>
          );
        })}
      </div>

      <motion.div 
        className="flex justify-end pt-6"
        variants={itemVariants}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button onClick={onClose}>
            Back to Questionnaires
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}