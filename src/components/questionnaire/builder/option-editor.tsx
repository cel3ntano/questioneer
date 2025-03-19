'use client';

import { useFormContext } from 'react-hook-form';
import { Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { QuestionnaireFormValues } from '@/lib/validators/questionnaire';
import { Draggable } from '@hello-pangea/dnd';

interface OptionEditorProps {
  questionIndex: number;
  optionIndex: number;
  onRemove: () => void;
}

export default function OptionEditor({
  questionIndex,
  optionIndex,
  onRemove,
}: OptionEditorProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<QuestionnaireFormValues>();

  const errorMessage =
    errors.questions?.[questionIndex]?.options?.[optionIndex]?.text?.message;

  return (
    <Draggable
      draggableId={`option-${questionIndex}-${optionIndex}`}
      index={optionIndex}
    >
      {(provided) => (
        <div
          className="flex items-center space-x-2"
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <div className="cursor-move touch-none" {...provided.dragHandleProps}>
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </div>

          <div className="flex-1">
            <Input
              {...register(
                `questions.${questionIndex}.options.${optionIndex}.text`
              )}
              placeholder={`Option ${optionIndex + 1}`}
              aria-invalid={!!errorMessage}
            />
            {errorMessage && (
              <p className="text-destructive text-xs mt-1">{errorMessage}</p>
            )}
          </div>

          <input
            type="hidden"
            {...register(
              `questions.${questionIndex}.options.${optionIndex}.order`
            )}
            value={optionIndex}
          />

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="h-8 w-8 text-destructive flex-shrink-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </Draggable>
  );
}
