import { Mic, RefreshCw, Scale, X } from 'lucide-react';

interface ChatHeaderProps {
  onClose: () => void;
  onRefresh: () => void;
  onVoiceStart: () => void;
  isListening: boolean;
}

export const ChatHeader = ({
  onClose,
  onRefresh,
  onVoiceStart,
  isListening,
}: ChatHeaderProps) => {
  return (
    <div className="relative">
      {/* Top border gradient */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#ff671f] via-white to-[#046a38]" />
      {/* Right border gradient */}
      <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-b from-[#ff671f] via-white to-[#046a38]" />
      {/* Bottom border gradient */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[#ff671f] via-white to-[#046a38]" />
      {/* Left border gradient */}
      <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-[#ff671f] via-white to-[#046a38]" />
      
      <div className="bg-[#2a3990] text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Scale className="w-6 h-6" />
            <div>
              <h2 className="font-semibold text-lg">e-Sahayak</h2>
              <p className="text-sm">भारतीय कानूनी सहायक</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onVoiceStart}
              className={`p-2 rounded-lg transition-colors ${
                isListening ? 'bg-red-500' : 'hover:bg-[#3a4aa0]'
              }`}
            >
              <Mic className="w-5 h-5" />
            </button>
            <button
              onClick={onRefresh}
              className="p-2 hover:bg-[#3a4aa0] rounded-lg transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#3a4aa0] rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
