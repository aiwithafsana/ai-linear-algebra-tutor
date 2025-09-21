import { 
  StudentProgress, 
  ProblemAttempt, 
  ProgressUpdateRequest, 
  ProgressResponse, 
  AdaptiveQuestion 
} from '../types/progressTypes';

// In-memory storage for student progress (in production, this would be a database)
const studentProgressStore = new Map<string, StudentProgress>();

class ProgressService {
  private getOrCreateStudentProgress(studentId: string): StudentProgress {
    if (!studentProgressStore.has(studentId)) {
      studentProgressStore.set(studentId, {
        studentId,
        totalProblemsAttempted: 0,
        totalCorrect: 0,
        accuracyRate: 0,
        topics: {},
        concepts: {},
        recentAttempts: [],
        learningStreak: 0,
        lastActive: new Date()
      });
    }
    return studentProgressStore.get(studentId)!;
  }

  updateProgress(request: ProgressUpdateRequest): ProgressResponse {
    const progress = this.getOrCreateStudentProgress(request.studentId);
    
    // Create problem attempt record
    const attempt: ProblemAttempt = {
      problemId: request.problemId,
      question: request.question,
      studentAnswer: request.studentAnswer,
      correctAnswer: request.correctAnswer,
      isCorrect: request.isCorrect,
      timestamp: new Date(),
      topic: request.topic,
      difficulty: request.difficulty,
      concepts: request.concepts,
      timeSpent: request.timeSpent,
      hintsUsed: request.hintsUsed
    };

    // Update overall progress
    progress.totalProblemsAttempted++;
    if (request.isCorrect) {
      progress.totalCorrect++;
    }
    progress.accuracyRate = (progress.totalCorrect / progress.totalProblemsAttempted) * 100;
    progress.lastActive = new Date();

    // Update learning streak
    if (request.isCorrect) {
      progress.learningStreak++;
    } else {
      progress.learningStreak = Math.max(0, progress.learningStreak - 1);
    }

    // Update topic progress
    if (!progress.topics[request.topic]) {
      progress.topics[request.topic] = {
        problemsAttempted: 0,
        correct: 0,
        accuracyRate: 0,
        lastAttempt: new Date(),
        strugglingConcepts: [],
        masteredConcepts: []
      };
    }

    const topicProgress = progress.topics[request.topic];
    topicProgress.problemsAttempted++;
    if (request.isCorrect) {
      topicProgress.correct++;
    }
    topicProgress.accuracyRate = (topicProgress.correct / topicProgress.problemsAttempted) * 100;
    topicProgress.lastAttempt = new Date();

    // Update concept progress
    request.concepts.forEach(concept => {
      if (!progress.concepts[concept]) {
        progress.concepts[concept] = {
          attempts: 0,
          correct: 0,
          accuracyRate: 0,
          lastAttempt: new Date(),
          difficulty: request.difficulty
        };
      }

      const conceptProgress = progress.concepts[concept];
      conceptProgress.attempts++;
      if (request.isCorrect) {
        conceptProgress.correct++;
      }
      conceptProgress.accuracyRate = (conceptProgress.correct / conceptProgress.attempts) * 100;
      conceptProgress.lastAttempt = new Date();

      // Update struggling/mastered concepts
      if (conceptProgress.accuracyRate < 0.5 && conceptProgress.attempts >= 3) {
        if (!topicProgress.strugglingConcepts.includes(concept)) {
          topicProgress.strugglingConcepts.push(concept);
        }
        // Remove from mastered if struggling
        topicProgress.masteredConcepts = topicProgress.masteredConcepts.filter(c => c !== concept);
      } else if (conceptProgress.accuracyRate >= 0.8 && conceptProgress.attempts >= 5) {
        if (!topicProgress.masteredConcepts.includes(concept)) {
          topicProgress.masteredConcepts.push(concept);
        }
        // Remove from struggling if mastered
        topicProgress.strugglingConcepts = topicProgress.strugglingConcepts.filter(c => c !== concept);
      }
    });

    // Add to recent attempts (keep only last 20)
    progress.recentAttempts.unshift(attempt);
    if (progress.recentAttempts.length > 20) {
      progress.recentAttempts = progress.recentAttempts.slice(0, 20);
    }

    // Generate adaptive question
    const adaptiveQuestion = this.generateAdaptiveQuestion(progress, request);

    // Generate recommendations
    const recommendations = this.generateRecommendations(progress, request);

    // Identify struggling and mastered areas
    const strugglingAreas = this.identifyStrugglingAreas(progress);
    const masteredAreas = this.identifyMasteredAreas(progress);

    return {
      success: true,
      data: {
        updatedProgress: progress,
        adaptiveQuestion,
        recommendations,
        strugglingAreas,
        masteredAreas
      },
      metadata: {
        timestamp: new Date().toISOString(),
        accuracyRate: progress.accuracyRate,
        learningStreak: progress.learningStreak
      }
    };
  }

