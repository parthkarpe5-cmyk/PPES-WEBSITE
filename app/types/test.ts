export type QuestionType = 'MCQ' | 'MULTIPLE_SELECT' | 'TRUE_FALSE' | 'DESCRIPTIVE' | 'CODING';

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  imageUrl?: string; // Optional image URL for the question
  points: number;
  options?: string[]; // For MCQ / MULTIPLE_SELECT
  correctAnswer?: string | string[]; // Auto-grading for objective questions
}

export interface Test {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  questions: Question[];
  createdBy: string;
  postTestMessage?: string;
  resultReleasePolicy?: 'IMMEDIATE' | 'MANUAL';
  passingPercentage?: number;
}

export interface StudentAnswer {
  questionId: string;
  answer: string | string[];
}

export interface StudentAttemptRecord {
  testId: string;
  testTitle: string;
  timestamp: string;
  score: string;
  answers: Record<string, string | string[]>;
}

export interface TestAttempt {
  id: string;
  testId: string;
  studentId: string;
  answers: Record<string, StudentAnswer>; // Key is questionId
  status: 'IN_PROGRESS' | 'SUBMITTED' | 'GRADED';
  totalScore?: number;
  teacherFeedback?: string;
}
