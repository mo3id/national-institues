import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { SCHOOLS } from '../constants';
import { Send } from 'lucide-react';

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

  const messageTypes = lang === 'ar' 
    ? ['شكوى', 'اقتراح', 'استفسار', 'شكر']
    : ['Complaint', 'Suggestion', 'Inquiry', 'Thanks'];

  return (
    <div className="overflow-x-hidden">
      {/* Header */}
      <section className="bg-gradient-to-r from-red-700 to-red-600 text-white py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            {lang === 'ar' ? 'شكاوي وتقييمات العملاء' : 'Customer Complaints & Feedback'}
          </h1>
          <p className="text-red-100/80 text-lg max-w-2xl mx-auto">
            {lang === 'ar' 
              ? 'نحن نهتم برأيك وندعوك لمشاركة أي استفسارات أو شكاوى أو اقتراحات'
              : 'We value your feedback. Share your concerns, suggestions, or inquiries with us.'
            }
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className={`text-2xl font-black text-gray-900 ${isRTL ? 'text-right' : ''}`}>
                  {lang === 'ar' ? 'تم الإرسال بنجاح!' : 'Sent Successfully!'}
                </h3>
                <p className={`text-gray-600 ${isRTL ? 'text-right' : ''}`}>
                  {lang === 'ar' 
                    ? 'شكراً لك على تعليقك. سيتم مراجعة رسالتك قريباً.'
                    : 'Thank you for your feedback. We will review your message soon.'
                  }
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name & Phone */}
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${isRTL ? 'text-right' : ''}`}>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      {lang === 'ar' ? 'الاسم الثلاثي' : 'Full Name'}
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600 transition ${isRTL ? 'text-right' : ''}`}
                      placeholder={lang === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      {lang === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600 transition ${isRTL ? 'text-right' : ''}`}
                      placeholder={lang === 'ar' ? 'أدخل رقم هاتفك' : 'Enter your phone number'}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className={`${isRTL ? 'text-right' : ''}`}>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    {lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600 transition ${isRTL ? 'text-right' : ''}`}
                    placeholder={lang === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                  />
                </div>

                {/* Message Type & School */}
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${isRTL ? 'text-right' : ''}`}>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      {lang === 'ar' ? 'نوع الرسالة' : 'Message Type'}
                    </label>
                    <select
                      name="messageType"
                      value={formData.messageType}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600 transition ${isRTL ? 'text-right' : ''}`}
                    >
                      {messageTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      {lang === 'ar' ? 'المدرسة المعنية' : 'Related School'}
                    </label>
                    <select
                      name="school"
                      value={formData.school}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600 transition ${isRTL ? 'text-right' : ''}`}
                    >
                      <option value="">{lang === 'ar' ? 'اختر المدرسة' : 'Select a school'}</option>
                      {SCHOOLS.map(school => (
                        <option key={school.id} value={school.name}>
                          {school.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div className={`${isRTL ? 'text-right' : ''}`}>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    {lang === 'ar' ? 'نص الرسالة' : 'Message Text'}
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className={`w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600 transition resize-none ${isRTL ? 'text-right' : ''}`}
                    placeholder={lang === 'ar' ? 'اكتب رسالتك هنا...' : 'Write your message here...'}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-red-700 hover:bg-red-800 text-white font-black py-4 rounded-lg transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
                >
                  <Send className="h-5 w-5" />
                  {lang === 'ar' ? 'إرسال الرسالة' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Complaints;
