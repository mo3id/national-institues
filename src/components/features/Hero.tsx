import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useSiteData } from '@/context/DataContext';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  const { isRTL, t: translationsRoot, lang } = useLanguage();
  const { data: siteData } = useSiteData();
  const [currentIndex, setCurrentIndex] = useState(0);

  const t = translationsRoot.hero;
  const rawSlides = siteData.heroSlides || [];
  const slides = rawSlides.map(s => ({
    ...s,
    title: lang === 'ar' ? s.titleAr : s.title,
    description: lang === 'ar' ? s.descriptionAr : s.description
  }));

  if (slides.length === 0) return null;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const currentSlide = slides[currentIndex];

  return (
    <main className="m-[10px] rounded-[20px] relative lg:h-[calc(100vh-20px)] lg:min-h-0 flex flex-col lg:flex-row lg:items-center overflow-hidden bg-white lg:bg-transparent pb-4 lg:pb-0">

      {/* Background Images */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-x-2 top-2 h-[48vh] lg:inset-0 lg:top-0 lg:h-full transition-opacity duration-1000 ease-in-out z-0 ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
        >
          {/* Inner div to apply flip without animating it */}
          <div
            className="absolute inset-0 bg-cover bg-center rounded-[24px] lg:rounded-none"
            style={{
              backgroundImage: `url('${slide.image}')`,
              transform: isRTL ? 'scaleX(-1)' : 'none'
            }}
          />
          {/* Gradient overlay: Darker on text side (Desktop only) */}
          <div
            className={`hidden lg:block absolute inset-0 z-10 ${isRTL
              ? 'bg-gradient-to-l from-black/60 via-black/10 to-transparent'
              : 'bg-gradient-to-r from-black/60 via-black/10 to-transparent'
              }`}
          />
          {/* Mobile Image Gradient (top) to make Navbar visible */}
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent lg:hidden z-10 pointer-events-none rounded-t-[24px]" />
          {/* Mobile Image Gradient (bottom) for over-image text */}
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/90 via-black/40 to-transparent lg:hidden z-10 pointer-events-none rounded-b-[24px]" />
        </div>
      ))}

      {/* Main Content */}
      <div className="container mx-auto px-6 md:px-12 py-2 lg:py-20 relative z-20 flex-1 flex flex-col justify-start lg:justify-center" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className={`w-full max-w-3xl flex flex-col lg:block h-full animate-fade-up ${isRTL ? 'lg:ml-auto' : 'lg:mr-auto'}`}>

          {/* Text Container: overlays the image on mobile */}
          <div className="h-[48vh] lg:h-auto flex flex-col justify-end lg:justify-start pb-8 lg:pb-0">
            <h1 key={`title-${currentIndex}`} className="text-3xl sm:text-4xl lg:text-7xl font-extrabold text-white leading-[1.3] mb-3 lg:mb-8 animate-fade-in text-start drop-shadow-lg">
              {currentSlide.title}
            </h1>

            {/* removed font-['Cairo'] and increased size by ~4px: text-[20px] and lg:text-[24px] */}
            <p key={`desc-${currentIndex}`} className="text-[20px] lg:text-[24px] text-white/95 max-w-2xl mb-2 lg:mb-12 leading-relaxed font-medium animate-fade-in text-start drop-shadow-md" style={{ animationDelay: '0.1s' }}>
              {currentSlide.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 lg:gap-6 justify-start mt-6 lg:mt-0 relative z-30">
            <a href="/#join-us" className="bg-[#991b1b] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#7f1616] lg:hover:bg-white lg:hover:text-[#991b1b] transition-all duration-300 flex items-center justify-center gap-3 group shadow-xl">
              {t.joinNow}
              <span className={`material-symbols-outlined transition-transform ${isRTL ? 'rotate-180 sm:group-hover:-translate-x-1' : 'sm:group-hover:translate-x-1'}`}>arrow_forward</span>
            </a>
            <a href="/about" className="flex items-center justify-center gap-4 group px-6 py-4 rounded-full bg-slate-50 border border-slate-200 lg:border-none lg:bg-transparent lg:p-0 shadow-xl lg:shadow-none">
              <div className="hidden lg:flex bg-white/10 backdrop-blur-md p-3 rounded-full text-white border border-white/20 group-hover:bg-white group-hover:text-[#1e3a8a] transition-all duration-300 items-center justify-center shadow-lg">
                <span className="material-symbols-outlined text-[20px]">
                  {isRTL ? 'arrow_back' : 'arrow_outward'}
                </span>
              </div>
              <span className="font-bold text-lg text-slate-900 lg:text-white group-hover:text-[#991b1b] transition-colors drop-shadow-md">{t.explorePrograms}</span>
            </a>
          </div>

          {/* Mobile Slider Controls - Horizontal under the content */}
          <div className="lg:hidden w-full pt-8 pb-4 flex items-center justify-between relative z-20" dir="ltr">
            <div className="flex gap-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 transition-all duration-500 rounded-full ${currentIndex === idx ? 'w-6 bg-[#991b1b]' : 'w-2 bg-slate-200'}`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentIndex((prev) => (prev + 1) % slides.length)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-[#991b1b] text-white active:scale-95 transition-all shadow-[0_5px_15px_rgba(153,27,27,0.2)]"
                aria-label="Next slide"
              >
                <span className="material-symbols-outlined text-xl">
                  chevron_right
                </span>
              </button>
              <button
                onClick={() => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 active:scale-95 transition-all"
                aria-label="Previous slide"
              >
                <span className="material-symbols-outlined text-xl">
                  chevron_left
                </span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Modern Slider Controls - Desktop (Right Side Vertical Stack) */}
      <div className={`hidden lg:flex absolute z-30 flex-col items-center gap-6 bottom-12 ${isRTL ? 'left-12' : 'right-12'}`}>
        {/* Progress & Pagination (Vertical) */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-col items-center justify-center text-white font-bold mb-2">
            <span className="text-2xl leading-none">{String(currentIndex + 1).padStart(2, '0')}</span>
            <div className="w-6 h-[1px] bg-white/30 my-2" />
            <span className="text-sm leading-none opacity-50">{String(slides.length).padStart(2, '0')}</span>
          </div>

          <div className="flex flex-col gap-3">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`group relative w-1.5 transition-all duration-500 rounded-full overflow-hidden ${currentIndex === idx ? 'h-12 bg-white/40' : 'h-4 bg-white/10 hover:bg-white/30'}`}
              >
                {currentIndex === idx && (
                  <div className="absolute inset-0 bg-[#991b1b] h-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Arrows (Vertical Stack) */}
        <div className="flex flex-col gap-3 mt-4">
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white hover:text-[#1e3a8a] transition-all duration-300 group shadow-lg"
            aria-label="Previous slide"
          >
            <span className={`material-symbols-outlined text-2xl transition-transform duration-300 group-hover:-translate-y-1`}>
              keyboard_arrow_up
            </span>
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % slides.length)}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-[#991b1b] text-white hover:bg-white hover:text-[#991b1b] transition-all duration-300 group shadow-[0_10px_20px_rgba(153,27,27,0.3)]"
            aria-label="Next slide"
          >
            <span className={`material-symbols-outlined text-2xl transition-transform duration-300 group-hover:translate-y-1`}>
              keyboard_arrow_down
            </span>
          </button>
        </div>
      </div>

    </main>
  );
};


export default Hero;
