import { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { ChatHeader } from './ChatHeader';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { FeedbackModal } from './FeedbackModal';
import { FloatingButton } from './FloatingButton';
import { useBackground } from '../hooks/useBackground';
import { translateText } from '../utils/translate'; // Adjust according to your structure

interface Message {
  text: string;
  isUser: boolean;
}

const languageOptions = [
  { code: 'en-IN', label: 'English' },
  { code: 'hi-IN', label: 'Hindi' },
  { code: 'ta-IN', label: 'Tamil' },
  { code: 'te-IN', label: 'Telugu' },
  { code: 'kn-IN', label: 'Kannada' },
];

export const ChatContainer = () => {
  const defaultMessages = [
    {
      text: 'नमस्ते! Welcome to the Indian Legal Assistant. I will assist you with case information, e-services, about DoJ, Judge Appointments, Court Live Streams and more...',
      isUser: false,
    },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(defaultMessages);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [webSocketError, setWebSocketError] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState(languageOptions[0].code);
  const backgroundStyle = useBackground();

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const initializeWebSocket = () => {
    const socket = new WebSocket('ws://localhost:8001/ws');

    socket.onopen = () => {
      console.log('WebSocket connected');
      setWebSocketError(false);
    };

    socket.onmessage = (event) => {
      const botResponse = event.data;
      setMessages((prev) => [...prev, { text: botResponse, isUser: false }]);
      speak(botResponse, selectedLanguage); // Use modified speak function
    };

    socket.onclose = () => {
      console.warn('WebSocket disconnected, retrying...');
      setTimeout(() => initializeWebSocket(), 5000);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setWebSocketError(true);
    };

    setWs(socket);
  };

  useEffect(() => {
    initializeWebSocket();

    return () => {
      ws?.close();
    };
  }, []);

  // Improved handling of audio input
  useEffect(() => {
    if (transcript && !listening) {
      handleSend(transcript); // Send recognized transcript
      resetTranscript(); // Reset transcript after sending
    }
  }, [listening, transcript]);

  const speak = (text: string, lang: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Cancel any ongoing speech first

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang; // Set language for TTS

      window.speechSynthesis.speak(utterance); // Speak the entire text
    } else {
      console.error('Speech synthesis not supported in this browser.');
    }
  };

  const handleSend = async (message: string) => {
    if (!message.trim()) return;

    // Translate message before sending
    const translatedMessage = await translateText(message, selectedLanguage);

    setMessages((prev) => [...prev, { text: message, isUser: true }]); // Display user message

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ message: translatedMessage, language: selectedLanguage }));
    } else {
      console.error('WebSocket is not open.');
    }
  };

  const handleFeedback = (isPositive: boolean) => {
    if (isPositive) {
      const response = 'Thank you for your positive feedback!';
      setMessages((prev) => [...prev, { text: response, isUser: false }]);
      speak(response, selectedLanguage); // Use modified speak function
    } else {
      setShowFeedbackModal(true);
    }
  };

  const handleRefresh = () => {
    setMessages(defaultMessages);
  };

  const handleVoiceStart = () => {
    if (!browserSupportsSpeechRecognition) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ language: selectedLanguage });
    }
  };

  if (!isOpen) {
    return <FloatingButton onClick={() => setIsOpen(true)} />;
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 rounded-lg shadow-xl flex flex-col max-h-[600px] overflow-hidden">
      <ChatHeader
        onClose={() => {
          setIsOpen(false);
          speechSynthesis.cancel();
        }}
        onRefresh={() => {
          speechSynthesis.cancel();
          handleRefresh();
        }}
        onVoiceStart={handleVoiceStart}
        isListening={listening}
      />
      
      <div className="p-2">
        <label htmlFor="language-select" className="block text-sm font-medium text-gray-700">Select Language:</label>
        <select
          id="language-select"
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          {languageOptions.map((option) => (
            <option key={option.code} value={option.code}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white" style={backgroundStyle}>
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message.text}
            isUser={message.isUser}
            showFeedback={!message.isUser}
            onFeedback={handleFeedback}
          />
        ))}

        {webSocketError && (
          <div className="text-sm text-red-500">
            Unable to connect to the server. Retrying...
          </div>
        )}
      </div>

      <ChatInput
        onSend={handleSend}
        showSendButton={true} // Adjust this based on your logic
      />
      
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        onSubmit={(feedback) => {
          console.log('Feedback submitted:', feedback);
          setShowFeedbackModal(false);
        }}
      />
    </div>
  );
};
