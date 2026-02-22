import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const { lang, setLang, isRTL, t: translationsRoot } = useLanguage();
  const location = useLocation();
  const t = translationsRoot.nav;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="container mx-auto px-6 py-4 flex items-center justify-between relative z-[100]">
      {/* Left side: Login and Contact */}
      <div className={`flex items-center gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Link
          to="/login"
          className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 px-6 py-2.5 rounded-[10px] hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-sm font-medium text-[#1e3a8a] dark:text-slate-100"
        >
          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>person</span>
          {lang === 'ar' ? 'تسجيل الدخول' : 'Login'}
        </Link>
        <div className={`hidden md:flex items-center gap-2 text-slate-600 dark:text-slate-400 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span className="text-sm font-medium" dir="ltr">012 - 3456 7890</span>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>call</span>
        </div>

        {/* Language & Menu Toggle for Mobile */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="text-sm font-bold text-[#1e3a8a] dark:text-slate-300 hover:text-[#991b1b] transition-colors"
          >
            {lang === 'en' ? 'عربي' : 'EN'}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-[#1e3a8a] dark:text-slate-300"
          >
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Middle side: Navigation Links */}
      <div className={`hidden lg:flex items-center gap-8 text-sm font-medium text-[#1e3a8a] dark:text-slate-300 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Link to="/" className={`transition-colors font-bold ${isActive('/') ? 'text-[#991b1b]' : 'hover:text-[#991b1b]'}`}>
          {t?.home ?? 'الرئيسية'}
        </Link>
        <Link to="/schools" className={`relative group cursor-pointer flex items-center gap-1 font-bold transition-colors ${isActive('/schools') ? 'text-[#991b1b]' : 'hover:text-[#991b1b]'}`}>
          <span>{t?.schools ?? 'مدارسنا'}</span>
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>expand_more</span>
        </Link>
        <div className="relative group cursor-pointer flex items-center gap-1 font-bold hover:text-[#991b1b] transition-colors">
          <span>{lang === 'ar' ? 'الخدمات' : 'Services'}</span>
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>expand_more</span>
        </div>
        <Link to="/about" className={`transition-colors font-bold ${isActive('/about') ? 'text-[#991b1b]' : 'hover:text-[#991b1b]'}`}>
          {t?.about ?? 'من نحن'}
        </Link>
        <Link to="/complaints" className={`transition-colors font-bold ${isActive('/complaints') ? 'text-[#991b1b]' : 'hover:text-[#991b1b]'}`}>
          {translationsRoot?.nav?.feedback ?? 'تواصل معنا'}
        </Link>
        <Link to="/news" className={`transition-colors font-bold ${isActive('/news') ? 'text-[#991b1b]' : 'hover:text-[#991b1b]'}`}>
          {t?.news ?? 'المدونة'}
        </Link>
      </div>

      {/* Right side: Logo */}
      <Link to="/" className="flex items-center shrink-0">
        <img src="/Layer 1.png" alt="National Institutes" className="h-16 md:h-20 object-contain drop-shadow-sm" />
      </Link>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-[85px] left-4 right-4 bg-white dark:bg-slate-800 shadow-2xl rounded-[10px] p-6 flex flex-col gap-4 border border-slate-100 dark:border-slate-700 lg:hidden"
          >
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-[#1e3a8a] dark:text-slate-100 font-bold">
              {t?.home ?? 'الرئيسية'}
            </Link>
            <Link to="/schools" onClick={() => setMobileMenuOpen(false)} className="text-[#1e3a8a] dark:text-slate-100 font-bold">
              {t?.schools ?? 'مدارسنا'}
            </Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="text-[#1e3a8a] dark:text-slate-100 font-bold">
              {t?.about ?? 'من نحن'}
            </Link>
            <Link to="/complaints" onClick={() => setMobileMenuOpen(false)} className="text-[#1e3a8a] dark:text-slate-100 font-bold">
              {translationsRoot?.nav?.feedback ?? 'تواصل معنا'}
            </Link>
            <Link to="/news" onClick={() => setMobileMenuOpen(false)} className="text-[#1e3a8a] dark:text-slate-100 font-bold">
              {t?.news ?? 'المدونة'}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
