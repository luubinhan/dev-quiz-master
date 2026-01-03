
export enum QuestionType {
  SINGLE = 'single',
  MULTIPLE = 'multiple',
  FILL = 'fill',
  DRAG_DROP = 'drag-drop'
}

export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

export interface MatchingPair {
  id: string;
  left: string;
  right: string;
}

export interface Question {
  id: string;
  topic: string;
  difficulty: Difficulty;
  type: QuestionType;
  questionText: string;
  codeSnippet?: string;
  options?: string[]; // For single and multiple choice
  matchingPairs?: MatchingPair[]; // For drag-drop
  correctAnswer: string | string[] | Record<string, string>; 
  explanation: string;
  reference?: string;
}

export interface UserAnswer {
  questionId: string;
  answer: any;
  isCorrect: boolean;
  timeTaken: number;
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  percentage: number;
  timeSpent: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  topic: string;
  userAnswers: UserAnswer[];
}

export interface Topic {
  id: string;
  name: string;
  icon: string;
  description: string;
}
