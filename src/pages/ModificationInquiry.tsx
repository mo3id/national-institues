import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Search from 'lucide-react/dist/esm/icons/search';
import Loader2 from 'lucide-react/dist/esm/icons/loader-2';
import CheckCircle from 'lucide-react/dist/esm/icons/check-circle';
import Clock from 'lucide-react/dist/esm/icons/clock';
import XCircle from 'lucide-react/dist/esm/icons/x-circle';
import AlertCircle from 'lucide-react/dist/esm/icons/alert-circle';
import Edit3 from 'lucide-react/dist/esm/icons/edit-3';
import FileText from 'lucide-react/dist/esm/icons/file-text';
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left';
import History from 'lucide-react/dist/esm/icons/history';
import School from 'lucide-react/dist/esm/icons/school';
import PageTransition from '@/components/common/PageTransition';
import ScrollReveal from '@/components/common/ScrollReveal';
import { getModificationStatus, ModificationStatus } from '@/services/admissionsApi';

const STATUS_CONFIG: Record<string, { color: string; bg: string; icon: React.ElementType; labelAr: string; labelEn: string }> = {
  'pending':  { color: 'text-amber-700',  bg: 'bg-amber-50  border-amber-200',  icon: Clock,       labelAr: 'معلق',            labelEn: 'Pending' },
  'approved': { color: 'text-green-700',  bg: 'bg-green-50  border-green-200',  icon: CheckCircle, labelAr: 'تمت الموافقة',    labelEn: 'Approved' },
  'rejected': { color: 'text-red-700',    bg: 'bg-red-50    border-red-200',    icon: XCircle,     labelAr: 'مرفوض',           labelEn: 'Rejected' },
  'completed':{ color: 'text-blue-700',   bg: 'bg-blue-50   border-blue-200',   icon: Edit3,       labelAr: 'مكتمل',           labelEn: 'Completed' },
};

