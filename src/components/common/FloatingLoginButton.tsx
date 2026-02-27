import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

const FloatingLoginButton: React.FC = () => {
  const { lang, isRTL } = useLanguage();

  return (
    <div className={`fixed bottom-6 ${isRTL ? 'right-6' : 'left-6'} z-[999]`}>
      <a
        href="https://skooture.ai/login"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_30px_rgba(30,58,138,0.3)] hover:-translate-y-1 transition-all duration-300 border border-slate-100"
        title={lang === 'ar' ? "دخول المنظومة" : "System Login"}
      >
        <img
          src="/WhatsApp Image 2026-02-25 at 9.40.12 PM.jpeg"
          alt="Login"
          className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-300 rounded-full"
        />

        {/* Tooltip */}
        <div className={`absolute ${isRTL ? 'right-20' : 'left-20'} top-1/2 -translate-y-1/2 bg-[#1e3a8a] text-white text-sm font-bold px-4 py-2 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-lg`}>
          {lang === 'ar' ? "دخول المنظومة" : "System Login"}
          {/* Triangle Pointer */}
          <div className={`absolute top-1/2 -translate-y-1/2 w-0 h-0 border-y-8 border-y-transparent ${isRTL ? '-right-2 border-l-8 border-l-[#1e3a8a]' : '-left-2 border-r-8 border-r-[#1e3a8a]'}`} />
        </div>
      </a>
    </div>
  );
};

export default FloatingLoginButton;
