import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useSiteData } from '@/context/DataContext';

const ChairmanVision: React.FC = () => {
    const { isRTL, lang } = useLanguage();
    const { data: siteData } = useSiteData();
    const chairman = siteData.aboutData || {};

    const name = lang === 'ar' ? chairman.nameAr : chairman.name;
    const description = lang === 'ar' ? chairman.descAr : chairman.desc;
    const quote = lang === 'ar' ? chairman.quoteAr : chairman.quote;
    const role = lang === 'ar' ? chairman.roleAr : chairman.role;

    const containerRef = useRef<HTMLElement>(null);
    const isInView = useInView(containerRef, { once: false, amount: 0.3 });

    return (
        <section
            ref={containerRef}
            className="pt-14 lg:pt-48 bg-white overflow-hidden"
        >
            <div className="w-[90%] lg:w-[85%] mx-auto px-6 lg:px-12">
                <div className={`flex flex-col lg:flex-row items-start justify-between gap-12 lg:gap-20 ${isRTL ? 'lg:flex-row-reverse' : ''}`}>

                    {/* Text Column */}
                    <div className={`w-full lg:w-[55%] space-y-12 ${isRTL ? 'text-right' : 'text-left'}`}>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <h2 className="text-2xl md:text-4xl lg:text-4xl xl:text-5xl font-normal text-[#1a1a1a] leading-[1.4] lg:leading-[1.3] tracking-tight">
                                <span className="font-bold">{name}</span> {description}
                            </h2>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : {}}
                            transition={{ delay: 0.5, duration: 1 }}
                            className="pt-8 relative"
                        >
                            {/* Decorative Quote Mark */}
                            <div className={`absolute -top-2 ${isRTL ? '-right-6' : '-left-6'} text-slate-100 text-8xl font-serif select-none pointer-events-none`}>
                                "
                            </div>

                            <p className="text-slate-600 italic text-xl md:text-2xl lg:text-xl xl:text-2xl 2xl:text-3xl leading-relaxed max-w-2xl relative z-10 font-light">
                                {quote}
                            </p>

                            <div className="mt-10 flex items-center gap-4">
                                <div className="h-px w-12 bg-[#1e3a8a]/20"></div>
                                <div className="flex flex-col">
                                    <span className="text-[#1e3a8a] text-sm font-bold uppercase tracking-[0.2em]">
                                        {lang === 'ar' ? 'رؤية القيادة' : 'Leadership Vision'}
                                    </span>
                                    <span className="text-slate-400 text-xs mt-1">
                                        {role}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Image Column */}
                    <motion.div
                        initial={{ opacity: 0, x: isRTL ? -30 : 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="w-full lg:w-[45%] flex justify-center lg:justify-end"
                    >
                        <div className="relative w-full max-w-[320px] lg:max-w-[400px]">
                            {/* Decorative Background Elements (Removed shadow/ring) */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-blue-50/50 rounded-full blur-2xl -z-10" />

                            <div className="relative aspect-square">
                                <img
                                    src="/chairman.png"
                                    alt={name}
                                    className="w-full h-full object-cover rounded-full"
                                />
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default ChairmanVision;
