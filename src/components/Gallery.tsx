import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { Sparkles, Keyboard, Laptop, MousePointer2 } from 'lucide-react';

interface GalleryProps {
  images?: string[];
  productName: string;
}

// A helper thumbnail component that can load its image and determine its aspect ratio
const GalleryThumbnail: React.FC<{
  img: string;
  index: number;
  isSelected: boolean;
  onClick: () => void;
  productName: string;
}> = ({ img, index, isSelected, onClick, productName }) => {
  const [aspect, setAspect] = useState<number | null>(null);

  return (
    <button
      onClick={onClick}
      style={{ aspectRatio: aspect ? `${aspect}` : '1/1' }}
      className={cn(
        "h-14 sm:h-16 rounded-2xl overflow-hidden border-2 transition-all p-1 bg-black shadow-lg cursor-pointer flex-shrink-0 snap-center",
        isSelected 
          ? "border-cyan-500 ring-4 ring-cyan-500/20 scale-105" 
          : "border-white/10 opacity-40 hover:opacity-100 hover:border-white/30"
      )}
    >
      <img
        src={img}
        onLoad={(e) => {
          const { naturalWidth, naturalHeight } = e.currentTarget;
          if (naturalWidth && naturalHeight) {
            setAspect(naturalWidth / naturalHeight);
          }
        }}
        className="w-full h-full object-contain"
        alt={`${productName} thumbnail ${index + 1}`}
      />
    </button>
  );
};

export const Gallery: React.FC<GalleryProps> = ({ images = [], productName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);

  // Reset index and orientation default when product changes
  useEffect(() => {
    setCurrentIndex(0);
    setAspectRatio(null);
  }, [productName]);

  const hasImages = images && images.length > 0;

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    if (naturalWidth && naturalHeight) {
      setAspectRatio(naturalWidth / naturalHeight);
    }
  };

  // Render a glorious, polished, high-tech animated placeholder based on the product
  const renderPlaceholder = () => {
    const isKeyboard = productName.toLowerCase().includes('keyboard');
    const isPen = productName.toLowerCase().includes('pen') || productName.toLowerCase().includes('stylus');
    const isMouse = productName.toLowerCase().includes('mouse');

    return (
      <div className="w-full h-full min-h-[300px] bg-gradient-to-br from-[#0c0c0e] via-[#141416] to-[#1e1424] flex flex-col items-center justify-center relative p-8 select-none overflow-hidden rounded-2xl">
        {/* Futuristic grids & neon pulses */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        {/* Glow behind icon */}
        <div className="absolute w-44 h-44 rounded-full bg-red-500/10 blur-3xl animate-pulse"></div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 flex flex-col items-center gap-6"
        >
          {/* Main animated icon indicator */}
          <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-tr from-cyan-500 to-red-500 p-[1px] shadow-lg shadow-red-500/10">
            <div className="w-full h-full rounded-[1.95rem] bg-[#0c0c0e] flex items-center justify-center text-white">
              {isKeyboard && <Keyboard className="w-10 h-10 text-cyan-400" />}
              {isPen && <Laptop className="w-10 h-10 text-red-500" />}
              {isMouse && <MousePointer2 className="w-10 h-10 text-cyan-400" />}
              {!isKeyboard && !isPen && !isMouse && <Sparkles className="w-10 h-10 text-red-500" />}
            </div>
          </div>

          <div className="text-center space-y-2">
            <h3 className="text-sm font-black tracking-widest text-gray-400 uppercase">TECHPAD STORE</h3>
            <p className="text-xl font-bold tracking-tight text-white whitespace-pre-wrap px-4">{productName}</p>
            <span className="inline-block px-3 py-1 bg-white/5 rounded-full text-[10px] font-black text-cyan-400 uppercase tracking-widest border border-white/10">
              PRÈS POUR LE SETUP
            </span>
          </div>
        </motion.div>

        {/* Ambient absolute labels */}
        <span className="absolute bottom-4 left-4 text-[9px] font-mono font-bold text-gray-700 tracking-widest uppercase">TECHPAD MODEL ID: M-PLACEHOLDER</span>
        <span className="absolute top-4 right-4 text-[9px] font-mono font-bold text-red-500/40 tracking-widest uppercase">RESERVED FOR REAL PICTURES</span>
      </div>
    );
  };

  if (!hasImages) {
    return (
      <div className="flex flex-col gap-6 w-full h-full justify-center items-center">
        <div className="relative w-full aspect-[4/3] flex items-center justify-center rounded-2xl overflow-hidden bg-black/40 backdrop-blur-sm shadow-inner overflow-hidden">
          {renderPlaceholder()}
        </div>
      </div>
    );
  }

  const currentRatio = aspectRatio || 4/3;
  const isPortrait = currentRatio < 1;
  const maxContainerHeight = isPortrait ? '550px' : '420px';
  const widthVal = isPortrait ? `calc(min(100%, ${550 * currentRatio}px))` : '100%';

  return (
    <div className="flex flex-col gap-6 w-full h-full justify-center items-center">
      <div 
        style={{ 
          aspectRatio: `${currentRatio}`,
          width: widthVal,
          maxHeight: maxContainerHeight
        }}
        className="relative mx-auto flex items-center justify-center rounded-2xl overflow-hidden bg-black/40 backdrop-blur-sm shadow-inner group transition-all duration-300 ease-out"
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            onLoad={handleImageLoad}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full h-full p-2 sm:p-4 object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            alt={`${productName} view ${currentIndex + 1}`}
          />
        </AnimatePresence>
      </div>

      <div className="w-full max-w-full overflow-hidden">
        <div className="flex gap-3 overflow-x-auto pb-2 pt-1 max-w-full justify-start sm:justify-center no-scrollbar snap-x snap-mandatory">
          {images.map((img, index) => (
            <GalleryThumbnail
              key={index}
              img={img}
              index={index}
              isSelected={currentIndex === index}
              onClick={() => setCurrentIndex(index)}
              productName={productName}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
