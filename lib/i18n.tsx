"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * Lightweight i18n: a translations dictionary + React context.
 * - English fallback when a key is missing in the active language.
 * - Arabic & Urdu flip layout direction to RTL.
 * - Choice persisted to localStorage (allowed: this is a real Next.js app).
 */

export type Lang = "en" | "es" | "fr" | "ar" | "ur";

export const LANGUAGES: { code: Lang; label: string; native: string; dir: "ltr" | "rtl" }[] = [
  { code: "en", label: "English", native: "English", dir: "ltr" },
  { code: "es", label: "Spanish", native: "Español", dir: "ltr" },
  { code: "fr", label: "French", native: "Français", dir: "ltr" },
  { code: "ar", label: "Arabic", native: "العربية", dir: "rtl" },
  { code: "ur", label: "Urdu", native: "اردو", dir: "rtl" },
];

type Dict = Record<string, string>;

const en: Dict = {
  "nav.flights": "Flights",
  "nav.hotels": "Hotels",
  "nav.cars": "Car Rental",
  "nav.deals": "Deals",
  "nav.dubaiVisa": "Dubai Visa",
  "nav.parentsTickets": "Parents Travel Assist",
  "cta.getQuote": "Get Quote",
  "cta.login": "Login",
  "cta.searchDeals": "Search Flights",
  "hero.title": "Trusted airline tickets",
  "hero.accent": "at the best fares",
  "hero.subline":
    "We find you the lowest available fares on the world's leading airlines from the UK and connect you straight to the best deal — trusted carriers, no hidden fees.",
  "hero.helper": "Best available fares · Trusted airlines only · No hidden booking fees",
  "tab.flights": "Flights",
  "tab.hotels": "Hotels",
  "tab.cars": "Car Rental",
  "cat.eyebrow": "Browse & book",
  "cat.title": "Everything you need for the perfect trip",
  "cat.lead":
    "Flights are our focus — and we round out the journey too. Pick a category and let Wicket find you trusted options at the best fares.",
  "fs.return": "Return",
  "fs.oneway": "One way",
  "fs.from": "From",
  "fs.to": "To",
  "fs.swap": "Swap origin and destination",
  "fs.depart": "Depart",
  "fs.returnDate": "Return",
  "fs.travelers": "Travelers",
  "fs.cabin": "Cabin class",
  "fs.airline": "Airline",
  "fs.stops": "Stops",
  "fs.stopsAny": "Any stops",
  "fs.stopsDirect": "Direct only",
  "fs.search": "Search",
  "fs.baggage": "Checked baggage included",
  "fs.searchPh": "City or airport",
  "fs.airportHint": "e.g. London or LHR",
  "fs.addDate": "Add date",
  "fs.pickDay": "dd/mm/yyyy",
  "fs.moreOptions": "More options",
  "fs.childAges": "Children's ages",
  "fs.age": "Age",
  "fs.noResults": "No airports match — try a city or 3-letter code",
  "fs.routeNudge": "Enter your route to continue",
  "fs.hotelRedirect": "Hotels are handled on our holidays site — opening in a new tab.",
  "airline.any": "Any airline",
  "trust.eyebrow": "Trusted airline partners",
  "trust.line": "Tickets from the world's most trusted airlines.",
  "cat.packages": "Packages",
  "dest.eyebrow": "Popular right now",
  "dest.title": "Trending destinations travelers love",
  "hotels.eyebrow": "Stays worth the trip",
  "hotels.title": "Handpicked hotels & resorts",
  "hotels.lead":
    "From our exclusive resort collection on Wicket Travel Holidays — tap any stay to explore rates and availability on our holidays site.",
  "hotels.cta": "Explore all hotels & resorts",
  "how.eyebrow": "How it works",
  "how.title": "Find the best price in three steps",
  "guar.eyebrow": "Trust & security",
  "guar.title": "Book with total confidence",
  "guar.badge": "Best-Price Guarantee",
  "news.title": "Never miss a price drop",
  "news.lead":
    "Join 800,000+ smart travelers and get the best available airfares from trusted airlines delivered to your inbox. No spam — just great fares.",
  "news.placeholder": "you@example.com",
  "news.button": "Get deal alerts",
  "wa.tooltip": "Chat with us on WhatsApp",
  "backToTop.label": "Back to top",
  "fares.eyebrow": "Featured airlines",
  "fares.title": "Fly with the world's most trusted airlines",
  "fares.lead":
    "Hand-picked airlines flying the routes travelers love most — book real tickets at the best available fares, with no hidden booking fees.",
  "fares.cta": "Search fares",
  "city.eyebrow": "Today's best fares",
  "city.title": "Best flight fares by region",
  "city.lead":
    "Pick a region to see the destinations travelers are booking right now — always at the best available fares from trusted airlines.",
  "city.from": "From",
  "city.soft": "Starting from low fares",
  "city.cta": "Search flights",
  "call.eyebrow": "Talk to a real person",
  "call.title": "Prefer to book by phone? We're here 24/7",
  "call.lead":
    "Our travel specialists can find you the best available fares and tailor your trip — call us any time, day or night.",
  "call.cta": "Call now",
  "call.note": "24/7 support · Trusted airlines · No hidden fees",
};

