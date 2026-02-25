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
    const activeNews = (siteData.news || []).filter(n => n.published);
    if (!q) return activeNews;
    return activeNews.filter(n => (n.title + (n.titleAr || '') + (n.summary || '') + (n.summaryAr || '')).toLowerCase().includes(q));
  }, [query, siteData.news]);

  const featured = filtered[0];

  return (
    <PageTransition>
      <div className="overflow-x-hidden">
        {/* Unified Hero Header with Custom AI Image */}
        <section className="m-[10px] rounded-[20px] relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-[#0f172a]">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
            style={{ backgroundImage: "url('/news_list_hero.png')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/20 to-transparent" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <ScrollReveal direction="right" width="fit-content">
                <div className={`text-center md:text-start ${isRTL ? 'md:text-right' : 'md:text-left'}`}>
                  <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-white mb-4 drop-shadow-2xl">
                    {t.news.title}
                  </h1>
                  <p className="text-white/70 text-lg md:text-xl font-medium max-w-xl">
                    {t.news.desc}
                  </p>
                </div>
              </ScrollReveal>
              <ScrollReveal direction="left" width="fit-content">
                <div className="w-full md:w-[450px]">
                  <div className="relative group">
                    <input
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      placeholder={t.news.searchPlaceholder}
                      className={`w-full py-4 px-14 rounded-2xl text-base bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-4 focus:ring-white/10 focus:bg-white/20 transition-all shadow-2xl ${isRTL ? 'text-right' : 'text-left'}`}
                    />
                    <Search className={`absolute top-1/2 -translate-y-1/2 h-5 w-5 text-white/50 group-focus-within:text-white transition-colors ${isRTL ? 'right-5' : 'left-5'}`} />
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-20">
          {featured && (
            <ScrollReveal direction="up">
              <article className="bg-white rounded-[40px] shadow-[0_15px_50px_-12px_rgb(0,0,0,0.08)] border border-slate-100/50 overflow-hidden grid grid-cols-1 lg:grid-cols-2 mb-24 group transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgb(0,0,0,0.12)]">
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
                    <Link to={`/news/${featured.id}`} className={`inline-flex items-center px-10 py-4.5 bg-[#1e3a8a] text-white rounded-2xl text-base font-bold hover:bg-black transition-all shadow-xl shadow-blue-900/10 hover:-translate-y-1 active:scale-95 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span>{t.news.readMore}</span>
                      <ArrowRight className={`h-5 w-5 ${isRTL ? 'rotate-180 mr-3' : 'ml-3'}`} />
                    </Link>
                  </div>
                </div>
              </article>
            </ScrollReveal>
          )}

          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filtered.filter(i => i.id !== featured?.id).slice(0, 12).map((item, i) => (
              <ScrollReveal key={item.id} delay={(i % 3) * 0.1} className="h-full">
                <article className="bg-white rounded-[24px] border border-gray-100/60 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] overflow-hidden transition-all duration-300 group flex flex-col h-full relative p-2">

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
                    <Link
                      to={`/news/${item.id}`}
                      className="mt-auto w-full py-[14px] bg-[#0f1115] text-white rounded-[16px] font-semibold text-[15px] hover:bg-black transition-all flex items-center justify-center gap-2 group/btn"
                    >
                      <span>{t.news.readMore}</span>
                      <ArrowRight className={`h-4 w-4 transition-transform group-hover/btn:translate-x-1 ${isRTL ? 'rotate-180 group-hover/btn:-translate-x-1' : ''}`} />
                    </Link>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </section>
        </main>
      </div>
    </PageTransition>
  );
};

export default News;
