import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Target, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Star,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import { progressService, StudentProgress, AdaptiveQuestion } from '../services/progressService';

interface ProgressTrackerProps {
  studentId: string;
  onAdaptiveQuestion?: (question: AdaptiveQuestion) => void;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ 
  studentId, 
  onAdaptiveQuestion 
}) => {
  const [progress, setProgress] = useState<StudentProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProgress();
  }, [studentId]);

  const loadProgress = async () => {
    try {
      setLoading(true);
      const studentProgress = await progressService.getStudentProgress(studentId);
      setProgress(studentProgress);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load progress');
    } finally {
      setLoading(false);
    }
  };

  const handleResetProgress = async () => {
    if (window.confirm('Are you sure you want to reset all progress? This action cannot be undone.')) {
      try {
        await progressService.resetProgress(studentId);
        await loadProgress();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to reset progress');
      }
    }
  };

  const getAdaptiveQuestion = async (topic: string, difficulty?: string) => {
    try {
      const question = await progressService.getAdaptiveQuestion(studentId, topic, difficulty);
      if (question && onAdaptiveQuestion) {
        onAdaptiveQuestion(question);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get adaptive question');
    }
  };

  if (loading) {
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

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-2">
          <XCircle className="h-5 w-5 text-red-600" />
          <h3 className="text-lg font-semibold text-red-900">Error Loading Progress</h3>
        </div>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={loadProgress}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center">
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Progress Data</h3>
          <p className="text-gray-600 mb-4">
            Start solving problems to see your progress tracked here.
          </p>
        </div>
      </div>
    );
  }

  const strugglingTopics = Object.entries(progress.topics)
    .filter(([_, topicProgress]) => topicProgress.accuracyRate < 0.6 && topicProgress.problemsAttempted >= 3)
    .map(([topicId, topicProgress]) => ({ topicId, ...topicProgress }));

  const masteredTopics = Object.entries(progress.topics)
    .filter(([_, topicProgress]) => topicProgress.accuracyRate >= 0.8 && topicProgress.problemsAttempted >= 5)
    .map(([topicId, topicProgress]) => ({ topicId, ...topicProgress }));

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <TrendingUp className="h-6 w-6 text-primary-600" />
          <h3 className="text-xl font-semibold text-gray-900">Learning Progress</h3>
        </div>
        <button
          onClick={handleResetProgress}
          className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Reset</span>
        </button>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Accuracy</span>
          </div>
          <div className="text-2xl font-bold text-blue-900">
            {progress.accuracyRate.toFixed(1)}%
          </div>
          <div className="text-xs text-blue-700">
            {progress.totalCorrect} of {progress.totalProblemsAttempted} correct
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-900">Streak</span>
          </div>
          <div className="text-2xl font-bold text-green-900">
            {progress.learningStreak}
          </div>
          <div className="text-xs text-green-700">consecutive correct</div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">Last Active</span>
          </div>
          <div className="text-sm font-bold text-purple-900">
            {new Date(progress.lastActive).toLocaleDateString()}
          </div>
          <div className="text-xs text-purple-700">
            {new Date(progress.lastActive).toLocaleTimeString()}
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Star className="h-5 w-5 text-orange-600" />
            <span className="text-sm font-medium text-orange-900">Mastered</span>
          </div>
          <div className="text-2xl font-bold text-orange-900">
            {masteredTopics.length}
          </div>
          <div className="text-xs text-orange-700">topics mastered</div>
        </div>
      </div>

      {/* Topic Progress */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900">Topic Progress</h4>
        
        {Object.entries(progress.topics).map(([topicId, topicProgress]) => (
          <div key={topicId} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h5 className="font-medium text-gray-900 capitalize">
                {topicId.replace('-', ' ')}
              </h5>
              <span className="text-sm text-gray-600">
                {topicProgress.accuracyRate.toFixed(1)}% accuracy
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  topicProgress.accuracyRate >= 0.8
                    ? 'bg-green-500'
                    : topicProgress.accuracyRate >= 0.6
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${topicProgress.accuracyRate}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{topicProgress.correct} of {topicProgress.problemsAttempted} correct</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => getAdaptiveQuestion(topicId, 'beginner')}
                  className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                >
                  Easy
                </button>
                <button
                  onClick={() => getAdaptiveQuestion(topicId, 'intermediate')}
                  className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors"
                >
                  Medium
                </button>
                <button
                  onClick={() => getAdaptiveQuestion(topicId, 'advanced')}
                  className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                >
                  Hard
                </button>
              </div>
            </div>

            {/* Struggling Concepts */}
            {topicProgress.strugglingConcepts.length > 0 && (
              <div className="mt-3 p-2 bg-red-50 rounded border border-red-200">
                <div className="flex items-center space-x-1 mb-1">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium text-red-900">Struggling with:</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {topicProgress.strugglingConcepts.map((concept, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded"
                    >
                      {concept.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Mastered Concepts */}
            {topicProgress.masteredConcepts.length > 0 && (
              <div className="mt-3 p-2 bg-green-50 rounded border border-green-200">
                <div className="flex items-center space-x-1 mb-1">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-900">Mastered:</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {topicProgress.masteredConcepts.map((concept, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded"
                    >
                      {concept.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Recent Attempts */}
      {progress.recentAttempts.length > 0 && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Attempts</h4>
          <div className="space-y-2">
            {progress.recentAttempts.slice(0, 5).map((attempt, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {attempt.isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {attempt.question.substring(0, 60)}...
                    </p>
                    <p className="text-xs text-gray-600">
                      {attempt.topic} • {attempt.difficulty} • {new Date(attempt.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {attempt.timeSpent}s
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;
