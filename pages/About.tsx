import React from 'react';
import { useLanguage } from '../LanguageContext';
import { motion } from 'framer-motion';
import {
    BookOpen,
    Lightbulb,
    ShieldCheck,
    Users,
    Target,
    Award,
    Globe2,
    ChevronRight
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import ScrollReveal from '../components/ScrollReveal';

const About: React.FC = () => {
    const { isRTL, t: translationsRoot } = useLanguage();
    const t = translationsRoot.aboutPage;

    // Icons array matched to the translations array 
    const valIcons = [Award, Lightbulb, ShieldCheck, Users];
    const valueColors = ["text-blue-600", "text-amber-500", "text-emerald-500", "text-purple-600"];
    const valueBg = ["bg-blue-50", "bg-amber-50", "bg-emerald-50", "bg-purple-50"];

    return (
        <PageTransition>
            <div className="bg-white min-h-screen pb-24">

                {/* Modern Hero Header */}
                <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-50">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute top-0 -left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                        <div className="absolute top-0 -right-10 w-72 h-72 bg-red-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
                        {/* Subtle Grid overlay */}
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
                    </div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="space-y-6"
                        >
                            <div className="inline-flex items-center space-x-2 space-x-reverse bg-white/60 backdrop-blur-md px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                                <span className="text-sm font-bold tracking-widest text-[#1e3a8a] uppercase">{t.subtitle}</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight">
                                {t.title}
                            </h1>
                        </motion.div>
                    </div>
                </div>

                {/* Story Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
                    <ScrollReveal>
                        <div className="bg-white rounded-[2.5rem] p-8 md:p-16 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 grid md:grid-cols-2 gap-16 items-center">
                            <div className={`space-y-8 ${isRTL ? 'text-right' : 'text-left'}`}>
                                <div className="w-16 h-1 bg-gradient-to-r from-red-600 to-red-400 rounded-full"></div>
                                <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
                                    {t.historyTitle}
                                </h2>
                                <p className="text-lg text-slate-600 leading-relaxed">
                                    {t.historyDesc}
                                </p>

                                <div className={`flex items-center gap-6 pt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <div className="flex -space-x-4 space-x-reverse">
                                        <img className="w-12 h-12 rounded-full border-2 border-white object-cover" src="https://picsum.photos/seed/s1/200" alt="Student" />
                                        <img className="w-12 h-12 rounded-full border-2 border-white object-cover" src="https://picsum.photos/seed/s2/200" alt="Student" />
                                        <img className="w-12 h-12 rounded-full border-2 border-white object-cover" src="https://picsum.photos/seed/s3/200" alt="Student" />
                                    </div>
                                    <div className={`text-sm font-bold text-slate-500 ${isRTL ? 'text-right' : 'text-left'}`}>
                                        <span className="block text-xl text-slate-900">40+</span>
                                        {translationsRoot.stats.schools}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <img src="https://picsum.photos/seed/ab1/600/800" className="rounded-3xl object-cover h-full w-full transform translate-y-8 shadow-xl" alt="Graduation" />
                                <img src="https://picsum.photos/seed/ab2/600/800" className="rounded-3xl object-cover h-full w-full shadow-xl" alt="Classroom" />
                            </div>
                        </div>
                    </ScrollReveal>
                </div>

                {/* Mission & Vision */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
                    <div className="grid md:grid-cols-2 gap-12">

                        <ScrollReveal direction={isRTL ? "right" : "left"} delay={0.1}>
                            <div className="group relative bg-slate-900 rounded-[2.5rem] p-10 md:p-14 overflow-hidden h-full">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className={`relative z-10 space-y-8 ${isRTL ? 'text-right' : 'text-left'}`}>
                                    <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center">
                                        <Target className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-white tracking-tight">{t.missionTitle}</h3>
                                    <p className="text-slate-300 text-lg leading-relaxed">
                                        {t.missionDesc}
                                    </p>
                                </div>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal direction={isRTL ? "left" : "right"} delay={0.2}>
                            <div className="group relative bg-[#1e3a8a] rounded-[2.5rem] p-10 md:p-14 overflow-hidden h-full">
                                <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-12 -translate-y-12 group-hover:scale-110 transition-transform duration-700">
                                    <Globe2 className="w-48 h-48 text-white" />
                                </div>
                                <div className={`relative z-10 space-y-8 ${isRTL ? 'text-right' : 'text-left'}`}>
                                    <div className="w-16 h-16 bg-white/10 text-white rounded-2xl flex items-center justify-center backdrop-blur-sm">
                                        <BookOpen className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-white tracking-tight">{t.visionTitle}</h3>
                                    <p className="text-blue-100 text-lg leading-relaxed">
                                        {t.visionDesc}
                                    </p>
                                </div>
                            </div>
                        </ScrollReveal>

                    </div>
                </div>

                {/* Core Values */}
                <div className="bg-slate-50 py-24 md:py-32 border-y border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <ScrollReveal>
                            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                                <h2 className="text-4xl font-black text-slate-900">{t.valuesTitle}</h2>
                                <div className="w-16 h-1 bg-red-600 rounded-full mx-auto"></div>
                            </div>
                        </ScrollReveal>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {t.values.map((v: any, index: number) => {
                                const Icon = valIcons[index];
                                return (
                                    <ScrollReveal key={index} delay={index * 0.1} direction="up">
                                        <div className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100/50 group text-center h-full flex flex-col items-center hover:-translate-y-2">
                                            <div className={`w-20 h-20 rounded-2xl ${valueBg[index]} ${valueColors[index]} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                                                <Icon className="w-10 h-10" />
                                            </div>
                                            <h4 className="text-xl font-bold text-slate-900 mb-4">{v.title}</h4>
                                            <p className="text-slate-500 leading-relaxed text-sm">
                                                {v.desc}
                                            </p>
                                        </div>
                                    </ScrollReveal>
                                );
                            })}
                        </div>
                    </div>
                </div>

            </div>
        </PageTransition>
    );
};

export default About;
