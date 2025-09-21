import express from 'express';
import multer from 'multer';
import path from 'path';
import { whiteboardService } from '../services/whiteboardService';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/whiteboard'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `whiteboard-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// POST /api/whiteboard/save - Save whiteboard drawing
router.post('/save', async (req, res) => {
  try {
    const { drawingData, metadata } = req.body;
    
    if (!drawingData) {
      return res.status(400).json({ error: 'Drawing data is required' });
    }

    const savedDrawing = await whiteboardService.saveDrawing(drawingData, metadata);
    
    res.json({
      success: true,
      drawing: savedDrawing,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Save whiteboard error:', error);
    res.status(500).json({ 
      error: 'Failed to save drawing',
      message: 'Please try again later'
    });
  }
});

// GET /api/whiteboard/drawings - Get saved drawings
router.get('/drawings', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const drawings = await whiteboardService.getDrawings(
      parseInt(page as string), 
      parseInt(limit as string)
    );
    
    res.json({
      success: true,
      drawings: drawings.data,
      pagination: drawings.pagination,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Get drawings error:', error);
    res.status(500).json({ 
      error: 'Failed to get drawings',
      message: 'Please try again later'
    });
  }
});

// POST /api/whiteboard/analyze - Analyze drawing for math content
router.post('/analyze', upload.single('image'), async (req, res) => {
  try {
    const file = req.file;
    const { drawingData } = req.body;
    
    if (!file && !drawingData) {
      return res.status(400).json({ error: 'Either image file or drawing data is required' });
    }

    const analysis = await whiteboardService.analyzeDrawing(file, drawingData);
    
    res.json({
      success: true,
      analysis,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Analyze drawing error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze drawing',
      message: 'Please try again later'
    });
  }
});

// DELETE /api/whiteboard/:id - Delete a drawing
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await whiteboardService.deleteDrawing(id);
    
    res.json({
      success: true,
      message: 'Drawing deleted successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Delete drawing error:', error);
    res.status(500).json({ 
      error: 'Failed to delete drawing',
      message: 'Please try again later'
    });
  }
});

export default router;
