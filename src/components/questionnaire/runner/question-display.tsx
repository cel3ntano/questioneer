'use client';

import { useState } from 'react';
import { QuestionType } from '@prisma/client';
import { QuestionWithOptions } from '@/types/questionnaire';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { CldUploadButton } from 'next-cloudinary';
import { Button } from '@/components/ui/button';
import { ImageIcon, Trash2 } from 'lucide-react';
import { CLOUDINARY_UPLOAD_PRESET } from '@/lib/constants';
import Image from 'next/image';
import { CloudinaryUploadWidgetResults } from 'next-cloudinary';

interface QuestionAnswer {
  textAnswer?: string;
  selectedOptions?: string[];
  singleOptionId?: string;
  imageAnswer?: string;
}

interface QuestionDisplayProps {
  question: QuestionWithOptions;
  answer: QuestionAnswer;
  onChange: (answer: Partial<QuestionAnswer>) => void;
}

export default function QuestionDisplay({
  question,
  answer,
  onChange,
}: QuestionDisplayProps) {
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ textAnswer: e.target.value });
  };

  const handleSingleChoiceChange = (value: string) => {
    onChange({ singleOptionId: value });
  };

  const handleMultipleChoiceChange = (optionId: string, checked: boolean) => {
    let selectedOptions = [...(answer.selectedOptions || [])];

    if (checked) {
      selectedOptions.push(optionId);
    } else {
      selectedOptions = selectedOptions.filter((id) => id !== optionId);
    }

    onChange({ selectedOptions });
  };

  const handleImageUpload = (results: CloudinaryUploadWidgetResults) => {
    setUploadingImage(false);
    if (
      results.info &&
      typeof results.info !== 'string' &&
      results.info.secure_url
    ) {
      onChange({ imageAnswer: results.info.secure_url });
    }
  };

  const handleRemoveImage = () => {
    onChange({ imageAnswer: undefined });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {question.questionText}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {question.image && (
          <div className="mb-4">
            <Image
              src={question.image}
              alt="Question"
              className="rounded-md max-h-64 object-contain mx-auto mb-4"
              width={500}
              height={300}
              style={{ objectFit: 'contain', maxHeight: '16rem' }}
            />
          </div>
        )}

        {question.questionType === QuestionType.TEXT && (
          <div className="space-y-2">
            <Label htmlFor={`question-${question.id}`}>Your Answer</Label>
            <Input
              id={`question-${question.id}`}
              value={answer.textAnswer || ''}
              onChange={handleTextChange}
              placeholder="Type your answer here..."
            />
          </div>
        )}

        {question.questionType === QuestionType.SINGLE_CHOICE && (
          <div className="space-y-4">
            <RadioGroup
              value={answer.singleOptionId || ''}
              onValueChange={handleSingleChoiceChange}
            >
              {question.options
                .sort((a, b) => a.order - b.order)
                .map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={option.id}
                      id={`option-${option.id}`}
                    />
                    <Label htmlFor={`option-${option.id}`}>{option.text}</Label>
                  </div>
                ))}
            </RadioGroup>
          </div>
        )}

        {question.questionType === QuestionType.MULTIPLE_CHOICE && (
          <div className="space-y-3">
            {question.options
              .sort((a, b) => a.order - b.order)
              .map((option) => {
                const isChecked = (answer.selectedOptions || []).includes(
                  option.id
                );
                return (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`option-${option.id}`}
                      checked={isChecked}
                      onCheckedChange={(checked) =>
                        handleMultipleChoiceChange(
                          option.id,
                          checked as boolean
                        )
                      }
                    />
                    <Label htmlFor={`option-${option.id}`}>{option.text}</Label>
                  </div>
                );
              })}
          </div>
        )}

        {question.questionType === QuestionType.IMAGE && (
          <div className="space-y-3">
            {answer.imageAnswer ? (
              <div className="relative w-full">
                <Image
                  src={answer.imageAnswer}
                  alt="Your answer"
                  className="rounded-md max-h-64 object-contain mx-auto"
                  width={500}
                  height={300}
                  style={{ objectFit: 'contain', maxHeight: '16rem' }}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="mt-2"
                  onClick={handleRemoveImage}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove Image
                </Button>
              </div>
            ) : (
              <CldUploadButton
                uploadPreset={CLOUDINARY_UPLOAD_PRESET}
                onUpload={handleImageUpload}
                options={{
                  maxFiles: 1,
                  resourceType: 'image',
                }}
                className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-md"
              >
                {uploadingImage ? (
                  <span>Uploading...</span>
                ) : (
                  <>
                    <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">
                      Upload an image as your answer
                    </span>
                  </>
                )}
              </CldUploadButton>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
