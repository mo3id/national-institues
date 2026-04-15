import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Search from 'lucide-react/dist/esm/icons/search';
import GraduationCap from 'lucide-react/dist/esm/icons/graduation-cap';
import Briefcase from 'lucide-react/dist/esm/icons/briefcase';
import Building2 from 'lucide-react/dist/esm/icons/building-2';
import Quote from 'lucide-react/dist/esm/icons/quote';
import Linkedin from 'lucide-react/dist/esm/icons/linkedin';
import Twitter from 'lucide-react/dist/esm/icons/twitter';
import { useLanguage } from '@/context/LanguageContext';
import { useSiteData } from '@/context/DataContext';
import PageTransition from '@/components/common/PageTransition';
import ScrollReveal from '@/components/common/ScrollReveal';
import { CustomSelect } from '@/components/common/FormControls';

const AlumniCard = React.memo(({ alumni, isRTL, translations: t, lang, onView }: any) => (
  <ScrollReveal heightFull={true}>
    <div className="bg-white rounded-[24px] border border-gray-100/60 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] overflow-hidden transition-all duration-300 group flex flex-col h-full relative p-2">

      {/* Profile Image Area */}
      <div className="relative h-48 w-full rounded-[20px] overflow-hidden bg-gray-50 flex items-center justify-center">
        {alumni.image ? (
          <img
            src={alumni.image}
            alt={lang === 'ar' ? (alumni.nameAr || alumni.name) : alumni.name}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
            <span className="text-3xl font-bold text-blue-600">
              {(lang === 'ar' ? (alumni.nameAr || alumni.name) : alumni.name)?.charAt(0) || '?'}
            </span>
          </div>
        )}
        {/* Featured Badge */}
        {alumni.featured && (
          <div className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'}`}>
            <span className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border border-white/20 shadow-sm bg-amber-500/80 text-white">
              ★ {lang === 'ar' ? 'مميز' : 'Featured'}
            </span>
          </div>
        )}
        {/* Graduation Year Badge */}
        {alumni.graduationYear && (
          <div className={`absolute bottom-3 ${isRTL ? 'right-3' : 'left-3'}`}>
            <span className="px-3 py-1.5 rounded-full text-[11px] font-bold backdrop-blur-md border border-white/20 shadow-sm bg-blue-600/80 text-white">
              {alumni.graduationYear}
            </span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="px-4 pb-4 pt-4 flex flex-col flex-grow">
        {/* Name & School */}
        <div className="mb-4 text-start">
          <h3 className="text-[20px] font-bold text-gray-900 mb-0.5 leading-tight tracking-tight line-clamp-1">
            {lang === 'ar' ? (alumni.nameAr || alumni.name) : alumni.name}
          </h3>
          <p className="text-[14px] font-medium text-gray-500 line-clamp-1">
            {lang === 'ar' ? (alumni.schoolAr || alumni.school) : alumni.school}
          </p>
        </div>

        {/* Info Tags */}
        <div className="flex flex-col gap-2 mb-4">
          {alumni.jobTitle && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100">
              <div className="w-5 h-5 rounded-full bg-blue-900 flex items-center justify-center">
                <Briefcase className="w-3 h-3 text-white" />
              </div>
              <span className="text-[13px] font-medium text-gray-700 line-clamp-1">
                {lang === 'ar' ? (alumni.jobTitleAr || alumni.jobTitle) : alumni.jobTitle}
              </span>
            </div>
          )}
          {alumni.company && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100">
              <div className="w-5 h-5 rounded-full bg-emerald-900 flex items-center justify-center">
                <Building2 className="w-3 h-3 text-white" />
              </div>
              <span className="text-[13px] font-medium text-gray-700 line-clamp-1">
                {lang === 'ar' ? (alumni.companyAr || alumni.company) : alumni.company}
              </span>
            </div>
          )}
          {alumni.degree && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100">
              <div className="w-5 h-5 rounded-full bg-purple-900 flex items-center justify-center">
                <GraduationCap className="w-3 h-3 text-white" />
              </div>
              <span className="text-[13px] font-medium text-gray-700 line-clamp-1">
                {lang === 'ar' ? (alumni.degreeAr || alumni.degree) : alumni.degree}
              </span>
            </div>
          )}
        </div>

        {/* Testimonial Preview */}
        {alumni.testimonial && (
          <div className="relative mb-4 px-3 py-2.5 bg-amber-50/60 rounded-xl border border-amber-100/60">
            <Quote className="w-3.5 h-3.5 text-amber-400 absolute top-2 start-3 opacity-60" />
            <p className="text-[12px] text-gray-600 italic line-clamp-2 ps-5">
              {lang === 'ar' ? (alumni.testimonialAr || alumni.testimonial) : alumni.testimonial}
            </p>
          </div>
        )}

        {/* Social Links */}
        {(alumni.linkedin || alumni.twitter) && (
          <div className="flex items-center gap-2 mb-3">
            {alumni.linkedin && (
              <a href={alumni.linkedin} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center hover:bg-blue-100 transition-colors">
                <Linkedin className="w-4 h-4 text-blue-600" />
              </a>
            )}
            {alumni.twitter && (
              <a href={alumni.twitter} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors">
                <Twitter className="w-4 h-4 text-gray-700" />
              </a>
            )}
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={() => onView && onView(alumni)}
          className="mt-auto w-full py-[14px] bg-[#0f1115] text-white rounded-[16px] font-semibold text-[15px] hover:bg-black transition-colors"
        >
          {t.viewProfile}
        </button>
      </div>
    </div>
  </ScrollReveal>
));

const Alumni: React.FC = () => {
  const { lang, isRTL, t: translationsRoot } = useLanguage();
  const { data: siteData } = useSiteData();
  const t = translationsRoot?.alumni || ({} as any);
  const ALUMNI_DATA = siteData.alumni || [];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const navigate = useNavigate();

  // Derive unique schools and years from alumni data
  const uniqueSchools = useMemo(() => {
    const schools = new Map<string, { name: string; nameAr: string }>();
    ALUMNI_DATA.forEach((a: any) => {
      if (a.school && !schools.has(a.school)) {
        schools.set(a.school, { name: a.school, nameAr: a.schoolAr || a.school });
      }
    });
    return Array.from(schools.values());
  }, [ALUMNI_DATA]);

  const uniqueYears = useMemo(() => {
    const years = new Set<string>();
    ALUMNI_DATA.forEach((a: any) => {
      if (a.graduationYear) years.add(a.graduationYear);
    });
    return Array.from(years).sort((a, b) => b.localeCompare(a));
  }, [ALUMNI_DATA]);

  const filteredAlumni = useMemo(() => {
    return ALUMNI_DATA.filter((a: any) => {
      const name = lang === 'ar' ? (a.nameAr || a.name || '') : (a.name || '');
      const school = lang === 'ar' ? (a.schoolAr || a.school || '') : (a.school || '');
      const company = lang === 'ar' ? (a.companyAr || a.company || '') : (a.company || '');
      const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        school.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSchool = selectedSchool === '' || a.school === selectedSchool;
      const matchesYear = selectedYear === '' || a.graduationYear === selectedYear;

      return matchesSearch && matchesSchool && matchesYear;
    });
  }, [searchQuery, selectedSchool, selectedYear, ALUMNI_DATA, lang]);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedSchool('');
    setSelectedYear('');
  }, []);

  // SEO
  React.useEffect(() => {
    document.title = lang === 'ar' ? 'خريجونا | المعاهد القومية' : 'Our Alumni | National Institutes';
    return () => {
      document.title = "National Institutes Schools Portal";
    };
  }, [lang]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 pb-24">
        {/* Header / Hero Section */}
        <section className="m-[10px] rounded-[20px] relative h-[60vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('/our-schools.webp')`
              }}
            />
            <div className="absolute inset-0 z-10 bg-black/40" />
          </div>
          <div className="relative z-20 text-center max-w-4xl mx-auto px-6 md:px-12" dir={isRTL ? 'rtl' : 'ltr'}>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-white leading-[1.4] mb-8 animate-fade-in">
              {t.title}
            </h1>
            <p className="text-lg lg:text-xl text-white/90 max-w-2xl mx-auto mb-12 leading-relaxed font-medium animate-fade-in" style={{ animationDelay: '0.1s' }}>
              {t.subtitle}
            </p>
          </div>
        </section>

        {/* Main Content Container */}
        <div className="max-w-7xl mx-auto px-4 -mt-12 relative z-20">
          {/* Search & Filters */}
          <ScrollReveal direction="up">
            <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-200 mb-10">
              <div className="flex flex-col lg:flex-row gap-3 items-stretch">
                <div className="flex-[2] relative">
                  <div className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-4' : 'left-4'} text-gray-400`}>
                    <Search className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    placeholder={t.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full h-12 ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400`}
                  />
                </div>

                <div className="flex-1 min-w-[160px] relative">
                  <CustomSelect
                    value={selectedSchool}
                    onChange={setSelectedSchool}
                    options={[
                      { value: '', label: t.filterSchool },
                      ...uniqueSchools.map(s => ({ value: s.name, label: lang === 'ar' ? s.nameAr : s.name }))
                    ]}
                    icon={<GraduationCap className="h-4 w-4" />}
                  />
                </div>

                <div className="flex-1 min-w-[160px] relative">
                  <CustomSelect
                    value={selectedYear}
                    onChange={setSelectedYear}
                    options={[
                      { value: '', label: t.filterYear },
                      ...uniqueYears.map(y => ({ value: y, label: y }))
                    ]}
                    icon={<GraduationCap className="h-4 w-4" />}
                  />
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Results Count & Title Area */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white p-5 rounded-[20px] border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-[14px] bg-[#0f1115] flex items-center justify-center shadow-md">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
                  {t.title}
                </h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                  <p className="text-sm font-semibold text-gray-500">
                    <span className="text-gray-900 font-bold">{filteredAlumni.length}</span> {lang === 'ar' ? 'خريج' : 'alumni'}
                  </p>
                </div>
              </div>
            </div>

            {(searchQuery || selectedSchool || selectedYear) && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-[12px] font-bold text-sm hover:bg-red-100 transition-colors"
              >
                <span>{t.clearFilters}</span>
                <span className="w-5 h-5 flex items-center justify-center bg-red-100 rounded-md text-xs">✕</span>
              </button>
            )}
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAlumni.length > 0 ? (
              filteredAlumni.map((alumni: any) => (
                <AlumniCard key={alumni.id} alumni={alumni} isRTL={isRTL} translations={t} lang={lang} onView={(a: any) => navigate(`/alumni/${a.id}`)} />
              ))
            ) : (
              <div className="col-span-full py-24 text-center bg-white rounded-2xl border border-dashed border-gray-200">
                <div className="bg-gray-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <Search className="h-7 w-7 text-gray-300" />
                </div>
                <p className="text-lg font-bold text-gray-900 mb-1">{t.noResults}</p>
                <p className="text-sm text-gray-400 mb-4">{lang === 'ar' ? 'جرب تغيير معايير البحث' : 'Try adjusting your search criteria'}</p>
                <button
                  onClick={clearFilters}
                  className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  {t.clearFilters}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Alumni;
