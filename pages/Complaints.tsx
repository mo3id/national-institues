
import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { SCHOOLS } from '../constants';
import { Send, CheckCircle } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import ScrollReveal from '../components/ScrollReveal';

const Complaints: React.FC = () => {
  const { lang, isRTL, t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    messageType: 'شكوى',
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
    setFormData({ fullName: '', phone: '', email: '', messageType: 'شكوى', school: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  const messageTypes = t.complaints.types;

  return (
    <PageTransition>
      <div className="overflow-x-hidden">
        {/* Header */}
        <section className="bg-gradient-to-r from-red-700 to-[#991b1b] text-white py-32 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
          </div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <ScrollReveal direction="down">
              <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
                {t.complaints.title}
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <p className="text-red-100/80 text-lg md:text-xl max-w-2xl mx-auto font-medium">
                {t.complaints.subtitle}
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-24 bg-gray-50 relative">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
            <ScrollReveal direction="up" delay={0.2}>
              <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-14 border border-gray-100 overflow-hidden relative">
                <div className={`absolute top-0 ${isRTL ? 'left-0' : 'right-0'} w-32 h-32 bg-red-50 rounded-bl-[5rem] -z-0`} />

                {submitted ? (
                  <div className="text-center py-16 space-y-6 relative z-10 animate-fade-in text-start">
                    <div className="flex justify-center">
                      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
                        <CheckCircle className="h-12 w-12 text-green-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className={`text-3xl font-black text-gray-900 mb-2 uppercase tracking-tight`}>
                        {t.complaints.successTitle}
                      </h3>
                      <p className={`text-gray-500 font-medium text-lg`}>
                        {t.complaints.successDesc}
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                    <div className="text-start">
                      <h3 className="text-2xl font-black text-red-700 uppercase tracking-tight">Send a Message</h3>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-1">We value your feedback and concerns</p>
                    </div>

                    {/* Full Name & Phone */}
                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 text-start`}>
                      <div className="space-y-2">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                          {t.complaints.fullName}
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          required
                          className={`w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:outline-none focus:ring-4 focus:ring-red-100 focus:border-red-600 transition-all font-medium text-blue-900`}
                          placeholder={t.complaints.placeholders.name}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                          {t.complaints.phone}
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className={`w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:outline-none focus:ring-4 focus:ring-red-100 focus:border-red-600 transition-all font-medium text-blue-900`}
                          placeholder={t.complaints.placeholders.phone}
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="text-start space-y-2">
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                        {t.complaints.email}
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className={`w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:outline-none focus:ring-4 focus:ring-red-100 focus:border-red-600 transition-all font-medium text-blue-900`}
                        placeholder={t.complaints.placeholders.email}
                      />
                    </div>

                    {/* Message Type & School */}
                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 text-start`}>
                      <div className="space-y-2">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                          {t.complaints.messageType}
                        </label>
                        <select
                          name="messageType"
                          value={formData.messageType}
                          onChange={handleChange}
                          className={`w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:outline-none focus:ring-4 focus:ring-red-100 focus:border-red-600 transition-all font-bold text-sm text-blue-900 appearance-none cursor-pointer`}
                        >
                          {messageTypes.map((type: string) => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                          {t.complaints.school}
                        </label>
                        <select
                          name="school"
                          value={formData.school}
                          onChange={handleChange}
                          required
                          className={`w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:outline-none focus:ring-4 focus:ring-red-100 focus:border-red-600 transition-all font-bold text-sm text-blue-900 appearance-none cursor-pointer`}
                        >
                          <option value="">{t.complaints.placeholders.school}</option>
                          {SCHOOLS.map(school => (
                            <option key={school.id} value={school.name}>
                              {school.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="text-start space-y-2">
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                        {t.complaints.message}
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className={`w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:outline-none focus:ring-4 focus:ring-red-100 focus:border-red-600 transition-all resize-none font-medium text-blue-900`}
                        placeholder={t.complaints.placeholders.message}
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full bg-red-700 hover:bg-red-800 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-red-900/20 active:scale-95 flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-xs"
                    >
                      <Send className="h-5 w-5" />
                      {t.complaints.submit}
                    </button>
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
