import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, ArrowDown, ChevronRight, Users, Star, Clock, CheckCircle } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

// Default slides (content may be overridden by translations at runtime)
const defaultSlides = [
  {
    id: 1,
    title: "Nurturing Global Leaders",
    subtitle: "Legacy of Excellence",
    description: "Empowering the next generation with world-class education and values that transcend borders.",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop", // A group of diverse students looking bright/collaborative
    fallbackImage: "https://placehold.co/800x1000/1e3a8a/white?text=Education+Excellence",
    stats: { students: "25k+", experts: "50+", support: "24/7" }
  },
  {
    id: 2,
    title: "Innovation in Education",
    subtitle: "Future Ready",
    description: "Integrating cutting-edge technology and AI to create personalized learning experiences for every student.",
    image: "https://picsum.photos/seed/n6/800/800", // modern tech setup
    fallbackImage: "https://placehold.co/800x1000/1e3a8a/white?text=Innovation",
    stats: { students: "28k+", experts: "65+", support: "24/7" }
  },
  {
    id: 3,
    title: "Community & Culture",
    subtitle: "Building Character",
    description: "Fostering a vibrant community where diversity is celebrated and character is built through shared experiences.",
    image: "https://picsum.photos/seed/news6/800/600", // large community group laughing/engaged
    fallbackImage: "https://placehold.co/800x1000/1e3a8a/white?text=Community",
    stats: { students: "30k+", experts: "80+", support: "24/7" }
  }
];

