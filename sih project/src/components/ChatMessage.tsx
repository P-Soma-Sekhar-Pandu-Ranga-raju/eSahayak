import { ThumbsDown, ThumbsUp } from 'lucide-react';

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  showFeedback?: boolean;
  onFeedback?: (isPositive: boolean) => void;
}

// Function to format messages and turn URLs into clickable links
const formatMessage = (message: string) => {
  const urlPattern = /https?:\/\/[^\s]+/g; // Regex pattern for URLs
  const matches = message.match(urlPattern) || []; // Match the URLs

  // Clean up the message and replace URLs with clickable links
  return message.split(urlPattern).flatMap((part, index) => [
    part.replace(/[*#)\-_`]/g, ''), // Remove unwanted symbols
    matches[index] ? (
      <a
        href={matches[index]}
        target="_blank"
        rel="noopener noreferrer"
        key={matches[index]}
        className="text-blue-600 hover:underline"
      >
        {matches[index]}
      </a>
    ) : null,
  ]);
};

export const ChatMessage = ({ message, isUser, showFeedback, onFeedback }: ChatMessageProps) => {
  const handleFallbackResponse = (msg: string): string => {
    if (msg.includes("I have no information")) {
      return (
        "It seems like I'm unable to find the specific information you need. " +
        "You can try rephrasing your query or contacting the relevant court for detailed assistance."
      );
    }
    return msg;
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[80%] p-4 rounded-lg ${isUser ? 'bg-[#1a73e8] text-white' : 'bg-white shadow-sm'}`}
      >
        <p className="whitespace-pre-wrap text-[15px]">
          {formatMessage(handleFallbackResponse(message)).map((part, index) => (
            <span key={index}>{part}</span>
          ))}
        </p>
        {showFeedback && !isUser && (
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => onFeedback?.(true)}
              className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ThumbsUp className="w-5 h-5 text-green-600" />
            </button>
            <button
              onClick={() => onFeedback?.(false)}
              className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ThumbsDown className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
