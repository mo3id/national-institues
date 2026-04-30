import React from 'react';
import Plus from 'lucide-react/dist/esm/icons/plus';
import Pencil from 'lucide-react/dist/esm/icons/pencil';
import Trash2 from 'lucide-react/dist/esm/icons/trash-2';
import Search from 'lucide-react/dist/esm/icons/search';
import Briefcase from 'lucide-react/dist/esm/icons/briefcase';
import type { DashJob } from '../types';

interface JobsSectionProps {
  jobs: DashJob[];
  jobSearch: string;
  setJobSearch: (v: string) => void;
  setAddJobOpen: (v: boolean) => void;
  setEditJobId: (v: string | null) => void;
  deleteJob: (id: string) => void;
  u: Record<string, string>;
  isRTL: boolean;
  lang: string;
  isTableLoading: boolean;
}

const JobsSection: React.FC<JobsSectionProps> = ({
  jobs, jobSearch, setJobSearch, setAddJobOpen, setEditJobId, deleteJob, u, isRTL, lang, isTableLoading
}) => (
  <div className="section-enter">
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
      <div><h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)' }}>{u.jobs}</h2><p style={{ fontSize: 13, color: 'var(--text2)', marginTop: 2 }}>{u.jobsManage}</p></div>
      <button className="dash-btn dash-btn-primary" onClick={() => setAddJobOpen(true)}><Plus style={{ width: 15, height: 15 }} />{u.addJob}</button>
    </div>
    <div style={{ position: 'relative', marginBottom: 18, maxWidth: 320 }}>
      <Search style={{ position: 'absolute', left: isRTL ? 'auto' : 14, right: isRTL ? 14 : 'auto', top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: 'var(--text2)' }} />
      <input className="dash-input" style={{ paddingLeft: isRTL ? 14 : 40, paddingRight: isRTL ? 40 : 14 }} placeholder={u.search} value={jobSearch} onChange={e => setJobSearch(e.target.value)} />
    </div>
    <div className="dash-card" style={{ overflow: 'hidden', overflowX: 'auto', position: 'relative' }}>
      {isTableLoading && (
        <div className="table-loader">
          <div style={{ width: 32, height: 32, border: '4px solid var(--accent)', borderTopColor: 'transparent', borderRadius: '50%' }} className="animate-spin"></div>
        </div>
      )}
      <table style={{ width: '100%', minWidth: 600, borderCollapse: 'collapse' }}>
        <thead style={{ background: 'var(--surface2)', borderBottom: '1px solid var(--border)' }}>
          <tr>
            <th style={{ padding: '14px 24px', textAlign: isRTL ? 'right' : 'left', fontSize: 12, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{u.title}</th>
            <th style={{ padding: '14px 24px', textAlign: isRTL ? 'right' : 'left', fontSize: 12, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{u.department}</th>
            <th style={{ padding: '14px 24px', textAlign: isRTL ? 'right' : 'left', fontSize: 12, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{u.location}</th>
            <th style={{ padding: '14px 24px', textAlign: isRTL ? 'right' : 'left', fontSize: 12, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{u.actions}</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job, i) => (
            <tr key={job.id} style={{ borderBottom: i === jobs.length - 1 ? 'none' : '1px solid var(--border)', transition: 'background 0.2s ease' }} onMouseOver={e => e.currentTarget.style.background = 'var(--surface2)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
              <td style={{ padding: '16px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 10, overflow: 'hidden', background: 'var(--surface2)', flexShrink: 0, border: '1px solid var(--border)' }}>
                    <img src={job.image || "/layer-1-small.webp"} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 13, color: 'var(--text)' }}>{lang === 'ar' ? job.titleAr : job.title}</p>
                    <p style={{ fontSize: 11, color: 'var(--text2)', fontWeight: 500 }}>{lang === 'ar' ? job.typeAr : job.type}</p>
                  </div>
                </div>
              </td>
              <td style={{ padding: '16px 24px', color: 'var(--text2)', fontSize: 13 }}>{lang === 'ar' ? job.departmentAr : job.department}</td>
              <td style={{ padding: '16px 24px', color: 'var(--text2)', fontSize: 13 }}>{lang === 'ar' ? job.locationAr : job.location}</td>
              <td style={{ padding: '16px 24px', display: 'flex', gap: 4 }}>
                <button className="dash-icon-btn" onClick={() => setEditJobId(job.id)} title={u.edit}><Pencil style={{ width: 15, height: 15, color: 'var(--accent)' }} /></button>
                <button className="dash-icon-btn" onClick={() => deleteJob(job.id)} title={u.delete}><Trash2 style={{ width: 15, height: 15, color: '#ef4444' }} /></button>
              </td>
            </tr>
          ))}
          {jobs.length === 0 && <tr><td colSpan={4} style={{ padding: '48px', textAlign: 'center', color: 'var(--text2)' }}><Briefcase style={{ width: 36, height: 36, margin: '0 auto 12px', opacity: 0.3 }} /><p style={{ fontWeight: 600 }}>{u.noResults}</p></td></tr>}
        </tbody>
      </table>
    </div>
  </div>
);

export default JobsSection;
