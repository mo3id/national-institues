import React from 'react';
import Plus from 'lucide-react/dist/esm/icons/plus';
import Pencil from 'lucide-react/dist/esm/icons/pencil';
import Trash2 from 'lucide-react/dist/esm/icons/trash-2';
import Search from 'lucide-react/dist/esm/icons/search';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import type { DashSchool } from '../types';

interface SchoolsSectionProps {
  schools: DashSchool[];
  schoolSearch: string;
  setSchoolSearch: (v: string) => void;
  setAddSchoolOpen: (v: boolean) => void;
  setEditSchoolId: (v: string | null) => void;
  deleteSchool: (id: string) => void;
  u: Record<string, string>;
  isRTL: boolean;
  lang: string;
  isTableLoading: boolean;
}

const SchoolsSection: React.FC<SchoolsSectionProps> = ({
  schools, schoolSearch, setSchoolSearch, setAddSchoolOpen, setEditSchoolId, deleteSchool, u, isRTL, lang, isTableLoading
}) => (
  <div className="section-enter">
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
      <div><h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)' }}>{u.schools}</h2><p style={{ fontSize: 13, color: 'var(--text2)', marginTop: 2 }}>{u.schoolsManage}</p></div>
      <button className="dash-btn dash-btn-primary" onClick={() => setAddSchoolOpen(true)}><Plus style={{ width: 15, height: 15 }} />{u.addSchool}</button>
    </div>
    <div style={{ position: 'relative', marginBottom: 18, maxWidth: 320 }}>
      <Search style={{ position: 'absolute', left: isRTL ? 'auto' : 14, right: isRTL ? 14 : 'auto', top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: 'var(--text2)' }} />
      <input className="dash-input" style={{ paddingLeft: isRTL ? 14 : 40, paddingRight: isRTL ? 40 : 14 }} placeholder={u.search} value={schoolSearch} onChange={e => setSchoolSearch(e.target.value)} />
    </div>
    <div style={{ position: 'relative' }}>
      {isTableLoading && (
        <div className="table-loader" style={{ borderRadius: 24 }}>
          <div style={{ width: 32, height: 32, border: '4px solid var(--accent)', borderTopColor: 'transparent', borderRadius: '50%' }} className="animate-spin"></div>
        </div>
      )}
      <div className="school-grid">
        {schools.map(s => (
          <div key={s.id} className="school-card">
            <img src={s.logo || undefined} style={{ width: 52, height: 52, borderRadius: 12, objectFit: 'cover', background: 'var(--surface2)', flexShrink: 0 }} alt={s.name} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontWeight: 700, fontSize: 13, color: 'var(--text)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{lang === 'ar' ? (s.nameAr || s.name) : s.name}</p>
              <p style={{ fontSize: 11, color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}><MapPin style={{ width: 11, height: 11 }} />{lang === 'ar' ? (s.locationAr || s.location) : s.location}{s.governorate ? `, ${lang === 'ar' ? (s.governorateAr || s.governorate) : s.governorate}` : ''}</p>
              <div style={{ marginTop: 6, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {(Array.isArray(s.type) ? s.type : []).map((t: string) => {
                  const typeMap: Record<string, string> = {
                    'Arabic': 'عربي/قومي',
                    'Languages': 'لغات',
                    'American': 'أمريكي',
                    'British': 'بريطاني',
                    'French': 'فرنسي'
                  };
                  return (
                    <span key={t} style={{ display: 'inline-block', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: 'rgba(79,70,229,0.1)', color: 'var(--accent)' }}>
                      {lang === 'ar' ? (typeMap[t] || t) : t}
                    </span>
                  );
                })}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              <button className="dash-icon-btn" onClick={() => setEditSchoolId(s.id)} title={u.edit}><Pencil style={{ width: 15, height: 15, color: 'var(--accent)' }} /></button>
              <button className="dash-icon-btn" onClick={() => deleteSchool(s.id)} title={u.delete}><Trash2 style={{ width: 15, height: 15, color: '#ef4444' }} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default SchoolsSection;
