import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSiteData } from '@/context/DataContext';
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left';
import GraduationCap from 'lucide-react/dist/esm/icons/graduation-cap';
import Briefcase from 'lucide-react/dist/esm/icons/briefcase';
import Building2 from 'lucide-react/dist/esm/icons/building-2';
import Quote from 'lucide-react/dist/esm/icons/quote';
import Linkedin from 'lucide-react/dist/esm/icons/linkedin';
import Twitter from 'lucide-react/dist/esm/icons/twitter';
import Award from 'lucide-react/dist/esm/icons/award';
import { useLanguage } from '@/context/LanguageContext';
import PageTransition from '@/components/common/PageTransition';
import ScrollReveal from '@/components/common/ScrollReveal';

const AlumniProfile: React.FC = () => {
  const { id } = useParams();
  const { isRTL, t, lang } = useLanguage();
  const { data: siteData } = useSiteData();
  const alumni = (siteData.alumni || []).find((a: any) => a.id === id);

  const name = lang === 'ar' ? (alumni?.nameAr || alumni?.name || '') : (alumni?.name || '');
  const school = lang === 'ar' ? (alumni?.schoolAr || alumni?.school || '') : (alumni?.school || '');
  const degree = lang === 'ar' ? (alumni?.degreeAr || alumni?.degree || '') : (alumni?.degree || '');
  const jobTitle = lang === 'ar' ? (alumni?.jobTitleAr || alumni?.jobTitle || '') : (alumni?.jobTitle || '');
  const company = lang === 'ar' ? (alumni?.companyAr || alumni?.company || '') : (alumni?.company || '');
  const testimonial = lang === 'ar' ? (alumni?.testimonialAr || alumni?.testimonial || '') : (alumni?.testimonial || '');

  const at = t?.alumni || ({} as any);

  // SEO
  React.useEffect(() => {
    if (alumni) {
      document.title = `${name} | ${lang === 'ar' ? 'خريجونا' : 'Alumni'} | NIS`;
      return () => { document.title = "National Institutes Schools Portal"; };
    }
  }, [alumni, name, lang]);

  if (!alumni) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="bg-gray-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <GraduationCap className="h-10 w-10 text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {lang === 'ar' ? 'لم يتم العثور على الخريج' : 'Alumni Not Found'}
            </h2>
            <p className="text-gray-500 mb-6">
              {lang === 'ar' ? 'الخريج المطلوب غير موجود' : 'The requested alumni profile could not be found.'}
            </p>
            <Link
              to="/alumni"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#0f1115] text-white rounded-xl font-semibold hover:bg-black transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {at.backToAlumni}
            </Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 pb-24">
        {/* Hero Banner */}
        <section className="m-[10px] rounded-[20px] relative h-[50vh] flex items-end overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('/our-schools.webp')` }}
            />
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          </div>

          {/* Back Button */}
          <Link
            to="/alumni"
            className="absolute top-6 z-30 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white font-medium hover:bg-white/20 transition-colors"
            style={{ [isRTL ? 'right' : 'left']: '24px' }}
          >
            <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            {at.backToAlumni}
          </Link>

          {/* Profile Info on Hero */}
          <div className="relative z-20 w-full max-w-7xl mx-auto px-6 pb-8" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className={`flex items-end gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {/* Profile Image */}
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white flex-shrink-0">
                {alumni.image ? (
                  <img
                    src={alumni.image}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                    <span className="text-4xl font-bold text-blue-600">{name.charAt(0)}</span>
                  </div>
                )}
              </div>
              <div className="pb-2">
                <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">{name}</h1>
                <p className="text-lg text-white/80 font-medium mt-1">{school}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <div className="max-w-5xl mx-auto px-4 -mt-6 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Testimonial */}
              {testimonial && (
                <ScrollReveal direction="up">
                  <div className="bg-white rounded-[20px] p-6 md:p-8 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                        <Quote className="w-5 h-5 text-amber-500" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">{at.testimonial}</h3>
                    </div>
                    <blockquote className="text-gray-600 text-[16px] leading-relaxed italic border-s-4 border-amber-200 ps-5">
                      {testimonial}
                    </blockquote>
                  </div>
                </ScrollReveal>
              )}

              {/* About / Bio Section */}
              <ScrollReveal direction="up">
                <div className="bg-white rounded-[20px] p-6 md:p-8 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    {lang === 'ar' ? 'نبذة عن الخريج' : 'About'}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {alumni.graduationYear && (
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                          <GraduationCap className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 font-medium">{at.graduationYear}</p>
                          <p className="text-sm font-bold text-gray-900">{alumni.graduationYear}</p>
                        </div>
                      </div>
                    )}
                    {degree && (
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                        <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center">
                          <Award className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 font-medium">{at.degree}</p>
                          <p className="text-sm font-bold text-gray-900">{degree}</p>
                        </div>
                      </div>
                    )}
                    {jobTitle && (
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                          <Briefcase className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 font-medium">{at.currentPosition}</p>
                          <p className="text-sm font-bold text-gray-900">{jobTitle}</p>
                        </div>
                      </div>
                    )}
                    {company && (
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                        <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center">
                          <Building2 className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 font-medium">{lang === 'ar' ? 'الشركة' : 'Company'}</p>
                          <p className="text-sm font-bold text-gray-900">{company}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Quick Info Card */}
              <ScrollReveal direction="up">
                <div className="bg-white rounded-[20px] p-6 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    {lang === 'ar' ? 'معلومات سريعة' : 'Quick Info'}
                  </h3>
                  <div className="space-y-3">
                    {school && (
                      <div className="flex items-center justify-between py-2 border-b border-gray-50">
                        <span className="text-sm text-gray-500">{lang === 'ar' ? 'المدرسة' : 'School'}</span>
                        <span className="text-sm font-bold text-gray-900">{school}</span>
                      </div>
                    )}
                    {alumni.graduationYear && (
                      <div className="flex items-center justify-between py-2 border-b border-gray-50">
                        <span className="text-sm text-gray-500">{at.graduationYear}</span>
                        <span className="text-sm font-bold text-gray-900">{alumni.graduationYear}</span>
                      </div>
                    )}
                    {degree && (
                      <div className="flex items-center justify-between py-2 border-b border-gray-50">
                        <span className="text-sm text-gray-500">{at.degree}</span>
                        <span className="text-sm font-bold text-gray-900 line-clamp-1">{degree}</span>
                      </div>
                    )}
                    {alumni.featured && (
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-gray-500">{lang === 'ar' ? 'مميز' : 'Featured'}</span>
                        <span className="text-sm font-bold text-amber-600">★</span>
                      </div>
                    )}
                  </div>
                </div>
              </ScrollReveal>

              {/* Social Links Card */}
              {(alumni.linkedin || alumni.twitter) && (
                <ScrollReveal direction="up">
                  <div className="bg-white rounded-[20px] p-6 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      {lang === 'ar' ? 'تواصل اجتماعي' : 'Social Links'}
                    </h3>
                    <div className="space-y-3">
                      {alumni.linkedin && (
                        <a
                          href={alumni.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors group"
                        >
                          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center">
                            <Linkedin className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-sm font-medium text-blue-700 group-hover:text-blue-800">LinkedIn</span>
                        </a>
                      )}
                      {alumni.twitter && (
                        <a
                          href={alumni.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group"
                        >
                          <div className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center">
                            <Twitter className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-sm font-medium text-gray-700 group-hover:text-gray-800">Twitter / X</span>
                        </a>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              )}

              {/* Back Button */}
              <Link
                to="/alumni"
                className="flex items-center justify-center gap-2 w-full py-3 bg-[#0f1115] text-white rounded-[16px] font-semibold text-[15px] hover:bg-black transition-colors"
              >
                <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                {at.backToAlumni}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default AlumniProfile;
