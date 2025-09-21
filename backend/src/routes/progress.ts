import { Router } from 'express';
import { progressService } from '../services/progressService';
import { ProgressUpdateRequest, ProgressResponse } from '../types/progressTypes';

const router = Router();

// Update student progress after answering a problem
router.post('/update', async (req, res) => {
  try {
    const updateRequest: ProgressUpdateRequest = req.body;

    // Validate required fields
    if (!updateRequest.studentId || !updateRequest.problemId || !updateRequest.question) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'studentId, problemId, and question are required'
      });
    }

    // Validate difficulty
    if (updateRequest.difficulty && !['beginner', 'intermediate', 'advanced'].includes(updateRequest.difficulty)) {
      return res.status(400).json({
        error: 'Invalid difficulty',
        message: 'Difficulty must be one of: beginner, intermediate, advanced'
      });
    }

    const response = progressService.updateProgress(updateRequest);
    res.json(response);

  } catch (error) {
    console.error('Progress update error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update student progress'
    });
  }
});

// Get student progress
router.get('/:studentId', (req, res) => {
  try {
    const { studentId } = req.params;
    const progress = progressService.getStudentProgress(studentId);

    if (!progress) {
      return res.status(404).json({
        error: 'Student not found',
        message: `No progress found for student ${studentId}`
      });
    }

    res.json({
      success: true,
      data: progress,
      metadata: {
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve student progress'
    });
  }
});

// Get all students progress (for analytics)
router.get('/', (req, res) => {
  try {
    const allProgress = progressService.getAllStudentsProgress();
    
    res.json({
      success: true,
      data: allProgress,
      metadata: {
        totalStudents: allProgress.length,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Get all progress error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve all students progress'
    });
  }
});

// Reset student progress
router.delete('/:studentId', (req, res) => {
  try {
    const { studentId } = req.params;
    const deleted = progressService.resetStudentProgress(studentId);

    if (!deleted) {
      return res.status(404).json({
        error: 'Student not found',
        message: `No progress found for student ${studentId}`
      });
    }

    res.json({
      success: true,
      message: `Progress reset for student ${studentId}`,
      metadata: {
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Reset progress error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to reset student progress'
    });
  }
});

// Get adaptive question for student
router.post('/adaptive-question', async (req, res) => {
  try {
    const { studentId, topic, difficulty } = req.body;

    if (!studentId) {
      return res.status(400).json({
        error: 'Missing required field',
        message: 'studentId is required'
      });
    }

    const progress = progressService.getStudentProgress(studentId);
    
    if (!progress) {
      return res.status(404).json({
        error: 'Student not found',
        message: `No progress found for student ${studentId}`
      });
    }

    // Generate adaptive question based on progress
    const strugglingConcepts = progress.topics[topic]?.strugglingConcepts || [];
    const topicProgress = progress.topics[topic];

    let adaptiveQuestion;

    if (strugglingConcepts.length > 0) {
      // Generate easier question for struggling concepts
      adaptiveQuestion = {
        question: `Let's practice ${strugglingConcepts[0]} with a step-by-step approach.`,
        difficulty: 'beginner',
        topic: topic,
        concepts: [strugglingConcepts[0]],
        reasoning: `Student is struggling with ${strugglingConcepts[0]}. Providing easier practice.`,
        isReview: true
      };
    } else if (topicProgress && topicProgress.accuracyRate > 0.8) {
      // Generate advanced question for high performers
      const nextDifficulty = difficulty === 'beginner' ? 'intermediate' : 'advanced';
      adaptiveQuestion = {
        question: `Great work! Let's try a more challenging problem.`,
        difficulty: nextDifficulty,
        topic: topic,
        concepts: ['advanced_application'],
        reasoning: `Student is performing well. Advancing to ${nextDifficulty} level.`,
        isReview: false
      };
    } else {
      // Generate standard question
      adaptiveQuestion = {
        question: `Let's continue practicing ${topic} concepts.`,
        difficulty: difficulty || 'intermediate',
        topic: topic,
        concepts: ['general_practice'],
        reasoning: `Standard practice question for ${topic}.`,
        isReview: false
      };
    }

    res.json({
      success: true,
      data: adaptiveQuestion,
      metadata: {
        timestamp: new Date().toISOString(),
        studentAccuracy: progress.accuracyRate,
        learningStreak: progress.learningStreak
      }
    });

  } catch (error) {
    console.error('Adaptive question error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to generate adaptive question'
    });
  }
});

export default router;

