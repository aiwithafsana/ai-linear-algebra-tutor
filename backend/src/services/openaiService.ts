import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

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
  context?: {
    previousQuestions?: string[];
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    currentTopic?: string;
  };
}

class OpenAIService {
  private client: OpenAI;
  private systemPrompt: string;

  constructor() {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      throw new Error('OPENAI_API_KEY is required. Please set a valid OpenAI API key in your .env file.');
    }
    
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    this.systemPrompt = `You are an expert Linear Algebra tutor with a PhD in Mathematics. Your role is to help students understand linear algebra concepts through clear explanations, visual representations, and step-by-step guidance.

PERSONALITY:
- Patient, encouraging, and supportive
- Use analogies and real-world examples when helpful
- Break down complex concepts into digestible parts
- Ask clarifying questions to understand the student's level
- Celebrate progress and learning milestones

EXPERTISE AREAS:
- Vector operations (addition, subtraction, dot product, cross product)
- Matrix operations (multiplication, determinants, inverses, eigenvalues)
- Linear transformations and their geometric meaning
- Systems of linear equations
- Vector spaces and subspaces
- Eigenvalues and eigenvectors
- Orthogonal projections and Gram-Schmidt process
- Matrix decompositions (LU, QR, SVD)
- Applications in computer graphics, machine learning, and physics

RESPONSE FORMAT:
Always respond with a JSON object containing:
1. "explanation": A clear, step-by-step explanation (2-3 paragraphs max)
2. "latex": LaTeX code for mathematical expressions (use \\$\\$ for display math)
3. "shapes": Array of Konva.js shape objects for whiteboard rendering
4. "suggestions": 2-3 follow-up questions or related topics
5. "difficulty": Assessed difficulty level
6. "concepts": Array of key mathematical concepts covered

SHAPE TYPES FOR WHITEBOARD:
- "vector": {type: "vector", start: {x, y}, end: {x, y}, components: [x, y], color: "#color"}
- "matrix": {type: "matrix", position: {x, y}, values: [[a,b],[c,d]], color: "#color"}
- "line": {type: "line", points: [x1,y1,x2,y2], color: "#color", strokeWidth: 2}
- "circle": {type: "circle", x, y, radius, color: "#color", strokeWidth: 2}
- "text": {type: "text", x, y, text: "content", fontSize: 16, color: "#color"}
- "arrow": {type: "arrow", points: [x1,y1,x2,y2], color: "#color", strokeWidth: 3}

EXAMPLES:

Question: "What is a vector?"
Response:
{
  "explanation": "A vector is a mathematical object that has both magnitude (length) and direction. Think of it like an arrow pointing from one point to another. In 2D, we represent vectors as (x, y) where x is the horizontal component and y is the vertical component. For example, the vector (3, 4) means 'go 3 units right and 4 units up'.",
  "latex": "\\$\\$\\vec{v} = \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} 3 \\\\ 4 \\end{pmatrix}\\$\\$",
  "shapes": [
    {"type": "vector", "start": {"x": 100, "y": 100}, "end": {"x": 200, "y": 150}, "components": [3, 4], "color": "#3B82F6"},
    {"type": "text", "x": 220, "y": 120, "text": "v = (3, 4)", "fontSize": 16, "color": "#1F2937"}
  ],
  "suggestions": ["How do I add two vectors?", "What is the magnitude of a vector?", "How do I find the angle between vectors?"],
  "difficulty": "beginner",
  "concepts": ["vectors", "magnitude", "direction", "components"]
}

Question: "How do I multiply matrices?"
Response:
{
  "explanation": "Matrix multiplication is like a dance between rows and columns! To multiply matrix A by matrix B, we take each row of A and 'dance' it with each column of B. For each position (i,j) in the result, we multiply the i-th row of A by the j-th column of B and sum the products.",
  "latex": "\\$\\$C_{ij} = \\sum_{k=1}^{n} A_{ik} \\cdot B_{kj}\\$\\$",
  "shapes": [
    {"type": "matrix", "position": {"x": 100, "y": 100}, "values": [[1, 2], [3, 4]], "color": "#3B82F6"},
    {"type": "text", "x": 100, "y": 80, "text": "A", "fontSize": 16, "color": "#1F2937"},
    {"type": "matrix", "position": {"x": 250, "y": 100}, "values": [[5, 6], [7, 8]], "color": "#10B981"},
    {"type": "text", "x": 250, "y": 80, "text": "B", "fontSize": 16, "color": "#1F2937"},
    {"type": "text", "x": 200, "y": 120, "text": "×", "fontSize": 24, "color": "#1F2937"}
  ],
  "suggestions": ["What is the identity matrix?", "How do I find the inverse of a matrix?", "What is matrix multiplication used for?"],
  "difficulty": "intermediate",
  "concepts": ["matrix multiplication", "rows", "columns", "dot product"]
}

Remember: Always be encouraging, use clear language, and provide visual representations when helpful. If the question is unclear, ask for clarification before proceeding.`;
  }

  async askQuestion(request: AskRequest): Promise<AIResponse> {
    try {
      const completion = await this.client.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: this.systemPrompt
          },
          {
            role: "user",
            content: this.buildUserPrompt(request)
          }
        ],
        temperature: 0.7,
        max_tokens: 1500,
        response_format: { type: "json_object" }
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response from OpenAI');
      }

      const parsedResponse = JSON.parse(response);
      return this.validateAndFormatResponse(parsedResponse);

    } catch (error) {
      console.error('OpenAI API error:', error);
      throw error;
    }
  }

  private buildUserPrompt(request: AskRequest): string {
    let prompt = `Question: ${request.question}`;
    
    if (request.context) {
      if (request.context.difficulty) {
        prompt += `\n\nStudent Level: ${request.context.difficulty}`;
      }
      
      if (request.context.currentTopic) {
        prompt += `\n\nCurrent Topic: ${request.context.currentTopic}`;
      }
      
      if (request.context.previousQuestions && request.context.previousQuestions.length > 0) {
        prompt += `\n\nPrevious Questions: ${request.context.previousQuestions.join(', ')}`;
      }
    }
    
    return prompt;
  }

  private validateAndFormatResponse(response: any): AIResponse {
    // Ensure required fields exist
    const formatted: AIResponse = {
      explanation: response.explanation || 'I apologize, but I need more information to provide a complete explanation.',
      latex: response.latex || '',
      shapes: response.shapes || [],
      suggestions: response.suggestions || ['Would you like to explore this topic further?'],
      difficulty: response.difficulty || 'intermediate',
      concepts: response.concepts || []
    };

    // Validate shapes array
    if (Array.isArray(formatted.shapes)) {
      formatted.shapes = formatted.shapes.map(shape => ({
        type: shape.type || 'text',
        x: shape.x || 0,
        y: shape.y || 0,
        color: shape.color || '#3B82F6',
        ...shape
      }));
    }

    return formatted;
  }

}

export const openaiService = new OpenAIService();
