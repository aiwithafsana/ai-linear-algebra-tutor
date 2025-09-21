import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  Target, 
  Clock, 
  BookOpen,
  ArrowRight,
  Lightbulb,
  Calculator,
  Eye
} from 'lucide-react';
import { CurriculumTopic, Lesson } from '../data/curriculum';
import { askService } from '../services/askService';
import { useWhiteboard } from '../context/WhiteboardContext';

interface LessonViewerProps {
  topic: CurriculumTopic;
  lesson: Lesson;
  onLessonComplete?: (lesson: Lesson) => void;
}

const LessonViewer: React.FC<LessonViewerProps> = ({ 
  topic, 
  lesson, 
  onLessonComplete 
}) => {
  const { renderShapes } = useWhiteboard();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lessonContent, setLessonContent] = useState<any[]>([]);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  // Auto-generate lesson content when lesson changes
  useEffect(() => {
    generateLessonContent();
  }, [lesson]);

  const generateLessonContent = async () => {
    setIsLoading(true);
    try {
      // Generate comprehensive lesson content
      const lessonPrompt = `Create a comprehensive lesson for "${lesson.title}" from the UC Berkeley Math 54 curriculum.

Topic: ${topic.name}
Lesson: ${lesson.title}
Description: ${lesson.description}
Difficulty: ${lesson.difficulty}
Learning Objectives: ${lesson.learningObjectives.join(', ')}
Key Concepts: ${lesson.keyConcepts.join(', ')}
Example Questions: ${lesson.exampleQuestions.join(', ')}

Please create a structured lesson with the following steps:
1. Introduction and motivation
2. Core concept explanation with examples
3. Visual demonstrations (shapes for whiteboard)
4. Practice problems
5. Summary and next steps

For each step, provide:
- Clear explanations
- Mathematical notation (LaTeX)
- Visual elements (shapes for Konva.js whiteboard)
- Interactive examples

Make it engaging and educational, suitable for ${lesson.difficulty} level students.`;

      const response = await askService.askQuestion({
        question: lessonPrompt,
        conversationHistory: [],
        difficulty: lesson.difficulty
      });

      // Parse the response and create lesson steps
      const steps = [
        {
          type: 'introduction',
          title: 'Introduction',
          content: response.data.explanation,
          latex: response.data.latex,
          shapes: response.data.shapes || [],
          suggestions: response.data.suggestions || []
        }
      ];

      // Generate additional steps for the lesson
      for (let i = 0; i < lesson.learningObjectives.length; i++) {
        const objective = lesson.learningObjectives[i];
        const stepPrompt = `Create a detailed explanation for this learning objective: "${objective}" as part of the lesson "${lesson.title}". Include examples, visual elements, and practice problems.`;
        
        try {
          const stepResponse = await askService.askQuestion({
            question: stepPrompt,
            conversationHistory: [],
            difficulty: lesson.difficulty
          });

          steps.push({
            type: 'objective',
            title: `Objective ${i + 1}: ${objective}`,
            content: stepResponse.data.explanation,
            latex: stepResponse.data.latex,
            shapes: stepResponse.data.shapes || [],
            suggestions: stepResponse.data.suggestions || []
          });
        } catch (error) {
          console.error(`Error generating step for objective ${i + 1}:`, error);
        }
      }

      setLessonContent(steps);
    } catch (error) {
      console.error('Error generating lesson content:', error);
      // Fallback content
      setLessonContent([{
        type: 'introduction',
        title: 'Introduction',
        content: `Welcome to ${lesson.title}! This lesson covers ${lesson.description}.`,
        latex: '',
        shapes: [],
        suggestions: []
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const startLesson = () => {
    setIsPlaying(true);
    setCurrentStep(0);
    setCompletedSteps(new Set());
  };

  const pauseLesson = () => {
    setIsPlaying(false);
  };

  const nextStep = () => {
    if (currentStep < lessonContent.length - 1) {
      setCurrentStep(currentStep + 1);
      setCompletedSteps(prev => new Set([...prev, currentStep]));
    } else {
      // Lesson completed
      setIsPlaying(false);
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      onLessonComplete?.(lesson);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetLesson = () => {
    setCurrentStep(0);
    setCompletedSteps(new Set());
    setIsPlaying(false);
  };

  const renderLatex = (latex: string) => {
    if (!latex) return null;
    
    try {
      const cleanLatex = askService.formatLatex(latex);
      return (
        <div className="bg-gray-50 p-4 rounded-lg my-3 border border-gray-200">
          <div className="text-sm font-mono text-gray-700">
            {cleanLatex}
          </div>
        </div>
      );
    } catch (error) {
      return (
        <div className="bg-red-50 p-3 rounded-lg my-3 border border-red-200">
          <p className="text-red-600 text-sm">Error rendering LaTeX: {latex}</p>
        </div>
      );
    }
  };

  const renderVisualElements = (shapes: any[]) => {
    if (!shapes || shapes.length === 0) return null;

    // Convert AI shapes to whiteboard format and render them
    const whiteboardShapes = shapes.map((shape: any, index: number) => ({
      id: `lesson-shape-${Date.now()}-${index}`,
      type: shape.type,
      x: shape.x || shape.position?.x || 50 + (index * 100),
      y: shape.y || shape.position?.y || 50 + (index * 50),
      width: shape.width,
      height: shape.height,
      radius: shape.radius,
      points: shape.points,
      stroke: shape.color || shape.stroke || '#3B82F6',
      strokeWidth: shape.strokeWidth || 2,
      fill: shape.fill || 'transparent',
      text: shape.text,
      fontSize: shape.fontSize || 16,
      data: shape
    }));

    // Render shapes on the whiteboard
    renderShapes(whiteboardShapes);

    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 my-3">
        <div className="flex items-center space-x-2 mb-2">
          <Eye className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-900">Visual Elements</span>
        </div>
        <p className="text-xs text-blue-700">
          {shapes.length} visual element(s) have been added to the whiteboard to help illustrate this concept.
        </p>
      </div>
    );
  };

  const currentStepContent = lessonContent[currentStep];

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Lesson Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">{lesson.title}</h3>
            <p className="text-primary-100 text-sm">{topic.name}</p>
          </div>
          <div className="flex items-center space-x-2 text-primary-100">
            <Clock className="h-4 w-4" />
            <span className="text-sm">{lesson.estimatedTime}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-500">
            {currentStep + 1} of {lessonContent.length} steps
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / lessonContent.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Lesson Content */}
      <div className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Generating lesson content...</p>
            </div>
          </div>
        ) : currentStepContent ? (
          <div className="space-y-6">
            {/* Step Title */}
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                {completedSteps.has(currentStep) ? (
                  <CheckCircle className="h-6 w-6 text-green-600" />
                ) : (
                  <Target className="h-6 w-6 text-primary-600" />
                )}
              </div>
              <h4 className="text-lg font-semibold text-gray-900">
                {currentStepContent.title}
              </h4>
            </div>

            {/* Step Content */}
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 leading-relaxed">
                {currentStepContent.content}
              </p>
            </div>

            {/* LaTeX Content */}
            {currentStepContent.latex && renderLatex(currentStepContent.latex)}

            {/* Visual Elements */}
            {currentStepContent.shapes && renderVisualElements(currentStepContent.shapes)}

            {/* Suggestions */}
            {currentStepContent.suggestions && currentStepContent.suggestions.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Lightbulb className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-900">Key Points</span>
                </div>
                <ul className="text-sm text-yellow-800 space-y-1">
                  {currentStepContent.suggestions.map((suggestion: string, index: number) => (
                    <li key={index} className="flex items-start space-x-2">
                      <ArrowRight className="h-3 w-3 mt-1 flex-shrink-0" />
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No lesson content available</p>
          </div>
        )}
      </div>

      {/* Lesson Controls */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={resetLesson}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={previousStep}
              disabled={currentStep === 0}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {isPlaying ? (
              <button
                onClick={pauseLesson}
                className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                <Pause className="h-4 w-4" />
                <span>Pause</span>
              </button>
            ) : (
              <button
                onClick={startLesson}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Play className="h-4 w-4" />
                <span>Start Lesson</span>
              </button>
            )}

            <button
              onClick={nextStep}
              disabled={currentStep >= lessonContent.length - 1}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonViewer;
