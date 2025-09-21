import fs from 'fs';
import path from 'path';

interface Drawing {
  id: string;
  data: any;
  metadata: {
    title?: string;
    description?: string;
    topic?: string;
    difficulty?: string;
    createdAt: Date;
  };
}

interface AnalysisResult {
  detectedShapes: string[];
  mathematicalContent: string[];
  suggestions: string[];
  confidence: number;
}

class WhiteboardService {
  private drawings: Drawing[] = [];
  private uploadsDir = path.join(__dirname, '../../uploads/whiteboard');

  constructor() {
    this.ensureUploadsDir();
  }

  private ensureUploadsDir() {
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

  async saveDrawing(drawingData: any, metadata?: any): Promise<Drawing> {
    const drawing: Drawing = {
      id: this.generateId(),
      data: drawingData,
      metadata: {
        title: metadata?.title || 'Untitled Drawing',
        description: metadata?.description || '',
        topic: metadata?.topic || 'General',
        difficulty: metadata?.difficulty || 'beginner',
        createdAt: new Date()
      }
    };

    this.drawings.push(drawing);
    return drawing;
  }

  async getDrawings(page: number = 1, limit: number = 10): Promise<{ data: Drawing[], pagination: any }> {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedDrawings = this.drawings
      .sort((a, b) => b.metadata.createdAt.getTime() - a.metadata.createdAt.getTime())
      .slice(startIndex, endIndex);

    return {
      data: paginatedDrawings,
      pagination: {
        page,
        limit,
        total: this.drawings.length,
        totalPages: Math.ceil(this.drawings.length / limit)
      }
    };
  }

  async analyzeDrawing(file?: Express.Multer.File, drawingData?: any): Promise<AnalysisResult> {
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock analysis based on drawing data or file
    const detectedShapes = this.detectShapes(drawingData);
    const mathematicalContent = this.extractMathematicalContent(drawingData);
    const suggestions = this.generateSuggestions(detectedShapes, mathematicalContent);

    return {
      detectedShapes,
      mathematicalContent,
      suggestions,
      confidence: Math.random() * 0.3 + 0.7 // 70-100% confidence
    };
  }

  async deleteDrawing(id: string): Promise<void> {
    const index = this.drawings.findIndex(drawing => drawing.id === id);
    if (index === -1) {
      throw new Error('Drawing not found');
    }
    this.drawings.splice(index, 1);
  }

  private detectShapes(drawingData: any): string[] {
    const shapes: string[] = [];
    
    if (!drawingData || !drawingData.drawings) {
      return shapes;
    }

    drawingData.drawings.forEach((drawing: any) => {
      if (drawing.tool === 'rectangle') {
        shapes.push('Rectangle');
      } else if (drawing.tool === 'circle') {
        shapes.push('Circle');
      } else if (drawing.tool === 'pen') {
        // Analyze pen strokes for mathematical shapes
        if (this.isLine(drawing.points)) {
          shapes.push('Line');
        } else if (this.isParabola(drawing.points)) {
          shapes.push('Parabola');
        } else if (this.isCurve(drawing.points)) {
          shapes.push('Curve');
        }
      }
    });

    return [...new Set(shapes)]; // Remove duplicates
  }

  private extractMathematicalContent(drawingData: any): string[] {
    const content: string[] = [];
    
    if (!drawingData || !drawingData.drawings) {
      return content;
    }

    // Look for mathematical symbols and patterns
    const hasAxes = this.hasCoordinateAxes(drawingData);
    const hasGrid = this.hasGridPattern(drawingData);
    const hasVectors = this.hasVectorArrows(drawingData);
    const hasMatrices = this.hasMatrixPattern(drawingData);

    if (hasAxes) content.push('Coordinate System');
    if (hasGrid) content.push('Grid Pattern');
    if (hasVectors) content.push('Vector Arrows');
    if (hasMatrices) content.push('Matrix Structure');

    return content;
  }

  private generateSuggestions(shapes: string[], content: string[]): string[] {
    const suggestions: string[] = [];

    if (shapes.includes('Line') && content.includes('Coordinate System')) {
      suggestions.push('Try plotting a linear function: y = mx + b');
      suggestions.push('Consider finding the slope and y-intercept');
    }

    if (shapes.includes('Parabola')) {
      suggestions.push('This looks like a quadratic function');
      suggestions.push('Try finding the vertex and axis of symmetry');
    }

    if (content.includes('Vector Arrows')) {
      suggestions.push('Calculate the magnitude and direction of your vectors');
      suggestions.push('Try adding or subtracting vectors');
    }

    if (content.includes('Matrix Structure')) {
      suggestions.push('Consider matrix multiplication or finding determinants');
      suggestions.push('Try row reduction or finding the inverse');
    }

    if (shapes.includes('Circle')) {
      suggestions.push('This could represent a unit circle');
      suggestions.push('Consider trigonometric functions or complex numbers');
    }

    if (suggestions.length === 0) {
      suggestions.push('Try drawing a coordinate system');
      suggestions.push('Consider plotting some functions');
      suggestions.push('Try drawing some vectors');
    }

    return suggestions;
  }

  private isLine(points: any[]): boolean {
    if (points.length < 2) return false;
    
    // Simple heuristic: check if points are roughly collinear
    const first = points[0];
    const last = points[points.length - 1];
    const dx = last.x - first.x;
    const dy = last.y - first.y;
    
    if (Math.abs(dx) < 10) return true; // Vertical line
    
    const slope = dy / dx;
    let consistentSlope = true;
    
    for (let i = 1; i < points.length - 1; i++) {
      const currentSlope = (points[i].y - first.y) / (points[i].x - first.x);
      if (Math.abs(currentSlope - slope) > 0.5) {
        consistentSlope = false;
        break;
      }
    }
    
    return consistentSlope;
  }

  private isParabola(points: any[]): boolean {
    if (points.length < 3) return false;
    
    // Simple heuristic: check for U-shape
    const first = points[0];
    const last = points[points.length - 1];
    const mid = points[Math.floor(points.length / 2)];
    
    const isUShaped = mid.y > Math.min(first.y, last.y) && 
                     mid.y > Math.max(first.y, last.y) * 0.8;
    
    return isUShaped;
  }

  private isCurve(points: any[]): boolean {
    return points.length > 5 && !this.isLine(points) && !this.isParabola(points);
  }

  private hasCoordinateAxes(drawingData: any): boolean {
    // Look for perpendicular lines that could be axes
    return drawingData.drawings.some((drawing: any) => 
      drawing.tool === 'pen' && this.isLine(drawing.points)
    );
  }

  private hasGridPattern(drawingData: any): boolean {
    // Look for multiple parallel lines
    const lines = drawingData.drawings.filter((drawing: any) => 
      drawing.tool === 'pen' && this.isLine(drawing.points)
    );
    return lines.length >= 4;
  }

  private hasVectorArrows(drawingData: any): boolean {
    // Look for arrow-like shapes or lines with arrow heads
    return drawingData.drawings.some((drawing: any) => 
      drawing.tool === 'pen' && drawing.points.length > 2
    );
  }

  private hasMatrixPattern(drawingData: any): boolean {
    // Look for rectangular arrangements
    const rectangles = drawingData.drawings.filter((drawing: any) => 
      drawing.tool === 'rectangle'
    );
    return rectangles.length >= 2;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

export const whiteboardService = new WhiteboardService();
