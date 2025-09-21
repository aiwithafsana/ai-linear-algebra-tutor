import React from 'react';
import { GraduationCap, Brain, Sparkles, MessageCircle } from 'lucide-react';

interface ProfessorAvatarProps {
  isSpeaking?: boolean;
  isThinking?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ProfessorAvatar: React.FC<ProfessorAvatarProps> = ({ 
  isSpeaking = false, 
  isThinking = false, 
  size = 'md',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={`relative ${className}`}>
      {/* Avatar Container */}
      <div className={`
        ${sizeClasses[size]} 
        rounded-full 
        bg-gradient-to-br from-blue-500 to-purple-600 
        flex items-center justify-center
        shadow-lg
        transition-all duration-300
        ${isSpeaking ? 'animate-pulse scale-105' : ''}
        ${isThinking ? 'animate-spin' : ''}
      `}>
        {/* Professor Icon */}
        <GraduationCap className={`${iconSizes[size]} text-white`} />
        
        {/* Thinking Indicator */}
        {isThinking && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
            <Brain className="w-2 h-2 text-yellow-800" />
          </div>
        )}
        
        {/* Speaking Indicator */}
        {isSpeaking && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
            <MessageCircle className="w-2 h-2 text-green-800" />
          </div>
        )}
      </div>
      
      {/* Floating Sparkles Animation */}
      {isSpeaking && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
            <Sparkles className="w-3 h-3 text-yellow-400 animate-bounce" />
          </div>
          <div className="absolute top-1/4 right-0 transform translate-x-1">
            <Sparkles className="w-2 h-2 text-blue-400 animate-bounce delay-100" />
          </div>
          <div className="absolute bottom-1/4 left-0 transform -translate-x-1">
            <Sparkles className="w-2 h-2 text-purple-400 animate-bounce delay-200" />
          </div>
        </div>
      )}
      
      {/* Pulse Ring for Speaking */}
      {isSpeaking && (
        <div className="absolute inset-0 rounded-full border-2 border-blue-300 animate-ping opacity-75"></div>
      )}
    </div>
  );
};

export default ProfessorAvatar;
