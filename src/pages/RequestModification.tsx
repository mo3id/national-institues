import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Edit3 from 'lucide-react/dist/esm/icons/edit-3';
import Loader2 from 'lucide-react/dist/esm/icons/loader-2';
import AlertCircle from 'lucide-react/dist/esm/icons/alert-circle';
import CheckCircle from 'lucide-react/dist/esm/icons/check-circle';
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left';
import School from 'lucide-react/dist/esm/icons/school';
import FileText from 'lucide-react/dist/esm/icons/file-text';
import PageTransition from '@/components/common/PageTransition';
import ScrollReveal from '@/components/common/ScrollReveal';
import { requestModification, getAdmissionStatus, Preference } from '@/services/admissionsApi';
import { getSchools } from '@/services/api';

const RequestModification: React.FC = () => {
  const { lang, isRTL } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const admissionId = searchParams.get('admissionId');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ requestNumber: string; trackUrl: string } | null>(null);
  
  const [admission, setAdmission] = useState<any>(null);
  const [schools, setSchools] = useState<any[]>([]);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (!admissionId) {
      setError(lang === 'ar' ? 'رقم الطلب مطلوب' : 'Admission ID is required');
      return;
    }
    
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load admission details
        const admissionResult = await getAdmissionStatus({ admissionId });
        if (admissionResult.status === 'success' && admissionResult.data) {
          setAdmission(admissionResult.data);
          // Pre-fill with current preferences
          const currentPrefs = admissionResult.data.preferences.map((p: any) => p.schoolId);
          setSelectedPreferences(currentPrefs);
        } else {
          setError(lang === 'ar' ? 'لم يتم العثور على الطلب' : 'Application not found');
        }
        
        // Load schools list
        const schoolsResult = await getSchools();
        if (schoolsResult.status === 'success') {
          // Filter schools by grade stage
          const relevantSchools = schoolsResult.data.filter((s: any) => 
            s.stage === admissionResult.data?.gradeStage
          );
          setSchools(relevantSchools.length > 0 ? relevantSchools : schoolsResult.data);
        }
      } catch (err: any) {
        setError(err.message || (lang === 'ar' ? 'حدث خطأ في تحميل البيانات' : 'Error loading data'));
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [admissionId, lang]);

  const handleToggleSchool = (schoolId: string) => {
    setSelectedPreferences(prev => {
      if (prev.includes(schoolId)) {
        return prev.filter(id => id !== schoolId);
      }
      if (prev.length >= 10) {
        return prev; // Max 10 preferences
      }
      return [...prev, schoolId];
    });
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setSelectedPreferences(prev => {
      const newPrefs = [...prev];
      [newPrefs[index], newPrefs[index - 1]] = [newPrefs[index - 1], newPrefs[index]];
      return newPrefs;
    });
  };

  const handleMoveDown = (index: number) => {
    if (index === selectedPreferences.length - 1) return;
    setSelectedPreferences(prev => {
      const newPrefs = [...prev];
      [newPrefs[index], newPrefs[index + 1]] = [newPrefs[index + 1], newPrefs[index]];
      return newPrefs;
    });
  };

  const handleRemove = (schoolId: string) => {
    setSelectedPreferences(prev => prev.filter(id => id !== schoolId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedPreferences.length === 0) {
      setError(lang === 'ar' ? 'يرجى اختيار مدرسة واحدة على الأقل' : 'Please select at least one school');
      return;
    }
    
    if (!reason.trim()) {
      setError(lang === 'ar' ? 'يرجى إدخال سبب التعديل' : 'Please enter a reason for modification');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const preferences: Preference[] = selectedPreferences.map((schoolId, index) => {
        const school = schools.find(s => s.id === schoolId);
        return {
          schoolId,
          schoolName: school?.name,
          schoolNameAr: school?.nameAr,
          stage: school?.stage,
        };
      });
      
      const result = await requestModification({
        admissionId: admissionId!,
        requestedPreferences: preferences,
        reason: reason.trim(),
      });
      
      if (result.status === 'success' && result.data) {
        setSuccess({
          requestNumber: result.data.requestNumber,
          trackUrl: result.data.trackUrl,
        });
      } else {
        setError(result.message || (lang === 'ar' ? 'فشل في تقديم الطلب' : 'Failed to submit request'));
      }
    } catch (err: any) {
      setError(err.message || (lang === 'ar' ? 'حدث خطأ أثناء تقديم الطلب' : 'Error submitting request'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSchoolById = (id: string) => schools.find(s => s.id === id);

  if (isLoading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-[#fafcff] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#1e3a8a]" />
        </div>
      </PageTransition>
    );
  }

  if (success) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-[#fafcff] py-12 px-4">
          <div className="max-w-xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                {lang === 'ar' ? 'تم تقديم طلب التعديل بنجاح!' : 'Modification Request Submitted!'}
              </h2>
              <p className="text-slate-600 mb-6">
                {lang === 'ar' 
                  ? 'سيتم مراجعة طلبك من قبل الإدارة وإبلاغك بالنتيجة' 
                  : 'Your request will be reviewed by administration and you will be notified of the result'}
              </p>
              
              <div className="bg-slate-50 rounded-xl p-4 mb-6">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  {lang === 'ar' ? 'رقم طلب التعديل' : 'Modification Request Number'}
                </p>
                <p className="font-mono text-xl font-bold text-[#1e3a8a] tracking-wider">
                  {success.requestNumber}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate(`/modifications/track?requestNumber=${success.requestNumber}`)}
                  className="flex-1 bg-[#1e3a8a] text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-900 transition-all"
                >
                  {lang === 'ar' ? 'تتبع الطلب' : 'Track Request'}
                </button>
                <button
                  onClick={() => navigate('/admissions/inquiry')}
                  className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all"
                >
                  {lang === 'ar' ? 'العودة للاستعلام' : 'Back to Inquiry'}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="overflow-x-hidden min-h-screen bg-[#fafcff]">
        {/* Hero */}
        <section className="m-[10px] rounded-[20px] relative min-h-[35vh] flex items-center justify-center overflow-hidden bg-[#0f172a]">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#991b1b]/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
          </div>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 py-12">
            <ScrollReveal direction="down">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 mb-6">
                <Edit3 className="w-4 h-4 text-purple-300" />
                <span className="text-white/80 text-sm font-bold">
                  {lang === 'ar' ? 'تعديل الرغبات' : 'Modify Preferences'}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                {lang === 'ar' ? 'طلب تعديل رغبات المدارس' : 'Request School Preference Modification'}
              </h1>
              <p className="text-blue-100/70 text-lg font-medium">
                {lang === 'ar' 
                  ? 'اختر المدارس الجديدة بالترتيب المفضل لديك' 
                  : 'Select new schools in your preferred order'}
              </p>
            </ScrollReveal>
          </div>
        </section>

        <section className="py-8 px-4">
          <div className="max-w-4xl mx-auto">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3"
              >
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-red-700 font-semibold text-sm">{error}</p>
              </motion.div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {/* Left: Selected Preferences */}
              <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-[#1e3a8a]" />
                  <h3 className="font-bold text-slate-800">
                    {lang === 'ar' ? 'الرغبات المختارة' : 'Selected Preferences'}
                  </h3>
                  <span className="ml-auto text-xs font-bold text-slate-400">
                    {selectedPreferences.length}/10
                  </span>
                </div>
                
                {selectedPreferences.length === 0 ? (
                  <p className="text-slate-400 text-sm text-center py-8">
                    {lang === 'ar' ? 'اختر المدارس من القائمة على اليمين' : 'Select schools from the list on the right'}
                  </p>
                ) : (
                  <div className="space-y-2">
                    {selectedPreferences.map((schoolId, index) => {
                      const school = getSchoolById(schoolId);
                      return (
                        <div
                          key={schoolId}
                          className="flex items-center gap-3 bg-slate-50 rounded-xl p-3"
                        >
                          <span className="w-6 h-6 bg-[#1e3a8a] text-white rounded-full flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-slate-700 text-sm truncate">
                              {lang === 'ar' ? school?.nameAr : school?.name}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleMoveUp(index)}
                              disabled={index === 0}
                              className="p-1 rounded hover:bg-slate-200 disabled:opacity-30 transition-colors"
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveDown(index)}
                              disabled={index === selectedPreferences.length - 1}
                              className="p-1 rounded hover:bg-slate-200 disabled:opacity-30 transition-colors"
                            >
                              ↓
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemove(schoolId)}
                              className="p-1 rounded hover:bg-red-100 text-red-500 transition-colors"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Right: Available Schools */}
              <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <School className="w-5 h-5 text-[#1e3a8a]" />
                  <h3 className="font-bold text-slate-800">
                    {lang === 'ar' ? 'المدارس المتاحة' : 'Available Schools'}
                  </h3>
                </div>
                
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {schools.map((school) => {
                    const isSelected = selectedPreferences.includes(school.id);
                    return (
                      <button
                        key={school.id}
                        type="button"
                        onClick={() => handleToggleSchool(school.id)}
                        disabled={isSelected}
                        className={`w-full text-right p-3 rounded-xl border transition-all ${
                          isSelected
                            ? 'bg-green-50 border-green-200 opacity-60'
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                        }`}
                        dir={isRTL ? 'rtl' : 'ltr'}
                      >
                        <div className="flex items-center gap-3">
                          {isSelected ? (
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <p className="font-bold text-slate-700 text-sm">
                              {lang === 'ar' ? school.nameAr : school.name}
                            </p>
                            <p className="text-xs text-slate-400">{school.stage}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Reason & Submit */}
            <form onSubmit={handleSubmit} className="mt-6 bg-white rounded-3xl shadow-xl border border-slate-100 p-6">
              <div className="mb-4">
                <label className="block font-bold text-slate-700 mb-2">
                  {lang === 'ar' ? 'سبب التعديل *' : 'Reason for Modification *'}
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent transition-all min-h-[100px] resize-none"
                  placeholder={lang === 'ar' ? 'اكتب سبب طلب تعديل الرغبات...' : 'Write the reason for requesting preference modification...'}
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="sm:flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                >
                  <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                  {lang === 'ar' ? 'العودة' : 'Back'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || selectedPreferences.length === 0 || !reason.trim()}
                  className="sm:flex-1 bg-[#1e3a8a] text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-900 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Edit3 className="w-4 h-4" />
                  )}
                  {isSubmitting 
                    ? (lang === 'ar' ? 'جاري الإرسال...' : 'Submitting...')
                    : (lang === 'ar' ? 'تقديم طلب التعديل' : 'Submit Modification Request')}
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default RequestModification;
