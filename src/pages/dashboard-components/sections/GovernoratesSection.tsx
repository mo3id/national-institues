import React from 'react';
import Plus from 'lucide-react/dist/esm/icons/plus';
import Trash2 from 'lucide-react/dist/esm/icons/trash-2';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';

interface GovernoratesSectionProps {
  governorates: { id: string; name: string; nameAr: string }[];
  setAddGovernorateOpen: (v: boolean) => void;
  handleDeleteGovernorate: (id: string) => void;
  u: Record<string, string>;
  isRTL: boolean;
}

const GovernoratesSection: React.FC<GovernoratesSectionProps> = ({
  governorates, setAddGovernorateOpen, handleDeleteGovernorate, u, isRTL
}) => (
  <div className="section-enter">
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
      <div><h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)' }}>{u.governoratesTitle}</h2></div>
      <button className="dash-btn dash-btn-primary" onClick={() => setAddGovernorateOpen(true)}><Plus style={{ width: 15, height: 15 }} />{u.newGov}</button>
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
          {governorates.map((gov, i) => (
            <tr key={gov.id} style={{ borderBottom: i === governorates.length - 1 ? 'none' : '1px solid var(--border)', transition: 'background 0.2s ease' }} onMouseOver={e => e.currentTarget.style.background = 'var(--surface2)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
              <td style={{ padding: '16px 24px', color: 'var(--text)', fontWeight: 600, fontSize: 13 }}>{gov.name}</td>
              <td style={{ padding: '16px 24px', color: 'var(--text)', fontSize: 13 }}>{gov.nameAr}</td>
              <td style={{ padding: '16px 24px' }}>
                <button className="dash-icon-btn" onClick={() => handleDeleteGovernorate(gov.id)} title={u.delete}><Trash2 style={{ width: 15, height: 15, color: '#ef4444' }} /></button>
              </td>
            </tr>
          ))}
          {governorates.length === 0 && <tr><td colSpan={3} style={{ padding: '48px', textAlign: 'center', color: 'var(--text2)' }}><MapPin style={{ width: 36, height: 36, margin: '0 auto 12px', opacity: 0.3 }} /><p style={{ fontWeight: 600 }}>{u.noResults}</p></td></tr>}
        </tbody>
      </table>
    </div>
  </div>
);

export default GovernoratesSection;
