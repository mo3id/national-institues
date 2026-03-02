import React from 'react';
import { useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { ShieldAlert, RefreshCw, Home } from 'lucide-react';

interface ErrorPageProps {
    error?: Error | null;
    onRetry?: () => void;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ error, onRetry }) => {
    const routeError = useRouteError();

    let errorMessage = "An unexpected error occurred.";
    let statusCode = 500;

    if (isRouteErrorResponse(routeError)) {
        statusCode = routeError.status;
        errorMessage = routeError.statusText;
    } else if (routeError instanceof Error) {
        errorMessage = routeError.message;
    } else if (error) {
        errorMessage = error.message;
    }

    if (statusCode === 404) {
        errorMessage = "The page you are looking for does not exist.";
    }

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 bg-gradient-to-br from-red-50 to-white text-center">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6 shadow-sm border border-red-200">
                <ShieldAlert className="w-12 h-12 text-red-600" />
            </div>

            <h1 className="text-4xl font-extrabold text-[#1e3a8a] mb-2 tracking-tight">
                {statusCode === 404 ? "404 Not Found" : "Oops! Something went wrong"}
            </h1>

            <p className="text-lg text-slate-600 mb-8 max-w-md">
                {errorMessage}
            </p>

            <div className="flex gap-4">
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="flex items-center gap-2 px-6 py-3 bg-[#1e3a8a] text-white rounded-xl hover:bg-[#152a65] transition-all font-medium shadow-md shadow-blue-500/20"
                    >
                        <RefreshCw className="w-5 h-5" />
                        Try Again
                    </button>
                )}
                <a
                    href="/"
                    className="flex items-center gap-2 px-6 py-3 bg-white text-[#1e3a8a] rounded-xl hover:bg-gray-50 transition-all font-medium shadow-sm border border-slate-200"
                >
                    <Home className="w-5 h-5" />
                    Go Home
                </a>
            </div>
        </div>
    );
};

export default ErrorPage;
