import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { ImageVersion } from '../types';
import { BrushIcon, CleanIcon, StarIcon, ChevronLeftIcon, ChevronRightIcon, ExpandIcon, DownloadIcon, WatermarkIcon } from './icons';
import { Button } from './ui/Button';

interface ImagePanelProps {
  image: ImageVersion;
  versions: ImageVersion[];
  activeVersionIndex: number;
  isLoading: boolean;
  error: string | null;
  onSaveToggle: (versionId: string) => void;
  onNextVersion: () => void;
  onPrevVersion: () => void;
  activeMask: string | null;
  onMaskChange: (maskDataUrl: string | null) => void;
  onViewFullScreen: () => void;
  onDownload: () => void;
  onAddWatermark: () => void;
}

const Shimmer: React.FC = () => (
    <div className="absolute inset-0 bg-gray-800 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-700 to-transparent"
             style={{ animation: 'shimmer 2s infinite linear' }}>
        </div>
        <style>{`
            @keyframes shimmer {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }
        `}</style>
    </div>
);

const ImageActions: React.FC<{onDownload: () => void, onViewFullScreen: () => void, onAddWatermark: () => void}> = ({ onDownload, onViewFullScreen, onAddWatermark }) => (
    <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
        <Button onClick={onAddWatermark} variant="ghost" size="icon" className="h-9 w-9 rounded-lg bg-black/40 backdrop-blur-md hover:bg-black/60 border border-white/10 transition-all" title="Add Watermark">
            <WatermarkIcon className="w-4 h-4 text-white" />
        </Button>
        <Button onClick={onViewFullScreen} variant="ghost" size="icon" className="h-9 w-9 rounded-lg bg-black/40 backdrop-blur-md hover:bg-black/60 border border-white/10 transition-all" title="Full Screen">
            <ExpandIcon className="w-4 h-4 text-white" />
        </Button>
        <Button onClick={onDownload} variant="ghost" size="icon" className="h-9 w-9 rounded-lg bg-black/40 backdrop-blur-md hover:bg-black/60 border border-white/10 transition-all" title="Download Image">
            <DownloadIcon className="w-4 h-4 text-white" />
        </Button>
    </div>
);

