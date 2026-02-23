import React, { useState, useMemo, useEffect } from 'react';
import {
  Users,
  GraduationCap,
  MapPin,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Star,
  Camera,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import { SCHOOLS, GOVERNORATES, NEWS } from '../constants';
import NISLogo from '../components/NISLogo';
import Hero from '../components/Hero';
import ChairmanVision from '../components/ChairmanVision';
import GalleryMosaic from '../components/GalleryMosaic';
import StatsSection from '../components/StatsSection';
import PageTransition from '../components/PageTransition';
import ScrollReveal from '../components/ScrollReveal';

const Home: React.FC = () => {
  const { t, isRTL, lang } = useLanguage();
  const [newsIndex, setNewsIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const maxNewsIndex = Math.max(0, NEWS.length - itemsPerPage);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setItemsPerPage(1);
      else if (window.innerWidth < 1024) setItemsPerPage(2);
      else setItemsPerPage(3);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextNews = () => setNewsIndex(prev => Math.min(prev + 1, maxNewsIndex));
  const prevNews = () => setNewsIndex(prev => Math.max(prev - 1, 0));

  const galleryImages = [
    { url: 'https://picsum.photos/seed/n1/800/800', size: 'md:col-span-2 md:row-span-2' },
    { url: 'https://picsum.photos/seed/n2/800/800', size: '' },
    { url: 'https://picsum.photos/seed/n3/800/800', size: '' },
    { url: 'https://picsum.photos/seed/n4/400/800', size: 'md:row-span-2' },
    { url: 'https://picsum.photos/seed/n5/800/400', size: 'md:col-span-2' },
    { url: 'https://picsum.photos/seed/n6/800/800', size: '' },
  ];

  return (
    <PageTransition>
      <div className="overflow-x-hidden">
        {/* Hero Slider */}
        <Hero />

        {/* Chairman Message */}
        <ChairmanVision />

        {/* Schools Section Redesigned */}
        <section className="pt-24 pb-24 bg-white overflow-hidden w-full">
          <div className="w-[90%] lg:w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

              {/* Text Side */}
              <div className="w-full lg:w-5/12 flex flex-col items-start text-start space-y-6">
                <ScrollReveal>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-slate-800 leading-[1.2]">
                    {lang === 'ar' ? 'نحظى بثقة' : 'Trusted by'} <br />
                    <span className="font-bold text-[#1e3a8a] tracking-tight">{lang === 'ar' ? 'أفضل المدارس' : 'great brands'}</span>
                  </h2>
                </ScrollReveal>

                <ScrollReveal delay={0.1}>
                  <p className="text-slate-500 text-lg leading-relaxed max-w-md">
                    {lang === 'ar'
                      ? 'تضم شبكة المعاهد القومية نخبة من المدارس العريقة التي تتشارك نفس الرؤية في تقديم تعليم متميز وبناء أجيال المستقبل.'
                      : 'The full monty the wireless bog-standard bevvy lurgy David, mufty Oxford blatant A bit of how\'s your father.'}
                  </p>
                </ScrollReveal>

                <ScrollReveal delay={0.2}>
                  <Link to="/schools" className="mt-4 inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-[#5a67d8] text-white font-semibold text-[15px] hover:bg-[#434190] hover:-translate-y-1 transition-all shadow-xl shadow-indigo-500/20">
                    {lang === 'ar' ? 'عرض المدارس' : 'More Customers'}
                  </Link>
                </ScrollReveal>
              </div>

              {/* Logos Grid */}
              <div className="w-full lg:w-7/12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 items-center justify-items-center">
                  {[...Array(12)].map((_, i) => (
                    <ScrollReveal key={i} delay={0.05 * (i % 4)}>
                      <div className="flex items-center justify-center cursor-pointer opacity-70 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-300">
                        <img
                          src="/image copy.png"
                          alt={`Partner Brand ${i + 1}`}
                          className="max-w-[180px] max-h-[60px] object-contain"
                        />
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Stats Summary Section */}
        <StatsSection />

        {/* Map Section Redesigned */}
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="w-[90%] lg:w-[80%] mx-auto px-4 sm:px-6 lg:px-8">

            <div className="flex flex-col items-center text-center space-y-6 mb-16">
              <ScrollReveal>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.2]">
                  {lang === 'ar' ? 'بوابتك إلى' : "Your Gateway to Egypt's"} <br />
                  {lang === 'ar' ? 'مستقبل لا نهائي' : 'Endless Inventory'}
                </h2>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <p className="text-slate-500 text-lg leading-relaxed max-w-2xl mx-auto">
                  {lang === 'ar'
                    ? 'شريكك الموثوق في التنقل عبر مشهد التعليم الواسع وتيسير رحلة أبنائك نحو التميز.'
                    : 'Your trusted partner in navigating Egypt\'s vast educational landscape and streamlining your children\'s journey.'}
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <Link to="/schools" className="mt-4 inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-[#3b82f6] text-white font-semibold text-[15px] hover:bg-[#2563eb] transition-all shadow-xl shadow-blue-500/20">
                  {lang === 'ar' ? 'تصفح الخريطة' : 'Get a Quote'}
                </Link>
              </ScrollReveal>
            </div>

            <ScrollReveal delay={0.3}>
              <div className="w-full flex justify-center mt-12">
                <img
                  src="/nano-banana-17717977008341.png"
                  alt="Global Network"
                  className="w-full max-w-6xl h-auto object-contain pointer-events-none mix-blend-multiply"
                />
              </div>
            </ScrollReveal>

          </div>
        </section>

        {/* Mosaic Gallery Section */}
        <GalleryMosaic />

        {/* Latest News Carousel */}
        <section className="py-24 bg-white overflow-hidden">
          <div className="w-[90%] lg:w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-16">
              <div className="space-y-2">
                <ScrollReveal>
                  <h2 className="text-5xl font-bold text-gray-900 tracking-tight leading-tight">
                    {lang === 'ar' ? 'أحدث مدوناتنا' : <>Our Latest<br />Blogs</>}
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
                  {NEWS.map((item) => (
                    <div key={item.id} className={`${itemsPerPage === 1 ? 'w-full' : itemsPerPage === 2 ? 'w-1/2' : 'w-1/3'} flex-shrink-0 px-4 mb-8`}>
                      <div className="bg-white group flex flex-col h-full text-start p-2 transition-all duration-500 rounded-xl">
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
                            {lang === 'ar' ? 'تحديث التعليم' : 'Education Update'}
                          </span>
                          <h3 className="text-lg font-bold text-gray-900 leading-snug group-hover:text-gray-700 transition-colors line-clamp-2">
                            {lang === 'ar' ? item.titleAr : item.title}
                          </h3>
                          <Link to={`/news/${item.id}`} className="mt-4 inline-flex items-center text-sm font-semibold text-gray-900 group/link">
                            <span className="pb-0.5">
                              {lang === 'ar' ? 'اقرأ المدونة' : 'Read Blog'}
                            </span>
                            <ArrowRight className={`ml-1 h-4 w-4 transition-transform group-hover/link:translate-x-1 ${isRTL ? 'rotate-180 ml-0 mr-1 group-hover/link:-translate-x-1' : ''}`} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pagination Dots */}
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
                {/* Logo Icon */}
                <div className="mb-8">
                  <div className="bg-white p-4 rounded-2xl">
                    <NISLogo className="h-12 w-12" showText={false} />
                  </div>
                </div>

                {/* Content */}
                <div className="max-w-2xl space-y-6 relative z-10">
                  <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight">
                    {lang === 'ar' ? 'جاهز لتطوير مستقبلك التعليمي؟' : 'Ready to transform your educational future?'}
                  </h2>
                  <p className="text-blue-100/80 text-lg md:text-xl leading-relaxed">
                    {lang === 'ar'
                      ? 'انضم إلى آلاف الطلاب الذين يستفيدون من التميز التعليمي في مدارس المعاهد القومية.'
                      : 'Join thousands of students who are benefiting from educational excellence in National Institutes of Schools.'}
                  </p>
                  
                  <div className="pt-8">
                    <button className="bg-white hover:bg-blue-50 text-blue-900 font-bold rounded-full px-12 py-5 transition-all transform hover:scale-105 shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:shadow-white/20 active:scale-95">
                      {lang === 'ar' ? 'ابدأ الآن مجاناً' : 'Start for free'}
                    </button>
                  </div>
                </div>

                {/* Modern Spotlight & Masked Grid Effect */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {/* Base Deep Blue */}
                  <div className="absolute inset-0 bg-[#0f172a]" />
                  
                  {/* Radial Spotlight */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1e40af_0%,transparent_70%)] opacity-50" />

                  {/* Masked Grid */}
                  <div 
                    className="absolute inset-0 opacity-[0.15]"
                    style={{
                      backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
                      backgroundSize: '40px 40px',
                      maskImage: 'radial-gradient(circle at 50% 50%, black, transparent 80%)',
                      WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black, transparent 80%)'
                    }}
                  />

                  {/* Floating Gradient Orbs */}
                  <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px]" />
                  <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px]" />

                  {/* Grain Texture */}
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

