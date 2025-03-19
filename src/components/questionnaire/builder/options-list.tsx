'use client';

import { useId } from 'react';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { QuestionnaireFormValues } from '@/lib/validators/questionnaire';
import OptionEditor from './option-editor';

interface OptionsListProps {
  questionIndex: number;
}

export default function OptionsList({ questionIndex }: OptionsListProps) {
  const listId = useId();
  const {
    control,
    formState: { errors },
  } = useFormContext<QuestionnaireFormValues>();

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: `questions.${questionIndex}.options`,
  });

  const errorMessage = errors.questions?.[questionIndex]?.options?.message;

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    move(sourceIndex, destinationIndex);
  };

  const handleAddOption = () => {
    append({ text: '', order: fields.length });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>Options</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddOption}
          className="h-8"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Option
        </Button>
      </div>

      {errorMessage && (
        <p className="text-destructive text-sm">{errorMessage}</p>
      )}

      {fields.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4 text-center border rounded-md">
          No options added. Click &quot;Add Option&quot; to create options.
        </p>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId={`options-list-${listId}`}>
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2"
              >
                {fields.map((field, index) => (
                  <OptionEditor
                    key={field.id}
                    questionIndex={questionIndex}
                    optionIndex={index}
                    onRemove={() => remove(index)}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
}
