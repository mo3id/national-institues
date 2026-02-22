import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  const { lang, isRTL } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      image: '/imgs/nano-banana-1771765349835.png',
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
      image: '/imgs/nano-banana-1771766058296.png',
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

  const schools = lang === 'ar'
    ? ['مدارس القمة الأهلية', 'أكاديمية الإبداع الدولية', 'مدرسة منار العلم', 'مدارس الأفق العالمية', 'أكاديمية الرواد', 'مدارس التضامن']
    : ['Al-Qamma Schools', 'International Creativity Academy', 'Manar Al-Ilm School', 'Al-Ofoq Global Schools', 'Pioneers Academy', 'Solidarity Schools'];

  const icons = ['school', 'auto_awesome', 'psychology', 'public', 'workspace_premium', 'diversity_3'];

  return (
    <main className="mx-[10px] rounded-[10px] overflow-hidden relative min-h-[calc(100vh-120px)] flex items-center shadow-sm">

      {/* Background Images */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out z-0 ${index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          style={{ backgroundImage: `url('${slide.image}')` }}
        />
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

          <p key={`desc-${currentIndex}`} className="text-xl lg:text-2xl text-slate-700 dark:text-slate-200 max-w-2xl mb-12 leading-relaxed font-medium font-['Cairo'] animate-fade-in" style={{ animationDelay: '0.1s' }}>
            {currentSlide.description}
          </p>

          <div className={`flex flex-wrap items-center gap-6 mb-16 ${isRTL ? 'justify-start' : ''}`}>
            <button className="bg-[#991b1b] text-white px-10 py-4 rounded-full font-bold text-lg lg:text-xl hover:shadow-2xl hover:shadow-[#991b1b]/40 transition-all flex items-center gap-3">
              {lang === 'ar' ? 'انضم إلينا الآن' : 'Join Us Now'}
            </button>
            <button className="flex items-center gap-4 group">
              <div className="bg-[#1e3a8a] p-4 rounded-2xl text-white group-hover:bg-[#162a63] transition-colors shadow-lg flex items-center justify-center">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
                  {isRTL ? 'arrow_back' : 'arrow_outward'}
                </span>
              </div>
              <span className="font-bold text-lg text-[#1e3a8a] dark:text-slate-100">{lang === 'ar' ? 'استكشف برامجنا' : 'Explore Programs'}</span>
            </button>
          </div>

          <div className="pt-8 border-t border-[#1e3a8a]/20 dark:border-slate-700/50">
            <p className="text-xs font-bold text-[#991b1b] dark:text-slate-400 uppercase tracking-widest mb-6">
              {lang === 'ar' ? 'نخبة مدارسنا الرائدة' : 'Our Top Pioneer Schools'}
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8">
              {schools.map((school, index) => (
                <div key={index} className="flex items-center gap-3 group cursor-pointer">
                  <span className="material-symbols-outlined text-[#991b1b] text-2xl group-hover:scale-110 transition-transform">{icons[index]}</span>
                  <span className="font-bold text-[#1e3a8a] dark:text-slate-300 text-base md:text-lg">{school}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Side Pagination */}
      <div className={`absolute top-1/2 -translate-y-1/2 flex flex-col gap-4 z-20 ${isRTL ? 'left-8 md:left-12' : 'right-8 md:right-12'}`}>
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`transition-all duration-300 rounded-full ${currentIndex === idx
                ? 'w-2.5 h-10 bg-[#991b1b] shadow-lg shadow-[#991b1b]/30'
                : 'w-2.5 h-2.5 bg-[#1e3a8a]/30 dark:bg-slate-600 hover:bg-[#991b1b]'
              }`}
          ></button>
        ))}
      </div>

      {/* Bottom Slider Controls */}
      <div className={`absolute bottom-8 flex items-center gap-6 z-20 ${isRTL ? 'left-8 md:left-12' : 'right-8 md:right-12'}`}>
        <span className="text-sm md:text-base font-bold text-[#1e3a8a] dark:text-slate-400 drop-shadow-sm">
          {lang === 'ar' ? 'اكتشف المزيد من قصص نجاحنا' : 'Discover More Success Stories'}
        </span>
        <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)}
            className="w-12 h-12 rounded-full bg-white/50 backdrop-blur border border-[#1e3a8a]/20 dark:border-slate-600 flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 transition-all hover:scale-110 text-[#1e3a8a] dark:text-slate-400 shadow-sm"
          >
            <span className="material-symbols-outlined">
              chevron_left
            </span>
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % slides.length)}
            className="w-12 h-12 rounded-full bg-white/50 backdrop-blur border border-[#1e3a8a]/20 dark:border-slate-600 flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 transition-all hover:scale-110 text-[#1e3a8a] dark:text-slate-400 shadow-sm"
          >
            <span className="material-symbols-outlined">
              chevron_right
            </span>
          </button>
        </div>
      </div>

    </main>
  );
};

export default Hero;
