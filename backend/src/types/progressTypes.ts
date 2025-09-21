export interface ProblemAttempt {
  problemId: string;
  question: string;
  studentAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timestamp: Date;
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  concepts: string[];
  timeSpent: number; // in seconds
  hintsUsed: number;
}

export interface StudentProgress {
  studentId: string;
  totalProblemsAttempted: number;
  totalCorrect: number;
  accuracyRate: number;
  topics: {
    [topicId: string]: {
      problemsAttempted: number;
      correct: number;
      accuracyRate: number;
      lastAttempt: Date;
      strugglingConcepts: string[];
      masteredConcepts: string[];
    };
  };
  concepts: {
    [concept: string]: {
      attempts: number;
      correct: number;
      accuracyRate: number;
      lastAttempt: Date;
      difficulty: 'beginner' | 'intermediate' | 'advanced';
    };
  };
  recentAttempts: ProblemAttempt[];
  learningStreak: number;
  lastActive: Date;
}

export interface AdaptiveQuestion {
  question: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  topic: string;
  concepts: string[];
  reasoning: string;
  isReview: boolean;
  previousProblemId?: string;
}

export interface ProgressUpdateRequest {
  studentId: string;
  problemId: string;
  question: string;
  studentAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  concepts: string[];
  timeSpent: number;
  hintsUsed: number;
}

export interface ProgressResponse {
  success: boolean;
  data: {
    updatedProgress: StudentProgress;
    adaptiveQuestion?: AdaptiveQuestion;
    recommendations: string[];
    strugglingAreas: string[];
    masteredAreas: string[];
  };
  metadata: {
    timestamp: string;
    accuracyRate: number;
    learningStreak: number;
  };
}