const ModificationInquiry: React.FC = () => {
  const { lang, isRTL } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [requestNumber, setRequestNumber] = useState('');
  const [nationalIdSuffix, setNationalIdSuffix] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [request, setRequest] = useState<ModificationStatus | null>(null);

  // Auto-search if requestNumber is provided in URL
  useEffect(() => {
    const modRequestNumber = searchParams.get('requestNumber');
    if (modRequestNumber) {
      setRequestNumber(modRequestNumber.toUpperCase());
      // Trigger search automatically
      setTimeout(() => {
        const formEvent = { preventDefault: () => {} } as React.FormEvent;
        handleInquiry(formEvent, modRequestNumber.toUpperCase());
      }, 100);
    }
  }, [searchParams]);

  const handleInquiry = async (e: React.FormEvent, autoSearchNumber?: string) => {
    e.preventDefault();
    const num = (autoSearchNumber || requestNumber).trim().toUpperCase();
    if (!num) return;

    setIsLoading(true);
    setError(null);
    setRequest(null);

    try {
      let result;
      if (num.startsWith('MOD-')) {
        result = await getModificationStatus(num, nationalIdSuffix.trim() || undefined);
      } else if (num.startsWith('APP-')) {
        result = await getModificationStatus(undefined, nationalIdSuffix.trim() || undefined, num);
      } else {
        // Try both — request number first, then application number
        try {
          result = await getModificationStatus(num, nationalIdSuffix.trim() || undefined);
        } catch (firstErr: any) {
          // If first attempt failed, try as application number
          if (firstErr?.response?.status === 404) {
            result = await getModificationStatus(undefined, nationalIdSuffix.trim() || undefined, num);
          } else {
            throw firstErr;
          }
        }
      }

      if (result && result.status === 'success' && result.data) {
        setRequest(result.data);
      } else {
        setError(lang === 'ar' ? 'لم يتم العثور على طلب بهذا الرقم.' : 'No request found with this number.');
      }
    } catch (err: any) {
      if (err?.response?.status === 404) {
        setError(lang === 'ar' ? 'لم يتم العثور على طلب بهذا الرقم.' : 'No request found with this number.');
      } else {
        setError(err?.response?.data?.message || err.message || (lang === 'ar' ? 'حدث خطأ، يرجى المحاولة مرة أخرى.' : 'An error occurred, please try again.'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditPreferences = () => {
    if (request) {
      // Navigate to edit page with request number as identifier
      navigate(`/admissions/edit?modRequestNumber=${request.requestNumber}`);
    }
  };

  const handleNewRequest = () => {
    navigate('/modifications/request');
  };

  const statusCfg = request ? (STATUS_CONFIG[request.status] || STATUS_CONFIG['pending']) : null;

  return (
    <PageTransition>
      <div className="overflow-x-hidden min-h-screen bg-[#fafcff]">
        {/* Hero */}
        <section className="m-[10px] rounded-[20px] relative min-h-[40vh] flex items-center justify-center overflow-hidden bg-[#0f172a]">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#991b1b]/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
          </div>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 py-16 flex flex-col items-center">
            <ScrollReveal direction="down">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 mb-6">
                <History className="w-4 h-4 text-purple-300" />
                <span className="text-white/80 text-sm font-bold">
                  {lang === 'ar' ? 'متابعة طلب التعديل' : 'Track Modification Request'}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                {lang === 'ar' ? 'تتبع حالة طلب التعديل' : 'Track Your Modification Request'}
              </h1>
              <p className="text-blue-100/70 text-lg font-medium">
                {lang === 'ar' ? 'أدخل رقم طلب التعديل أو رقم طلب القبول' : 'Enter the modification request number or application number'}
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
                      {lang === 'ar' ? 'رقم طلب التعديل أو رقم طلب القبول' : 'Modification Request Number or Application Number'}
                    </label>
                    <input
                      type="text"
                      value={requestNumber}
                      onChange={e => { setRequestNumber(e.target.value.toUpperCase()); setError(null); }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all text-lg font-mono tracking-widest text-center"
                      placeholder="MOD-2026-XXX-NNNN أو APP-2026-XXX-NNNN"
                      dir="ltr"
                      autoComplete="off"
                      spellCheck={false}
                    />
                  </div>
                  
                  <div>
                    <label className={`block font-bold text-slate-700 mb-2 ${isRTL ? 'text-sm' : 'text-xs uppercase tracking-widest'}`}>
                      {lang === 'ar' ? 'آخر 4 أرقام من الرقم القومي (اختياري)' : 'Last 4 digits of National ID (Optional)'}
                    </label>
                    <input
                      type="text"
                      value={nationalIdSuffix}
                      onChange={e => { setNationalIdSuffix(e.target.value.replace(/\D/g, '').slice(0, 4)); setError(null); }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all text-lg font-mono tracking-widest text-center"
                      placeholder="NNNN"
                      dir="ltr"
                      maxLength={4}
                      autoComplete="off"
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
                    disabled={isLoading || !requestNumber.trim()}
                    className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold text-base hover:bg-purple-700 hover:shadow-lg transition-all flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                    <span>{isLoading ? (lang === 'ar' ? 'جاري البحث...' : 'Searching...') : (lang === 'ar' ? 'بحث' : 'Search')}</span>
                  </button>
                </form>

                <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                  <Link to="/admissions/inquiry" className="flex-1 inline-flex items-center justify-center gap-2 text-sm font-bold text-[#1e3a8a] hover:text-blue-900 transition-colors py-2">
                    <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                    {lang === 'ar' ? 'العودة لتتبع الطلب الأصلي' : 'Back to Track Original Application'}
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            {/* Result */}
            {request && statusCfg && (
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
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-8 space-y-5" dir={isRTL ? 'rtl' : 'ltr'}>
                    <h3 className="font-bold text-slate-800 text-lg">
                      {lang === 'ar' ? 'تفاصيل طلب التعديل' : 'Modification Request Details'}
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { label: lang === 'ar' ? 'رقم طلب التعديل' : 'Request Number', value: request.requestNumber, mono: true },
                        { label: lang === 'ar' ? 'اسم الطالب' : 'Student Name', value: request.studentName },
                        { label: lang === 'ar' ? 'تاريخ الطلب' : 'Request Date', value: request.requestedAt ? new Date(request.requestedAt).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' }) : '—' },
                        { label: lang === 'ar' ? 'تاريخ المراجعة' : 'Review Date', value: request.reviewedAt ? new Date(request.reviewedAt).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' }) : (lang === 'ar' ? 'لم تتم بعد' : 'Not reviewed yet') },
                      ].map(row => (
                        <div key={row.label} className="bg-slate-50 rounded-xl p-4">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{row.label}</p>
                          <p className={`font-bold text-slate-800 ${row.mono ? 'font-mono tracking-wider' : ''}`}>{row.value || '—'}</p>
                        </div>
                      ))}
                    </div>
                    
                    {/* Reason */}
                    <div className="bg-slate-50 rounded-xl p-4">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{lang === 'ar' ? 'سبب التعديل' : 'Modification Reason'}</p>
                      <p className="font-semibold text-slate-700">{request.reason}</p>
                    </div>

                    {/* Requested Preferences */}
                    {Array.isArray(request.requestedPreferences) && request.requestedPreferences.length > 0 && (
                      <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                        <p className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <School className="w-4 h-4" />
                          {lang === 'ar' ? 'الرغبات المطلوبة' : 'Requested Preferences'}
                        </p>
                        <ol className={`space-y-2 ${isRTL ? 'pr-4' : 'pl-4'} list-decimal`}>
                          {request.requestedPreferences.map((pref, i: number) => (
                            <li key={i} className="font-semibold text-slate-700 text-sm">
                              {pref.schoolNameAr || pref.schoolName}
                              <span className="text-slate-400 font-normal ml-2">({pref.stage})</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                    
                    {/* Admin Response */}
                    {request.adminResponse && (
                      <div className={`rounded-xl p-4 ${request.status === 'rejected' ? 'bg-red-50 border border-red-100' : 'bg-green-50 border border-green-100'}`}>
                        <p className={`text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2 ${request.status === 'rejected' ? 'text-red-600' : 'text-green-600'}`}>
                          <AlertCircle className="w-4 h-4" />
                          {lang === 'ar' ? 'رد الإدارة' : 'Admin Response'}
                        </p>
                        <p className="font-semibold text-slate-700">{request.adminResponse}</p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
                      {request.actions.canEdit && (
                        <button
                          onClick={handleEditPreferences}
                          className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-purple-700 transition-all flex items-center justify-center gap-2"
                        >
                          <Edit3 className="w-4 h-4" />
                          {lang === 'ar' ? 'تعديل الرغبات الآن' : 'Edit Preferences Now'}
                        </button>
                      )}
                      {request.actions.canResubmit && (
                        <button
                          onClick={handleNewRequest}
                          className="flex-1 bg-[#1e3a8a] text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-900 transition-all flex items-center justify-center gap-2"
                        >
                          <FileText className="w-4 h-4" />
                          {lang === 'ar' ? 'تقديم طلب تعديل جديد' : 'Submit New Modification Request'}
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 font-medium text-center pt-2">
                      {lang === 'ar' ? 'سيتم إشعارك عبر البريد الإلكتروني بأي تحديثات على طلبك.' : 'You will be notified via email of any updates to your request.'}
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

export default ModificationInquiry;
