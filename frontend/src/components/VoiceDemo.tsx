import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Play, Square, Settings } from 'lucide-react';

const VoiceDemo: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [speechRate, setSpeechRate] = useState(0.9);
  const [speechPitch, setSpeechPitch] = useState(1);
  const [speechVolume, setSpeechVolume] = useState(0.8);

  const recognitionRef = React.useRef<SpeechRecognition | null>(null);
  const synthesisRef = React.useRef<SpeechSynthesisUtterance | null>(null);

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
        setTranscript('');
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

        setTranscript(finalTranscript || interimTranscript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthesisRef.current = new SpeechSynthesisUtterance();
      
      const loadVoices = () => {
        const availableVoices = speechSynthesis.getVoices();
        setVoices(availableVoices);
        if (availableVoices.length > 0 && !selectedVoice) {
          const englishVoice = availableVoices.find(voice => 
            voice.lang.startsWith('en') && voice.default
          ) || availableVoices.find(voice => voice.lang.startsWith('en')) || availableVoices[0];
          
          if (englishVoice) {
            setSelectedVoice(englishVoice.name);
          }
        }
      };

      loadVoices();
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [selectedVoice]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        alert('Speech recognition not available. Please check your browser settings.');
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const speak = (text: string) => {
    if (synthesisRef.current && !isSpeaking) {
      speechSynthesis.cancel();
      
      synthesisRef.current.text = text;
      synthesisRef.current.rate = speechRate;
      synthesisRef.current.pitch = speechPitch;
      synthesisRef.current.volume = speechVolume;
      
      if (selectedVoice) {
        const voice = voices.find(v => v.name === selectedVoice);
        if (voice) {
          synthesisRef.current.voice = voice;
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
  };

  const stopSpeaking = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const demoTexts = [
    "Hello! I'm your AI Linear Algebra tutor.",
    "Vectors are mathematical objects with both magnitude and direction.",
    "Matrix multiplication follows specific rules for combining rows and columns.",
    "Eigenvalues and eigenvectors reveal important properties of matrices.",
    "Linear transformations can rotate, scale, and reflect geometric objects."
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Voice Demo</h3>
        <p className="text-gray-600">Test the voice-to-text and text-to-speech functionality</p>
      </div>

      {/* Voice Recognition Demo */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Voice Recognition</h4>
        
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={isListening ? stopListening : startListening}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                isListening
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
            >
              {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              <span>{isListening ? 'Stop Listening' : 'Start Listening'}</span>
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 min-h-20">
            <p className="text-sm text-gray-600 mb-2">Transcript:</p>
            <p className="text-gray-900">
              {transcript || (isListening ? 'Listening...' : 'Click "Start Listening" and speak')}
            </p>
          </div>
        </div>
      </div>

      {/* Text-to-Speech Demo */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Text-to-Speech</h4>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Voice:</label>
              <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Default</option>
                {voices.map((voice) => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rate: {speechRate}
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={speechRate}
                  onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pitch: {speechPitch}
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={speechPitch}
                  onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Volume: {Math.round(speechVolume * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={speechVolume}
                  onChange={(e) => setSpeechVolume(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Demo Texts:</p>
            <div className="grid grid-cols-1 gap-2">
              {demoTexts.map((text, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700 flex-1">{text}</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => speak(text)}
                      disabled={isSpeaking}
                      className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Play className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {isSpeaking && (
            <div className="flex items-center justify-center space-x-2 p-4 bg-blue-50 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="text-sm text-blue-700 ml-2">Speaking...</span>
              <button
                onClick={stopSpeaking}
                className="ml-4 p-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
              >
                <Square className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Browser Support Info */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-yellow-800 mb-2">Browser Support</h4>
        <p className="text-sm text-yellow-700">
          Voice features work best in Chrome, Edge, and Safari. Make sure your microphone is enabled and you're using HTTPS in production.
        </p>
      </div>
    </div>
  );
};

export default VoiceDemo;

