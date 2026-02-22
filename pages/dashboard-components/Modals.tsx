import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import { DashNewsItem, HeroSlide, DashSchool, Lang, UI } from './types';

interface ModalWrapProps { title: string; onClose: () => void; children: React.ReactNode; }
export const ModalWrap: React.FC<ModalWrapProps> = ({ title, onClose, children }) => (
    <div className="dash-modal-overlay" onClick={onClose}>
        <div className="dash-modal" onClick={e => e.stopPropagation()}>
            <div className="dash-modal-header">
                <h3 className="dash-modal-title">{title}</h3>
                <button onClick={onClose} className="dash-icon-btn"><X className="w-5 h-5" /></button>
            </div>
            <div className="dash-modal-body">{children}</div>
        </div>
    </div>
);

// ── Edit News ─────────────────────────────────────────────────────────────────
interface EditNewsProps { article: DashNewsItem; lang: Lang; onSave: (a: DashNewsItem) => void; onCancel: () => void; }
export const EditNewsForm: React.FC<EditNewsProps> = ({ article, lang, onSave, onCancel }) => {
    const [d, setD] = useState({ ...article });
    const u = UI[lang];
    return (
        <form className="form-grid" onSubmit={e => { e.preventDefault(); onSave(d); }}>
            <div className="form-col">
                <label className="dash-label">{u.titleEn}</label>
                <input className="dash-input" value={d.title} onChange={e => setD(p => ({ ...p, title: e.target.value }))} />
            </div>
            <div className="form-col">
                <label className="dash-label">{u.titleAr}</label>
                <input className="dash-input" dir="rtl" value={d.titleAr} onChange={e => setD(p => ({ ...p, titleAr: e.target.value }))} />
            </div>
            <div className="form-col">
                <label className="dash-label">{u.summaryEn}</label>
                <textarea className="dash-input dash-ta" value={d.summary} onChange={e => setD(p => ({ ...p, summary: e.target.value }))} />
            </div>
            <div className="form-col">
                <label className="dash-label">{u.summaryAr}</label>
                <textarea className="dash-input dash-ta" dir="rtl" value={d.summaryAr} onChange={e => setD(p => ({ ...p, summaryAr: e.target.value }))} />
            </div>
            <div>
                <label className="dash-label">{u.date}</label>
                <input className="dash-input" type="date" value={d.date} onChange={e => setD(p => ({ ...p, date: e.target.value }))} />
            </div>
            <div>
                <label className="dash-label">{u.imageUrl}</label>
                <input className="dash-input" value={d.image} onChange={e => setD(p => ({ ...p, image: e.target.value }))} placeholder="https://..." />
            </div>
            {d.image && <div className="form-full"><img src={d.image} alt="" className="dash-img-preview" /></div>}
            <div className="form-full flex items-center gap-3">
                <input type="checkbox" id="ep" checked={d.published} onChange={e => setD(p => ({ ...p, published: e.target.checked }))} className="dash-cb" />
                <label htmlFor="ep" className="dash-cb-label">{u.publishNow}</label>
            </div>
            <div className="form-full dash-form-actions">
                <button type="submit" className="dash-btn dash-btn-primary"><Save className="w-4 h-4" />{u.save}</button>
                <button type="button" className="dash-btn dash-btn-ghost" onClick={onCancel}>{u.cancel}</button>
            </div>
        </form>
    );
};

// ── Edit Hero ─────────────────────────────────────────────────────────────────
interface EditHeroProps { slide: HeroSlide; lang: Lang; onSave: (s: HeroSlide) => void; onCancel: () => void; }
export const EditHeroForm: React.FC<EditHeroProps> = ({ slide, lang, onSave, onCancel }) => {
    const [d, setD] = useState({ ...slide });
    const u = UI[lang];
    return (
        <form className="form-grid" onSubmit={e => { e.preventDefault(); onSave(d); }}>
            <div className="form-full">
                <label className="dash-label">{u.slideTitle}</label>
                <input className="dash-input" value={d.title} onChange={e => setD(p => ({ ...p, title: e.target.value }))} />
            </div>
            <div className="form-full">
                <label className="dash-label">{u.slideSubtitle}</label>
                <input className="dash-input" value={d.subtitle} onChange={e => setD(p => ({ ...p, subtitle: e.target.value }))} />
            </div>
            <div className="form-full">
                <label className="dash-label">{u.slideDesc}</label>
                <textarea className="dash-input dash-ta" value={d.description} onChange={e => setD(p => ({ ...p, description: e.target.value }))} />
            </div>
            <div className="form-full">
                <label className="dash-label">{u.slideImage}</label>
                <input className="dash-input" value={d.image} onChange={e => setD(p => ({ ...p, image: e.target.value }))} placeholder="https://..." />
            </div>
            {d.image && (
                <div className="form-full">
                    <img src={d.image} alt="Preview" className="w-full h-44 object-cover rounded-xl" onError={e => (e.currentTarget.style.display = 'none')} />
                </div>
            )}
            <div className="form-full dash-form-actions">
                <button type="submit" className="dash-btn dash-btn-primary"><Save className="w-4 h-4" />{u.save}</button>
                <button type="button" className="dash-btn dash-btn-ghost" onClick={onCancel}>{u.cancel}</button>
            </div>
        </form>
    );
};

// ── Edit School ───────────────────────────────────────────────────────────────
interface EditSchoolProps { school: DashSchool; lang: Lang; onSave: (s: DashSchool) => void; onCancel: () => void; }
export const EditSchoolForm: React.FC<EditSchoolProps> = ({ school, lang, onSave, onCancel }) => {
    const [d, setD] = useState({ ...school });
    const u = UI[lang];
    return (
        <form className="form-grid" onSubmit={e => { e.preventDefault(); onSave(d); }}>
            <div className="form-full">
                <label className="dash-label">{u.schoolName}</label>
                <input className="dash-input" value={d.name} onChange={e => setD(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div>
                <label className="dash-label">{u.location}</label>
                <input className="dash-input" value={d.location} onChange={e => setD(p => ({ ...p, location: e.target.value }))} />
            </div>
            <div>
                <label className="dash-label">{u.governorate}</label>
                <input className="dash-input" value={d.governorate} onChange={e => setD(p => ({ ...p, governorate: e.target.value }))} />
            </div>
            <div>
                <label className="dash-label">{u.principal}</label>
                <input className="dash-input" value={d.principal} onChange={e => setD(p => ({ ...p, principal: e.target.value }))} />
            </div>
            <div>
                <label className="dash-label">{u.type}</label>
                <select className="dash-input" value={d.type} onChange={e => setD(p => ({ ...p, type: e.target.value }))}>
                    {['Language', 'National', 'International'].map(t => <option key={t}>{t}</option>)}
                </select>
            </div>
            <div className="form-full">
                <label className="dash-label">{u.logo}</label>
                <input className="dash-input" value={d.logo} onChange={e => setD(p => ({ ...p, logo: e.target.value }))} placeholder="https://..." />
            </div>
            {d.logo && <div className="form-full"><img src={d.logo} alt="" className="w-16 h-16 rounded-xl object-cover" onError={e => (e.currentTarget.style.display = 'none')} /></div>}
            <div className="form-full dash-form-actions">
                <button type="submit" className="dash-btn dash-btn-primary"><Save className="w-4 h-4" />{u.save}</button>
                <button type="button" className="dash-btn dash-btn-ghost" onClick={onCancel}>{u.cancel}</button>
            </div>
        </form>
    );
};
