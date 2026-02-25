
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useSiteData } from '@/context/DataContext';

const IMG_H = 'h-[105px] md:h-[135px] lg:h-[150px]';
const IMG_W = 220;
const WORD_W = 260;

const GalleryMosaic: React.FC = () => {
  const { lang } = useLanguage();
  const { data: siteData } = useSiteData();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const words = lang === 'ar'
    ? ['تـعلـم', 'تـقـدم', 'كـن قـائدًا', 'تـمـيز', 'إلـهـام', 'إبـداع']
    : ['LEARN', 'GROW', 'LEAD', 'EXCEL', 'INSPIRE', 'CREATE'];

  const dynamicImages = siteData.galleryImages || [
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80'
  ];

  const baseRows = [
    // Dynamic Row Generation based on available images
    [...Array(10)].map((_, i) => ({
      type: i % 3 === 2 ? 'word' : 'image',
      text: words[i % words.length],
      url: dynamicImages[i % dynamicImages.length]
    })),
    [...Array(10)].map((_, i) => ({
      type: i % 4 === 1 ? 'word' : 'image',
      text: words[(i + 2) % words.length],
      url: dynamicImages[(i + 3) % dynamicImages.length]
    })),
    [...Array(10)].map((_, i) => ({
      type: i % 5 === 0 ? 'word' : 'image',
      text: words[(i + 4) % words.length],
      url: dynamicImages[(i + 6) % dynamicImages.length]
    })),
    [...Array(10)].map((_, i) => ({
      type: i % 3 === 1 ? 'word' : 'image',
      text: words[(i + 1) % words.length],
      url: dynamicImages[(i + 1) % dynamicImages.length]
    })),
    [...Array(10)].map((_, i) => ({
      type: i % 4 === 3 ? 'word' : 'image',
      text: words[(i + 3) % words.length],
      url: dynamicImages[(i + 5) % dynamicImages.length]
    })),
    [...Array(10)].map((_, i) => ({
      type: i % 5 === 2 ? 'word' : 'image',
      text: words[(i + 5) % words.length],
      url: dynamicImages[(i + 2) % dynamicImages.length]
    })),
  ];

  // Double each row for seamless endless feel
  const rows = baseRows.map(items => [...items, ...items]);

  // Centered animation - oscillate ±150px around center
  const x0 = useTransform(scrollYProgress, [0, 1], [150, -150]);
  const x1 = useTransform(scrollYProgress, [0, 1], [-150, 150]);
  const x2 = useTransform(scrollYProgress, [0, 1], [150, -150]);
  const x3 = useTransform(scrollYProgress, [0, 1], [-150, 150]);
  const x4 = useTransform(scrollYProgress, [0, 1], [150, -150]);
  const x5 = useTransform(scrollYProgress, [0, 1], [-150, 150]);
  const xValues = [x0, x1, x2, x3, x4, x5];

  return (
    <section ref={sectionRef} className="py-14 bg-white overflow-hidden">
      <div className="w-full space-y-3 flex flex-col items-center">
        {rows.map((rowItems, rIdx) => (
          <motion.div
            key={rIdx}
            style={{ x: xValues[rIdx] }}
            className="flex gap-3 items-center w-max"
          >
            {rowItems.map((item, iIdx) => (
              <div
                key={iIdx}
                className="flex-shrink-0"
                style={{ width: item.type === 'word' ? WORD_W : IMG_W }}
              >
                {item.type === 'image' ? (
                  <div className={`relative ${IMG_H} overflow-hidden rounded-xl md:rounded-2xl border border-black/5 group`}>
                    <img
                      src={item.url}
                      alt="Gallery"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://picsum.photos/seed/nis${rIdx}${iIdx}/600/400`;
                      }}
                    />
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300" />
                  </div>
                ) : (
                  <div className={`flex items-center justify-center ${IMG_H} mx-3`}>
                    <span className="text-3xl md:text-4xl lg:text-6xl font-black text-[#1e3a8a] tracking-tight leading-none select-none text-center whitespace-nowrap">
                      {item.text}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default GalleryMosaic;
