import { z } from 'zod';
import { QuestionType } from '@prisma/client';

export const optionSchema = z.object({
  id: z.string().optional(),
  text: z.string().min(1, 'Option text is required'),
  order: z.number(),
});

export const questionSchema = z
  .object({
    id: z.string().optional(),
    questionText: z
      .string()
      .min(3, 'Question text must be at least 3 characters'),
    questionType: z.enum([
      QuestionType.TEXT,
      QuestionType.SINGLE_CHOICE,
      QuestionType.MULTIPLE_CHOICE,
      QuestionType.IMAGE,
    ]),
    options: z.array(optionSchema).optional(),
    image: z.string().optional(),
    order: z.number(),
  })
  .refine(
    (data) => {
      if (
        (data.questionType === QuestionType.SINGLE_CHOICE ||
          data.questionType === QuestionType.MULTIPLE_CHOICE) &&
        (!data.options || data.options.length < 2)
      ) {
        return false;
      }
      return true;
    },
    {
      message: 'Choice questions must have at least 2 options',
      path: ['options'],
    }
  );

export const questionnaireFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  questions: z
    .array(questionSchema)
    .min(1, 'At least one question is required'),
});

export type QuestionnaireFormValues = z.infer<typeof questionnaireFormSchema>;
export type QuestionFormValues = z.infer<typeof questionSchema>;
export type OptionFormValues = z.infer<typeof optionSchema>;
