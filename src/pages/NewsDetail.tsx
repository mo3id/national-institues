import React, { useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useSiteData } from '@/context/DataContext';
import { Calendar, ArrowRight, Share2, ArrowLeft } from 'lucide-react';
import PageTransition from '@/components/common/PageTransition';
import ScrollReveal from '@/components/common/ScrollReveal';

const NewsDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { lang, isRTL } = useLanguage();
    const { data: siteData } = useSiteData();

    const newsItem = useMemo(() => (siteData.news || []).find(n => n.id === id), [id, siteData.news]);

    if (!newsItem) {
        return <Navigate to="/news" replace />;
    }

    const title = lang === 'ar' ? newsItem.titleAr : newsItem.title;
    const summary = lang === 'ar' ? newsItem.summaryAr : newsItem.summary;

    return (
        <PageTransition>
            <div className="bg-slate-50 min-h-screen pb-24">

                {/* Unified Hero Header — floating card pattern */}
                <section className="m-[10px] rounded-[20px] relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-[#0f172a]">
                    {/* Background image */}
                    <img
                        src={newsItem.image}
                        alt={title}
                        className="absolute inset-0 w-full h-full object-cover opacity-50"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/60 to-transparent" />

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-20">

                        {/* Back button — lives inside hero, below navbar */}
                        <ScrollReveal>
                            <Link
                                to="/news"
                                className={`inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 tracking-wide text-sm font-bold bg-white/10 px-5 py-2.5 rounded-full backdrop-blur-md transition-all hover:bg-white/20 shadow-lg ${isRTL ? 'flex-row-reverse' : ''}`}
                            >
                                {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                                <span>{lang === 'ar' ? 'العودة للأخبار' : 'Back to News'}</span>
                            </Link>
                        </ScrollReveal>

                        {/* Title */}
                        <ScrollReveal>
                            <h1 className={`text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-8 text-white drop-shadow-xl max-w-4xl ${isRTL ? 'text-right' : 'text-left'}`}>
                                {title}
                            </h1>
                        </ScrollReveal>

                        {/* Meta */}
                        <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse justify-start' : 'justify-start'}`}>
                            <span className="flex items-center gap-2 font-bold bg-[#991b1b] px-4 py-1.5 rounded-lg text-white text-sm shadow-lg">
                                <Calendar className="w-4 h-4" />
                                {new Date(newsItem.date).toLocaleDateString()}
                            </span>
                            <span className="text-white/70 font-medium text-sm">
                                {lang === 'ar' ? 'المعاهد القومية' : 'National Institutes'}
                            </span>
                        </div>
                    </div>
                </section>

                {/* ── Content Card ── matches card style of News.tsx featured article */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 relative z-20">
                    <div className="bg-white rounded-[32px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100">

                        {/* Article image — like the featured news card */}
                        <div className="relative h-64 md:h-80 overflow-hidden">
                            <img
                                src={newsItem.image}
                                alt={title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                            />
                        </div>

                        <div className="p-8 md:p-14">
                            {/* Action bar */}
                            <div className={`flex items-center mb-10 pb-6 border-b border-gray-100 ${isRTL ? 'flex-row-reverse justify-end' : 'justify-start'}`}>
                                <button className="p-3 bg-slate-50 text-slate-600 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors shadow-sm group">
                                    <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                </button>
                            </div>

                            {/* Summary / lead */}
                            <ScrollReveal delay={0.1}>
                                <p className={`text-xl md:text-2xl text-[#1e3a8a] leading-relaxed font-bold mb-10 border-l-4 border-red-600 pl-6 ${isRTL ? 'border-l-0 border-r-4 pr-6 pl-0 text-right' : 'text-left'}`}>
                                    {summary}
                                </p>
                            </ScrollReveal>

                            {/* Body */}
                            <ScrollReveal delay={0.2}>
                                <div className={`prose prose-lg prose-slate max-w-none prose-headings:text-[#1e3a8a] prose-a:text-red-600 ${isRTL ? 'text-right' : 'text-left'}`}>
                                    {lang === 'ar' ? (
                                        <>
                                            <p className="text-gray-700 leading-loose">هذا النص التوضيحي يهدف إلى إعطاء نظرة أعمق وأشمل للأخبار المتعلقة بالمعاهد القومية. نحرص دائما على إبقاء الطلاب وأولياء الأمور والمعلمين وكل شركاء العملية التعليمية على اطلاع دائم بآخر التطورات والإنجازات التي تتم على مستوى جميع فروعنا.</p>
                                            <p className="text-gray-700 leading-loose mt-4">نعمل بجد واجتهاد لتوفير بيئة تعليمية آمنة ومحفزة تساند وتتبنى أحدث الوسائل التكنولوجية إيمانا منّا بأن التعليم والمواكبة العصرية هما الأساس لبناء قادة المستقبل وصناع الأمل. وفي إطار حرصنا على تفعيل الأنشطة الصفية واللاصفية، يأتي هذا الخبر كاستكمال لمسيرة من النجاح الممتد على مدار العقود الماضية.</p>

                                            <div className="my-12 relative">
                                                <div className="absolute inset-0 bg-blue-50 transform -skew-y-2 rounded-3xl"></div>
                                                <div className="relative p-8 md:p-12 text-center">
                                                    <h3 className="text-2xl font-black text-blue-900 mb-4">آفاق مستقبلية واعدة</h3>
                                                    <p className="text-blue-800/80 leading-relaxed">نخطط لمزيد من التوسعات والمبادرات الإيجابية في العام الدراسي المقبل وفق الرؤية الاستراتيجية التربوية، حيث نسعى جنباً إلى جنب مع كفاءاتنا التعليمية والإدارية لرسم مسار جديد يضع معايير الجودة العالمية في مقدمة أولوياتنا.</p>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-gray-700 leading-loose">This explanatory text aims to provide a deeper and more comprehensive insight into the news regarding the National Institutes. We consistently strive to keep our students, parents, faculty, and all educational partners fully informed about the latest developments and achievements across our campuses.</p>
                                            <p className="text-gray-700 leading-loose mt-4">We work diligently to foster a safe and motivating learning environment that adopts the latest technological tools, believing firmly that contemporary education is the foundation for building future leaders and creators of hope. As part of our commitment to both curricular and extracurricular activities, this update continues a decades-long trajectory of success.</p>

                                            <div className="my-12 relative">
                                                <div className="absolute inset-0 bg-blue-50 transform -skew-y-2 rounded-3xl"></div>
                                                <div className="relative p-8 md:p-12 text-center">
                                                    <h3 className="text-2xl font-black text-blue-900 mb-4">Promising Future Horizons</h3>
                                                    <p className="text-blue-800/80 leading-relaxed">We are planning further expansions and positive initiatives for the upcoming academic year in accordance with our strategic educational vision. Hand in hand with our skilled educational and administrative professionals, we are charting a new path where global quality standards remain our foremost priority.</p>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </ScrollReveal>

                            {/* Footer */}
                            <div className="mt-16 pt-10 border-t border-gray-100 flex justify-center">
                                <Link
                                    to="/news"
                                    className={`inline-flex items-center gap-2 bg-[#1e3a8a] text-white px-8 py-4 rounded-full font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20 hover:-translate-y-1 ${isRTL ? 'flex-row-reverse' : ''}`}
                                >
                                    <span>{lang === 'ar' ? 'تصفح المزيد من الأخبار' : 'Read More Articles'}</span>
                                    {isRTL ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </PageTransition>
    );
};

export default NewsDetail;
