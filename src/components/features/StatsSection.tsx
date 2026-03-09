import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useSiteData } from '@/context/DataContext';
import ScrollReveal from '@/components/common/ScrollReveal';
import { getLiveStats } from '@/services/api';

interface LiveStats {
  schoolsCount: number;
  totalStudents: number;
  totalTeachers: number;
  yearsOfService: number;
}

const StatsSection: React.FC = () => {
  const { lang } = useLanguage();
  const { data: siteData } = useSiteData();
  const [liveStats, setLiveStats] = useState<LiveStats | null>(null);
  
  useEffect(() => {
    // Fetch live stats from API
    const fetchLiveStats = async () => {
      try {
        const response = await getLiveStats();
        if (response.status === 'success') {
          setLiveStats(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch live stats:', error);
        // Fallback to default stats if API fails
        setLiveStats({
          schoolsCount: 39,
          totalStudents: 120000,
          totalTeachers: 18000,
          yearsOfService: 41
        });
      }
    };
    
    fetchLiveStats();
  }, []);

  // Format number with + prefix and support Arabic numerals
  const formatNumber = (num: number): string => {
    if (!num) return '+0';
    
    const formatted = num >= 1000 ? `${Math.floor(num / 1000)}k` : num.toString();
    
    if (lang === 'ar') {
      // Convert to Arabic numerals
      const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
      const arabicFormatted = formatted.replace(/\d/g, (digit) => arabicNumerals[parseInt(digit)]);
      return `+${arabicFormatted}`;
    }
    
    return `+${formatted}`;
  };

  // Build stats array from live data
  const stats = liveStats ? [
    {
      number: formatNumber(liveStats.yearsOfService),
      label: lang === 'ar' ? 'عقود من العطاء' : 'Decades of Service',
      color: 'bg-emerald-400',
      shape: 'rounded-[30%_70%_70%_30%/30%_30%_70%_70%]'
    },
    {
      number: formatNumber(liveStats.totalTeachers),
      label: lang === 'ar' ? 'معلم خبير' : 'Expert Teachers',
      color: 'bg-yellow-400',
      shape: 'rounded-full'
    },
    {
      number: formatNumber(liveStats.totalStudents),
      label: lang === 'ar' ? 'طالب وطالبة' : 'Students',
      color: 'bg-blue-400',
      shape: 'rounded-[60%_40%_30%_70%/60%_30%_70%_40%]'
    },
    {
      number: formatNumber(liveStats.schoolsCount),
      label: lang === 'ar' ? 'مؤسسة تعليمية' : 'Educational Institutions',
      color: 'bg-pink-400',
      shape: 'rounded-2xl rotate-12'
    }
  ] : [];

  const s = siteData.stats || {
    journeyInNumbers: "Our Journey in Numbers",
    journeyInNumbersAr: "رحلتنا في أرقام"
  };

  return (
    <section className="w-[90%] lg:w-[80%] mx-auto my-30 py-24 bg-slate-50 overflow-hidden rounded-[40px]">
      <div className="w-[90%] lg:w-[80%] mx-auto px-4 text-center">
        <ScrollReveal>
          <h2 className="text-[#1e3a8a] font-bold mb-20 text-2xl lg:text-3xl tracking-tight">
            {lang === 'ar' ? s.journeyInNumbersAr : s.journeyInNumbers}
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-16 lg:gap-x-4 xl:gap-x-12">
          {stats.map((stat, index) => (
            <ScrollReveal key={index} delay={index * 0.1}>
              <div className="flex flex-col items-center relative group">
                <div className="relative mb-4 flex items-center justify-center">
                  <span className="text-[64px] lg:text-[52px] xl:text-[72px] 2xl:text-[80px] font-black text-[#1e293b] leading-none tracking-tighter z-10">
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
