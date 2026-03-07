
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSiteData } from '@/context/DataContext';
import { ArrowLeft, MapPin, Phone, Mail, Globe, User, X, ChevronLeft, ChevronRight, Maximize2, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import PageTransition from '@/components/common/PageTransition';
import ScrollReveal from '@/components/common/ScrollReveal';

const SchoolProfile: React.FC = () => {
  const { id } = useParams();
  const { isRTL, t, lang } = useLanguage();
  const { data: siteData } = useSiteData();
  const school = (siteData.schools || []).find(s => (s as any).id === id);

  const name = lang === 'ar' ? (school?.nameAr || school?.name || '') : (school?.name || '');
  const gov = lang === 'ar' ? (school?.governorateAr || school?.governorate || '') : (school?.governorate || '');
  const loc = lang === 'ar' ? (school?.locationAr || school?.location || '') : (school?.location || '');
  const principalName = lang === 'ar' ? (school?.principalAr || school?.principal || '') : (school?.principal || '');

  const [selectedImageIndex, setSelectedImageIndex] = React.useState<number | null>(null);
  const [direction, setDirection] = React.useState(0);

  const gallery = React.useMemo(() => {
    return (school?.gallery || []).filter(Boolean);
  }, [school?.gallery]);

  // Handle Keyboard Navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;
      if (e.key === 'Escape') setSelectedImageIndex(null);
      if (e.key === 'ArrowRight') navigateGallery(isRTL ? -1 : 1);
      if (e.key === 'ArrowLeft') navigateGallery(isRTL ? 1 : -1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex, isRTL, gallery.length]);

  const navigateGallery = (newDirection: number) => {
    if (selectedImageIndex === null) return;
    setDirection(newDirection);
    const newIndex = (selectedImageIndex + newDirection + gallery.length) % gallery.length;
    setSelectedImageIndex(newIndex);
  };

  // SEO: Update Meta Tags
  React.useEffect(() => {
    if (school) {
      const pageTitle = `${name} | ${gov} | NIS`;
      const pageDesc = `${name} - ${gov}, ${loc}. ${t.schools.principal}: ${principalName}`;

      document.title = pageTitle;

      // Update meta description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', pageDesc);
      } else {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        metaDesc.setAttribute('content', pageDesc);
        document.head.appendChild(metaDesc);
      }

      return () => {
        document.title = "National Institutes Schools Portal";
      };
    }
  }, [school, name, gov, loc, principalName, t.schools.principal]);

  if (!school) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <p className="text-gray-600 font-bold uppercase tracking-widest">School not found</p>
    </div>
  );

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 pb-24 text-start">
        {/* Unified Banner with Floating Style */}
        <section className="m-[10px] rounded-[20px] relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0 bg-blue-900">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
              style={{
                backgroundImage: `url('${school?.mainImage || '/layer-1-small.webp'}')`,
                transform: 'scale(1.05)'
              }}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0f1115]/90 via-black/40 to-transparent" />
          </div>

          <div className="max-w-7xl mx-auto px-4 w-full relative z-20 text-center">
            <ScrollReveal direction="up" delay={0.2}>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8 leading-[1.2] text-white drop-shadow-2xl">
                {name}
              </h1>
              <div className="flex items-center justify-center">
                <div className={`flex items-center gap-3 font-semibold text-sm md:text-base tracking-wide bg-white/10 backdrop-blur-xl border border-white/20 text-white px-6 py-3 rounded-full shadow-2xl`}>
                  <MapPin className="w-5 h-5 text-blue-400" />
                  <span>
                    {gov} • {loc}
                  </span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
        <div className="max-w-7xl mx-auto px-4 -mt-12 md:-mt-20 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Sidebar Details */}
            <div className="lg:col-span-1">
              <ScrollReveal direction="right" delay={0.3}>
                <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-gray-100 overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-bl-[5rem] -z-0" />
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-slate-900 mb-8 tracking-tight">{lang === 'ar' ? 'بيانات الاتصال' : 'Contact Info'}</h3>
                    <div className="space-y-8">
                      <div className="flex items-start gap-4 group">
                        <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-[#1e3a8a] group-hover:text-white transition-all duration-300">
                          <MapPin className="w-5 h-5 text-[#1e3a8a] group-hover:text-white transition-colors" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">{lang === 'ar' ? 'العنوان' : 'Address'}</p>
                          <p className="font-semibold text-slate-800 text-sm">{lang === 'ar' ? (school?.addressAr || school?.address || t.common.notAvailable) : (school?.address || t.common.notAvailable)}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 group">
                        <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-[#1e3a8a] group-hover:text-white transition-all duration-300">
                          <Phone className="w-5 h-5 text-[#1e3a8a] group-hover:text-white transition-colors" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">{lang === 'ar' ? 'الهاتف' : 'Phone'}</p>
                          <p className="font-semibold text-slate-800 text-sm">{school?.phone || t.common.notAvailable}</p>
                        </div>
                      </div>
                      {school?.email ? (
                        <a href={`mailto:${school.email}`} className="flex items-start gap-4 group cursor-pointer">
                          <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-[#1e3a8a] group-hover:text-white transition-all duration-300">
                            <Mail className="w-5 h-5 text-[#1e3a8a] group-hover:text-white transition-colors" />
                          </div>
                          <div>
                            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">{lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}</p>
                            <p className="font-semibold text-blue-600 group-hover:text-blue-800 transition-colors text-sm">{school.email}</p>
                          </div>
                        </a>
                      ) : (
                        <div className="flex items-start gap-4 group">
                          <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-[#1e3a8a] group-hover:text-white transition-all duration-300">
                            <Mail className="w-5 h-5 text-[#1e3a8a] group-hover:text-white transition-colors" />
                          </div>
                          <div>
                            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">{lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}</p>
                            <p className="font-semibold text-slate-800 text-sm">{t.common.notAvailable}</p>
                          </div>
                        </div>
                      )}
                      {school?.website ? (
                        <a href={school.website.startsWith('http') ? school.website : `https://${school.website}`} target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 group cursor-pointer">
                          <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-[#1e3a8a] group-hover:text-white transition-all duration-300">
                            <Globe className="w-5 h-5 text-[#1e3a8a] group-hover:text-white transition-colors" />
                          </div>
                          <div>
                            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">{lang === 'ar' ? 'الموقع الإلكتروني' : 'Website'}</p>
                            <p className="font-semibold text-blue-600 group-hover:text-blue-800 transition-colors text-sm truncate max-w-[200px]">{school.website}</p>
                          </div>
                        </a>
                      ) : (
                        <div className="flex items-start gap-4 group">
                          <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-[#1e3a8a] group-hover:text-white transition-all duration-300">
                            <Globe className="w-5 h-5 text-[#1e3a8a] group-hover:text-white transition-colors" />
                          </div>
                          <div>
                            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">{lang === 'ar' ? 'الموقع الإلكتروني' : 'Website'}</p>
                            <p className="font-semibold text-slate-800 text-sm truncate max-w-[200px]">{t.common.notAvailable}</p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-start gap-4 group">
                        <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-[#1e3a8a] group-hover:text-white transition-all duration-300">
                          <User className="w-5 h-5 text-[#1e3a8a] group-hover:text-white transition-colors" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">{t.schools.principal || (lang === 'ar' ? 'المدير' : 'Principal')}</p>
                          <p className="font-semibold text-slate-800 text-sm">{principalName}</p>
                        </div>
                      </div>

                      {/* Application Link */}
                      {/* Application Link */}
                      {school?.applicationLink ? (
                        <a href={school.applicationLink.startsWith('http') ? school.applicationLink : `https://${school.applicationLink}`} target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 group cursor-pointer">
                          <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-[#1e3a8a] group-hover:text-white transition-all duration-300">
                            <ExternalLink className="w-5 h-5 text-[#1e3a8a] group-hover:text-white transition-colors" />
                          </div>
                          <div>
                            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">{lang === 'ar' ? 'رابط التقديم' : 'Application Link'}</p>
                            <p className="font-semibold text-blue-600 group-hover:text-blue-800 transition-colors text-sm truncate max-w-[200px] block">
                              {lang === 'ar' ? 'اضغط هنا للتقديم' : 'Apply Here'}
                            </p>
                          </div>
                        </a>
                      ) : (
                        <div className="flex items-start gap-4 group">
                          <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-[#1e3a8a] group-hover:text-white transition-all duration-300">
                            <ExternalLink className="w-5 h-5 text-[#1e3a8a] group-hover:text-white transition-colors" />
                          </div>
                          <div>
                            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">{lang === 'ar' ? 'رابط التقديم' : 'Application Link'}</p>
                            <p className="font-semibold text-slate-500 text-sm">{t.common.notAvailable}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-12 pt-8 border-t border-gray-100 flex justify-center">
                      <Link to="/schools" className={`inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-sm hover:bg-slate-200 hover:-translate-y-0.5 transition-all gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                        {lang === 'ar' ? 'العودة للقائمة' : 'Back to Schools'}
                      </Link>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-12">
              <ScrollReveal direction="up" delay={0.4}>
                <div className="bg-white rounded-3xl p-10 md:p-12 shadow-xl border border-gray-100">
                  <h3 className="text-3xl font-bold text-slate-900 mb-6 tracking-tight">{lang === 'ar' ? 'عن المدرسة' : 'About School'}</h3>
                  <div className="prose prose-blue max-w-none">
                    <p className="text-slate-500 text-lg leading-relaxed whitespace-pre-line">
                      {lang === 'ar'
                        ? (school?.aboutAr || school?.about || t.common.notAvailable)
                        : (school?.about || school?.aboutAr || t.common.notAvailable)}
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              <div className="bg-white rounded-3xl p-10 md:p-12 shadow-xl border border-gray-100 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50/50 rounded-bl-[8rem] -z-0" />
                <div className="relative z-10">
                  <h3 className="text-3xl font-bold text-slate-900 mb-8 tracking-tight">{lang === 'ar' ? 'معرض الصور' : 'Photo Gallery'}</h3>
                  {gallery.length > 0 ? (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                      {gallery.map((src, i) => (
                        <ScrollReveal key={i} delay={i * 0.05}>
                          <motion.div
                            whileHover={{ y: -8, scale: 1.02 }}
                            onClick={() => setSelectedImageIndex(i)}
                            className="group relative aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all cursor-pointer border border-transparent hover:border-blue-200"
                          >
                            <img
                              src={src}
                              alt={`gallery-${i}`}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                <Maximize2 className="w-5 h-5 text-white" />
                              </div>
                            </div>
                            <div className="absolute bottom-4 left-4 right-4 transform translate-y-10 group-hover:translate-y-0 transition-transform duration-500">
                              <span className="text-[10px] font-bold text-white/90 uppercase tracking-[0.2em] bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
                                {String(i + 1).padStart(2, '0')} / {String(gallery.length).padStart(2, '0')}
                              </span>
                            </div>
                          </motion.div>
                        </ScrollReveal>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-2xl">
                      <p className="text-slate-400 font-medium">{lang === 'ar' ? 'لا توجد صور في المعرض حالياً' : 'No gallery images available'}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* High-End Minimalist Gallery Lightbox */}
      <AnimatePresence initial={false} custom={direction}>
        {selectedImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-xl transition-all select-none overflow-hidden"
            onClick={() => setSelectedImageIndex(null)}
          >
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between text-white z-[1010]">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-blue-400 mb-1">
                  {lang === 'ar' ? 'معرض الصور' : 'PHOTO GALLERY'}
                </span>
                <span className="text-sm font-medium opacity-60 tabular-nums">
                  {selectedImageIndex + 1} / {gallery.length}
                </span>
              </div>

              <button
                className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all active:scale-90"
                onClick={() => setSelectedImageIndex(null)}
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Stage */}
            <div className="relative w-full h-full flex items-center justify-center p-4 md:p-12 overflow-hidden">
              {/* Ultra-Visible Thin Navigation Arrows */}
              {gallery.length > 1 && (
                <>
                  <button
                    className={`absolute ${isRTL ? 'right-4 md:right-8' : 'left-4 md:left-8'} top-1/2 -translate-y-1/2 w-16 h-16 flex items-center justify-center text-white/30 hover:text-white transition-all z-[1020] group pointer-events-auto`}
                    onClick={(e) => { e.stopPropagation(); navigateGallery(-1); }}
                  >
                    <ChevronLeft className={`w-12 h-12 md:w-20 md:h-20 transition-transform group-hover:scale-110 drop-shadow-2xl ${isRTL ? 'rotate-180' : ''}`} />
                  </button>
                  <button
                    className={`absolute ${isRTL ? 'left-4 md:left-8' : 'right-4 md:right-8'} top-1/2 -translate-y-1/2 w-16 h-16 flex items-center justify-center text-white/30 hover:text-white transition-all z-[1020] group pointer-events-auto`}
                    onClick={(e) => { e.stopPropagation(); navigateGallery(1); }}
                  >
                    <ChevronRight className={`w-12 h-12 md:w-20 md:h-20 transition-transform group-hover:scale-110 drop-shadow-2xl ${isRTL ? 'rotate-180' : ''}`} />
                  </button>
                </>
              )}

              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={selectedImageIndex}
                  custom={direction}
                  variants={{
                    enter: (d: number) => ({ x: d > 0 ? 400 : -400, opacity: 0, scale: 0.96 }),
                    center: { zIndex: 1, x: 0, opacity: 1, scale: 1 },
                    exit: (d: number) => ({ zIndex: 0, x: d < 0 ? 400 : -400, opacity: 0, scale: 0.96 })
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: 'spring', stiffness: 280, damping: 28 },
                    opacity: { duration: 0.25 }
                  }}
                  className="absolute w-full h-full flex items-center justify-center px-16 md:px-40"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="relative">
                    <img
                      src={gallery[selectedImageIndex]}
                      className="max-w-full max-h-[70vh] md:max-h-[80vh] object-contain rounded-2xl shadow-[0_40px_130px_rgba(0,0,0,0.9)] border border-white/5 ring-1 ring-white/10"
                      alt="Gallery view"
                    />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Clean Thumbnail Reel */}
            <div className="absolute bottom-8 left-0 right-0 p-4 flex flex-col items-center gap-6">
              <div
                className="flex items-center gap-3 p-1.5 bg-white/5 backdrop-blur-2xl rounded-2xl border border-white/10 max-w-full overflow-x-auto no-scrollbar shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {gallery.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setDirection(i > (selectedImageIndex || 0) ? 1 : -1);
                      setSelectedImageIndex(i);
                    }}
                    className={`relative flex-shrink-0 w-12 h-9 md:w-16 md:h-11 rounded-lg overflow-hidden transition-all duration-300 ${selectedImageIndex === i
                      ? 'ring-2 ring-blue-500 scale-105 opacity-100'
                      : 'opacity-20 hover:opacity-100 grayscale hover:grayscale-0'
                      }`}
                  >
                    <img src={src} className="w-full h-full object-cover" alt={`thumb-${i}`} />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
};

export default SchoolProfile;
