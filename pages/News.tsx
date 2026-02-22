import React, { useMemo, useState } from 'react';
import { NEWS } from '../constants';
import { useLanguage } from '../LanguageContext';
import { Search, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import ScrollReveal from '../components/ScrollReveal';

const News: React.FC = () => {
  const { t, lang, isRTL } = useLanguage();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return NEWS;
    return NEWS.filter(n => (n.title + (n.titleAr || '') + n.summary + (n.summaryAr || '')).toLowerCase().includes(q));
  }, [query]);

  const featured = filtered[0];

  return (
    <PageTransition>
      <div className="overflow-x-hidden">
        <section className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <ScrollReveal direction="right" width="100%">
                <div className="flex-1">
                  <h1 className="text-4xl md:text-5xl font-black">{t.news.title}</h1>
                  <p className="mt-4 text-blue-100/80 max-w-2xl">{t.news.desc}</p>
                </div>
              </ScrollReveal>
              <ScrollReveal direction="left" width="fit-content">
                <div className="w-full md:w-96">
                  <label className="relative block">
                    <span className="sr-only">Search</span>
                    <input
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      placeholder={t.news.searchPlaceholder}
                      className="w-full py-3 pl-4 pr-12 rounded-lg text-sm bg-white/10 placeholder-blue-100/60 text-white border border-white/20 focus:border-white transition-colors"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80">
                      <Search className="h-4 w-4" />
                    </span>
                  </label>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {featured && (
            <ScrollReveal>
              <article className="bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-3 mb-16 group">
                <div className="md:col-span-2 relative h-64 md:h-auto overflow-hidden">
                  <img src={featured.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={featured.title} />
                  <div className="absolute left-6 bottom-6 bg-red-700 text-white px-4 py-2 rounded-md uppercase text-xs font-bold shadow-lg">{new Date(featured.date).toLocaleDateString()}</div>
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <h2 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-blue-900 transition-colors">{lang === 'ar' ? featured.titleAr : featured.title}</h2>
                  <p className="text-gray-600 mb-6">{lang === 'ar' ? featured.summaryAr : featured.summary}</p>
                  <div className="flex items-center gap-4">
                    <Link to="#" className="inline-flex items-center px-6 py-3 bg-blue-900 text-white rounded-full font-black uppercase tracking-widest hover:bg-blue-800 transition-colors shadow-lg active:scale-95">
                      {t.news.readMore}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                    <span className="text-sm text-gray-500 flex items-center gap-2"><Calendar className="h-4 w-4" />{featured.date}</span>
                  </div>
                </div>
              </article>
            </ScrollReveal>
          )}

          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filtered.slice(0, 12).map((item, i) => (
              <ScrollReveal key={item.id} delay={(i % 3) * 0.1}>
                <article className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-2xl transition-all duration-300 group h-full flex flex-col border border-gray-100">
                  <div className="relative h-44 overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute left-4 top-4 bg-red-700 text-white px-3 py-1 rounded-md text-xs font-bold shadow-md">{item.date}</div>
                  </div>
                  <div className="p-6 space-y-3 flex-grow flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-red-700 transition-colors">{lang === 'ar' ? item.titleAr : item.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">{lang === 'ar' ? item.summaryAr : item.summary}</p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                      <Link to="#" className="text-blue-900 font-bold text-xs uppercase tracking-widest inline-flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                        {t.news.readMore}
                        <ArrowRight className="h-3.5 w-3.5 text-red-600" />
                      </Link>
                      <span className="text-[10px] text-gray-400 font-medium">{new Date(item.date).toLocaleDateString()}</span>
                    </div>
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
