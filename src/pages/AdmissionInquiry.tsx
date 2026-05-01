import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import GraduationCap from 'lucide-react/dist/esm/icons/graduation-cap';
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
import PageTransition from '@/components/common/PageTransition';
import ScrollReveal from '@/components/common/ScrollReveal';
import { getAdmissionStatus, AdmissionStatus } from '@/services/admissionsApi';

const STATUS_CONFIG: Record<string, { color: string; bg: string; icon: React.ElementType; labelAr: string; labelEn: string }> = {
  'pending':              { color: 'text-amber-700',  bg: 'bg-amber-50  border-amber-200',  icon: Clock,        labelAr: 'معلق',                      labelEn: 'Pending' },
  'under_review':         { color: 'text-blue-700',   bg: 'bg-blue-50   border-blue-200',   icon: AlertCircle,  labelAr: 'قيد المراجعة',             labelEn: 'Under Review' },
  'accepted':             { color: 'text-green-700',  bg: 'bg-green-50  border-green-200',  icon: CheckCircle,  labelAr: 'مقبول',                     labelEn: 'Accepted' },
  'waitlist':             { color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200', icon: Clock,        labelAr: 'قائمة الانتظار',           labelEn: 'Waitlist' },
  'rejected':             { color: 'text-red-700',    bg: 'bg-red-50    border-red-200',    icon: XCircle,      labelAr: 'مرفوض',                     labelEn: 'Rejected' },
  'modification_requested': { color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200', icon: History,    labelAr: 'بانتظار تعديل الرغبات',     labelEn: 'Modification Requested' },
  'modification_approved': { color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200', icon: Edit3,       labelAr: 'تمت الموافقة على التعديل', labelEn: 'Modification Approved' },
};

const AdmissionInquiry: React.FC = () => {
  const { lang, isRTL } = useLanguage();
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState<'id' | 'applicationNumber' | 'nationalId'>('applicationNumber');
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [admission, setAdmission] = useState<AdmissionStatus | null>(null);

  const handleInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = searchValue.trim();
    if (!value) return;
    
    setIsLoading(true);
    setError(null);
    setAdmission(null);
    
    try {
      const identifier = searchType === 'id' 
        ? { admissionId: value }
        : searchType === 'applicationNumber'
        ? { applicationNumber: value }
        : { nationalId: value };
        
      const result = await getAdmissionStatus(identifier);
      if (result.status === 'success' && result.data) {
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
  
  const handleRequestModification = () => {
    if (admission) {
      navigate(`/modifications/request?admissionId=${admission.applicationId}`);
    }
  };
  
  const handleEditPreferences = () => {
    if (admission) {
      navigate(`/admissions/edit?id=${admission.applicationId}`);
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
                      {lang === 'ar' ? 'طريقة البحث' : 'Search Method'}
                    </label>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {[
                        { key: 'applicationNumber', labelAr: 'رقم الطلب', labelEn: 'App Number' },
                        { key: 'id', labelAr: 'رقم القيد', labelEn: 'ID' },
                        { key: 'nationalId', labelAr: 'الرقم القومي', labelEn: 'National ID' },
                      ].map((type) => (
                        <button
                          key={type.key}
                          type="button"
                          onClick={() => { setSearchType(type.key as any); setSearchValue(''); setError(null); }}
                          className={`py-2 px-1 rounded-lg text-xs font-bold transition-all ${
                            searchType === type.key
                              ? 'bg-[#1e3a8a] text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {lang === 'ar' ? type.labelAr : type.labelEn}
                        </button>
                      ))}
                    </div>
                    <label className={`block font-bold text-slate-700 mb-2 ${isRTL ? 'text-sm' : 'text-xs uppercase tracking-widest'}`}>
                      {searchType === 'applicationNumber' 
                        ? (lang === 'ar' ? 'رقم الطلب' : 'Application Number')
                        : searchType === 'id'
                        ? (lang === 'ar' ? 'رقم القيد' : 'Admission ID')
                        : (lang === 'ar' ? 'الرقم القومي' : 'National ID')}
                    </label>
                    <input
                      type="text"
                      value={searchValue}
                      onChange={e => { setSearchValue(e.target.value); setError(null); }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent transition-all text-lg font-mono tracking-widest text-center"
                      placeholder={searchType === 'applicationNumber' ? 'APP-2026-XXX-NNNN' : searchType === 'id' ? 'ADM_XXXXX' : 'XXXXXXXXXXXXXX'}
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
                    disabled={isLoading || !searchValue.trim()}
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
                        { label: lang === 'ar' ? 'رقم الطلب' : 'Application Number', value: admission.applicationNumber, mono: true },
                        { label: lang === 'ar' ? 'رقم القيد' : 'Admission ID', value: admission.applicationId, mono: true },
                        { label: lang === 'ar' ? 'اسم الطالب' : 'Student Name', value: admission.studentName },
                        { label: lang === 'ar' ? 'المرحلة الدراسية' : 'Grade Stage', value: `${admission.gradeStage}${admission.gradeClass ? ' - ' + admission.gradeClass : ''}` },
                        { label: lang === 'ar' ? 'تاريخ التقديم' : 'Submission Date', value: admission.submittedAt ? new Date(admission.submittedAt).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' }) : '—' },
                      ].map(row => (
                        <div key={row.label} className="bg-slate-50 rounded-xl p-4">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{row.label}</p>
                          <p className={`font-bold text-slate-800 ${row.mono ? 'font-mono tracking-wider' : ''}`}>{row.value || '—'}</p>
                        </div>
                      ))}
                    </div>

                    {/* Preferences list */}
                    {Array.isArray(admission.preferences) && admission.preferences.length > 0 && (
                      <div className="bg-slate-50 rounded-xl p-4">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{lang === 'ar' ? 'الرغبات المقدمة' : 'Submitted Preferences'}</p>
                        <ol className={`space-y-2 ${isRTL ? 'pr-4' : 'pl-4'} list-decimal`}>
                          {admission.preferences.map((pref, i: number) => (
                            <li key={i} className="font-semibold text-slate-700 text-sm">
                              {pref.schoolName}
                              <span className="text-slate-400 font-normal ml-2">({pref.stage})</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                    
                    {/* Modification Requests History */}
                    {Array.isArray(admission.modifications) && admission.modifications.length > 0 && (
                      <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                        <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <History className="w-4 h-4" />
                          {lang === 'ar' ? 'سجل طلبات التعديل' : 'Modification History'}
                        </p>
                        <div className="space-y-3">
                          {admission.modifications.map((mod, i: number) => (
                            <div key={i} className="bg-white rounded-lg p-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-mono text-sm font-bold text-slate-700">{mod.requestNumber}</span>
                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                                  mod.status === 'approved' ? 'bg-green-100 text-green-700' :
                                  mod.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                  mod.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                                  'bg-amber-100 text-amber-700'
                                }`}>
                                  {mod.statusLabel}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 mb-1">{mod.reason}</p>
                              {mod.adminResponse && (
                                <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded">
                                  <span className="font-bold">{lang === 'ar' ? 'رد الأدمن: ' : 'Admin Response: '}</span>
                                  {mod.adminResponse}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
                      {admission.actions.canEditPreferences && (
                        <button
                          onClick={handleEditPreferences}
                          className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-purple-700 transition-all flex items-center justify-center gap-2"
                        >
                          <Edit3 className="w-4 h-4" />
                          {lang === 'ar' ? 'تعديل الرغبات الآن' : 'Edit Preferences Now'}
                        </button>
                      )}
                      {admission.actions.canRequestModification && (
                        <button
                          onClick={handleRequestModification}
                          className="flex-1 bg-[#1e3a8a] text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-900 transition-all flex items-center justify-center gap-2"
                        >
                          <FileText className="w-4 h-4" />
                          {lang === 'ar' ? 'طلب تعديل الرغبات' : 'Request Modification'}
                        </button>
                      )}
                    </div>

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
