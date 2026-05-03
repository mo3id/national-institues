import React, { useState, useCallback } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useSiteData } from '@/context/DataContext';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import GraduationCap from 'lucide-react/dist/esm/icons/graduation-cap';
import Search from 'lucide-react/dist/esm/icons/search';
import CheckCircle from 'lucide-react/dist/esm/icons/check-circle';
import Loader2 from 'lucide-react/dist/esm/icons/loader-2';
import Send from 'lucide-react/dist/esm/icons/send';
import Plus from 'lucide-react/dist/esm/icons/plus';
import X from 'lucide-react/dist/esm/icons/x';
import GripVertical from 'lucide-react/dist/esm/icons/grip-vertical';
import ChevronUp from 'lucide-react/dist/esm/icons/chevron-up';
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down';
import Upload from 'lucide-react/dist/esm/icons/upload';
import Clipboard from 'lucide-react/dist/esm/icons/clipboard';
import Check from 'lucide-react/dist/esm/icons/check';
import PageTransition from '@/components/common/PageTransition';
import ScrollReveal from '@/components/common/ScrollReveal';
import { CustomSelect } from '@/components/common/FormControls';
import { getAdmissionSchema } from '@/utils/validations';
import { submitAdmission } from '@/services/api';
import { validateEgyptianNationalId, validatePassport, getValidationMessage } from '@/utils/validation';

interface Preference {
  schoolId: string;
  schoolName: string;
  schoolNameAr: string;
}

interface UploadedDoc {
  name: string;
  fileName: string;
  file?: File;
}

