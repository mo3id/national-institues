import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useSiteData } from '@/context/DataContext';
import { Search, Loader2, Calendar, User, Info, CheckCircle, Clock, MessageSquare, ArrowLeft, ArrowRight, Clipboard, Check } from 'lucide-react';
import PageTransition from '@/components/common/PageTransition';
import ScrollReveal from '@/components/common/ScrollReveal';
import { getComplaintStatus } from '@/services/api';
import { Link } from 'react-router-dom';

const ComplaintInquiry: React.FC = () => {
    const { lang, isRTL, t: translationsRoot } = useLanguage();
    const t = translationsRoot;
    const [complaintId, setComplaintId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [complaint, setComplaint] = useState<any>(null);
    const [copied, setCopied] = useState(false);

    const handleInquiry = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!complaintId.trim()) return;

        setIsLoading(true);
        setError(null);
        setComplaint(null);

        try {
            const result = await getComplaintStatus(complaintId.trim());
            if (result.status === 'success') {
                setComplaint(result.data);
            } else {
                setError(t?.complaints?.notFound || 'Complaint not found.');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (!complaint?.id) return;
        navigator.clipboard.writeText(complaint.id);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formatDate = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-EG' : 'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }).format(date);
        } catch (e) {
            return dateStr;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'resolved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'closed': return 'bg-slate-100 text-slate-700 border-slate-200';
            default: return 'bg-blue-100 text-blue-700 border-blue-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'pending': return <Clock className="w-4 h-4" />;
            case 'resolved': return <CheckCircle className="w-4 h-4" />;
            default: return <Info className="w-4 h-4" />;
        }
    };

    return (
        <PageTransition>
            <div className="overflow-x-hidden min-h-screen bg-[#fafcff]">
                {/* Header */}
                <section className="m-[10px] rounded-[20px] relative min-h-[40vh] flex items-center justify-center overflow-hidden bg-[#0f172a]">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#991b1b]/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
                    </div>
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 py-20">
                        <ScrollReveal direction="down">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight text-white leading-tight drop-shadow-lg">
                                {t?.complaints?.inquiryTitle}
                            </h1>
                        </ScrollReveal>
                        <ScrollReveal delay={0.1}>
                            <p className="text-blue-100/80 text-lg md:text-xl max-w-2xl mx-auto font-medium">
                                {t?.complaints?.inquirySubtitle}
                            </p>
                        </ScrollReveal>
                    </div>
                </section>

                {/* Inquiry Section */}
                <section className="py-20 relative px-4">
                    <div className="max-w-3xl mx-auto">
                        <ScrollReveal direction="up">
                            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-slate-100 overflow-hidden relative">
                                <div className={`absolute top-0 ${isRTL ? 'left-0' : 'right-0'} w-64 h-64 bg-blue-50 rounded-full blur-3xl -z-0 opacity-50`} />

                                <form onSubmit={handleInquiry} className="relative z-10 space-y-6">
                                    <div className="flex flex-col md:flex-row gap-4">
                                        <div className="flex-1">
                                            <label className={`block font-bold text-slate-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                                                {t?.complaints?.complaintNumber}
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={complaintId}
                                                    onChange={(e) => setComplaintId(e.target.value)}
                                                    className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent transition-all pr-12 ${isRTL ? 'text-right' : 'text-left'}`}
                                                    placeholder="CMP-XXXX"
                                                    dir="ltr"
                                                />
                                                <div className={`absolute inset-y-0 ${isRTL ? 'left-4' : 'right-4'} flex items-center pointer-events-none`}>
                                                    <Search className="w-5 h-5 text-slate-400" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="md:pt-8">
                                            <button
                                                type="submit"
                                                disabled={isLoading || !complaintId.trim()}
                                                className="w-full md:w-auto h-[58px] bg-[#1e3a8a] text-white px-10 rounded-xl font-bold hover:bg-blue-900 hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                                            >
                                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                                                <span>{t?.complaints?.inquire}</span>
                                            </button>
                                        </div>
                                    </div>

                                    {error && (
                                        <div className={`p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-bold animate-shake ${isRTL ? 'text-right' : 'text-left'}`}>
                                            {error}
                                        </div>
                                    )}
                                </form>

                                {complaint && (
                                    <div className="mt-12 relative z-10 space-y-8 animate-fade-in">
                                        <div className="h-px bg-slate-100 w-full" />

                                        <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${isRTL ? 'text-right' : 'text-left'}`}>
                                            <div className="space-y-6">
                                                <div>
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{t?.complaints?.complaintNumber}</p>
                                                    <div className="flex items-center gap-3">
                                                        <h3 className="text-2xl font-black text-[#1e3a8a] tracking-tight">{complaint.id}</h3>
                                                        <button
                                                            onClick={copyToClipboard}
                                                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-[#1e3a8a]"
                                                            title={t?.complaints?.copyId}
                                                        >
                                                            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Clipboard className="w-4 h-4" />}
                                                        </button>
                                                    </div>
                                                </div>

                                                <div>
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{t?.complaints?.status}</p>
                                                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-bold ${getStatusColor(complaint.status)}`}>
                                                        {getStatusIcon(complaint.status)}
                                                        {complaint.status}
                                                    </div>
                                                </div>

                                                <div>
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{t?.complaints?.createdAt}</p>
                                                    <div className="flex items-center gap-2 text-slate-700 font-medium">
                                                        <Calendar className="w-4 h-4 text-[#1e3a8a]" />
                                                        {formatDate(complaint.createdAt)}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4">
                                                <div className="flex items-center gap-2 text-[#1e3a8a]">
                                                    <MessageSquare className="w-5 h-5" />
                                                    <h4 className="font-bold">{t?.complaints?.response}</h4>
                                                </div>
                                                {complaint.response ? (
                                                    <p className="text-slate-700 leading-relaxed font-medium">
                                                        {complaint.response}
                                                    </p>
                                                ) : (
                                                    <p className="text-slate-400 italic text-sm">
                                                        {lang === 'ar' ? 'لا يوجد رد حالياً من قبل الإدارة. يرجى المراجعة لاحقاً.' : 'No response from management yet. Please check back later.'}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollReveal>

                        <div className="mt-12 flex justify-center">
                            <Link
                                to="/complaints"
                                className={`flex items-center gap-2 text-slate-500 hover:text-[#1e3a8a] font-bold transition-all ${isRTL ? 'flex-row-reverse' : ''}`}
                            >
                                {isRTL ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
                                <span>{t?.complaints?.backToSubmit}</span>
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </PageTransition>
    );
};

export default ComplaintInquiry;
