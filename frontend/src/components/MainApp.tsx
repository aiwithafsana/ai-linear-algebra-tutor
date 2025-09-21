import React, { useState, useEffect } from 'react';
import { Calculator, Mic, BookOpen, Brain, Code, Volume2, GraduationCap, Target, TrendingUp, LogOut } from 'lucide-react';
import InteractiveWhiteboard from './InteractiveWhiteboard';
import AnimatedWhiteboard from './AnimatedWhiteboard';
import VoiceChat from './VoiceChat';
import EnhancedVoiceChat from './EnhancedVoiceChat';
import ConversationalUI from './ConversationalUI';
import JSONRenderer from './JSONRenderer';
import VoiceDemo from './VoiceDemo';
import CurriculumSelector from './CurriculumSelector';
import LessonViewer from './LessonViewer';
import ProgressTracker from './ProgressTracker';
import ProblemSolver from './ProblemSolver';
import { useAuth } from './AuthProvider';
import { WhiteboardProvider } from '../context/WhiteboardContext';
import { CurriculumTopic, Lesson } from '../data/curriculum';
import { AdaptiveQuestion } from '../services/progressService';

const MainApp: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('whiteboard');
  const [jsonData, setJsonData] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState<CurriculumTopic | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [studentId] = useState(user?.id || 'student_' + Date.now());
  const [adaptiveQuestion, setAdaptiveQuestion] = useState<AdaptiveQuestion | null>(null);
  const [progressKey, setProgressKey] = useState(0);

  const handleJSONRender = (data: any) => {
    setJsonData(data);
    setActiveTab('whiteboard');
  };

  const handleTopicSelect = (topic: CurriculumTopic) => {
    setSelectedTopic(topic);
    setSelectedLesson(null);
    setActiveTab('curriculum');
  };

  const handleLessonSelect = (topic: CurriculumTopic, lesson: Lesson) => {
    setSelectedTopic(topic);
    setSelectedLesson(lesson);
    setActiveTab('curriculum');
  };

  const handleLessonComplete = (lesson: Lesson) => {
    console.log(`Lesson completed: ${lesson.title}`);
  };

  const handleAdaptiveQuestion = (question: AdaptiveQuestion) => {
    setAdaptiveQuestion(question);
    setActiveTab('problems');
  };

  const handleProgressUpdate = () => {
    setProgressKey(prev => prev + 1);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <WhiteboardProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <GraduationCap className="h-8 w-8 text-primary-600" />
                  <h1 className="text-xl font-bold text-gray-900">AI Linear Algebra Tutor</h1>
                </div>
                
                <nav className="hidden md:flex items-center space-x-4">
                  <button
                    onClick={() => setActiveTab('whiteboard')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      activeTab === 'whiteboard'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Calculator className="h-4 w-4" />
                    <span>Whiteboard</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('voice')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      activeTab === 'voice'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Mic className="h-4 w-4" />
                    <span>Voice Chat</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('curriculum')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      activeTab === 'curriculum'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>Lessons</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('problems')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      activeTab === 'problems'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Target className="h-4 w-4" />
                    <span>Problems</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('progress')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      activeTab === 'progress'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <TrendingUp className="h-4 w-4" />
                    <span>Progress</span>
                  </button>
                </nav>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                  Welcome, {user?.name || 'Student'}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'problems' ? (
            <div className="space-y-8">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Target className="h-6 w-6 text-primary-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Adaptive Problem Solving</h2>
                </div>
                <p className="text-gray-600 mb-6">
                  Solve problems that adapt to your skill level. The AI will generate easier questions if you're struggling or harder ones if you're excelling.
                </p>
                <ProblemSolver
                  studentId={studentId}
                  topic={selectedTopic?.id || 'vectors'}
                  difficulty={selectedLesson?.difficulty || 'intermediate'}
                  onProgressUpdate={handleProgressUpdate}
                />
              </div>
            </div>
          ) : activeTab === 'progress' ? (
            <div className="space-y-8">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <TrendingUp className="h-6 w-6 text-primary-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Learning Progress</h2>
                </div>
                <p className="text-gray-600 mb-6">
                  Track your learning progress, identify areas where you're struggling, and see your improvement over time.
                </p>
                <ProgressTracker
                  key={progressKey}
                  studentId={studentId}
                  onAdaptiveQuestion={handleAdaptiveQuestion}
                />
              </div>
            </div>
          ) : activeTab === 'curriculum' ? (
            <div className="space-y-8">
              {!selectedTopic ? (
                <CurriculumSelector onTopicSelect={handleTopicSelect} />
              ) : (
                <LessonViewer
                  topic={selectedTopic}
                  lesson={selectedLesson}
                  onLessonSelect={handleLessonSelect}
                  onLessonComplete={handleLessonComplete}
                  onBack={() => setSelectedTopic(null)}
                />
              )}
            </div>
          ) : activeTab === 'voice' ? (
            <div className="space-y-8">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Mic className="h-6 w-6 text-primary-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Voice Chat with AI Tutor</h2>
                </div>
                <p className="text-gray-600 mb-6">
                  Have a conversation with your AI tutor. Ask questions, get explanations, and learn through interactive dialogue.
                </p>
                <EnhancedVoiceChat />
              </div>
            </div>
          ) : activeTab === 'json' ? (
            <div className="space-y-8">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Code className="h-6 w-6 text-primary-600" />
                  <h2 className="text-2xl font-bold text-gray-900">JSON Data Renderer</h2>
                </div>
                <JSONRenderer data={jsonData} />
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Calculator className="h-6 w-6 text-primary-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Interactive Whiteboard</h2>
                </div>
                <p className="text-gray-600 mb-6">
                  Draw, calculate, and visualize mathematical concepts. The AI can help you understand complex linear algebra problems.
                </p>
                <InteractiveWhiteboard />
              </div>
            </div>
          )}
        </main>
      </div>
    </WhiteboardProvider>
  );
};

export default MainApp;
