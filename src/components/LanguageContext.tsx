import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'ar' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  ar: {
    productName: "Wireless Charging RGB Mousepad",
    heroHook: "ماوس باد RGB كبير مع شاحن لاسلكي 10W",
    price: "3900 دج",
    cta: "اطلب الآن",
    features: "المميزات",
    feature1: "شحن لاسلكي 10W",
    feature2: "إضاءة RGB على الحواف",
    feature3: "حجم كبير 800×300×4mm",
    feature4: "سطح مطاطي ثابت ومريح",
    feature5: "مناسب للـ Gaming والمكتب",
    orderFormTitle: "معلومات الطلب",
    fullName: "الاسم الكامل",
    phone: "رقم الهاتف",
    wilaya: "الولاية",
    commune: "البلدية",
    deliveryType: "نوع التوصيل",
    stopDesk: "استلام من المكتب",
    domicile: "التوصيل إلى المنزل",
    orderSummary: "ملخص الطلب",
    productPrice: "سعر المنتج",
    deliveryFee: "سعر التوصيل",
    total: "الإجمالي",
    confirmOrder: "تأكيد الطلب",
    successMessage: "تم تسجيل طلبك بنجاح! سنتصل بك قريباً.",
    errorFillFields: "يرجى ملء جميع الحقول المطلوبة",
    errorWilaya: "يرجى اختيار الولاية",
    errorCommune: "يرجى كتابة البلدية",
    errorDelivery: "يرجى اختيار نوع التوصيل",
    errorNotAvailable: "طريقة التوصيل غير متوفرة لهذه الولاية",
    unavailableWilaya: "غير متوفر لهذه الولاية",
    placeHolderFullName: "أدخل اسمك الكامل",
    placeHolderPhone: "أدخل رقم هاتفك",
    placeHolderCommune: "أدخل اسم البلدية",
    selectWilaya: "اختر الولاية",
    orderNow: "اطلب الآن"
  },
  fr: {
    productName: "Wireless Charging RGB Mousepad",
    heroHook: "Mousepad RGB grand format avec chargeur sans fil 10W",
    price: "3900 DA",
    cta: "Commander maintenant",
    features: "Caractéristiques",
    feature1: "Charge sans fil 10W",
    feature2: "Éclairage RGB sur les bords",
    feature3: "Grand format 800×300×4mm",
    feature4: "Surface en caoutchouc antidérapante",
    feature5: "Idéal pour gaming et bureau",
    orderFormTitle: "Informations de commande",
    fullName: "Nom complet",
    phone: "Numéro de téléphone",
    wilaya: "Wilaya",
    commune: "Commune",
    deliveryType: "Type de livraison",
    stopDesk: "Livraison au bureau",
    domicile: "Livraison à domicile",
    orderSummary: "Résumé de la commande",
    productPrice: "Prix du produit",
    deliveryFee: "Prix de livraison",
    total: "Total",
    confirmOrder: "Confirmer la commande",
    successMessage: "Votre commande a été enregistrée avec succès ! Nous vous contacterons bientôt.",
    errorFillFields: "Veuillez remplir tous les champs obligatoires",
    errorWilaya: "Veuillez choisir la wilaya",
    errorCommune: "Veuillez écrire la commune",
    errorDelivery: "Veuillez choisir le type de livraison",
    errorNotAvailable: "Cette méthode de livraison n’est pas disponible pour cette wilaya",
    unavailableWilaya: "Non disponible pour cette wilaya",
    placeHolderFullName: "Entrez votre nom complet",
    placeHolderPhone: "Entrez votre numéro de téléphone",
    placeHolderCommune: "Entrez le nom de la commune",
    selectWilaya: "Choisir la wilaya",
    orderNow: "Commander maintenant"
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ar');

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
