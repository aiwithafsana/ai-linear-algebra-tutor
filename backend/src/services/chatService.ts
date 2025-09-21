interface ChatResponse {
  text: string;
  suggestions: string[];
  audioResponse?: string;
}

interface ChatContext {
  previousMessages?: string[];
  currentTopic?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

class ChatService {
  private topicSuggestions = [
    'Vector operations and properties',
    'Matrix multiplication and determinants',
    'Linear transformations',
    'Eigenvalues and eigenvectors',
    'Systems of linear equations',
    'Vector spaces and subspaces',
    'Linear independence and basis',
    'Orthogonal vectors and projections',
    'Gram-Schmidt process',
    'Diagonalization of matrices'
  ];

  async processMessage(message: string, context?: ChatContext): Promise<ChatResponse> {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));

    const lowerMessage = message.toLowerCase();
    const response = this.generateResponse(lowerMessage, context);
    const suggestions = this.getRelevantSuggestions(lowerMessage);

    return {
      text: response,
      suggestions
    };
  }

  async processVoiceInput(transcript?: string, audioData?: any): Promise<ChatResponse> {
    // Simulate voice processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const message = transcript || 'I heard your voice input. Could you please repeat your question?';
    const response = this.generateResponse(message.toLowerCase());
    const suggestions = this.getRelevantSuggestions(message.toLowerCase());

    return {
      text: response,
      suggestions,
      audioResponse: `I'll speak the response: ${response}`
    };
  }

  async getTopicSuggestions(): Promise<string[]> {
    return this.topicSuggestions;
  }

  private generateResponse(message: string, context?: ChatContext): string {
    // Basic keyword-based response generation
    if (message.includes('vector') || message.includes('vectors')) {
      return this.getVectorResponse(context?.difficulty);
    } else if (message.includes('matrix') || message.includes('matrices')) {
      return this.getMatrixResponse(context?.difficulty);
    } else if (message.includes('eigenvalue') || message.includes('eigenvector')) {
      return this.getEigenvalueResponse(context?.difficulty);
    } else if (message.includes('linear transformation') || message.includes('transformation')) {
      return this.getTransformationResponse(context?.difficulty);
    } else if (message.includes('system') || message.includes('equation')) {
      return this.getSystemResponse(context?.difficulty);
    } else if (message.includes('help') || message.includes('what can you do')) {
      return this.getHelpResponse();
    } else if (message.includes('hello') || message.includes('hi')) {
      return this.getGreetingResponse();
    } else {
      return this.getGeneralResponse();
    }
  }

  private getVectorResponse(difficulty?: string): string {
    const responses = {
      beginner: "Great question! Vectors are like arrows that have both length and direction. Think of them as instructions for how to move from one point to another. In 2D, we write them as (x, y), like (3, 4) meaning 'go 3 units right and 4 units up'. Would you like me to show you how to add vectors or calculate their length?",
      intermediate: "Vectors are the building blocks of linear algebra! They can be added together, scaled up or down, and we can find angles between them. The dot product tells us about the relationship between vectors, while the cross product (in 3D) creates a new vector perpendicular to both. What specific vector concept would you like to explore?",
      advanced: "Vectors form the foundation of vector spaces and linear transformations. They can be represented in different bases, undergo coordinate transformations, and extend to infinite-dimensional function spaces. Are you working with specific vector operations, transformations, or perhaps exploring applications in machine learning or physics?"
    };
    return responses[difficulty as keyof typeof responses] || responses.intermediate;
  }

  private getMatrixResponse(difficulty?: string): string {
    const responses = {
      beginner: "Matrices are like organized grids of numbers! Think of them as tables where each number has a specific position. They're super useful for solving systems of equations and transforming shapes. A 2×3 matrix has 2 rows and 3 columns. Would you like me to show you how to add matrices or multiply them?",
      intermediate: "Matrices are incredibly powerful tools! They can represent linear transformations, solve systems of equations, and even compress data. Matrix multiplication follows specific rules - it's like a dance between rows and columns. The determinant tells us if a matrix can be 'undone' (inverted). What matrix operation are you curious about?",
      advanced: "Matrices are the language of linear transformations! They connect vector spaces and reveal deep geometric insights. Eigenvalues and eigenvectors show us the matrix's 'personality' - how it stretches and rotates space. Are you exploring specific decompositions like SVD, or perhaps applications in machine learning or quantum mechanics?"
    };
    return responses[difficulty as keyof typeof responses] || responses.intermediate;
  }

  private getEigenvalueResponse(difficulty?: string): string {
    const responses = {
      beginner: "Eigenvalues and eigenvectors are special properties of square matrices! An eigenvector is a non-zero vector that, when multiplied by a matrix, only changes by a scalar factor (the eigenvalue). They help us understand how the matrix transforms space. Would you like to see how to find them?",
      intermediate: "Eigenvalues and eigenvectors reveal the matrix's geometric behavior. The characteristic polynomial det(A - λI) = 0 gives us the eigenvalues. Eigenvectors corresponding to different eigenvalues are linearly independent. Are you working with diagonalization or stability analysis?",
      advanced: "Eigenvalues and eigenvectors are central to understanding linear transformations. The spectral theorem applies to symmetric matrices, and the Jordan canonical form generalizes diagonalization. In quantum mechanics, they represent observable quantities. What's your specific application area?"
    };
    return responses[difficulty as keyof typeof responses] || responses.intermediate;
  }

  private getTransformationResponse(difficulty?: string): string {
    const responses = {
      beginner: "Linear transformations are functions that map vectors to vectors while preserving vector addition and scalar multiplication. They can be represented by matrices and include rotations, reflections, and scaling. What type of transformation are you studying?",
      intermediate: "Linear transformations preserve the structure of vector spaces. They can be represented by matrices, and composition of transformations corresponds to matrix multiplication. The kernel and image are important subspaces. Are you working with specific transformation matrices?",
      advanced: "Linear transformations are homomorphisms between vector spaces. The rank-nullity theorem connects their dimensions. In infinite dimensions, we study bounded linear operators. Are you working with specific operator theory or functional analysis concepts?"
    };
    return responses[difficulty as keyof typeof responses] || responses.intermediate;
  }

  private getSystemResponse(difficulty?: string): string {
    const responses = {
      beginner: "Systems of linear equations can be solved using various methods like substitution, elimination, or matrix methods. The solution can be unique, have infinitely many solutions, or no solution. Would you like to learn about Gaussian elimination?",
      intermediate: "Linear systems can be represented as Ax = b, where A is the coefficient matrix. The system has a unique solution if det(A) ≠ 0. Gaussian elimination with partial pivoting is numerically stable. Are you working with specific solution methods?",
      advanced: "Linear systems connect to fundamental concepts like rank, nullity, and the Fredholm alternative. Iterative methods like Jacobi and Gauss-Seidel are important for large systems. Are you studying numerical linear algebra or specific applications?"
    };
    return responses[difficulty as keyof typeof responses] || responses.intermediate;
  }

  private getHelpResponse(): string {
    return "I'm here to help you master linear algebra! 🎓 I can explain concepts like vectors and matrices, help you solve problems step-by-step, and even work with you on the interactive whiteboard. Try asking me about: vector operations, matrix multiplication, eigenvalues, linear transformations, or any specific problem you're working on. What would you like to explore first?";
  }

  private getGreetingResponse(): string {
    return "Hello! I'm your AI Linear Algebra tutor. I'm here to help you understand vectors, matrices, linear transformations, and other linear algebra concepts. What would you like to learn about today?";
  }

  private getGeneralResponse(): string {
    return "That's an interesting question about linear algebra! I'd be happy to help you understand this concept better. Could you provide more specific details about what you'd like to know? For example, are you working with vectors, matrices, or another linear algebra topic?";
  }

  private getRelevantSuggestions(message: string): string[] {
    const suggestions: string[] = [];
    
    if (message.includes('vector')) {
      suggestions.push('Vector addition and subtraction', 'Dot product and cross product', 'Vector magnitude and direction');
    } else if (message.includes('matrix')) {
      suggestions.push('Matrix multiplication', 'Matrix determinants', 'Matrix inverse');
    } else if (message.includes('eigen')) {
      suggestions.push('Finding eigenvalues', 'Finding eigenvectors', 'Matrix diagonalization');
    } else if (message.includes('transformation')) {
      suggestions.push('Rotation matrices', 'Reflection matrices', 'Scaling transformations');
    } else {
      suggestions.push('Vector basics', 'Matrix operations', 'Linear systems');
    }

    return suggestions.slice(0, 3);
  }
}

export const chatService = new ChatService();
