import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useSiteData } from '@/context/DataContext';
import ScrollReveal from '@/components/common/ScrollReveal';

const StatsSection: React.FC = () => {
  const { lang } = useLanguage();
  const { data: siteData } = useSiteData();
  const s = siteData.stats || {
    journeyInNumbers: "Our Journey in Numbers",
    journeyInNumbersAr: "رحلتنا في أرقام",
    items: []
  };

  const items = s.items || [];

  const stats = items.map((item, idx) => ({
    ...item,
    label: lang === 'ar' ? item.labelAr : item.label,
    shape: idx === 0 ? 'rounded-[30%_70%_70%_30%/30%_30%_70%_70%]' :
      idx === 1 ? 'rounded-full' :
        idx === 2 ? 'rounded-[60%_40%_30%_70%/60%_30%_70%_40%]' :
          'rounded-2xl rotate-12'
  }));

  return (
    <section className="w-[90%] lg:w-[80%] mx-auto my-30 py-24 bg-slate-50 overflow-hidden rounded-[40px]">
      <div className="w-[90%] lg:w-[80%] mx-auto px-4 text-center">
        <ScrollReveal>
          <h2 className="text-[#1e3a8a] font-bold mb-20 text-2xl lg:text-3xl tracking-tight">
            {lang === 'ar' ? s.journeyInNumbersAr : s.journeyInNumbers}
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-16 lg:gap-x-12">
          {stats.map((stat, index) => (
            <ScrollReveal key={index} delay={index * 0.1}>
              <div className="flex flex-col items-center relative group">
                <div className="relative mb-4 flex items-center justify-center">
                  <span className="text-[64px] lg:text-[80px] font-black text-[#1e293b] leading-none tracking-tighter z-10">
                    {stat.number}
                  </span>
                  <div
                    className={`absolute -right-4 -top-4 w-16 h-16 lg:w-20 lg:h-20 ${stat.color} ${stat.shape} opacity-60 blur-[2px] group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 z-0`}
                  />
                </div>
                <p className="text-slate-500 text-[15px] lg:text-[17px] leading-relaxed max-w-[180px] font-medium mx-auto">
                  {stat.label}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
