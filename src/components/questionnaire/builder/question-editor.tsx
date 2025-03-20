'use client';

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { QuestionType } from '@prisma/client';
import { Trash2, GripVertical, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { QuestionnaireFormValues } from '@/lib/validators/questionnaire';
import { CldUploadWidget, CloudinaryUploadWidgetResults } from 'next-cloudinary';
import Image from 'next/image';
import OptionsList from './options-list';
import { DraggableProvidedDragHandleProps } from '@hello-pangea/dnd';

interface QuestionEditorProps {
  index: number;
  onRemove: () => void;
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
}

export default function QuestionEditor({
  index,
  onRemove,
  dragHandleProps,
}: QuestionEditorProps) {
  const { register, watch, setValue } =
    useFormContext<QuestionnaireFormValues>();
  const questionType = watch(`questions.${index}.questionType`);
  const [uploadingImage, setUploadingImage] = useState(false);

  return (
    <Card className="mb-4 relative">
      <div
        className="absolute left-3 top-7.5 cursor-move touch-none"
        {...dragHandleProps}
      >
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>

      <CardHeader className="pl-10 flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="text-base font-medium">Question {index + 1}</div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="h-8 w-8 text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`questions.${index}.questionText`}>
            Question Text
          </Label>
          <Input
            id={`questions.${index}.questionText`}
            {...register(`questions.${index}.questionText`)}
            placeholder="Enter your question"
          />
        </div>

        <div className="space-y-2">
          <Label>Question Type</Label>
          <RadioGroup
            value={questionType}
            onValueChange={(value) =>
              setValue(`questions.${index}.questionType`, value as QuestionType)
            }
            className="flex flex-wrap gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value={QuestionType.TEXT}
                id={`type-text-${index}`}
              />
              <Label htmlFor={`type-text-${index}`}>Text</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value={QuestionType.SINGLE_CHOICE}
                id={`type-single-${index}`}
              />
              <Label htmlFor={`type-single-${index}`}>Single Choice</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value={QuestionType.MULTIPLE_CHOICE}
                id={`type-multiple-${index}`}
              />
              <Label htmlFor={`type-multiple-${index}`}>Multiple Choice</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value={QuestionType.IMAGE}
                id={`type-image-${index}`}
              />
              <Label htmlFor={`type-image-${index}`}>Image</Label>
            </div>
          </RadioGroup>
        </div>

        {(questionType === QuestionType.SINGLE_CHOICE ||
          questionType === QuestionType.MULTIPLE_CHOICE) && (
          <OptionsList questionIndex={index} />
        )}

        {questionType === QuestionType.IMAGE && (
          <div className="space-y-2">
            <Label>Image Preview</Label>
            <div className="border rounded-md p-4 flex flex-col items-center justify-center">
              {watch(`questions.${index}.image`) ? (
                <div className="relative w-full">
                  <Image
                    src={watch(`questions.${index}.image`) || ''}
                    alt="Question"
                    className="rounded-md max-h-48 object-contain mx-auto"
                    width={400}
                    height={240}
                    style={{ objectFit: 'contain', maxHeight: '12rem' }}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="mt-2"
                    onClick={() => setValue(`questions.${index}.image`, '')}
                  >
                    Remove Image
                  </Button>
                </div>
              ) : (
                <CldUploadWidget
                  uploadPreset={
                    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ||
                    'questioneer'
                  }
                  options={{
                    maxFiles: 1,
                    resourceType: 'image',
                    sources: ['local', 'url', 'camera'],
                  }}
                  onSuccess={(results: CloudinaryUploadWidgetResults, { widget }) => {
                    setUploadingImage(false);

                    if (
                      results?.info && 
                      typeof results.info === 'object' && 
                      'secure_url' in results.info
                    ) {
                      setValue(
                        `questions.${index}.image`,
                        results.info.secure_url as string
                      );
                    }

                    widget.close();
                  }}
                  onClose={() => {
                    setUploadingImage(false);
                  }}
                >
                  {({ open }) => (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setUploadingImage(true);
                        open();
                      }}
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md bg-transparent hover:bg-muted/50"
                    >
                      {uploadingImage ? (
                        <span>One moment...</span>
                      ) : (
                        <>
                          <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                          <span className="text-sm text-muted-foreground">
                            Upload an image
                          </span>
                        </>
                      )}
                    </Button>
                  )}
                </CldUploadWidget>
              )}
            </div>
          </div>
        )}

        <input
          type="hidden"
          {...register(`questions.${index}.order`)}
          value={index}
        />
      </CardContent>
    </Card>
  );
}