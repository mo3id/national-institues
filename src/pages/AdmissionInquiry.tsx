import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import GraduationCap from 'lucide-react/dist/esm/icons/graduation-cap';
import Search from 'lucide-react/dist/esm/icons/search';
import Loader2 from 'lucide-react/dist/esm/icons/loader-2';
import CheckCircle from 'lucide-react/dist/esm/icons/check-circle';
import Clock from 'lucide-react/dist/esm/icons/clock';
import XCircle from 'lucide-react/dist/esm/icons/x-circle';
import AlertCircle from 'lucide-react/dist/esm/icons/alert-circle';
import ListOrdered from 'lucide-react/dist/esm/icons/list-ordered';
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left';
import PageTransition from '@/components/common/PageTransition';
import ScrollReveal from '@/components/common/ScrollReveal';
import { getAdmissionStatus } from '@/services/api';

const STATUS_CONFIG: Record<string, { color: string; bg: string; icon: React.ElementType; labelAr: string; labelEn: string }> = {
  'Pending':      { color: 'text-amber-700',  bg: 'bg-amber-50  border-amber-200',  icon: Clock,        labelAr: 'قيد الانتظار',    labelEn: 'Pending' },
  'Under Review': { color: 'text-blue-700',   bg: 'bg-blue-50   border-blue-200',   icon: AlertCircle,  labelAr: 'قيد المراجعة',    labelEn: 'Under Review' },
  'Accepted':     { color: 'text-green-700',  bg: 'bg-green-50  border-green-200',  icon: CheckCircle,  labelAr: 'مقبول',            labelEn: 'Accepted' },
  'Waitlist':     { color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200', icon: ListOrdered,  labelAr: 'قائمة الانتظار',  labelEn: 'Waitlist' },
  'Rejected':     { color: 'text-red-700',    bg: 'bg-red-50    border-red-200',    icon: XCircle,      labelAr: 'مرفوض',            labelEn: 'Rejected' },
};

const AdmissionInquiry: React.FC = () => {
  const { lang, isRTL } = useLanguage();
  const [admissionId, setAdmissionId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [admission, setAdmission] = useState<any>(null);

  const handleInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = admissionId.trim().toUpperCase();
    if (!id) return;
    setIsLoading(true);
    setError(null);
    setAdmission(null);
    try {
      const result = await getAdmissionStatus(id);
      if (result.status === 'success') {
        setAdmission(result.data);
      } else {
        setError(lang === 'ar' ? 'لم يتم العثور على طلب بهذا الرقم.' : 'No application found with this ID.');
      }
    } catch (err: any) {
      setError(err.message || (lang === 'ar' ? 'حدث خطأ، يرجى المحاولة مرة أخرى.' : 'An error occurred, please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  const statusCfg = admission ? (STATUS_CONFIG[admission.status] || STATUS_CONFIG['Pending']) : null;

  return (
    <PageTransition>
      <div className="overflow-x-hidden min-h-screen bg-[#fafcff]">
        {/* Hero */}
        <section className="m-[10px] rounded-[20px] relative min-h-[40vh] flex items-center justify-center overflow-hidden bg-[#0f172a]">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#991b1b]/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
          </div>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 py-16 flex flex-col items-center">
            <ScrollReveal direction="down">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 mb-6">
                <Search className="w-4 h-4 text-blue-300" />
                <span className="text-white/80 text-sm font-bold">
                  {lang === 'ar' ? 'متابعة الطلب' : 'Track Application'}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                {lang === 'ar' ? 'تتبع حالة طلبك' : 'Track Your Application'}
              </h1>
              <p className="text-blue-100/70 text-lg font-medium">
                {lang === 'ar' ? 'أدخل رقم الطلب الذي حصلت عليه عند التقديم' : 'Enter the application ID you received when you applied'}
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Search box */}
        <section className="py-12 px-4">
          <div className="max-w-2xl mx-auto space-y-8">
            <ScrollReveal direction="up" delay={0.1}>
              <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-10">
                <form onSubmit={handleInquiry} className="space-y-5" dir={isRTL ? 'rtl' : 'ltr'}>
                  <div>
                    <label className={`block font-bold text-slate-700 mb-2 ${isRTL ? 'text-sm' : 'text-xs uppercase tracking-widest'}`}>
                      {lang === 'ar' ? 'رقم الطلب' : 'Application ID'}
                    </label>
                    <input
                      type="text"
                      value={admissionId}
                      onChange={e => { setAdmissionId(e.target.value.toUpperCase()); setError(null); }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent transition-all text-lg font-mono tracking-widest text-center"
                      placeholder="ADM-XXXXX"
                      dir="ltr"
                      autoComplete="off"
                      spellCheck={false}
                    />
                  </div>
                  {error && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                      <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      <p className="text-red-700 font-semibold text-sm">{error}</p>
                    </motion.div>
                  )}
                  <button
                    type="submit"
                    disabled={isLoading || !admissionId.trim()}
                    className="w-full bg-[#1e3a8a] text-white py-4 rounded-xl font-bold text-base hover:bg-blue-900 hover:shadow-lg transition-all flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                    <span>{isLoading ? (lang === 'ar' ? 'جاري البحث...' : 'Searching...') : (lang === 'ar' ? 'بحث' : 'Search')}</span>
                  </button>
                </form>

                <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                  <Link to="/admissions" className="inline-flex items-center gap-2 text-sm font-bold text-[#1e3a8a] hover:text-blue-900 transition-colors">
                    <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                    {lang === 'ar' ? 'تقديم طلب جديد' : 'Submit a New Application'}
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            {/* Result */}
            {admission && statusCfg && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                  {/* Status banner */}
                  <div className={`${statusCfg.bg} border-b ${statusCfg.color} px-8 py-6 flex items-center gap-4`}>
                    <statusCfg.icon className="w-8 h-8 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-0.5">
                        {lang === 'ar' ? 'الحالة الحالية' : 'Current Status'}
                      </p>
                      <p className="text-2xl font-black">
                        {lang === 'ar' ? statusCfg.labelAr : statusCfg.labelEn}
                      </p>
                      {admission.status === 'Accepted' && admission.acceptedSchool && (
                        <p className="mt-1 text-base font-bold flex items-center gap-1.5">
                          <GraduationCap className="w-4 h-4" />
                          {admission.acceptedSchool}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-8 space-y-5" dir={isRTL ? 'rtl' : 'ltr'}>
                    <h3 className="font-bold text-slate-800 text-lg">
                      {lang === 'ar' ? 'تفاصيل الطلب' : 'Application Details'}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { label: lang === 'ar' ? 'رقم الطلب' : 'Application ID', value: admission.id, mono: true },
                        { label: lang === 'ar' ? 'اسم الطالب' : 'Student Name', value: admission.studentName },
                        { label: lang === 'ar' ? 'المرحلة الدراسية' : 'Grade Stage', value: admission.gradeStage },
                        { label: lang === 'ar' ? 'تاريخ التقديم' : 'Submission Date', value: admission.createdAt ? new Date(admission.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' }) : '—' },
                      ].map(row => (
                        <div key={row.label} className="bg-slate-50 rounded-xl p-4">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{row.label}</p>
                          <p className={`font-bold text-slate-800 ${row.mono ? 'font-mono tracking-wider' : ''}`}>{row.value || '—'}</p>
                        </div>
                      ))}
                    </div>

                    {/* Preferences list (top 3 shown) */}
                    {Array.isArray(admission.preferences) && admission.preferences.length > 0 && (
                      <div className="bg-slate-50 rounded-xl p-4">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{lang === 'ar' ? 'الرغبات' : 'Preferences'}</p>
                        <ol className={`space-y-1 ${isRTL ? 'pr-4' : 'pl-4'} list-decimal`}>
                          {admission.preferences.map((school: string, i: number) => (
                            <li key={i} className="font-semibold text-slate-700 text-sm">{school}</li>
                          ))}
                        </ol>
                      </div>
                    )}

                    <p className="text-xs text-slate-400 font-medium text-center pt-2">
                      {lang === 'ar' ? 'سيتم التواصل معك عبر البريد الإلكتروني عند تحديث حالة طلبك.' : 'You will be contacted by email when your application status is updated.'}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default AdmissionInquiry;
