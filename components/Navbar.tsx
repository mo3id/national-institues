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
        className="fixed top-0 left-1/2 -translate-x-1/2 z-[100] w-[95vw] md:w-[70vw] bg-white shadow-[0_10px_40px_rgba(0,0,0,0.08)] py-3 rounded-b-[2rem] border-x border-b border-gray-100"
      >
        <div className="px-8 md:px-10">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-4 group">
              <img
                src="/Layer 0.png"
                alt="National Institutes Logo"
                className="transition-all duration-700 h-10 object-contain drop-shadow-sm"
              />
              <div className="flex flex-col">
                <span className="text-[15px] font-black tracking-wider leading-none transition-colors duration-700 text-[#1e3a8a]">
                  NIS
                </span>
                <span className="text-[8px] font-bold uppercase tracking-[0.2em] mt-1 transition-colors duration-700 text-[#991b1b]">
                  {lang === 'ar' ? 'الجمعية العامة للمعاهد القومية' : 'Excellence in Education'}
                </span>
              </div>
            </Link>

            {/* Clean Navigation */}
            <div className={`hidden lg:flex items-center gap-10 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-[11px] font-black uppercase tracking-[0.25em] transition-all duration-500
                    ${isActive(link.path) 
                      ? 'text-[#991b1b]' 
                      : 'text-[#1e3a8a] hover:text-[#991b1b]'}`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Action Area */}
            <div className={`flex items-center gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <button
                onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
                className="text-[11px] font-black uppercase tracking-[0.25em] transition-colors duration-700 text-[#1e3a8a] hover:text-[#991b1b]"
              >
                {lang === 'en' ? 'AR' : 'EN'}
              </button>

              <Link
                to="/complaints"
                className="hidden md:block text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-700 px-6 py-2.5 rounded-full border shadow-md text-white bg-[#991b1b] border-[#991b1b] hover:bg-[#7f1d1d]"
              >
                {translationsRoot.nav.feedback}
              </Link>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden transition-colors duration-700 text-[#1e3a8a]"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
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
                    className={`flex items-center justify-between px-6 py-4 rounded-full font-black text-[11px] uppercase tracking-[0.2em] transition-all
                      ${isActive(link.path) ? 'bg-[#1e3a8a] text-white' : 'text-[#1e3a8a] hover:bg-gray-50'}`}
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
