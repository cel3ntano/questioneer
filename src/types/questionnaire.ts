import { Questionnaire, Question, Option, QuestionType, Response } from '@prisma/client';

export type QuestionnaireWithCounts = Questionnaire & {
  _count: {
    questions: number;
    responses: number;
  };
};

export type QuestionWithOptions = Question & {
  options: Option[];
};

export type QuestionnaireWithQuestions = Questionnaire & {
  questions: QuestionWithOptions[];
  _count?: {
    responses: number;
  };
};

export type SortOption = {
  label: string;
  value: string;
  column: string;
};

export interface QuestionnaireApiResponse {
  questionnaires: QuestionnaireWithCounts[];
  nextCursor: string | null;
  hasMore: boolean;
}

export type QuestionInput = {
  id?: string;
  questionText: string;
  questionType: QuestionType;
  options?: OptionInput[];
  image?: string;
  order: number;
};

export type OptionInput = {
  id?: string;
  text: string;
  order: number;
};

export type QuestionnaireInput = {
  name: string;
  description: string;
  questions: QuestionInput[];
};

export type ResponseWithAnswers = Response & {
  answers: Array<{
    id: string;
    questionId: string;
    textAnswer?: string | null;
    selectedOptions?: string[];
    singleOptionId?: string | null;
    imageAnswer?: string | null;
    question: Question;
  }>;
  questionnaire: Questionnaire;
};

export type AnswerInput = {
  questionId: string;
  textAnswer?: string;
  singleOptionId?: string;
  selectedOptions?: string[];
  imageAnswer?: string;
}

export const SORT_OPTIONS: SortOption[] = [
  { label: 'Newest', value: 'createdAt-desc', column: 'createdAt' },
  { label: 'Oldest', value: 'createdAt-asc', column: 'createdAt' },
  { label: 'Name (A-Z)', value: 'name-asc', column: 'name' },
  { label: 'Name (Z-A)', value: 'name-desc', column: 'name' },
  { label: 'Most Questions', value: 'questionCount-desc', column: 'questionCount' },
  { label: 'Fewest Questions', value: 'questionCount-asc', column: 'questionCount' },
  { label: 'Most Completions', value: 'responseCount-desc', column: 'responseCount' },
  { label: 'Fewest Completions', value: 'responseCount-asc', column: 'responseCount' },
];