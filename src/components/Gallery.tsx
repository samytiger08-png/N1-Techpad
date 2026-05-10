import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const images = [
  "https://i.ibb.co/RpJkvbPS/IMG-8345.jpg",
  "https://i.ibb.co/VYK4Cbqx/IMG-8346.jpg",
  "https://i.ibb.co/B25SXrMd/IMG-8347.jpg"
];

export const Gallery: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="flex flex-col gap-6 w-full h-full justify-center items-center">
      <div className="relative w-full aspect-[4/3] flex items-center justify-center rounded-2xl overflow-hidden bg-black/40 backdrop-blur-sm shadow-inner group">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="max-w-[90%] max-h-[90%] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            alt={`Product ${currentIndex + 1}`}
          />
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-4">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              "w-16 h-16 rounded-2xl overflow-hidden border-2 transition-all p-1 bg-black shadow-lg",
              currentIndex === index ? "border-cyan-500 ring-4 ring-cyan-500/20 scale-110" : "border-white/10 opacity-40 hover:opacity-100 hover:border-white/30"
            )}
          >
            <img src={img} className="w-full h-full object-contain" alt={`Thumb ${index + 1}`} />
          </button>
        ))}
      </div>
    </div>
  );
};
