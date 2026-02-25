import { useLanguage } from '@/context/LanguageContext';
import { useSiteData } from '@/context/DataContext';
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
import PageTransition from '@/components/common/PageTransition';
import ScrollReveal from '@/components/common/ScrollReveal';

const About: React.FC = () => {
    const { isRTL, lang, t: translationsRoot } = useLanguage();
    const { data: siteData } = useSiteData();
    const d = siteData.aboutData || {};
    const t = translationsRoot?.aboutPage || ({} as any);

    // Localized values
    const storyTitle = lang === 'ar' ? d.storyTitleAr : d.storyTitle;
    const storyDesc = lang === 'ar' ? d.storyDescAr : d.storyDesc;
    const missionTitle = lang === 'ar' ? d.missionTitleAr : d.missionTitle;
    const missionDesc = lang === 'ar' ? d.missionDescAr : d.missionDesc;
    const visionTitle = lang === 'ar' ? d.visionTitleAr : d.visionTitle;
    const visionDesc = lang === 'ar' ? d.visionDescAr : d.visionDesc;
    const values = (d.values || []).map((v: any) => ({
        title: lang === 'ar' ? v.titleAr : v.title,
        desc: lang === 'ar' ? v.descAr : v.desc
    }));

    // Icons array matched to the translations array 
    const valIcons = [Award, Lightbulb, ShieldCheck, Users];
    const valueColors = ["text-blue-600", "text-amber-500", "text-emerald-500", "text-purple-600"];
    const valueBg = ["bg-blue-50", "bg-amber-50", "bg-emerald-50", "bg-purple-50"];

    return (
        <PageTransition>
            <div className="bg-white min-h-screen pb-24">

                {/* Unified Hero Header with 3D Illustration */}
                <section className="m-[10px] rounded-[20px] relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-[#0f172a]">
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
                        style={{ backgroundImage: "url('/about_hero.png')" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/20 to-transparent"></div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center py-20">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="space-y-8"
                        >
                            <div className="inline-flex items-center space-x-2 space-x-reverse bg-white/5 backdrop-blur-xl px-5 py-2.5 rounded-full border border-white/10 shadow-2xl">
                                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                                <span className="text-sm font-bold tracking-[0.2em] text-white/80 uppercase">{t.subtitle}</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[1.05] drop-shadow-2xl">
                                {t.title}
                            </h1>
                        </motion.div>
                    </div>
                </section>
                {/* Story Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 relative z-20">
                    <ScrollReveal>
                        <div className="bg-white rounded-[40px] p-8 md:p-16 lg:p-20 shadow-[0_20px_70px_-15px_rgba(0,0,0,0.1)] border border-slate-100 grid lg:grid-cols-2 gap-16 items-center">
                            <div className={`space-y-10 ${isRTL ? 'text-right' : 'text-left'}`}>
                                <div className="inline-block px-4 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-black uppercase tracking-[0.2em]">
                                    {t.journeyBadge}
                                </div>
                                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1]">
                                    {storyTitle}
                                </h2>
                                <p className="text-xl text-slate-500 leading-relaxed font-medium">
                                    {storyDesc}
                                </p>

                                <div className={`flex items-center gap-8 pt-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <div className="flex -space-x-5 space-x-reverse">
                                        <div className="w-14 h-14 rounded-full border-4 border-white overflow-hidden shadow-lg"><img className="w-full h-full object-cover" src="https://picsum.photos/seed/s1/200" alt="Student" /></div>
                                        <div className="w-14 h-14 rounded-full border-4 border-white overflow-hidden shadow-lg"><img className="w-full h-full object-cover" src="https://picsum.photos/seed/s2/200" alt="Student" /></div>
                                        <div className="w-14 h-14 rounded-full border-4 border-white overflow-hidden shadow-lg"><img className="w-full h-full object-cover" src="https://picsum.photos/seed/s3/200" alt="Student" /></div>
                                    </div>
                                    <div className={`space-y-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                                        <span className="block text-2xl font-black text-[#1e3a8a]">40+</span>
                                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{translationsRoot.stats.schools}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="relative grid grid-cols-2 gap-6 h-[400px] md:h-[500px]">
                                <img src="https://picsum.photos/seed/ab1/600/800" className="rounded-[32px] object-cover h-[90%] w-full shadow-2xl border-4 border-white" alt="Graduation" />
                                <img src="https://picsum.photos/seed/ab2/600/800" className="rounded-[32px] object-cover h-[90%] w-full mt-[10%] shadow-2xl border-4 border-white" alt="Classroom" />
                            </div>
                        </div>
                    </ScrollReveal>
                </div>

                {/* Mission & Vision Redesign */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-40">
                    <div className="grid md:grid-cols-2 gap-10">

                        <ScrollReveal direction={isRTL ? "right" : "left"}>
                            <div className="group relative bg-[#1e293b] rounded-[40px] p-10 md:p-14 lg:p-16 overflow-hidden h-full shadow-2xl transition-all duration-500 hover:shadow-blue-900/10">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                <div className={`relative z-10 space-y-8 ${isRTL ? 'text-right' : 'text-left'}`}>
                                    <div className="w-20 h-20 bg-blue-500 rounded-[24px] flex items-center justify-center text-white shadow-2xl shadow-blue-500/30 group-hover:scale-110 transition-transform duration-500">
                                        <Target className="w-10 h-10" />
                                    </div>
                                    <h3 className="text-4xl font-black text-white tracking-tight">{missionTitle}</h3>
                                    <p className="text-slate-300 text-xl leading-relaxed font-medium">
                                        {missionDesc}
                                    </p>
                                </div>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal direction={isRTL ? "left" : "right"} delay={0.1}>
                            <div className="group relative bg-[#1e3a8a] rounded-[40px] p-10 md:p-14 lg:p-16 overflow-hidden h-full shadow-2xl transition-all duration-500 hover:shadow-blue-900/20">
                                <div className="absolute top-0 right-0 p-8 opacity-5 transform translate-x-20 -translate-y-20 group-hover:scale-125 transition-transform duration-1000">
                                    <Globe2 className="w-80 h-80 text-white" />
                                </div>
                                <div className={`relative z-10 space-y-8 ${isRTL ? 'text-right' : 'text-left'}`}>
                                    <div className="w-20 h-20 bg-white/10 text-white rounded-[24px] flex items-center justify-center backdrop-blur-md shadow-2xl group-hover:scale-110 transition-transform duration-500">
                                        <BookOpen className="w-10 h-10" />
                                    </div>
                                    <h3 className="text-4xl font-black text-white tracking-tight">{visionTitle}</h3>
                                    <p className="text-blue-100 text-xl leading-relaxed font-medium">
                                        {visionDesc}
                                    </p>
                                </div>
                            </div>
                        </ScrollReveal>

                    </div>
                </div>

                {/* Core Values Redesign */}
                <div className="bg-[#fafcff] py-24 md:py-40 border-y border-slate-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <ScrollReveal>
                            <div className="text-center max-w-2xl mx-auto mb-20 space-y-6">
                                <div className="inline-block px-4 py-1 bg-red-50 text-red-600 rounded-lg text-[10px] font-black uppercase tracking-widest">{t.principlesBadge}</div>
                                <h2 className="text-4xl md:text-5xl font-black text-slate-900">{t.valuesTitle}</h2>
                                <div className="w-20 h-1.5 bg-red-600 rounded-full mx-auto"></div>
                            </div>
                        </ScrollReveal>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {values.map((v: any, index: number) => {
                                const Icon = valIcons[index];
                                return (
                                    <ScrollReveal key={index} delay={index * 0.1} direction="up" className="h-full">
                                        <div className="bg-white p-10 rounded-[32px] shadow-[0_4px_25px_rgb(0,0,0,0.02)] hover:shadow-[0_15px_45px_rgb(0,0,0,0.08)] transition-all duration-500 border border-slate-100/60 group text-center h-full flex flex-col items-center hover:-translate-y-3">
                                            <div className={`w-24 h-24 rounded-[28px] ${valueBg[index]} ${valueColors[index]} flex items-center justify-center mb-10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                                                <Icon className="w-12 h-12" />
                                            </div>
                                            <h4 className="text-[22px] font-bold text-slate-900 mb-5 leading-tight">{v.title}</h4>
                                            <p className="text-slate-500 leading-relaxed text-sm font-medium">
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
