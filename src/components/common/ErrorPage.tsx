import React from 'react';
import { ShieldAlert, RefreshCw, Home, WifiOff, ServerCrash } from 'lucide-react';

interface ErrorPageProps {
    error?: Error | null;
    onRetry?: () => void;
    isNotFound?: boolean;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ error, onRetry, isNotFound }) => {
    let errorMessage = "حدث خطأ غير متوقع.";
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
    let title = "عفواً! حدث خطأ ما";
    let message = errorMessage;

    if (statusCode === 404) {
        title = "404 - الصفحة غير موجودة";
        message = "عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.";
        // Icon remains ShieldAlert or anything else
    } else if (isNetworkError) {
        DisplayIcon = WifiOff;
        title = "انقطاع الاتصال";
        message = "تأكد من اتصالك بالإنترنت وحاول مرة أخرى.";
    } else if (statusCode >= 500) {
        DisplayIcon = ServerCrash;
        title = "عطل فني";
        message = "نعتذر، يوجد عطل فني في السيرفر حالياً. يرجى المحاولة لاحقاً.";
    }

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-50 to-white text-center font-inter" dir="rtl">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-sm border ${isNetworkError ? 'bg-orange-100 border-orange-200 text-orange-600' : 'bg-rose-100 border-rose-200 text-rose-600'}`}>
                <DisplayIcon className="w-12 h-12" />
            </div>

            <h1 className="text-4xl font-extrabold text-[#1e3a8a] mb-3 tracking-tight">
                {title}
            </h1>

            <p className="text-lg text-slate-600 mb-8 max-w-md leading-relaxed">
                {message}
            </p>

            <div className="flex gap-4">
                {(onRetry || isNetworkError) && (
                    <button
                        onClick={onRetry ? onRetry : () => window.location.reload()}
                        className="flex items-center gap-2 px-6 py-3 bg-[#1e3a8a] text-white rounded-xl hover:bg-[#152a65] transition-all font-medium shadow-md shadow-blue-500/20"
                    >
                        <RefreshCw className="w-5 h-5" />
                        إعادة المحاولة
                    </button>
                )}
                {(!isNetworkError) && (
                    <a
                        href="/"
                        className="flex items-center gap-2 px-6 py-3 bg-white text-[#1e3a8a] rounded-xl hover:bg-slate-50 transition-all font-medium shadow-sm border border-slate-200"
                    >
                        <Home className="w-5 h-5" />
                        العودة للرئيسية
                    </a>
                )}
            </div>
        </div>
    );
};

export default ErrorPage;