const Hero: React.FC = () => {
  const { isRTL, t, lang } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // 1 for down (next), -1 for up (prev)
  const [imgError, setImgError] = useState<{ [key: number]: boolean }>({});

  // Build slides using translations
  const slides = useMemo(() => {
    if (!t?.hero?.slides) return defaultSlides;
    return t.hero.slides.map((slide: any, index: number) => ({
      ...slide,
      id: index + 1,
      image: defaultSlides[index]?.image || defaultSlides[0].image,
      fallbackImage: defaultSlides[index]?.fallbackImage || defaultSlides[0].fallbackImage,
      stats: defaultSlides[index]?.stats || defaultSlides[0].stats
    }));
  }, [t, lang]);

  // Auto-play functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleImageError = (id: number) => {
    setImgError(prev => ({ ...prev, [id]: true }));
  };


  const slideVariants = {
    enter: (direction: number) => ({
      y: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 1.1
    }),
    center: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        y: { type: "spring" as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
        scale: { duration: 0.5 }
      }
    },
    exit: (direction: number) => ({
      y: direction > 0 ? '-100%' : '100%',
      opacity: 0,
      scale: 0.9,
      transition: {
        y: { type: "spring" as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
        scale: { duration: 0.5 }
      }
    })
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const, delay: 0.2 }
    }
  };

  return (
    <section className="relative min-h-[90vh] bg-gray-50 overflow-hidden py-12 lg:py-0 flex items-center">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute top-1/2 -left-24 w-72 h-72 bg-red-50 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20">

          {/* Text Content Side */}
          <div className="flex-1 space-y-8 text-center lg:text-start">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={textVariants}
                className="space-y-6"
              >
                {/* Badge */}
                <div className={`inline-flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''} bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-full`}>
                  <span className="w-2 h-2 bg-[#1e3a8a] rounded-full animate-pulse" />
                  <span className="text-[#1e3a8a] text-xs font-bold uppercase tracking-widest">
                    {slides[currentIndex].subtitle}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-[#1e3a8a] leading-[1.1]">
                  {slides[currentIndex].title.split(' ').map((word, i) => (
                    <span key={i} className="block">{word}</span>
                  ))}
                </h1>

                {/* Description */}
                <p className="text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                  {slides[currentIndex].description}
                </p>

                {/* Buttons */}
                <div className={`flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4`}>
                  <button className="w-full sm:w-auto bg-[#991b1b] text-white px-8 py-4 rounded-xl font-bold hover:bg-red-800 transition-colors shadow-lg shadow-red-900/20 flex items-center justify-center space-x-2 group">
                    <span>{t?.cta?.btnSchools ?? 'Register Now'}</span>
                    <ChevronRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''} group-hover:translate-x-1 transition-transform`} />
                  </button>
                  <button className="w-full sm:w-auto bg-transparent border-2 border-[#1e3a8a] text-[#1e3a8a] px-8 py-4 rounded-xl font-bold hover:bg-[#1e3a8a] hover:text-white transition-all">
                    {t?.hero?.ctaAbout ?? 'Explore Courses'}
                  </button>
                </div>

                {/* Stats Row */}
                <div className={`pt-8 flex items-center justify-center lg:justify-start gap-8 border-t border-gray-200 mt-8`}>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 text-[#1e3a8a] font-black text-2xl">
                      <Users className="w-5 h-5 text-[#991b1b]" />
                      <span>{slides[currentIndex].stats.students}</span>
                    </div>
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">{t?.stats?.students ?? 'Students'}</span>
                  </div>
                  <div className="w-px h-10 bg-gray-200" />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 text-[#1e3a8a] font-black text-2xl">
                      <Star className="w-5 h-5 text-[#991b1b]" />
                      <span>{slides[currentIndex].stats.experts}</span>
                    </div>
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">{t?.stats?.experts ?? (lang === 'ar' ? 'خبراء' : 'Experts')}</span>
                  </div>
                  <div className="w-px h-10 bg-gray-200" />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 text-[#1e3a8a] font-black text-2xl">
                      <Clock className="w-5 h-5 text-[#991b1b]" />
                      <span>{slides[currentIndex].stats.support}</span>
                    </div>
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">{t?.stats?.support ?? (lang === 'ar' ? 'الدعم' : 'Support')}</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Image Slider Side */}
          <div className="flex-1 w-full max-w-2xl relative">
            <div className="relative aspect-[4/5] md:aspect-square lg:aspect-[4/5] rounded-[2.5rem] border-[8px] border-white shadow-2xl overflow-hidden bg-gray-200">
              <AnimatePresence initial={false} custom={direction}>
                <motion.img
                  key={currentIndex}
                  src={imgError[slides[currentIndex].id] ? slides[currentIndex].fallbackImage : slides[currentIndex].image}
                  onError={() => handleImageError(slides[currentIndex].id)}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0 w-full h-full object-cover"
                  alt={slides[currentIndex].title}
                />
              </AnimatePresence>

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1e3a8a]/40 to-transparent pointer-events-none" />
            </div>

            {/* Navigation Buttons */}
            <div className={`absolute top-1/2 -translate-y-1/2 flex flex-col gap-3 ${isRTL ? 'left-4 lg:-left-8' : 'right-4 lg:-right-8'} z-20`}>
              <button
                onClick={handlePrev}
                className="w-12 h-12 md:w-14 md:h-14 bg-white text-[#1e3a8a] rounded-full shadow-lg flex items-center justify-center hover:bg-[#1e3a8a] hover:text-white transition-all hover:scale-110 group"
                aria-label="Previous slide"
              >
                <ArrowUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
              </button>
              <button
                onClick={handleNext}
                className="w-12 h-12 md:w-14 md:h-14 bg-[#991b1b] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#7f1d1d] transition-all hover:scale-110 group"
                aria-label="Next slide"
              >
                <ArrowDown className="w-6 h-6 group-hover:translate-y-1 transition-transform" />
              </button>
            </div>

            {/* Floating Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className={`absolute bottom-8 ${isRTL ? 'right-8' : 'left-8'} bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl flex items-center gap-3 max-w-[200px] z-20`}
            >
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-[#1e3a8a] font-bold text-sm">{t?.hero?.certified ?? 'Certified Institute'}</span>
                <span className="text-xs text-gray-500">{t?.hero?.since ?? 'Since 1950'}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
