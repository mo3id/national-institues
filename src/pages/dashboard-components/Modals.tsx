import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useSiteData } from '@/context/DataContext';
import { DashNewsItem, DashSchool, DashJob, HeroSlide } from './types';
import { CustomSelect, CustomMultiSelect, ImageUpload, CustomDatePicker } from '@/components/common/FormControls';
import { getDashNewsSchema, getDashSchoolSchema, getDashJobSchema } from '@/utils/validations';
import Save from 'lucide-react/dist/esm/icons/save';
import X from 'lucide-react/dist/esm/icons/x';
import Plus from 'lucide-react/dist/esm/icons/plus';
import { Lang, UI } from './types';
import { getDashHeroSchema } from '@/utils/validations';

// helper to convert File to base64 string
// helper to convert File to base64 string with automatic client-side compression
const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            // Compress large images to avoid "Payload Too Large" PHP errors via base64
            const MAX_WIDTH = 1200;
            const MAX_HEIGHT = 1200;
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
            } else {
                if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;
                }
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);

            // Output as WebP for smaller size and high quality
            resolve(canvas.toDataURL('image/webp', 0.8));
        };
        img.onerror = err => reject(err);
        img.src = e.target?.result as string;
    };
    reader.onerror = err => reject(err);
    reader.readAsDataURL(file);
});

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
    const [errors, setErrors] = useState<Record<string, string>>({});
    const u = UI[lang];

    return (
        <form className="form-grid" noValidate onSubmit={e => {
            e.preventDefault();
            const res = getDashNewsSchema().safeParse(d);
            if (!res.success) {
                console.error("News validation failed:", res.error.issues); // <-- ADDED DEBUGGING
                const errs: Record<string, string> = {};
                res.error.issues.forEach(i => errs[i.path[0] as string] = i.message);
                setErrors(errs);
                return;
            }
            const payloadToSave = {
                ...d,
                title: d.title?.trim() ? d.title : d.titleAr,
                summary: d.summary?.trim() ? d.summary : d.summaryAr,
                content: d.content?.trim() ? d.content : d.contentAr,
                highlightTitle: d.highlightTitle?.trim() ? d.highlightTitle : d.highlightTitleAr,
                highlightContent: d.highlightContent?.trim() ? d.highlightContent : d.highlightContentAr,
            };
            onSave(payloadToSave);
        }}>
            <div className="form-col">
                <label className="dash-label">{u.titleEn}</label>
                <input className={`dash-input ${errors.title ? 'border-red-500' : ''}`} value={d.title} onChange={e => { setD(p => ({ ...p, title: e.target.value })); if (errors.title) setErrors(p => ({ ...p, title: '' })) }} />
                {errors.title && <span className="text-red-500 text-xs mt-1 block">{errors.title}</span>}
            </div>
            <div className="form-col">
                <label className="dash-label">{u.titleAr}</label>
                <input className={`dash-input ${errors.titleAr ? 'border-red-500' : ''}`} dir="rtl" value={d.titleAr} onChange={e => { setD(p => ({ ...p, titleAr: e.target.value })); if (errors.titleAr) setErrors(p => ({ ...p, titleAr: '' })) }} />
                {errors.titleAr && <span className="text-red-500 text-xs mt-1 block">{errors.titleAr}</span>}
            </div>
            <div className="form-col">
                <label className="dash-label">{u.summaryEn}</label>
                <textarea className={`dash-input dash-ta ${errors.summary ? 'border-red-500' : ''}`} value={d.summary} onChange={e => { setD(p => ({ ...p, summary: e.target.value })); if (errors.summary) setErrors(p => ({ ...p, summary: '' })) }} />
                {errors.summary && <span className="text-red-500 text-xs mt-1 block">{errors.summary}</span>}
            </div>
            <div className="form-col">
                <label className="dash-label">{u.summaryAr}</label>
                <textarea className={`dash-input dash-ta ${errors.summaryAr ? 'border-red-500' : ''}`} dir="rtl" value={d.summaryAr} onChange={e => { setD(p => ({ ...p, summaryAr: e.target.value })); if (errors.summaryAr) setErrors(p => ({ ...p, summaryAr: '' })) }} />
                {errors.summaryAr && <span className="text-red-500 text-xs mt-1 block">{errors.summaryAr}</span>}
            </div>
            <div className="form-full">
                <label className="dash-label">{u.contentEn}</label>
                <textarea className={`dash-input dash-ta ${errors.content ? 'border-red-500' : ''}`} style={{ minHeight: 180 }} placeholder="Full content of the news..." value={d.content || ''} onChange={e => { setD(p => ({ ...p, content: e.target.value })); if (errors.content) setErrors(p => ({ ...p, content: '' })) }} />
                {errors.content && <span className="text-red-500 text-xs mt-1 block">{errors.content}</span>}
            </div>
            <div className="form-full">
                <label className="dash-label">{u.contentAr}</label>
                <textarea className={`dash-input dash-ta ${errors.contentAr ? 'border-red-500' : ''}`} style={{ minHeight: 180 }} placeholder="تفاصيل الخبر بالكامل..." dir="rtl" value={d.contentAr || ''} onChange={e => { setD(p => ({ ...p, contentAr: e.target.value })); if (errors.contentAr) setErrors(p => ({ ...p, contentAr: '' })) }} />
                {errors.contentAr && <span className="text-red-500 text-xs mt-1 block">{errors.contentAr}</span>}
            </div>

            <div className="form-full mt-4 pt-4 border-t border-[var(--border)]">
                <h4 className="font-bold text-[var(--text)] mb-4">{lang === 'ar' ? 'القسم الإضافي (آفاق مستقبلية واعدة) - اختياري' : 'Highlight Section (Promising Future) - Optional'}</h4>
                <div className="form-grid">
                    <div className="form-col">
                        <label className="dash-label">{u.highlightTitleEn}</label>
                        <input className="dash-input" placeholder="Promising Future Horizons" value={d.highlightTitle || ''} onChange={e => setD(p => ({ ...p, highlightTitle: e.target.value }))} />
                    </div>
                    <div className="form-col">
                        <label className="dash-label">{u.highlightTitleAr}</label>
                        <input className="dash-input" dir="rtl" placeholder="آفاق مستقبلية واعدة" value={d.highlightTitleAr || ''} onChange={e => setD(p => ({ ...p, highlightTitleAr: e.target.value }))} />
                    </div>
                    <div className="form-col">
                        <label className="dash-label">{u.highlightContentEn}</label>
                        <textarea className="dash-input dash-ta" value={d.highlightContent || ''} onChange={e => setD(p => ({ ...p, highlightContent: e.target.value }))} />
                    </div>
                    <div className="form-col">
                        <label className="dash-label">{u.highlightContentAr}</label>
                        <textarea className="dash-input dash-ta" dir="rtl" value={d.highlightContentAr || ''} onChange={e => setD(p => ({ ...p, highlightContentAr: e.target.value }))} />
                    </div>
                </div>
            </div>
            <div>
                <label className="dash-label">{u.date}</label>
                <div className={errors.date ? 'border border-red-500 rounded' : ''}>
                    <CustomDatePicker value={d.date} onChange={val => { setD(p => ({ ...p, date: val })); if (errors.date) setErrors(p => ({ ...p, date: '' })) }} />
                </div>
                {errors.date && <span className="text-red-500 text-xs mt-1 block">{errors.date}</span>}
            </div>
            <div className="form-full">
                <div className={errors.image ? 'border border-red-500 p-2 rounded' : ''}>
                    <ImageUpload label={u.imageUrl} value={d.image} onChange={val => { setD(p => ({ ...p, image: val })); if (errors.image) setErrors(p => ({ ...p, image: '' })) }} />
                </div>
                {errors.image && <span className="text-red-500 text-xs mt-1 block">{errors.image}</span>}
            </div>
            <div className="form-full flex gap-4 mt-2 mb-2">
                <div className="flex items-center gap-2">
                    <input type="checkbox" id="ep" checked={Boolean(d.published)} onChange={e => setD(p => ({ ...p, published: e.target.checked }))} className="dash-cb" />
                    <label htmlFor="ep" className="dash-cb-label">{u.publishNow}</label>
                </div>
                <div className="flex items-center gap-2">
                    <input type="checkbox" id="ef" checked={Boolean(d.featured)} onChange={e => setD(p => ({ ...p, featured: e.target.checked }))} className="dash-cb" />
                    <label htmlFor="ef" className="dash-cb-label">{u.featuredNews}</label>
                </div>
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
    const [errors, setErrors] = useState<Record<string, string>>({});
    const u = UI[lang];

    return (
        <form className="form-grid" noValidate onSubmit={e => {
            e.preventDefault();
            const res = getDashHeroSchema().safeParse(d);
            if (!res.success) {
                const errs: Record<string, string> = {};
                res.error.issues.forEach(i => errs[i.path[0] as string] = i.message);
                setErrors(errs);
                return;
            }
            onSave(d);
        }}>
            <div className="form-full">
                <label className="dash-label">{u.slideTitle}</label>
                <input className={`dash-input ${errors.title ? 'border-red-500' : ''}`} value={d.title} onChange={e => { setD(p => ({ ...p, title: e.target.value })); if (errors.title) setErrors(p => ({ ...p, title: '' })) }} />
                {errors.title && <span className="text-red-500 text-xs mt-1 block">{errors.title}</span>}
            </div>
            <div className="form-full">
                <label className="dash-label">{u.slideSubtitle}</label>
                <input className={`dash-input ${errors.subtitle ? 'border-red-500' : ''}`} value={d.subtitle} onChange={e => { setD(p => ({ ...p, subtitle: e.target.value })); if (errors.subtitle) setErrors(p => ({ ...p, subtitle: '' })) }} />
                {errors.subtitle && <span className="text-red-500 text-xs mt-1 block">{errors.subtitle}</span>}
            </div>
            <div className="form-full">
                <label className="dash-label">{u.slideDesc}</label>
                <textarea className={`dash-input dash-ta ${errors.description ? 'border-red-500' : ''}`} value={d.description} onChange={e => { setD(p => ({ ...p, description: e.target.value })); if (errors.description) setErrors(p => ({ ...p, description: '' })) }} />
                {errors.description && <span className="text-red-500 text-xs mt-1 block">{errors.description}</span>}
            </div>
            <div className="form-full">
                <div className={errors.image ? 'border border-red-500 p-2 rounded' : ''}>
                    <ImageUpload label={u.slideImage} value={d.image} onChange={val => { setD(p => ({ ...p, image: val })); if (errors.image) setErrors(p => ({ ...p, image: '' })) }} />
                </div>
                {errors.image && <span className="text-red-500 text-xs mt-1 block">{errors.image}</span>}
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
export const EditSchoolForm: React.FC<{ school: DashSchool; lang: Lang; onSave: (s: DashSchool) => void; onCancel: () => void }> = ({ school, lang, onSave, onCancel }) => {
    const u = UI[lang];
    const { data: siteData } = useSiteData();
    const [d, setD] = useState<Partial<DashSchool>>(school);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        const normalizedSchool = {
            ...school,
            type: Array.isArray(school.type) ? school.type : (school.type ? [school.type] : [])
        };
        setD(normalizedSchool);
    }, [school]);

    const governorates = (siteData.governorates || []).map(gov => ({
        value: gov.name,
        label: lang === 'ar' ? gov.nameAr : gov.name
    }));

    return (
        <form className="form-grid" noValidate onSubmit={e => {
            e.preventDefault();
            const res = getDashSchoolSchema().safeParse(d);
            if (!res.success) {
                const errs: Record<string, string> = {};
                res.error.issues.forEach(i => errs[i.path[0] as string] = i.message);
                setErrors(errs);
                return;
            }
            onSave(d as DashSchool);
        }}>
            <div className="form-col">
                <label className="dash-label">{u.schoolName} (EN)</label>
                <input className={`dash-input ${errors.name ? 'border-red-500' : ''}`} value={d.name || ''} onChange={e => { setD(p => ({ ...p, name: e.target.value })); if (errors.name) setErrors(p => ({ ...p, name: '' })) }} />
                {errors.name && <span className="text-red-500 text-xs mt-1 block">{errors.name}</span>}
            </div>
            <div className="form-col">
                <label className="dash-label">{u.schoolName} (AR)</label>
                <input className={`dash-input ${errors.nameAr ? 'border-red-500' : ''}`} dir="rtl" value={d.nameAr || ''} onChange={e => { setD(p => ({ ...p, nameAr: e.target.value })); if (errors.nameAr) setErrors(p => ({ ...p, nameAr: '' })) }} />
                {errors.nameAr && <span className="text-red-500 text-xs mt-1 block">{errors.nameAr}</span>}
            </div>
            <div className="form-col">
                <label className="dash-label">{u.location} (EN)</label>
                <input className={`dash-input ${errors.location ? 'border-red-500' : ''}`} value={d.location || ''} onChange={e => { setD(p => ({ ...p, location: e.target.value })); if (errors.location) setErrors(p => ({ ...p, location: '' })) }} />
                {errors.location && <span className="text-red-500 text-xs mt-1 block">{errors.location}</span>}
            </div>
            <div className="form-col">
                <label className="dash-label">{u.location} (AR)</label>
                <input className={`dash-input ${errors.locationAr ? 'border-red-500' : ''}`} dir="rtl" value={d.locationAr || ''} onChange={e => { setD(p => ({ ...p, locationAr: e.target.value })); if (errors.locationAr) setErrors(p => ({ ...p, locationAr: '' })) }} />
                {errors.locationAr && <span className="text-red-500 text-xs mt-1 block">{errors.locationAr}</span>}
            </div>
            <div className="form-col">
                <label className="dash-label">{u.address} (EN)</label>
                <input className={`dash-input ${errors.address ? 'border-red-500' : ''}`} value={d.address || ''} onChange={e => { setD(p => ({ ...p, address: e.target.value })); if (errors.address) setErrors(p => ({ ...p, address: '' })) }} />
                {errors.address && <span className="text-red-500 text-xs mt-1 block">{errors.address}</span>}
            </div>
            <div className="form-col">
                <label className="dash-label">{u.address} (AR)</label>
                <input className={`dash-input ${errors.addressAr ? 'border-red-500' : ''}`} dir="rtl" value={d.addressAr || ''} onChange={e => { setD(p => ({ ...p, addressAr: e.target.value })); if (errors.addressAr) setErrors(p => ({ ...p, addressAr: '' })) }} />
                {errors.addressAr && <span className="text-red-500 text-xs mt-1 block">{errors.addressAr}</span>}
            </div>
            <div className="form-col">
                <label className="dash-label">{u.governorate}</label>
                <div className={errors.governorate ? 'border border-red-500 rounded' : ''}>
                    <CustomSelect
                        value={d.governorate || ''}
                        onChange={val => {
                            const gov = governorates.find(g => g.value === val);
                            setD(p => ({ ...p, governorate: val, governorateAr: gov?.label }));
                            if (errors.governorate) setErrors(p => ({ ...p, governorate: '' }));
                        }}
                        options={governorates}
                    />
                </div>
                {errors.governorate && <span className="text-red-500 text-xs mt-1 block">{errors.governorate}</span>}
            </div>
            <div className="form-col">
                <label className="dash-label">{u.principal} (EN)</label>
                <input className={`dash-input ${errors.principal ? 'border-red-500' : ''}`} value={d.principal || ''} onChange={e => { setD(p => ({ ...p, principal: e.target.value })); if (errors.principal) setErrors(p => ({ ...p, principal: '' })) }} />
                {errors.principal && <span className="text-red-500 text-xs mt-1 block">{errors.principal}</span>}
            </div>
            <div className="form-col">
                <label className="dash-label">{u.principal} (AR)</label>
                <input className={`dash-input ${errors.principalAr ? 'border-red-500' : ''}`} dir="rtl" value={d.principalAr || ''} onChange={e => { setD(p => ({ ...p, principalAr: e.target.value })); if (errors.principalAr) setErrors(p => ({ ...p, principalAr: '' })) }} />
                {errors.principalAr && <span className="text-red-500 text-xs mt-1 block">{errors.principalAr}</span>}
            </div>
            <div className="form-col">
                <label className="dash-label">{u.type}</label>
                <div className={errors.type ? 'border border-red-500 rounded' : ''}>
                    <CustomMultiSelect
                        value={Array.isArray(d.type) ? d.type : (d.type ? (d.type.startsWith('[') ? JSON.parse(d.type) : d.type.split(',')) : [])}
                        onChange={val => {
                            setD(p => ({ ...p, type: val }));
                            if (errors.type) setErrors(p => ({ ...p, type: '' }));
                        }}
                        options={[
                            { value: 'Arabic', label: lang === 'ar' ? 'عربي' : 'Arabic' },
                            { value: 'Languages', label: lang === 'ar' ? 'لغات' : 'Languages' },
                            { value: 'American', label: lang === 'ar' ? 'أمريكي' : 'American' },
                            { value: 'British', label: lang === 'ar' ? 'بريطاني' : 'British' },
                            { value: 'French', label: lang === 'ar' ? 'فرنسي' : 'French' }
                        ]}
                    />
                </div>
                {errors.type && <span className="text-red-500 text-xs mt-1 block">{errors.type}</span>}
            </div>
            <div className="form-full">
                <label className="dash-label">{u.aboutSchool} (EN)</label>
                <textarea className={`dash-input dash-ta ${errors.about ? 'border-red-500' : ''}`} value={d.about || ''} onChange={e => { setD(p => ({ ...p, about: e.target.value })); if (errors.about) setErrors(p => ({ ...p, about: '' })) }} />
                {errors.about && <span className="text-red-500 text-xs mt-1 block">{errors.about}</span>}
            </div>
            <div className="form-full">
                <label className="dash-label">{u.aboutSchool} (AR)</label>
                <textarea className={`dash-input dash-ta ${errors.aboutAr ? 'border-red-500' : ''}`} dir="rtl" value={d.aboutAr || ''} onChange={e => { setD(p => ({ ...p, aboutAr: e.target.value })); if (errors.aboutAr) setErrors(p => ({ ...p, aboutAr: '' })) }} />
                {errors.aboutAr && <span className="text-red-500 text-xs mt-1 block">{errors.aboutAr}</span>}
            </div>
            <div className="form-col">
                <label className="dash-label">{u.phone}</label>
                <input className={`dash-input ${errors.phone ? 'border-red-500' : ''}`} value={d.phone || ''} onChange={e => { setD(p => ({ ...p, phone: e.target.value.replace(/[^0-9+]/g, '') })); if (errors.phone) setErrors(p => ({ ...p, phone: '' })) }} type="tel" />
                {errors.phone && <span className="text-red-500 text-xs mt-1 block">{errors.phone}</span>}
            </div>
            <div className="form-col">
                <label className="dash-label">{u.email}</label>
                <input className={`dash-input ${errors.email ? 'border-red-500' : ''}`} value={d.email || ''} onChange={e => { setD(p => ({ ...p, email: e.target.value })); if (errors.email) setErrors(p => ({ ...p, email: '' })) }} type="email" />
                {errors.email && <span className="text-red-500 text-xs mt-1 block">{errors.email}</span>}
            </div>
            <div className="form-col">
                <label className="dash-label">{u.website}</label>
                <input className={`dash-input ${errors.website ? 'border-red-500' : ''}`} value={d.website || ''} onChange={e => { setD(p => ({ ...p, website: e.target.value })); if (errors.website) setErrors(p => ({ ...p, website: '' })) }} type="url" />
                {errors.website && <span className="text-red-500 text-xs mt-1 block">{errors.website}</span>}
            </div>
            <div className="form-col">
                <label className="dash-label">{u.rating}</label>
                <input className={`dash-input ${errors.rating ? 'border-red-500' : ''}`} value={d.rating || ''} onChange={e => { const val = e.target.value; if (val === '' || (parseFloat(val) >= 0 && parseFloat(val) <= 5)) { setD(p => ({ ...p, rating: val })); if (errors.rating) setErrors(p => ({ ...p, rating: '' })) } }} onKeyDown={e => { if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault() }} type="number" step="0.1" min="0" max="5" placeholder={lang === 'ar' ? 'مثال: ٤.٩' : 'e.g. 4.9'} />
                {errors.rating && <span className="text-red-500 text-xs mt-1 block">{errors.rating}</span>}
            </div>
            <div className="form-col">
                <label className="dash-label">{u.studentCount}</label>
                <input className={`dash-input ${errors.studentCount ? 'border-red-500' : ''}`} value={d.studentCount || ''} onChange={e => { setD(p => ({ ...p, studentCount: e.target.value })); if (errors.studentCount) setErrors(p => ({ ...p, studentCount: '' })) }} onKeyDown={e => { if (['e', 'E', '+', '-', '.', '*', '/', '^', ';'].includes(e.key)) e.preventDefault() }} type="number" min="0" placeholder={lang === 'ar' ? 'مثال: ٢٥٠٠' : 'e.g. 2500'} />
                {errors.studentCount && <span className="text-red-500 text-xs mt-1 block">{errors.studentCount}</span>}
            </div>
            <div className="form-col">
                <label className="dash-label">{lang === 'ar' ? 'عدد المعلمين' : 'Teachers Count'}</label>
                <input className={`dash-input ${errors.teachersCount ? 'border-red-500' : ''}`} value={d.teachersCount || ''} onChange={e => { setD(p => ({ ...p, teachersCount: e.target.value })); if (errors.teachersCount) setErrors(p => ({ ...p, teachersCount: '' })) }} onKeyDown={e => { if (['e', 'E', '+', '-', '.', '*', '/', '^', ';'].includes(e.key)) e.preventDefault() }} type="number" min="0" placeholder={lang === 'ar' ? 'مثال: ١٥٠' : 'e.g. 150'} />
                {errors.teachersCount && <span className="text-red-500 text-xs mt-1 block">{errors.teachersCount}</span>}
            </div>
            <div className="form-col">
                <label className="dash-label">{u.foundedYear}</label>
                <input className={`dash-input ${errors.foundedYear ? 'border-red-500' : ''}`} value={d.foundedYear || ''} onChange={e => { setD(p => ({ ...p, foundedYear: e.target.value })); if (errors.foundedYear) setErrors(p => ({ ...p, foundedYear: '' })) }} onKeyDown={e => { if (['e', 'E', '+', '-', '.'].includes(e.key)) e.preventDefault() }} type="number" min="1900" max={new Date().getFullYear()} placeholder={lang === 'ar' ? 'مثال: ١٩٩٥' : 'e.g. 1995'} />
                {errors.foundedYear && <span className="text-red-500 text-xs mt-1 block">{errors.foundedYear}</span>}
            </div>
            <div className="form-full">
                <label className="dash-label">{lang === 'ar' ? 'رابط التقديم' : 'Application Link'}</label>
                <input className="dash-input" placeholder={lang === 'ar' ? 'مثال: https://apply.school.edu.eg' : 'e.g. https://apply.school.edu.eg'} value={d.applicationLink || ''} onChange={e => setD(p => ({ ...p, applicationLink: e.target.value }))} />
            </div>
            <div className="form-full">
                <div className={errors.mainImage ? 'border border-red-500 p-2 rounded' : ''}>
                    <ImageUpload label={u.mainImage} value={d.mainImage || ''} onChange={val => { setD(p => ({ ...p, mainImage: val })); if (errors.mainImage) setErrors(p => ({ ...p, mainImage: '' })) }} />
                </div>
                {errors.mainImage && <span className="text-red-500 text-xs mt-1 block">{errors.mainImage}</span>}
            </div>
            <div className="form-full">
                <div className={errors.logo ? 'border border-red-500 p-2 rounded' : ''}>
                    <ImageUpload label={u.logo} value={d.logo || ''} onChange={val => { setD(p => ({ ...p, logo: val })); if (errors.logo) setErrors(p => ({ ...p, logo: '' })) }} />
                </div>
                {errors.logo && <span className="text-red-500 text-xs mt-1 block">{errors.logo}</span>}
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
    const [errors, setErrors] = useState<Record<string, string>>({});
    const { data } = useSiteData();
    const u = UI[lang];
    const jobTypes = [
        { value: 'Full-time', labelAr: 'دوام كامل', labelEn: 'Full-time' },
        { value: 'Part-time', labelAr: 'دوام جزئي', labelEn: 'Part-time' },
        { value: 'Contract', labelAr: 'عقد', labelEn: 'Contract' },
        { value: 'Internship', labelAr: 'تدريب', labelEn: 'Internship' },
    ];

    return (
        <form className="form-grid" noValidate onSubmit={e => {
            e.preventDefault();
            const res = getDashJobSchema().safeParse(d);
            if (!res.success) {
                const errs: Record<string, string> = {};
                res.error.issues.forEach(i => errs[i.path[0] as string] = i.message);
                setErrors(errs);
                return;
            }
            onSave(d as DashJob);
        }}>
            <div className="form-col">
                <label className="dash-label">{u.titleEn || 'Title (EN)'}</label>
                <input className={`dash-input ${errors.title ? 'border-red-500' : ''}`} value={d.title || ''} onChange={e => { setD(p => ({ ...p, title: e.target.value })); if (errors.title) setErrors(p => ({ ...p, title: '' })) }} />
                {errors.title && <span className="text-red-500 text-xs mt-1 block">{errors.title}</span>}
            </div>
            <div className="form-col">
                <label className="dash-label">{u.titleAr || 'Title (AR)'}</label>
                <input className={`dash-input ${errors.titleAr ? 'border-red-500' : ''}`} dir="rtl" value={d.titleAr || ''} onChange={e => { setD(p => ({ ...p, titleAr: e.target.value })); if (errors.titleAr) setErrors(p => ({ ...p, titleAr: '' })) }} />
                {errors.titleAr && <span className="text-red-500 text-xs mt-1 block">{errors.titleAr}</span>}
            </div>
            <div className="form-col">
                <label className="dash-label">Department / القسم</label>
                <div className={errors.department ? 'border border-red-500 rounded' : ''}>
                    <CustomSelect
                        value={d.department || ''}
                        placeholder={lang === 'ar' ? 'اختر قسم...' : 'Select department...'}
                        onChange={val => {
                            const selectedDep = data.jobDepartments?.find(jd => jd.nameEn === val);
                            setD(p => ({
                                ...p,
                                department: selectedDep?.nameEn || val,
                                departmentAr: selectedDep?.nameAr || val
                            }));
                            if (errors.department) {
                                setErrors(p => ({ ...p, department: '', departmentAr: '' }));
                            }
                        }}
                        options={(data.jobDepartments || []).map(dep => ({
                            value: dep.nameEn,
                            label: lang === 'ar' ? dep.nameAr : dep.nameEn
                        }))}
                    />
                </div>
                {errors.department && <span className="text-red-500 text-xs mt-1 block">{errors.department}</span>}
                {(!data.jobDepartments || data.jobDepartments.length === 0) && (
                    <span className="text-orange-500 text-xs mt-1 block">
                        {lang === 'ar' ? 'الرجاء إضافة أقسام من قائمة الأقسام أولاً' : 'Please add departments from the Departments menu first'}
                    </span>
                )}
            </div>
            <div className="form-col">
                <label className="dash-label">Location (EN)</label>
                <input className={`dash-input ${errors.location ? 'border-red-500' : ''}`} value={d.location || ''} onChange={e => { setD(p => ({ ...p, location: e.target.value })); if (errors.location) setErrors(p => ({ ...p, location: '' })) }} />
                {errors.location && <span className="text-red-500 text-xs mt-1 block">{errors.location}</span>}
            </div>
            <div className="form-col">
                <label className="dash-label">الموقع (عربي)</label>
                <input className={`dash-input ${errors.locationAr ? 'border-red-500' : ''}`} dir="rtl" value={d.locationAr || ''} onChange={e => { setD(p => ({ ...p, locationAr: e.target.value })); if (errors.locationAr) setErrors(p => ({ ...p, locationAr: '' })) }} />
                {errors.locationAr && <span className="text-red-500 text-xs mt-1 block">{errors.locationAr}</span>}
            </div>
            <div className="form-col">
                <label className="dash-label">Type</label>
                <div className={errors.type ? 'border border-red-500 rounded' : ''}>
                    <CustomSelect
                        value={d.type || ''}
                        onChange={val => {
                            const type = jobTypes.find(t => t.value === val);
                            setD(p => ({ ...p, type: val, typeAr: type?.labelAr }));
                            if (errors.type) setErrors(p => ({ ...p, type: '' }));
                        }}
                        options={jobTypes.map(t => ({ value: t.value, label: lang === 'ar' ? t.labelAr : t.labelEn }))}
                    />
                </div>
                {errors.type && <span className="text-red-500 text-xs mt-1 block">{errors.type}</span>}
            </div>
            <div className="form-full">
                <label className="dash-label">Description (EN)</label>
                <textarea className={`dash-input dash-ta ${errors.description ? 'border-red-500' : ''}`} value={d.description || ''} onChange={e => { setD(p => ({ ...p, description: e.target.value })); if (errors.description) setErrors(p => ({ ...p, description: '' })) }} />
                {errors.description && <span className="text-red-500 text-xs mt-1 block">{errors.description}</span>}
            </div>
            <div className="form-full">
                <label className="dash-label">الوصف (عربي)</label>
                <textarea className={`dash-input dash-ta ${errors.descriptionAr ? 'border-red-500' : ''}`} dir="rtl" value={d.descriptionAr || ''} onChange={e => { setD(p => ({ ...p, descriptionAr: e.target.value })); if (errors.descriptionAr) setErrors(p => ({ ...p, descriptionAr: '' })) }} />
                {errors.descriptionAr && <span className="text-red-500 text-xs mt-1 block">{errors.descriptionAr}</span>}
            </div>
            <div className="form-full">
                <ImageUpload label={u.jobImage || 'Job Image'} value={d.image || ''} onChange={val => setD(p => ({ ...p, image: val }))} />
                {errors.image && <span className="text-red-500 text-xs mt-1 block">{errors.image}</span>}
            </div>
            <div className="form-full dash-form-actions">
                <button type="submit" className="dash-btn dash-btn-primary"><Save className="w-4 h-4" />{u.save}</button>
                <button type="button" className="dash-btn dash-btn-ghost" onClick={onCancel}>{u.cancel}</button>
            </div>
        </form>
    );
};
