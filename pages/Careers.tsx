
import React, { useState } from 'react';
import { JOBS } from '../constants';
import { Briefcase, MapPin, Clock, ArrowRight, Upload, CheckCircle } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import PageTransition from '../components/PageTransition';
import ScrollReveal from '../components/ScrollReveal';

const Careers: React.FC = () => {
  const { lang, isRTL, t: translationsRoot } = useLanguage();
  const t = translationsRoot.careers;
  const [submitted, setSubmitted] = useState(false);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-blue-900 py-32 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-white rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-red-600 rounded-full blur-3xl" />
          </div>
          <div className="max-w-3xl mx-auto px-4 relative z-10">
            <ScrollReveal direction="down">
              <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">{t.title}</h1>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <p className="text-lg md:text-2xl text-blue-100/80 font-medium">{t.subtitle}</p>
            </ScrollReveal>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 -mt-12 mb-24 relative z-20">
          <div className={`grid grid-cols-1 lg:grid-cols-3 gap-12`}>
            {/* Job Listings */}
            <div className="lg:col-span-2 space-y-8">
              <ScrollReveal>
                <div className="flex items-center space-x-4 mb-8">
                  <div className="h-0.5 w-12 bg-red-600" />
                  <h2 className="text-2xl font-black text-gray-900 uppercase tracking-widest">{t.openings}</h2>
                </div>
              </ScrollReveal>

              {JOBS.map((job, i) => (
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
                    <form onSubmit={handleApply} className="space-y-8 relative z-10">
                      <div>
                        <h3 className="text-2xl font-black text-[#1e3a8a] uppercase tracking-tight">{t.applyNow}</h3>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Join our network of excellence</p>
                      </div>

                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">{t.fullName}</label>
                          <input required type="text" className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium text-blue-900" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">{t.email}</label>
                          <input required type="email" className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium text-blue-900" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">{t.jobRef}</label>
                          <select required value={selectedJob || ''} onChange={(e) => setSelectedJob(e.target.value)} className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold text-sm text-blue-900 appearance-none cursor-pointer">
                            <option value="">{t.selectJob}</option>
                            {JOBS.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">{t.upload}</label>
                          <div className="border-2 border-dashed border-blue-50 rounded-2xl p-8 text-center hover:border-blue-400 transition-all cursor-pointer bg-blue-50/10 group">
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                              <Upload className="h-6 w-6 text-blue-600" />
                            </div>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{t.uploadHint}</span>
                            <input required type="file" className="hidden" accept=".pdf,.doc,.docx" />
                          </div>
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
