import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useSiteData } from '@/context/DataContext';
import { Send, CheckCircle2, Loader2 } from 'lucide-react';
import { getContactSchema } from '@/utils/validations';
import { submitContactMessage } from '@/services/api';

const ContactForm: React.FC = () => {
    const { lang, isRTL } = useLanguage();
    const { data: siteData, updateData } = useSiteData();
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Add form state
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
        if (submitError) setSubmitError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationResult = getContactSchema(lang).safeParse(formData);
        if (!validationResult.success) {
            const newErrors: Record<string, string> = {};
            validationResult.error.issues.forEach(e => {
                if (e.path[0] && !newErrors[e.path[0] as string]) {
                    newErrors[e.path[0] as string] = e.message;
                }
            });
            setErrors(newErrors);
            return;
        }
        setErrors({});

        setSubmitting(true);
        setSubmitError(null);
        try {
            const newMessage = {
                createdAt: new Date().toISOString(),
                fullName: formData.fullName,
                email: formData.email,
                subject: formData.subject,
                message: formData.message
            };

            await submitContactMessage(newMessage);

            setSuccess(true);
            setFormData({ fullName: '', email: '', subject: '', message: '' });
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            setSubmitError(err.message || (lang === 'ar' ? 'حدث خطأ أثناء إرسال الرسالة' : 'An error occurred while sending the message'));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">
                        {lang === 'ar' ? 'الاسم بالكامل' : 'Full Name'}
                    </label>
                    <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 bg-slate-50 border ${errors.fullName ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:ring-blue-500'} rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all ${isRTL ? 'text-right' : 'text-left'}`}
                        placeholder={lang === 'ar' ? 'أدخل اسمك بالكامل' : 'Enter your full name'}
                        dir={isRTL ? 'rtl' : 'ltr'}
                    />
                    {errors.fullName && <p className="text-red-500 text-xs font-bold mt-1">{errors.fullName}</p>}
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">
                        {lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 bg-slate-50 border ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:ring-blue-500'} rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all ${isRTL && !formData.email ? 'text-right' : 'text-left'}`}
                        placeholder={lang === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email address'}
                        dir={formData.email ? 'ltr' : (isRTL ? 'rtl' : 'ltr')}
                    />
                    {errors.email && <p className="text-red-500 text-xs font-bold mt-1">{errors.email}</p>}
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">
                    {lang === 'ar' ? 'الموضوع' : 'Subject'}
                </label>
                <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-slate-50 border ${errors.subject ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:ring-blue-500'} rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all ${isRTL ? 'text-right' : 'text-left'}`}
                    placeholder={lang === 'ar' ? 'موضوع رسالتك' : 'Subject of your message'}
                    dir={isRTL ? 'rtl' : 'ltr'}
                />
                {errors.subject && <p className="text-red-500 text-xs font-bold mt-1">{errors.subject}</p>}
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">
                    {lang === 'ar' ? 'الرسالة' : 'Message'}
                </label>
                <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className={`w-full px-4 py-3 bg-slate-50 border ${errors.message ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:ring-blue-500'} rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all resize-none ${isRTL ? 'text-right' : 'text-left'}`}
                    placeholder={lang === 'ar' ? 'اكتب رسالتك هنا...' : 'Write your message here...'}
                    dir={isRTL ? 'rtl' : 'ltr'}
                />
                {errors.message && <p className="text-red-500 text-xs font-bold mt-1">{errors.message}</p>}
            </div>

            <div className="pt-2">
                {submitError && <p className="text-red-500 font-bold text-sm mb-3">Error: {submitError}</p>}
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
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <>
                                    {lang === 'ar' ? 'إرسال الرسالة' : 'Send Message'}
                                    <Send className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
                                </>
                            )}
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

export default ContactForm;
