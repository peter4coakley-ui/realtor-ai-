import React from 'react';
import { XCircleIcon } from './icons';
import { Button } from './ui/Button';

interface FullScreenViewerProps {
  imageUrl: string;
  onClose: () => void;
}

export const FullScreenViewer: React.FC<FullScreenViewerProps> = ({ imageUrl, onClose }) => {
  // Effect to handle Escape key press
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Full screen image view"
    >
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
      `}</style>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onClose} 
        className="absolute top-4 right-4 h-12 w-12 rounded-full bg-black/30 hover:bg-black/50"
        aria-label="Close full screen view"
      >
        <XCircleIcon className="w-8 h-8 text-white" />
      </Button>
      <div className="relative w-full h-full p-8" onClick={(e) => e.stopPropagation()}>
        <img 
          src={imageUrl} 
          alt="Full screen view" 
          className="max-w-full max-h-full object-contain mx-auto my-auto" 
        />
      </div>
    </div>
  );
};
