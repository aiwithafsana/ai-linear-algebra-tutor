const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'AI Linear Algebra Tutor API is running',
    timestamp: new Date().toISOString()
  });
});

// AI Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, context } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simple keyword-based responses for demo
    const response = generateAIResponse(message, context);
    
    res.json({
      response,
      timestamp: new Date().toISOString(),
      context: context || []
    });
  } catch (error) {
    console.error('Error processing chat request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Whiteboard save endpoint
app.post('/api/whiteboard/save', (req, res) => {
  try {
    const { canvasData, title } = req.body;
    
    // In a real application, you would save this to a database
    // For now, we'll just return a success response
    res.json({
      success: true,
      message: 'Whiteboard saved successfully',
      id: Date.now(),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error saving whiteboard:', error);
    res.status(500).json({ error: 'Failed to save whiteboard' });
  }
});

// Whiteboard load endpoint
app.get('/api/whiteboard/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    // In a real application, you would load from a database
    // For now, we'll return a sample whiteboard
    res.json({
      id,
      title: 'Sample Whiteboard',
      canvasData: {
        lines: [],
        circles: [],
        rectangles: [],
        texts: []
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error loading whiteboard:', error);
    res.status(500).json({ error: 'Failed to load whiteboard' });
  }
});

// Generate AI response based on user input
function generateAIResponse(message, context = []) {
  const input = message.toLowerCase();
  
  // Linear Algebra knowledge base
  const responses = {
    vector: {
      keywords: ['vector', 'vectors', 'magnitude', 'direction'],
      response: 'Vectors are mathematical objects that have both magnitude and direction. In linear algebra, we represent vectors as ordered lists of numbers. For example, a 2D vector v = [3, 4] has an x-component of 3 and a y-component of 4. Would you like me to explain vector operations like addition, subtraction, or dot product?'
    },
    matrix: {
      keywords: ['matrix', 'matrices', 'row', 'column', 'array'],
      response: 'A matrix is a rectangular array of numbers arranged in rows and columns. For example, a 2x3 matrix has 2 rows and 3 columns. Matrices are fundamental in linear algebra and can represent linear transformations, systems of equations, and more. What specific aspect of matrices would you like to explore?'
    },
    eigenvalue: {
      keywords: ['eigenvalue', 'eigenvector', 'eigen', 'characteristic'],
      response: 'Eigenvalues and eigenvectors are special properties of square matrices. An eigenvector is a non-zero vector that, when multiplied by a matrix, results in a scalar multiple of itself. The scalar is called the eigenvalue. These concepts are crucial for understanding linear transformations and stability analysis.'
    },
    transformation: {
      keywords: ['linear transformation', 'transformation', 'map', 'function'],
      response: 'A linear transformation is a function that maps vectors to vectors while preserving vector addition and scalar multiplication. It can be represented by a matrix. Linear transformations include rotations, reflections, scaling, and shearing. They are fundamental to understanding how geometric objects change in space.'
    },
    system: {
      keywords: ['system', 'equation', 'equations', 'solve', 'solution'],
      response: 'A system of linear equations is a collection of linear equations involving the same set of variables. We can represent such systems using matrices and solve them using various methods like Gaussian elimination, Cramer\'s rule, or matrix inversion. Would you like to learn about a specific solving method?'
    },
    determinant: {
      keywords: ['determinant', 'det', 'invertible', 'singular'],
      response: 'The determinant is a scalar value that can be computed from the elements of a square matrix. It provides important information about the matrix, such as whether it\'s invertible. A matrix is invertible if and only if its determinant is non-zero.'
    },
    basis: {
      keywords: ['basis', 'span', 'linear independence', 'dimension'],
      response: 'A basis for a vector space is a set of linearly independent vectors that span the entire space. The number of vectors in a basis is called the dimension of the vector space. Every vector in the space can be written as a unique linear combination of the basis vectors.'
    },
    help: {
      keywords: ['help', 'what can you do', 'topics', 'learn'],
      response: 'I can help you with various linear algebra topics including: vectors and vector operations, matrices and matrix operations, linear transformations, eigenvalues and eigenvectors, systems of linear equations, determinants, basis and dimension, and more. Just ask me about any specific concept you\'d like to learn!'
    }
  };

  // Find the best matching topic
  let bestMatch = null;
  let maxMatches = 0;

  for (const [topic, data] of Object.entries(responses)) {
    const matches = data.keywords.filter(keyword => input.includes(keyword)).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      bestMatch = data;
    }
  }

  if (bestMatch) {
    return bestMatch.response;
  }

  // Default response for unrecognized input
  return 'That\'s an interesting question about linear algebra! While I\'m still learning, I can help you with basic concepts like vectors, matrices, linear transformations, eigenvalues, systems of equations, and more. Could you be more specific about what you\'d like to know?';
}

// API routes are defined above
// For production, you would serve the React app from a separate server or CDN

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 AI Linear Algebra Tutor server running on port ${PORT}`);
  console.log(`📚 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`🌐 Frontend available at http://localhost:${PORT}`);
});

module.exports = app;