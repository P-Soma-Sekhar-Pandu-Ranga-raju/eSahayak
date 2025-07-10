import { Send, Paperclip, XCircle } from 'lucide-react';
import { useState } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  showSendButton: boolean;
}

export const ChatInput = ({ onSend, showSendButton }: ChatInputProps) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t p-4 bg-white">
      <div className="flex items-center gap-2">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 resize-none rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px] max-h-32"
          rows={1}
        />
        {(showSendButton || message.trim()) && (
          <button
            type="submit"
            aria-label="Send message"
            className="p-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <Send className="w-5 h-5 text-blue-600" />
          </button>
        )}
      </div>
    </form>
  );
};
