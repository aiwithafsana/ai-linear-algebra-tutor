import React, { useState } from 'react';
import { Code, Play, Copy, Check } from 'lucide-react';

interface JSONRendererProps {
  onRender: (jsonData: any) => void;
}

const JSONRenderer: React.FC<JSONRendererProps> = ({ onRender }) => {
  const [jsonInput, setJsonInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [selectedExample, setSelectedExample] = useState('');

  const examples = {
    'vector-2d': {
      name: '2D Vector',
      json: {
        mathObjects: [
          {
            type: 'vector',
            data: {
              start: { x: 100, y: 100 },
              end: { x: 200, y: 150 },
              components: [3, 4],
              magnitude: 5
            },
            position: { x: 100, y: 100 },
            style: {
              color: '#FF0000',
              strokeWidth: 3
            }
          }
        ]
      }
    },
    'matrix-2x2': {
      name: '2x2 Matrix',
      json: {
        mathObjects: [
          {
            type: 'matrix',
            data: {
              rows: 2,
              cols: 2,
              values: [[1, 2], [3, 4]],
              position: { x: 100, y: 100 }
            },
            position: { x: 100, y: 100 },
            style: {
              color: '#0000FF',
              strokeWidth: 2
            }
          }
        ]
      }
    },
    'linear-equation': {
      name: 'Linear Equation',
      json: {
        mathObjects: [
          {
            type: 'equation',
            data: {
              equation: 'y = 2x + 1',
              type: 'linear'
            },
            position: { x: 100, y: 100 },
            style: {
              color: '#00AA00',
              fontSize: 18
            }
          }
        ]
      }
    },
    'mixed-shapes': {
      name: 'Mixed Shapes',
      json: {
        shapes: [
          {
            id: 'line1',
            type: 'line',
            points: [50, 50, 150, 100],
            stroke: '#000000',
            strokeWidth: 2
          },
          {
            id: 'circle1',
            type: 'circle',
            x: 200,
            y: 100,
            radius: 30,
            stroke: '#FF0000',
            strokeWidth: 2
          },
          {
            id: 'rect1',
            type: 'rect',
            x: 300,
            y: 70,
            width: 60,
            height: 60,
            stroke: '#0000FF',
            strokeWidth: 2
          }
        ]
      }
    },
    'vector-operations': {
      name: 'Vector Operations',
      json: {
        mathObjects: [
          {
            type: 'vector',
            data: {
              start: { x: 100, y: 100 },
              end: { x: 200, y: 100 },
              components: [4, 0],
              magnitude: 4
            },
            position: { x: 100, y: 100 },
            style: { color: '#FF0000', strokeWidth: 3 }
          },
          {
            type: 'vector',
            data: {
              start: { x: 100, y: 100 },
              end: { x: 150, y: 150 },
              components: [2, 2],
              magnitude: Math.sqrt(8)
            },
            position: { x: 100, y: 100 },
            style: { color: '#00FF00', strokeWidth: 3 }
          },
          {
            type: 'vector',
            data: {
              start: { x: 100, y: 100 },
              end: { x: 250, y: 150 },
              components: [6, 2],
              magnitude: Math.sqrt(40)
            },
            position: { x: 100, y: 100 },
            style: { color: '#0000FF', strokeWidth: 3 }
          }
        ]
      }
    }
  };

  const loadExample = (exampleKey: string) => {
    const example = examples[exampleKey as keyof typeof examples];
    if (example) {
      setJsonInput(JSON.stringify(example.json, null, 2));
      setSelectedExample(exampleKey);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(jsonInput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const renderJSON = () => {
    try {
      const jsonData = JSON.parse(jsonInput);
      onRender(jsonData);
    } catch (error) {
      alert('Invalid JSON format. Please check your syntax.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">JSON Renderer</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={renderJSON}
            disabled={!jsonInput.trim()}
            className="flex items-center space-x-1 px-3 py-1 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Play className="h-4 w-4" />
            <span>Render</span>
          </button>
          <button
            onClick={copyToClipboard}
            className="flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Example Buttons */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Quick Examples:</label>
        <div className="flex flex-wrap gap-2">
          {Object.entries(examples).map(([key, example]) => (
            <button
              key={key}
              onClick={() => loadExample(key)}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                selectedExample === key
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {example.name}
            </button>
          ))}
        </div>
      </div>

      {/* JSON Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">JSON Data:</label>
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder="Enter your JSON data here or select an example above..."
          className="w-full h-40 p-3 border border-gray-300 rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {/* JSON Structure Help */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">JSON Structure Help</h4>
        <div className="text-xs text-blue-800 space-y-1">
          <p><strong>For shapes:</strong> Use <code>{"{shapes: [...]}"}</code> format</p>
          <p><strong>For math objects:</strong> Use <code>{"{mathObjects: [...]}"}</code> format</p>
          <p><strong>Supported types:</strong> line, rect, circle, text, vector, matrix, equation</p>
          <p><strong>Required fields:</strong> type, position (x, y), and appropriate data fields</p>
        </div>
      </div>
    </div>
  );
};

export default JSONRenderer;
