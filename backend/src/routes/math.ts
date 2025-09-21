import express from 'express';
import { mathService } from '../services/mathService';

const router = express.Router();

// POST /api/math/calculate - Perform mathematical calculations
router.post('/calculate', async (req, res) => {
  try {
    const { expression, operation, variables } = req.body;
    
    if (!expression && !operation) {
      return res.status(400).json({ error: 'Expression or operation is required' });
    }

    const result = await mathService.calculate(expression, operation, variables);
    
    res.json({
      success: true,
      result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Math calculation error:', error);
    res.status(500).json({ 
      error: 'Failed to perform calculation',
      message: error instanceof Error ? error.message : 'Invalid mathematical expression'
    });
  }
});

// POST /api/math/matrix - Matrix operations
router.post('/matrix', async (req, res) => {
  try {
    const { operation, matrices, scalar } = req.body;
    
    if (!operation || !matrices) {
      return res.status(400).json({ error: 'Operation and matrices are required' });
    }

    const result = await mathService.matrixOperation(operation, matrices, scalar);
    
    res.json({
      success: true,
      result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Matrix operation error:', error);
    res.status(500).json({ 
      error: 'Failed to perform matrix operation',
      message: error instanceof Error ? error.message : 'Invalid matrix operation'
    });
  }
});

// POST /api/math/vector - Vector operations
router.post('/vector', async (req, res) => {
  try {
    const { operation, vectors, scalar } = req.body;
    
    if (!operation || !vectors) {
      return res.status(400).json({ error: 'Operation and vectors are required' });
    }

    const result = await mathService.vectorOperation(operation, vectors, scalar);
    
    res.json({
      success: true,
      result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Vector operation error:', error);
    res.status(500).json({ 
      error: 'Failed to perform vector operation',
      message: error instanceof Error ? error.message : 'Invalid vector operation'
    });
  }
});

// POST /api/math/solve - Solve linear algebra problems
router.post('/solve', async (req, res) => {
  try {
    const { problem, method, variables } = req.body;
    
    if (!problem) {
      return res.status(400).json({ error: 'Problem description is required' });
    }

    const solution = await mathService.solveProblem(problem, method, variables);
    
    res.json({
      success: true,
      solution,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Problem solving error:', error);
    res.status(500).json({ 
      error: 'Failed to solve problem',
      message: error instanceof Error ? error.message : 'Unable to solve the given problem'
    });
  }
});

// GET /api/math/examples - Get example problems
router.get('/examples', async (req, res) => {
  try {
    const { topic, difficulty } = req.query;
    
    const examples = await mathService.getExamples(topic as string, difficulty as string);
    
    res.json({
      success: true,
      examples,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Get examples error:', error);
    res.status(500).json({ 
      error: 'Failed to get examples',
      message: 'Please try again later'
    });
  }
});

export default router;
