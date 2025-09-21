interface AIResponse {
  explanation: string;
  latex?: string;
  shapes?: any[];
  suggestions?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  concepts?: string[];
}

interface AskRequest {
  question: string;
  conversationHistory?: { role: 'user' | 'assistant'; content: string }[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

interface AskResponse {
  success: boolean;
  data: AIResponse;
  metadata: {
    processingTime: number;
    timestamp: string;
    questionLength: number;
    hasVisualization: boolean;
    hasLatex: boolean;
  };
}

class AskService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
  }

  async askQuestion(request: AskRequest): Promise<AskResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // Handle specific error codes
        if (errorData.code === 'MISSING_API_KEY') {
          throw new Error('OpenAI API key is not configured. Please contact the administrator.');
        }
        
        if (errorData.code === 'INVALID_API_KEY') {
          throw new Error('OpenAI API key is invalid. Please contact the administrator.');
        }
        
        if (errorData.code === 'RATE_LIMIT_EXCEEDED') {
          throw new Error('Rate limit exceeded. Please try again later.');
        }
        
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data: AskResponse = await response.json();
      return data;

    } catch (error) {
      console.error('Ask service error:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to get AI response');
    }
  }

  async getExamples(): Promise<{ beginner: string[]; intermediate: string[]; advanced: string[] }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/ask/examples`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.examples;

    } catch (error) {
      console.error('Get examples error:', error);
      // Return fallback examples
      return {
        beginner: [
          "What is a vector?",
          "How do I add two vectors?",
          "What is the difference between a vector and a scalar?",
          "How do I find the magnitude of a vector?",
          "What is a matrix?"
        ],
        intermediate: [
          "How do I multiply two matrices?",
          "What is the determinant of a matrix?",
          "How do I find the inverse of a matrix?",
          "What are eigenvalues and eigenvectors?",
          "How do I solve a system of linear equations?"
        ],
        advanced: [
          "Explain the spectral theorem",
          "What is the singular value decomposition?",
          "How do linear transformations work?",
          "What is the rank-nullity theorem?",
          "How are matrices used in machine learning?"
        ]
      };
    }
  }

  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/ask/health`);
      return response.ok;
    } catch (error) {
      console.error('Health check error:', error);
      return false;
    }
  }

  // Helper method to format LaTeX for display
  formatLatex(latex: string): string {
    if (!latex) return '';
    
    // Remove the $$ wrapper if present and return clean LaTeX
    return latex.replace(/^\$\$|\$\$$/g, '');
  }

  // Helper method to validate shapes for Konva.js
  validateShapes(shapes: any[]): any[] {
    if (!Array.isArray(shapes)) return [];
    
    return shapes.filter(shape => {
      if (!shape || typeof shape !== 'object') return false;
      if (!shape.type) return false;
      
      // Basic validation for required properties based on type
      switch (shape.type) {
        case 'vector':
          return shape.start && shape.end && Array.isArray(shape.components);
        case 'matrix':
          return shape.position && Array.isArray(shape.values);
        case 'line':
          return Array.isArray(shape.points) && shape.points.length >= 4;
        case 'circle':
          return typeof shape.x === 'number' && typeof shape.y === 'number' && typeof shape.radius === 'number';
        case 'text':
          return typeof shape.text === 'string';
        case 'arrow':
          return Array.isArray(shape.points) && shape.points.length >= 4;
        default:
          return true; // Allow other types
      }
    });
  }
}

export const askService = new AskService();
export type { AIResponse, AskRequest, AskResponse };