const Admissions: React.FC = () => {
  const { lang, isRTL, t } = useLanguage();
  const { data: siteData } = useSiteData();
  const admSettings = siteData.admissionSettings;
  const schools = siteData.schools || [];

  const [formData, setFormData] = useState({
    studentName: '',
    studentDOB: '',
    studentNationalId: '',
    passportNumber: '',
    gradeStage: '',
    gradeClass: '',
    hasSibling: false,
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    notes: '',
  });
  const [preferences, setPreferences] = useState<Preference[]>([]);
  const [documents, setDocuments] = useState<UploadedDoc[]>(
    (admSettings?.requiredDocuments || []).map(name => ({ name, fileName: '' }))
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [admissionId, setAdmissionId] = useState<string | null>(null);
  const [applicationNumber, setApplicationNumber] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: string } }) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    if (submitError) setSubmitError(null);
  };

  const addPreference = (schoolId: string) => {
    const school = schools.find(s => (s as any).id === schoolId);
    if (!school) return;
    if (preferences.some(p => p.schoolId === schoolId)) return;
    const max = admSettings?.maxPreferences || 0;
    if (max > 0 && preferences.length >= max) return;
    setPreferences(prev => [...prev, { schoolId, schoolName: school.name, schoolNameAr: (school as any).nameAr || school.name }]);
    if (errors.preferences) setErrors(prev => ({ ...prev, preferences: '' }));
  };

  const removePreference = (idx: number) => setPreferences(prev => prev.filter((_, i) => i !== idx));

  const movePreference = (idx: number, dir: -1 | 1) => {
    const next = idx + dir;
    if (next < 0 || next >= preferences.length) return;
    setPreferences(prev => {
      const arr = [...prev];
      [arr[idx], arr[next]] = [arr[next], arr[idx]];
      return arr;
    });
  };

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
  const [docError, setDocError] = useState<string | null>(null);

  const handleDocUpload = useCallback(async (docIndex: number, file: File) => {
    const allowedTypes = ['image/jpeg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setDocError(lang === 'ar' ? 'نوع الملف غير مدعوم — يُسمح فقط بملفات JPEG أو PDF' : 'Unsupported file type — only JPEG images or PDF files are allowed');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setDocError(lang === 'ar' ? 'حجم الملف يجب ألا يتجاوز 5 ميجابايت' : 'File size must not exceed 5 MB');
      return;
    }
    setDocError(null);
    setDocuments(prev => prev.map((d, i) => i === docIndex ? { ...d, fileName: file.name, file } : d));
  }, [lang]);

  const copyToClipboard = () => {
    if (!applicationNumber) return;
    navigator.clipboard.writeText(applicationNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Check if documents are uploaded (required)
    const uploadedDocs = documents.filter(d => d.file);
    if (uploadedDocs.length === 0) {
      setDocError(lang === 'ar' ? 'يجب إرفاق جميع المستندات المطلوبة' : 'All required documents must be attached');
      return;
    }

    // Validate documents completeness
    const missingDocs = documents.filter(d => !d.file);
    if (missingDocs.length > 0) {
      setDocError(lang === 'ar' ? `الرجاء إرفاق: ${missingDocs.map(d => d.name).join(', ')}` : `Please upload: ${missingDocs.map(d => d.name).join(', ')}`);
      return;
    }

    const payload = { ...formData, preferences, documents: uploadedDocs };
    const result = getAdmissionSchema(lang).safeParse(payload);
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.issues.forEach(i => { if (!errs[i.path[0] as string]) errs[i.path[0] as string] = i.message; });
      setErrors(errs);
      return;
    }
    setErrors({});
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await submitAdmission({ ...payload, documents: uploadedDocs });
      setAdmissionId(res.data?.applicationId || null);
      setApplicationNumber(res.data?.applicationNumber || null);
      setSubmitted(true);
      setFormData({ studentName: '', studentDOB: '', studentNationalId: '', passportNumber: '', gradeStage: '', gradeClass: '', hasSibling: false, parentName: '', parentPhone: '', parentEmail: '', notes: '' });
      setPreferences([]);
      setDocuments((admSettings?.requiredDocuments || []).map((name: string) => ({ name, fileName: '' })));
      setErrors({});
      setDocError(null);
    } catch (err: any) {
      const resp = err?.response?.data;
      if (resp?.error_code === 'ALREADY_APPLIED' && resp?.data) {
        setSubmitError(resp.message || (lang === 'ar' ? 'لقد قدمت طلباً مسبقاً بهذا الرقم القومي' : 'You have already applied with this ID'));
        if (resp.data.applicationId) setAdmissionId(resp.data.applicationId);
        if (resp.data.applicationNumber) setApplicationNumber(resp.data.applicationNumber);
        setSubmitted(true);
      } else {
        setSubmitError(resp?.message || (lang === 'ar' ? 'فشل إرسال الطلب، يرجى المحاولة مرة أخرى.' : err.message || 'Failed to submit application.'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldClass = (key: string) =>
    `w-full bg-slate-50 border ${errors[key] ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:ring-[#1e3a8a]'} rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:border-transparent transition-all`;

  const labelClass = `block font-bold text-slate-700 ${isRTL ? 'text-sm' : 'text-xs uppercase tracking-wider'} mb-2`;

  const gradeStages = admSettings?.gradeStages || ['ابتدائي', 'إعدادي', 'ثانوي'];
  const gradeClassesByStage = admSettings?.gradeClassesByStage || {
    'ابتدائي': ['أول', 'ثاني', 'ثالث', 'رابع', 'خامس', 'سادس'],
    'إعدادي': ['أول', 'ثاني', 'ثالث'],
    'ثانوي': ['أول', 'ثاني', 'ثالث']
  };
  const gradeClasses = formData.gradeStage ? (gradeClassesByStage[formData.gradeStage] || []) : [];
  const isOpen = admSettings?.isOpen !== false;

  const availableSchools = schools.filter(s => !preferences.some(p => p.schoolId === (s as any).id));
  const [schoolSearch, setSchoolSearch] = useState('');
  const [govFilter, setGovFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const governorateOptions = (siteData.governorates || []).map((g: any) => ({
    value: g.name,
    label: lang === 'ar' ? (g.nameAr || g.name) : g.name
  }));

  const allTypes = Array.from(new Set(schools.flatMap((s: any) => {
    const t = s.type;
    if (Array.isArray(t)) return t.filter(Boolean);
    if (typeof t === 'string' && t.trim()) {
      try { const p = JSON.parse(t); return Array.isArray(p) ? p.filter(Boolean) : [t]; }
      catch { return t.split(',').map((x: string) => x.trim()).filter(Boolean); }
    }
    return [];
  })));

  const typeOptions = allTypes.map((t: string) => ({
    value: t,
    label: lang === 'ar' ? ({ Arabic: 'عربي', Languages: 'لغات', American: 'أمريكي', British: 'بريطاني', French: 'فرنسي' }[t] || t) : t
  }));

  const filteredSchools = availableSchools.filter(s => {
    const q = schoolSearch.toLowerCase();
    const matchSearch = !q || s.name.toLowerCase().includes(q) || ((s as any).nameAr || '').includes(q);
    const matchGov = !govFilter || (s as any).governorate === govFilter;
    const schoolTypes = (() => {
      const t = (s as any).type;
      if (Array.isArray(t)) return t.filter(Boolean);
      if (typeof t === 'string' && t.trim()) {
        try { const p = JSON.parse(t); return Array.isArray(p) ? p.filter(Boolean) : [t]; }
        catch { return t.split(',').map((x: string) => x.trim()).filter(Boolean); }
      }
      return [];
    })();
    const matchType = !typeFilter || schoolTypes.includes(typeFilter);
    return matchSearch && matchGov && matchType;
  });

  return (
    <PageTransition>
      <div className="overflow-x-hidden min-h-screen bg-[#fafcff]">
        {/* Hero */}
        <section className="m-[10px] rounded-[20px] relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-[#0f172a]">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#991b1b]/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
          </div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 py-20 flex flex-col items-center">
            <ScrollReveal direction="down">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 mb-6">
                <GraduationCap className="w-4 h-4 text-blue-300" />
                <span className="text-white/80 text-sm font-bold">{isOpen ? (lang === 'ar' ? 'التقديم مفتوح' : 'Admissions Open') : (lang === 'ar' ? 'التقديم مغلق' : 'Admissions Closed')}</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 tracking-tight text-white leading-tight drop-shadow-lg">
                {lang === 'ar' ? (admSettings?.formTitleAr || 'التقديم للمدارس') : (admSettings?.formTitle || 'School Admissions')}
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <p className="text-blue-100/80 text-lg md:text-xl max-w-2xl mx-auto font-medium mb-10">
                {lang === 'ar' ? (admSettings?.formDescAr || 'قدّم طلبك الآن واختر مدارسك المفضلة') : (admSettings?.formDesc || 'Apply now and choose your preferred schools')}
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.2} direction="up">
              <Link
                to="/admissions/track"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 px-8 py-3 rounded-full font-bold transition-all flex items-center gap-2 hover:gap-4 shadow-xl"
              >
                <Search className="w-5 h-5" />
                {lang === 'ar' ? 'تتبع طلبك' : 'Track Your Application'}
                <span className={`transform transition-transform ${isRTL ? 'rotate-180' : ''}`}>→</span>
              </Link>
            </ScrollReveal>
          </div>
        </section>

        {/* Main content */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal direction="up" delay={0.1}>
              <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
                <div className="p-8 md:p-14">

                  {/* Closed state */}
                  {!isOpen ? (
                    <div className="text-center py-16 space-y-4">
                      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                        <GraduationCap className="w-10 h-10 text-slate-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-800">
                        {lang === 'ar' ? 'التقديم مغلق حالياً' : 'Admissions Closed'}
                      </h3>
                      <p className="text-slate-500 max-w-md mx-auto">
                        {lang === 'ar' ? 'باب التقديم مغلق في الوقت الحالي. يرجى المتابعة لاحقاً.' : 'Applications are currently closed. Please check back later.'}
                      </p>
                    </div>
                  ) : submitted ? (
                    /* Success */
                    <div className="text-center py-10 space-y-8 animate-fade-in">
                      <div className="flex justify-center">
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
                          <CheckCircle className="h-12 w-12 text-green-600" />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-3xl font-black text-gray-900 mb-2">
                          {lang === 'ar' ? 'تم تقديم الطلب بنجاح!' : 'Application Submitted!'}
                        </h3>
                        <p className="text-slate-500 font-medium text-lg max-w-md mx-auto">
                          {lang === 'ar' ? 'احتفظ برقم الطلب لمتابعة حالة تقديمك.' : 'Keep your application ID to track your status.'}
                        </p>
                        {applicationNumber && (
                          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 inline-block mx-auto min-w-[280px]">
                            <div className="flex flex-col items-center gap-4">
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{lang === 'ar' ? 'رقم الطلب' : 'Application Number'}</p>
                              <span className="text-4xl font-black text-[#1e3a8a] tracking-widest font-mono">{applicationNumber}</span>
                              <button onClick={copyToClipboard} className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:text-[#1e3a8a] hover:border-[#1e3a8a] transition-all shadow-sm">
                                {copied ? <><Check className="w-4 h-4 text-green-500" /><span>{lang === 'ar' ? 'تم النسخ!' : 'Copied!'}</span></> : <><Clipboard className="w-4 h-4" /><span>{lang === 'ar' ? 'نسخ الرقم' : 'Copy ID'}</span></>}
                              </button>
                            </div>
                          </div>
                        )}
                        <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center">
                          <Link to="/admissions/track" className="bg-[#1e3a8a] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-blue-900 hover:shadow-lg transition-all flex items-center justify-center gap-2">
                            <Search className="w-5 h-5" />
                            <span>{lang === 'ar' ? 'تتبع الطلب' : 'Track Application'}</span>
                          </Link>
                          <button onClick={() => { setSubmitted(false); setAdmissionId(null); setApplicationNumber(null); setFormData({ studentName: '', studentDOB: '', studentNationalId: '', passportNumber: '', gradeStage: '', gradeClass: '', hasSibling: false, parentName: '', parentPhone: '', parentEmail: '', notes: '' }); setPreferences([]); }} className="bg-slate-100 text-slate-700 px-8 py-3.5 rounded-xl font-bold hover:bg-slate-200 transition-all">
                            {lang === 'ar' ? 'تقديم طلب آخر' : 'Submit Another'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Form */
                    <form onSubmit={handleSubmit} className="space-y-10" noValidate dir={isRTL ? 'rtl' : 'ltr'}>
                      <div className="text-start">
                        <h3 className="text-3xl font-bold text-slate-900 mb-1">
                          {lang === 'ar' ? (admSettings?.formTitleAr || 'نموذج التقديم') : (admSettings?.formTitle || 'Application Form')}
                        </h3>
                        <p className={`text-slate-500 font-medium ${isRTL ? 'text-sm' : 'text-xs uppercase tracking-widest'}`}>
                          {lang === 'ar' ? (admSettings?.formDescAr || '') : (admSettings?.formDesc || '')}
                        </p>
                      </div>

                      {/* Student Info */}
                      <div className="space-y-5">
                        <h4 className="text-lg font-bold text-[#1e3a8a] border-b border-blue-100 pb-2">
                          {lang === 'ar' ? 'بيانات الطالب' : 'Student Information'}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className={labelClass}>{lang === 'ar' ? 'اسم الطالب' : 'Student Name'} <span className="text-red-500">*</span></label>
                            <input type="text" name="studentName" value={formData.studentName} onChange={handleChange} className={fieldClass('studentName')} placeholder={lang === 'ar' ? 'الاسم بالكامل' : 'Full name'} />
                            {errors.studentName && <p className="text-red-500 text-xs font-bold mt-1">{errors.studentName}</p>}
                          </div>
                          <div>
                            <label className={labelClass}>{lang === 'ar' ? 'تاريخ الميلاد' : 'Date of Birth'} <span className="text-red-500">*</span></label>
                            <input type="date" name="studentDOB" value={formData.studentDOB} onChange={handleChange} className={fieldClass('studentDOB')} dir="ltr" />
                            {errors.studentDOB && <p className="text-red-500 text-xs font-bold mt-1">{errors.studentDOB}</p>}
                          </div>
                          <div>
                            <label className={labelClass}>{lang === 'ar' ? 'الرقم القومي' : 'National ID'} <span className="text-slate-400 text-xs">({lang === 'ar' ? 'أو جواز السفر' : 'or Passport'})</span></label>
                            <input type="text" name="studentNationalId" value={formData.studentNationalId} onChange={handleChange} className={fieldClass('studentNationalId')} placeholder={lang === 'ar' ? '14 رقمًا' : '14 digits'} dir="ltr" maxLength={14} />
                            {errors.studentNationalId && <p className="text-red-500 text-xs font-bold mt-1">{errors.studentNationalId}</p>}
                          </div>
                          <div>
                            <label className={labelClass}>{lang === 'ar' ? 'رقم جواز السفر' : 'Passport Number'} <span className="text-slate-400 text-xs">({lang === 'ar' ? 'للأجانب' : 'for foreigners'})</span></label>
                            <input type="text" name="passportNumber" value={formData.passportNumber} onChange={handleChange} className={fieldClass('passportNumber')} placeholder={lang === 'ar' ? 'رقم جواز السفر' : 'Passport number'} dir="ltr" />
                            {errors.passportNumber && <p className="text-red-500 text-xs font-bold mt-1">{errors.passportNumber}</p>}
                          </div>
                          <div>
                            <label className={labelClass}>{lang === 'ar' ? 'المرحلة الدراسية' : 'Grade Stage'} <span className="text-red-500">*</span></label>
                            <CustomSelect value={formData.gradeStage} onChange={val => handleChange({ target: { name: 'gradeStage', value: val } } as any)} options={gradeStages.map(s => ({ value: s, label: s }))} className={errors.gradeStage ? 'border-red-500' : ''} />
                            {errors.gradeStage && <p className="text-red-500 text-xs font-bold mt-1">{errors.gradeStage}</p>}
                          </div>
                          <div>
                            <label className={labelClass}>{lang === 'ar' ? 'الصف الدراسي' : 'Grade Class'} <span className="text-red-500">*</span></label>
                            <CustomSelect value={formData.gradeClass} onChange={val => handleChange({ target: { name: 'gradeClass', value: val } } as any)} options={gradeClasses.map(c => ({ value: c, label: c }))} className={errors.gradeClass ? 'border-red-500' : ''} />
                            {errors.gradeClass && <p className="text-red-500 text-xs font-bold mt-1">{errors.gradeClass}</p>}
                          </div>
                          <div className="flex items-center gap-3 md:col-span-2 mt-2">
                            <input
                              type="checkbox"
                              id="hasSibling"
                              name="hasSibling"
                              checked={formData.hasSibling}
                              onChange={e => setFormData(prev => ({ ...prev, hasSibling: e.target.checked }))}
                              className="w-5 h-5 rounded border-slate-300 text-[#1e3a8a] focus:ring-[#1e3a8a]"
                            />
                            <label htmlFor="hasSibling" className="text-sm font-semibold text-slate-700 cursor-pointer">
                              {lang === 'ar' ? 'لديه أخ/أخت بالمدرسة' : 'Has a sibling at the school'}
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Parent Info */}
                      <div className="space-y-5">
                        <h4 className="text-lg font-bold text-[#1e3a8a] border-b border-blue-100 pb-2">
                          {lang === 'ar' ? 'بيانات ولي الأمر' : 'Parent / Guardian Information'}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className={labelClass}>{lang === 'ar' ? 'اسم ولي الأمر' : 'Parent Name'} <span className="text-red-500">*</span></label>
                            <input type="text" name="parentName" value={formData.parentName} onChange={handleChange} className={fieldClass('parentName')} placeholder={lang === 'ar' ? 'الاسم بالكامل' : 'Full name'} />
                            {errors.parentName && <p className="text-red-500 text-xs font-bold mt-1">{errors.parentName}</p>}
                          </div>
                          <div>
                            <label className={labelClass}>{lang === 'ar' ? 'رقم الهاتف' : 'Phone'} <span className="text-red-500">*</span></label>
                            <input type="tel" name="parentPhone" value={formData.parentPhone} onChange={e => handleChange({ target: { name: 'parentPhone', value: e.target.value.replace(/[^0-9+]/g, '') } } as any)} className={fieldClass('parentPhone')} placeholder="01xxxxxxxxx" dir="ltr" />
                            {errors.parentPhone && <p className="text-red-500 text-xs font-bold mt-1">{errors.parentPhone}</p>}
                          </div>
                          <div className="md:col-span-2">
                            <label className={labelClass}>{lang === 'ar' ? 'البريد الإلكتروني' : 'Email'} <span className="text-red-500">*</span></label>
                            <input type="email" name="parentEmail" value={formData.parentEmail} onChange={handleChange} className={fieldClass('parentEmail')} placeholder="example@email.com" dir="ltr" />
                            {errors.parentEmail && <p className="text-red-500 text-xs font-bold mt-1">{errors.parentEmail}</p>}
                          </div>
                        </div>
                      </div>

                      {/* School Preferences */}
                      <div className="space-y-5">
                        <h4 className="text-lg font-bold text-[#1e3a8a] border-b border-blue-100 pb-2">
                          {lang === 'ar' ? 'ترتيب الرغبات' : 'School Preferences'}
                          {admSettings?.maxPreferences ? <span className="text-sm font-normal text-slate-400 ms-2">({lang === 'ar' ? `أقصى ${admSettings.maxPreferences}` : `Max ${admSettings.maxPreferences}`})</span> : null}
                        </h4>

                        {/* Selected preferences */}
                        {preferences.length > 0 && (
                          <div className="space-y-2">
                            <AnimatePresence>
                              {preferences.map((p, idx) => (
                                <motion.div key={p.schoolId} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                                  <span className="w-7 h-7 rounded-full bg-[#1e3a8a] text-white text-xs font-black flex items-center justify-center flex-shrink-0">{idx + 1}</span>
                                  <GripVertical className="w-4 h-4 text-slate-300 flex-shrink-0" />
                                  <span className="flex-1 font-semibold text-slate-800 text-sm">{lang === 'ar' ? p.schoolNameAr : p.schoolName}</span>
                                  <div className="flex items-center gap-1">
                                    <button type="button" onClick={() => movePreference(idx, -1)} disabled={idx === 0} className="p-1 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-30">
                                      <ChevronUp className="w-4 h-4 text-[#1e3a8a]" />
                                    </button>
                                    <button type="button" onClick={() => movePreference(idx, 1)} disabled={idx === preferences.length - 1} className="p-1 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-30">
                                      <ChevronDown className="w-4 h-4 text-[#1e3a8a]" />
                                    </button>
                                    <button type="button" onClick={() => removePreference(idx)} className="p-1 hover:bg-red-100 rounded-lg transition-colors text-red-400">
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                </motion.div>
                              ))}
                            </AnimatePresence>
                          </div>
                        )}

                        {/* School search to add */}
                        {(admSettings?.maxPreferences === 0 || preferences.length < (admSettings?.maxPreferences || Infinity)) && (
                          <div className="border-2 border-dashed border-blue-100 rounded-2xl p-4 space-y-3">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{lang === 'ar' ? 'أضف مدرسة' : 'Add a school'}</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="text-xs font-bold text-slate-500 mb-1 block">{lang === 'ar' ? 'المحافظة' : 'Governorate'}</label>
                                <CustomSelect
                                  value={govFilter}
                                  placeholder={lang === 'ar' ? 'كل المحافظات' : 'All Governorates'}
                                  onChange={val => setGovFilter(val)}
                                  options={governorateOptions}
                                />
                              </div>
                              <div>
                                <label className="text-xs font-bold text-slate-500 mb-1 block">{lang === 'ar' ? 'نوع التعليم' : 'Education Type'}</label>
                                <CustomSelect
                                  value={typeFilter}
                                  placeholder={lang === 'ar' ? 'كل الأنواع' : 'All Types'}
                                  onChange={val => setTypeFilter(val)}
                                  options={typeOptions}
                                />
                              </div>
                            </div>
                            <input
                              type="text"
                              value={schoolSearch}
                              onChange={e => setSchoolSearch(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                              placeholder={lang === 'ar' ? 'ابحث عن مدرسة...' : 'Search school...'}
                            />
                            <div className="max-h-48 overflow-y-auto space-y-1">
                              {filteredSchools.length === 0 ? (
                                <p className="text-slate-400 text-sm text-center py-4">{lang === 'ar' ? 'لا توجد مدارس متاحة' : 'No schools available'}</p>
                              ) : filteredSchools.map(s => (
                                <button
                                  key={(s as any).id}
                                  type="button"
                                  onClick={() => { addPreference((s as any).id); setSchoolSearch(''); }}
                                  className="w-full text-start flex items-center gap-3 px-3 py-2.5 hover:bg-blue-50 rounded-xl transition-colors group"
                                >
                                  {s.logo ? <img src={s.logo} alt={s.name} className="w-7 h-7 object-contain rounded-lg" /> : <div className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center"><GraduationCap className="w-4 h-4 text-slate-400" /></div>}
                                  <span className="text-sm font-semibold text-slate-700 group-hover:text-[#1e3a8a]">{lang === 'ar' ? ((s as any).nameAr || s.name) : s.name}</span>
                                  <Plus className="w-4 h-4 text-blue-400 ms-auto opacity-0 group-hover:opacity-100" />
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                        {errors.preferences && <p className="text-red-500 text-xs font-bold">{errors.preferences}</p>}
                      </div>

                      {/* Documents */}
                      {documents.length > 0 && (
                        <div className="space-y-5">
                          <h4 className="text-lg font-bold text-[#1e3a8a] border-b border-blue-100 pb-2">
                            {lang === 'ar' ? 'المستندات المطلوبة' : 'Required Documents'}
                          </h4>
                          <p className="text-xs text-slate-500 font-semibold">
                            {lang === 'ar' ? 'الصيغ المقبولة: JPEG أو PDF فقط — الحد الأقصى 5 ميجابايت لكل ملف' : 'Accepted formats: JPEG or PDF only — max 5 MB per file'}
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {documents.map((doc, idx) => (
                              <div key={idx} className="space-y-1">
                                <label className={labelClass}>{doc.name}</label>
                                <label className={`flex items-center gap-3 cursor-pointer border-2 ${doc.fileName ? 'border-green-200 bg-green-50' : 'border-dashed border-slate-200 bg-slate-50'} rounded-xl px-4 py-3 hover:border-[#1e3a8a] transition-all`}>
                                  <input
                                    type="file"
                                    accept="image/jpeg,.jpg,.jpeg,application/pdf,.pdf"
                                    className="hidden"
                                    onChange={e => { if (e.target.files?.[0]) handleDocUpload(idx, e.target.files[0]); }}
                                  />
                                  {doc.fileName ? <Check className="w-5 h-5 text-green-500 flex-shrink-0" /> : <Upload className="w-5 h-5 text-slate-400 flex-shrink-0" />}
                                  <span className="text-sm font-semibold text-slate-600 truncate">
                                    {doc.fileName || (lang === 'ar' ? 'انقر للرفع' : 'Click to upload')}
                                  </span>
                                </label>
                              </div>
                            ))}
                          </div>
                          {docError && <p className="text-red-500 text-xs font-bold mt-2 col-span-full">{docError}</p>}
                        </div>
                      )}

                      {/* Notes */}
                      <div>
                        <label className={labelClass}>{lang === 'ar' ? 'ملاحظات إضافية' : 'Additional Notes'}</label>
                        <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} className={`${fieldClass('notes')} resize-none`} placeholder={lang === 'ar' ? 'أي معلومات إضافية تريد إضافتها...' : 'Any additional information...'} />
                      </div>

                      {/* Submit */}
                      <div className="pt-2 flex flex-col items-end gap-3">
                        {submitError && <p className="text-red-500 font-bold text-sm">{submitError}</p>}
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className={`w-full md:w-auto bg-[#1e3a8a] text-white px-10 py-3.5 rounded-xl font-bold hover:bg-blue-900 hover:shadow-lg transition-all flex items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''} disabled:opacity-70 disabled:cursor-not-allowed`}
                        >
                          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />}
                          <span>{isSubmitting ? (lang === 'ar' ? 'جاري الإرسال...' : 'Submitting...') : (lang === 'ar' ? 'إرسال الطلب' : 'Submit Application')}</span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default Admissions;
