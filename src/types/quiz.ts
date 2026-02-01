export type QuestionType = 'text' | 'multiple-choice' | 'single-choice';

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[]; // For choice questions
  required: boolean;
}

export interface QuizConfig {
  enabled: boolean;
  questions: QuizQuestion[];
}
