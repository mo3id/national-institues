import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useSiteData } from '@/context/DataContext';
import NISLogo from '@/components/common/NISLogo';
import Hero from '@/components/features/Hero';
import ChairmanVision from '@/components/features/ChairmanVision';
import GalleryMosaic from '@/components/features/GalleryMosaic';
import StatsSection from '@/components/features/StatsSection';
import PageTransition from '@/components/common/PageTransition';
import ScrollReveal from '@/components/common/ScrollReveal';
import { useNewsCarousel } from '@/hooks/useNewsCarousel';

const Home: React.FC = () => {
  const { t, isRTL, lang } = useLanguage();
  const { data: siteData } = useSiteData();
  const NEWS_DATA = (siteData.news || []).filter(n => n.published !== false);
  const defaultHomeData = {
    trustedTitle: 'Trusted by Generations of',
    trustedTitleAr: 'أجيال تثق في',
    trustedHighlight: 'Egyptian Families',
    trustedHighlightAr: 'العائلات المصرية',
    trustedDesc: 'Providing high-quality national education that builds character and prepares students for a successful future.',
    trustedDescAr: 'تقديم تعليم قومي عالي الجودة يبني الشخصية ويعد الطلاب لمستقبل ناجح.',
    trustedCTA: 'Discover Our Schools',
    trustedCTAAr: 'اكتشف مدارسنا',
    gatewayTitle: 'Your Gateway to',
    gatewayTitleAr: 'بوابتك إلى',
    gatewayHighlight: 'Educational Excellence',
    gatewayHighlightAr: 'التميز التعليمي',
    gatewayDesc: 'Join thousands of students across Egypt in our network of specialized national institutes.',
    gatewayDescAr: 'انضم إلى آلاف الطلاب في جميع أنحاء مصر في شبكة معاهدنا القومية المتخصصة.',
    gatewayCTA: 'View Schools',
    gatewayCTAAr: 'عرض المدارس',
    mapImage: '/nano-banana-17717977008341.png',
    ctaTitle: 'Join the NIS Family Today',
    ctaTitleAr: 'انضم لعائلة المعاهد القومية اليوم',
    ctaDesc: 'Become part of Egypt\'s leading educational network and shape your child\'s future.',
    ctaDescAr: 'كن جزءاً من شبكة التعليم الرائدة في مصر وشكل مستقبل طفلك.',
    ctaButton: 'Register Interest',
    ctaButtonAr: 'سجل اهتمامك'
  };

  const h = { ...defaultHomeData, ...(siteData.homeData || {}) };

  // Get all school logos that exist
  const schoolLogos = (siteData.schools || [])
    .filter(s => s.logo)
    .map(s => ({ id: s.id, name: s.name, logo: s.logo }));

  // Chunk logos into arrays of 12
  const chunkSize = 12;
  const logoChunks = [];
  for (let i = 0; i < schoolLogos.length; i += chunkSize) {
    logoChunks.push(schoolLogos.slice(i, i + chunkSize));
  }

  const [activeChunk, setActiveChunk] = useState(0);

  useEffect(() => {
    if (logoChunks.length <= 1) return;
    const interval = setInterval(() => {
      setActiveChunk((prev) => (prev + 1) % logoChunks.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [logoChunks.length]);


  const {
    index: newsIndex,
    itemsPerPage,
    maxIndex: maxNewsIndex,
    next: nextNews,
    prev: prevNews,
    goTo: setNewsIndex
  } = useNewsCarousel(NEWS_DATA.length);

  return (
    <PageTransition>
      <div className="overflow-x-hidden">
        <Hero />
        <ChairmanVision />

        {/* Schools Section */}
        <section className="pt-24 pb-24 bg-white overflow-hidden w-full">
          <div className="w-[90%] lg:w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
              <div className="w-full lg:w-5/12 flex flex-col items-start text-start space-y-6">
                <ScrollReveal>
                  <h2 className="text-3xl md:text-5xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-light text-slate-800 leading-[1.3] lg:leading-[1.2]">
                    {lang === 'ar' ? h.trustedTitleAr : h.trustedTitle} <br />
                    <span className="font-bold text-[#1e3a8a] tracking-tight">{lang === 'ar' ? h.trustedHighlightAr : h.trustedHighlight}</span>
                  </h2>
                </ScrollReveal>

                <ScrollReveal delay={0.1}>
                  <p className="text-slate-500 text-lg leading-relaxed max-w-md">
                    {lang === 'ar' ? h.trustedDescAr : h.trustedDesc}
                  </p>
                </ScrollReveal>

                <ScrollReveal delay={0.2}>
                  <Link to="/schools" className="mt-4 inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-[#5a67d8] text-white font-semibold text-[15px] hover:bg-[#434190] hover:-translate-y-1 transition-all shadow-xl shadow-indigo-500/20">
                    {lang === 'ar' ? h.trustedCTAAr : h.trustedCTA}
                  </Link>
                </ScrollReveal>
              </div>

              <div className="w-full lg:w-7/12 relative">
                <div className="overflow-hidden">
                  <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(${isRTL ? activeChunk * 100 : -activeChunk * 100}%)` }}>
                    {logoChunks.map((chunk, i) => (
                      <div key={`chunk-${i}`} className="w-full flex-shrink-0">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 items-center justify-items-center">
                          {chunk.map((school) => (
                            <div key={school.id} className="flex items-center justify-center cursor-pointer opacity-70 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-300">
                              <img
                                src={school.logo}
                                alt={school.name}
                                className="max-w-[140px] max-h-[70px] object-contain"
                                title={school.name}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {logoChunks.length > 1 && (
                  <div className="flex justify-center gap-3 mt-12">
                    {logoChunks.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveChunk(i)}
                        className={`h-2 rounded-full transition-all duration-300 ${activeChunk === i ? 'w-8 bg-[#1e3a8a]' : 'w-2 bg-slate-200'}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <StatsSection />

        {/* Map Section */}
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="w-[90%] lg:w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center space-y-6 mb-16">
              <ScrollReveal>
                <h2 className="text-3xl md:text-5xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold tracking-tight text-slate-900 leading-[1.3] lg:leading-[1.2]">
                  {lang === 'ar' ? h.gatewayTitleAr : h.gatewayTitle} <br />
                  {lang === 'ar' ? h.gatewayHighlightAr : h.gatewayHighlight}
                </h2>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <p className="text-slate-500 text-lg leading-relaxed max-w-2xl mx-auto">
                  {lang === 'ar' ? h.gatewayDescAr : h.gatewayDesc}
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <Link to="/schools" className="mt-4 inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-[#3b82f6] text-white font-semibold text-[15px] hover:bg-[#2563eb] transition-all shadow-xl shadow-blue-500/20">
                  {lang === 'ar' ? h.gatewayCTAAr : h.gatewayCTA}
                </Link>
              </ScrollReveal>
            </div>

            <ScrollReveal delay={0.3}>
              <div className="w-full flex justify-center mt-8 md:mt-12 overflow-visible md:overflow-visible">
                <img
                  src={h.mapImage}
                  alt="Global Network"
                  className="w-full max-w-6xl h-auto object-contain pointer-events-none mix-blend-multiply transform scale-[1.7] md:scale-100"
                />
              </div>
            </ScrollReveal>
          </div>
        </section>

        <GalleryMosaic />

        {/* Latest News Carousel */}
        <section className="py-24 bg-white overflow-hidden">
          <div className="w-[90%] lg:w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-16">
              <div className="space-y-2">
                <ScrollReveal>
                  <h2 className="text-5xl font-bold text-gray-900 tracking-tight leading-tight">
                    {lang === 'ar' ? 'آخر الأخبار' : 'Latest News'}
                  </h2>
                </ScrollReveal>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={prevNews}
                  disabled={newsIndex === 0}
                  className={`p-3 border transition-all ${newsIndex === 0 ? 'border-gray-100 text-gray-300 cursor-not-allowed' : 'border-gray-200 text-gray-900 hover:bg-gray-50 active:scale-95'}`}
                >
                  <ChevronLeft className={`h-5 w-5 ${isRTL ? 'rotate-180' : ''}`} />
                </button>
                <button
                  onClick={nextNews}
                  disabled={newsIndex >= maxNewsIndex}
                  className={`p-3 bg-gray-900 text-white transition-all ${newsIndex >= maxNewsIndex ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800 active:scale-95'}`}
                >
                  <ChevronRight className={`h-5 w-5 ${isRTL ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="overflow-hidden -mx-4">
                <div
                  className="flex transition-transform duration-700 ease-in-out"
                  style={{ transform: `translateX(${isRTL ? newsIndex * (100 / itemsPerPage) : -newsIndex * (100 / itemsPerPage)}%)` }}
                >
                  {NEWS_DATA.map((item) => (
                    <div key={item.id} className={`${itemsPerPage === 1 ? 'w-full' : itemsPerPage === 2 ? 'w-1/2' : 'w-1/3'} flex-shrink-0 px-4 mb-8`}>
                      <Link to={`/news/${item.id}`} className="block bg-white group flex flex-col h-full text-start p-2 transition-all duration-500 rounded-xl hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/5 pb-4">
                        <div className="relative aspect-[4/3] overflow-hidden mb-6 rounded-lg">
                          <img
                            src={item.image}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            alt={item.title}
                            loading="lazy"
                          />
                        </div>
                        <div className="space-y-3 flex-grow flex flex-col">
                          <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                            {lang === 'ar' ? 'تحديث' : 'Update'}
                          </span>
                          <h3 className="text-lg font-bold text-gray-900 leading-snug transition-colors line-clamp-2">
                            {lang === 'ar' ? item.titleAr : item.title}
                          </h3>
                          <span className="mt-auto inline-flex items-center w-fit px-5 py-2.5 bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold transition-all duration-300 group-hover:bg-[#1e3a8a] group-hover:text-white">
                            <span className="pb-0.5">
                              {lang === 'ar' ? 'اقرأ المزيد' : 'Read More'}
                            </span>
                            <ArrowRight className={`ml-1 h-4 w-4 transition-transform ${isRTL ? 'rotate-180 ml-0 mr-1 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
                          </span>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center gap-2 mt-12">
                {Array.from({ length: maxNewsIndex + 1 }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setNewsIndex(i)}
                    className={`h-1.5 transition-all duration-300 rounded-full ${newsIndex === i ? 'w-6 bg-gray-900' : 'w-1.5 bg-gray-200'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Premium CTA Section */}
        <section className="py-24 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <ScrollReveal>
              <div className="bg-[#0f172a] rounded-[3rem] p-12 md:p-20 flex flex-col items-center text-center shadow-[0_0_100px_rgba(30,64,175,0.3)] relative overflow-hidden border border-white/5">
                <div className="mb-8 relative z-10">
                  <div className="bg-white p-4 rounded-2xl inline-block">
                    <NISLogo className="h-12 w-12" showText={false} />
                  </div>
                </div>

                <div className="max-w-2xl space-y-6 relative z-10" id="join-us">
                  <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight">
                    {lang === 'ar' ? h.ctaTitleAr : h.ctaTitle}
                  </h2>
                  <p className="text-blue-100/80 text-lg md:text-xl leading-relaxed">
                    {lang === 'ar' ? h.ctaDescAr : h.ctaDesc}
                  </p>

                  <div className="pt-8">
                    <Link to="/contact" className="inline-block bg-white hover:bg-blue-50 text-blue-900 font-bold rounded-full px-12 py-5 transition-all transform hover:scale-105 shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:shadow-white/20 active:scale-95">
                      {lang === 'ar' ? h.ctaButtonAr : h.ctaButton}
                    </Link>
                  </div>
                </div>

                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <div className="absolute inset-0 bg-[#0f172a]" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1e40af_0%,transparent_70%)] opacity-50" />
                  <div
                    className="absolute inset-0 opacity-[0.15]"
                    style={{
                      backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
                      backgroundSize: '40px 40px',
                      maskImage: 'radial-gradient(circle at 50% 50%, black, transparent 80%)',
                      WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black, transparent 80%)'
                    }}
                  />
                  <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px]" />
                  <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px]" />
                  <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default Home;
