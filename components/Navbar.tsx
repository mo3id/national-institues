
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, Globe, X, Home as HomeIcon } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { translations } from '../translations';
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
    { name: lang === 'ar' ? 'شكاوي العملاء' : 'Customer Feedback', path: '/complaints' },
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-gray-100
        ${isScrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-md py-2' 
          : 'bg-white py-4'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center group ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}
            >
              <div className="relative transform group-hover:scale-105 transition-transform duration-300">
                <NISLogo 
                  className={`transition-all duration-300 ${isScrolled ? 'h-10 w-10 md:h-12 md:w-12' : 'h-14 w-14 md:h-16 md:w-16'}`} 
                  showText={false} 
                />
              </div>
              <div className="flex flex-col">
                <span className={`font-black text-[#1e3a8a] tracking-tight leading-none transition-all duration-300 ${isScrolled ? 'text-sm md:text-lg' : 'text-base md:text-xl'}`}>
                  {lang === 'ar' ? 'المعاهد القومية' : 'National Institutes'}
                </span>
                <span className="text-[7px] md:text-[10px] text-[#991b1b] font-black tracking-[0.05em] md:tracking-[0.25em] uppercase mt-1 arabic-font opacity-90 max-w-[120px] md:max-w-none leading-tight">
                  {lang === 'ar' ? 'الجمعية العامة للمعاهد القومية' : 'General Assembly of National Institutes'}
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className={`hidden lg:flex items-center ${isRTL ? 'space-x-reverse space-x-8' : 'space-x-8'}`}>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative text-xs font-black uppercase tracking-widest transition-all duration-300 py-2 group flex items-center space-x-1 ${isRTL ? 'space-x-reverse' : ''}
                  ${isActive(link.path) ? 'text-[#1e3a8a]' : 'text-gray-500 hover:text-[#1e3a8a]'}`}
              >
                {link.path === '/' && <HomeIcon className="h-3.5 w-3.5 mb-0.5" />}
                <span>{link.name}</span>
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#991b1b] transform transition-transform duration-300 origin-left
                  ${isActive(link.path) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}
                />
              </Link>
            ))}
          </div>

          {/* Action Buttons & Utility Icons */}
          <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2 md:space-x-4' : 'space-x-2 md:space-x-4'}`}>
            <button
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              className="flex items-center space-x-1 text-gray-400 hover:text-[#1e3a8a] font-black text-[10px] uppercase transition-all px-2 py-1 rounded-md hover:bg-gray-50"
              title={lang === 'en' ? 'التحويل للعربية' : 'Switch to English'}
            >
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">{lang === 'en' ? 'عربي' : 'EN'}</span>
            </button>

            <button className="p-2 text-gray-400 hover:text-[#1e3a8a] transition-all rounded-full hover:bg-gray-50">
              <Search className="h-5 w-5" />
            </button>

            <Link
              to="/complaints"
              className="hidden lg:flex items-center space-x-2 text-[10px] font-black text-[#991b1b] bg-red-50 border border-red-100 px-5 py-2 rounded-full hover:bg-[#991b1b] hover:text-white transition-all uppercase tracking-[0.1em]"
            >
              <span>{t.feedback}</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-500 hover:text-[#1e3a8a] transition-colors rounded-lg hover:bg-gray-50"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`lg:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 shadow-xl transition-all duration-300 ease-in-out transform overflow-hidden
        ${mobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
        <div className="px-4 pt-4 pb-8 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-colors
                ${isActive(link.path) ? 'bg-blue-50 text-[#1e3a8a]' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-gray-100">
            <Link
              to="/complaints"
              onClick={() => setMobileMenuOpen(false)}
              className="flex justify-center text-xs font-black text-[#991b1b] bg-red-50 px-4 py-3 rounded-xl uppercase tracking-widest"
            >
              {t.feedback}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
