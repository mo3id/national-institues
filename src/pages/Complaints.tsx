
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useSiteData } from '@/context/DataContext';
import { SCHOOLS } from '@/constants';
import { Send, CheckCircle } from 'lucide-react';
import PageTransition from '@/components/common/PageTransition';
import ScrollReveal from '@/components/common/ScrollReveal';

const Complaints: React.FC = () => {
  const { lang, isRTL, t: translationsRoot } = useLanguage();
  const t = translationsRoot;
  const { data: siteData } = useSiteData();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    messageType: (t?.complaints?.types || [])[0] || '',
    school: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ fullName: '', phone: '', email: '', messageType: (t?.complaints?.types || [])[0] || '', school: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  const messageTypes = t?.complaints?.types || [];

  return (
    <PageTransition>
      <div className="overflow-x-hidden">
        {/* Header */}
        {/* Unified Hero Header */}
        <section className="m-[10px] rounded-[20px] relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-[#0f172a]">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#991b1b]/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
          </div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 py-20">
            <ScrollReveal direction="down">
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 tracking-tight text-white leading-tight drop-shadow-lg">
                {t?.complaints?.title}
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <p className="text-blue-100/80 text-lg md:text-xl max-w-2xl mx-auto font-medium">
                {t?.complaints?.subtitle}
              </p>
            </ScrollReveal>
          </div>
        </section>
        {/* Form Section */}
        <section className="py-24 bg-[#fafcff] relative">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 relative z-20">
            <ScrollReveal direction="up" delay={0.2}>
              <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-14 border border-slate-100 overflow-hidden relative">
                <div className={`absolute top-0 ${isRTL ? 'left-0' : 'right-0'} w-64 h-64 bg-blue-50 rounded-full blur-3xl -z-0 opacity-50`} />

                {submitted ? (
                  <div className="text-center py-16 space-y-6 relative z-10 animate-fade-in text-start">
                    <div className="flex justify-center">
                      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
                        <CheckCircle className="h-12 w-12 text-green-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className={`text-3xl font-black text-gray-900 mb-2 uppercase tracking-tight`}>
                        {t?.complaints?.successTitle}
                      </h3>
                      <p className={`text-gray-500 font-medium text-lg`}>
                        {t?.complaints?.successDesc}
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                    <div className="text-start">
                      <h3 className="text-3xl font-bold text-slate-900 mb-2">
                        {lang === 'ar' ? siteData.formSettings?.contactFormTitleAr : siteData.formSettings?.contactFormTitle}
                      </h3>
                      <p className={`text-slate-500 font-medium ${isRTL ? 'text-sm' : 'text-xs uppercase tracking-widest'}`}>
                        {lang === 'ar' ? siteData.formSettings?.contactFormDescAr : siteData.formSettings?.contactFormDesc}
                      </p>
                    </div>

                    {/* Full Name & Phone */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-start">
                      <div className="space-y-2">
                        <label className={`block font-bold text-slate-700 ${isRTL ? 'text-sm' : 'text-xs uppercase tracking-wider'}`}>
                          {t?.complaints?.fullName} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          required
                          className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] transition-all ${isRTL ? 'text-right' : 'text-left'}`}
                          placeholder={t?.complaints?.placeholders?.name}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className={`block font-bold text-slate-700 ${isRTL ? 'text-sm' : 'text-xs uppercase tracking-wider'}`}>
                          {t?.complaints?.phone} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] transition-all text-left"
                          placeholder={t?.complaints?.placeholders?.phone}
                          dir="ltr"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="text-start space-y-2">
                      <label className={`block font-bold text-slate-700 ${isRTL ? 'text-sm' : 'text-xs uppercase tracking-wider'}`}>
                        {t?.complaints?.email} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] transition-all text-left"
                        placeholder={t?.complaints?.placeholders?.email}
                        dir="ltr"
                      />
                    </div>

                    {/* Message Type & School */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-start">
                      <div className="space-y-2">
                        <label className={`block font-bold text-slate-700 ${isRTL ? 'text-sm' : 'text-xs uppercase tracking-wider'}`}>
                          {t?.complaints?.messageType}
                        </label>
                        <select
                          name="messageType"
                          value={formData.messageType}
                          onChange={handleChange}
                          className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] transition-all ${isRTL ? 'text-right' : 'text-left'}`}
                        >
                          {messageTypes.map((type: string) => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className={`block font-bold text-slate-700 ${isRTL ? 'text-sm' : 'text-xs uppercase tracking-wider'}`}>
                          {t?.complaints?.school} <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="school"
                          value={formData.school}
                          onChange={handleChange}
                          required
                          className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] transition-all ${isRTL ? 'text-right' : 'text-left'}`}
                        >
                          <option value="">{t?.complaints?.placeholders?.school}</option>
                          {SCHOOLS.map(school => (
                            <option key={school.id} value={school.name}>
                              {lang === 'ar' ? school.nameAr : school.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="text-start space-y-2">
                      <label className={`block font-bold text-slate-700 ${isRTL ? 'text-sm' : 'text-xs uppercase tracking-wider'}`}>
                        {t?.complaints?.message} <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] transition-all resize-none ${isRTL ? 'text-right' : 'text-left'}`}
                        placeholder={t?.complaints?.placeholders?.message}
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4 flex justify-end">
                      <button
                        type="submit"
                        className={`w-full md:w-auto bg-[#1e3a8a] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-blue-900 hover:shadow-lg transition-all flex items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
                      >
                        <Send className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
                        <span>{t?.complaints?.submit}</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </ScrollReveal>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default Complaints;
