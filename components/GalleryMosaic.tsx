
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '../LanguageContext';

const IMG_H = 'h-[105px] md:h-[135px] lg:h-[150px]';
const IMG_W = 220;
const WORD_W = 260;

const GalleryMosaic: React.FC = () => {
  const { lang } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const words = lang === 'ar'
    ? ['تـعلـم', 'تـقـدم', 'كـن قـائدًا', 'تـمـيز', 'إلـهـام', 'إبـداع']
    : ['LEARN', 'GROW', 'LEAD', 'EXCEL', 'INSPIRE', 'CREATE'];

  // Safe images: objects, buildings, books, labs, architecture only - NO people
  const imgs = {
    books: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
    library: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=600&q=80',
    lab: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80',
    campus: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=600&q=80',
    laptop: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
    desk: 'https://images.unsplash.com/photo-1491841573634-28140fc7ced7?auto=format&fit=crop&w=600&q=80',
    science: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80',
    study: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80',
    art: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=600&q=80',
    arch: 'https://images.unsplash.com/photo-1510070112810-d4e9a46d9e91?auto=format&fit=crop&w=600&q=80',
    chalk: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=600&q=80',
    globe: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=600&q=80',
    pencils: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=600&q=80',
    notebook: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=600&q=80',
  };

  const baseRows = [
    // Row 1: varied pattern - word at positions 2, 6
    [
      { type: 'image', url: imgs.books },
      { type: 'image', url: imgs.library },
      { type: 'word', text: words[0] },
      { type: 'image', url: imgs.lab },
      { type: 'image', url: imgs.campus },
      { type: 'image', url: imgs.laptop },
      { type: 'image', url: imgs.desk },
      { type: 'word', text: words[1] },
      { type: 'image', url: imgs.science },
      { type: 'image', url: imgs.study },
    ],
    // Row 2: varied pattern - word at positions 4, 7
    [
      { type: 'image', url: imgs.arch },
      { type: 'image', url: imgs.chalk },
      { type: 'image', url: imgs.globe },
      { type: 'image', url: imgs.pencils },
      { type: 'word', text: words[2] },
      { type: 'image', url: imgs.notebook },
      { type: 'image', url: imgs.art },
      { type: 'word', text: words[3] },
      { type: 'image', url: imgs.books },
      { type: 'image', url: imgs.library },
    ],
    // Row 3: varied pattern - word at positions 3, 5, 9
    [
      { type: 'image', url: imgs.campus },
      { type: 'image', url: imgs.science },
      { type: 'image', url: imgs.study },
      { type: 'word', text: words[4] },
      { type: 'image', url: imgs.lab },
      { type: 'word', text: words[5] },
      { type: 'image', url: imgs.desk },
      { type: 'image', url: imgs.laptop },
      { type: 'image', url: imgs.arch },
      { type: 'word', text: words[0] },
    ],
    // Row 4: varied pattern - word at positions 1, 5, 8
    [
      { type: 'word', text: words[1] },
      { type: 'image', url: imgs.globe },
      { type: 'image', url: imgs.pencils },
      { type: 'image', url: imgs.notebook },
      { type: 'image', url: imgs.art },
      { type: 'word', text: words[2] },
      { type: 'image', url: imgs.books },
      { type: 'image', url: imgs.campus },
      { type: 'word', text: words[3] },
      { type: 'image', url: imgs.library },
    ],
    // Row 5: varied pattern - word at positions 2, 5, 7
    [
      { type: 'image', url: imgs.desk },
      { type: 'image', url: imgs.laptop },
      { type: 'word', text: words[4] },
      { type: 'image', url: imgs.science },
      { type: 'image', url: imgs.study },
      { type: 'word', text: words[5] },
      { type: 'image', url: imgs.arch },
      { type: 'word', text: words[0] },
      { type: 'image', url: imgs.chalk },
      { type: 'image', url: imgs.globe },
    ],
    // Row 6: varied pattern - word at positions 4, 6
    [
      { type: 'image', url: imgs.notebook },
      { type: 'image', url: imgs.art },
      { type: 'image', url: imgs.books },
      { type: 'image', url: imgs.library },
      { type: 'word', text: words[1] },
      { type: 'image', url: imgs.campus },
      { type: 'word', text: words[2] },
      { type: 'image', url: imgs.lab },
      { type: 'image', url: imgs.desk },
      { type: 'image', url: imgs.laptop },
    ],
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
