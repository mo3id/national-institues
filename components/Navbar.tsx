import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const { lang, setLang, isRTL, t: translationsRoot } = useLanguage();
  const location = useLocation();
  const t = translationsRoot.nav;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isPastHero, setIsPastHero] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 50);
      setIsPastHero(scrollY > window.innerHeight - 150);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const menuLinks = [
    { to: '/', label: t?.home ?? 'الرئيسية', icon: 'home' },
    { to: '/schools', label: t?.schools ?? 'مدارسنا', icon: 'school' },
    { to: '/about', label: t?.about ?? 'من نحن', icon: 'info' },
    { to: '/complaints', label: translationsRoot?.nav?.feedback ?? 'تواصل معنا', icon: 'forum' },
    { to: '/news', label: t?.news ?? 'المدونة', icon: 'article' }
  ];

  return (
    <>
      {/* High-level container for all Navbar states */}
      <AnimatePresence mode="wait">
        {!scrolled ? (
          /* FULL NAVBAR (Initial State) */
          <motion.nav
            key="full-nav"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="fixed top-[10px] left-[10px] right-[10px] z-[100] py-6 px-10 flex items-center justify-between bg-transparent rounded-[20px]"
          >
            {/* ACTIONS & LINKS */}
            <div className="flex items-center gap-8">
              <div className="hidden lg:flex items-center gap-6 text-[13px] font-bold">
                {menuLinks.map((link) => (
                  <Link key={link.to} to={link.to} className={`group flex items-center gap-1.5 transition-colors whitespace-nowrap ${isActive(link.to) ? 'text-[#991b1b]' : 'text-white hover:text-white/80'}`}>
                    <span className="material-symbols-outlined text-[18px]">{link.icon}</span>
                    <span>{link.label}</span>
                  </Link>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white hover:text-[#1e3a8a] transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">language</span>
                </button>
                <Link
                  to="/login"
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-[#991b1b] hover:border-[#991b1b] transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">login</span>
                </Link>
              </div>
            </div>

            {/* LOGO */}
            <Link to="/" className="flex items-center shrink-0">
              <img src="/Layer 1.png" alt="National Institutes" className="h-7 md:h-9 lg:h-11 object-contain" />
            </Link>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white transition-all shadow-lg"
            >
              <span className="material-symbols-outlined text-[20px]">{mobileMenuOpen ? 'close' : 'menu'}</span>
            </button>
          </motion.nav>
        ) : (
          /* REFINED MINIMAL NAVBAR (Scrolled State) */
          <motion.nav
            key="minimal-nav"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="fixed top-[10px] left-[10px] right-[10px] z-[100] py-4 px-10 flex items-center justify-between"
          >
            {/* MENU BUTTON */}
            <motion.button
              onClick={() => setDrawerOpen(true)}
              whileHover="hover"
              className={`relative flex items-center transition-all duration-500 border rounded-full group ${isPastHero
                ? 'bg-[#1e3a8a] border-[#1e3a8a] text-white shadow-xl p-2.5 px-4'
                : 'bg-white/10 backdrop-blur-md border-white/20 text-white p-2 px-3'
                }`}
            >
              {/* Burger Icon */}
              <span className="material-symbols-outlined text-[24px] group-hover:rotate-180 transition-transform duration-500">
                menu
              </span>

              {/* Animated Text on Hover */}
              <motion.div
                variants={{
                  initial: { width: 0, opacity: 0, marginInlineStart: 0 },
                  hover: { width: 'auto', opacity: 1, marginInlineStart: 8 }
                }}
                className="overflow-hidden whitespace-nowrap font-bold text-[11px] uppercase tracking-wider"
              >
                <span>{lang === 'ar' ? 'القائمة' : 'Menu'}</span>
              </motion.div>
            </motion.button>

            {/* LOGO */}
            <Link to="/" className="flex items-center shrink-0">
              <img src="/Layer 1.png" alt="National Institutes" className="h-7 md:h-9 object-contain" />
            </Link>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Standard Mobile Menu Dropdown (Only for full nav state/mobile) */}
      <AnimatePresence>
        {mobileMenuOpen && !scrolled && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-[90px] left-[26px] right-[26px] bg-white/95 backdrop-blur-lg shadow-2xl rounded-2xl p-6 flex flex-col gap-4 border border-slate-100 lg:hidden z-[110]"
          >
            <div className="flex flex-col gap-1">
              {menuLinks.map((link) => (
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Side Drawer Menu */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 bg-[#0f172a]/80 backdrop-blur-sm z-[200]"
            />
            <motion.div
              initial={{ x: isRTL ? '-100%' : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? '-100%' : '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`fixed top-0 bottom-0 ${isRTL ? 'left-0' : 'right-0'} w-full max-w-sm bg-white shadow-2xl z-[300] flex flex-col p-12`}
            >
              <div className="flex items-center justify-between mb-16">
                <img src="/Layer 1.png" alt="Logo" className="h-10 object-contain" />
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-100 text-[#1e3a8a] hover:bg-[#991b1b] hover:text-white transition-all shadow-sm"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black mb-4 block">
                  {lang === 'ar' ? 'القائمة الرئيسية' : 'Main Menu'}
                </span>
                {menuLinks.map((link, idx) => (
                  <motion.div
                    key={link.to}
                    initial={{ x: isRTL ? -20 : 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Link
                      to={link.to}
                      onClick={() => setDrawerOpen(false)}
                      className={`group flex items-center gap-5 py-4 px-6 rounded-2xl transition-all duration-300 ${isActive(link.to) ? 'bg-[#1e3a8a] text-white' : 'text-[#1e3a8a] hover:bg-slate-50'}`}
                    >
                      <span className={`material-symbols-outlined text-[24px] transition-transform duration-500 group-hover:scale-125 ${isActive(link.to) ? 'text-white' : 'text-[#991b1b]'}`}>{link.icon}</span>
                      <span className="text-xl font-bold">{link.label}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mt-auto pt-12 border-t border-slate-100">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col">
                    <span className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-1">{lang === 'ar' ? 'اتصل بنا' : 'Contact Us'}</span>
                    <span className="text-[#1e3a8a] font-black text-lg">012-3456-7890</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#1e3a8a]/5 flex items-center justify-center text-[#1e3a8a] hover:bg-[#1e3a8a] hover:text-white transition-all cursor-pointer">
                      <span className="material-symbols-outlined text-[20px]">share</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#1e3a8a]/5 flex items-center justify-center text-[#1e3a8a] hover:bg-[#1e3a8a] hover:text-white transition-all cursor-pointer">
                      <span className="material-symbols-outlined text-[20px]">mail</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
