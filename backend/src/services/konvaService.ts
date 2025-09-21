interface KonvaShape {
  id: string;
  type: string;
  attrs: any;
  children?: KonvaShape[];
}

interface MathObject {
  type: 'vector' | 'matrix' | 'equation' | 'graph' | 'function';
  data: any;
  position: { x: number; y: number };
  style?: {
    color?: string;
    fontSize?: number;
    strokeWidth?: number;
  };
}

interface AnalysisResult {
  detectedObjects: string[];
  mathematicalContent: string[];
  suggestions: string[];
  confidence: number;
  errors?: string[];
}

interface Template {
  id: string;
  name: string;
  type: string;
  difficulty: string;
  data: any;
  description: string;
}

class KonvaService {
  async renderFromJSON(jsonData: any, options?: any): Promise<KonvaShape[]> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (typeof jsonData === 'string') {
      try {
        jsonData = JSON.parse(jsonData);
      } catch (error) {
        throw new Error('Invalid JSON string');
      }
    }

    const shapes: KonvaShape[] = [];

    if (jsonData.shapes && Array.isArray(jsonData.shapes)) {
      // Handle existing shapes format
      jsonData.shapes.forEach((shape: any) => {
        shapes.push(this.convertToKonvaShape(shape));
      });
    } else if (jsonData.mathObjects && Array.isArray(jsonData.mathObjects)) {
      // Handle mathematical objects
      jsonData.mathObjects.forEach((obj: MathObject) => {
        shapes.push(this.renderMathObject(obj));
      });
    } else if (Array.isArray(jsonData)) {
      // Handle direct array of shapes
      jsonData.forEach((shape: any) => {
        shapes.push(this.convertToKonvaShape(shape));
      });
    } else {
      throw new Error('Invalid JSON structure. Expected shapes array or mathObjects array.');
    }

