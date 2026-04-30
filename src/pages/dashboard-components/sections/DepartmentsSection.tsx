import React from 'react';
import Plus from 'lucide-react/dist/esm/icons/plus';
import Trash2 from 'lucide-react/dist/esm/icons/trash-2';
import LayoutDashboard from 'lucide-react/dist/esm/icons/layout-dashboard';

interface DepartmentsSectionProps {
  departments: { id: string; nameEn: string; nameAr: string }[];
  addDepartmentOpen: boolean;
  setAddDepartmentOpen: (v: boolean) => void;
  newDepartment: { nameEn: string; nameAr: string };
  setNewDepartment: (v: { nameEn: string; nameAr: string }) => void;
  addDepartment: () => void;
  deleteDepartment: (id: string) => void;
  u: Record<string, string>;
  isRTL: boolean;
}

const DepartmentsSection: React.FC<DepartmentsSectionProps> = ({
  departments, addDepartmentOpen, setAddDepartmentOpen, newDepartment, setNewDepartment, addDepartment, deleteDepartment, u, isRTL
}) => (
  <div className="section-enter">
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
      <div><h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)' }}>{u.jobDepartmentsTitle}</h2></div>
      <button className="dash-btn dash-btn-primary" onClick={() => setAddDepartmentOpen(true)}><Plus style={{ width: 15, height: 15 }} />{u.newDept}</button>
    </div>
    <div className="dash-card" style={{ overflow: 'hidden', overflowX: 'auto', position: 'relative' }}>
      <table style={{ width: '100%', minWidth: 600, borderCollapse: 'collapse' }}>
        <thead style={{ background: 'var(--surface2)', borderBottom: '1px solid var(--border)' }}>
          <tr>
            <th style={{ padding: '14px 24px', textAlign: isRTL ? 'right' : 'left', fontSize: 12, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{u.nameEn}</th>
            <th style={{ padding: '14px 24px', textAlign: isRTL ? 'right' : 'left', fontSize: 12, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{u.nameAr}</th>
            <th style={{ padding: '14px 24px', textAlign: isRTL ? 'right' : 'left', fontSize: 12, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{u.actions}</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((dep, i) => (
            <tr key={dep.id} style={{ borderBottom: i === departments.length - 1 ? 'none' : '1px solid var(--border)', transition: 'background 0.2s ease' }} onMouseOver={e => e.currentTarget.style.background = 'var(--surface2)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
              <td style={{ padding: '16px 24px', color: 'var(--text)', fontWeight: 600, fontSize: 13 }}>{dep.nameEn}</td>
              <td style={{ padding: '16px 24px', color: 'var(--text)', fontSize: 13 }}>{dep.nameAr}</td>
              <td style={{ padding: '16px 24px' }}>
                <button className="dash-icon-btn" onClick={() => deleteDepartment(dep.id)} title={u.delete}><Trash2 style={{ width: 15, height: 15, color: '#ef4444' }} /></button>
              </td>
            </tr>
          ))}
          {departments.length === 0 && <tr><td colSpan={3} style={{ padding: '48px', textAlign: 'center', color: 'var(--text2)' }}><LayoutDashboard style={{ width: 36, height: 36, margin: '0 auto 12px', opacity: 0.3 }} /><p style={{ fontWeight: 600 }}>{u.noResults}</p></td></tr>}
        </tbody>
      </table>
    </div>
  </div>
);

export default DepartmentsSection;
