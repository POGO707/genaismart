export interface User {
  id: string;
  email: string;
  name: string;
  points: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string; // The text of the correct answer
  explanation: string;
}

export interface QuizResult {
  score: number;
  total: number;
}

export enum ViewState {
  LANDING = 'LANDING',
  DASHBOARD = 'DASHBOARD',
}

export enum FeatureView {
  PDF_TUTOR = 'PDF_TUTOR',
  QUIZ_GEN = 'QUIZ_GEN',
  VIDEO_GEN = 'VIDEO_GEN',
  ASSIGNMENT_SOLVER = 'ASSIGNMENT_SOLVER',
}

export interface GeneratedVideo {
  uri: string;
  expiry: string;
}