const es: Dict = {
  "nav.flights": "Vuelos",
  "nav.hotels": "Hoteles",
  "nav.cars": "Alquiler de coches",
  "nav.deals": "Ofertas",
  "nav.dubaiVisa": "Visado de Dubái",
  "nav.parentsTickets": "Asistencia de viaje para padres",
  "cta.getQuote": "Obtener cotización",
  "cta.login": "Iniciar sesión",
  "cta.searchDeals": "Buscar vuelos",
  "hero.title": "Billetes de avión de confianza",
  "hero.accent": "a las mejores tarifas",
  "hero.subline":
    "Encontramos las tarifas más bajas disponibles en las principales aerolíneas del mundo y te conectamos directamente con la mejor oferta. Aerolíneas de confianza, sin comisiones ocultas.",
  "hero.helper": "Mejores tarifas disponibles · Solo aerolíneas de confianza · Sin comisiones ocultas",
  "tab.flights": "Vuelos",
  "tab.hotels": "Hoteles",
  "tab.cars": "Coches",
  "cat.eyebrow": "Explora y reserva",
  "cat.title": "Todo lo que necesitas para el viaje perfecto",
  "cat.lead":
    "Los vuelos son nuestra prioridad, y completamos el resto del viaje. Elige una categoría y deja que Wicket te encuentre opciones de confianza a las mejores tarifas.",
  "fs.return": "Ida y vuelta",
  "fs.oneway": "Solo ida",
  "fs.from": "Desde",
  "fs.to": "Hasta",
  "fs.swap": "Intercambiar origen y destino",
  "fs.depart": "Salida",
  "fs.returnDate": "Regreso",
  "fs.travelers": "Viajeros",
  "fs.cabin": "Clase",
  "fs.airline": "Aerolínea",
  "fs.stops": "Escalas",
  "fs.stopsAny": "Cualquier escala",
  "fs.stopsDirect": "Solo directos",
  "fs.search": "Buscar",
  "fs.baggage": "Equipaje facturado incluido",
  "fs.searchPh": "Ciudad o aeropuerto",
  "fs.airportHint": "p. ej. Madrid o MAD",
  "fs.addDate": "Añadir fecha",
  "fs.pickDay": "dd/mm/aaaa",
  "fs.moreOptions": "Más opciones",
  "fs.childAges": "Edad de los niños",
  "fs.age": "Edad",
  "fs.noResults": "No hay aeropuertos — prueba una ciudad o un código de 3 letras",
  "fs.routeNudge": "Introduce tu ruta para continuar",
  "fs.hotelRedirect": "Los hoteles se gestionan en nuestro sitio de vacaciones — abriendo en una nueva pestaña.",
  "airline.any": "Cualquier aerolínea",
  "trust.eyebrow": "Aerolíneas de confianza",
  "trust.line": "Billetes de las aerolíneas más fiables del mundo.",
  "cat.packages": "Paquetes",
  "dest.eyebrow": "Populares ahora",
  "dest.title": "Destinos de moda que aman los viajeros",
  "how.eyebrow": "Cómo funciona",
  "how.title": "Encuentra el mejor precio en tres pasos",
  "guar.eyebrow": "Confianza y seguridad",
  "guar.title": "Reserva con total confianza",
  "guar.badge": "Garantía del mejor precio",
  "news.title": "No te pierdas ninguna bajada de precio",
  "news.lead":
    "Únete a más de 800.000 viajeros inteligentes y recibe las ofertas más baratas de vuelos, hoteles y coches en tu correo. Sin spam, solo ahorro.",
  "news.placeholder": "tu@ejemplo.com",
  "news.button": "Recibir alertas",
  "wa.tooltip": "Chatea con nosotros por WhatsApp",
  "backToTop.label": "Volver arriba",
};

