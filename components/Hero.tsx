import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  const { lang, isRTL } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    '/imgs/nano-banana-1771765349835.png',
    '/imgs/nano-banana-1771766058296.png'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <main className="mx-[10px] rounded-[10px] overflow-hidden relative min-h-[calc(100vh-120px)] flex items-center shadow-sm">

      {/* Background Images */}
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out z-0 ${index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          style={{ backgroundImage: `url('${img}')` }}
        />
      ))}

      {/* Overlay */}
      <div
        className={`absolute inset-0 z-10 ${isRTL
          ? 'bg-gradient-to-l from-white/90 via-white/70 to-white/10 dark:from-[#0F172A]/90 dark:via-[#0F172A]/70 dark:to-[#0F172A]/20'
          : 'bg-gradient-to-r from-white/90 via-white/70 to-white/10 dark:from-[#0F172A]/90 dark:via-[#0F172A]/70 dark:to-[#0F172A]/20'
          }`}
      />

      {/* Main Content */}
      <div className="container mx-auto px-6 md:px-12 py-20 relative z-20">
        <div className={`max-w-3xl ${isRTL ? 'text-right ml-auto' : 'text-left mr-auto'}`}>
          <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 dark:text-white leading-[1.2] mb-8">
            نصنع قادة المستقبل في <br />
            <span className="text-[#F26522]">٤٠ مدرسة رائدة</span>
          </h1>

          <p className="text-xl lg:text-2xl text-slate-700 dark:text-slate-200 max-w-2xl mb-12 leading-relaxed font-medium">
            نحن لسنا مجرد مجموعة تعليمية، نحن مجتمع متكامل يسعى للابتكار والتميز الأكاديمي. اكتشف بيئة تعليمية تلهم الإبداع وتنمي المهارات.
          </p>

          <div className={`flex flex-wrap items-center gap-6 mb-20 ${isRTL ? 'justify-start' : ''}`}>
            <button className="bg-[#F26522] text-white px-12 py-5 rounded-full font-bold text-xl hover:shadow-2xl hover:shadow-[#F26522]/40 transition-all flex items-center gap-3">
              انضم إلينا الآن
            </button>
            <button className="flex items-center gap-4 group">
              <div className="bg-[#1E293B] p-4 rounded-2xl text-white group-hover:bg-slate-700 transition-colors shadow-lg flex items-center justify-center">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
                  arrow_outward
                </span>
              </div>
              <span className="font-bold text-lg text-slate-800 dark:text-slate-100">استكشف برامجنا</span>
            </button>
          </div>

          <div className="pt-8 border-t border-slate-200/50 dark:border-slate-700/50">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-8">نخبة مدارسنا الرائدة</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-12">
              <div className="flex items-center gap-3 group">
                <span className="material-symbols-outlined text-[#F26522] text-2xl group-hover:scale-110 transition-transform">school</span>
                <span className="font-bold text-slate-800 dark:text-slate-300 text-lg">مدارس القمة الأهلية</span>
              </div>
              <div className="flex items-center gap-3 group">
                <span className="material-symbols-outlined text-[#F26522] text-2xl group-hover:scale-110 transition-transform">auto_awesome</span>
                <span className="font-bold text-slate-800 dark:text-slate-300 text-lg">أكاديمية الإبداع الدولية</span>
              </div>
              <div className="flex items-center gap-3 group">
                <span className="material-symbols-outlined text-[#F26522] text-2xl group-hover:scale-110 transition-transform">psychology</span>
                <span className="font-bold text-slate-800 dark:text-slate-300 text-lg">مدرسة منار العلم</span>
              </div>
              <div className="flex items-center gap-3 group">
                <span className="material-symbols-outlined text-[#F26522] text-2xl group-hover:scale-110 transition-transform">public</span>
                <span className="font-bold text-slate-800 dark:text-slate-300 text-lg">مدارس الأفق العالمية</span>
              </div>
              <div className="flex items-center gap-3 group">
                <span className="material-symbols-outlined text-[#F26522] text-2xl group-hover:scale-110 transition-transform">workspace_premium</span>
                <span className="font-bold text-slate-800 dark:text-slate-300 text-lg">أكاديمية الرواد</span>
              </div>
              <div className="flex items-center gap-3 group">
                <span className="material-symbols-outlined text-[#F26522] text-2xl group-hover:scale-110 transition-transform">diversity_3</span>
                <span className="font-bold text-slate-800 dark:text-slate-300 text-lg">مدارس التضامن</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Side Pagination */}
      <div className={`absolute top-1/2 -translate-y-1/2 flex flex-col gap-5 z-20 ${isRTL ? 'left-12' : 'right-12'}`}>
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`transition-all duration-300 rounded-full ${currentIndex === idx
              ? 'w-2.5 h-10 bg-[#F26522] shadow-lg shadow-[#F26522]/30'
              : 'w-2.5 h-2.5 bg-slate-400/50 dark:bg-slate-600 hover:bg-[#F26522]'
              }`}
          ></button>
        ))}
      </div>

      {/* Bottom Slider Controls */}
      <div className={`absolute bottom-10 flex items-center gap-6 z-20 ${isRTL ? 'left-12' : 'right-12'}`}>
        <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
          اكتشف المزيد من قصص نجاحنا
        </span>
        <div className="flex gap-3">
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)}
            className="w-12 h-12 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 transition-all hover:scale-110 text-slate-600 dark:text-slate-400"
          >
            <span className="material-symbols-outlined">
              {isRTL ? 'chevron_right' : 'chevron_left'}
            </span>
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)}
            className="w-12 h-12 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 transition-all hover:scale-110 text-slate-600 dark:text-slate-400"
          >
            <span className="material-symbols-outlined">
              {isRTL ? 'chevron_left' : 'chevron_right'}
            </span>
          </button>
        </div>
      </div>

    </main>
  );
};

export default Hero;
