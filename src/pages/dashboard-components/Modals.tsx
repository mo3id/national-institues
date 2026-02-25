import React, { useState } from 'react';
import { Save, X, Plus } from 'lucide-react';
import { DashNewsItem, HeroSlide, DashSchool, DashJob, Lang, UI } from './types';
import { CustomSelect, CustomDatePicker, ImageUpload } from '../../components/common/FormControls';
import { Filter, Calendar } from 'lucide-react';

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
                <CustomDatePicker value={d.date} onChange={val => setD(p => ({ ...p, date: val }))} />
            </div>
            <div className="form-full">
                <ImageUpload label={u.imageUrl} value={d.image} onChange={val => setD(p => ({ ...p, image: val }))} />
            </div>
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
                <ImageUpload label={u.slideImage} value={d.image} onChange={val => setD(p => ({ ...p, image: val }))} />
            </div>
            <div className="form-full dash-form-actions">
                <button type="submit" className="dash-btn dash-btn-primary"><Save className="w-4 h-4" />{u.save}</button>
                <button type="button" className="dash-btn dash-btn-ghost" onClick={onCancel}>{u.cancel}</button>
            </div>
        </form>
    );
};

// ── Edit School ───────────────────────────────────────────────────────────────
interface EditSchoolProps { school: Partial<DashSchool>; lang: Lang; onSave: (s: DashSchool) => void; onCancel: () => void; }
export const EditSchoolForm: React.FC<EditSchoolProps> = ({ school, lang, onSave, onCancel }) => {
    const [d, setD] = useState({ ...school });
    const u = UI[lang];
    const governorates = [
        { value: 'Cairo', label: lang === 'ar' ? 'القاهرة' : 'Cairo' },
        { value: 'Alexandria', label: lang === 'ar' ? 'الإسكندرية' : 'Alexandria' },
        { value: 'Giza', label: lang === 'ar' ? 'الجيزة' : 'Giza' },
        { value: 'Dakahlia', label: lang === 'ar' ? 'الدقهلية' : 'Dakahlia' },
        { value: 'Gharbia', label: lang === 'ar' ? 'الغربية' : 'Gharbia' },
    ];

    return (
        <form className="form-grid" onSubmit={e => { e.preventDefault(); onSave(d as DashSchool); }}>
            <div className="form-full">
                <label className="dash-label">{u.schoolName}</label>
                <input className="dash-input" value={d.name || ''} onChange={e => setD(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div>
                <label className="dash-label">{u.location}</label>
                <input className="dash-input" value={d.location || ''} onChange={e => setD(p => ({ ...p, location: e.target.value }))} />
            </div>
            <div>
                <label className="dash-label">{u.governorate}</label>
                <CustomSelect
                    value={d.governorate || ''}
                    onChange={val => {
                        const gov = governorates.find(g => g.value === val);
                        setD(p => ({ ...p, governorate: val, governorateAr: gov?.label }));
                    }}
                    options={governorates}
                />
            </div>
            <div>
                <label className="dash-label">{u.principal}</label>
                <input className="dash-input" value={d.principal || ''} onChange={e => setD(p => ({ ...p, principal: e.target.value }))} />
            </div>
            <div>
                <label className="dash-label">{u.type}</label>
                <CustomSelect
                    value={d.type || ''}
                    onChange={val => setD(p => ({ ...p, type: val }))}
                    options={[
                        { value: 'Language', label: lang === 'ar' ? 'لغات' : 'Language' },
                        { value: 'National', label: lang === 'ar' ? 'قومي' : 'National' },
                        { value: 'International', label: lang === 'ar' ? 'دولي' : 'International' }
                    ]}
                />
            </div>
            <div className="form-full">
                <ImageUpload label={u.mainImage} value={d.mainImage || ''} onChange={val => setD(p => ({ ...p, mainImage: val }))} />
            </div>
            <div className="form-full">
                <ImageUpload label={u.logo} value={d.logo || ''} onChange={val => setD(p => ({ ...p, logo: val }))} />
            </div>
            <div className="form-full" style={{ borderTop: '1px solid var(--border)', paddingTop: '20px', marginTop: '10px' }}>
                <label className="dash-label" style={{ marginBottom: '15px', display: 'block' }}>{u.gallery} (Max 8)</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
                    {(d.gallery || []).map((img, idx) => (
                        <div key={idx} style={{ position: 'relative' }}>
                            <ImageUpload
                                value={img}
                                onChange={val => {
                                    const newGallery = [...(d.gallery || [])];
                                    newGallery[idx] = val;
                                    setD(p => ({ ...p, gallery: newGallery }));
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    const newGallery = (d.gallery || []).filter((_, i) => i !== idx);
                                    setD(p => ({ ...p, gallery: newGallery }));
                                }}
                                style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <X size={12} />
                            </button>
                        </div>
                    ))}
                    {(d.gallery || []).length < 8 && (
                        <button
                            type="button"
                            className="dash-btn dash-btn-ghost"
                            style={{ height: '140px', border: '2px dashed var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                            onClick={() => setD(p => ({ ...p, gallery: [...(p.gallery || []), ''] }))}
                        >
                            <Plus size={20} />
                            <span>{u.addImage}</span>
                        </button>
                    )}
                </div>
            </div>
            <div className="form-full dash-form-actions">
                <button type="submit" className="dash-btn dash-btn-primary"><Save className="w-4 h-4" />{u.save}</button>
                <button type="button" className="dash-btn dash-btn-ghost" onClick={onCancel}>{u.cancel}</button>
            </div>
        </form>
    );
};

// ── Edit Job ─────────────────────────────────────────────────────────────────
interface EditJobProps { job: Partial<DashJob>; lang: Lang; onSave: (j: DashJob) => void; onCancel: () => void; }
export const EditJobForm: React.FC<EditJobProps> = ({ job, lang, onSave, onCancel }) => {
    const [d, setD] = useState<Partial<DashJob>>({ ...job });
    const u = UI[lang];
    const jobTypes = [
        { value: 'Full-time', labelAr: 'دوام كامل', labelEn: 'Full-time' },
        { value: 'Part-time', labelAr: 'دوام جزئي', labelEn: 'Part-time' },
        { value: 'Contract', labelAr: 'عقد', labelEn: 'Contract' },
        { value: 'Internship', labelAr: 'تدريب', labelEn: 'Internship' },
    ];

    return (
        <form className="form-grid" onSubmit={e => { e.preventDefault(); onSave(d as DashJob); }}>
            <div className="form-col">
                <label className="dash-label">{u.titleEn || 'Title (EN)'}</label>
                <input className="dash-input" value={d.title || ''} onChange={e => setD(p => ({ ...p, title: e.target.value }))} />
            </div>
            <div className="form-col">
                <label className="dash-label">{u.titleAr || 'Title (AR)'}</label>
                <input className="dash-input" dir="rtl" value={d.titleAr || ''} onChange={e => setD(p => ({ ...p, titleAr: e.target.value }))} />
            </div>
            <div className="form-col">
                <label className="dash-label">Department (EN)</label>
                <input className="dash-input" value={d.department || ''} onChange={e => setD(p => ({ ...p, department: e.target.value }))} />
            </div>
            <div className="form-col">
                <label className="dash-label">القسم (عربي)</label>
                <input className="dash-input" dir="rtl" value={d.departmentAr || ''} onChange={e => setD(p => ({ ...p, departmentAr: e.target.value }))} />
            </div>
            <div className="form-col">
                <label className="dash-label">Location (EN)</label>
                <input className="dash-input" value={d.location || ''} onChange={e => setD(p => ({ ...p, location: e.target.value }))} />
            </div>
            <div className="form-col">
                <label className="dash-label">الموقع (عربي)</label>
                <input className="dash-input" dir="rtl" value={d.locationAr || ''} onChange={e => setD(p => ({ ...p, locationAr: e.target.value }))} />
            </div>
            <div className="form-col">
                <label className="dash-label">Type</label>
                <CustomSelect
                    value={d.type || ''}
                    onChange={val => {
                        const type = jobTypes.find(t => t.value === val);
                        setD(p => ({ ...p, type: val, typeAr: type?.labelAr }));
                    }}
                    options={jobTypes.map(t => ({ value: t.value, label: lang === 'ar' ? t.labelAr : t.labelEn }))}
                />
            </div>
            <div className="form-full">
                <label className="dash-label">Description (EN)</label>
                <textarea className="dash-input dash-ta" value={d.description || ''} onChange={e => setD(p => ({ ...p, description: e.target.value }))} />
            </div>
            <div className="form-full">
                <label className="dash-label">الوصف (عربي)</label>
                <textarea className="dash-input dash-ta" dir="rtl" value={d.descriptionAr || ''} onChange={e => setD(p => ({ ...p, descriptionAr: e.target.value }))} />
            </div>
            <div className="form-full dash-form-actions">
                <button type="submit" className="dash-btn dash-btn-primary"><Save className="w-4 h-4" />{u.save}</button>
                <button type="button" className="dash-btn dash-btn-ghost" onClick={onCancel}>{u.cancel}</button>
            </div>
        </form>
    );
};
