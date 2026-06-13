import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../data/products';
import { useLanguage } from './LanguageContext';
import { ChevronRight, Keyboard, Laptop, MousePointer2, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { t, language } = useLanguage();
  const title = language === 'ar' ? product.name.ar : product.name.fr;
  const desc = language === 'ar' ? product.description.ar : product.description.fr;
  const hasMainImage = product.mainImage && product.mainImage.trim() !== "";

  const isKeyboard = product.name.fr.toLowerCase().includes('keyboard');
  const isPen = product.name.fr.toLowerCase().includes('pen') || product.name.fr.toLowerCase().includes('stylus');
  const isMouse = product.name.fr.toLowerCase().includes('mouse');

  const [aspectRatio, setAspectRatio] = React.useState<number>(4/3);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    if (naturalWidth && naturalHeight) {
      setAspectRatio(naturalWidth / naturalHeight);
    }
  };

  return (
    <Link to={`/product/${product.slug}`} className="cursor-pointer block h-full group no-underline">
      <motion.div
        whileHover={{ y: -6, scale: 1.02 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="bg-bento-bg rounded-3xl overflow-hidden border border-white/5 shadow-xl shadow-black/40 hover:border-cyan-500/30 hover:shadow-[0_20px_50px_rgba(6,182,212,0.15)] flex flex-col h-full relative"
      >
        {/* Top absolute glow accent */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-500 to-red-500 opacity-20 group-hover:opacity-100 transition-opacity"></div>

        {/* Image Area */}
        <div 
          style={{ aspectRatio: `${aspectRatio}` }}
          className="relative bg-black/40 flex items-center justify-center p-6 border-b border-white/5 overflow-hidden select-none transition-all duration-300"
        >
          {hasMainImage ? (
            <img
              src={product.mainImage}
              onLoad={handleImageLoad}
              alt={title}
              className="w-full h-full max-h-[100%] max-w-[100%] object-contain p-2 drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full rounded-2xl bg-gradient-to-br from-[#0c0c0e] to-[#16161a] border border-white/5 flex flex-col items-center justify-center relative p-4">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:16px_16px]"></div>
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-red-500 mb-2 border border-white/10 group-hover:rotate-6 transition-transform">
                {isKeyboard && <Keyboard className="w-6 h-6 text-cyan-400" />}
                {isPen && <Laptop className="w-6 h-6 text-red-500" />}
                {isMouse && <MousePointer2 className="w-6 h-6 text-cyan-400" />}
                {!isKeyboard && !isPen && !isMouse && <Sparkles className="w-6 h-6 text-red-500" />}
              </div>
              <span className="text-[9px] font-mono font-black text-gray-500 uppercase tracking-widest text-center">Techpad Asset</span>
            </div>
          )}
        </div>

        {/* Info Block */}
        <div className="p-6 flex flex-col flex-grow gap-4">
          <div className="space-y-1.5 flex-grow">
            <h2 className="text-lg font-black text-white group-hover:text-cyan-400 transition-colors uppercase tracking-tight leading-tight">
              {title}
            </h2>
            <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
              {desc}
            </p>
          </div>

          {/* Pricing & CTA */}
          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest">{t('price')}</span>
              <span className="text-xl font-black text-red-500 font-mono tracking-tighter italic">
                {product.price} DA
              </span>
            </div>

            <div
              className="px-4 py-2 bg-white text-black text-xs font-black uppercase rounded-xl hover:bg-red-500 hover:text-white transition-all flex items-center gap-1.5 shadow-lg group-active:scale-95"
            >
              <span>{t('viewProduct')}</span>
              <ChevronRight size={14} className={cn(language === 'ar' && "rotate-180")} />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};
