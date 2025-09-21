import React, { useState } from 'react';
import { 
  BookOpen, 
  ChevronDown, 
  Play, 
  Clock, 
  Target, 
  Users,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { curriculumData, CurriculumTopic, Lesson } from '../data/curriculum';

interface CurriculumSelectorProps {
  onTopicSelect: (topic: CurriculumTopic) => void;
  onLessonSelect: (topic: CurriculumTopic, lesson: Lesson) => void;
}

const CurriculumSelector: React.FC<CurriculumSelectorProps> = ({ 
  onTopicSelect, 
  onLessonSelect 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<CurriculumTopic | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const handleTopicSelect = (topic: CurriculumTopic) => {
    setSelectedTopic(topic);
    setSelectedLesson(null);
    setIsOpen(false);
    onTopicSelect(topic);
  };

  const handleLessonSelect = (lesson: Lesson) => {
    if (selectedTopic) {
      setSelectedLesson(lesson);
      onLessonSelect(selectedTopic, lesson);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTopicIcon = (iconName: string) => {
    // For now, return a generic icon - in a real app, you'd map these to actual icons
    return BookOpen;
  };

  return (
    <div className="relative">
      {/* Main Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
      >
        <div className="flex items-center space-x-3">
          <BookOpen className="h-5 w-5 text-primary-600" />
          <div className="text-left">
            <p className="text-sm font-medium text-gray-900">
              {selectedTopic ? selectedTopic.name : 'Select a Topic'}
            </p>
            <p className="text-xs text-gray-500">
              {selectedTopic ? selectedTopic.description : 'Choose from UC Berkeley Math 54 curriculum'}
            </p>
          </div>
        </div>
        <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-2">
              UC Berkeley Math 54 Topics
            </div>
            {curriculumData.map((topic) => (
              <div key={topic.id} className="mb-1">
                <button
                  onClick={() => handleTopicSelect(topic)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-1 rounded ${topic.color === 'blue' ? 'bg-blue-100' : 
                      topic.color === 'green' ? 'bg-green-100' : 
                      topic.color === 'purple' ? 'bg-purple-100' : 
                      topic.color === 'orange' ? 'bg-orange-100' : 
                      topic.color === 'red' ? 'bg-red-100' : 
                      'bg-indigo-100'}`}>
                      <BookOpen className={`h-4 w-4 ${topic.color === 'blue' ? 'text-blue-600' : 
                        topic.color === 'green' ? 'text-green-600' : 
                        topic.color === 'purple' ? 'text-purple-600' : 
                        topic.color === 'orange' ? 'text-orange-600' : 
                        topic.color === 'red' ? 'text-red-600' : 
                        'text-indigo-600'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{topic.name}</p>
                      <p className="text-xs text-gray-500 truncate">{topic.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-400">{topic.lessons.length} lessons</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-400">Order {topic.order}</span>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected Topic Lessons */}
      {selectedTopic && !isOpen && (
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-900">Lessons in {selectedTopic.name}</h4>
            <button
              onClick={() => {
                setSelectedTopic(null);
                setSelectedLesson(null);
              }}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Change Topic
            </button>
          </div>
          
          <div className="space-y-2">
            {selectedTopic.lessons.map((lesson) => (
              <div
                key={lesson.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedLesson?.id === lesson.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => handleLessonSelect(lesson)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h5 className="text-sm font-medium text-gray-900">{lesson.title}</h5>
                      <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(lesson.difficulty)}`}>
                        {lesson.difficulty}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{lesson.description}</p>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{lesson.estimatedTime}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Target className="h-3 w-3" />
                        <span>{lesson.learningObjectives.length} objectives</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>{lesson.topics.length} topics</span>
                      </div>
                    </div>

                    {lesson.prerequisites && lesson.prerequisites.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 mb-1">Prerequisites:</p>
                        <div className="flex flex-wrap gap-1">
                          {lesson.prerequisites.map((prereq, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                            >
                              {prereq}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="ml-2 flex-shrink-0">
                    {selectedLesson?.id === lesson.id ? (
                      <CheckCircle className="h-5 w-5 text-primary-600" />
                    ) : (
                      <Play className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selectedLesson && (
            <div className="mt-4 p-4 bg-primary-50 border border-primary-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <Play className="h-4 w-4 text-primary-600" />
                <h5 className="text-sm font-medium text-primary-900">Ready to Start</h5>
              </div>
              <p className="text-sm text-primary-700 mb-3">
                {selectedLesson.title} - {selectedLesson.description}
              </p>
              <div className="flex items-center space-x-4 text-xs text-primary-600">
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{selectedLesson.estimatedTime}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Target className="h-3 w-3" />
                  <span>{selectedLesson.learningObjectives.length} learning objectives</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CurriculumSelector;