const fr: Dict = {
  "nav.flights": "Vols",
  "nav.hotels": "Hôtels",
  "nav.cars": "Location de voiture",
  "nav.deals": "Offres",
  "nav.dubaiVisa": "Visa Dubaï",
  "nav.parentsTickets": "Assistance voyage parents",
  "cta.getQuote": "Obtenir un devis",
  "cta.login": "Connexion",
  "cta.searchDeals": "Rechercher des vols",
  "hero.title": "Billets d'avion de confiance",
  "hero.accent": "aux meilleurs tarifs",
  "hero.subline":
    "Nous vous trouvons les tarifs les plus bas disponibles sur les plus grandes compagnies aériennes du monde et vous mettons directement en relation avec la meilleure offre. Des compagnies de confiance, sans frais cachés.",
  "hero.helper": "Meilleurs tarifs disponibles · Compagnies de confiance uniquement · Sans frais cachés",
  "tab.flights": "Vols",
  "tab.hotels": "Hôtels",
  "tab.cars": "Voitures",
  "cat.eyebrow": "Explorer et réserver",
  "cat.title": "Tout ce qu'il faut pour le voyage parfait",
  "cat.lead":
    "Les vols sont notre priorité, et nous complétons tout le voyage. Choisissez une catégorie et laissez Wicket vous trouver des options de confiance aux meilleurs tarifs.",
  "fs.return": "Aller-retour",
  "fs.oneway": "Aller simple",
  "fs.from": "De",
  "fs.to": "À",
  "fs.swap": "Inverser le départ et la destination",
  "fs.depart": "Départ",
  "fs.returnDate": "Retour",
  "fs.travelers": "Voyageurs",
  "fs.cabin": "Classe",
  "fs.airline": "Compagnie",
  "fs.stops": "Escales",
  "fs.stopsAny": "Toutes escales",
  "fs.stopsDirect": "Directs uniquement",
  "fs.search": "Rechercher",
  "fs.baggage": "Bagage en soute inclus",
  "fs.searchPh": "Ville ou aéroport",
  "fs.airportHint": "p. ex. Paris ou CDG",
  "fs.addDate": "Ajouter une date",
  "fs.pickDay": "jj/mm/aaaa",
  "fs.moreOptions": "Plus d'options",
  "fs.childAges": "Âge des enfants",
  "fs.age": "Âge",
  "fs.noResults": "Aucun aéroport — essayez une ville ou un code à 3 lettres",
  "fs.hotelRedirect": "Les hôtels sont gérés sur notre site de séjours — ouverture dans un nouvel onglet.",
  "airline.any": "Toutes les compagnies",
  "trust.eyebrow": "Compagnies de confiance",
  "trust.line": "Des billets sur les compagnies aériennes les plus fiables du monde.",
  "cat.packages": "Forfaits",
  "dest.eyebrow": "Populaire en ce moment",
  "dest.title": "Destinations tendance que les voyageurs adorent",
  "how.eyebrow": "Comment ça marche",
  "how.title": "Trouvez le meilleur prix en trois étapes",
  "guar.eyebrow": "Confiance et sécurité",
  "guar.title": "Réservez en toute confiance",
  "guar.badge": "Garantie du meilleur prix",
  "news.title": "Ne manquez aucune baisse de prix",
  "news.lead":
    "Rejoignez plus de 800 000 voyageurs avisés et recevez les meilleures offres de vols, hôtels et voitures dans votre boîte mail. Pas de spam, que des économies.",
  "news.placeholder": "vous@exemple.com",
  "news.button": "Recevoir les alertes",
  "wa.tooltip": "Discutez avec nous sur WhatsApp",
  "backToTop.label": "Retour en haut",
};

