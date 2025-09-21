import express from 'express';
import { openaiService } from '../services/openaiService';

const router = express.Router();

// POST /api/ask - Ask the AI Linear Algebra Tutor a question
router.post('/', async (req, res) => {
  try {
    const { question, context } = req.body;
    
    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Question is required and must be a non-empty string',
        message: 'Please provide a valid question about linear algebra'
      });
    }

    // Validate context if provided
    if (context) {
      if (context.difficulty && !['beginner', 'intermediate', 'advanced'].includes(context.difficulty)) {
        return res.status(400).json({
          error: 'Invalid difficulty level',
          message: 'Difficulty must be one of: beginner, intermediate, advanced'
        });
      }
    }

    // Rate limiting check (simple in-memory implementation)
    const clientId = req.ip || 'unknown';
    const now = Date.now();
    const windowMs = 60000; // 1 minute
    const maxRequests = 10; // 10 requests per minute

    // In a production environment, use Redis or a proper rate limiting library
    if (!(global as any).rateLimitStore) {
      (global as any).rateLimitStore = new Map();
    }

    const clientRequests = (global as any).rateLimitStore.get(clientId) || [];
    const recentRequests = clientRequests.filter((timestamp: number) => now - timestamp < windowMs);
    
    if (recentRequests.length >= maxRequests) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        message: 'Too many requests. Please wait a moment before asking another question.',
        retryAfter: Math.ceil((recentRequests[0] + windowMs - now) / 1000)
      });
    }

    // Add current request to rate limit store
    recentRequests.push(now);
    (global as any).rateLimitStore.set(clientId, recentRequests);

    // Process the question with OpenAI
    const startTime = Date.now();
    const response = await openaiService.askQuestion({
      question: question.trim(),
      context: context || {}
    });
    const processingTime = Date.now() - startTime;

    // Log the interaction for analytics
    console.log(`Question processed in ${processingTime}ms: "${question.substring(0, 50)}..."`);

    res.json({
      success: true,
      data: response,
      metadata: {
        processingTime,
        timestamp: new Date().toISOString(),
        questionLength: question.length,
        hasVisualization: response.shapes && response.shapes.length > 0,
        hasLatex: !!response.latex
      }
    });

  } catch (error) {
    console.error('Ask endpoint error:', error);
    
    // Handle different types of errors
    if (error instanceof Error) {
      if (error.message.includes('OPENAI_API_KEY is required')) {
        return res.status(503).json({
          error: 'OpenAI API not configured',
          message: 'The AI tutor requires a valid OpenAI API key. Please contact the administrator.',
          code: 'MISSING_API_KEY'
        });
      }
      
      if (error.message.includes('API key') || error.message.includes('invalid_api_key')) {
        return res.status(503).json({
          error: 'Invalid OpenAI API key',
          message: 'The OpenAI API key is invalid or expired. Please contact the administrator.',
          code: 'INVALID_API_KEY'
        });
      }
      
      if (error.message.includes('rate limit')) {
        return res.status(429).json({
          error: 'OpenAI rate limit exceeded',
          message: 'The AI tutor is receiving too many requests. Please try again in a few minutes.',
          retryAfter: 300,
          code: 'RATE_LIMIT_EXCEEDED'
        });
      }
    }

    res.status(500).json({
      error: 'Internal server error',
      message: 'An unexpected error occurred while processing your question. Please try again.',
      code: 'INTERNAL_ERROR'
    });
  }
});

// GET /api/ask/health - Health check for the ask endpoint
router.get('/health', (req, res) => {
  const hasValidApiKey = !!process.env.OPENAI_API_KEY && 
    process.env.OPENAI_API_KEY !== 'your_openai_api_key_here' &&
    process.env.OPENAI_API_KEY.length > 20;
  
  res.json({
    status: hasValidApiKey ? 'OK' : 'ERROR',
    message: hasValidApiKey ? 'Ask endpoint is operational' : 'OpenAI API key is required',
    features: {
      openai: hasValidApiKey,
      rateLimit: true,
      fallback: false
    },
    timestamp: new Date().toISOString()
  });
});

// GET /api/ask/examples - Get example questions
router.get('/examples', (req, res) => {
  const examples = {
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

  res.json({
    success: true,
    examples,
    timestamp: new Date().toISOString()
  });
});

export default router;
