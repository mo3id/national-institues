import React from 'react';
import Plus from 'lucide-react/dist/esm/icons/plus';
import Pencil from 'lucide-react/dist/esm/icons/pencil';
import Trash2 from 'lucide-react/dist/esm/icons/trash-2';
import Search from 'lucide-react/dist/esm/icons/search';
import GraduationCap from 'lucide-react/dist/esm/icons/graduation-cap';
import type { DashAlumni } from '../types';

interface AlumniSectionProps {
  alumniList: DashAlumni[];
  alumniSearch: string;
  setAlumniSearch: (v: string) => void;
  setAddAlumniOpen: (v: boolean) => void;
  setEditAlumniId: (v: string | null) => void;
  deleteAlumni: (id: string) => void;
  u: Record<string, string>;
  isRTL: boolean;
  lang: string;
  isTableLoading: boolean;
}

const AlumniSection: React.FC<AlumniSectionProps> = ({
  alumniList, alumniSearch, setAlumniSearch, setAddAlumniOpen, setEditAlumniId, deleteAlumni, u, isRTL, lang, isTableLoading
}) => (
  <div className="section-enter">
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
      <div><h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)' }}>{u.alumni}</h2><p style={{ fontSize: 13, color: 'var(--text2)', marginTop: 2 }}>{u.alumniManage}</p></div>
      <button className="dash-btn dash-btn-primary" onClick={() => setAddAlumniOpen(true)}><Plus style={{ width: 15, height: 15 }} />{u.addAlumni}</button>
    </div>
    <div style={{ position: 'relative', marginBottom: 18, maxWidth: 320 }}>
      <Search style={{ position: 'absolute', left: isRTL ? 'auto' : 14, right: isRTL ? 14 : 'auto', top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: 'var(--text2)' }} />
      <input className="dash-input" style={{ paddingLeft: isRTL ? 14 : 40, paddingRight: isRTL ? 40 : 14 }} placeholder={u.search} value={alumniSearch} onChange={e => setAlumniSearch(e.target.value)} />
    </div>
    <div style={{ position: 'relative' }}>
      {isTableLoading && (
        <div className="table-loader" style={{ borderRadius: 24 }}>
          <div style={{ width: 32, height: 32, border: '4px solid var(--accent)', borderTopColor: 'transparent', borderRadius: '50%' }} className="animate-spin"></div>
        </div>
      )}
      <div className="school-grid">
        {alumniList.map(a => (
          <div key={a.id} className="school-card">
            <img src={a.image || undefined} style={{ width: 52, height: 52, borderRadius: 12, objectFit: 'cover', background: 'var(--surface2)', flexShrink: 0 }} alt={a.name} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontWeight: 700, fontSize: 13, color: 'var(--text)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{lang === 'ar' ? (a.nameAr || a.name) : a.name}</p>
              <p style={{ fontSize: 11, color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}><GraduationCap style={{ width: 11, height: 11 }} />{lang === 'ar' ? (a.schoolAr || a.school) : a.school} • {a.graduationYear}</p>
              {(a.jobTitle || a.jobTitleAr) && <p style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>{lang === 'ar' ? (a.jobTitleAr || a.jobTitle) : a.jobTitle}{(a.company || a.companyAr) ? ` @ ${lang === 'ar' ? (a.companyAr || a.company) : a.company}` : ''}</p>}
              {a.featured && <span style={{ display: 'inline-block', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: 'rgba(245,158,11,0.1)', color: '#d97706', marginTop: 4 }}>★ {u.featured}</span>}
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              <button className="dash-icon-btn" onClick={() => setEditAlumniId(a.id)} title={u.edit}><Pencil style={{ width: 15, height: 15, color: 'var(--accent)' }} /></button>
              <button className="dash-icon-btn" onClick={() => deleteAlumni(a.id)} title={u.delete}><Trash2 style={{ width: 15, height: 15, color: '#ef4444' }} /></button>
            </div>
          </div>
        ))}
        {alumniList.length === 0 && (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text2)', gridColumn: '1 / -1' }}>
            <GraduationCap style={{ width: 36, height: 36, margin: '0 auto 12px', opacity: 0.3 }} />
            <p style={{ fontWeight: 600 }}>{u.noResults}</p>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default AlumniSection;
