
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, Globe, X, Home as HomeIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../LanguageContext';
import NISLogo from './NISLogo';

const Navbar: React.FC = () => {
  const { lang, setLang, isRTL, t: translationsRoot } = useLanguage();
  const location = useLocation();
  const t = translationsRoot.nav;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { name: t.home, path: '/' },
    { name: t.about, path: '/about' },
    { name: t.schools, path: '/schools' },
    { name: t.news, path: '/news' },
    { name: t.careers, path: '/careers' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`top-0 left-0 right-0 z-[100] transition-all duration-500 ease-in-out mx-auto w-[95vw] md:w-[80vw] rounded-b-[2rem]
        ${isScrolled
          ? 'fixed bg-white/90 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] py-3 border border-gray-200/50 border-t-0'
          : 'absolute bg-white/10 backdrop-blur-lg shadow-[0_8px_32px_rgba(0,0,0,0.1)] py-4 border border-white/20 border-t-0'
        }`}
    >
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center group ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}
            >
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <NISLogo
                  className={`transition-all duration-500 ${isScrolled ? 'h-10 w-10 md:h-12 md:w-12' : 'h-14 w-14 md:h-16 md:w-16'}`}
                  showText={false}
                />
              </motion.div>
              <div className="flex flex-col">
                <span className={`font-black tracking-tight leading-none transition-all duration-500 ${isScrolled ? 'text-xl md:text-2xl text-[#1e3a8a]' : 'text-xl md:text-2xl text-white drop-shadow-md'}`}>
                  {lang === 'ar' ? 'المعاهد القومية' : 'NIS'}
                </span>
                <span className={`font-black uppercase tracking-[0.2em] transition-all duration-500 ${isScrolled ? 'text-[8px] md:text-[10px] opacity-100 text-[#991b1b] mt-1' : 'text-[8px] md:text-[10px] opacity-100 mt-1 text-white/90 drop-shadow-md'}`}>
                  {lang === 'ar' ? 'الجمعية العامة للمعاهد القومية' : 'Excellence in Education'}
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className={`hidden lg:flex items-center ${isRTL ? 'space-x-reverse' : ''}`}>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2 text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-300 group flex items-center gap-2 rounded-full
                  ${isActive(link.path) 
                    ? (isScrolled ? 'bg-blue-50 text-[#1e3a8a]' : 'bg-white/20 backdrop-blur-md text-white border border-white/30') 
                    : (isScrolled ? 'text-gray-600 hover:text-[#1e3a8a] hover:bg-gray-50' : 'text-white/80 hover:text-white hover:bg-white/10 drop-shadow-sm')}`}
              >
                {link.path === '/' && <HomeIcon className="h-4 w-4" />}
                <span>{link.name}</span>
              </Link>
            ))}
          </div>

          {/* Action Buttons & Utility Icons */}
          <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2 md:space-x-4' : 'space-x-2 md:space-x-4'}`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              className={`flex items-center gap-2 font-black text-[11px] uppercase transition-all px-4 py-2.5 rounded-full border 
                ${isScrolled 
                  ? 'text-[#1e3a8a] bg-white border-gray-200 hover:bg-gray-50 shadow-sm' 
                  : 'text-white hover:bg-white/10 border-white/30 backdrop-blur-md shadow-lg shadow-black/10'}`}
            >
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">{lang === 'en' ? 'عربي' : 'EN'}</span>
            </motion.button>

            <Link
              to="/complaints"
              className={`hidden lg:flex items-center px-8 py-2.5 rounded-full transition-all uppercase tracking-[0.15em] text-[11px] font-black shadow-lg active:scale-95
                ${isScrolled 
                  ? 'bg-[#1e3a8a] text-white hover:bg-blue-900 shadow-blue-900/20' 
                  : 'bg-white text-[#1e3a8a] hover:bg-gray-50 shadow-black/20'}`}
            >
              <span>{t.feedback}</span>
            </Link>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 transition-colors rounded-xl 
                ${isScrolled ? 'text-gray-500 hover:text-[#1e3a8a] hover:bg-gray-50' : 'text-white hover:bg-white/10'}`}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden absolute top-[100%] left-0 w-full bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-2xl overflow-hidden"
          >
            <div className="px-4 py-8 space-y-3">
              {navLinks.map((link, i) => (
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  key={link.path}
                >
                  <Link
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all
                      ${isActive(link.path) ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-50 hover:pl-8'}`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="pt-6 border-t border-gray-100"
              >
                <Link
                  to="/complaints"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex justify-center text-[10px] font-black text-white bg-red-700 py-4 rounded-2xl uppercase tracking-[0.2em] shadow-xl shadow-red-900/20 active:scale-95"
                >
                  {t.feedback}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
