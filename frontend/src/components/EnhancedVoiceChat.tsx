import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Mic, 
  MicOff, 
  Send, 
  Bot, 
  User, 
  Volume2, 
  VolumeX,
  RotateCcw,
  Download,
  Settings,
  Play,
  Pause,
  Square,
  Lightbulb,
  Calculator,
  Eye
} from 'lucide-react';
import { askService, AIResponse } from '../services/askService';
import { useWhiteboard } from '../context/WhiteboardContext';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isAudio?: boolean;
  isTyping?: boolean;
  aiResponse?: AIResponse;
}

interface VoiceSettings {
  voice: string;
  rate: number;
  pitch: number;
  volume: number;
}

const EnhancedVoiceChat: React.FC = () => {
  const { renderShapes } = useWhiteboard();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m Professor AI, your Linear Algebra tutor. I can help you understand vectors, matrices, linear transformations, and more. Ask me anything about linear algebra!',
      timestamp: new Date()
    }
  ]);
  const [isMuted, setIsMuted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    voice: '',
    rate: 0.9,
    pitch: 1,
    volume: 0.8
  });
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [showVisualization, setShowVisualization] = useState(false);
  const [currentVisualization, setCurrentVisualization] = useState<any[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Initialize speech recognition and synthesis
  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setInterimTranscript('');
      };

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setInterimTranscript(interimTranscript);
        if (finalTranscript) {
          setInputText(prev => prev + finalTranscript);
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setInterimTranscript('');
      };
    }

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthesisRef.current = new SpeechSynthesisUtterance();
      
      // Load available voices
      const loadVoices = () => {
        const voices = speechSynthesis.getVoices();
        setAvailableVoices(voices);
        if (voices.length > 0 && !voiceSettings.voice) {
          // Prefer English voices
          const englishVoice = voices.find(voice => 
            voice.lang.startsWith('en') && voice.default
          ) || voices.find(voice => voice.lang.startsWith('en')) || voices[0];
          
          if (englishVoice) {
            setVoiceSettings(prev => ({ ...prev, voice: englishVoice.name }));
          }
        }
      };

      loadVoices();
      speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthesisRef.current) {
        speechSynthesis.cancel();
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        // Handle interruption by stopping current speech
        handleInterruption();
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        alert('Speech recognition not available. Please check your browser settings.');
      }
    }
  }, [isListening, handleInterruption]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  const speak = useCallback((text: string) => {
    if (synthesisRef.current && !isMuted && !isSpeaking) {
      // Cancel any ongoing speech
      speechSynthesis.cancel();
      
      synthesisRef.current.text = text;
      synthesisRef.current.rate = voiceSettings.rate;
      synthesisRef.current.pitch = voiceSettings.pitch;
      synthesisRef.current.volume = voiceSettings.volume;
      
      if (voiceSettings.voice) {
        const selectedVoice = availableVoices.find(voice => voice.name === voiceSettings.voice);
        if (selectedVoice) {
          synthesisRef.current.voice = selectedVoice;
        }
      }
      
      synthesisRef.current.onstart = () => setIsSpeaking(true);
      synthesisRef.current.onend = () => setIsSpeaking(false);
      synthesisRef.current.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsSpeaking(false);
      };
      
      speechSynthesis.speak(synthesisRef.current);
    }
  }, [isMuted, isSpeaking, voiceSettings, availableVoices]);

  const stopSpeaking = useCallback(() => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  // Handle interruption when user starts speaking
  const handleInterruption = useCallback(() => {
    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isSpeaking]);

  const sendMessage = async () => {
    if (!inputText.trim() || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputText.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const question = inputText.trim();
    setInputText('');
    setIsProcessing(true);

    try {
      // Call the /ask endpoint with proper format
      const response = await askService.askQuestion({
        question,
        conversationHistory: messages.slice(-5).map(m => ({
          role: m.type === 'user' ? 'user' : 'assistant',
          content: m.content
        })),
        difficulty: 'intermediate'
      });
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response.data.explanation,
        timestamp: new Date(),
        aiResponse: response.data
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Set visualization data if available
      if (response.data.shapes && response.data.shapes.length > 0) {
        setCurrentVisualization(response.data.shapes);
        setShowVisualization(true);
        
        // Convert AI shapes to whiteboard format and render them
        const whiteboardShapes = response.data.shapes.map((shape: any, index: number) => ({
          id: `ai-shape-${Date.now()}-${index}`,
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
      }
      
      // Speak the AI response
      speak(response.data.explanation);
      
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: error instanceof Error ? error.message : 'Sorry, I encountered an error. Please try again or check your internet connection.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        type: 'ai',
        content: 'Hello! I\'m your AI Linear Algebra tutor. I can help you understand vectors, matrices, linear transformations, and more. Ask me anything about linear algebra!',
        timestamp: new Date()
      }
    ]);
    setShowVisualization(false);
    setCurrentVisualization([]);
  };

  const downloadChat = () => {
    const chatText = messages.map(msg => 
      `${msg.type === 'user' ? 'You' : 'AI'}: ${msg.content}\n${msg.timestamp.toLocaleString()}\n`
    ).join('\n');
    
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'linear-algebra-chat.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderLatex = (latex: string) => {
    if (!latex) return null;
    
    try {
      // Clean the LaTeX string
      const cleanLatex = askService.formatLatex(latex);
      
      // Determine if it's inline or block math based on content
      const isBlockMath = cleanLatex.includes('\\begin{') || cleanLatex.includes('\\sum') || cleanLatex.includes('\\int') || cleanLatex.includes('\\frac');
      
      return (
        <div className="bg-gray-50 p-3 rounded-lg my-2 border border-gray-200">
          {isBlockMath ? (
            <BlockMath math={cleanLatex} />
          ) : (
            <InlineMath math={cleanLatex} />
          )}
        </div>
      );
    } catch (error) {
      console.error('LaTeX rendering error:', error);
      return (
        <div className="bg-red-50 p-3 rounded-lg my-2 border border-red-200">
          <p className="text-red-600 text-sm">Error rendering LaTeX: {latex}</p>
        </div>
      );
    }
  };

  const renderSuggestions = (suggestions: string[]) => {
    if (!suggestions || suggestions.length === 0) return null;
    
    return (
      <div className="mt-3 space-y-1">
        <p className="text-xs text-gray-600 font-medium">Suggested follow-ups:</p>
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => setInputText(suggestion)}
            className="block w-full text-left text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded transition-colors"
          >
            {suggestion}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto border border-gray-200 rounded-lg bg-white p-4 space-y-4 min-h-0">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                message.type === 'user'
                  ? 'bg-primary-600 text-white rounded-br-md'
                  : 'bg-gray-100 text-gray-900 rounded-bl-md'
              }`}
            >
              <div className="flex items-start space-x-2">
                {message.type === 'ai' && (
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Bot className="h-3 w-3 text-white" />
                  </div>
                )}
                {message.type === 'user' && (
                  <div className="flex-shrink-0 w-6 h-6 bg-primary-700 rounded-full flex items-center justify-center">
                    <User className="h-3 w-3 text-white" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm break-words">{message.content}</p>
                  
                  {/* Render LaTeX if available */}
                  {message.aiResponse?.latex && renderLatex(message.aiResponse.latex)}
                  
                  {/* Render suggestions if available */}
                  {message.aiResponse?.suggestions && renderSuggestions(message.aiResponse.suggestions)}
                  
                  <p className={`text-xs mt-1 ${
                    message.type === 'user' ? 'text-primary-100' : 'text-gray-500'
                  }`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Interim transcript display */}
        {interimTranscript && (
          <div className="flex justify-start">
            <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-2xl bg-gray-50 text-gray-600 rounded-bl-md">
              <div className="flex items-start space-x-2">
                <div className="flex-shrink-0 w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                  <Mic className="h-3 w-3 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm italic">{interimTranscript}</p>
                  <p className="text-xs mt-1 text-gray-400">Listening...</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Processing indicator */}
        {isProcessing && (
          <div className="flex justify-start">
            <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-2xl bg-gray-100 text-gray-600 rounded-bl-md">
              <div className="flex items-start space-x-2">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <Bot className="h-3 w-3 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs text-gray-500 ml-2">AI is thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Visualization Panel */}
      {showVisualization && currentVisualization.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-blue-900 flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              Visual Representation
            </h4>
            <button
              onClick={() => setShowVisualization(false)}
              className="text-blue-600 hover:text-blue-800"
            >
              ×
            </button>
          </div>
          <div className="text-xs text-blue-700">
            <p>This response includes {currentVisualization.length} visual element(s) that can be rendered on the whiteboard.</p>
            <p className="mt-1">Shapes: {currentVisualization.map(s => s.type).join(', ')}</p>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="space-y-3">
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about linear algebra..."
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              rows={2}
              disabled={isProcessing}
            />
            <div className="absolute right-2 top-2 flex space-x-1">
              <button
                onClick={isListening ? stopListening : startListening}
                className={`p-2 rounded-lg transition-colors ${
                  isListening
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                title={isListening ? 'Stop listening' : 'Start voice input'}
                disabled={isProcessing}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <button
            onClick={sendMessage}
            disabled={!inputText.trim() || isProcessing}
            className="px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Send message"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-2 rounded-lg transition-colors ${
                isMuted
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title={isMuted ? 'Unmute AI voice' : 'Mute AI voice'}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
            
            {isSpeaking && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={stopSpeaking}
                  className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                  title="Stop speaking"
                >
                  <Square className="h-4 w-4" />
                </button>
                <span className="text-xs text-gray-500 flex items-center">
                  <div className="animate-pulse w-2 h-2 bg-primary-500 rounded-full mr-1"></div>
                  AI is speaking...
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              title="Voice settings"
            >
              <Settings className="h-4 w-4" />
            </button>
            <button
              onClick={clearChat}
              className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              title="Clear chat"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Clear</span>
            </button>
            <button
              onClick={downloadChat}
              className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              title="Download chat"
            >
              <Download className="h-4 w-4" />
              <span>Save</span>
            </button>
          </div>
        </div>

        {/* Voice Settings Panel */}
        {showSettings && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Voice Settings</h4>
            
            <div className="space-y-2">
              <label className="text-xs text-gray-600">Voice:</label>
              <select
                value={voiceSettings.voice}
                onChange={(e) => setVoiceSettings(prev => ({ ...prev, voice: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Default</option>
                {availableVoices.map((voice) => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-gray-600">Rate: {voiceSettings.rate}</label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={voiceSettings.rate}
                  onChange={(e) => setVoiceSettings(prev => ({ ...prev, rate: parseFloat(e.target.value) }))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600">Pitch: {voiceSettings.pitch}</label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={voiceSettings.pitch}
                  onChange={(e) => setVoiceSettings(prev => ({ ...prev, pitch: parseFloat(e.target.value) }))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600">Volume: {Math.round(voiceSettings.volume * 100)}%</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={voiceSettings.volume}
                  onChange={(e) => setVoiceSettings(prev => ({ ...prev, volume: parseFloat(e.target.value) }))}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedVoiceChat;
