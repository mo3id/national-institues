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
        <section className="py-24 bg-white overflow-hidden w-full">
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

        {/* Gallery Section */}
        <section className="py-24 bg-white overflow-hidden">
          <div className="w-[90%] lg:w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center mb-16 space-y-4">
              <ScrollReveal>
                <div className={`inline-flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} text-[#991b1b] font-bold text-xs uppercase tracking-[0.3em]`}>
                  <Camera className="h-4 w-4" />
                  <span>{lang === 'ar' ? 'التجربة البصرية' : 'The Visual Experience'}</span>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={0.1}>
                <h2 className="text-4xl lg:text-5xl font-bold text-[#1e3a8a]">{lang === 'ar' ? 'الحياة في المعاهد' : 'Life in Institutes'}</h2>
              </ScrollReveal>
              <ScrollReveal delay={0.2}>
                <p className="text-slate-500 text-lg max-w-2xl">{lang === 'ar' ? 'توثيق لحظات التميز والإبداع والبهجة عبر جميع فروعنا.' : 'Documenting moments of excellence, creativity, and joy across all our branches.'}</p>
              </ScrollReveal>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
              {/* Column 1 */}
              <ScrollReveal delay={0.1}>
                <div className="flex flex-col h-full">
                  <img
                    src="https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=600"
                    alt="Campus"
                    className="w-full h-full min-h-[400px] md:h-[600px] object-cover rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 hover:scale-[1.02]"
                  />
                </div>
              </ScrollReveal>

              {/* Column 2 */}
              <div className="flex flex-col gap-4 lg:gap-6">
                <ScrollReveal delay={0.2} className="h-full">
                  <img
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600"
                    alt="Classroom"
                    className="w-full h-[280px] object-cover rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 hover:scale-[1.02]"
                  />
                </ScrollReveal>
                <ScrollReveal delay={0.3} className="h-full">
                  <img
                    src="https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=600"
                    alt="Library"
                    className="w-full h-[300px] object-cover rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 hover:scale-[1.02]"
                  />
                </ScrollReveal>
              </div>

              {/* Column 3 */}
              <div className="flex flex-col gap-4 lg:gap-6">
                <ScrollReveal delay={0.4} className="h-full">
                  <img
                    src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600"
                    alt="Hallway"
                    className="w-full h-[340px] object-cover rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 hover:scale-[1.02]"
                  />
                </ScrollReveal>
                <ScrollReveal delay={0.5} className="h-full">
                  <img
                    src="https://images.unsplash.com/photo-1531685250784-afb5c542247b?auto=format&fit=crop&w=600"
                    alt="Lab"
                    className="w-full h-[240px] object-cover rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 hover:scale-[1.02]"
                  />
                </ScrollReveal>
              </div>
            </div>

          </div>
        </section>

        {/* Latest News Carousel */}
        <section className="py-24 bg-gray-50 overflow-hidden">
          <div className="w-[90%] lg:w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 space-y-8 md:space-y-0">
              <div className={`space-y-4 ${isRTL ? 'text-start' : 'text-start'} w-full md:w-auto`}>
                <ScrollReveal>
                  <div className={`inline-flex items-center gap-2 text-red-700 font-bold text-xs uppercase tracking-[0.3em] ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="w-10 h-[2px] bg-red-700" />
                    <span>{t.news.tag}</span>
                  </div>
                </ScrollReveal>
                <ScrollReveal delay={0.1}>
                  <h2 className="text-4xl font-bold text-gray-900">{t.news.title}</h2>
                </ScrollReveal>
                <ScrollReveal delay={0.2}>
                  <p className="text-gray-500 text-lg">{t.news.desc}</p>
                </ScrollReveal>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={prevNews}
                  disabled={newsIndex === 0}
                  className={`p-4 rounded-full border border-gray-200 transition-all ${newsIndex === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-blue-900 hover:shadow-lg active:scale-95'}`}
                >
                  <ChevronLeft className={`h-6 w-6 ${isRTL ? 'rotate-180' : ''}`} />
                </button>
                <button
                  onClick={nextNews}
                  disabled={newsIndex >= maxNewsIndex}
                  className={`p-4 rounded-full border border-gray-200 transition-all ${newsIndex >= maxNewsIndex ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-blue-900 hover:shadow-lg active:scale-95'}`}
                >
                  <ChevronRight className={`h-6 w-6 ${isRTL ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>
            <div className="relative overflow-hidden">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(${isRTL ? newsIndex * (100 / itemsPerPage) : -newsIndex * (100 / itemsPerPage)}%)` }}
              >
                {NEWS.map((item) => (
                  <div key={item.id} className={`${itemsPerPage === 1 ? 'w-full' : itemsPerPage === 2 ? 'w-1/2' : 'w-1/3'} flex-shrink-0 px-4`}>
                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group border border-gray-100 flex flex-col h-full text-start">
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={item.image}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          alt={item.title}
                          loading="lazy"
                        />
                        <div className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'} bg-red-700 text-white px-4 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest shadow-lg`}>
                          {item.date}
                        </div>
                      </div>
                      <div className="p-8 space-y-4 flex-grow flex flex-col">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-700 transition-colors line-clamp-2 min-h-[3.5rem] leading-snug">
                          {lang === 'ar' ? item.titleAr : item.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-6">
                          {lang === 'ar' ? item.summaryAr : item.summary}
                        </p>
                        <Link to={`/news/${item.id}`} className={`mt-auto text-blue-900 font-bold text-xs uppercase tracking-widest flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} pt-4 group-hover:translate-x-1 transition-transform`}>
                          <span>{t.news.readMore}</span>
                          <ArrowRight className={`h-4 w-4 text-red-600 ${isRTL ? 'rotate-180' : ''}`} />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Premium Newsletter CTA Section */}
        <section className="py-24 bg-white overflow-hidden">
          <div className="w-[90%] lg:w-[80%] mx-auto relative">
            <ScrollReveal>
              <div className="bg-[#1e3a8a] rounded-[2.5rem] p-10 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24 shadow-2xl relative overflow-hidden">

                {/* Subtle Background Pattern */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <svg className="h-full w-full" fill="currentColor">
                    <pattern id="pattern-circles" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                      <circle cx="20" cy="20" r="1.5"></circle>
                    </pattern>
                    <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)"></rect>
                  </svg>
                </div>

                {/* Left side: Heading and Description */}
                <div className="w-full lg:w-[55%] text-start relative z-10 space-y-6">
                  <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight">
                    {lang === 'ar' ? 'اشترك في النشرة الإخبارية' : 'Subscribe our newsletter'}
                  </h2>
                  <p className="text-blue-100/70 text-sm md:text-base leading-relaxed max-w-lg">
                    {lang === 'ar'
                      ? 'اشترك في نشرتنا الإخبارية وكن أول من يحصل على الرؤى والتحديثات ونصائح الخبراء في مجال التطوير التعليمي وإدارة المدارس.'
                      : 'Subscribe to our newsletter and be the first to receive insights, updates, and expert tips on educational development and school management.'}
                  </p>
                </div>

                {/* Right side: Input and Button */}
                <div className="w-full lg:w-[45%] text-start relative z-10">
                  <div className="w-full space-y-4">
                    <label className="text-blue-200 text-sm font-medium block">
                      {lang === 'ar' ? 'ابق على اطلاع' : 'Stay up to date'}
                    </label>
                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                      <input
                        type="email"
                        placeholder={lang === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                        className={`flex-grow min-w-0 bg-[#162a63] text-white placeholder-blue-300 border border-transparent focus:border-blue-400 rounded-full px-6 py-4 focus:outline-none transition-all ${isRTL ? 'text-right' : 'text-left'}`}
                      />
                      <button className="bg-[#fbbf24] hover:bg-[#f59e0b] text-[#1e3a8a] font-bold rounded-full px-8 py-4 transition-colors whitespace-nowrap shadow-lg flex-shrink-0">
                        {lang === 'ar' ? 'اشتراك' : 'Subscribe'}
                      </button>
                    </div>
                    <p className="text-blue-300/60 text-xs mt-2">
                      {lang === 'ar' ? 'باشتراكك، فإنك توافق على ' : 'By subscribing you agree to our '}
                      <Link to="/" className="underline hover:text-white transition-colors">
                        {lang === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
                      </Link>
                    </p>
                  </div>
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