    return shapes;
  }

  async exportStage(stageData: any, format: string = 'json', options?: any): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 300));

    switch (format.toLowerCase()) {
      case 'json':
        return this.exportAsJSON(stageData);
      case 'svg':
        return this.exportAsSVG(stageData);
      case 'png':
        return this.exportAsPNG(stageData);
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  async analyzeMathematicalContent(shapes: KonvaShape[], options?: any): Promise<AnalysisResult> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const detectedObjects: string[] = [];
    const mathematicalContent: string[] = [];
    const suggestions: string[] = [];
    const errors: string[] = [];
    let confidence = 0;

    shapes.forEach(shape => {
      switch (shape.type) {
        case 'vector':
          detectedObjects.push('Vector');
          mathematicalContent.push('Vector with components');
          suggestions.push('Calculate magnitude and direction');
          confidence += 0.8;
          break;
        case 'matrix':
          detectedObjects.push('Matrix');
          mathematicalContent.push('Matrix structure');
          suggestions.push('Perform matrix operations or find determinant');
          confidence += 0.9;
          break;
        case 'line':
          if (this.isStraightLine(shape)) {
            detectedObjects.push('Linear function');
            mathematicalContent.push('Linear relationship');
            suggestions.push('Find slope and y-intercept');
            confidence += 0.7;
          } else if (this.isCurve(shape)) {
            detectedObjects.push('Curve');
            mathematicalContent.push('Non-linear relationship');
            suggestions.push('Identify function type (quadratic, exponential, etc.)');
            confidence += 0.6;
          }
          break;
        case 'circle':
          detectedObjects.push('Circle');
          mathematicalContent.push('Circular geometry');
          suggestions.push('Find center, radius, and equation');
          confidence += 0.8;
          break;
        case 'text':
          const text = shape.attrs.text || '';
          if (this.containsMathSymbols(text)) {
            detectedObjects.push('Mathematical expression');
            mathematicalContent.push('Text with mathematical content');
            suggestions.push('Parse and evaluate the expression');
            confidence += 0.9;
          }
          break;
      }
    });

    // Calculate average confidence
    if (shapes.length > 0) {
      confidence = Math.min(confidence / shapes.length, 1);
    }

    return {
      detectedObjects: [...new Set(detectedObjects)],
      mathematicalContent: [...new Set(mathematicalContent)],
      suggestions: [...new Set(suggestions)],
      confidence,
      errors: errors.length > 0 ? errors : undefined
    };
  }

  async getTemplates(type?: string, difficulty?: string): Promise<Template[]> {
    await new Promise(resolve => setTimeout(resolve, 200));

    const templates: Template[] = [
      {
        id: 'vector-2d',
        name: '2D Vector',
        type: 'vector',
        difficulty: 'beginner',
        data: {
          start: { x: 100, y: 100 },
          end: { x: 200, y: 150 },
          components: [3, 4],
          magnitude: 5
        },
        description: 'A 2D vector with components [3, 4]'
      },
      {
        id: 'vector-3d',
        name: '3D Vector',
        type: 'vector',
        difficulty: 'intermediate',
        data: {
          start: { x: 100, y: 100, z: 0 },
          end: { x: 200, y: 150, z: 50 },
          components: [1, 2, 3],
          magnitude: Math.sqrt(14)
        },
        description: 'A 3D vector with components [1, 2, 3]'
      },
      {
        id: 'matrix-2x2',
        name: '2x2 Matrix',
        type: 'matrix',
        difficulty: 'beginner',
        data: {
          rows: 2,
          cols: 2,
          values: [[1, 2], [3, 4]],
          position: { x: 100, y: 100 }
        },
        description: 'A 2x2 matrix for basic operations'
      },
      {
        id: 'matrix-3x3',
        name: '3x3 Matrix',
        type: 'matrix',
        difficulty: 'intermediate',
        data: {
          rows: 3,
          cols: 3,
          values: [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
          position: { x: 100, y: 100 }
        },
        description: 'A 3x3 identity matrix'
      },
      {
        id: 'linear-function',
        name: 'Linear Function',
        type: 'function',
        difficulty: 'beginner',
        data: {
          type: 'linear',
          equation: 'y = 2x + 1',
          points: [
            { x: 0, y: 1 },
            { x: 1, y: 3 },
            { x: 2, y: 5 }
          ]
        },
        description: 'A linear function y = 2x + 1'
      },
      {
        id: 'quadratic-function',
        name: 'Quadratic Function',
        type: 'function',
        difficulty: 'intermediate',
        data: {
          type: 'quadratic',
          equation: 'y = x² - 4x + 3',
          points: [
            { x: 0, y: 3 },
            { x: 1, y: 0 },
            { x: 2, y: -1 },
            { x: 3, y: 0 },
            { x: 4, y: 3 }
          ]
        },
        description: 'A quadratic function y = x² - 4x + 3'
      }
    ];

    let filteredTemplates = templates;

    if (type) {
      filteredTemplates = filteredTemplates.filter(t => t.type === type);
    }

    if (difficulty) {
      filteredTemplates = filteredTemplates.filter(t => t.difficulty === difficulty);
    }

    return filteredTemplates;
  }

  private convertToKonvaShape(shape: any): KonvaShape {
    const baseShape = {
      id: shape.id || this.generateId(),
      type: shape.type,
      attrs: {
        ...shape,
        id: undefined,
        type: undefined
      }
    };

    return baseShape;
  }

  private renderMathObject(obj: MathObject): KonvaShape {
    switch (obj.type) {
      case 'vector':
        return {
          id: this.generateId(),
          type: 'vector',
          attrs: {
            start: obj.data.start,
            end: obj.data.end,
            components: obj.data.components,
            stroke: obj.style?.color || '#000000',
            strokeWidth: obj.style?.strokeWidth || 2
          }
        };
      case 'matrix':
        return {
          id: this.generateId(),
          type: 'matrix',
          attrs: {
            position: obj.data.position,
            values: obj.data.values,
            rows: obj.data.rows,
            cols: obj.data.cols,
            stroke: obj.style?.color || '#000000',
            strokeWidth: obj.style?.strokeWidth || 1
          }
        };
      case 'equation':
        return {
          id: this.generateId(),
          type: 'text',
          attrs: {
            x: obj.position.x,
            y: obj.position.y,
            text: obj.data.equation,
            fontSize: obj.style?.fontSize || 16,
            fill: obj.style?.color || '#000000'
          }
        };
      default:
        throw new Error(`Unsupported math object type: ${obj.type}`);
    }
  }

  private exportAsJSON(stageData: any): any {
    return {
      version: '1.0',
      timestamp: new Date().toISOString(),
      stage: stageData,
      metadata: {
        tool: 'AI Linear Algebra Tutor',
        format: 'konva-json'
      }
    };
  }

  private exportAsSVG(stageData: any): string {
    // This would typically convert Konva stage data to SVG
    // For now, return a placeholder
    return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400">
      <!-- SVG content would be generated from Konva stage data -->
    </svg>`;
  }

  private exportAsPNG(stageData: any): string {
    // This would typically convert Konva stage data to PNG data URL
    // For now, return a placeholder
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
  }

  private isStraightLine(shape: KonvaShape): boolean {
    if (shape.type !== 'line' || !shape.attrs.points) return false;
    
    const points = shape.attrs.points;
    if (points.length < 4) return false;

    // Simple heuristic: check if points are roughly collinear
    const first = { x: points[0], y: points[1] };
    const last = { x: points[points.length - 2], y: points[points.length - 1] };
    
    if (Math.abs(last.x - first.x) < 10) return true; // Vertical line
    
    const slope = (last.y - first.y) / (last.x - first.x);
    let consistentSlope = true;
    
    for (let i = 2; i < points.length - 2; i += 2) {
      const currentSlope = (points[i + 1] - first.y) / (points[i] - first.x);
      if (Math.abs(currentSlope - slope) > 0.5) {
        consistentSlope = false;
        break;
      }
    }
    
    return consistentSlope;
  }

  private isCurve(shape: KonvaShape): boolean {
    if (shape.type !== 'line' || !shape.attrs.points) return false;
    
    const points = shape.attrs.points;
    return points.length > 6 && !this.isStraightLine(shape);
  }

  private containsMathSymbols(text: string): boolean {
    const mathSymbols = /[+\-*/=<>()\[\]{}^√∑∏∫∂∇∞π]/;
    return mathSymbols.test(text);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

export const konvaService = new KonvaService();

