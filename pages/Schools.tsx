import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { SCHOOLS, GOVERNORATES } from '../constants';
import { Search, MapPin, Filter, User, ArrowRight, Star } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import NISLogo from '../components/NISLogo';
import PageTransition from '../components/PageTransition';
import ScrollReveal from '../components/ScrollReveal';

const SchoolCard = React.memo(({ school, isRTL, translations: t, lang, onView }: any) => (
  <ScrollReveal>
    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group flex flex-col h-full">
      <div className="flex justify-between items-start mb-8">
        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center p-2 border border-gray-100 group-hover:scale-110 transition-transform">
          <img
            src={school.logo}
            alt={school.name}
            className="max-w-full max-h-full grayscale group-hover:grayscale-0"
            loading="lazy"
          />
        </div>
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${school.type === 'International' ? 'bg-purple-100 text-purple-700' :
          school.type === 'Language' ? 'bg-blue-100 text-blue-700' :
            'bg-green-100 text-green-700'
          }`}>
          {school.type}
        </span>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-black text-gray-900 mb-2 group-hover:text-blue-900 transition-colors text-start">{school.name}</h3>
        <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-1' : 'space-x-1'} text-gray-400 text-xs font-bold uppercase tracking-wider`}>
          <MapPin className="h-4 w-4 text-red-600" />
          <span>{school.governorate}, {school.location}</span>
        </div>
      </div>

      <div className="bg-gray-50 rounded-2xl p-4 mb-8 text-start">
        <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
          <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center border border-gray-200">
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest leading-none">{t.principal}</p>
            <p className="text-sm font-bold text-gray-800 mt-1">{school.principal}</p>
          </div>
        </div>
      </div>

      <button onClick={() => onView && onView(school)} className={`mt-auto w-full py-4 bg-blue-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} group-hover:bg-red-700 transition-colors shadow-lg active:scale-95`}>
        <span>{t.viewProfile}</span>
        <ArrowRight className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
      </button>
    </div>
  </ScrollReveal>
));

const Schools: React.FC = () => {
  const { lang, isRTL, t: translationsRoot } = useLanguage();
  const t = translationsRoot.schools;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGov, setSelectedGov] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const navigate = useNavigate();

  const schoolTypes = ['National', 'International', 'Language'];

  const filteredSchools = useMemo(() => {
    return SCHOOLS.filter(school => {
      const matchesSearch = school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        school.location.toLowerCase().includes(searchQuery.toLowerCase());
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

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 pb-24">
        {/* Header / Hero Section */}
        <div className="bg-blue-900 py-32 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 text-white">
            <svg className="h-full w-full" fill="currentColor">
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
            <ScrollReveal direction="down">
              <div className="flex justify-center mb-6">
                <div className="bg-white p-4 rounded-3xl shadow-2xl">
                  <NISLogo className="h-16 w-16" showText={false} />
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <h1 className="text-5xl font-black mb-6 tracking-tight">{t.title}</h1>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <p className="text-xl text-blue-200 max-w-2xl mx-auto leading-relaxed">{t.subtitle}</p>
            </ScrollReveal>
          </div>
        </div>

        {/* Main Content Container */}
        <div className="max-w-7xl mx-auto px-4 mt-24">
          {/* Search & Filters */}
          <ScrollReveal direction="up" delay={0.3}>
            <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 border border-gray-100 mb-16">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-2 relative">
                  <Search className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-4' : 'left-4'} h-5 w-5 text-gray-400`} />
                  <input
                    type="text"
                    placeholder={t.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full ${isRTL ? 'pr-12' : 'pl-12'} py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium`}
                  />
                </div>

                <div className="relative">
                  <Filter className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-4' : 'left-4'} h-5 w-5 text-gray-400`} />
                  <select
                    value={selectedGov}
                    onChange={(e) => setSelectedGov(e.target.value)}
                    className={`w-full ${isRTL ? 'pr-12' : 'pl-12'} py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none appearance-none font-bold text-sm`}
                  >
                    <option value="">{t.filterGov}</option>
                    {GOVERNORATES.map(gov => <option key={gov.name} value={gov.name}>{gov.name}</option>)}
                  </select>
                </div>

                <div className="relative">
                  <Star className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-4' : 'left-4'} h-5 w-5 text-gray-400`} />
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className={`w-full ${isRTL ? 'pr-12' : 'pl-12'} py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none appearance-none font-bold text-sm`}
                  >
                    <option value="">{t.filterType}</option>
                    {schoolTypes.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSchools.length > 0 ? (
              filteredSchools.map((school) => (
                <SchoolCard key={school.id} school={school} isRTL={isRTL} translations={t} lang={lang} onView={(s: any) => navigate(`/schools/${s.id}`)} />
              ))
            ) : (
              <div className="col-span-full py-32 text-center bg-white rounded-3xl border border-dashed border-gray-300">
                <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="h-10 w-10 text-gray-300" />
                </div>
                <p className="text-xl font-bold text-gray-900">{t.noResults}</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 text-blue-900 font-black text-xs uppercase tracking-widest underline"
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
