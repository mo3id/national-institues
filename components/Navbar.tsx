
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500
        ${isScrolled
          ? 'bg-white/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.05)] py-2 border-b border-gray-100/50'
          : 'bg-white py-5 border-b border-gray-100'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <span className={`font-black text-[#1e3a8a] tracking-tight leading-none transition-all duration-500 ${isScrolled ? 'text-lg md:text-xl' : 'text-xl md:text-2xl'}`}>
                  {lang === 'ar' ? 'المعاهد القومية' : 'NIS'}
                </span>
                <span className={`text-[#991b1b] font-black uppercase tracking-[0.2em] transition-all duration-500 ${isScrolled ? 'text-[6px] md:text-[8px] opacity-0' : 'text-[8px] md:text-[10px] opacity-100 mt-1'}`}>
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
                className={`relative px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 group flex items-center gap-2
                  ${isActive(link.path) ? 'text-[#1e3a8a]' : 'text-gray-400 hover:text-[#1e3a8a]'}`}
              >
                {isActive(link.path) && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-blue-50 rounded-full -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {link.path === '/' && <HomeIcon className="h-3.5 w-3.5" />}
                <span>{link.name}</span>
              </Link>
            ))}
          </div>

          {/* Action Buttons & Utility Icons */}
          <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2 md:space-x-4' : 'space-x-2 md:space-x-4'}`}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              className="flex items-center gap-2 text-gray-500 hover:text-[#1e3a8a] font-black text-[10px] uppercase transition-all px-3 py-2 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100"
            >
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">{lang === 'en' ? 'عربي' : 'EN'}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2.5 text-gray-400 hover:text-[#1e3a8a] transition-all rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100"
            >
              <Search className="h-5 w-5" />
            </motion.button>

            <Link
              to="/complaints"
              className="hidden lg:flex items-center bg-[#991b1b] text-white px-6 py-2.5 rounded-xl hover:bg-red-800 transition-all uppercase tracking-[0.2em] text-[10px] font-black shadow-lg shadow-red-900/10 active:scale-95"
            >
              <span>{t.feedback}</span>
            </Link>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-500 hover:text-[#1e3a8a] transition-colors rounded-xl hover:bg-gray-50"
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
