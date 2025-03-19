'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusCircle, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useFieldArray } from 'react-hook-form';
import {
  questionnaireFormSchema,
  QuestionnaireFormValues,
} from '@/lib/validators/questionnaire';
import { QuestionType, Option } from '@prisma/client';
import { toast } from 'sonner';
import QuestionsList from './questions-list';
import { OnDragEndResponder } from '@hello-pangea/dnd';
import {
  QuestionnaireWithQuestions,
  QuestionWithOptions,
} from '@/types/questionnaire';

interface QuestionnaireFormProps {
  initialData?: QuestionnaireWithQuestions;
  isEditing?: boolean;
}

export default function QuestionnaireForm({
  initialData,
  isEditing = false,
}: QuestionnaireFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues: QuestionnaireFormValues = initialData
    ? {
        name: initialData.name,
        description: initialData.description,
        questions: initialData.questions.map((q: QuestionWithOptions) => ({
          id: q.id,
          questionText: q.questionText,
          questionType: q.questionType,
          options:
            q.options?.map((o: Option) => ({
              id: o.id,
              text: o.text,
              order: o.order,
            })) || [],
          image: q.image || '',
          order: q.order,
        })),
      }
    : {
        name: '',
        description: '',
        questions: [],
      };

  const form = useForm<QuestionnaireFormValues>({
    resolver: zodResolver(questionnaireFormSchema),
    defaultValues,
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: 'questions',
  });

  const handleAddQuestion = () => {
    append({
      questionText: '',
      questionType: QuestionType.TEXT,
      options: [],
      order: fields.length,
    });
  };

  const handleSubmit = async (values: QuestionnaireFormValues) => {
    try {
      setIsSubmitting(true);

      values.questions = values.questions.map((q, index) => ({
        ...q,
        order: index,
        options: q.options?.map((o, oIndex) => ({
          ...o,
          order: oIndex,
        })),
      }));

      const url =
        isEditing && initialData
          ? `/api/questionnaires/${initialData.id}`
          : '/api/questionnaires';

      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Something went wrong');
      }

      await response.json();

      toast.success(
        isEditing
          ? 'Questionnaire updated successfully'
          : 'Questionnaire created successfully'
      );

      router.push('/questionnaires');
      router.refresh();
    } catch (error) {
      console.error('Error saving questionnaire:', error);
      toast.error((error as Error).message || 'Failed to save questionnaire');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDragEnd: OnDragEndResponder = (result) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    move(sourceIndex, destinationIndex);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Questionnaire Name</Label>
              <Input
                id="name"
                {...form.register('name')}
                placeholder="Enter questionnaire name"
                aria-invalid={!!form.formState.errors.name}
              />
              {form.formState.errors.name && (
                <p className="text-destructive text-sm mt-1">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...form.register('description')}
                placeholder="Enter questionnaire description"
                rows={3}
                aria-invalid={!!form.formState.errors.description}
              />
              {form.formState.errors.description && (
                <p className="text-destructive text-sm mt-1">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Questions</h2>
            <Button type="button" onClick={handleAddQuestion} variant="outline">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Question
            </Button>
          </div>

          {fields.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground mb-4">
                No questions added yet. Click the button below to add your first
                question.
              </p>
              <Button type="button" onClick={handleAddQuestion}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </Card>
          ) : (
            <QuestionsList
              fields={fields}
              onRemove={remove}
              onDragEnd={handleDragEnd}
            />
          )}

          {form.formState.errors.questions && (
            <p className="text-destructive text-sm mt-1">
              {form.formState.errors.questions.message}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting
              ? 'Saving...'
              : isEditing
              ? 'Update Questionnaire'
              : 'Create Questionnaire'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
