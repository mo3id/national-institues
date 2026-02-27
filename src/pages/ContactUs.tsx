import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useSiteData } from '@/context/DataContext';
import PageTransition from '@/components/common/PageTransition';
import ContactForm from '@/components/features/ContactForm';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import ScrollReveal from '@/components/common/ScrollReveal';

const ContactUs: React.FC = () => {
    const { lang, isRTL } = useLanguage();
    const { data: siteData } = useSiteData();

    const title = lang === 'ar' ? 'اتصل بنا' : 'Contact Us';
    const subtitle = lang === 'ar' ? 'نحن هنا لمساعدتك' : 'We are here to help';
    const desc = siteData.formSettings?.contactFormDescAr && lang === 'ar'
        ? siteData.formSettings.contactFormDescAr
        : siteData.formSettings?.contactFormDesc || (lang === 'ar' ? 'قم بملء النموذج أدناه وسيقوم فريقنا بالتواصل معك في أقرب وقت ممكن.' : 'Fill out the form below and our team will get back to you as soon as possible.');

    const contactInfo = [
        {
            icon: MapPin,
            title: lang === 'ar' ? 'عنواننا' : 'Our Location',
            desc: lang === 'ar' ? '١٢ شارع المعاهد القومية، القاهرة، مصر' : '12 National Institutes St, Cairo, Egypt'
        },
        {
            icon: Phone,
            title: lang === 'ar' ? 'رقم الهاتف' : 'Phone Number',
            desc: '+20 123 456 7890'
        },
        {
            icon: Mail,
            title: lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address',
            desc: 'info@nis.edu.eg'
        },
        {
            icon: Clock,
            title: lang === 'ar' ? 'ساعات العمل' : 'Working Hours',
            desc: lang === 'ar' ? 'الأحد - الخميس: ٨ صباحاً - ٤ عصراً' : 'Sun - Thu: 8:00 AM - 4:00 PM'
        }
    ];

    return (
        <PageTransition>
            <div className="bg-slate-50 min-h-screen pb-16">

                {/* Unified Hero Header */}
                <section className="m-[10px] rounded-[20px] relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-[#0f172a]">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#991b1b]/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
                    </div>
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 py-20 flex flex-col items-center">
                        <ScrollReveal direction="down">
                            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 tracking-tight text-white leading-tight drop-shadow-lg">
                                {title}
                            </h1>
                        </ScrollReveal>
                        <ScrollReveal delay={0.1}>
                            <p className="text-blue-100/80 text-lg md:text-xl max-w-2xl mx-auto font-medium">
                                {subtitle}
                            </p>
                        </ScrollReveal>
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">

                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <ScrollReveal delay={0.2}>
                            <p className="text-slate-500 mt-4 leading-relaxed text-lg">
                                {desc}
                            </p>
                        </ScrollReveal>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Contact Information */}
                        <div className="lg:col-span-1 space-y-6">
                            {contactInfo.map((info, idx) => (
                                <ScrollReveal key={idx} delay={0.1 * idx}>
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4 hover:shadow-md transition-shadow">
                                        <div className="bg-blue-50 p-4 rounded-xl text-blue-900 shrink-0">
                                            <info.icon size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 mb-1">{info.title}</h3>
                                            <p className="text-slate-600">{info.desc}</p>
                                        </div>
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <ScrollReveal delay={0.3}>
                                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 md:p-12 border border-slate-100">
                                    <ContactForm />
                                </div>
                            </ScrollReveal>
                        </div>
                    </div>

                </div>
            </div>
        </PageTransition>
    );
};

export default ContactUs;
