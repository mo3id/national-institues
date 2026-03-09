import React from 'react';
import ShieldAlert from 'lucide-react/dist/esm/icons/shield-alert';
import RefreshCw from 'lucide-react/dist/esm/icons/refresh-cw';
import Home from 'lucide-react/dist/esm/icons/home';
import WifiOff from 'lucide-react/dist/esm/icons/wifi-off';
import ServerCrash from 'lucide-react/dist/esm/icons/server-crash';
import { useLanguage } from '@/context/LanguageContext';

interface ErrorPageProps {
    error?: Error | null;
    onRetry?: () => void;
    isNotFound?: boolean;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ error, onRetry, isNotFound }) => {
    const { lang, isRTL } = useLanguage();

    let errorMessage = lang === 'ar' ? "حدث خطأ غير متوقع." : "An unexpected error occurred.";
    let statusCode = 500;
    let isNetworkError = false;

    // Detect error source
    if (error) {
        errorMessage = error.message;
        if (errorMessage.toLowerCase().includes('network error') || errorMessage.toLowerCase().includes('failed to fetch')) {
            isNetworkError = true;
        }
        if (errorMessage.includes('500') || errorMessage.includes('status code 500')) {
            statusCode = 500;
        }
    }

    if (isNotFound) {
        statusCode = 404;
    }

    // Set UI based on error type
    let DisplayIcon = ShieldAlert;
    let title = lang === 'ar' ? "عفواً! حدث خطأ ما" : "Oops! Something went wrong";
    let message = errorMessage;

    if (statusCode === 404) {
        title = lang === 'ar' ? "404 - الصفحة غير موجودة" : "404 - Page Not Found";
        message = lang === 'ar' ? "عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها." : "Sorry, the page you are looking for does not exist or has been moved.";
    } else if (isNetworkError) {
        DisplayIcon = WifiOff;
        title = lang === 'ar' ? "انقطاع الاتصال" : "No Connection";
        message = lang === 'ar' ? "تأكد من اتصالك بالإنترنت وحاول مرة أخرى." : "Please check your internet connection and try again.";
    } else if (statusCode >= 500) {
        DisplayIcon = ServerCrash;
        title = lang === 'ar' ? "عطل فني" : "Server Error";
        message = lang === 'ar' ? "نعتذر، يوجد عطل فني في السيرفر حالياً. يرجى المحاولة لاحقاً." : "We apologize, a technical server error occurred. Please try again later.";
    }

    return (
        <div className={`min-h-[70vh] flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-50 to-white text-center font-inter ${isRTL ? 'rtl' : 'ltr'}`}>
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-sm border ${isNetworkError ? 'bg-orange-100 border-orange-200 text-orange-600' : 'bg-rose-100 border-rose-200 text-rose-600'}`}>
                <DisplayIcon className="w-12 h-12" />
            </div>

            <h1 className="text-4xl font-extrabold text-[#1e3a8a] mb-3 tracking-tight">
                {title}
            </h1>

            <p className="text-lg text-slate-600 mb-8 max-w-md leading-relaxed">
                {message}
            </p>

            <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                {(onRetry || isNetworkError) && (
                    <button
                        onClick={onRetry ? onRetry : () => window.location.reload()}
                        className="flex items-center gap-2 px-6 py-3 bg-[#1e3a8a] text-white rounded-xl hover:bg-[#152a65] transition-all font-medium shadow-md shadow-blue-500/20"
                    >
                        <RefreshCw className={`w-5 h-5 ${isNetworkError ? 'animate-pulse' : ''}`} />
                        {lang === 'ar' ? 'إعادة المحاولة' : 'Try Again'}
                    </button>
                )}
                {(!isNetworkError) && (
                    <a
                        href="/"
                        className="flex items-center gap-2 px-6 py-3 bg-white text-[#1e3a8a] rounded-xl hover:bg-slate-50 transition-all font-medium shadow-sm border border-slate-200"
                    >
                        <Home className="w-5 h-5" />
                        {lang === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
                    </a>
                )}
            </div>
        </div>
    );
};

export default ErrorPage;
