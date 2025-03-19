'use client';

import { useId } from 'react';
import {
  Droppable,
  Draggable,
} from '@hello-pangea/dnd';
import QuestionEditor from './question-editor';

interface QuestionsListProps {
  fields: { id: string }[];
  onRemove: (index: number) => void;
}

export default function QuestionsList({
  fields,
  onRemove,
}: QuestionsListProps) {
  const listId = useId();

  return (
    <Droppable droppableId={`questions-list-${listId}`} type="question">
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="space-y-4"
        >
          {fields.map((field, index) => (
            <Draggable 
              key={field.id} 
              draggableId={`question-${field.id}`} 
              index={index}
            >
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  <QuestionEditor
                    index={index}
                    onRemove={() => onRemove(index)}
                    dragHandleProps={provided.dragHandleProps}
                  />
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}