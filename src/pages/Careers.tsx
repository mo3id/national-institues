
import React, { useState } from 'react';
import { Briefcase, MapPin, Clock, ArrowRight, Upload, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useSiteData } from '@/context/DataContext';
import PageTransition from '@/components/common/PageTransition';
import ScrollReveal from '@/components/common/ScrollReveal';
import { CustomSelect } from '@/components/common/FormControls';
import { getJobApplicationSchema } from '@/utils/validations';

const Careers: React.FC = () => {
  const { lang, isRTL, t: translationsRoot } = useLanguage();
  const t = translationsRoot.careers;
  const { data: siteData } = useSiteData();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '' });
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const validationResult = getJobApplicationSchema(lang).safeParse({
      ...formData,
      job: selectedJob || '',
      file: file
    });

    if (!validationResult.success) {
      const newErrors: Record<string, string> = {};
      validationResult.error.issues.forEach(err => {
        if (err.path[0] && !newErrors[err.path[0] as string]) {
          newErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setSubmitted(true);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        <section className="m-[10px] rounded-[20px] relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-blue-900 text-white text-center">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-white rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-red-600 rounded-full blur-3xl" />
          </div>
          <div className="max-w-3xl mx-auto px-4 relative z-10 py-20">
            <ScrollReveal direction="down">
              <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">{t.title}</h1>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <p className="text-lg md:text-2xl text-blue-100/80 font-medium">{t.subtitle}</p>
            </ScrollReveal>
          </div>
        </section>
        <div className="max-w-7xl mx-auto px-4 mt-12 mb-24 relative z-20">
          <div className={`grid grid-cols-1 lg:grid-cols-3 gap-12`}>
            {/* Job Listings */}
            <div className="lg:col-span-2 space-y-8">
              <ScrollReveal>
                <div className="flex items-center space-x-4 mb-8">
                  <div className="h-0.5 w-12 bg-red-600" />
                  <h2 className="text-2xl font-black text-gray-900 uppercase tracking-widest">{t.openings}</h2>
                </div>
              </ScrollReveal>

              {(siteData.jobs || []).map((job, i) => (
                <ScrollReveal key={job.id} delay={i * 0.1}>
                  <div
                    className={`bg-white p-8 rounded-3xl shadow-sm border-2 transition-all cursor-pointer text-start group ${selectedJob === job.id ? 'border-blue-600 shadow-xl' : 'border-transparent hover:border-blue-100 hover:shadow-lg'
                      }`}
                    onClick={() => setSelectedJob(job.id)}
                  >
                    <div className={`flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4`}>
                      <div>
                        <h3 className="text-2xl font-black text-gray-900 group-hover:text-blue-900 transition-colors uppercase tracking-tight">{job.title}</h3>
                        <p className="text-red-700 font-bold text-xs uppercase tracking-widest mt-1">{job.department}</p>
                      </div>
                      <span className="bg-gray-50 text-gray-400 border border-gray-100 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                        {job.type}
                      </span>
                    </div>
                    <div className={`flex flex-wrap gap-6 text-xs text-gray-500 font-bold uppercase tracking-widest mb-6`}>
                      <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <MapPin className="h-4 w-4 text-blue-600" />
                        </div>
                        <span>{job.location}</span>
                      </div>
                      <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                        <div className="p-2 bg-red-50 rounded-lg">
                          <Clock className="h-4 w-4 text-red-600" />
                        </div>
                        <span>{t.posted}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed font-medium mb-8 text-sm md:text-base border-l-2 border-gray-100 pl-4">{job.description}</p>
                    <button className={`bg-gray-50 text-blue-900 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center transition-all group-hover:bg-blue-900 group-hover:text-white ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                      <span>{t.viewDetails}</span>
                      <ArrowRight className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${isRTL ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* Application Form */}
            <div className="lg:col-span-1">
              <ScrollReveal direction="left" delay={0.4}>
                <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl sticky top-24 border border-gray-100 text-start overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-[5rem] -z-0" />

                  {submitted ? (
                    <div className="text-center py-12 space-y-6 relative z-10 animate-fade-in">
                      <div className="flex justify-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
                          <CheckCircle className="h-10 w-10 text-green-600" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">{t.successTitle}</h3>
                        <p className="text-gray-500 mt-2 font-medium">{t.successDesc}</p>
                      </div>
                      <button onClick={() => setSubmitted(false)} className="text-blue-900 font-black uppercase tracking-widest text-xs underline decoration-2 underline-offset-4 hover:text-red-700 transition-colors">{t.applyAnother}</button>
                    </div>
                  ) : (
                    <form onSubmit={handleApply} className="space-y-8 relative z-10" noValidate>
                      <div>
                        <h3 className="text-2xl font-black text-[#1e3a8a] uppercase tracking-tight">
                          {lang === 'ar' ? siteData.formSettings?.jobFormTitleAr : siteData.formSettings?.jobFormTitle}
                        </h3>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
                          {lang === 'ar' ? siteData.formSettings?.jobFormDescAr : siteData.formSettings?.jobFormDesc}
                        </p>
                      </div>

                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">{t.fullName}</label>
                          <input
                            type="text"
                            className={`w-full px-5 py-4 bg-gray-50 border ${errors.fullName ? 'border-red-500 focus:ring-red-500' : 'border-gray-100 focus:ring-blue-100'} rounded-2xl focus:ring-4 focus:border-blue-500 outline-none transition-all font-medium text-blue-900`}
                            value={formData.fullName}
                            onChange={e => {
                              setFormData(prev => ({ ...prev, fullName: e.target.value }));
                              if (errors.fullName) setErrors(prev => ({ ...prev, fullName: '' }));
                            }}
                          />
                          {errors.fullName && <p className="text-red-500 text-xs font-bold mt-1">{errors.fullName}</p>}
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">{t.email}</label>
                          <input
                            type="email"
                            className={`w-full px-5 py-4 bg-gray-50 border ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-100 focus:ring-blue-100'} rounded-2xl focus:ring-4 focus:border-blue-500 outline-none transition-all font-medium text-blue-900`}
                            value={formData.email}
                            onChange={e => {
                              setFormData(prev => ({ ...prev, email: e.target.value }));
                              if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                            }}
                          />
                          {errors.email && <p className="text-red-500 text-xs font-bold mt-1">{errors.email}</p>}
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">{t.phone}</label>
                          <input
                            type="tel"
                            className={`w-full px-5 py-4 bg-gray-50 border ${errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-100 focus:ring-blue-100'} rounded-2xl focus:ring-4 focus:border-blue-500 outline-none transition-all font-medium text-blue-900`}
                            value={formData.phone}
                            onChange={e => {
                              setFormData(prev => ({ ...prev, phone: e.target.value }));
                              if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                            }}
                          />
                          {errors.phone && <p className="text-red-500 text-xs font-bold mt-1">{errors.phone}</p>}
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">{t.jobRef}</label>
                          <div className={errors.job ? 'ring-2 ring-red-500 rounded-xl' : ''}>
                            <CustomSelect
                              value={selectedJob || ''}
                              onChange={val => {
                                setSelectedJob(val);
                                if (errors.job) setErrors(prev => ({ ...prev, job: '' }));
                              }}
                              options={[
                                { value: '', label: t.selectJob },
                                ...(siteData.jobs || []).map(j => ({ value: j.id, label: j.title }))
                              ]}
                              icon={<Briefcase className="h-4 w-4" />}
                            />
                          </div>
                          {errors.job && <p className="text-red-500 text-xs font-bold mt-1">{errors.job}</p>}
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">{t.upload}</label>
                          <label
                            className={`border-2 border-dashed ${errors.file ? 'border-red-400 bg-red-50/10' : 'border-blue-50 hover:border-blue-400 bg-blue-50/10'} rounded-2xl p-8 text-center transition-all cursor-pointer group block`}
                          >
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                              <Upload className={`h-6 w-6 ${errors.file ? 'text-red-600' : 'text-blue-600'}`} />
                            </div>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                              {file ? file.name : t.uploadHint}
                            </span>
                            <input
                              type="file"
                              className="hidden"
                              accept=".pdf,.doc,.docx"
                              onChange={e => {
                                if (e.target.files?.[0]) {
                                  setFile(e.target.files[0]);
                                  if (errors.file) setErrors(prev => ({ ...prev, file: '' }));
                                }
                              }}
                            />
                          </label>
                          {errors.file && <p className="text-red-500 text-xs font-bold mt-1">{errors.file}</p>}
                        </div>
                      </div>
                      <button type="submit" className="w-full bg-[#1e3a8a] text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-blue-900/20 hover:bg-blue-800 transition-all transform hover:-translate-y-1 active:scale-95">
                        {t.submit}
                      </button>
                    </form>
                  )}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Careers;
