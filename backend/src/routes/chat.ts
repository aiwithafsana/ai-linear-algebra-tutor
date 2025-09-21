import express from 'express';
import { chatService } from '../services/chatService';

const router = express.Router();

// POST /api/chat/message - Send a message to the AI tutor
router.post('/message', async (req, res) => {
  try {
    const { message, context } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required and must be a string' });
    }

    const response = await chatService.processMessage(message, context);
    
    res.json({
      success: true,
      response: response.text,
      suggestions: response.suggestions,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: 'Failed to process message',
      message: 'Please try again later'
    });
  }
});

// POST /api/chat/voice - Process voice input
router.post('/voice', async (req, res) => {
  try {
    const { audioData, transcript } = req.body;
    
    if (!transcript && !audioData) {
      return res.status(400).json({ error: 'Either audio data or transcript is required' });
    }

    const response = await chatService.processVoiceInput(transcript, audioData);
    
    res.json({
      success: true,
      response: response.text,
      audioResponse: response.audioResponse,
      suggestions: response.suggestions,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Voice chat error:', error);
    res.status(500).json({ 
      error: 'Failed to process voice input',
      message: 'Please try again later'
    });
  }
});

// GET /api/chat/suggestions - Get topic suggestions
router.get('/suggestions', async (req, res) => {
  try {
    const suggestions = await chatService.getTopicSuggestions();
    
    res.json({
      success: true,
      suggestions,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({ 
      error: 'Failed to get suggestions',
      message: 'Please try again later'
    });
  }
});

export default router;
