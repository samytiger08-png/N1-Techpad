export interface Product {
  slug: string;
  name: {
    fr: string;
    ar: string;
  };
  price: number;
  description: {
    fr: string;
    ar: string;
  };
  features: {
    fr: string[];
    ar: string[];
  };
  mainImage: string;
  secondaryImage: string;
  gallery: string[];
  hasColorChoice?: boolean;
}

export const products: Product[] = [
  {
    slug: 'yilima-g502x-gaming-keyboard',
    name: {
      fr: "Yilima G502X Gaming Keyboard",
      ar: "Yilima G502X Gaming Keyboard"
    },
    price: 5900,
    description: {
      fr: "Clavier gaming Yilima G502X avec blue switch, RGB contrôlable, disponible en noir et blanc.",
      ar: "لوحة مفاتيح الألعاب Yilima G502X بـ blue switch، إضاءة RGB قابلة للتحكم، متوفرة باللونين الأسود والأبيض."
    },
    features: {
      fr: [
        "Blue switch mécaniques",
        "Éclairage RGB contrôlable",
        "Disponible en blanc et noir",
        "Design gaming ergonomique"
      ],
      ar: [
        "مفاتيح ميكانيكية زرقاء",
        "إضاءة RGB قابلة للتحكم",
        "متوفر باللونين الأبيض والأسود",
        "تصميم ألعاب مريح ومقاوم"
      ]
    },
    mainImage: "https://i.ibb.co/5X17y6ZH/IMG-0837.jpg",
    secondaryImage: "https://i.ibb.co/KcfmBNqt/IMG-0839.jpg",
    gallery: [
      "https://i.ibb.co/dwjTZNrd/IMG-0835.jpg",
      "https://i.ibb.co/RkGQSpjv/IMG-0836.jpg",
      "https://i.ibb.co/8grHLjZC/IMG-0840.jpg"
    ],
    hasColorChoice: true
  },
  {
    slug: 'wireless-charging-rgb-mousepad',
    name: {
      fr: "Wireless Charging RGB Mousepad",
      ar: "Wireless Charging RGB Mousepad"
    },
    price: 7900,
    description: {
      fr: "Grand tapis de souris gaming RGB avec recharge sans fil 10W et éclairage RGB contrôlable.",
      ar: "ماوس باد ألعاب RGB كبير مع شاحن لاسلكي بقوة 10 واط وإضاءة RGB قابلة للتحكم."
    },
    features: {
      fr: [
        "Charge sans fil 10W",
        "Eclairage RGB controlable",
        "Grand format 800×300×4mm",
        "Surface en caoutchouc antidérapante",
        "Idéal pour gaming et bureau"
      ],
      ar: [
        "شحن لاسلكي 10W",
        "إضاءة RGB على الحواف (قابلة للتحكم)",
        "حجم كبير 800×300×4mm",
        "سطح مطاطي ثابت ومريح",
        "مناسب للـ Gaming والمكتب"
      ]
    },
    mainImage: "https://i.ibb.co/RpJkvbPS/IMG-8345.jpg",
    secondaryImage: "https://i.ibb.co/VYK4Cbqx/IMG-8346.jpg",
    gallery: [
      "https://i.ibb.co/B25SXrMd/IMG-8347.jpg"
    ]
  },
  {
    slug: 'mb-lightweight-gaming-mouse',
    name: {
      fr: "MB Lightweight Gaming Mouse",
      ar: "MB Lightweight Gaming Mouse"
    },
    price: 2900,
    description: {
      fr: "Souris gaming légère RGB, fonctionne avec le récepteur USB inclus, sans câble.",
      ar: "فأرة ألعاب لاسلكية خفيفة الوزن مع إضاءة RGB، تعمل بمستقبل USB المرفق دون كابل."
    },
    features: {
      fr: [
        "Conception ultra légère",
        "Éclairage RGB dynamique",
        "Récepteur USB haute vitesse inclus",
        "Fonctionnement sans fil durable",
        "Design gaming profilé"
      ],
      ar: [
        "وزن خفيف للغاية",
        "إضاءة RGB ديناميكية",
        "مستقبل USB فائق السرعة مرفق",
        "تشغيل لاسلكي يدوم طويلاً",
        "تصميم ألعاب انسيابي ومريح"
      ]
    },
    mainImage: "https://i.ibb.co/fzF1CpsJ/IMG-0834.jpg",
    secondaryImage: "",
    gallery: []
  },
  {
    slug: 'stylus-pen',
    name: {
      fr: "Stylus Pen",
      ar: "Stylus Pen"
    },
    price: 900,
    description: {
      fr: "Stylet tactile compatible avec les écrans tactiles: Apple, Android et ordinateurs portables tactiles.",
      ar: "قلم لمس متوافق مع جميع شاشات اللمس: أبل، أندرويد، وأجهزة الكمبيوتر المحمولة التي تعمل باللمس."
    },
    features: {
      fr: [
        "Fonctionne sur tout écran tactile",
        "Compatible Apple",
        "Compatible Android",
        "Compatible laptop tactile",
        "Léger et pratique"
      ],
      ar: [
        "يعمل على جميع شاشات اللمس",
        "متوافق مع أجهزة أبل",
        "متوافق مع أجهزة أندرويد",
        "متوافق مع الحواسيب المحمولة باللمس",
        "خفيف الوزن وعملي"
      ]
    },
    mainImage: "",
    secondaryImage: "",
    gallery: []
  }
];
