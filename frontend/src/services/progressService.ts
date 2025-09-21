import { 
  StudentProgress, 
  ProblemAttempt, 
  ProgressUpdateRequest, 
  ProgressResponse, 
  AdaptiveQuestion 
} from '../types/progressTypes';

class ProgressService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
  }

  async updateProgress(updateRequest: ProgressUpdateRequest): Promise<ProgressResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/progress/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateRequest),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data: ProgressResponse = await response.json();
      return data;

    } catch (error) {
      console.error('Progress update error:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to update progress');
    }
  }

  async getStudentProgress(studentId: string): Promise<StudentProgress | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/progress/${studentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data;

    } catch (error) {
      console.error('Get progress error:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to get progress');
    }
  }

  async getAdaptiveQuestion(studentId: string, topic: string, difficulty?: string): Promise<AdaptiveQuestion | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/progress/adaptive-question`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentId, topic, difficulty }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data;

    } catch (error) {
      console.error('Get adaptive question error:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to get adaptive question');
    }
  }

  async resetProgress(studentId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/progress/${studentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return true;

    } catch (error) {
      console.error('Reset progress error:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to reset progress');
    }
  }

  // Helper method to create a progress update request
  createProgressUpdate(
    studentId: string,
    problemId: string,
    question: string,
    studentAnswer: string,
    correctAnswer: string,
    isCorrect: boolean,
    topic: string,
    difficulty: 'beginner' | 'intermediate' | 'advanced',
    concepts: string[],
    timeSpent: number = 0,
    hintsUsed: number = 0
  ): ProgressUpdateRequest {
    return {
      studentId,
      problemId,
      question,
      studentAnswer,
      correctAnswer,
      isCorrect,
      topic,
      difficulty,
      concepts,
      timeSpent,
      hintsUsed
    };
  }

  // Helper method to generate a unique problem ID
  generateProblemId(): string {
    return `problem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Helper method to extract concepts from a question
  extractConcepts(question: string, topic: string): string[] {
    const conceptMap: { [key: string]: string[] } = {
      'vectors': ['magnitude', 'direction', 'components', 'dot_product', 'cross_product'],
      'matrices': ['addition', 'multiplication', 'determinant', 'inverse', 'transpose'],
      'linear-systems': ['gaussian_elimination', 'substitution', 'augmented_matrix', 'solution_set'],
      'projections': ['orthogonal', 'projection', 'least_squares', 'normal_equations'],
      'eigenvalues': ['characteristic_equation', 'eigenvectors', 'diagonalization', 'similarity'],
      'linear-transformations': ['linearity', 'kernel', 'range', 'matrix_representation']
    };

    const topicConcepts = conceptMap[topic] || [];
    const foundConcepts: string[] = [];

    topicConcepts.forEach(concept => {
      if (question.toLowerCase().includes(concept.replace('_', ' '))) {
        foundConcepts.push(concept);
      }
    });

    return foundConcepts.length > 0 ? foundConcepts : ['general_practice'];
  }
}

export const progressService = new ProgressService();
export type { StudentProgress, ProblemAttempt, ProgressUpdateRequest, ProgressResponse, AdaptiveQuestion };
