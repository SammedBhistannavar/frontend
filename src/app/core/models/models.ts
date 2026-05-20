// Auth models
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: 'USER' | 'ADMIN';
}

export interface AuthResponse {
  token?: string;
  msg?: string;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: string;
}

// Question models
export interface QuestionRequest {
  question: string;
  description: string;
  topic: string;
  difficulty: string;
}

export interface QuestionResponse {
  id: number;
  questions: string;
  description: string;
  topic: string;
  difficulty: string;
}

// Quiz models
export interface QuizStartRequest {
  topic: string;
  difficulty: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
}

export interface AnswerDTO {
  questionId: number;
  selectedAnswer: string;
}

export interface QuizSubmitRequest {
  quizSessionId: number;
  answers: AnswerDTO[];
}

export interface ResultDetail {
  questionId: number;
  question?: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  details: ResultDetail[];
}

// Profile models
export interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  skills?: string;
  resumeUrl?: string;
}

export interface UserProfileUpdate {
  name: string;
  phone?: string;
  bio?: string;
  skills?: string;
  resumeUrl?: string;
}

// Progress model
export interface ProgressDTO {
  totalQuizzes: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
}
