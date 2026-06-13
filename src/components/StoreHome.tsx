import React, { useEffect } from 'react';
import { products } from '../data/products';
import { ProductCard } from './ProductCard';
import { useLanguage } from './LanguageContext';
import { Pixel } from '../lib/pixel';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export const StoreHome: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();

  useEffect(() => {
    // Page views on the main store are tracked on Meta pixel
    Pixel.pageView();
    document.title = "N1 Techpad | Store";
  }, []);

  return (
    <div className="min-h-screen bg-app-bg text-white font-sans p-4 md:p-6 select-none">
      {/* Header element */}
      <header dir="ltr" className="flex justify-between items-center mb-8 px-2 max-w-7xl mx-auto w-full">
        {/* Language Selection bar */}
        <div className="flex bg-[#1a1a1c] rounded-full p-0.5 border border-white/10">
          <button 
            onClick={() => setLanguage('ar')}
            className={cn(
              "px-3 py-1.5 rounded-full text-[10px] font-bold transition-all cursor-pointer",
              language === 'ar' ? "bg-white text-black" : "text-gray-400 hover:text-white"
            )}
          >
            AR
          </button>
          <button 
            onClick={() => setLanguage('fr')}
            className={cn(
              "px-3 py-1.5 rounded-full text-[10px] font-bold transition-all cursor-pointer",
              language === 'fr' ? "bg-white text-black" : "text-gray-400 hover:text-white"
            )}
          >
            FR
          </button>
        </div>

        {/* Techpad elegant logo */}
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-8 h-8 bg-gradient-to-tr from-cyan-400 to-red-500 rounded-lg shadow-lg shadow-red-500/20 group-hover:rotate-12 transition-transform"></div>
          <span className="font-bold text-lg tracking-tight uppercase italic">TECH<span className="text-red-500">PAD</span></span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto pb-20">
        {/* Hero gaming banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-bento-bg to-[#121215] rounded-[2.5rem] p-8 md:p-14 border border-white/5 relative overflow-hidden mb-12 text-center flex flex-col items-center justify-center shadow-2xl"
        >
          {/* Neon side glows */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-500 via-magenta-500 to-red-500 opacity-60"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-red-500/5 blur-3xl rounded-full pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-500/5 blur-3xl rounded-full pointer-events-none"></div>

          {/* National shipping badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-cyan-500/10 text-cyan-400 rounded-full text-xs font-black uppercase tracking-widest border border-cyan-500/20 mb-6 shadow-md shadow-cyan-500/5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            {t('deliveryAlgeria')}
          </div>

          {/* Title and descriptions */}
          <h1 className="text-4xl md:text-6xl font-black mb-4 uppercase tracking-tighter italic text-center">
            {language === 'ar' ? (
              <>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">متجر</span>
                <span className="text-red-500"> TECHPAD</span>
              </>
            ) : (
              <>
                TECH<span className="text-red-500">PAD</span> GAMING STORE
              </>
            )}
          </h1>
          
          <p className="text-xs md:text-sm text-gray-400 max-w-xl leading-relaxed font-bold tracking-wide uppercase">
            {t('storeSubtitle')}
          </p>
        </motion.div>

        {/* Dynamic Responsively scaled Store Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((prod) => (
            <ProductCard key={prod.slug} product={prod} />
          ))}
        </div>
      </main>

      {/* Elegant minimalist Footer */}
      <footer className="max-w-7xl mx-auto px-2 mt-12 pb-12 border-t border-white/5 pt-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-2xl font-black tracking-tighter italic uppercase text-center md:text-left">
            TECH<span className="text-red-500">PAD</span>
          </div>
          <p className="text-gray-500 text-xs text-center md:text-right">
            © 2026 Techpad Gaming Store. All rights reserved.
          </p>
          <div className="flex justify-center gap-6 text-gray-600 text-[10px] font-black uppercase tracking-widest">
            <Link to="/admin" className="hover:text-red-500 transition-colors">DASHBOARD</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
