import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useLanguage } from './LanguageContext';
import { deliveryData } from '../constants/delivery';
import { DeliveryType, Order } from '../types';
import { Pixel } from '../lib/pixel';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { Phone, User, MapPin, Truck, Box, CheckCircle2, ChevronDown, Palette } from 'lucide-react';
import citiesData from '../data/algeria_cities.json';
import { Product } from '../data/products';

const cities = citiesData as any[];

// Get unique wilayas from JSON
const wilayas = Array.from(
  new Map(cities.map((c) => [String(Number(c.wilaya_code)), c.wilaya_name])).entries()
).map(([code, name]) => ({ code: Number(code), name }))
.sort((a, b) => a.code - b.code);

interface OrderFormProps {
  product: Product;
}

export const OrderForm: React.FC<OrderFormProps> = ({ product }) => {
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    wilayaCode: '',
    commune: '',
    deliveryType: '' as DeliveryType | '',
    color: '' as 'Noir' | 'Blanc' | '',
  });

  const [deliveryFee, setDeliveryFee] = useState(0);

  // Filter communes based on selected wilaya
  const filteredCommunes = cities
    .filter((c) => Number(c.wilaya_code) === Number(formData.wilayaCode))
    .map((c) => c.commune_name)
    .sort((a, b) => a.localeCompare(b));

  const selectedWilaya = deliveryData.find(d => d.code === Number(formData.wilayaCode));

  useEffect(() => {
    if (selectedWilaya && formData.deliveryType) {
      const fee = selectedWilaya[formData.deliveryType];
      setDeliveryFee(fee || 0);
    } else {
      setDeliveryFee(0);
    }
  }, [formData.wilayaCode, formData.deliveryType, selectedWilaya]);

  // Reset commune and delivery type when wilaya changes
  const handleWilayaChange = (code: string) => {
    setFormData({
      ...formData,
      wilayaCode: code,
      commune: '',
      deliveryType: '',
    });
  };

  const handleDeliverySelect = (type: DeliveryType) => {
    if (selectedWilaya) {
      const fee = selectedWilaya[type];
      if (fee === null) {
        setError(t('errorNotAvailable'));
        return;
      }
    }
    setFormData(prev => ({ ...prev, deliveryType: type }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.fullName || !formData.phone || !formData.wilayaCode || !formData.commune || !formData.deliveryType) {
      setError(t('errorFillFields'));
      return;
    }

    if (product.hasColorChoice && !formData.color) {
      setError(language === 'ar' ? "يرجى اختيار لون لوحة المفاتيح" : "Veuillez choisir la couleur du clavier");
      return;
    }

    if (!selectedWilaya) return;

    const fee = selectedWilaya[formData.deliveryType as DeliveryType];
    if (fee === null) {
      setError(t('errorNotAvailable'));
      return;
    }

    setLoading(true);

    try {
      const orderData: Order = {
        productName: product.name.fr,
        productPrice: product.price,
        productsTotal: product.price,
        deliveryType: formData.deliveryType as DeliveryType,
        deliveryLabelAr: formData.deliveryType === 'stopDeskEcommerce' ? "استلام من المكتب" : "التوصيل إلى المنزل",
        deliveryLabelFr: formData.deliveryType === 'stopDeskEcommerce' ? "Livraison au bureau" : "Livraison à domicile",
        deliveryFee: fee,
        finalTotal: product.price + fee,
        customerName: formData.fullName,
        phone: formData.phone,
        wilaya: selectedWilaya.wilaya,
        wilayaCode: selectedWilaya.code,
        commune: formData.commune,
        language,
        status: 'new',
        createdAt: serverTimestamp(),
      };

      if (product.slug === 'yilima-g502x-gaming-keyboard' && (formData.color === 'Noir' || formData.color === 'Blanc')) {
        orderData.color = formData.color;
      }

      // Before calling addDoc, clean the order data and remove every key with value undefined
      (Object.keys(orderData) as Array<keyof Order>).forEach((key) => {
        if (orderData[key] === undefined) {
          delete orderData[key];
        }
      });

      console.log("Submitting orderData:", JSON.stringify(orderData, null, 2));

      await addDoc(collection(db, 'orders'), orderData);
      
      Pixel.purchase({
        value: orderData.finalTotal,
        currency: "DZD",
        content_name: orderData.productName,
        content_type: "product"
      });

      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error("Order error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 rounded-3xl shadow-xl border border-green-100 text-center max-w-lg mx-auto"
      >
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="text-green-600 w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('successMessage')}</h2>
        <button 
          onClick={() => window.location.reload()}
          className="bg-gray-900 text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
        >
          OK
        </button>
      </motion.div>
    );
  }

  return (
    <div id="order-form" className="h-full flex flex-col">
      <div className="bg-white text-black rounded-3xl shadow-2xl flex flex-col h-full border border-white/10 overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-black rounded-full"></div>
              <h2 className="text-xl font-bold uppercase tracking-tight">{t('orderFormTitle')}</h2>
           </div>
           <div className="hidden md:block text-[10px] font-black text-gray-400 tracking-widest uppercase">
              {product.name.fr}
           </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 flex flex-col flex-1 gap-6">
          <div className="flex-1 space-y-5 overflow-y-auto pr-1">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <User size={14} />
                {t('fullName')}
              </label>
              <input
                type="text"
                placeholder={t('placeHolderFullName')}
                className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black transition-all outline-none text-sm font-medium"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Phone size={14} />
                {t('phone')}
              </label>
              <input
                type="tel"
                placeholder={t('placeHolderPhone')}
                className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black transition-all outline-none text-sm font-medium"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <MapPin size={14} />
                  {t('wilaya')}
                </label>
                <div className="relative">
                  <select
                    className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black transition-all outline-none text-sm appearance-none font-medium pr-10"
                    value={formData.wilayaCode}
                    onChange={(e) => handleWilayaChange(e.target.value)}
                  >
                    <option value="">{t('selectWilaya')}</option>
                    {wilayas.map((w) => (
                      <option key={w.code} value={w.code}>{w.code} - {w.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Box size={14} />
                  {t('commune')}
                </label>
                <div className="relative">
                  <select
                    className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black transition-all outline-none text-sm appearance-none font-medium pr-10 disabled:opacity-50"
                    value={formData.commune}
                    onChange={(e) => setFormData({ ...formData, commune: e.target.value })}
                    disabled={!formData.wilayaCode}
                  >
                    <option value="">{t('selectCommune')}</option>
                    {filteredCommunes.map((c, i) => (
                      <option key={`${c}-${i}`} value={c}>{c}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
              </div>
            </div>

            {product.hasColorChoice && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Palette size={14} />
                  {t('color')}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, color: 'Noir' })}
                    className={cn(
                      "px-5 py-3.5 rounded-2xl border-2 text-xs font-bold uppercase transition-all cursor-pointer text-center",
                      formData.color === 'Noir'
                        ? "border-black bg-black text-white" 
                        : "border-gray-100 bg-gray-50 text-gray-900 hover:border-gray-200"
                    )}
                  >
                    {t('colorNoir')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, color: 'Blanc' })}
                    className={cn(
                      "px-5 py-3.5 rounded-2xl border-2 text-xs font-bold uppercase transition-all cursor-pointer text-center",
                      formData.color === 'Blanc'
                        ? "border-black bg-black text-white" 
                        : "border-gray-100 bg-gray-50 text-gray-900 hover:border-gray-200"
                    )}
                  >
                    {t('colorBlanc')}
                  </button>
                </div>
              </div>
            )}

            {formData.wilayaCode && (
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Truck size={14} />
                  {t('deliveryType')}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleDeliverySelect('domicileEcommerce')}
                    disabled={selectedWilaya?.domicileEcommerce === null}
                    className={cn(
                      "flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all cursor-pointer w-full",
                      formData.deliveryType === 'domicileEcommerce' 
                        ? "border-black bg-black text-white" 
                        : "border-gray-100 bg-gray-50 hover:border-gray-200 text-gray-900",
                      selectedWilaya?.domicileEcommerce === null && "opacity-45 cursor-not-allowed"
                    )}
                  >
                    <span className="text-xs font-bold leading-tight mb-1">{t('domicile')}</span>
                    {selectedWilaya?.domicileEcommerce !== null ? (
                      <span className={cn("text-[10px] font-mono font-bold", formData.deliveryType === 'domicileEcommerce' ? "text-red-400" : "text-gray-500")}>
                        {selectedWilaya?.domicileEcommerce} DA
                      </span>
                    ) : (
                      <span className="text-[9px] text-red-500 font-bold">{t('unavailableWilaya')}</span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeliverySelect('stopDeskEcommerce')}
                    disabled={selectedWilaya?.stopDeskEcommerce === null}
                    className={cn(
                      "flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all cursor-pointer w-full",
                      formData.deliveryType === 'stopDeskEcommerce' 
                        ? "border-black bg-black text-white" 
                        : "border-gray-100 bg-gray-50 hover:border-gray-200 text-gray-900",
                      selectedWilaya?.stopDeskEcommerce === null && "opacity-45 cursor-not-allowed"
                    )}
                  >
                    <span className="text-xs font-bold leading-tight mb-1">{t('stopDesk')}</span>
                    {selectedWilaya?.stopDeskEcommerce !== null ? (
                      <span className={cn("text-[10px] font-mono font-bold", formData.deliveryType === 'stopDeskEcommerce' ? "text-red-400" : "text-gray-500")}>
                        {selectedWilaya?.stopDeskEcommerce} DA
                      </span>
                    ) : (
                      <span className="text-[9px] text-red-500 font-bold">{t('unavailableWilaya')}</span>
                    )}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-[11px] font-bold uppercase tracking-tight border border-red-100 italic">
                {error}
              </div>
            )}
          </div>

          <div className="space-y-3 pt-4 border-t border-gray-100 mt-auto">
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-gray-400 font-bold uppercase tracking-widest">{t('priceProductLabel')}</span>
                <span className="font-bold font-mono text-gray-900">{product.price} DA</span>
              </div>
              
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-gray-400 font-bold uppercase tracking-widest">{t('deliveryFee')}</span>
                <span className={cn("font-bold text-gray-900", !formData.deliveryType && "text-red-500 italic text-[10px]")}>
                  {formData.deliveryType ? `${deliveryFee} DA` : t('selectDeliveryPrompt')}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-baseline pt-3 border-t border-gray-100">
              <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">{t('total')}</span>
              <div className="flex flex-col items-end">
                <span className="text-2xl font-black text-red-600 font-mono tracking-tighter italic">
                  {formData.deliveryType ? `${product.price + deliveryFee} DA` : '—'}
                </span>
                <span className="text-[9px] text-gray-400 font-medium">{t('priceFinalWithDelivery')}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 hover:bg-red-600 active:scale-[0.97] text-white font-black py-3.5 rounded-xl shadow-xl shadow-red-500/20 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:active:scale-100 uppercase tracking-tight text-base cursor-pointer"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>{t('confirmOrder')}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
