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
    <nav className={`absolute top-[10px] left-[10px] right-[10px] py-6 px-10 flex items-center justify-between z-[100] transition-all duration-300 rounded-t-[20px] ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>

      {/* Start side: Actions & Menu together */}
      <div className={`flex items-center gap-8 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Actions (Language & Login) */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white hover:text-[#1e3a8a] transition-all group"
            title={lang === 'en' ? 'عربي' : 'English'}
          >
            <span className="material-symbols-outlined text-[18px]">language</span>
          </button>

          <Link
            to="/login"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-[#991b1b] hover:border-[#991b1b] transition-all group"
            title={lang === 'ar' ? 'دخول' : 'Login'}
          >
            <span className="material-symbols-outlined text-[18px]">login</span>
          </Link>
        </div>

        {/* Navigation Links - Now next to icons */}
        <div className={`hidden lg:flex items-center gap-6 text-[13px] font-bold ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          <Link to="/" className={`group flex items-center gap-1.5 transition-colors ${isActive('/') ? 'text-[#991b1b]' : 'text-white hover:text-white/80'}`}>
            <span className="material-symbols-outlined text-[18px]">home</span>
            <span>{t?.home ?? 'الرئيسية'}</span>
          </Link>
          <Link to="/schools" className={`group flex items-center gap-1.5 transition-colors ${isActive('/schools') ? 'text-[#991b1b]' : 'text-white hover:text-white/80'}`}>
            <span className="material-symbols-outlined text-[18px]">school</span>
            <span>{t?.schools ?? 'مدارسنا'}</span>
          </Link>
          <div className="group cursor-pointer flex items-center gap-1.5 text-white hover:text-white/80 transition-colors">
            <span className="material-symbols-outlined text-[18px]">design_services</span>
            <span>{lang === 'ar' ? 'الخدمات' : 'Services'}</span>
          </div>
          <Link to="/about" className={`group flex items-center gap-1.5 transition-colors ${isActive('/about') ? 'text-[#991b1b]' : 'text-white hover:text-white/80'}`}>
            <span className="material-symbols-outlined text-[18px]">info</span>
            <span>{t?.about ?? 'من نحن'}</span>
          </Link>
          <Link to="/complaints" className={`group flex items-center gap-1.5 transition-colors ${isActive('/complaints') ? 'text-[#991b1b]' : 'text-white hover:text-white/80'}`}>
            <span className="material-symbols-outlined text-[18px]">forum</span>
            <span>{translationsRoot?.nav?.feedback ?? 'تواصل معنا'}</span>
          </Link>
          <Link to="/news" className={`group flex items-center gap-1.5 transition-colors ${isActive('/news') ? 'text-[#991b1b]' : 'text-white hover:text-white/80'}`}>
            <span className="material-symbols-outlined text-[18px]">article</span>
            <span>{t?.news ?? 'المدونة'}</span>
          </Link>
        </div>
      </div>

      {/* Far side: Logo */}
      <Link to="/" className="flex items-center shrink-0">
        <img src="/Layer 1.png" alt="National Institutes" className="h-7 md:h-9 lg:h-11 object-contain brightness-0 invert" />
      </Link>

      {/* Mobile Toggle inside the links container Logic */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white transition-all"
      >
        <span className="material-symbols-outlined text-[20px]">
          {mobileMenuOpen ? 'close' : 'menu'}
        </span>
      </button>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-[90px] left-4 right-4 bg-white/95 backdrop-blur-lg shadow-2xl rounded-2xl p-6 flex flex-col gap-4 border border-slate-100 lg:hidden overflow-hidden"
          >
            <div className="flex flex-col gap-1">
              {[
                { to: '/', label: t?.home ?? 'الرئيسية', icon: 'home' },
                { to: '/schools', label: t?.schools ?? 'مدارسنا', icon: 'school' },
                { to: '/about', label: t?.about ?? 'من نحن', icon: 'info' },
                { to: '/complaints', label: translationsRoot?.nav?.feedback ?? 'تواصل معنا', icon: 'forum' },
                { to: '/news', label: t?.news ?? 'المدونة', icon: 'article' }
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl font-bold flex items-center gap-3 ${isActive(link.to) ? 'bg-[#991b1b]/10 text-[#991b1b]' : 'text-[#1e3a8a] hover:bg-slate-50'}`}
                >
                  <span className="material-symbols-outlined">{link.icon}</span>
                  <span className="flex-1">{link.label}</span>
                </Link>
              ))}
            </div>
            <div className="h-[1px] bg-slate-100 my-2" />
            <div className="flex items-center gap-3 px-4">
              <span className="material-symbols-outlined text-slate-500">call</span>
              <span className="text-sm font-bold text-slate-700" dir="ltr">012 - 3456 7890</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
