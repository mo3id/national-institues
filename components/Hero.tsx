import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  const { lang, isRTL } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      image: '/nano-banana-1771775040523.png',
      title: lang === 'ar' ? (
        <>نصنع قادة المستقبل في <br /><span className="text-[#991b1b]">٤٠ مدرسة رائدة</span></>
      ) : (
        <>Building Future Leaders in <br /><span className="text-[#991b1b]">40 Pioneer Schools</span></>
      ),
      description: lang === 'ar'
        ? 'نحن لسنا مجرد مجموعة تعليمية، نحن مجتمع متكامل يسعى للابتكار والتميز الأكاديمي. اكتشف بيئة تعليمية تلهم الإبداع وتنمي المهارات.'
        : 'We are more than just an educational group; we are an integrated community striving for innovation and academic excellence. Discover a learning environment that inspires creativity and develops skills.'
    },
    {
      image: '/nano-banana-1771777944339.png',
      title: lang === 'ar' ? (
        <>تعليم متميز يواكب <br /><span className="text-[#1e3a8a]">عصر التكنولوجيا</span></>
      ) : (
        <>Outstanding Education for the <br /><span className="text-[#1e3a8a]">Technology Era</span></>
      ),
      description: lang === 'ar'
        ? 'نستخدم أحدث التقنيات وأفضل المناهج لتزويد أبنائنا بالمعرفة التي يحتاجونها للنجاح في المستقبل المتغير بشكل مستمر.'
        : 'We use the latest technologies and best curricula to equip our students with the knowledge they need to succeed in an ever-changing future.'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const currentSlide = slides[currentIndex];

  return (
    <main className="m-[10px] rounded-[20px] relative h-[calc(100vh-20px)] flex items-center overflow-hidden">

      {/* Background Images */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out z-0 ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
        >
          {/* Inner div to apply flip without animating it */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('${slide.image}')`,
              transform: isRTL ? 'scaleX(-1)' : 'none'
            }}
          />
        </div>
      ))}

      {/* Lighter Overlay */}
      <div
        className={`absolute inset-0 z-10 ${isRTL
          ? 'bg-gradient-to-l from-white/80 via-white/50 to-transparent dark:from-[#0F172A]/40 dark:via-[#0F172A]/20 dark:to-transparent'
          : 'bg-gradient-to-r from-white/80 via-white/50 to-transparent dark:from-[#0F172A]/40 dark:via-[#0F172A]/20 dark:to-transparent'
          }`}
      />

      {/* Main Content */}
      <div className="container mx-auto px-6 md:px-12 py-20 relative z-20">
        <div className={`max-w-3xl animate-fade-up ${isRTL ? 'text-right ml-auto' : 'text-left mr-auto'}`}>
          <h1 key={`title-${currentIndex}`} className="text-5xl lg:text-7xl font-extrabold text-[#1e3a8a] dark:text-white leading-[1.2] mb-8 animate-fade-in">
            {currentSlide.title}
          </h1>

          <p key={`desc-${currentIndex}`} className="text-lg lg:text-xl text-white/90 max-w-2xl mb-12 leading-relaxed font-medium font-['Cairo'] animate-fade-in drop-shadow-lg text-start" style={{ animationDelay: '0.1s' }}>
            {currentSlide.description}
          </p>

          <div className={`flex flex-wrap items-center gap-6 ${isRTL ? 'justify-end' : 'justify-start'}`}>
            <button className="bg-[#991b1b] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-[#991b1b] transition-all duration-300 flex items-center gap-3 group">
              {lang === 'ar' ? 'انضم إلينا الآن' : 'Join Us Now'}
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
            </button>
            <button className="flex items-center gap-4 group">
              <div className="bg-white/10 backdrop-blur-lg p-3 rounded-full text-white border border-white/20 group-hover:bg-white group-hover:text-[#1e3a8a] transition-all duration-300 flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">
                  {isRTL ? 'arrow_back' : 'arrow_outward'}
                </span>
              </div>
              <span className="font-bold text-lg text-white group-hover:text-[#991b1b] transition-colors">{lang === 'ar' ? 'استكشف برامجنا' : 'Explore Programs'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modern Slider Controls - Right Side Vertical Stack */}
      <div className={`absolute z-30 flex flex-col items-center gap-6 bottom-12 ${isRTL ? 'left-12' : 'right-12'}`}>

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
