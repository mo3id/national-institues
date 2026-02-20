
import React, { useState } from 'react';
import { JOBS } from '../constants';
import { Briefcase, MapPin, Clock, ArrowRight, Upload, CheckCircle } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { translations } from '../translations';

const Careers: React.FC = () => {
  const { lang, isRTL } = useLanguage();
  const t = translations[lang].careers;
  const [submitted, setSubmitted] = useState(false);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-900 py-24 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-6">{t.title}</h1>
          <p className="text-xl text-blue-200">{t.subtitle}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-12 mb-24">
        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-12`}>
          {/* Job Listings */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 text-start">{t.openings}</h2>
            {JOBS.map((job) => (
              <div 
                key={job.id} 
                className={`bg-white p-8 rounded-2xl shadow-md border-2 transition-all cursor-pointer text-start ${
                  selectedJob === job.id ? 'border-blue-500' : 'border-transparent hover:border-gray-200'
                }`}
                onClick={() => setSelectedJob(job.id)}
              >
                <div className={`flex justify-between items-start mb-4`}>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                    <p className="text-blue-600 font-medium">{job.department}</p>
                  </div>
                  <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                    {job.type}
                  </span>
                </div>
                <div className={`flex ${isRTL ? 'space-x-reverse space-x-6' : 'space-x-6'} text-sm text-gray-500 mb-6`}>
                  <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-1' : 'space-x-1'}`}>
                    <MapPin className="h-4 w-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-1' : 'space-x-1'}`}>
                    <Clock className="h-4 w-4" />
                    <span>{t.posted}</span>
                  </div>
                </div>
                <p className="text-gray-600 line-clamp-2 mb-6">{job.description}</p>
                <button className={`text-blue-600 font-bold text-sm flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                  <span>{t.viewDetails}</span>
                  <ArrowRight className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
                </button>
              </div>
            ))}
          </div>

          {/* Application Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl shadow-xl sticky top-24 border border-gray-100 text-start">
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="flex justify-center">
                    <CheckCircle className="h-16 w-16 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold">{t.successTitle}</h3>
                  <p className="text-gray-500">{t.successDesc}</p>
                  <button onClick={() => setSubmitted(false)} className="text-blue-600 font-bold underline">{t.applyAnother}</button>
                </div>
              ) : (
                <form onSubmit={handleApply} className="space-y-6">
                  <h3 className="text-xl font-bold">{t.applyNow}</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">{t.fullName}</label>
                      <input required type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">{t.email}</label>
                      <input required type="email" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">{t.jobRef}</label>
                      <select required value={selectedJob || ''} onChange={(e) => setSelectedJob(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                        <option value="">{t.selectJob}</option>
                        {JOBS.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">{t.upload}</label>
                      <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <span className="text-xs text-gray-500">{t.uploadHint}</span>
                        <input required type="file" className="hidden" accept=".pdf,.doc,.docx" />
                      </div>
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all transform hover:scale-[1.02]">
                    {t.submit}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Careers;
