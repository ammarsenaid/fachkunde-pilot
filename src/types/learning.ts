export type Status = "not_started" | "in_progress" | "completed" | "review";

export interface LearningModule {
  id: string;
  number: number;
  title: string;
  description: string;
  icon: string;
  subtopicCount: number;
  estimatedMinutes: number;
  progress: number;
  status: Status;
}

export interface Subtopic {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  readingMinutes: number;
  flashcardCount: number;
  quizCount: number;
  status: Status;
  examRelevance: 1 | 2 | 3;
}

export interface LessonBlock {
  id: string;
  type: "text" | "list" | "tip" | "warning" | "example";
  content: string;
}

export interface Lesson {
  id: string;
  subtopicId: string;
  title: string;
  blocks: LessonBlock[];
}

export interface Flashcard {
  id: string;
  moduleId: string;
  front: string;
  back: string;
  arabicHint?: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface QuizAnswer {
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  moduleId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  arabicExplanation?: string;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  category: string;
  definition: string;
  arabic?: string;
}

export interface NavigationItem {
  label: string;
  href: string;
  icon: string;
}

export interface UserProgress {
  moduleId: string;
  progress: number;
  status: Status;
  updatedAt: string;
}

export interface StudyPlanTask {
  id: string;
  title: string;
  dueDate: string;
  status: Status;
  moduleId?: string;
}

export interface ExamAttempt {
  id: string;
  score: number;
  totalQuestions: number;
  completedAt: string;
}

export interface UploadedSource {
  id: string;
  filename: string;
  uploadedAt: string;
  status: "pending" | "processed" | "failed";
}
