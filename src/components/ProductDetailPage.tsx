import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { useLanguage } from './LanguageContext';
import { Gallery } from './Gallery';
import { OrderForm } from './OrderForm';
import { Pixel } from '../lib/pixel';
import { cn } from '../lib/utils';
import { ArrowLeft, ArrowRight, Zap, Target, Award, Cpu, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();

  const product = products.find((p) => p.slug === slug);

  useEffect(() => {
    if (product) {
      Pixel.viewContent({
        value: product.price,
        currency: "DZD",
        content_name: product.name.fr,
        content_type: "product"
      });
      document.title = `${language === 'ar' ? product.name.ar : product.name.fr} - Techpad`;
    }
  }, [product, language]);

  if (!product) {
    return (
      <div className="min-h-screen bg-app-bg text-white flex flex-col items-center justify-center p-6 text-center select-none font-sans">
        <h1 className="text-3xl font-black text-red-500 uppercase tracking-widest mb-4">Produit Non Trouvé</h1>
        <p className="text-gray-400 text-sm mb-6 max-w-md">Ce produit n'existe pas ou a été retiré de la boutique.</p>
        <Link to="/" className="px-6 py-3 bg-red-500 hover:bg-red-600 rounded-full font-bold text-sm tracking-wide transition-all uppercase">
          Retour à la boutique
        </Link>
      </div>
    );
  }

  const name = language === 'ar' ? product.name.ar : product.name.fr;
  const desc = language === 'ar' ? product.description.ar : product.description.fr;
  const productFeatures = language === 'ar' ? product.features.ar : product.features.fr;

  const allImages = [
    product.mainImage,
    product.secondaryImage,
    ...(product.gallery || [])
  ].filter((img): img is string => typeof img === 'string' && img.trim() !== "");

  const featureIcons = [
    <Zap size={18} className="text-cyan-400" />,
    <Target size={18} className="text-red-500" />,
    <Award size={18} className="text-cyan-400" />,
    <Cpu size={18} className="text-red-500" />,
    <ShieldCheck size={18} className="text-cyan-400" />,
  ];

  return (
    <div className="min-h-screen bg-app-bg text-white font-sans p-4 select-none">
      {/* Top Bar */}
      <header dir="ltr" className="flex justify-between items-center mb-8 px-2 max-w-7xl mx-auto w-full">
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center gap-2 group cursor-pointer">
          <div className="w-8 h-8 bg-gradient-to-tr from-cyan-400 to-red-500 rounded-lg shadow-lg shadow-red-500/20 group-hover:rotate-12 transition-transform"></div>
          <span className="font-bold text-lg tracking-tight uppercase italic text-white">TECH<span className="text-red-500">PAD</span></span>
        </Link>

        {/* Language select */}
        <div className="flex bg-[#1a1a1c] rounded-full p-0.5 border border-white/10">
          <button 
            onClick={() => setLanguage('ar')}
            className={cn(
              "px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer",
              language === 'ar' ? "bg-white text-black" : "text-gray-400 hover:text-white"
            )}
          >
            AR
          </button>
          <button 
            onClick={() => setLanguage('fr')}
            className={cn(
              "px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer",
              language === 'fr' ? "bg-white text-black" : "text-gray-400 hover:text-white"
            )}
          >
            FR
          </button>
        </div>
      </header>

      {/* Return to Store Button - positioned below the top bar */}
      <div className="max-w-7xl mx-auto w-full px-2 mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors bg-white/5 px-4 py-2.5 rounded-full border border-white/5 hover:border-white/10"
        >
          {language === 'ar' ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
          <span>{t('backToStore')}</span>
        </Link>
      </div>

      <main className="max-w-7xl mx-auto grid grid-cols-12 gap-6 pb-20">
        {/* Left Column: Product Gallery & dynamic Feature List */}
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">
          {/* Gallery Card */}
          <div className="bg-bento-bg rounded-3xl p-8 border border-white/5 relative overflow-hidden flex-1 shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-500 via-magenta-500 to-red-500 opacity-30"></div>
            <Gallery images={allImages} productName={name} />
          </div>

          {/* Features Grid layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {productFeatures.map((feat, i) => (
              <div
                key={i}
                className="bg-bento-bg py-2.5 px-4 rounded-xl border border-white/5 flex items-center gap-3 hover:border-white/15 transition-all text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                  {featureIcons[i % featureIcons.length]}
                </div>
                <p className="text-xs font-bold leading-snug tracking-wide text-gray-200">{feat}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Title info card & Embedded order checkout */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
          {/* Main info heading box */}
          <div className="bg-bento-bg rounded-3xl p-8 border border-white/5 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 blur-2xl rounded-full"></div>
            <div className="inline-block px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-500/20 mb-4">
              {language === 'ar' ? 'عرض محدود' : 'OFFRE LIMITÉE'}
            </div>
            <h1 className="text-2xl font-black mb-3 leading-tight uppercase tracking-tight break-words">
              {name}
            </h1>
            <div className="flex items-baseline gap-3 pt-4 border-t border-white/5">
              <span className="text-4xl font-black text-red-500 font-mono tracking-tighter italic">{product.price} DA</span>
              <span className="text-gray-600 line-through text-xs font-semibold">
                {Math.round(product.price * 1.45 / 100) * 100} DA
              </span>
            </div>
          </div>

          {/* Checkout Checkout form */}
          <div className="flex-1">
            <OrderForm product={product} />
          </div>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-2 mt-12 pb-12">
        <div className="bg-bento-bg rounded-3xl p-8 border border-white/5 text-center flex flex-col items-center">
          <div className="text-2xl font-black tracking-tighter italic mb-4 uppercase">TECH<span className="text-red-500">PAD</span></div>
          <p className="text-gray-500 text-xs">© 2026 {name}. All rights reserved.</p>
          <div className="mt-6 flex justify-center gap-6 text-gray-600 text-[10px] font-black uppercase tracking-widest">
            <Link to="/" className="hover:text-red-500 transition-colors">BOUTIQUE</Link>
            <span>•</span>
            <Link to="/admin" className="hover:text-red-500 transition-colors">DASHBOARD</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
