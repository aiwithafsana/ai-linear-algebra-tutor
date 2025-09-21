import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Stage, Layer, Line, Rect, Circle, Arrow, Text, Group } from 'react-konva';
import {
  Eraser,
  Square,
  Circle as CircleIcon,
  Minus,
  Plus,
  RotateCcw,
  Download,
  Upload,
  Calculator,
  ArrowRight,
  Matrix,
  Vector,
  Save,
  FileText,
  Sparkles,
  Zap
} from 'lucide-react';
import { useWhiteboard } from '../context/WhiteboardContext';

interface Point {
  x: number;
  y: number;
}

interface DrawingShape {
  id: string;
  type: 'line' | 'rect' | 'circle' | 'arrow' | 'text' | 'vector' | 'matrix';
  points?: number[];
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  radius?: number;
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
  text?: string;
  fontSize?: number;
  data?: any;
  animation?: 'fadeIn' | 'slideIn' | 'scaleIn' | 'draw';
}

interface AnimatedWhiteboardProps {
  jsonData?: any;
  className?: string;
}

const AnimatedWhiteboard: React.FC<AnimatedWhiteboardProps> = ({ jsonData, className = '' }) => {
  const { shapes: contextShapes, addShapes, clearShapes } = useWhiteboard();
  const stageRef = useRef<any>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState('pen');
  const [currentColor, setCurrentColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [shapes, setShapes] = useState<DrawingShape[]>([]);
  const [currentLine, setCurrentLine] = useState<number[]>([]);
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [showAnimations, setShowAnimations] = useState(true);
  const [animationQueue, setAnimationQueue] = useState<DrawingShape[]>([]);

  const colors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500'
  ];

  const tools = [
    { id: 'pen', icon: Minus, label: 'Pen' },
    { id: 'eraser', icon: Eraser, label: 'Eraser' },
    { id: 'rect', icon: Square, label: 'Rectangle' },
    { id: 'circle', icon: CircleIcon, label: 'Circle' },
    { id: 'arrow', icon: ArrowRight, label: 'Arrow' },
    { id: 'text', icon: FileText, label: 'Text' },
  ];

  const mathObjects = [
    { id: 'vector', icon: Vector, label: 'Vector' },
    { id: 'matrix', icon: Matrix, label: 'Matrix' },
  ];

  // Animation queue processor
  useEffect(() => {
    if (animationQueue.length > 0) {
      const timer = setTimeout(() => {
        const nextShape = animationQueue[0];
        setShapes(prev => [...prev, { ...nextShape, animation: 'fadeIn' }]);
        setAnimationQueue(prev => prev.slice(1));
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [animationQueue]);

  // Effect to handle JSON data loading with animations
  useEffect(() => {
    if (jsonData) {
      if (jsonData.shapes && Array.isArray(jsonData.shapes)) {
        if (showAnimations) {
          setAnimationQueue(jsonData.shapes.map((shape: any) => ({
            ...shape,
            id: Date.now().toString() + Math.random().toString(36).substr(2),
            animation: 'fadeIn'
          })));
        } else {
          setShapes(jsonData.shapes);
        }
      } else if (jsonData.mathObjects && Array.isArray(jsonData.mathObjects)) {
        const convertedShapes = jsonData.mathObjects.map((obj: any) => ({
          id: Date.now().toString() + Math.random().toString(36).substr(2),
          type: obj.type,
          x: obj.position.x,
          y: obj.position.y,
          data: obj.data,
          stroke: obj.style?.color || '#000000',
          strokeWidth: obj.style?.strokeWidth || 2,
          fontSize: obj.style?.fontSize || 16,
          text: obj.data?.equation || obj.data?.text,
          animation: 'slideIn'
        }));
        
        if (showAnimations) {
          setAnimationQueue(convertedShapes);
        } else {
          setShapes(convertedShapes);
        }
      }
    }
  }, [jsonData, showAnimations]);

  // Effect to sync context shapes with local shapes
  useEffect(() => {
    if (contextShapes.length > 0) {
      const convertedShapes = contextShapes.map(shape => ({
        id: shape.id,
        type: shape.type as any,
        x: shape.x,
        y: shape.y,
        width: shape.width,
        height: shape.height,
        radius: shape.radius,
        points: shape.points,
        stroke: shape.stroke,
        strokeWidth: shape.strokeWidth,
        fill: shape.fill,
        text: shape.text,
        fontSize: shape.fontSize,
        data: shape.data,
        animation: 'scaleIn'
      }));
      
      if (showAnimations) {
        setAnimationQueue(convertedShapes);
      } else {
        setShapes(convertedShapes);
      }
    }
  }, [contextShapes, showAnimations]);

  const handleMouseDown = (e: any) => {
    const pos = e.target.getStage().getPointerPosition();
    setIsDrawing(true);
    
    if (currentTool === 'pen') {
      setCurrentLine([pos.x, pos.y]);
    } else if (currentTool === 'eraser') {
      // Eraser logic
      const newShapes = shapes.filter(shape => {
        if (shape.type === 'line' && shape.points) {
          // Simple point-in-line check
          return true; // Simplified for demo
        }
        return true;
      });
      setShapes(newShapes);
    }
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing) return;
    
    const pos = e.target.getStage().getPointerPosition();
    
    if (currentTool === 'pen') {
      setCurrentLine(prev => [...prev, pos.x, pos.y]);
    }
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    
    if (currentTool === 'pen' && currentLine.length > 0) {
      const newShape: DrawingShape = {
        id: Date.now().toString(),
        type: 'line',
        points: currentLine,
        stroke: currentColor,
        strokeWidth: strokeWidth,
        animation: 'draw'
      };
      
      if (showAnimations) {
        setAnimationQueue(prev => [...prev, newShape]);
      } else {
        setShapes(prev => [...prev, newShape]);
      }
      setCurrentLine([]);
    }
  };

  const clearCanvas = () => {
    setShapes([]);
    setCurrentLine([]);
    setSelectedShape(null);
    setAnimationQueue([]);
    clearShapes();
  };

  const exportCanvas = (format: 'png' | 'svg' | 'json') => {
    if (format === 'json') {
      const dataStr = JSON.stringify({ shapes }, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'whiteboard.json';
      link.click();
    } else {
      // PNG/SVG export logic would go here
      console.log(`Exporting as ${format}`);
    }
  };

  const renderShape = (shape: DrawingShape) => {
    const isSelected = selectedShape === shape.id;
    const animationClass = shape.animation || '';

    switch (shape.type) {
      case 'line':
        return (
          <Line
            key={shape.id}
            points={shape.points}
            stroke={shape.stroke}
            strokeWidth={isSelected ? (shape.strokeWidth || strokeWidth) + 2 : shape.strokeWidth}
            lineCap="round"
            lineJoin="round"
            onClick={() => setSelectedShape(shape.id)}
            opacity={animationClass === 'fadeIn' ? 0 : 1}
            scaleX={animationClass === 'scaleIn' ? 0.1 : 1}
            scaleY={animationClass === 'scaleIn' ? 0.1 : 1}
            x={animationClass === 'slideIn' ? -100 : 0}
            y={animationClass === 'slideIn' ? -100 : 0}
          />
        );
      case 'rect':
        return (
          <Rect
            key={shape.id}
            x={shape.x}
            y={shape.y}
            width={shape.width}
            height={shape.height}
            stroke={shape.stroke}
            strokeWidth={isSelected ? (shape.strokeWidth || strokeWidth) + 2 : shape.strokeWidth}
            fill="transparent"
            onClick={() => setSelectedShape(shape.id)}
            opacity={animationClass === 'fadeIn' ? 0 : 1}
            scaleX={animationClass === 'scaleIn' ? 0.1 : 1}
            scaleY={animationClass === 'scaleIn' ? 0.1 : 1}
          />
        );
      case 'circle':
        return (
          <Circle
            key={shape.id}
            x={shape.x}
            y={shape.y}
            radius={shape.radius}
            stroke={shape.stroke}
            strokeWidth={isSelected ? (shape.strokeWidth || strokeWidth) + 2 : shape.strokeWidth}
            fill="transparent"
            onClick={() => setSelectedShape(shape.id)}
            opacity={animationClass === 'fadeIn' ? 0 : 1}
            scaleX={animationClass === 'scaleIn' ? 0.1 : 1}
            scaleY={animationClass === 'scaleIn' ? 0.1 : 1}
          />
        );
      case 'text':
        return (
          <Text
            key={shape.id}
            x={shape.x}
            y={shape.y}
            text={shape.text}
            fontSize={shape.fontSize}
            fill={shape.stroke}
            onClick={() => setSelectedShape(shape.id)}
            opacity={animationClass === 'fadeIn' ? 0 : 1}
            scaleX={animationClass === 'scaleIn' ? 0.1 : 1}
            scaleY={animationClass === 'scaleIn' ? 0.1 : 1}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Calculator className="h-6 w-6 text-white" />
            <h2 className="text-xl font-semibold text-white">Interactive Whiteboard</h2>
            {showAnimations && (
              <div className="flex items-center space-x-1">
                <Sparkles className="h-4 w-4 text-yellow-300" />
                <span className="text-yellow-100 text-sm">Animated</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAnimations(!showAnimations)}
              className={`p-2 rounded-lg transition-colors ${
                showAnimations 
                  ? 'bg-yellow-500 text-white' 
                  : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
              }`}
            >
              <Zap className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {/* Drawing Tools */}
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setCurrentTool(tool.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                currentTool === tool.id
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <tool.icon className="h-4 w-4" />
              <span className="text-sm">{tool.label}</span>
            </button>
          ))}
        </div>

        {/* Color and Size Controls */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Color:</span>
            <div className="flex space-x-1">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setCurrentColor(color)}
                  className={`w-6 h-6 rounded-full border-2 ${
                    currentColor === color ? 'border-gray-800' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Size:</span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setStrokeWidth(Math.max(1, strokeWidth - 1))}
                className="p-1 rounded bg-gray-100 hover:bg-gray-200"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="text-sm w-8 text-center">{strokeWidth}</span>
              <button
                onClick={() => setStrokeWidth(Math.min(10, strokeWidth + 1))}
                className="p-1 rounded bg-gray-100 hover:bg-gray-200"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="p-4">
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <Stage
            width={800}
            height={500}
            onMouseDown={handleMouseDown}
            onMousemove={handleMouseMove}
            onMouseup={handleMouseUp}
            ref={stageRef}
          >
            <Layer>
              {shapes.map(renderShape)}
              {currentLine.length > 0 && (
                <Line
                  points={currentLine}
                  stroke={currentColor}
                  strokeWidth={strokeWidth}
                  lineCap="round"
                  lineJoin="round"
                />
              )}
            </Layer>
          </Stage>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={clearCanvas}
              className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Clear</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => exportCanvas('png')}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>PNG</span>
            </button>
            <button
              onClick={() => exportCanvas('svg')}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>SVG</span>
            </button>
            <button
              onClick={() => exportCanvas('json')}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>JSON</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedWhiteboard;
