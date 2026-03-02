import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { GraduationCap, Lock, Mail, Eye, EyeOff, Loader2, Sparkles, ArrowRight } from 'lucide-react';
import PageTransition from '@/components/common/PageTransition';
import { getLoginSchema } from '@/utils/validations';

const LoginPage: React.FC = () => {
    const { isRTL, t: translationsRoot } = useLanguage();
    const t = translationsRoot.login;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const { login } = useAuth();
    const navigate = useNavigate();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const result = getLoginSchema(isRTL).safeParse({ email, password });
        if (!result.success) {
            const newErrors: Record<string, string> = {};
            result.error.issues.forEach(err => {
                if (err.path[0] && !newErrors[err.path[0] as string]) {
                    newErrors[err.path[0] as string] = err.message;
                }
            });
            setFieldErrors(newErrors);
            return;
        }

        setFieldErrors({});
        setLoading(true);
        setError('');

        // Mock authentication
        setTimeout(() => {
            if (email === 'admin@nis.edu.eg' && password === 'admin123') {
                login();
                navigate('/dashboard');
            } else {
                setError(t.error);
            }
            setLoading(false);
        }, 1500);
    };

    return (
        <PageTransition>
            <div className="min-h-screen flex items-center justify-center bg-[#f8faff] p-4 font-inter relative overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
                {/* Decorative Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[100px] animate-pulse" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-50/50 rounded-full blur-[100px] animate-pulse" />
                </div>

                <div className="w-full max-w-[440px] relative z-10 transition-all duration-500">
                    <div className="bg-white rounded-[2rem] p-10 md:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-bl-[5rem] -z-0 group-hover:bg-blue-100/50 transition-colors duration-500" />

                        <div className="relative z-10">
                            <div className="flex flex-col items-center mb-10 text-center">
                                <div className="w-20 h-20 bg-gradient-to-br from-[#1e3a8a] to-[#1e40af] rounded-[2rem] flex items-center justify-center mb-6 shadow-2xl shadow-blue-200 transform hover:rotate-6 transition-transform duration-300">
                                    <GraduationCap className="text-white w-10 h-10" />
                                </div>
                                <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                    <Sparkles className="w-3 h-3" />
                                    {t.adminPortal}
                                </div>
                                <h1 className="text-3xl font-black text-[#0f172a] tracking-tight uppercase">{t.title}</h1>
                                <p className="text-slate-400 mt-2 font-bold text-xs uppercase tracking-widest leading-relaxed">{t.subtitle}</p>
                            </div>

                            {error && (
                                <div className="mb-8 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 animate-shake">
                                    <div className="w-2 h-2 bg-rose-500 rounded-full animate-ping" />
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                                <div className="space-y-2 text-start">
                                    <label className={`text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ${isRTL ? 'mr-2' : 'ml-2'}`}>{t.email}</label>
                                    <div className="relative group/input">
                                        <Mail className={`absolute ${isRTL ? 'right-5' : 'left-5'} top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within/input:text-blue-600 transition-colors`} />
                                        <input
                                            type="email"
                                            placeholder="admin@nis.edu.eg"
                                            className={`w-full h-14 ${isRTL ? 'pr-14 pl-6' : 'pl-14 pr-14'} bg-slate-50 border ${fieldErrors.email ? 'border-red-500 focus:ring-red-100' : 'border-slate-100 focus:ring-blue-100'} rounded-2xl outline-none focus:ring-4 focus:border-blue-600 focus:bg-white transition-all font-bold text-slate-700 placeholder:text-slate-300 text-start`}
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: '' }));
                                            }}
                                        />
                                    </div>
                                    {fieldErrors.email && <p className="text-red-500 text-xs font-bold mt-1">{fieldErrors.email}</p>}
                                </div>

                                <div className="space-y-2 text-start">
                                    <label className={`text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ${isRTL ? 'mr-2' : 'ml-2'}`}>{t.password}</label>
                                    <div className="relative group/input">
                                        <Lock className={`absolute ${isRTL ? 'right-5' : 'left-5'} top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within/input:text-blue-600 transition-colors`} />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            className={`w-full h-14 ${isRTL ? 'pr-14 pl-14' : 'pl-14 pr-14'} bg-slate-50 border ${fieldErrors.password ? 'border-red-500 focus:ring-red-100' : 'border-slate-100 focus:ring-blue-100'} rounded-2xl outline-none focus:ring-4 focus:border-blue-600 focus:bg-white transition-all font-bold text-slate-700 placeholder:text-slate-300 text-start`}
                                            value={password}
                                            onChange={(e) => {
                                                setPassword(e.target.value);
                                                if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: '' }));
                                            }}
                                        />
                                        <button
                                            type="button"
                                            className={`absolute ${isRTL ? 'left-5' : 'right-5'} top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors`}
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    {fieldErrors.password && <p className="text-red-500 text-xs font-bold mt-1">{fieldErrors.password}</p>}
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        className="w-full h-14 bg-[#1e3a8a] hover:bg-blue-800 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-blue-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                <span>{t.authenticating}</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>{t.button}</span>
                                                <ArrowRight className={`w-4 h-4 group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180' : ''}`} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>

                            <p className="mt-12 text-center text-slate-300 text-[10px] font-black uppercase tracking-[0.3em] italic">
                                {translationsRoot.home.trustedHighlight} {translationsRoot.common.ourNetwork}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <style>
                {`
                    @keyframes shake {
                        0%, 100% { transform: translateX(0); }
                        25% { transform: translateX(-4px); }
                        75% { transform: translateX(4px); }
                    }
                    .animate-shake {
                        animation: shake 0.2s ease-in-out 0s 2;
                    }
                `}
            </style>
        </PageTransition>
    );
};

export default LoginPage;
