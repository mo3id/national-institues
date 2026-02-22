import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const Hero: React.FC = () => {
  const { isRTL, t, lang } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slides = useMemo(() => {
    return t?.hero?.slides || [];
  }, [t]);

  useEffect(() => {
    if (!isAutoPlaying || slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, slides.length]);

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Removed kenBurnsVariants to stop background animation

  const textContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.3
      }
    }
  };

  const textItemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      filter: "blur(8px)"
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { 
        duration: 1, 
        ease: [0.19, 1, 0.22, 1] as any
      }
    }
  };

  if (slides.length === 0) return null;

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#050505]">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 1.5, ease: [0.33, 1, 0.68, 1] }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0">
            <img
              src={slides[currentIndex].image}
              alt={slides[currentIndex].title}
              className={`h-full w-full object-cover object-center transition-transform duration-[2000ms] ${isRTL ? 'scale-x-[-1]' : ''}`}
            />
            {/* Ultra-subtle overlay for contrast */}
            <div className="absolute inset-0 bg-black/10" />
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="relative z-20 h-full w-full max-w-[90vw] mx-auto flex flex-col justify-center">
        <div className={`w-full lg:w-[45vw] ${isRTL ? 'text-right' : 'text-left'}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              variants={textContainerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="space-y-8"
            >
              <motion.div variants={textItemVariants} className="flex items-center gap-3">
                <span className="w-6 h-[1px] bg-white/30" />
                <span className="text-white/50 text-[9px] font-bold uppercase tracking-[0.5em]">
                  {slides[currentIndex].subtitle}
                </span>
              </motion.div>

              <motion.h1 
                variants={textItemVariants}
                className="text-6xl md:text-7xl lg:text-[5.5rem] font-extralight text-white leading-tight tracking-tight"
              >
                {slides[currentIndex].title}
              </motion.h1>

              <motion.p 
                variants={textItemVariants}
                className="text-base md:text-lg text-white/40 max-w-md leading-relaxed font-light"
              >
                {slides[currentIndex].description}
              </motion.p>

              <motion.div 
                variants={textItemVariants}
                className={`flex items-center gap-12 pt-6 ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <button className="group relative flex items-center gap-4 text-white text-[10px] font-bold uppercase tracking-[0.4em] transition-all">
                  <span className="relative overflow-hidden">
                    <span className="block transition-transform duration-500 group-hover:-translate-y-full">
                      {t?.cta?.btnSchools ?? 'Explore'}
                    </span>
                    <span className="absolute top-0 left-0 transition-transform duration-500 translate-y-full group-hover:translate-y-0">
                      {t?.cta?.btnSchools ?? 'Explore'}
                    </span>
                  </span>
                  <div className="w-10 h-10 flex items-center justify-center border border-white/10 rounded-full transition-all duration-500 group-hover:border-white group-hover:bg-white group-hover:text-black">
                    {isRTL ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
                  </div>
                </button>
                
                <button className="text-white/30 hover:text-white text-[10px] font-bold uppercase tracking-[0.4em] transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-white after:transition-all hover:after:w-full">
                  {t?.hero?.ctaAbout ?? 'About'}
                </button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Minimalist Slide Indicators */}
      <div className={`absolute bottom-12 z-30 flex items-center gap-8 ${isRTL ? 'left-12' : 'right-12'}`}>
        <div className="flex gap-3">
          {slides.map((_, i) => (
            <button 
              key={i}
              onClick={() => {
                setIsAutoPlaying(false);
                setCurrentIndex(i);
              }}
              className="group py-4 px-2"
            >
              <div className={`h-[1px] transition-all duration-700 ${currentIndex === i ? 'w-10 bg-white' : 'w-4 bg-white/20 group-hover:w-6 group-hover:bg-white/40'}`} />
            </button>
          ))}
        </div>
        <div className="overflow-hidden h-4">
          <AnimatePresence mode="wait">
            <motion.span 
              key={currentIndex}
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              exit={{ y: -20 }}
              className="block text-white/20 text-[9px] font-bold tracking-[0.3em] uppercase"
            >
              0{currentIndex + 1}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Hero;
