import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { SCHOOLS, GOVERNORATES } from '@/constants';
import { Search, MapPin, Filter, User, ArrowRight, Star, GraduationCap } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useSiteData } from '@/context/DataContext';
import NISLogo from '@/components/common/NISLogo';
import PageTransition from '@/components/common/PageTransition';
import ScrollReveal from '@/components/common/ScrollReveal';
import { CustomSelect } from '@/components/common/FormControls';

const formatStudentCount = (count: string | undefined) => {
  if (!count) return '';
  const num = parseInt(count.replace(/,/g, ''), 10);
  if (isNaN(num)) return count;
  if (num >= 1000) {
    const formatted = (num / 1000).toFixed(1).replace(/\.0$/, '');
    return `+${formatted}K`;
  }
  return `+${num}`;
};

const SchoolCard = React.memo(({ school, isRTL, translations: t, common, lang, onView }: any) => (
  <ScrollReveal heightFull={true}>
    <div className="bg-white rounded-[24px] border border-gray-100/60 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] overflow-hidden transition-all duration-300 group flex flex-col h-full relative p-2">

      {/* Background Cover Image with margin */}
      <div className="relative h-40 w-full rounded-[20px] overflow-hidden bg-gray-50">
        <img
          src={school.mainImage || "/layer-1-small.webp"}
          alt="Cover"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* Type Badge on cover */}
        <div className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'}`}>
          <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border border-white/20 shadow-sm
            ${school.type === 'American' || school.type === 'British' || school.type === 'French' ? 'bg-purple-500/80 text-white' :
              school.type === 'Languages' ? 'bg-blue-500/80 text-white' :
                'bg-emerald-500/80 text-white'
            }`}>
            {t.types[school.type as keyof typeof t.types] || school.type}
          </span>
        </div>
      </div>

      {/* Profile Image (Logo) positioned over the cover */}
      <div className={`absolute top-28 ${isRTL ? 'right-6' : 'left-6'} z-10`}>
        <div className="w-20 h-20 bg-white rounded-full p-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-gray-50">
          <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center p-2.5">
            <img src={school.logo || "/layer-1-small.webp"} alt="NIS Logo" className="w-full h-full object-contain" loading="lazy" />
          </div>
        </div>
      </div>


      {/* Card Body */}
      <div className="px-4 pb-4 pt-12 flex flex-col flex-grow">
        {/* Title & Subtitle */}
        <div className="mb-5 text-start min-h-[5rem]">
          <h3 className="text-[22px] font-bold text-gray-900 mb-0.5 leading-tight tracking-tight line-clamp-2">
            {lang === 'ar' ? (school.nameAr || school.name) : school.name}
          </h3>
          <p className="text-[14px] font-medium text-gray-500 line-clamp-1">
            {lang === 'ar' ? (school.governorateAr || school.governorate) : school.governorate} • {lang === 'ar' ? (school.locationAr || school.location) : school.location}
          </p>
        </div>

        {/* Tags Row */}
        <div className={`flex items-center gap-2 mb-6 flex-wrap ${isRTL ? 'justify-start' : ''}`}>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100">
            <div className="w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center">
              <User className="w-3 h-3 text-white" />
            </div>
            <span className="text-[13px] font-bold text-gray-700">{t.principal}: {lang === 'ar' ? (school.principalAr || school.principal) : school.principal}</span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between py-4 mb-5 mx-2">
          <div className="text-center flex-1">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <span className="text-[15px] font-bold text-gray-900">{school.rating || common.notAvailable}</span>
              {school.rating && (
                <svg className="w-3.5 h-3.5 text-gray-900 fill-gray-900" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              )}
            </div>
            <span className="text-[12px] font-medium text-gray-400">{common.rating}</span>
          </div>

          <div className="w-[1px] h-6 bg-gray-100"></div>

          <div className="text-center flex-1">
            <div className="text-[15px] font-bold text-gray-900 mb-0.5">
              {school.studentCount ? formatStudentCount(school.studentCount) : common.notAvailable}
            </div>
            <span className="text-[12px] font-medium text-gray-400">{common.students || 'Students'}</span>
          </div>

          <div className="w-[1px] h-6 bg-gray-100"></div>

          <div className="text-center flex-1">
            <div className="text-[15px] font-bold text-gray-900 mb-0.5">{school.foundedYear || common.notAvailable}</div>
            <span className="text-[12px] font-medium text-gray-400">{common.founded || 'Founded'}</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onView && onView(school)}
          className="mt-auto w-full py-[14px] bg-[#0f1115] text-white rounded-[16px] font-semibold text-[15px] hover:bg-black transition-colors"
        >
          {t.viewProfile}
        </button>
      </div>
    </div>
  </ScrollReveal>
));

const Schools: React.FC = () => {
  const { lang, isRTL, t: translationsRoot } = useLanguage();
  const { data: siteData } = useSiteData();
  const t = translationsRoot?.schools || ({ types: {} } as any);
  const SCHOOLS_DATA = siteData.schools || [];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGov, setSelectedGov] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const navigate = useNavigate();

  const schoolTypes = ['Arabic', 'Languages', 'American', 'British', 'French'];

  const filteredSchools = useMemo(() => {
    return SCHOOLS_DATA.filter(school => {
      const name = lang === 'ar' ? (school.nameAr || school.name || '') : (school.name || '');
      const location = lang === 'ar' ? (school.locationAr || school.location || '') : (school.location || '');
      const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGov = selectedGov === '' || school.governorate === selectedGov;
      const matchesType = selectedType === '' || school.type === selectedType;
      return matchesSearch && matchesGov && matchesType;
    });
  }, [searchQuery, selectedGov, selectedType]);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedGov('');
    setSelectedType('');
  }, []);

  // SEO: Update Title
  React.useEffect(() => {
    document.title = lang === 'ar' ? 'شبكة المدارس | المعاهد القومية' : 'Schools Network | National Institutes';
    return () => {
      document.title = "National Institutes Schools Portal";
    };
  }, [lang]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 pb-24">
        {/* Header / Hero Section */}
        <section className="m-[10px] rounded-[20px] relative h-[60vh] flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('/layer-1-small.webp')`
              }}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 z-10 bg-black/40" />
          </div>

          {/* Main Content - Centered */}
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
          {/* Search & Filters - Clean design without shadow */}
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
                    value={selectedGov}
                    onChange={setSelectedGov}
                    options={[
                      { value: '', label: t.filterGov },
                      ...GOVERNORATES.map(gov => ({ value: gov.name, label: lang === 'ar' && (gov as any).nameAr ? (gov as any).nameAr : gov.name }))
                    ]}
                    icon={<MapPin className="h-4 w-4" />}
                  />
                </div>

                <div className="flex-1 min-w-[160px] relative">
                  <CustomSelect
                    value={selectedType}
                    onChange={setSelectedType}
                    options={[
                      { value: '', label: t.filterType },
                      ...schoolTypes.map(type => ({
                        value: type,
                        label: t.types[type as keyof typeof t.types] || type
                      }))
                    ]}
                    icon={<Filter className="h-4 w-4" />}
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
                  {lang === 'ar' ? 'شبكة المدارس' : 'Our Network'}
                </h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                  <p className="text-sm font-semibold text-gray-500">
                    <span className="text-gray-900 font-bold">{filteredSchools.length}</span> {lang === 'ar' ? 'مدرسة متاحة' : 'schools available'}
                  </p>
                </div>
              </div>
            </div>

            {(searchQuery || selectedGov || selectedType) && (
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
            {filteredSchools.length > 0 ? (
              filteredSchools.map((school) => (
                <SchoolCard key={school.id} school={school} isRTL={isRTL} translations={t} common={translationsRoot.common} lang={lang} onView={(s: any) => navigate(`/schools/${s.id}`)} />
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

export default Schools;
