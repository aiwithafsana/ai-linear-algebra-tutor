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
  FileText
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
  data?: any; // For custom mathematical objects
}

interface MathObject {
  type: 'vector' | 'matrix' | 'equation' | 'graph';
  data: any;
  position: { x: number; y: number };
  style?: {
    color?: string;
    fontSize?: number;
    strokeWidth?: number;
  };
}

interface InteractiveWhiteboardProps {
  jsonData?: any;
}

const InteractiveWhiteboard: React.FC<InteractiveWhiteboardProps> = ({ jsonData }) => {
  const { shapes: contextShapes, addShapes, clearShapes } = useWhiteboard();
  const stageRef = useRef<any>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState('pen');
  const [currentColor, setCurrentColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [shapes, setShapes] = useState<DrawingShape[]>([]);
  const [currentLine, setCurrentLine] = useState<number[]>([]);
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [jsonInput, setJsonInput] = useState('');
  const [showJsonInput, setShowJsonInput] = useState(false);

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

  // Effect to handle JSON data loading
  useEffect(() => {
    if (jsonData) {
      if (jsonData.shapes && Array.isArray(jsonData.shapes)) {
        setShapes(jsonData.shapes);
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
        }));
        setShapes(convertedShapes);
      }
    }
  }, [jsonData]);

  // Effect to sync context shapes with local shapes
  useEffect(() => {
    if (contextShapes.length > 0) {
      // Convert context shapes to local format
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
        data: shape.data
      }));
      setShapes(convertedShapes);
    }
  }, [contextShapes]);

  const handleMouseDown = (e: any) => {
    const pos = e.target.getStage().getPointerPosition();
    setIsDrawing(true);

    if (currentTool === 'pen') {
      setCurrentLine([pos.x, pos.y]);
    } else if (currentTool === 'eraser') {
      // Handle eraser logic
      const stage = e.target.getStage();
      const point = stage.getPointerPosition();
      const newShapes = shapes.filter(shape => {
        if (shape.type === 'line' && shape.points) {
          // Check if any point in the line is close to the eraser point
          for (let i = 0; i < shape.points.length; i += 2) {
            const x = shape.points[i];
            const y = shape.points[i + 1];
            const distance = Math.sqrt((x - point.x) ** 2 + (y - point.y) ** 2);
            if (distance < 20) return false;
          }
        }
        return true;
      });
      setShapes(newShapes);
    } else if (currentTool === 'text') {
      const text = prompt('Enter text:');
      if (text) {
        const newShape: DrawingShape = {
          id: Date.now().toString(),
          type: 'text',
          x: pos.x,
          y: pos.y,
          text: text,
          fontSize: 16,
          stroke: currentColor,
        };
        setShapes([...shapes, newShape]);
      }
    }
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing) return;

    const pos = e.target.getStage().getPointerPosition();

    if (currentTool === 'pen') {
      setCurrentLine([...currentLine, pos.x, pos.y]);
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
      };
      setShapes([...shapes, newShape]);
      setCurrentLine([]);
    }
  };

  const handleShapeClick = (shapeId: string) => {
    setSelectedShape(selectedShape === shapeId ? null : shapeId);
  };

  const clearCanvas = () => {
    setShapes([]);
    setCurrentLine([]);
    setSelectedShape(null);
    clearShapes(); // Also clear context shapes
  };

  const exportAsPNG = () => {
    const stage = stageRef.current;
    if (stage) {
      const dataURL = stage.toDataURL({
        mimeType: 'image/png',
        quality: 1,
      });
      const link = document.createElement('a');
      link.download = 'whiteboard.png';
      link.href = dataURL;
      link.click();
    }
  };

  const exportAsSVG = () => {
    const stage = stageRef.current;
    if (stage) {
      const svg = stage.toSVG();
      const blob = new Blob([svg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = 'whiteboard.svg';
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const exportAsJSON = () => {
    const data = {
      shapes: shapes,
      metadata: {
        created: new Date().toISOString(),
        version: '1.0',
        tool: 'AI Linear Algebra Tutor Whiteboard'
      }
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'whiteboard.json';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importJSON = () => {
    setShowJsonInput(true);
  };

  const loadFromJSON = () => {
    try {
      const data = JSON.parse(jsonInput);
      if (data.shapes && Array.isArray(data.shapes)) {
        setShapes(data.shapes);
        setShowJsonInput(false);
        setJsonInput('');
      } else {
        alert('Invalid JSON format. Expected shapes array.');
      }
    } catch (error) {
      alert('Invalid JSON format.');
    }
  };

  const addMathObject = (type: string) => {
    const stage = stageRef.current;
    if (!stage) return;

    const pos = stage.getPointerPosition();
    
    if (type === 'vector') {
      const vectorData = {
        start: { x: pos.x, y: pos.y },
        end: { x: pos.x + 100, y: pos.y + 50 },
        components: [3, 4],
        magnitude: 5
      };
      
      const newShape: DrawingShape = {
        id: Date.now().toString(),
        type: 'vector',
        x: pos.x,
        y: pos.y,
        data: vectorData,
        stroke: currentColor,
        strokeWidth: strokeWidth,
      };
      setShapes([...shapes, newShape]);
    } else if (type === 'matrix') {
      const matrixData = {
        rows: 2,
        cols: 2,
        values: [[1, 2], [3, 4]],
        position: { x: pos.x, y: pos.y }
      };
      
      const newShape: DrawingShape = {
        id: Date.now().toString(),
        type: 'matrix',
        x: pos.x,
        y: pos.y,
        data: matrixData,
        stroke: currentColor,
        strokeWidth: strokeWidth,
      };
      setShapes([...shapes, newShape]);
    }
  };

  const renderMathObject = (shape: DrawingShape) => {
    if (shape.type === 'vector' && shape.data) {
      const { start, end, components } = shape.data;
      return (
        <Group key={shape.id}>
          <Arrow
            points={[start.x, start.y, end.x, end.y]}
            stroke={shape.stroke || currentColor}
            strokeWidth={shape.strokeWidth || strokeWidth}
            fill={shape.stroke || currentColor}
            pointerLength={10}
            pointerWidth={10}
          />
          <Text
            x={end.x + 10}
            y={end.y - 10}
            text={`[${components.join(', ')}]`}
            fontSize={14}
            fill={shape.stroke || currentColor}
          />
        </Group>
      );
    } else if (shape.type === 'matrix' && shape.data) {
      const { values, position } = shape.data;
      const cellWidth = 40;
      const cellHeight = 30;
      
      return (
        <Group key={shape.id} x={position.x} y={position.y}>
          {values.map((row: number[], rowIndex: number) =>
            row.map((value: number, colIndex: number) => (
              <Rect
                key={`${rowIndex}-${colIndex}`}
                x={colIndex * cellWidth}
                y={rowIndex * cellHeight}
                width={cellWidth}
                height={cellHeight}
                stroke={shape.stroke || currentColor}
                strokeWidth={1}
              />
            ))
          )}
          {values.map((row: number[], rowIndex: number) =>
            row.map((value: number, colIndex: number) => (
              <Text
                key={`text-${rowIndex}-${colIndex}`}
                x={colIndex * cellWidth + cellWidth / 2}
                y={rowIndex * cellHeight + cellHeight / 2}
                text={value.toString()}
                fontSize={12}
                fill={shape.stroke || currentColor}
                align="center"
                verticalAlign="middle"
                offsetX={8}
                offsetY={4}
              />
            ))
          )}
        </Group>
      );
    }
    return null;
  };

  const renderShape = (shape: DrawingShape) => {
    const isSelected = selectedShape === shape.id;
    
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
            onClick={() => handleShapeClick(shape.id)}
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
            onClick={() => handleShapeClick(shape.id)}
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
            onClick={() => handleShapeClick(shape.id)}
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
            onClick={() => handleShapeClick(shape.id)}
            fontStyle={isSelected ? 'bold' : 'normal'}
          />
        );
      case 'vector':
      case 'matrix':
        return renderMathObject(shape);
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 rounded-lg">
        {/* Drawing Tools */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Tools:</span>
          {tools.map(tool => (
            <button
              key={tool.id}
              onClick={() => setCurrentTool(tool.id)}
              className={`p-2 rounded-lg transition-colors ${
                currentTool === tool.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              title={tool.label}
            >
              <tool.icon className="h-4 w-4" />
            </button>
          ))}
        </div>

        {/* Math Objects */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Math:</span>
          {mathObjects.map(obj => (
            <button
              key={obj.id}
              onClick={() => addMathObject(obj.id)}
              className="p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
              title={obj.label}
            >
              <obj.icon className="h-4 w-4" />
            </button>
          ))}
        </div>

        {/* Colors */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Colors:</span>
          {colors.map(color => (
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

        {/* Stroke Width */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Width:</span>
          <button
            onClick={() => setStrokeWidth(Math.max(1, strokeWidth - 1))}
            className="p-1 rounded bg-white text-gray-700 hover:bg-gray-100"
          >
            <Minus className="h-3 w-3" />
          </button>
          <span className="text-sm text-gray-600 w-6 text-center">{strokeWidth}</span>
          <button
            onClick={() => setStrokeWidth(Math.min(10, strokeWidth + 1))}
            className="p-1 rounded bg-white text-gray-700 hover:bg-gray-100"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 ml-auto">
          <button
            onClick={clearCanvas}
            className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            <span className="text-sm">Clear</span>
          </button>
          <button
            onClick={importJSON}
            className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            <Upload className="h-4 w-4" />
            <span className="text-sm">Import</span>
          </button>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-700">Export:</span>
        <button
          onClick={exportAsPNG}
          className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
        >
          <Download className="h-4 w-4" />
          <span className="text-sm">PNG</span>
        </button>
        <button
          onClick={exportAsSVG}
          className="flex items-center space-x-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
        >
          <Download className="h-4 w-4" />
          <span className="text-sm">SVG</span>
        </button>
        <button
          onClick={exportAsJSON}
          className="flex items-center space-x-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
        >
          <Save className="h-4 w-4" />
          <span className="text-sm">JSON</span>
        </button>
      </div>

      {/* JSON Import Modal */}
      {showJsonInput && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-h-96">
            <h3 className="text-lg font-semibold mb-4">Import JSON</h3>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="Paste your JSON data here..."
              className="w-full h-32 p-2 border border-gray-300 rounded-lg resize-none"
            />
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setShowJsonInput(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={loadFromJSON}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Load
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Canvas */}
      <div className="border-2 border-gray-200 rounded-lg overflow-hidden bg-white">
        <Stage
          width={800}
          height={400}
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

      {/* Quick Math Tools */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Math Tools</h4>
        <div className="grid grid-cols-2 gap-2">
          <button className="flex items-center justify-center space-x-2 p-3 bg-white rounded-lg hover:bg-gray-100 transition-colors">
            <Calculator className="h-4 w-4 text-gray-600" />
            <span className="text-sm text-gray-700">Matrix Calculator</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-3 bg-white rounded-lg hover:bg-gray-100 transition-colors">
            <Square className="h-4 w-4 text-gray-600" />
            <span className="text-sm text-gray-700">Graph Plotter</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InteractiveWhiteboard;