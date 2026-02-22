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
        staggerChildren: 0.1, // Faster stagger for snappier feel
        delayChildren: 0.2
      }
    }
  };

  const textItemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20, // Reduced movement
      x: isRTL ? 15 : -15 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      x: 0,
      transition: { 
        duration: 0.6, // Faster duration
        ease: [0.22, 1, 0.36, 1] as any
      }
    }
  };

  if (slides.length === 0) return null;

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {/* Static Background Image - Removed Ken Burns */}
          <div className="absolute inset-0">
            <img
              src={slides[currentIndex].image}
              alt={slides[currentIndex].title}
              className="h-full w-full object-cover object-center"
            />
          </div>

          {/* Removed Gradient Overlay for pure image look */}
        </motion.div>
      </AnimatePresence>

      {/* Content Container - Starts from top 0 to fill viewport */}
      <div className="relative z-20 h-full w-full max-w-[95vw] md:max-w-[90vw] mx-auto flex flex-col justify-center pt-24">
        <div className={`w-full lg:w-[85vw] xl:w-[80vw] ${isRTL ? 'text-right' : 'text-left'}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              variants={textContainerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="space-y-6 md:space-y-8"
            >
              {/* Badge */}
              <motion.div variants={textItemVariants}>
                <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-[0.2em]">
                  {slides[currentIndex].subtitle}
                </span>
              </motion.div>

              {/* Title */}
              <motion.h1 
                variants={textItemVariants}
                className="text-6xl md:text-8xl lg:text-[7.5rem] font-black text-white leading-[1] tracking-tighter drop-shadow-2xl"
              >
                {slides[currentIndex].title}
              </motion.h1>

              {/* Description */}
              <motion.p 
                variants={textItemVariants}
                className="text-xl md:text-2xl lg:text-3xl text-white/95 max-w-2xl leading-relaxed font-medium drop-shadow-xl"
              >
                {slides[currentIndex].description}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div 
                variants={textItemVariants}
                className={`flex flex-col sm:flex-row items-center gap-6 pt-8 ${isRTL ? 'justify-end' : 'justify-start'}`}
              >
                <button className="w-full sm:w-auto bg-[#991b1b] text-white px-12 py-5 rounded-full font-black uppercase tracking-[0.15em] text-sm hover:bg-red-800 transition-all shadow-[0_8px_30px_rgba(153,27,27,0.4)] flex items-center justify-center group">
                  <span>{t?.cta?.btnSchools ?? 'Our Schools'}</span>
                  {isRTL ? (
                    <ArrowLeft className="mr-4 h-5 w-5 group-hover:-translate-x-2 transition-transform" />
                  ) : (
                    <ArrowRight className="ml-4 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                  )}
                </button>
                <button className="w-full sm:w-auto bg-white/10 backdrop-blur-md border-2 border-white/40 text-white px-12 py-5 rounded-full font-black uppercase tracking-[0.15em] text-sm hover:bg-white hover:text-[#1e3a8a] transition-all drop-shadow-lg">
                  {t?.hero?.ctaAbout ?? 'About Us'}
                </button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Slider Controls - Positioned at Bottom Right (as per wireframe) */}
      <div className={`absolute bottom-12 z-30 flex items-end gap-8 ${isRTL ? 'left-6 md:left-12' : 'right-6 md:right-12'}`}>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4 text-white font-black tracking-widest text-sm drop-shadow-md">
            <span className="text-white text-2xl">0{currentIndex + 1}</span>
            <div className="w-12 h-[1px] bg-white/40 relative">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-white"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                key={currentIndex}
                transition={{ duration: 8, ease: "linear" }}
              />
            </div>
            <span>0{slides.length}</span>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={handlePrev}
              className="p-3 rounded-full border border-white/40 text-white hover:bg-white hover:text-[#1e3a8a] transition-all backdrop-blur-sm"
            >
              {isRTL ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
            <button 
              onClick={handleNext}
              className="p-3 rounded-full border border-white/40 text-white hover:bg-white hover:text-[#1e3a8a] transition-all backdrop-blur-sm"
            >
              {isRTL ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
