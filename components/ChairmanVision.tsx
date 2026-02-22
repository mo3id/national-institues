import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useLanguage } from '../LanguageContext';

const ChairmanVision: React.FC = () => {
    const { t, isRTL, lang } = useLanguage();
    const containerRef = useRef<HTMLElement>(null);
    const isInView = useInView(containerRef, { once: false, amount: 0.3 });

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Parallax transforms - simplified
    const bgTextY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);
    const chairmanY = useTransform(scrollYProgress, [0, 1], ["0%", "-5%"]);
    const cardY = useTransform(scrollYProgress, [0, 1], ["2%", "-2%"]);
    return (
        <section
            ref={containerRef}
            className="py-24 bg-white overflow-hidden"
        >
            <div className="w-[90%] lg:w-[80%] mx-auto px-6 lg:px-12">
                <div className={`flex flex-col lg:flex-row items-center gap-16 lg:gap-24 ${isRTL ? 'lg:flex-row-reverse' : ''}`}>

                    {/* Image Column */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8 }}
                        className="w-full lg:w-5/12 relative"
                    >
                        <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-slate-50 group">
                            <img
                                src="/chairman.png"
                                alt={t.chairman.name}
                                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-1000"
                            />
                            {/* Simple Overlay for depth */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>

                        {/* Minimal badge */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={isInView ? { scale: 1, opacity: 1 } : {}}
                            transition={{ delay: 0.5 }}
                            className={`absolute -bottom-6 ${isRTL ? '-left-6' : '-right-6'} bg-[#1e3a8a] text-white px-8 py-6 rounded-2xl shadow-xl hidden lg:block`}
                        >
                            <span className="block text-3xl font-black leading-none">40+</span>
                            <span className="text-[10px] uppercase tracking-widest font-bold opacity-80 whitespace-nowrap">
                                {lang === 'ar' ? 'مدرسة رائدة' : 'Pioneer Schools'}
                            </span>
                        </motion.div>
                    </motion.div>

                    {/* Content Column */}
                    <div className={`w-full lg:w-7/12 space-y-10 ${isRTL ? 'text-right' : 'text-left'}`}>
                        <div className="space-y-4">
                            <motion.div
                                initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                                animate={isInView ? { opacity: 1, x: 0 } : {}}
                                className="flex items-center gap-4"
                            >
                                <span className="h-px w-12 bg-[#991b1b]"></span>
                                <span className="text-[#991b1b] font-bold text-xs uppercase tracking-[0.3em]">
                                    {t.chairman.tag}
                                </span>
                            </motion.div>

                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ delay: 0.2 }}
                                className="text-4xl lg:text-6xl font-black text-[#1e3a8a] leading-[1.1]"
                            >
                                {t.chairman.title}
                            </motion.h2>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.4 }}
                            className="space-y-8"
                        >
                            <blockquote className={`text-xl lg:text-2xl text-slate-600 leading-relaxed font-medium italic ${isRTL ? 'border-r-4 pr-8' : 'border-l-4 pl-8'} border-[#991b1b] py-2`}>
                                "{t.chairman.quote}"
                            </blockquote>

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 pt-4">
                                <div className="space-y-1">
                                    <p className="text-2xl font-black text-[#1e3a8a] tracking-tight">{t.chairman.name}</p>
                                    <p className="text-[#991b1b] font-bold text-sm uppercase tracking-widest">{t.chairman.role}</p>
                                </div>

                                {/* Minimal Signature Placeholder/Icon */}
                                <div className="opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-crosshair">
                                    <svg width="120" height="40" viewBox="0 0 120 45" fill="none" className="text-slate-900">
                                        <path d="M10 35C25 35 35 15 50 15C65 15 75 35 90 35C105 35 110 25 110 25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ChairmanVision;