  private generateAdaptiveQuestion(progress: StudentProgress, request: ProgressUpdateRequest): AdaptiveQuestion | undefined {
    // If student got the question wrong, generate a review question
    if (!request.isCorrect) {
      return this.generateReviewQuestion(progress, request);
    }

    // If student is struggling with concepts, generate easier questions
    const strugglingConcepts = progress.topics[request.topic]?.strugglingConcepts || [];
    if (strugglingConcepts.length > 0) {
      return this.generateEasierQuestion(progress, request, strugglingConcepts);
    }

    // If student is doing well, generate a slightly harder question
    if (progress.accuracyRate > 0.8) {
      return this.generateAdvancedQuestion(progress, request);
    }

    return undefined;
  }

  private generateReviewQuestion(progress: StudentProgress, request: ProgressUpdateRequest): AdaptiveQuestion {
    const strugglingConcepts = progress.topics[request.topic]?.strugglingConcepts || [];
    const conceptToReview = strugglingConcepts[0] || request.concepts[0];

    return {
      question: `Let's review ${conceptToReview}. Can you explain the key concept and work through a simpler example?`,
      difficulty: 'beginner',
      topic: request.topic,
      concepts: [conceptToReview],
      reasoning: `Student struggled with ${conceptToReview} in the previous question. Reviewing fundamentals.`,
      isReview: true,
      previousProblemId: request.problemId
    };
  }

  private generateEasierQuestion(progress: StudentProgress, request: ProgressUpdateRequest, strugglingConcepts: string[]): AdaptiveQuestion {
    const conceptToPractice = strugglingConcepts[0];

    return {
      question: `Let's practice ${conceptToPractice} with a step-by-step approach. Try this simpler problem:`,
      difficulty: 'beginner',
      topic: request.topic,
      concepts: [conceptToPractice],
      reasoning: `Student is struggling with ${conceptToPractice}. Providing easier practice problems.`,
      isReview: false
    };
  }

  private generateAdvancedQuestion(progress: StudentProgress, request: ProgressUpdateRequest): AdaptiveQuestion {
    const nextDifficulty = request.difficulty === 'beginner' ? 'intermediate' : 'advanced';
    const concepts = request.concepts;

    return {
      question: `Great work! Let's try a more challenging problem involving ${concepts.join(' and ')}:`,
      difficulty: nextDifficulty,
      topic: request.topic,
      concepts: concepts,
      reasoning: `Student is performing well (${progress.accuracyRate.toFixed(1)}% accuracy). Advancing to ${nextDifficulty} level.`,
      isReview: false
    };
  }

  private generateRecommendations(progress: StudentProgress, request: ProgressUpdateRequest): string[] {
    const recommendations: string[] = [];

    // Accuracy-based recommendations
    if (progress.accuracyRate < 0.5) {
      recommendations.push("Consider reviewing the fundamentals before moving to advanced topics.");
      recommendations.push("Try working through more practice problems at the beginner level.");
    } else if (progress.accuracyRate > 0.8) {
      recommendations.push("Excellent progress! You're ready for more challenging problems.");
      recommendations.push("Consider exploring advanced applications of the concepts you've mastered.");
    }

    // Topic-specific recommendations
    const topicProgress = progress.topics[request.topic];
    if (topicProgress) {
      if (topicProgress.accuracyRate < 0.6) {
        recommendations.push(`Focus on strengthening your understanding of ${request.topic} before moving on.`);
      }
      
      if (topicProgress.strugglingConcepts.length > 0) {
        recommendations.push(`Pay special attention to: ${topicProgress.strugglingConcepts.join(', ')}`);
      }
    }

    // Learning streak recommendations
    if (progress.learningStreak >= 5) {
      recommendations.push("Great learning streak! Keep up the consistent practice.");
    } else if (progress.learningStreak === 0) {
      recommendations.push("Don't get discouraged! Every mistake is a learning opportunity.");
    }

    return recommendations;
  }

  private identifyStrugglingAreas(progress: StudentProgress): string[] {
    const strugglingAreas: string[] = [];

    Object.entries(progress.topics).forEach(([topic, topicProgress]) => {
      if (topicProgress.accuracyRate < 0.6 && topicProgress.problemsAttempted >= 3) {
        strugglingAreas.push(topic);
      }
    });

    return strugglingAreas;
  }

  private identifyMasteredAreas(progress: StudentProgress): string[] {
    const masteredAreas: string[] = [];

    Object.entries(progress.topics).forEach(([topic, topicProgress]) => {
      if (topicProgress.accuracyRate >= 0.8 && topicProgress.problemsAttempted >= 5) {
        masteredAreas.push(topic);
      }
    });

    return masteredAreas;
  }

  getStudentProgress(studentId: string): StudentProgress | null {
    return studentProgressStore.get(studentId) || null;
  }

  getAllStudentsProgress(): StudentProgress[] {
    return Array.from(studentProgressStore.values());
  }

  resetStudentProgress(studentId: string): boolean {
    return studentProgressStore.delete(studentId);
  }
}

export const progressService = new ProgressService();

