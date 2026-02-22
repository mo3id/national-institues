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
  const [selectedGov, setSelectedGov] = useState<string | null>(null);
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

  const filteredSchools = useMemo(() =>
    selectedGov ? SCHOOLS.filter(s => s.governorate === selectedGov) : [],
    [selectedGov]
  );

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

        {/* Interactive Map & Stats */}
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="w-[90%] lg:w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-12">
                <ScrollReveal>
                  <div className="space-y-4 text-start">
                    <h2 className="text-4xl font-bold tracking-tight">{t.stats.title}</h2>
                    <p className="text-gray-600 text-lg leading-relaxed">{t.stats.desc}</p>
                  </div>
                </ScrollReveal>

                <div className="grid grid-cols-2 gap-6 text-start">
                  {[
                    { label: t.stats.schools, value: '42', icon: NISLogo, color: 'blue' },
                    { label: t.stats.students, value: '120k', icon: Users, color: 'green' },
                    { label: t.stats.teachers, value: '8,500', icon: GraduationCap, color: 'purple' },
                    { label: t.stats.governorates, value: '5', icon: MapPin, color: 'red' },
                  ].map((stat, i) => (
                    <ScrollReveal key={i} delay={i * 0.1}>
                      <div className="bg-gray-50/50 p-8 rounded-2xl border border-gray-100 hover:shadow-xl hover:bg-white transition-all group text-start">
                        <div className={`bg-${stat.color}-100 w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                          {stat.icon === NISLogo ? <stat.icon className="h-8 w-8" showText={false} /> : <stat.icon className={`text-${stat.color}-600 h-6 w-6`} />}
                        </div>
                        <p className="text-4xl font-black text-gray-900 mb-1">{stat.value}</p>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>

              <ScrollReveal direction={isRTL ? "right" : "left"}>
                <div className="relative bg-blue-900 rounded-3xl p-8 aspect-[4/5] flex flex-col items-center shadow-3xl overflow-hidden">
                  <div className={`flex justify-between w-full mb-8 z-20 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <h3 className="text-white font-bold text-xl">{t.map.title}</h3>
                    <div className="flex space-x-1">
                      {[...Array(3)].map((_, i) => <Star key={i} className="h-3 w-3 text-red-500 fill-red-500" />)}
                    </div>
                  </div>

                  {/* Egypt Map SVG - Improved Geographic Accuracy */}
                  <div className="relative w-full flex-grow flex items-center justify-center p-4">
                    <svg viewBox="0 0 500 500" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                      <path
                        d="M 4,45 L 141,70 L 204,60 Q 254,30 304,60 L 383,60 L 412,145 L 383,235 L 312,125 L 366,260 L 412,365 L 483,510 L 0,520 L 0,45 Z"
                        className="fill-blue-800/70 stroke-blue-500/60 stroke-[1.5]"
                      />
                      <path
                        d="M 312,125 L 383,235 L 412,145 L 383,60 L 304,60 Z"
                        className="fill-blue-800/80 stroke-blue-500/80 stroke-[1.5]"
                      />
                      {GOVERNORATES.map((gov, i) => {
                        const pins = [{ cx: 215, cy: 110 }, { cx: 125, cy: 75 }, { cx: 200, cy: 125 }, { cx: 275, cy: 85 }, { cx: 225, cy: 85 }];
                        const pin = pins[i] || { cx: 250, cy: 250 };
                        return (
                          <g key={i} className="cursor-pointer group/pin" onClick={() => setSelectedGov(gov.name)}>
                            <circle cx={pin.cx} cy={pin.cy} r="25" className={`transition-all duration-300 fill-red-500/10 ${selectedGov === gov.name ? 'opacity-100' : 'opacity-0 group-hover/pin:opacity-100'}`} />
                            <circle cx={pin.cx} cy={pin.cy} r="8" className={`transition-all duration-300 stroke-white stroke-2 ${selectedGov === gov.name ? 'fill-red-500 scale-125' : 'fill-blue-400 group-hover/pin:fill-red-400 animate-pulse'}`} />
                            <text x={pin.cx} y={pin.cy + 25} textAnchor="middle" fontSize="10" fontWeight="bold" className="fill-white/80 pointer-events-none uppercase tracking-wide">{gov.name}</text>
                          </g>
                        );
                      })}
                    </svg>

                    {selectedGov && (
                      <div className="absolute inset-0 bg-blue-950/95 z-30 flex flex-col p-8 animate-fade-in backdrop-blur-sm shadow-2xl rounded-2xl">
                        <div className={`flex justify-between items-center mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <div className="text-start">
                            <h4 className="text-white text-2xl font-bold">{t.map.schoolsIn} {selectedGov}</h4>
                            <p className="text-red-400 text-xs font-bold tracking-widest uppercase mt-1">{t.map.network}</p>
                          </div>
                          <button onClick={() => setSelectedGov(null)} className="p-2 text-white hover:bg-white/10 rounded-full transition-colors">
                            <X className="h-6 w-6" />
                          </button>
                        </div>
                        <div className="flex-grow overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                          {filteredSchools.length > 0 ? (
                            filteredSchools.map(school => (
                              <div key={school.id} className="bg-white/10 border border-white/10 p-4 rounded-xl hover:bg-white/20 transition-all group text-start">
                                <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
                                  <img src={school.logo} alt="" className="w-12 h-12 rounded-lg bg-white/10 p-1 grayscale group-hover:grayscale-0" loading="lazy" />
                                  <div className="flex-grow">
                                    <h5 className="text-white font-bold">{school.name}</h5>
                                    <p className={`text-white/60 text-xs flex items-center ${isRTL ? 'space-x-reverse space-x-1' : 'space-x-1'}`}>
                                      <MapPin className="h-3 w-3" />
                                      <span>{school.location}</span>
                                    </p>
                                  </div>
                                  <Link to={`/schools`} className="p-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors">
                                    <ArrowRight className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
                                  </Link>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-white/40 text-center py-20 italic">{t.map.noSchools}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mt-8 text-center z-20">
                    <p className="text-white/60 text-xs font-medium uppercase tracking-[0.2em]">{t.map.instruction}</p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="py-24 bg-white overflow-hidden">
          <div className="w-[90%] lg:w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center mb-16 space-y-4">
              <ScrollReveal>
                <div className={`inline-flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} text-red-700 font-bold text-xs uppercase tracking-[0.3em]`}>
                  <Camera className="h-4 w-4" />
                  <span>{t.gallery.tag}</span>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={0.1}>
                <h2 className="text-4xl font-bold text-gray-900">{t.gallery.title}</h2>
              </ScrollReveal>
              <ScrollReveal delay={0.2}>
                <p className="text-gray-500 text-lg max-w-2xl">{t.gallery.desc}</p>
              </ScrollReveal>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:auto-rows-[250px]">
              {galleryImages.map((img, i) => (
                <ScrollReveal key={i} delay={i * 0.1}>
                  <div className={`relative overflow-hidden rounded-3xl group ${img.size}`}>
                    <img
                      src={img.url}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                      alt={`Gallery ${i}`}
                      loading="lazy"
                    />
                  </div>
                </ScrollReveal>
              ))}
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

        {/* Join the Legacy CTA */}
        <section className="py-20 bg-blue-900 relative overflow-hidden">
          <ScrollReveal>
            <div className="absolute inset-0 bg-red-900/10 skew-y-3 transform translate-y-12" />
            <div className="w-[90%] lg:w-[80%] mx-auto text-center relative z-10 px-4 space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">{t.cta.title}</h2>
              <p className="text-xl text-blue-100/80">{t.cta.desc}</p>
              <div className={`flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 ${isRTL ? 'sm:space-x-reverse sm:space-x-6' : 'sm:space-x-6'}`}>
                <Link to="/schools" className="bg-white text-blue-900 px-10 py-4 rounded-full font-bold shadow-2xl hover:bg-gray-100 transition-all">
                  {t.cta.btnSchools}
                </Link>
                <Link to="/careers" className="bg-red-700 text-white px-10 py-4 rounded-full font-bold shadow-2xl hover:bg-red-800 transition-all">
                  {t.cta.btnCareers}
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </section>
      </div>
    </PageTransition>
  );
};

export default Home;
