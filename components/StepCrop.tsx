import React, { useState, useRef, useEffect } from 'react';
import { AspectRatio } from '../types';

interface StepCropProps {
  imageSrc: string;
  aspectRatio: AspectRatio;
  onCropComplete: (croppedImage: string) => void;
  onBack: () => void;
}

export const StepCrop: React.FC<StepCropProps> = ({ imageSrc, aspectRatio, onCropComplete, onBack }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Constants for layout
  const CONTAINER_WIDTH = 350;
  const CONTAINER_HEIGHT = 500; // Space available for the crop area
  
  // Calculate frame size based on aspect ratio
  const getFrameDimensions = () => {
    const [w, h] = aspectRatio.split(':').map(Number);
    const ratio = w / h;

    // Fit frame within container limits
    let frameW = CONTAINER_WIDTH;
    let frameH = frameW / ratio;

    if (frameH > CONTAINER_HEIGHT) {
      frameH = CONTAINER_HEIGHT;
      frameW = frameH * ratio;
    }

    return { width: frameW, height: frameH };
  };

  const frame = getFrameDimensions();

  // Initialize image position (Center and Cover)
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;
    
    // Frame dimensions
    const fw = frame.width;
    const fh = frame.height;
    
    // Calculate scale to Cover
    // We compare the ratios to see which dimension limits the cover
    const scaleX = fw / naturalWidth;
    const scaleY = fh / naturalHeight;
    
    // To cover, we need the larger scale factor
    const scaleToCover = Math.max(scaleX, scaleY);
    
    setScale(scaleToCover);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch support
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.touches[0].clientX - position.x, y: e.touches[0].clientY - position.y });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y
    });
  };

  const validateCrop = () => {
     if (!imageRef.current || !containerRef.current) return false;
     
     const imgRect = imageRef.current.getBoundingClientRect();
     const frameRect = containerRef.current.getBoundingClientRect();
     
     // Allow a small tolerance (e.g., 1px) for rounding errors
     const TOLERANCE = 1;
     
     // Validation Logic: The Image MUST cover the Frame completely.
     const isValid = (
         imgRect.left <= frameRect.left + TOLERANCE &&
         imgRect.right >= frameRect.right - TOLERANCE &&
         imgRect.top <= frameRect.top + TOLERANCE &&
         imgRect.bottom >= frameRect.bottom - TOLERANCE
     );

     return isValid;
  };

  const handleConfirm = () => {
    if (validateCrop()) {
      setError(null);
      generateCrop();
    } else {
      setError("Este recorte não corresponde à proporção selecionada. Ajuste a imagem para preencher a moldura corretamente.");
    }
  };

  const generateCrop = () => {
    if (!imageRef.current || !containerRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Determine output size (High Quality)
    const [wRatio, hRatio] = aspectRatio.split(':').map(Number);
    const canvasWidth = wRatio === 9 ? 1080 : 1920;
    const canvasHeight = hRatio === 16 ? 1920 : 1080;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Mapping from Visual DOM pixels to Canvas pixels
    const frameRect = containerRef.current.getBoundingClientRect();
    const imgRect = imageRef.current.getBoundingClientRect();

    // Calculate the relative position of the image inside the frame
    const relativeX = imgRect.left - frameRect.left;
    const relativeY = imgRect.top - frameRect.top;

    // Scale factor: How much bigger is the canvas compared to the visual frame?
    const scaleFactor = canvasWidth / frameRect.width;

    ctx.fillStyle = 'black'; // Fallback
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // We must draw the image using its visual size scaled up
    // imgRect.width and height are the rendered sizes (including transform scale)
    ctx.drawImage(
        imageRef.current,
        relativeX * scaleFactor,
        relativeY * scaleFactor,
        imgRect.width * scaleFactor,
        imgRect.height * scaleFactor
    );

    onCropComplete(canvas.toDataURL('image/jpeg', 0.95));
  };

  // Initial Fit Effect
  useEffect(() => {
    // Reset transform when image changes
    // Logic moved to handleImageLoad for better accuracy
  }, [imageSrc]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full animate-fade-in p-4">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-white">Recorte Fixo ({aspectRatio})</h2>
        <p className="text-slate-400 text-sm">Mova e amplie a imagem para preencher a moldura.</p>
      </div>

      {/* Crop Area Container */}
      <div className="relative flex items-center justify-center bg-slate-950/50 rounded-xl border border-slate-800 overflow-hidden shadow-2xl select-none"
           style={{ width: CONTAINER_WIDTH + 40, height: CONTAINER_HEIGHT + 40 }}
      >
         {/* The "Frame" Window */}
         <div 
            ref={containerRef}
            className="relative overflow-hidden shadow-[0_0_0_9999px_rgba(0,0,0,0.7)] z-10 border-2 border-brand-500 pointer-events-none"
            style={{ width: frame.width, height: frame.height }}
         >
            {/* Grid Lines for Visual Aid */}
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-30">
                 <div className="border-r border-b border-white"></div>
                 <div className="border-r border-b border-white"></div>
                 <div className="border-b border-white"></div>
                 <div className="border-r border-b border-white"></div>
                 <div className="border-r border-b border-white"></div>
                 <div className="border-b border-white"></div>
                 <div className="border-r border-white"></div>
                 <div className="border-r border-white"></div>
                 <div className=""></div>
            </div>
         </div>

         {/* The Movable Image Layer (Behind the Frame) */}
         <div 
            className="absolute inset-0 flex items-center justify-center cursor-move touch-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
         >
             <img 
                ref={imageRef}
                src={imageSrc}
                onLoad={handleImageLoad}
                draggable={false}
                alt="Crop Target"
                style={{
                    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                    transformOrigin: 'center',
                    // Important: Allow natural size, controlled only by transform scale
                    maxWidth: 'none',
                    maxHeight: 'none',
                    width: 'auto',
                    height: 'auto',
                    display: 'block'
                }}
             />
         </div>
      </div>

      {/* Controls */}
      <div className="w-full max-w-xs mt-6 space-y-4">
        {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-xs text-center animate-pulse">
                {error}
            </div>
        )}

        <div className="flex items-center space-x-4 px-4 py-3 bg-slate-800/80 rounded-full border border-slate-700">
            <span className="text-xs text-slate-400 font-medium">Zoom</span>
            <input 
                type="range" min="0.1" max="4" step="0.01" 
                value={scale} 
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-brand-500"
            />
        </div>

        <div className="flex space-x-4 w-full justify-center">
            <button onClick={onBack} className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors">
                Voltar
            </button>
            <button onClick={handleConfirm} className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold shadow-lg shadow-brand-900/30 transition-all">
                Confirmar Recorte
            </button>
        </div>
      </div>
    </div>
  );
};