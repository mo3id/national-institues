import React from 'react';
import ChevronLeft from 'lucide-react/dist/esm/icons/chevron-left';
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right';
import ChevronsLeft from 'lucide-react/dist/esm/icons/chevrons-left';
import ChevronsRight from 'lucide-react/dist/esm/icons/chevrons-right';
import { UI, Lang } from './types';

const Pagination: React.FC<{
  current: number;
  total: number;
  onChange: (page: number) => void;
  lang: string;
}> = ({ current, total, onChange, lang }) => {
  const isRTL = lang === 'ar';
  const u = UI[lang as Lang];
  if (total <= 1) return null;

  const pages: number[] = [];
  const start = Math.max(1, current - 2);
  const end = Math.min(total, current + 2);

  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="pagination-container">
      <button
        className="pagination-btn"
        onClick={() => onChange(1)}
        disabled={current === 1}
        title={u.firstPage}
      >
        <ChevronsLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
      </button>
      <button
        className="pagination-btn"
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
      >
        <ChevronLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
      </button>

      <div className="pagination-info mobile-hide">
        {u.page}
        <span>{current} / {total}</span>
      </div>

      <div className="flex items-center gap-1.5">
        {start > 1 && <span className="text-[var(--text2)] px-1">...</span>}
        {pages.map(p => (
          <button
            key={p}
            className={`pagination-btn ${current === p ? 'active' : ''}`}
            onClick={() => onChange(p)}
          >
            {p}
          </button>
        ))}
        {end < total && <span className="text-[var(--text2)] px-1">...</span>}
      </div>

      <button
        className="pagination-btn"
        onClick={() => onChange(current + 1)}
        disabled={current === total}
      >
        <ChevronRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
      </button>
      <button
        className="pagination-btn"
        onClick={() => onChange(total)}
        disabled={current === total}
        title={u.lastPage}
      >
        <ChevronsRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
      </button>
    </div>
  );
};

export default Pagination;
