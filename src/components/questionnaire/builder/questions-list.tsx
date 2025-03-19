'use client';

import { useId } from 'react';
import {
  DragDropContext,
  Droppable,
  OnDragEndResponder,
} from '@hello-pangea/dnd';
import QuestionEditor from './question-editor';

interface QuestionsListProps {
  fields: { id: string }[];
  onRemove: (index: number) => void;
  onDragEnd: OnDragEndResponder;
}

export default function QuestionsList({
  fields,
  onRemove,
  onDragEnd,
}: QuestionsListProps) {
  const listId = useId();

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId={`questions-list-${listId}`}>
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-4"
          >
            {fields.map((field, index) => (
              <QuestionEditor
                key={field.id}
                index={index}
                onRemove={() => onRemove(index)}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
