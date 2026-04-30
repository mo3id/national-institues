import React from 'react';
import Plus from 'lucide-react/dist/esm/icons/plus';
import Pencil from 'lucide-react/dist/esm/icons/pencil';
import Trash2 from 'lucide-react/dist/esm/icons/trash-2';
import Eye from 'lucide-react/dist/esm/icons/eye';
import EyeOff from 'lucide-react/dist/esm/icons/eye-off';
import Search from 'lucide-react/dist/esm/icons/search';
import Newspaper from 'lucide-react/dist/esm/icons/newspaper';
import Pagination from '../Pagination';

interface DashNewsItem {
  id: string;
  title: string;
  titleAr: string;
  summary: string;
  summaryAr: string;
  date: string;
  image: string;
  published: boolean;
  featured?: boolean;
}

interface NewsSectionProps {
  newsList: DashNewsItem[];
  newsSearch: string;
  setNewsSearch: (v: string) => void;
  addNewsOpen: boolean;
  setAddNewsOpen: (v: boolean) => void;
  editNewsId: string | null;
  setEditNewsId: (v: string | null) => void;
  togglePublish: (id: string) => void;
  deleteNews: (id: string) => void;
  newsPage: number;
  newsTotalPages: number;
  setNewsPage: (v: number) => void;
  publishedCount: number;
  u: Record<string, string>;
  isRTL: boolean;
  lang: string;
  isTableLoading: boolean;
}

const NewsSection: React.FC<NewsSectionProps> = ({
  newsList, newsSearch, setNewsSearch, setAddNewsOpen, togglePublish, deleteNews, setEditNewsId,
  newsPage, newsTotalPages, setNewsPage, publishedCount, u, isRTL, lang, isTableLoading
}) => (
  <div className="section-enter">
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)' }}>{u.news}</h2>
        <p style={{ fontSize: 13, color: 'var(--text2)', marginTop: 2 }}>{newsList.length} {u.newsManage} · {publishedCount} {u.publishedCount}</p>
      </div>
      <button className="dash-btn dash-btn-primary" onClick={() => setAddNewsOpen(true)}><Plus style={{ width: 15, height: 15 }} />{u.addArticle}</button>
    </div>
    <div style={{ position: 'relative', marginBottom: 16, maxWidth: 320 }}>
      <Search style={{ position: 'absolute', left: isRTL ? 'auto' : 14, right: isRTL ? 14 : 'auto', top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: 'var(--text2)' }} />
      <input className="dash-input" style={{ paddingLeft: isRTL ? 14 : 40, paddingRight: isRTL ? 40 : 14 }} placeholder={u.search} value={newsSearch} onChange={e => setNewsSearch(e.target.value)} />
    </div>
    <div className="dash-card" style={{ overflow: 'hidden', position: 'relative' }}>
      {isTableLoading && (
        <div className="table-loader">
          <div style={{ width: 32, height: 32, border: '4px solid var(--accent)', borderTopColor: 'transparent', borderRadius: '50%' }} className="animate-spin"></div>
        </div>
      )}
      <div className="row-header">
        <div /><p className="dash-label" style={{ margin: 0 }}>{u.title}</p><p className="dash-label" style={{ margin: 0 }}>{u.date}</p><p className="dash-label" style={{ margin: 0 }}>{u.status}</p><p className="dash-label" style={{ margin: 0 }}>{u.actions}</p>
      </div>
      {newsList.map(n => (
        <div key={n.id} className="news-row">
          <img src={n.image || undefined} style={{ width: 52, height: 52, borderRadius: 10, objectFit: 'cover' }} alt="" />
          <div style={{ minWidth: 0, position: 'relative' }}>
            <p style={{ fontWeight: 600, fontSize: 13, color: 'var(--text)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', display: 'flex', alignItems: 'center', gap: '6px' }}>
              {lang === 'ar' ? (n.titleAr || n.title) : n.title}
              {n.featured && <span style={{ fontSize: '10px', background: '#eab308', color: 'white', padding: '2px 6px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', fontWeight: 'bold' }}>⭐ {u.featured}</span>}
            </p>
            <p style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{lang === 'ar' ? (n.summaryAr || n.summary) : n.summary}</p>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text2)' }}>{n.date}</p>
          <button className={`dash-badge ${n.published ? 'badge-green' : 'badge-gray'}`} style={{ cursor: 'pointer', border: 'none' }} onClick={() => togglePublish(n.id)}>{n.published ? u.published : u.draft}</button>
          <div style={{ display: 'flex', gap: 4 }}>
            <button className="dash-icon-btn" title={u.edit} onClick={() => setEditNewsId(n.id)}><Pencil style={{ width: 15, height: 15, color: 'var(--accent)' }} /></button>
            <button className="dash-icon-btn" title={n.published ? 'Unpublish' : 'Publish'} onClick={() => togglePublish(n.id)}>{n.published ? <EyeOff style={{ width: 15, height: 15 }} /> : <Eye style={{ width: 15, height: 15 }} />}</button>
            <button className="dash-icon-btn" title={u.delete} onClick={() => deleteNews(n.id)}><Trash2 style={{ width: 15, height: 15, color: '#ef4444' }} /></button>
          </div>
        </div>
      ))}
      {newsList.length === 0 && <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text2)' }}><Newspaper style={{ width: 36, height: 36, margin: '0 auto 12px', opacity: 0.3 }} /><p style={{ fontWeight: 600 }}>{u.noResults}</p></div>}
    </div>
    <Pagination current={newsPage} total={newsTotalPages} onChange={setNewsPage} lang={lang} />
  </div>
);

export default NewsSection;