const ar: Dict = {
  "nav.flights": "رحلات الطيران",
  "nav.hotels": "الفنادق",
  "nav.cars": "تأجير السيارات",
  "nav.deals": "العروض",
  "nav.dubaiVisa": "تأشيرة دبي",
  "nav.parentsTickets": "مساعدة سفر الوالدين",
  "cta.getQuote": "اطلب عرض سعر",
  "cta.login": "تسجيل الدخول",
  "cta.searchDeals": "ابحث عن رحلات",
  "hero.title": "تذاكر طيران موثوقة",
  "hero.accent": "بأفضل الأسعار",
  "hero.subline":
    "نجد لك أقل الأسعار المتاحة على أكبر شركات الطيران في العالم ونوصلك مباشرةً بأفضل عرض. شركات طيران موثوقة، بدون رسوم خفية.",
  "hero.helper": "أفضل الأسعار المتاحة · شركات طيران موثوقة فقط · بدون رسوم حجز خفية",
  "tab.flights": "رحلات الطيران",
  "tab.hotels": "الفنادق",
  "tab.cars": "السيارات",
  "cat.eyebrow": "تصفّح واحجز",
  "cat.title": "كل ما تحتاجه لرحلة مثالية",
  "cat.lead":
    "رحلات الطيران هي محور تركيزنا، ونكمل لك بقية الرحلة. اختر فئة ودع Wicket يجد لك خيارات موثوقة بأفضل الأسعار.",
  "fs.return": "ذهاب وعودة",
  "fs.oneway": "ذهاب فقط",
  "fs.from": "من",
  "fs.to": "إلى",
  "fs.swap": "تبديل المغادرة والوجهة",
  "fs.depart": "المغادرة",
  "fs.returnDate": "العودة",
  "fs.travelers": "المسافرون",
  "fs.cabin": "الدرجة",
  "fs.airline": "شركة الطيران",
  "fs.stops": "التوقفات",
  "fs.stopsAny": "أي عدد من التوقفات",
  "fs.stopsDirect": "مباشرة فقط",
  "fs.search": "بحث",
  "fs.baggage": "يشمل الأمتعة المسجلة",
  "fs.searchPh": "مدينة أو مطار",
  "fs.airportHint": "مثال: دبي أو DXB",
  "fs.addDate": "أضف تاريخًا",
  "fs.pickDay": "يوم/شهر/سنة",
  "fs.moreOptions": "خيارات إضافية",
  "fs.childAges": "أعمار الأطفال",
  "fs.age": "العمر",
  "fs.noResults": "لا توجد مطارات — جرّب اسم مدينة أو رمزًا من 3 أحرف",
  "fs.hotelRedirect": "تتم إدارة الفنادق على موقع العطلات لدينا — يُفتح في علامة تبويب جديدة.",
  "airline.any": "أي شركة طيران",
  "trust.eyebrow": "شركات طيران موثوقة",
  "trust.line": "تذاكر من أكثر شركات الطيران موثوقية في العالم.",
  "cat.packages": "الباقات",
  "dest.eyebrow": "الأكثر رواجًا الآن",
  "dest.title": "وجهات شهيرة يعشقها المسافرون",
  "how.eyebrow": "كيف يعمل",
  "how.title": "اعثر على أفضل سعر في ثلاث خطوات",
  "guar.eyebrow": "الثقة والأمان",
  "guar.title": "احجز بثقة تامة",
  "guar.badge": "ضمان أفضل سعر",
  "news.title": "لا تفوّت أي انخفاض في الأسعار",
  "news.lead":
    "انضم إلى أكثر من 800,000 مسافر ذكي واحصل على أرخص عروض الطيران والفنادق والسيارات في بريدك. بلا إزعاج، فقط توفير.",
  "news.placeholder": "you@example.com",
  "news.button": "تنبيهات العروض",
  "wa.tooltip": "تواصل معنا عبر واتساب",
  "backToTop.label": "العودة إلى الأعلى",
};

