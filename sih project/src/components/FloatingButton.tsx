import { Scale } from 'lucide-react';
import { useState } from 'react';

interface FloatingButtonProps {
  onClick: () => void;
}

export const FloatingButton = ({ onClick }: FloatingButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-4 right-4 w-16 h-16 rounded-full shadow-lg overflow-hidden transition-transform hover:scale-105"
      style={{
        background: `linear-gradient(${isHovered ? '45deg' : '90deg'}, #ff671f, #ffffff, #046a38)`,
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <Scale className="w-8 h-8 text-[#2a3990]" />
      </div>
    </button>
  );
};