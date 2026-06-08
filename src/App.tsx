import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LanguageProvider, useLanguage } from './components/LanguageContext';
import { Gallery } from './components/Gallery';
import { OrderForm } from './components/OrderForm';
import { AdminPanel } from './components/AdminPanel';
import { Pixel } from './lib/pixel';
import { cn } from './lib/utils';
import { Zap, ShieldCheck, Maximize2, Palette, MousePointer2, Languages } from 'lucide-react';
import { motion } from 'motion/react';

const PixelTracker: React.FC = () => {
  const location = useLocation();
  const initialized = React.useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      return;
    }
    Pixel.pageView();
  }, [location.pathname]);

  return null;
};

const LandingPage: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();

  useEffect(() => {
    Pixel.viewContent({
      value: 8900,
      currency: "DZD",
      content_name: "Wireless Charging RGB Mousepad",
      content_type: "product"
    });
  }, []);

  const features = [
    { icon: <Zap size={24} />, text: t('feature1') },
    { icon: <Palette size={24} />, text: t('feature2') },
    { icon: <ShieldCheck size={24} />, text: t('feature4') },
    { icon: <Maximize2 size={24} />, text: `${t('feature3')} • ${t('feature5')}` },
  ];

  return (
    <div className="min-h-screen bg-app-bg text-white font-sans p-4 select-none">
      {/* Top Bar / Lang Switcher & Promo Banner */}
      <header dir="ltr" className="grid grid-cols-3 items-center mb-6 px-2 max-w-7xl mx-auto w-full">
        <div className="justify-self-start flex bg-[#1a1a1c] rounded-full p-1 border border-white/10">
          <button 
            onClick={() => setLanguage('ar')}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-bold transition-all",
              language === 'ar' ? "bg-white text-black" : "text-gray-400 hover:text-white"
            )}
          >
            AR
          </button>
          <button 
            onClick={() => setLanguage('fr')}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-bold transition-all",
              language === 'fr' ? "bg-white text-black" : "text-gray-400 hover:text-white"
            )}
          >
            FR
          </button>
        </div>

        <div className="justify-self-center flex items-center">
          <div className="w-[315.885px] bg-[#EF4444] text-white font-extrabold text-[18px] leading-[19px] py-3 rounded-full shadow-xl shadow-red-500/30 tracking-wide select-none text-center transform hover:scale-105 transition-transform duration-200">
            {t('promoBanner')}
          </div>
        </div>

        <div className="justify-self-end flex items-center gap-2 group cursor-pointer">
          <div className="w-8 h-8 bg-gradient-to-tr from-cyan-400 to-red-500 rounded-lg shadow-lg shadow-red-500/20 group-hover:rotate-12 transition-transform"></div>
          <span className="font-bold text-lg tracking-tight uppercase italic">TECH<span className="text-red-500">PAD</span></span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-12 gap-6 pb-20">
        {/* Left Column: Product Gallery & Features */}
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">
          {/* Gallery Card */}
          <div className="bg-bento-bg rounded-3xl p-8 border border-white/5 relative overflow-hidden flex-1 shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-magenta-500 to-red-500 opacity-50"></div>
            <Gallery />
          </div>

          {/* Features Bento */}
          <div className="grid grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="bg-bento-bg p-6 rounded-3xl border border-white/5 flex flex-col justify-center items-center text-center group hover:border-white/20 transition-all">
                <div className="w-12 h-12 mb-4 rounded-2xl bg-white/5 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <p className="text-sm font-bold leading-tight">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Info & Form */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
          {/* Info Card */}
          <div className="bg-bento-bg rounded-3xl p-8 border border-white/5 shadow-xl">
            <div className="inline-block px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-500/20 mb-4">
              {language === 'ar' ? 'عرض محدود' : 'OFFRE LIMITÉE'}
            </div>
            <h1 className="text-3xl font-black mb-2 leading-tight uppercase tracking-tight">
              {t('productName')}
            </h1>
            <p className="text-cyan-400 text-lg font-medium mb-6">
              {t('heroHook')}
            </p>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-black text-red-500 font-mono tracking-tighter italic">{t('price')}</span>
              <span className="text-gray-600 line-through text-sm font-medium">12900 DA</span>
            </div>
          </div>

          {/* Form Card */}
          <div className="flex-1">
            <OrderForm />
          </div>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-2 mt-12 pb-12">
        <div className="bg-bento-bg rounded-3xl p-8 border border-white/5 text-center flex flex-col items-center">
          <div className="text-2xl font-black tracking-tighter italic mb-4 uppercase">TECH<span className="text-red-500">PAD</span></div>
          <p className="text-gray-500 text-sm">© 2026 {t('productName')}. All rights reserved.</p>
          <div className="mt-6 flex justify-center gap-6 text-gray-600 text-[10px] font-black uppercase tracking-widest">
             <Link to="/admin" className="hover:text-red-500 transition-colors">DASHBOARD</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <PixelTracker />
      <LanguageProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </LanguageProvider>
    </Router>
  );
}
