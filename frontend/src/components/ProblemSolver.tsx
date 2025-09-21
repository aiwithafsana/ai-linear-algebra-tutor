import React, { useState, useEffect } from 'react';
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Lightbulb, 
  RotateCcw,
  TrendingUp,
  Target
} from 'lucide-react';
import { progressService, AdaptiveQuestion } from '../services/progressService';
import { askService } from '../services/askService';

interface ProblemSolverProps {
  studentId: string;
  topic: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  onProgressUpdate?: () => void;
}

const ProblemSolver: React.FC<ProblemSolverProps> = ({ 
  studentId, 
  topic, 
  difficulty = 'intermediate',
  onProgressUpdate 
}) => {
  const [currentProblem, setCurrentProblem] = useState<AdaptiveQuestion | null>(null);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [explanation, setExplanation] = useState('');
  const [timeSpent, setTimeSpent] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);

  useEffect(() => {
    generateProblem();
  }, [topic, difficulty]);

  useEffect(() => {
    if (startTime) {
      const interval = setInterval(() => {
        setTimeSpent(Math.floor((Date.now() - startTime.getTime()) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [startTime]);

  const generateProblem = async () => {
    try {
      setIsLoading(true);
      setStudentAnswer('');
      setIsCorrect(null);
      setCorrectAnswer('');
      setExplanation('');
      setHintsUsed(0);
      setShowHint(false);
      setTimeSpent(0);
      setStartTime(new Date());

      // Get adaptive question based on student progress
      const adaptiveQuestion = await progressService.getAdaptiveQuestion(studentId, topic, difficulty);
      
      if (adaptiveQuestion) {
        setCurrentProblem(adaptiveQuestion);
      } else {
        // Fallback: generate a standard question
        const response = await askService.askQuestion({
          question: `Create a ${difficulty} level problem about ${topic} for a student to solve. Make it clear and educational.`,
          conversationHistory: [],
          difficulty
        });

        setCurrentProblem({
          question: response.data.explanation,
          difficulty,
          topic,
          concepts: progressService.extractConcepts(response.data.explanation, topic),
          reasoning: 'Standard practice problem',
          isReview: false
        });
      }
    } catch (error) {
      console.error('Error generating problem:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!currentProblem || !studentAnswer.trim()) return;

    try {
      setIsLoading(true);

      // Get AI evaluation of the answer
      const evaluation = await askService.askQuestion({
        question: `Evaluate this student's answer for the problem: "${currentProblem.question}"\n\nStudent's answer: "${studentAnswer}"\n\nProvide: 1) Whether it's correct (true/false), 2) The correct answer, 3) An explanation of the solution.`,
        conversationHistory: [],
        difficulty: currentProblem.difficulty
      });

      // Parse the AI response to extract correctness
      const responseText = evaluation.data.explanation.toLowerCase();
      const isAnswerCorrect = responseText.includes('correct') && !responseText.includes('incorrect');
      
      setIsCorrect(isAnswerCorrect);
      setCorrectAnswer(evaluation.data.explanation);
      setExplanation(evaluation.data.explanation);

      // Update progress
      const problemId = progressService.generateProblemId();
      const progressUpdate = progressService.createProgressUpdate(
        studentId,
        problemId,
        currentProblem.question,
        studentAnswer,
        evaluation.data.explanation,
        isAnswerCorrect,
        topic,
        currentProblem.difficulty,
        currentProblem.concepts,
        timeSpent,
        hintsUsed
      );

      await progressService.updateProgress(progressUpdate);
      onProgressUpdate?.();

    } catch (error) {
      console.error('Error evaluating answer:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const useHint = () => {
    setHintsUsed(prev => prev + 1);
    setShowHint(true);
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (isLoading && !currentProblem) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Target className="h-6 w-6 text-primary-600" />
          <h3 className="text-xl font-semibold text-gray-900">Problem Solver</h3>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">{timeSpent}s</span>
          </div>
          <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(currentProblem?.difficulty || difficulty)}`}>
            {currentProblem?.difficulty || difficulty}
          </span>
        </div>
      </div>

      {/* Problem */}
      {currentProblem && (
        <div className="mb-6">
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Problem:</h4>
            <p className="text-gray-700 leading-relaxed">{currentProblem.question}</p>
          </div>

          {/* Reasoning */}
          {currentProblem.reasoning && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <div className="flex items-center space-x-2 mb-1">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">AI Reasoning:</span>
              </div>
              <p className="text-sm text-blue-700">{currentProblem.reasoning}</p>
            </div>
          )}

          {/* Hint */}
          {showHint && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <div className="flex items-center space-x-2 mb-1">
                <Lightbulb className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-900">Hint:</span>
              </div>
              <p className="text-sm text-yellow-700">
                Think about the key concepts: {currentProblem.concepts.join(', ')}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Answer Input */}
      <div className="mb-6">
        <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-2">
          Your Answer:
        </label>
        <textarea
          id="answer"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          rows={4}
          value={studentAnswer}
          onChange={(e) => setStudentAnswer(e.target.value)}
          placeholder="Enter your solution here..."
          disabled={isCorrect !== null}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-3 mb-6">
        <button
          onClick={submitAnswer}
          disabled={!studentAnswer.trim() || isLoading || isCorrect !== null}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isCorrect === null ? (
            <>
              <CheckCircle className="h-4 w-4" />
              <span>Submit Answer</span>
            </>
          ) : (
            <>
              <RotateCcw className="h-4 w-4" />
              <span>New Problem</span>
            </>
          )}
        </button>

        <button
          onClick={useHint}
          disabled={showHint || isCorrect !== null}
          className="flex items-center space-x-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Lightbulb className="h-4 w-4" />
          <span>Hint ({hintsUsed})</span>
        </button>

        <button
          onClick={generateProblem}
          disabled={isLoading}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Play className="h-4 w-4" />
          <span>New Problem</span>
        </button>
      </div>

      {/* Result */}
      {isCorrect !== null && (
        <div className={`rounded-lg p-4 mb-4 ${
          isCorrect 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center space-x-2 mb-3">
            {isCorrect ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
            <h4 className={`font-medium ${
              isCorrect ? 'text-green-900' : 'text-red-900'
            }`}>
              {isCorrect ? 'Correct!' : 'Not quite right'}
            </h4>
          </div>
          
          <div className="text-sm text-gray-700">
            <p className="mb-2">
              <strong>Time spent:</strong> {timeSpent} seconds
            </p>
            <p className="mb-2">
              <strong>Hints used:</strong> {hintsUsed}
            </p>
            <p className="mb-2">
              <strong>Explanation:</strong>
            </p>
            <div className="bg-white rounded p-3 text-sm">
              {explanation}
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
          <span className="ml-2 text-gray-600">Processing...</span>
        </div>
      )}
    </div>
  );
};

export default ProblemSolver;

