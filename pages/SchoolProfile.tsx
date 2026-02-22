
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { SCHOOLS } from '../constants';
import { ArrowLeft, MapPin, Phone, Mail, Globe } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import PageTransition from '../components/PageTransition';
import ScrollReveal from '../components/ScrollReveal';

const SchoolProfile: React.FC = () => {
  const { id } = useParams();
  const { isRTL, t, lang } = useLanguage();
  const school = SCHOOLS.find(s => s.id === id);

  if (!school) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <p className="text-gray-600 font-bold uppercase tracking-widest">School not found</p>
    </div>
  );

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 pb-24 text-start">
        {/* Banner with Parallax Effect */}
        <div className="relative h-80 md:h-[450px] overflow-hidden">
          <img
            src={`https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop`}
            className="w-full h-full object-cover scale-110"
            alt="School Cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="max-w-7xl mx-auto px-4 h-full flex items-end pb-12 relative z-10">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-8 w-full">
              <ScrollReveal direction="up">
                <div className="w-32 h-32 md:w-48 md:h-48 bg-white rounded-3xl p-4 shadow-2xl overflow-hidden border-4 border-white/20 backdrop-blur-sm">
                  <img src={school.logo} alt={school.name} className="w-full h-full object-contain" />
                </div>
              </ScrollReveal>
              <div className="text-white flex-grow text-center md:text-start pb-4">
                <ScrollReveal direction="right" delay={0.2}>
                  <h1 className="text-3xl md:text-6xl font-black tracking-tight mb-2 leading-tight uppercase">{school.name}</h1>
                  <div className={`flex items-center justify-center md:justify-start ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} opacity-80 font-bold text-xs md:text-sm uppercase tracking-widest`}>
                    <MapPin className="w-4 h-4 text-red-500" />
                    <span>{school.governorate} • {school.location}</span>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Sidebar Details */}
            <div className="lg:col-span-1">
              <ScrollReveal direction="right" delay={0.3}>
                <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-gray-100 overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-[5rem] -z-0" />
                  <div className="relative z-10">
                    <h3 className="font-black text-xl mb-8 text-blue-900 uppercase tracking-tight italic border-l-4 border-red-600 pl-4">{lang === 'ar' ? 'بيانات الاتصال' : 'Contact Info'}</h3>
                    <div className="space-y-8">
                      <div className="flex items-start gap-4 group">
                        <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-blue-900 group-hover:text-white transition-all">
                          <MapPin className="w-5 h-5 text-blue-900 group-hover:text-white transition-colors" />
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{lang === 'ar' ? 'العنوان' : 'Address'}</p>
                          <p className="font-bold text-gray-800 text-sm">{lang === 'ar' ? 'شارع التعليم، الحي الأول' : 'Education St, First District'}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 group">
                        <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-blue-900 group-hover:text-white transition-all">
                          <Phone className="w-5 h-5 text-blue-900 group-hover:text-white transition-colors" />
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{lang === 'ar' ? 'الهاتف' : 'Phone'}</p>
                          <p className="font-bold text-gray-800 text-sm">02-12345678</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 group">
                        <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-blue-900 group-hover:text-white transition-all">
                          <Mail className="w-5 h-5 text-blue-900 group-hover:text-white transition-colors" />
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}</p>
                          <p className="font-bold text-gray-800 text-sm">info@school{school.id}.edu.eg</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 group">
                        <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-blue-900 group-hover:text-white transition-all">
                          <Globe className="w-5 h-5 text-blue-900 group-hover:text-white transition-colors" />
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{lang === 'ar' ? 'الموقع الإلكتروني' : 'Website'}</p>
                          <p className="font-bold text-blue-700 text-sm truncate max-w-[200px]">www.school-website.com</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-gray-100">
                      <Link to="/schools" className={`text-xs font-black uppercase tracking-[0.2em] text-gray-400 hover:text-red-700 transition-colors inline-flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
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
                  <h3 className="font-black text-2xl mb-6 text-[#1e3a8a] uppercase tracking-tight italic border-l-4 border-red-600 pl-4">{lang === 'ar' ? 'عن المدرسة' : 'About School'}</h3>
                  <div className="prose prose-blue max-w-none">
                    <p className="text-gray-600 leading-relaxed text-lg font-medium italic">
                      {lang === 'ar'
                        ? 'هذه فقرة تجريبية لوصف المدرسة. تتميز المدرسة بتقديم تعليم عالي الجودة وتوفر بيئة تعليمية آمنة ومحفزة للطلاب. تضم المدرسة نخبة من المعلمين ذوي الخبرة والكفاءة العالية.'
                        : 'At our institution, we believe in nurturing the holistic development of every child. Our school offers high-quality education in a safe and stimulating learning environment, facilitated by a team of world-class educators.'}
                    </p>
                    <p className="text-gray-600 leading-relaxed mt-4">
                      {lang === 'ar'
                        ? 'تلتزم المدرسة بالتميز الأكاديمي والنمو الشخصي لكل طالب.'
                        : 'We are committed to academic excellence and personal growth, ensuring that our students are well-prepared for the challenges of the future.'}
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              <div className="bg-white rounded-3xl p-10 md:p-12 shadow-xl border border-gray-100 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-[8rem] -z-0" />
                <div className="relative z-10">
                  <h3 className="font-black text-2xl mb-8 text-[#1e3a8a] uppercase tracking-tight italic border-l-4 border-red-600 pl-4">{lang === 'ar' ? 'معرض الصور' : 'Photo Gallery'}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <ScrollReveal key={i} delay={i * 0.1}>
                        <div className="group relative aspect-square bg-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer">
                          <img src={`https://picsum.photos/seed/${school.id}-${i}/600/600`} alt="gallery" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                          <div className="absolute inset-0 bg-blue-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-500">
                              <ArrowLeft className="w-5 h-5 text-blue-900 rotate-[135deg]" />
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
