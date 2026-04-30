import React from 'react';
import Plus from 'lucide-react/dist/esm/icons/plus';
import Pencil from 'lucide-react/dist/esm/icons/pencil';
import Trash2 from 'lucide-react/dist/esm/icons/trash-2';

interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

interface HeroSectionProps {
  hero: HeroSlide[];
  setAddHeroOpen: (v: boolean) => void;
  setEditHeroId: (v: number | null) => void;
  deleteHeroSlide: (id: number) => void;
  u: Record<string, string>;
  lang: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  hero, setAddHeroOpen, setEditHeroId, deleteHeroSlide, u, lang
}) => (
  <div className="section-enter">
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
      <div><h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)' }}>{u.hero}</h2><p style={{ fontSize: 13, color: 'var(--text2)', marginTop: 2 }}>{u.heroManage}</p></div>
      <button className="dash-btn dash-btn-primary" onClick={() => setAddHeroOpen(true)}><Plus className="w-4 h-4" />{lang === 'ar' ? 'إضافة شريحة' : 'Add Slide'}</button>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {hero.map((s, i) => (
        <div key={s.id} className="hero-card">
          {s.image && <div style={{ position: 'relative', height: 160, overflow: 'hidden' }}><img src={s.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /><div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }} /><span style={{ position: 'absolute', bottom: 12, left: 16, right: 16, color: 'white', fontWeight: 800, fontSize: 18 }}>{s.title}</span></div>}
          <div style={{ padding: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: 14, flexShrink: 0 }}>{i + 1}</div>
              <div>
                <p style={{ fontWeight: 700, color: 'var(--text)', fontSize: 14 }}>{s.title || (lang === 'ar' ? '(بدون نص)' : '(No text)')}</p>
                <p style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600 }}>{s.subtitle}</p>
                <p style={{ fontSize: 12, color: 'var(--text2)', marginTop: 4, maxWidth: 400 }}>{s.description}</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="dash-btn dash-btn-ghost" onClick={() => setEditHeroId(s.id)}><Pencil style={{ width: 14, height: 14 }} />{u.edit}</button>
              <button className="dash-btn dash-btn-danger" onClick={() => deleteHeroSlide(s.id)}><Trash2 style={{ width: 14, height: 14 }} /></button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default HeroSection;
