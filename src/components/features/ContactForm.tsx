import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Send, CheckCircle2 } from 'lucide-react';

const ContactForm: React.FC = () => {
    const { lang, isRTL } = useLanguage();
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setTimeout(() => {
            setSubmitting(false);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        }, 1500);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">
                        {lang === 'ar' ? 'الاسم بالكامل' : 'Full Name'}
                    </label>
                    <input
                        type="text"
                        required
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder={lang === 'ar' ? 'أدخل اسمك بالكامل' : 'Enter your full name'}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">
                        {lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                    </label>
                    <input
                        type="email"
                        required
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder={lang === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email address'}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">
                    {lang === 'ar' ? 'الموضوع' : 'Subject'}
                </label>
                <input
                    type="text"
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder={lang === 'ar' ? 'موضوع رسالتك' : 'Subject of your message'}
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">
                    {lang === 'ar' ? 'الرسالة' : 'Message'}
                </label>
                <textarea
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                    placeholder={lang === 'ar' ? 'اكتب رسالتك هنا...' : 'Write your message here...'}
                />
            </div>

            <button
                type="submit"
                disabled={submitting || success}
                className={`w-full py-4 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300 ${success ? 'bg-green-500' : 'bg-[#1e3a8a] hover:bg-blue-900 shadow-xl shadow-blue-900/20'
                    } disabled:opacity-70 disabled:cursor-not-allowed`}
            >
                {success ? (
                    <>
                        <CheckCircle2 className="animate-scale-in" />
                        {lang === 'ar' ? 'تم الإرسال بنجاح' : 'Sent Successfully'}
                    </>
                ) : (
                    <>
                        {submitting ? (
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                {lang === 'ar' ? 'إرسال الرسالة' : 'Send Message'}
                                <Send className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
                            </>
                        )}
                    </>
                )}
            </button>
        </form>
    );
};

export default ContactForm;