const ur: Dict = {
  "nav.flights": "پروازیں",
  "nav.hotels": "ہوٹل",
  "nav.cars": "کرایہ پر گاڑی",
  "nav.deals": "ڈیلز",
  "nav.dubaiVisa": "دبئی ویزا",
  "nav.parentsTickets": "والدین کی سفری معاونت",
  "cta.getQuote": "کوٹ حاصل کریں",
  "cta.login": "لاگ ان",
  "cta.searchDeals": "پروازیں تلاش کریں",
  "hero.title": "بھروسہ مند ایئر لائن ٹکٹ",
  "hero.accent": "بہترین کرایوں پر",
  "hero.subline":
    "ہم آپ کے لیے دنیا کی معروف ترین ایئر لائنز پر دستیاب کم ترین کرایے تلاش کرتے ہیں اور آپ کو سیدھا بہترین ڈیل سے جوڑتے ہیں۔ بھروسہ مند ایئر لائنز، کوئی چھپی فیس نہیں۔",
  "hero.helper": "بہترین دستیاب کرایے · صرف بھروسہ مند ایئر لائنز · کوئی چھپی بکنگ فیس نہیں",
  "tab.flights": "پروازیں",
  "tab.hotels": "ہوٹل",
  "tab.cars": "گاڑیاں",
  "cat.eyebrow": "دیکھیں اور بُک کریں",
  "cat.title": "بہترین سفر کے لیے ہر وہ چیز جو آپ کو چاہیے",
  "cat.lead":
    "پروازیں ہماری ترجیح ہیں، اور ہم پورے سفر کو مکمل کرتے ہیں۔ ایک زمرہ منتخب کریں اور Wicket کو بہترین کرایوں پر بھروسہ مند آپشنز تلاش کرنے دیں۔",
  "fs.return": "واپسی",
  "fs.oneway": "یک طرفہ",
  "fs.from": "کہاں سے",
  "fs.to": "کہاں تک",
  "fs.swap": "روانگی اور منزل تبدیل کریں",
  "fs.depart": "روانگی",
  "fs.returnDate": "واپسی",
  "fs.travelers": "مسافر",
  "fs.cabin": "کلاس",
  "fs.airline": "ایئر لائن",
  "fs.stops": "اسٹاپس",
  "fs.stopsAny": "کوئی بھی اسٹاپ",
  "fs.stopsDirect": "صرف براہِ راست",
  "fs.search": "تلاش کریں",
  "fs.baggage": "چیک شدہ سامان شامل",
  "fs.searchPh": "شہر یا ہوائی اڈہ",
  "fs.airportHint": "مثلاً لاہور یا LHE",
  "fs.addDate": "تاریخ شامل کریں",
  "fs.pickDay": "دن/مہینہ/سال",
  "fs.moreOptions": "مزید اختیارات",
  "fs.childAges": "بچوں کی عمریں",
  "fs.age": "عمر",
  "fs.noResults": "کوئی ہوائی اڈہ نہیں — شہر یا 3 حروف کا کوڈ آزمائیں",
  "fs.hotelRedirect": "ہوٹل ہماری ہالیڈیز سائٹ پر ہیں — نئی ٹیب میں کھل رہا ہے۔",
  "airline.any": "کوئی بھی ایئر لائن",
  "trust.eyebrow": "بھروسہ مند ایئر لائنز",
  "trust.line": "دنیا کی سب سے بھروسہ مند ایئر لائنز کے ٹکٹ۔",
  "cat.packages": "پیکجز",
  "dest.eyebrow": "اس وقت مقبول",
  "dest.title": "مشہور مقامات جو مسافروں کو پسند ہیں",
  "how.eyebrow": "یہ کیسے کام کرتا ہے",
  "how.title": "تین مراحل میں بہترین قیمت تلاش کریں",
  "guar.eyebrow": "اعتماد اور سلامتی",
  "guar.title": "مکمل اعتماد کے ساتھ بُک کریں",
  "guar.badge": "بہترین قیمت کی ضمانت",
  "news.title": "قیمت میں کمی کبھی نہ چھوڑیں",
  "news.lead":
    "800,000 سے زائد سمجھدار مسافروں میں شامل ہوں اور پروازوں، ہوٹلوں اور گاڑیوں کی سستی ترین ڈیلز اپنے ان باکس میں حاصل کریں۔ کوئی اسپام نہیں، صرف بچت۔",
  "news.placeholder": "you@example.com",
  "news.button": "ڈیل الرٹس حاصل کریں",
  "wa.tooltip": "واٹس ایپ پر ہم سے بات کریں",
  "backToTop.label": "اوپر واپس جائیں",
};

const TRANSLATIONS: Record<Lang, Dict> = { en, es, fr, ar, ur };

type I18nValue = {
  lang: Lang;
  dir: "ltr" | "rtl";
  setLang: (l: Lang) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  // No persistence: there is no language switcher on the site right now, so a
  // stored preference could only strand a visitor in a language they cannot
  // change. Reintroduce it alongside the switcher.
  const [lang, setLang] = useState<Lang>("en");

  const dir = LANGUAGES.find((l) => l.code === lang)?.dir ?? "ltr";

  // Reflect language + direction on <html>.
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  const t = useCallback(
    (key: string) => TRANSLATIONS[lang][key] ?? TRANSLATIONS.en[key] ?? key,
    [lang]
  );

  const value = useMemo<I18nValue>(() => ({ lang, dir, setLang, t }), [lang, dir, setLang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
