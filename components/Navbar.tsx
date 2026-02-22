import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, Globe, X, Home as HomeIcon, ChevronDown, Sparkles, GraduationCap, Users, Newspaper } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../LanguageContext';
import NISLogo from './NISLogo';
import { SCHOOLS } from '../constants';

const Navbar: React.FC = () => {
  const { lang, setLang, isRTL, t: translationsRoot } = useLanguage();
  const location = useLocation();
  const t = translationsRoot.nav;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { name: t.home, path: '/', icon: HomeIcon },
    { name: t.about, path: '/about', icon: Sparkles },
    { name: t.schools, path: '/schools', icon: GraduationCap, hasMega: true },
    { name: t.news, path: '/news', icon: Newspaper },
    { name: t.careers, path: '/careers', icon: Users },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-8 left-1/2 -translate-x-1/2 z-[100] transition-all duration-1000 ease-[0.16, 1, 0.3, 1]
          ${isScrolled
            ? 'w-[70vw] md:w-[60vw] bg-white/90 backdrop-blur-xl shadow-[0_30px_60px_rgba(0,0,0,0.1)] py-2 rounded-full border border-black/[0.03]'
            : 'w-[90vw] md:w-[85vw] bg-transparent py-4 border-b border-white/10'
          }`}
      >
        <div className="px-10">
          <div className="flex justify-between items-center h-14">
            {/* Minimalist Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <NISLogo
                className={`transition-all duration-700 ${isScrolled ? 'h-8 w-8' : 'h-10 w-10'}`}
                showText={false}
              />
              <div className="flex flex-col">
                <span className={`text-lg font-light tracking-widest leading-none transition-colors duration-700 ${isScrolled ? 'text-black' : 'text-white'}`}>
                  NIS
                </span>
              </div>
            </Link>

            {/* Clean Navigation */}
            <div className={`hidden lg:flex items-center gap-10 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-500
                    ${isActive(link.path) 
                      ? (isScrolled ? 'text-black' : 'text-white') 
                      : (isScrolled ? 'text-black/30 hover:text-black' : 'text-white/40 hover:text-white')}`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Action Area */}
            <div className={`flex items-center gap-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <button
                onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
                className={`text-[10px] font-bold uppercase tracking-[0.3em] transition-colors duration-700
                  ${isScrolled ? 'text-black/40 hover:text-black' : 'text-white/40 hover:text-white'}`}
              >
                {lang === 'en' ? 'AR' : 'EN'}
              </button>

              <Link
                to="/complaints"
                className={`hidden md:block text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-700 px-6 py-2 rounded-full border
                  ${isScrolled 
                    ? 'text-white bg-black border-black hover:bg-black/80' 
                    : 'text-white border-white/20 hover:bg-white hover:text-black'}`}
              >
                {translationsRoot.nav.feedback}
              </Link>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`lg:hidden transition-colors duration-700 ${isScrolled ? 'text-black' : 'text-white'}`}
              >
                {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu with Animation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden fixed top-24 left-1/2 -translate-x-1/2 w-[90vw] bg-white rounded-[2rem] shadow-2xl z-[90] overflow-hidden"
          >
            <div className="p-8 space-y-4">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all
                      ${isActive(link.path) ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    <span>{link.name}</span>
                    <link.icon className="h-4 w-4" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
