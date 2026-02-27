import React, { useMemo, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useSiteData } from '@/context/DataContext';
import { Search, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageTransition from '@/components/common/PageTransition';
import ScrollReveal from '@/components/common/ScrollReveal';

const News: React.FC = () => {
  const { t, lang, isRTL } = useLanguage();
  const { data: siteData } = useSiteData();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const activeNews = (siteData.news || []).filter(n => n.published !== false);
    if (!q) return activeNews;
    return activeNews.filter(n => (n.title + (n.titleAr || '') + (n.summary || '') + (n.summaryAr || '')).toLowerCase().includes(q));
  }, [query, siteData.news]);

  const featured = filtered[0];

  return (
    <PageTransition>
      <div className="overflow-x-hidden">
        {/* Unified Hero Header */}
        <section className="m-[10px] rounded-[20px] relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-[#0f172a]">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#991b1b]/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
          </div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 py-20 flex flex-col items-center">
            <ScrollReveal direction="down">
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 tracking-tight text-white leading-tight drop-shadow-lg">
                {t.news.title}
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <p className="text-blue-100/80 text-lg md:text-xl max-w-2xl mx-auto font-medium">
                {t.news.desc}
              </p>
            </ScrollReveal>
          </div>
        </section>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-20">
          {featured && (
            <ScrollReveal direction="up">
              <Link to={`/news/${featured.id}`} className="bg-white rounded-[40px] shadow-[0_15px_50px_-12px_rgb(0,0,0,0.08)] border border-slate-100/50 overflow-hidden grid grid-cols-1 lg:grid-cols-2 mb-24 group transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgb(0,0,0,0.12)] hover:-translate-y-1">
                <div className="relative h-80 lg:h-[500px] overflow-hidden">
                  <img src={featured.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt={featured.title} />
                  <div className={`absolute top-8 ${isRTL ? 'right-8' : 'left-8'} bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold text-slate-700 shadow-xl flex items-center gap-2 border border-white/20`}>
                    <Calendar className="w-4 h-4 text-red-600" />
                    {featured.date}
                  </div>
                </div>
                <div className="p-10 lg:p-16 flex flex-col justify-center">
                  <div className={`mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <span className="inline-block px-4 py-1.5 bg-red-50 text-red-500 rounded-lg text-xs font-black uppercase tracking-[0.2em]">{t.home.featuredStory}</span>
                  </div>
                  <h2 className={`text-3xl lg:text-[44px] font-bold text-slate-900 mb-8 leading-[1.1] ${isRTL ? 'text-right text-[36px]' : 'text-left'}`}>
                    {lang === 'ar' ? featured.titleAr : featured.title}
                  </h2>
                  <p className={`text-slate-500 mb-12 leading-relaxed text-lg ${isRTL ? 'text-right' : 'text-left'}`}>
                    {lang === 'ar' ? featured.summaryAr : featured.summary}
                  </p>
                  <div className={`flex items-center ${isRTL ? 'justify-end' : 'justify-start'}`}>
                    <span className={`inline-flex items-center px-10 py-[18px] bg-slate-50 text-[#1e3a8a] rounded-2xl text-base font-bold transition-all duration-300 group-hover:bg-[#1e3a8a] group-hover:text-white group-hover:shadow-xl group-hover:shadow-blue-900/20 group-hover:-translate-y-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span>{t.news.readMore}</span>
                      <ArrowRight className={`h-5 w-5 transition-transform ${isRTL ? 'rotate-180 mr-3 group-hover:-translate-x-2' : 'ml-3 group-hover:translate-x-2'}`} />
                    </span>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          )}

          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filtered.filter(i => i.id !== featured?.id).slice(0, 12).map((item, i) => (
              <ScrollReveal key={item.id} delay={(i % 3) * 0.1} className="h-full">
                <Link to={`/news/${item.id}`} className="block bg-white rounded-[24px] border border-gray-100/60 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 overflow-hidden transition-all duration-300 group flex flex-col h-full relative p-2">

                  {/* Image with container margin like SchoolCard */}
                  <div className="relative h-48 w-full rounded-[20px] overflow-hidden bg-gray-50">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'}`}>
                      <span className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md bg-red-500/80 text-white border border-white/20 shadow-sm">
                        {t.home.newsBadge}
                      </span>
                    </div>
                  </div>

                  {/* Icon/Logo Badge positioned over image edge */}
                  <div className={`absolute top-36 ${isRTL ? 'right-6' : 'left-6'} z-10`}>
                    <div className="w-16 h-16 bg-white rounded-full p-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-gray-50">
                      <div className="w-full h-full rounded-full overflow-hidden bg-slate-50 flex items-center justify-center p-2 text-[#1e3a8a]">
                        <Calendar className="w-6 h-6" />
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="px-4 pb-4 pt-10 flex flex-col flex-grow">
                    <div className={`mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                      <h3 className="text-[20px] font-bold text-gray-900 mb-2 leading-tight tracking-tight line-clamp-2 min-h-14">
                        {lang === 'ar' ? item.titleAr : item.title}
                      </h3>
                      <div className="flex items-center gap-2 text-[12px] font-medium text-gray-400">
                        <span>{item.date}</span>
                        <span>•</span>
                        <span>{lang === 'ar' ? 'المعاهد القومية' : 'National Institutes'}</span>
                      </div>
                    </div>

                    <p className={`text-[14px] text-gray-500 line-clamp-3 leading-relaxed mb-6 flex-grow ${isRTL ? 'text-right' : 'text-left'}`}>
                      {lang === 'ar' ? item.summaryAr : item.summary}
                    </p>

                    {/* Full Width Button like SchoolCard */}
                    <span
                      className="mt-auto w-full py-[14px] bg-slate-50 text-slate-700 rounded-[16px] font-semibold text-[15px] transition-all duration-300 flex items-center justify-center gap-2 group-hover:bg-[#1e3a8a] group-hover:text-white group-hover:shadow-lg group-hover:-translate-y-1"
                    >
                      <span>{t.news.readMore}</span>
                      <ArrowRight className={`h-4 w-4 transition-transform ${isRTL ? 'rotate-180 group-hover:-translate-x-2' : 'group-hover:translate-x-2'}`} />
                    </span>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </section>
        </main>
      </div>
    </PageTransition>
  );
};

export default News;
