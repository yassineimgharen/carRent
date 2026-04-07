import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'fr' | 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  fr: {
    // Navbar
    'nav.home': 'Accueil',
    'nav.cars': 'Voitures',
    'nav.about': 'À propos',
    'nav.contact': 'Contact',
    'nav.admin': 'Admin',
    'nav.profile': 'Profil',
    'nav.logout': 'Déconnexion',
    'nav.login': 'Connexion',
    
    // Hero
    'hero.badge': 'Location de voitures premium',
    'hero.title': 'Conduisez votre',
    'hero.titleHighlight': 'Voiture de rêve',
    'hero.subtitle': 'Choisissez parmi notre collection de véhicules premium. Des berlines de luxe aux voitures de sport haute performance.',
    'hero.cta': 'Parcourir les voitures',
    
    // Home
    'home.featured': 'En vedette',
    'home.popularCars': 'Voitures populaires',
    'home.viewAll': 'Voir tout',
    'home.noCars': 'Aucune voiture pour le moment. Ajoutez-en depuis le tableau de bord Admin.',
    'home.footer': '© 2026 DriveX. Tous droits réservés.',
    
    // Cars
    'cars.title': 'Voitures disponibles',
    'cars.perDay': '/jour',
    'cars.day': 'jour',
    'cars.viewDetails': 'Voir les détails',
    'cars.bookNow': 'Réserver maintenant',
    'cars.features': 'Caractéristiques',
    'cars.specifications': 'Spécifications',
    'cars.available': 'Disponible',
    'cars.unavailable': 'Indisponible',
    'cars.seats': 'places',
    
    // Booking
    'booking.title': 'Réserver cette voiture',
    'booking.startDate': 'Date de début',
    'booking.endDate': 'Date de fin',
    'booking.totalPrice': 'Prix total',
    'booking.days': 'jours',
    'booking.confirm': 'Confirmer la réservation',
    'booking.success': 'Réservation confirmée avec succès!',
    'booking.error': 'Erreur lors de la réservation',
    'booking.loginRequired': 'Veuillez vous connecter pour réserver',
    
    // Profile
    'profile.title': 'Mon profil',
    'profile.edit': 'Modifier',
    'profile.save': 'Enregistrer',
    'profile.cancel': 'Annuler',
    'profile.firstName': 'Prénom',
    'profile.lastName': 'Nom',
    'profile.email': 'Email',
    'profile.phone': 'Téléphone',
    'profile.city': 'Ville',
    'profile.myBookings': 'Mes réservations',
    'profile.noBookings': 'Aucune réservation',
    
    // Auth
    'auth.account': 'Compte',
    'auth.login': 'Connexion',
    'auth.signup': 'Inscription',
    'auth.password': 'Mot de passe',
    'auth.confirmPassword': 'Confirmer le mot de passe',
    'auth.register': "S'inscrire",
    'auth.createAccount': 'Créer un compte',
    'auth.firstName': 'Prénom',
    'auth.lastName': 'Nom',
    'auth.phone': 'Téléphone',
    'auth.city': 'Ville',
    'auth.passwordMin': 'Min. 8 caractères',
    'auth.phonePlaceholder': '+212 6XX XXX XXX',
    
    // Admin
    'admin.title': 'Tableau de bord Admin',
    'admin.cars': 'Gestion des voitures',
    'admin.bookings': 'Gestion des réservations',
    'admin.addCar': 'Ajouter une voiture',
    'admin.edit': 'Modifier',
    'admin.delete': 'Supprimer',
    'admin.brand': 'Marque',
    'admin.name': 'Nom',
    'admin.price': 'Prix',
    'admin.actions': 'Actions',
    
    // Contact
    'contact.title': 'Contactez-nous',
    'contact.address': 'Adresse',
    'contact.addressLine1': '132 Rue Ahmed Zakaria',
    'contact.addressLine2': 'Bloc Abtih Extension Dakhla, Agadir',
    'contact.email': 'Email',
    'contact.hours': 'Heures d\'ouverture',
    'contact.location': 'Notre emplacement',
    'contact.getDirections': 'Obtenir l\'itinéraire',
    'contact.findUs': 'Trouvez-nous',
    'contact.visitText': 'Visitez-nous à notre bureau de location de voitures. Nous sommes là pour vous aider à trouver le véhicule parfait.',
    
    // WhatsApp
    'whatsapp.contact': 'Contacter via WhatsApp',
    'whatsapp.hello': 'Bonjour, je suis intéressé par',
    
    // Common
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.success': 'Succès',
  },
  ar: {
    // Navbar
    'nav.home': 'الرئيسية',
    'nav.cars': 'السيارات',
    'nav.about': 'من نحن',
    'nav.contact': 'اتصل بنا',
    'nav.admin': 'الإدارة',
    'nav.profile': 'الملف الشخصي',
    'nav.logout': 'تسجيل الخروج',
    'nav.login': 'تسجيل الدخول',
    
    // Hero
    'hero.badge': 'تأجير سيارات فاخرة',
    'hero.title': 'قد سيارة',
    'hero.titleHighlight': 'أحلامك',
    'hero.subtitle': 'اختر من مجموعتنا من المركبات المميزة. من السيارات الفاخرة إلى السيارات الرياضية عالية الأداء.',
    'hero.cta': 'تصفح السيارات',
    
    // Home
    'home.featured': 'مميز',
    'home.popularCars': 'السيارات الشائعة',
    'home.viewAll': 'عرض الكل',
    'home.noCars': 'لا توجد سيارات حتى الآن. أضف بعضها من لوحة التحكم.',
    'home.footer': '© 2026 DriveX. جميع الحقوق محفوظة.',
    
    // Cars
    'cars.title': 'السيارات المتاحة',
    'cars.perDay': '/يوم',
    'cars.day': 'يوم',
    'cars.viewDetails': 'عرض التفاصيل',
    'cars.bookNow': 'احجز الآن',
    'cars.features': 'المميزات',
    'cars.specifications': 'المواصفات',
    'cars.available': 'متاح',
    'cars.unavailable': 'غير متاح',
    'cars.seats': 'مقاعد',
    
    // Booking
    'booking.title': 'احجز هذه السيارة',
    'booking.startDate': 'تاريخ البداية',
    'booking.endDate': 'تاريخ النهاية',
    'booking.totalPrice': 'السعر الإجمالي',
    'booking.days': 'أيام',
    'booking.confirm': 'تأكيد الحجز',
    'booking.success': 'تم تأكيد الحجز بنجاح!',
    'booking.error': 'خطأ في الحجز',
    'booking.loginRequired': 'يرجى تسجيل الدخول للحجز',
    
    // Profile
    'profile.title': 'ملفي الشخصي',
    'profile.edit': 'تعديل',
    'profile.save': 'حفظ',
    'profile.cancel': 'إلغاء',
    'profile.firstName': 'الاسم الأول',
    'profile.lastName': 'اسم العائلة',
    'profile.email': 'البريد الإلكتروني',
    'profile.phone': 'الهاتف',
    'profile.city': 'المدينة',
    'profile.myBookings': 'حجوزاتي',
    'profile.noBookings': 'لا توجد حجوزات',
    
    // Auth
    'auth.account': 'الحساب',
    'auth.login': 'تسجيل الدخول',
    'auth.signup': 'إنشاء حساب',
    'auth.password': 'كلمة المرور',
    'auth.confirmPassword': 'تأكيد كلمة المرور',
    'auth.register': 'تسجيل',
    'auth.createAccount': 'إنشاء حساب',
    'auth.firstName': 'الاسم الأول',
    'auth.lastName': 'اسم العائلة',
    'auth.phone': 'الهاتف',
    'auth.city': 'المدينة',
    'auth.passwordMin': 'الحد الأدنى 8 أحرف',
    'auth.phonePlaceholder': '+212 6XX XXX XXX',
    
    // Admin
    'admin.title': 'لوحة التحكم',
    'admin.cars': 'إدارة السيارات',
    'admin.bookings': 'إدارة الحجوزات',
    'admin.addCar': 'إضافة سيارة',
    'admin.edit': 'تعديل',
    'admin.delete': 'حذف',
    'admin.brand': 'العلامة التجارية',
    'admin.name': 'الاسم',
    'admin.price': 'السعر',
    'admin.actions': 'الإجراءات',
    
    // Contact
    'contact.title': 'اتصل بنا',
    'contact.address': 'العنوان',
    'contact.addressLine1': 'شارع احمد زكرياء رقم 132',
    'contact.addressLine2': 'بلوك ابطيح تمديد الداخلة، أكادير',
    'contact.email': 'البريد الإلكتروني',
    'contact.hours': 'ساعات العمل',
    'contact.location': 'موقعنا',
    'contact.getDirections': 'الحصول على الاتجاهات',
    'contact.findUs': 'اعثر علينا',
    'contact.visitText': 'قم بزيارتنا في مكتب تأجير السيارات. نحن هنا لمساعدتك في العثور على السيارة المثالية.',
    
    // WhatsApp
    'whatsapp.contact': 'تواصل عبر واتساب',
    'whatsapp.hello': 'مرحبا، أنا مهتم بـ',
    
    // Common
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.success': 'نجاح',
  },
  en: {
    // Navbar
    'nav.home': 'Home',
    'nav.cars': 'Cars',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.admin': 'Admin',
    'nav.profile': 'Profile',
    'nav.logout': 'Logout',
    'nav.login': 'Login',
    
    // Hero
    'hero.badge': 'Premium Car Rental',
    'hero.title': 'Drive Your',
    'hero.titleHighlight': 'Dream Car',
    'hero.subtitle': 'Choose from our curated collection of premium vehicles. From luxury sedans to high-performance sports cars.',
    'hero.cta': 'Browse Cars',
    
    // Home
    'home.featured': 'Featured',
    'home.popularCars': 'Popular Cars',
    'home.viewAll': 'View all',
    'home.noCars': 'No cars yet. Add some from the Admin dashboard.',
    'home.footer': '© 2026 DriveX. All rights reserved.',
    
    // Cars
    'cars.title': 'Available Cars',
    'cars.perDay': '/day',
    'cars.day': 'day',
    'cars.viewDetails': 'View Details',
    'cars.bookNow': 'Book Now',
    'cars.features': 'Features',
    'cars.specifications': 'Specifications',
    'cars.available': 'Available',
    'cars.unavailable': 'Unavailable',
    'cars.seats': 'seats',
    
    // Booking
    'booking.title': 'Book This Car',
    'booking.startDate': 'Start Date',
    'booking.endDate': 'End Date',
    'booking.totalPrice': 'Total Price',
    'booking.days': 'days',
    'booking.confirm': 'Confirm Booking',
    'booking.success': 'Booking confirmed successfully!',
    'booking.error': 'Booking error',
    'booking.loginRequired': 'Please login to book',
    
    // Profile
    'profile.title': 'My Profile',
    'profile.edit': 'Edit',
    'profile.save': 'Save',
    'profile.cancel': 'Cancel',
    'profile.firstName': 'First Name',
    'profile.lastName': 'Last Name',
    'profile.email': 'Email',
    'profile.phone': 'Phone',
    'profile.city': 'City',
    'profile.myBookings': 'My Bookings',
    'profile.noBookings': 'No bookings',
    
    // Auth
    'auth.account': 'Account',
    'auth.login': 'Login',
    'auth.signup': 'Sign Up',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.register': 'Register',
    'auth.createAccount': 'Create account',
    'auth.firstName': 'First name',
    'auth.lastName': 'Last name',
    'auth.phone': 'Phone',
    'auth.city': 'City',
    'auth.passwordMin': 'Min. 8 characters',
    'auth.phonePlaceholder': '+1 234 567 8900',
    
    // Admin
    'admin.title': 'Admin Dashboard',
    'admin.cars': 'Car Management',
    'admin.bookings': 'Booking Management',
    'admin.addCar': 'Add Car',
    'admin.edit': 'Edit',
    'admin.delete': 'Delete',
    'admin.brand': 'Brand',
    'admin.name': 'Name',
    'admin.price': 'Price',
    'admin.actions': 'Actions',
    
    // Contact
    'contact.title': 'Contact Us',
    'contact.address': 'Address',
    'contact.addressLine1': '132 Ahmed Zakaria Street',
    'contact.addressLine2': 'Abtih Block Dakhla Extension, Agadir',
    'contact.email': 'Email',
    'contact.hours': 'Opening Hours',
    'contact.location': 'Our Location',
    'contact.getDirections': 'Get Directions',
    'contact.findUs': 'Find Us',
    'contact.visitText': 'Visit us at our car rental office. We\'re here to help you find the perfect vehicle.',
    
    // WhatsApp
    'whatsapp.contact': 'Contact via WhatsApp',
    'whatsapp.hello': 'Hello, I\'m interested in',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'fr';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
