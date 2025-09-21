import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Send, Bot, User, Sparkles, Brain } from 'lucide-react';
import ProfessorAvatar from './ProfessorAvatar';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
  isSpeaking?: boolean;
}

interface ConversationalUIProps {
  onSendMessage: (message: string) => void;
  onStartListening: () => void;
  onStopListening: () => void;
  isListening: boolean;
  isSpeaking: boolean;
  isProcessing: boolean;
  messages: Message[];
  className?: string;
}

const ConversationalUI: React.FC<ConversationalUIProps> = ({
  onSendMessage,
  onStartListening,
  onStopListening,
  isListening,
  isSpeaking,
  isProcessing,
  messages,
  className = ''
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = () => {
    if (inputValue.trim() && !isProcessing) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Simulate typing indicator
  useEffect(() => {
    if (isProcessing) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isProcessing]);

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
        <div className="flex items-center space-x-3">
          <ProfessorAvatar isSpeaking={isSpeaking} isThinking={isProcessing} size="md" />
          <div>
            <h3 className="text-lg font-semibold text-white">Professor AI</h3>
            <p className="text-blue-100 text-sm">
              {isSpeaking ? 'Speaking...' : isProcessing ? 'Thinking...' : 'Ready to help'}
            </p>
          </div>
          <div className="ml-auto flex items-center space-x-2">
            {isSpeaking && (
              <div className="flex space-x-1">
                <div className="w-1 h-4 bg-white rounded-full animate-bounce"></div>
                <div className="w-1 h-4 bg-white rounded-full animate-bounce delay-100"></div>
                <div className="w-1 h-4 bg-white rounded-full animate-bounce delay-200"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-3 ${
              message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            {/* Avatar */}
            <div className="flex-shrink-0">
              {message.type === 'ai' ? (
                <ProfessorAvatar 
                  isSpeaking={message.isSpeaking} 
                  isThinking={message.isTyping}
                  size="sm" 
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
              )}
            </div>

            {/* Message Content */}
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.type === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>

            {/* Typing Indicator */}
            {message.isTyping && (
              <div className="flex space-x-1 ml-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
              </div>
            )}
          </div>
        ))}

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="flex items-start space-x-3">
            <ProfessorAvatar isThinking={true} size="sm" />
            <div className="bg-gray-100 px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <Brain className="w-4 h-4 text-blue-500 animate-pulse" />
                <span className="text-sm text-gray-600">Processing your question...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          {/* Voice Button */}
          <button
            onClick={isListening ? onStopListening : onStartListening}
            className={`p-2 rounded-full transition-all duration-200 ${
              isListening
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            disabled={isProcessing}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Text Input */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isListening ? "Listening..." : "Type your question..."}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isProcessing || isListening}
            />
            {isListening && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
              </div>
            )}
          </div>

          {/* Send Button */}
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isProcessing}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            {isListening && (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span>Listening...</span>
              </div>
            )}
            {isSpeaking && (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Speaking...</span>
              </div>
            )}
            {isProcessing && (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>Processing...</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-3 h-3" />
            <span>AI-Powered</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationalUI;

