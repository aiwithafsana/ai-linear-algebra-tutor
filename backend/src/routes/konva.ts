import express from 'express';
import { konvaService } from '../services/konvaService';

const router = express.Router();

// POST /api/konva/render - Render JSON data to Konva shapes
router.post('/render', async (req, res) => {
  try {
    const { jsonData, options } = req.body;
    
    if (!jsonData) {
      return res.status(400).json({ error: 'JSON data is required' });
    }

    const konvaShapes = await konvaService.renderFromJSON(jsonData, options);
    
    res.json({
      success: true,
      shapes: konvaShapes,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Konva render error:', error);
    res.status(500).json({ 
      error: 'Failed to render JSON data',
      message: error instanceof Error ? error.message : 'Invalid JSON structure'
    });
  }
});

// POST /api/konva/export - Export Konva stage data
router.post('/export', async (req, res) => {
  try {
    const { stageData, format, options } = req.body;
    
    if (!stageData) {
      return res.status(400).json({ error: 'Stage data is required' });
    }

    const exportData = await konvaService.exportStage(stageData, format, options);
    
    res.json({
      success: true,
      data: exportData,
      format: format || 'json',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Konva export error:', error);
    res.status(500).json({ 
      error: 'Failed to export stage data',
      message: error instanceof Error ? error.message : 'Export failed'
    });
  }
});

// POST /api/konva/analyze - Analyze mathematical content in Konva shapes
router.post('/analyze', async (req, res) => {
  try {
    const { shapes, options } = req.body;
    
    if (!shapes || !Array.isArray(shapes)) {
      return res.status(400).json({ error: 'Shapes array is required' });
    }

    const analysis = await konvaService.analyzeMathematicalContent(shapes, options);
    
    res.json({
      success: true,
      analysis,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Konva analysis error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze shapes',
      message: error instanceof Error ? error.message : 'Analysis failed'
    });
  }
});

// GET /api/konva/templates - Get mathematical object templates
router.get('/templates', async (req, res) => {
  try {
    const { type, difficulty } = req.query;
    
    const templates = await konvaService.getTemplates(type as string, difficulty as string);
    
    res.json({
      success: true,
      templates,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Konva templates error:', error);
    res.status(500).json({ 
      error: 'Failed to get templates',
      message: 'Please try again later'
    });
  }
});

export default router;
