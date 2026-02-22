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
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1.5, ease: [0.33, 1, 0.68, 1] }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0">
            <img
              src={slides[currentIndex].image}
              alt={slides[currentIndex].title}
              className={`h-full w-full object-cover object-center ${isRTL ? 'scale-x-[-1]' : ''}`}
            />
            {/* Refined gradient overlay for better text contrast without losing the cinematic feel */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent z-10" />
            <div className="absolute inset-0 bg-black/20 z-10" />
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
              {/* Elegant Subtitle */}
              <motion.div variants={textItemVariants} className="flex items-center gap-4">
                <span className="w-10 h-[1px] bg-red-600" />
                <span className="text-white text-[11px] font-bold uppercase tracking-[0.4em] drop-shadow-md text-red-50">
                  {slides[currentIndex].subtitle}
                </span>
              </motion.div>

              <motion.h1 
                variants={textItemVariants}
                className="text-5xl md:text-7xl lg:text-[6rem] font-black text-white leading-[1.05] tracking-tight drop-shadow-2xl"
              >
                {slides[currentIndex].title}
              </motion.h1>

              <motion.p 
                variants={textItemVariants}
                className="text-lg md:text-xl text-white/90 max-w-lg leading-relaxed font-medium drop-shadow-lg"
              >
                {slides[currentIndex].description}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div 
                variants={textItemVariants}
                className={`flex flex-col sm:flex-row items-center gap-5 pt-8 ${isRTL ? 'justify-end' : 'justify-start'}`}
              >
                <button className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#1e3a8a] text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-[11px] transition-all duration-300 hover:bg-[#162a63] hover:-translate-y-1 shadow-lg shadow-blue-900/30">
                  <span>{t?.cta?.btnSchools ?? 'Find a School Near You'}</span>
                  {isRTL ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                </button>
                
                <button className="w-full sm:w-auto flex items-center justify-center bg-white text-[#1e3a8a] px-8 py-4 rounded-full font-bold uppercase tracking-widest text-[11px] transition-all duration-300 hover:bg-gray-50 shadow-lg border border-gray-100">
                  <span>{t?.hero?.ctaAbout ?? 'Explore Courses'}</span>
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
              <div className={`h-[2px] transition-all duration-700 ${currentIndex === i ? 'w-12 bg-white' : 'w-6 bg-white/40 group-hover:w-8 group-hover:bg-white/60'}`} />
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
              className="block text-white/80 text-[10px] font-black tracking-[0.3em] uppercase drop-shadow-md"
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
