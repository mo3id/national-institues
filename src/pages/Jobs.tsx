import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useSiteData } from '@/context/DataContext';
import PageTransition from '@/components/common/PageTransition';
import ScrollReveal from '@/components/common/ScrollReveal';
import { Briefcase, MapPin, Building2, Clock, ArrowRight, ArrowLeft, X, UploadCloud, CheckCircle2 } from 'lucide-react';

const Jobs: React.FC = () => {
    const { lang, isRTL, t: translationsRoot } = useLanguage();
    const { data: siteData } = useSiteData();
    const t = translationsRoot.careers;
    const JOBS_DATA = siteData.jobs;
    const [filter, setFilter] = useState<string>(t.allDepts);

    const [selectedJob, setSelectedJob] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Prevent body scrolling when modal is open
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        };
    }, [isModalOpen]);

    useEffect(() => {
        setFilter(t.allDepts);
    }, [lang, t.allDepts]);

    const departments = [t.allDepts, ...Array.from(new Set(JOBS_DATA.map(job => lang === 'ar' ? job.departmentAr : job.department)))];

    const filteredJobs = JOBS_DATA.filter(job => {
        if (filter === t.allDepts) return true;
        return (lang === 'ar' ? job.departmentAr : job.department) === filter;
    });

    return (
        <PageTransition>
            <div className="min-h-screen bg-[#fafcff]">
                {/* Unified Hero Header */}
                <section className="m-[10px] rounded-[20px] relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-[#0f172a]">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#991b1b]/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
                    </div>
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 py-20">
                        <ScrollReveal direction="down">
                            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 tracking-tight text-white leading-tight drop-shadow-lg">
                                {t.title}
                            </h1>
                        </ScrollReveal>
                        <ScrollReveal delay={0.1}>
                            <p className="text-blue-100/80 text-lg md:text-xl max-w-2xl mx-auto font-medium">
                                {t.subtitle}
                            </p>
                        </ScrollReveal>
                    </div>
                </section>

                {/* Content Section */}
                <section className="py-20 relative -mt-8 z-20">
                    <div className="max-w-7xl mx-auto px-4">

                        {/* Filters */}
                        <ScrollReveal direction="up" delay={0.3}>
                            <div className="bg-white rounded-[20px] p-4 md:p-5 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] mb-10 overflow-hidden">
                                <div className="flex flex-nowrap overflow-x-auto gap-2 no-scrollbar pb-1">
                                    {departments.map((dept, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setFilter(dept)}
                                            className={`whitespace-nowrap px-6 py-2.5 rounded-[12px] font-bold text-sm transition-all duration-300 border ${filter === dept
                                                ? 'bg-[#0f1115] text-white border-[#0f1115] shadow-md'
                                                : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-900 border-gray-100'
                                                }`}
                                        >
                                            {dept}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </ScrollReveal>

                        {/* Jobs Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                            {filteredJobs.map((job, i) => (
                                <ScrollReveal key={job.id} direction="up" delay={i * 0.1}>
                                    <div className="bg-white rounded-[24px] border border-gray-100/60 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] overflow-hidden transition-all duration-300 group flex flex-col h-full relative p-2">

                                        {/* Background Cover Image with margin */}
                                        <div className="relative h-40 w-full rounded-[20px] overflow-hidden bg-gray-50 mb-6">
                                            <img
                                                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80"
                                                alt="Cover"
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                            {/* Department Badge on cover */}
                                            <div className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'}`}>
                                                <span className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border border-white/20 shadow-sm bg-[#1e3a8a]/90 text-white">
                                                    {lang === 'ar' ? job.departmentAr : job.department}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Card Body */}
                                        <div className="px-4 pb-4 flex flex-col flex-grow">
                                            {/* Title */}
                                            <div className="mb-5 text-start">
                                                <h3 className="text-[20px] font-bold text-gray-900 mb-1 leading-tight tracking-tight group-hover:text-[#1e3a8a] transition-colors line-clamp-2">
                                                    {lang === 'ar' ? job.titleAr : job.title}
                                                </h3>
                                            </div>

                                            {/* Description */}
                                            <p className="text-[14px] text-gray-500 mb-6 leading-relaxed line-clamp-3 flex-grow">
                                                {lang === 'ar' ? job.descriptionAr : job.description}
                                            </p>

                                            {/* Tags Row */}
                                            <div className={`flex items-center gap-2 mb-6 flex-wrap ${isRTL ? 'justify-start' : ''}`}>
                                                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100">
                                                    <div className="w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center">
                                                        <MapPin className="w-3 h-3 text-white" />
                                                    </div>
                                                    <span className="text-[13px] font-bold text-gray-700">{lang === 'ar' ? job.locationAr : job.location}</span>
                                                </div>
                                                <div className="px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100 text-[13px] font-semibold text-gray-600 flex items-center gap-1.5">
                                                    <Clock className="w-4 h-4 text-gray-400" />
                                                    {lang === 'ar' ? job.typeAr : job.type}
                                                </div>
                                            </div>

                                            {/* Action Button */}
                                            <button
                                                onClick={() => {
                                                    setSelectedJob(job);
                                                    setIsModalOpen(true);
                                                    setIsSubmitted(false);
                                                }}
                                                className="mt-auto w-full py-[14px] bg-[#0f1115] text-white rounded-[16px] font-semibold text-[15px] hover:bg-black transition-colors flex items-center justify-center gap-2 group-hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
                                            >
                                                <span>{t.applyNow}</span>
                                            </button>
                                        </div>
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>

                        {filteredJobs.length === 0 && (
                            <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
                                <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-slate-900 mb-2">
                                    {t.noJobs}
                                </h3>
                                <p className="text-slate-500">
                                    {t.jobSearchDesc}
                                </p>
                            </div>
                        )}

                    </div>
                </section>

                {/* Application Modal */}
                {isModalOpen && selectedJob && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />

                        {/* Modal Content */}
                        <div className={`relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden ${isRTL ? 'text-right' : 'text-left'}`}>

                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white/95 backdrop-blur-md z-10 shrink-0">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 mb-1">
                                        {t.applyForm}
                                    </h2>
                                    <p className="text-sm text-slate-500 font-medium">
                                        {lang === 'ar' ? selectedJob.titleAr : selectedJob.title}
                                    </p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full flex items-center justify-center bg-white text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm border border-slate-100">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-6 md:p-8 flex-1 overflow-y-auto custom-scrollbar">
                                {isSubmitted ? (
                                    <div className="text-center py-10 text-start">
                                        <div className="w-20 h-20 bg-[#1e3a8a]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <CheckCircle2 className="w-10 h-10 text-[#1e3a8a]" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-900 mb-2">
                                            {t.formSuccess}
                                        </h3>
                                        <p className="text-slate-500 mb-8 max-w-md mx-auto">
                                            {t.formSuccessDesc}
                                        </p>
                                        <button onClick={() => setIsModalOpen(false)} className="bg-[#1e3a8a] text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-900 transition-all shadow-md">
                                            {t.closeContinue}
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={(e) => { e.preventDefault(); setIsSubmitted(true); }} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2 text-start">
                                                <label className="text-sm font-bold text-slate-700">{t.fullName} <span className="text-red-500">*</span></label>
                                                <input required type="text" className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] transition-all ${isRTL ? 'text-right' : 'text-left'}`} placeholder={t.fullName} />
                                            </div>
                                            <div className="space-y-2 text-start">
                                                <label className="text-sm font-bold text-slate-700">{t.email} <span className="text-red-500">*</span></label>
                                                <input required type="email" className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] transition-all text-left`} placeholder="example@email.com" />
                                            </div>
                                            <div className="space-y-2 text-start">
                                                <label className="text-sm font-bold text-slate-700">{t.phone} <span className="text-red-500">*</span></label>
                                                <input required type="tel" className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] transition-all text-left mt-1`} placeholder="+20 123 456 7890" />
                                            </div>
                                            <div className="space-y-2 text-start">
                                                <label className="text-sm font-bold text-slate-700">{t.experience}</label>
                                                <select className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] transition-all mt-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                                                    <option value="">{t.selectExp}</option>
                                                    <option value="0-2">{t.exp02}</option>
                                                    <option value="3-5">{t.exp35}</option>
                                                    <option value="5+">{t.exp5plus}</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-2 text-start">
                                            <label className="text-sm font-bold text-slate-700">{t.uploadCV} <span className="text-red-500">*</span></label>
                                            <label className={`flex flex-col items-center justify-center w-full h-32 border-2 ${selectedFile ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-200 border-dashed bg-slate-50 hover:bg-[#1e3a8a]/5 hover:border-[#1e3a8a]'} rounded-2xl cursor-pointer transition-all mt-1 relative overflow-hidden`}>
                                                {selectedFile ? (
                                                    <div className="flex flex-col items-center justify-center p-4 text-center w-full h-full">
                                                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mb-2">
                                                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                                        </div>
                                                        <span className="text-sm font-bold text-slate-800 line-clamp-1 p-1 max-w-[90%]">{selectedFile.name}</span>
                                                        <span className="text-xs text-slate-500 mt-0.5">{t.changeFile}</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                        <UploadCloud className="w-8 h-8 mb-2 text-[#1e3a8a]/60" />
                                                        <p className="text-sm text-slate-500 font-semibold mb-1">
                                                            {t.uploadHint2}
                                                        </p>
                                                        <p className="text-xs text-slate-400">PDF, DOCX, DOC (Max: 5MB)</p>
                                                    </div>
                                                )}
                                                <input
                                                    type="file"
                                                    required
                                                    className="hidden"
                                                    accept=".pdf,.doc,.docx"
                                                    onChange={(e) => {
                                                        if (e.target.files && e.target.files[0]) {
                                                            setSelectedFile(e.target.files[0]);
                                                        }
                                                    }}
                                                />
                                            </label>
                                        </div>

                                        <div className="space-y-2 text-start">
                                            <label className="text-sm font-bold text-slate-700">{t.coverLetter}</label>
                                            <textarea className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] transition-all resize-none h-28 mt-1 ${isRTL ? 'text-right' : 'text-left'}`} placeholder={t.coverLetterPlaceholder}></textarea>
                                        </div>

                                        <div className="pt-4 flex justify-end">
                                            <button type="submit" className={`w-full md:w-auto bg-[#1e3a8a] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-blue-900 hover:shadow-lg transition-all flex items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                                <span>{t.submit}</span>
                                                <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </PageTransition>
    );
};

export default Jobs;
