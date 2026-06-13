import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { LanguageProvider } from './components/LanguageContext';
import { StoreHome } from './components/StoreHome';
import { ProductDetailPage } from './components/ProductDetailPage';
import { AdminPanel } from './components/AdminPanel';
import { Pixel } from './lib/pixel';

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

export default function App() {
  return (
    <Router>
      <PixelTracker />
      <LanguageProvider>
        <Routes>
          <Route path="/" element={<StoreHome />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </LanguageProvider>
    </Router>
  );
}