export const ImagePanel: React.FC<ImagePanelProps> = ({ 
  image, versions, activeVersionIndex, isLoading, error, 
  onSaveToggle, onNextVersion, onPrevVersion, activeMask, onMaskChange,
  onViewFullScreen, onDownload, onAddWatermark
}) => {
  const [isInpaintMode, setIsInpaintMode] = useState(false);
  const [brushSize, setBrushSize] = useState(40);
  const [isDrawing, setIsDrawing] = useState(false);

  const imageCanvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);

  const clearMask = useCallback(() => {
    const maskCanvas = maskCanvasRef.current;
    if (maskCanvas) {
      const ctx = maskCanvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
        onMaskChange(null);
      }
    }
  }, [onMaskChange]);
  
  // Effect to clear canvas if mask is cleared externally (e.g., after sending message)
  useEffect(() => {
    if (activeMask === null && maskCanvasRef.current) {
      const maskCanvas = maskCanvasRef.current;
      const ctx = maskCanvas.getContext('2d');
      ctx?.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
    }
  }, [activeMask]);


  useEffect(() => {
    const imageEl = new Image();
    imageEl.crossOrigin = "anonymous";
    imageEl.src = image.dataUrl;
    imageEl.onload = () => {
      const imageCanvas = imageCanvasRef.current;
      const maskCanvas = maskCanvasRef.current;
      if (imageCanvas && maskCanvas) {
        // Set canvas buffer to the full, natural resolution of the source image
        imageCanvas.width = imageEl.naturalWidth;
        imageCanvas.height = imageEl.naturalHeight;
        maskCanvas.width = imageEl.naturalWidth;
        maskCanvas.height = imageEl.naturalHeight;

        // Draw the image at full resolution onto the canvas
        const ctx = imageCanvas.getContext('2d');
        ctx?.drawImage(imageEl, 0, 0, imageEl.naturalWidth, imageEl.naturalHeight);
        
        // Let CSS handle the responsive scaling of the canvas element itself
      }
    };
  }, [image.dataUrl]);

  const getCoords = (e: React.MouseEvent): [number, number] => {
    const canvas = maskCanvasRef.current;
    if (!canvas) return [0, 0];
    const rect = canvas.getBoundingClientRect();
    
    // Calculate the scale factor between the canvas buffer size and its displayed size
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const canvasX = (e.clientX - rect.left) * scaleX;
    const canvasY = (e.clientY - rect.top) * scaleY;
    
    return [canvasX, canvasY];
  };

  const startDrawing = (e: React.MouseEvent) => {
    if (!isInpaintMode) return;
    setIsDrawing(true);
    const [x, y] = getCoords(e);
    const ctx = maskCanvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing || !isInpaintMode) return;
    const [x, y] = getCoords(e);
    const canvas = maskCanvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      const rect = canvas.getBoundingClientRect();
      const scale = canvas.width / rect.width; // Use a single scale factor for simplicity

      ctx.lineTo(x, y);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = brushSize * scale;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = maskCanvasRef.current;
    if (canvas) {
      onMaskChange(canvas.toDataURL());
    }
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-center p-8 bg-gray-900 overflow-hidden relative">
      {error && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-500/90 text-white px-4 py-2 rounded-lg z-30">
          <p>{error}</p>
        </div>
      )}

      <div className="w-full flex justify-center items-center gap-3 absolute top-4 z-20">
         <Button onClick={() => setIsInpaintMode(!isInpaintMode)} variant={isInpaintMode ? 'default' : 'ghost'} size="default" className="bg-gray-800/80 backdrop-blur-md border border-gray-700 hover:border-gray-600 shadow-lg">
            <BrushIcon className="w-4 h-4 mr-2" />
            Inpaint
        </Button>
        {isInpaintMode && (
          <div className="flex items-center gap-3 bg-gray-800/80 backdrop-blur-md border border-gray-700 px-3 py-2 rounded-lg shadow-lg">
             <label htmlFor="brushSize" className="text-xs font-medium text-gray-300">Brush:</label>
             <input
                id="brushSize"
                type="range"
                min="10"
                max="100"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-24 accent-teal-500"
             />
             <span className="text-xs text-gray-400 w-8">{brushSize}</span>
             <Button onClick={clearMask} variant="ghost" size="sm" className="hover:bg-gray-700">
                <CleanIcon className="w-4 h-4 mr-1.5" />
                Clear
            </Button>
          </div>
        )}
        <Button onClick={() => onSaveToggle(image.id)} variant="ghost" size="default" className="bg-gray-800/80 backdrop-blur-md border border-gray-700 hover:border-yellow-500/50 shadow-lg">
          <StarIcon className={`w-4 h-4 mr-2 transition-colors ${image.isSaved ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} />
          {image.isSaved ? 'Saved' : 'Save'}
        </Button>
      </div>

      <div className="relative flex-grow w-full flex items-center justify-center">
        <div className="relative shadow-2xl rounded-lg overflow-hidden flex items-center justify-center max-w-full max-h-full">
            <ImageActions onViewFullScreen={onViewFullScreen} onDownload={onDownload} onAddWatermark={onAddWatermark} />
            <canvas ref={imageCanvasRef} className="max-w-full max-h-full" />
            <canvas 
                ref={maskCanvasRef} 
                className={`absolute top-0 left-0 max-w-full max-h-full ${isInpaintMode ? 'cursor-crosshair' : 'pointer-events-none'}`}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
            />
            {isLoading && <Shimmer />}

            {versions.length > 1 && (
                <>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 rounded-full transition-all"
                        onClick={onPrevVersion}
                        aria-label="Previous version"
                    >
                        <ChevronLeftIcon className="w-5 h-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 rounded-full transition-all"
                        onClick={onNextVersion}
                        aria-label="Next version"
                    >
                        <ChevronRightIcon className="w-5 h-5" />
                    </Button>
                </>
            )}
        </div>
      </div>

      {versions.length > 0 && (
        <div className="w-full pt-4 flex justify-center items-center">
            <div className="bg-gray-800/50 px-4 py-2 rounded-full text-sm font-medium">
                Version {activeVersionIndex + 1} of {versions.length}
            </div>
        </div>
    )}
    </div>
  );
};