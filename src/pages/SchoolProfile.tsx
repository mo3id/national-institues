
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSiteData } from '@/context/DataContext';
import { ArrowLeft, MapPin, Phone, Mail, Globe, User } from 'lucide-react';
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

  const rawGallery = school?.gallery && school.gallery.length > 0 ? school.gallery : [
    "/school_gallery_cartoon_1_1771958696092.png",
    "/school_gallery_cartoon_2_1771958739632.png",
    "/school_gallery_cartoon_4_1771958779745.png",
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=400&q=80"
  ];

  const gallery = React.useMemo(() => {
    if (rawGallery.length <= 6) return rawGallery;
    const shuffled = [...rawGallery].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 6);
  }, [rawGallery]);

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
                backgroundImage: `url('${school?.mainImage || '/nano-banana-1771806527783.png'}')`,
                transform: isRTL ? 'scaleX(-1) scale(1.05)' : 'scale(1.05)'
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
                          <p className="font-semibold text-slate-800 text-sm">{lang === 'ar' ? 'شارع التعليم، الحي الأول' : 'Education St, First District'}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 group">
                        <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-[#1e3a8a] group-hover:text-white transition-all duration-300">
                          <Phone className="w-5 h-5 text-[#1e3a8a] group-hover:text-white transition-colors" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">{lang === 'ar' ? 'الهاتف' : 'Phone'}</p>
                          <p className="font-semibold text-slate-800 text-sm">02-12345678</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 group">
                        <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-[#1e3a8a] group-hover:text-white transition-all duration-300">
                          <Mail className="w-5 h-5 text-[#1e3a8a] group-hover:text-white transition-colors" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">{lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}</p>
                          <p className="font-semibold text-slate-800 text-sm">info@school{(school as any)?.id}.edu.eg</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 group">
                        <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-[#1e3a8a] group-hover:text-white transition-all duration-300">
                          <Globe className="w-5 h-5 text-[#1e3a8a] group-hover:text-white transition-colors" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">{lang === 'ar' ? 'الموقع الإلكتروني' : 'Website'}</p>
                          <p className="font-semibold text-blue-600 hover:text-blue-800 transition-colors text-sm truncate max-w-[200px]">www.school-website.com</p>
                        </div>
                      </div>
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
                    <p className="text-slate-500 text-lg leading-relaxed">
                      {lang === 'ar'
                        ? 'هذه فقرة تجريبية لوصف المدرسة. تتميز المدرسة بتقديم تعليم عالي الجودة وتوفر بيئة تعليمية آمنة ومحفزة للطلاب. تضم المدرسة نخبة من المعلمين ذوي الخبرة والكفاءة العالية.'
                        : 'At our institution, we believe in nurturing the holistic development of every child. Our school offers high-quality education in a safe and stimulating learning environment, facilitated by a team of world-class educators.'}
                    </p>
                    <p className="text-slate-500 text-lg leading-relaxed mt-4">
                      {lang === 'ar'
                        ? 'تلتزم المدرسة بالتميز الأكاديمي والنمو الشخصي لكل طالب.'
                        : 'We are committed to academic excellence and personal growth, ensuring that our students are well-prepared for the challenges of the future.'}
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              <div className="bg-white rounded-3xl p-10 md:p-12 shadow-xl border border-gray-100 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50/50 rounded-bl-[8rem] -z-0" />
                <div className="relative z-10">
                  <h3 className="text-3xl font-bold text-slate-900 mb-8 tracking-tight">{lang === 'ar' ? 'معرض الصور' : 'Photo Gallery'}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {gallery.map((src, i) => (
                      <ScrollReveal key={i} delay={i * 0.1}>
                        <div className="group relative aspect-square bg-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer">
                          <img src={src} alt="gallery" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                          <div className="absolute inset-0 bg-blue-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-500">
                              <ArrowLeft className={`w-5 h-5 text-blue-900 ${isRTL ? 'rotate-[-45deg]' : 'rotate-[135deg]'}`} />
                            </div>
                          </div>
                        </div>
                      </ScrollReveal>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default SchoolProfile;
