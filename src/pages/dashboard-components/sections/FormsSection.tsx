import React from 'react';
import Save from 'lucide-react/dist/esm/icons/save';

interface FormsSectionProps {
  formSettings: any;
  setFormSettings: (v: any) => void;
  saveFormSettings: () => void;
  u: Record<string, string>;
}

const FormsSection: React.FC<FormsSectionProps> = ({
  formSettings, setFormSettings, saveFormSettings, u
}) => (
  <div className="section-enter">
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
      <div><h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)' }}>{u.forms}</h2><p style={{ fontSize: 13, color: 'var(--text2)', marginTop: 2 }}>{u.formsManage}</p></div>
      <button className="dash-btn dash-btn-primary" onClick={saveFormSettings}><Save style={{ width: 14, height: 14 }} />{u.save}</button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="dash-card" style={{ padding: 24 }}>
        <h3 className="font-bold mb-4 text-[var(--text)]">{u.contactForm}</h3>
        <div className="space-y-4">
          <div><label className="dash-label">Title (EN)</label><input className="dash-input" value={formSettings?.contactFormTitle || ''} onChange={e => setFormSettings((p: any) => ({ ...p, contactFormTitle: e.target.value }))} /></div>
          <div><label className="dash-label">{u.titleArLabel}</label><input className="dash-input" dir="rtl" value={formSettings?.contactFormTitleAr || ''} onChange={e => setFormSettings((p: any) => ({ ...p, contactFormTitleAr: e.target.value }))} /></div>
          <div><label className="dash-label">{u.descriptionEnLabel}</label><textarea className="dash-input" value={formSettings?.contactFormDesc || ''} onChange={e => setFormSettings((p: any) => ({ ...p, contactFormDesc: e.target.value }))} /></div>
          <div><label className="dash-label">{u.descArLabel}</label><textarea className="dash-input" dir="rtl" value={formSettings?.contactFormDescAr || ''} onChange={e => setFormSettings((p: any) => ({ ...p, contactFormDescAr: e.target.value }))} /></div>
        </div>
      </div>
      <div className="dash-card" style={{ padding: 24 }}>
        <h3 className="font-bold mb-4 text-[var(--text)]">{u.careersForm}</h3>
        <div className="space-y-4">
          <div><label className="dash-label">Title (EN)</label><input className="dash-input" value={formSettings?.jobFormTitle || ''} onChange={e => setFormSettings((p: any) => ({ ...p, jobFormTitle: e.target.value }))} /></div>
          <div><label className="dash-label">{u.titleArLabel}</label><input className="dash-input" dir="rtl" value={formSettings?.jobFormTitleAr || ''} onChange={e => setFormSettings((p: any) => ({ ...p, jobFormTitleAr: e.target.value }))} /></div>
          <div><label className="dash-label">{u.descriptionEnLabel}</label><textarea className="dash-input" value={formSettings?.jobFormDesc || ''} onChange={e => setFormSettings((p: any) => ({ ...p, jobFormDesc: e.target.value }))} /></div>
          <div><label className="dash-label">{u.descArLabel}</label><textarea className="dash-input" dir="rtl" value={formSettings?.jobFormDescAr || ''} onChange={e => setFormSettings((p: any) => ({ ...p, jobFormDescAr: e.target.value }))} /></div>
        </div>
      </div>
    </div>
  </div>
);

export default FormsSection;
