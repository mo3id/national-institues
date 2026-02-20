
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { SCHOOLS, GOVERNORATES, NEWS } from '../constants';
import { ArrowRight, MapPin, Users, GraduationCap, ChevronLeft, ChevronRight, Sparkles, Star, X, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import { translations } from '../translations';
import NISLogo from '../components/NISLogo';

const Home: React.FC = () => {
  const { lang, isRTL } = useLanguage();
  const t = translations[lang];

  // Hero Slider State
  const [activeSlide, setActiveSlide] = useState(0);
  const slides = useMemo(() => t.hero.map((slide, i) => ({
    ...slide,
    image: [
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1920&h=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1523050853051-f750b9918a2e?q=80&w=1920&h=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=1920&h=800&auto=format&fit=crop'
    ][i]
  })), [t.hero]);

  // Gallery Data
  const galleryImages = [
    { url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=800&auto=format&fit=crop', size: 'row-span-2 col-span-2' },
    { url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop', size: 'col-span-1' },
    { url: 'https://images.unsplash.com/photo-1491333078588-55b6733c7de1?q=80&w=600&auto=format&fit=crop', size: 'col-span-1' },
    { url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop', size: 'col-span-2' },
    { url: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?q=80&w=600&auto=format&fit=crop', size: 'col-span-1' },
    { url: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=600&auto=format&fit=crop', size: 'col-span-1' },
  ];

  // Map State
  const [selectedGov, setSelectedGov] = useState<string | null>(null);
  const filteredSchools = useMemo(() => 
    selectedGov ? SCHOOLS.filter(s => s.governorate === (lang === 'ar' ? GOVERNORATES.find(g => g.name === selectedGov)?.name : selectedGov)) : []
  , [selectedGov, lang]);

  // News Carousel State
  const [newsIndex, setNewsIndex] = useState(0);
  const itemsPerPage = 3;
  const maxNewsIndex = Math.max(0, NEWS.length - itemsPerPage);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextNews = useCallback(() => setNewsIndex(prev => Math.min(prev + 1, maxNewsIndex)), [maxNewsIndex]);
  const prevNews = useCallback(() => setNewsIndex(prev => Math.max(prev - 1, 0)), []);

  return (
    <div className="flex flex-col">
      {/* Hero Slider */}
      <section className="relative h-[650px] overflow-hidden bg-gray-900">
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${idx === activeSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-110 pointer-events-none'}`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-black/40 to-black/20 z-10" />
            <img 
              src={slide.image} 
              className="w-full h-full object-cover" 
              alt="" 
              loading={idx === 0 ? "eager" : "lazy"} 
            />
            <div className="absolute inset-0 z-20 flex items-center justify-center text-center text-white px-4">
              <div className="max-w-4xl space-y-6">
                <div className="flex justify-center mb-6">
                   <div className="bg-white p-3 rounded-2xl shadow-2xl animate-fade-up">
                     <NISLogo className="h-24 w-24" showText={false} />
                   </div>
                </div>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight animate-fade-up">{slide.title}</h1>
                <p className="text-xl md:text-2xl text-gray-200 animate-fade-up" style={{ animationDelay: '0.2s' }}>{slide.subtitle}</p>
                <div className={`flex justify-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'} pt-6 animate-fade-up`} style={{ animationDelay: '0.4s' }}>
                  <button className="bg-red-700 hover:bg-red-800 text-white px-10 py-4 rounded-full font-bold shadow-xl transition-all transform hover:scale-105 active:scale-95">
                    {slide.cta}
                  </button>
                  <Link to="/ai-studio" className={`bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/30 px-10 py-4 rounded-full font-bold transition-all flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                    <Sparkles className="h-5 w-5" />
                    <span>{t.nav.aiStudio}</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className={`absolute bottom-10 left-0 right-0 z-30 flex justify-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveSlide(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${i === activeSlide ? 'w-12 bg-red-600' : 'w-4 bg-white/40 hover:bg-white/60'}`}
            />
          ))}
        </div>
      </section>

      {/* Chairman's Message */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className={`absolute -top-6 ${isRTL ? '-right-6' : '-left-6'} w-32 h-32 bg-blue-50 rounded-full -z-10`} />
              <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
                 <img 
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&h=600&auto=format&fit=crop" 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" 
                    alt="Chairman" 
                    loading="lazy"
                 />
                 <div className="absolute inset-0 border-[16px] border-white/10" />
              </div>
              <div className={`absolute -bottom-8 ${isRTL ? '-left-8 border-r-8' : '-right-8 border-l-8'} bg-blue-900 text-white p-10 rounded-2xl shadow-2xl max-w-sm border-red-700`}>
                <p className="font-serif italic text-xl leading-relaxed">"{t.chairman.quote}"</p>
                <div className="mt-6 pt-6 border-t border-blue-800/50">
                  <p className="font-bold text-lg">{t.chairman.name}</p>
                  <p className="text-xs text-red-400 font-bold uppercase tracking-widest mt-1">{t.chairman.role}</p>
                </div>
              </div>
            </div>
            <div className={`space-y-10 ${isRTL ? 'pr-0 lg:pr-10' : 'pl-0 lg:pl-10'}`}>
              <div className="inline-block bg-red-50 text-red-700 px-4 py-1 rounded-md text-xs font-bold uppercase tracking-widest border border-red-100">
                {t.chairman.tag}
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight text-start">{t.chairman.title}</h2>
              <p className="text-lg text-gray-600 leading-relaxed text-start">{t.chairman.desc}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-start">
                {t.chairman.points.map((item, i) => (
                  <div key={i} className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'} p-4 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors`}>
                    <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                      <Star className="h-5 w-5 text-blue-900 fill-blue-900" />
                    </div>
                    <span className="font-bold text-gray-800">{item}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-start">
                <button className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} text-blue-900 font-bold hover:translate-x-2 transition-transform py-2 border-b-2 border-transparent hover:border-red-600`}>
                  <span>{t.chairman.more}</span>
                  <ArrowRight className={`h-5 w-5 ${isRTL ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* School Logos Bar */}
      <section className="py-16 bg-gray-50 overflow-hidden border-y border-gray-100">
        <div className={`flex animate-scroll whitespace-nowrap ${isRTL ? 'flex-row-reverse' : ''}`}>
          {useMemo(() => [...SCHOOLS, ...SCHOOLS, ...SCHOOLS].map((school, i) => (
            <div key={i} className={`flex flex-col items-center mx-16 opacity-40 hover:opacity-100 transition-opacity`}>
              <div className="h-20 w-20 bg-white rounded-2xl shadow-sm flex items-center justify-center p-3 mb-4 group cursor-pointer border border-transparent hover:border-red-200">
                <img 
                  src={school.logo} 
                  alt={school.name} 
                  className="max-h-full max-w-full grayscale group-hover:grayscale-0 transition-all" 
                  loading="lazy"
                />
              </div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{school.name}</span>
            </div>
          )), [])}
        </div>
      </section>

      {/* Interactive Map & Stats */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12">
              <div className="space-y-4 text-start">
                <h2 className="text-4xl font-bold tracking-tight">{t.stats.title}</h2>
                <p className="text-gray-600 text-lg leading-relaxed">{t.stats.desc}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-6 text-start">
                {[
                  { label: t.stats.schools, value: '42', icon: NISLogo, color: 'blue' },
                  { label: t.stats.students, value: '120k', icon: Users, color: 'green' },
                  { label: t.stats.teachers, value: '8,500', icon: GraduationCap, color: 'purple' },
                  { label: t.stats.governorates, value: '5', icon: MapPin, color: 'red' },
                ].map((stat, i) => (
                  <div key={i} className="bg-gray-50/50 p-8 rounded-2xl border border-gray-100 hover:shadow-xl hover:bg-white transition-all group text-start">
                    <div className={`bg-${stat.color}-100 w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      {stat.icon === NISLogo ? <stat.icon className="h-8 w-8" showText={false} /> : <stat.icon className={`text-${stat.color}-600 h-6 w-6`} />}
                    </div>
                    <p className="text-4xl font-black text-gray-900 mb-1">{stat.value}</p>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative bg-blue-900 rounded-3xl p-8 aspect-[4/5] flex flex-col items-center shadow-3xl overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />
              
              <div className={`flex justify-between w-full mb-8 z-20 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <h3 className="text-white font-bold text-xl">{t.map.title}</h3>
                <div className="flex space-x-1">
                  {[...Array(3)].map((_, i) => <Star key={i} className="h-3 w-3 text-red-500 fill-red-500" />)}
                </div>
              </div>

              {/* Enhanced Egypt Map SVG */}
              <div className="relative w-full flex-grow flex items-center justify-center">
                <svg viewBox="0 0 500 600" className="w-full h-full text-blue-400/20 fill-current">
                  <path 
                    d="M100,50 L400,50 L420,100 L430,200 L480,450 L450,550 L50,550 L70,400 L90,150 Z" 
                    className="fill-blue-800/60 stroke-blue-700 stroke-2"
                  />
                  {GOVERNORATES.map((gov, i) => (
                    <g key={i} className="cursor-pointer group/pin" onClick={() => setSelectedGov(gov.name)}>
                      <circle 
                        cx={140 + (i * 50)} 
                        cy={100 + (i * 90)} 
                        r="8" 
                        className={`transition-all duration-300 ${selectedGov === gov.name ? 'fill-red-500 r-12 scale-125' : 'fill-white animate-pulse group-hover/pin:fill-red-400'}`} 
                      />
                      <circle 
                        cx={140 + (i * 50)} 
                        cy={100 + (i * 90)} 
                        r="18" 
                        className={`transition-opacity duration-300 fill-red-500/20 ${selectedGov === gov.name ? 'opacity-100' : 'opacity-0 group-hover/pin:opacity-100'}`} 
                      />
                      <text 
                        x={140 + (i * 50)} 
                        y={130 + (i * 90)} 
                        textAnchor="middle" 
                        className="fill-white text-[12px] font-bold uppercase tracking-widest pointer-events-none"
                      >
                        {gov.name}
                      </text>
                    </g>
                  ))}
                </svg>

                {/* Schools List Overlay when selected */}
                {selectedGov && (
                  <div className="absolute inset-0 bg-blue-950/95 z-30 flex flex-col p-8 animate-fade-in backdrop-blur-sm">
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
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className={`flex flex-col items-center text-center mb-16 space-y-4`}>
              <div className={`inline-flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} text-red-700 font-bold text-xs uppercase tracking-[0.3em]`}>
                <Camera className="h-4 w-4" />
                <span>{t.gallery.tag}</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900">{t.gallery.title}</h2>
              <p className="text-gray-500 text-lg max-w-2xl">{t.gallery.desc}</p>
           </div>
           
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:auto-rows-[250px]">
              {galleryImages.map((img, i) => (
                <div key={i} className={`relative overflow-hidden rounded-3xl group ${img.size}`}>
                  <img 
                    src={img.url} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                    alt={`Gallery ${i}`}
                    loading="lazy" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <div className="bg-white/20 backdrop-blur-md p-2 rounded-full">
                       <Sparkles className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Latest News Carousel */}
      <section className="py-24 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex flex-col md:flex-row justify-between items-end mb-16 space-y-8 md:space-y-0 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
            <div className={`space-y-4 text-start w-full md:w-auto`}>
              <div className={`inline-flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} text-red-700 font-bold text-xs uppercase tracking-[0.3em]`}>
                <div className="w-10 h-[2px] bg-red-700" />
                <span>{t.news.tag}</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900">{t.news.title}</h2>
              <p className="text-gray-500 text-lg">{t.news.desc}</p>
            </div>
            <div className={`flex ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
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

          <div className="relative">
            <div 
              className={`flex transition-transform duration-700 ease-in-out ${isRTL ? 'flex-row-reverse' : ''}`} 
              style={{ transform: `translateX(${isRTL ? '' : '-'}${newsIndex * (100 / itemsPerPage)}%)` }}
            >
              {NEWS.map((item) => (
                <div key={item.id} className="w-full md:w-1/3 flex-shrink-0 px-4">
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
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-700 transition-colors line-clamp-2 min-h-[3.5rem] leading-snug text-start">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-6 text-start">
                        {item.summary}
                      </p>
                      <button className={`mt-auto text-blue-900 font-bold text-xs uppercase tracking-widest flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} pt-4 group-hover:translate-x-1 transition-transform`}>
                        <span>{t.news.readMore}</span>
                        <ArrowRight className={`h-4 w-4 text-red-600 ${isRTL ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Join the Legacy CTA */}
      <section className="py-20 bg-blue-900 relative">
        <div className="absolute inset-0 bg-red-900/10 skew-y-3 transform translate-y-12" />
        <div className="max-w-4xl mx-auto text-center relative z-10 px-4 space-y-8">
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
      </section>
    </div>
  );
};

export default Home;
