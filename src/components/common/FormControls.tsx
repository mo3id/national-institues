
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

// --- Custom Select Component ---
interface SelectProps {
    value: string;
    onChange: (val: string) => void;
    options: { value: string; label: string }[];
    placeholder?: string;
    icon?: React.ReactNode;
    className?: string;
}

export const CustomSelect: React.FC<SelectProps> = ({ value, onChange, options, placeholder, icon, className }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { isRTL } = useLanguage();
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(o => o.value === value);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold text-sm text-blue-900 shadow-sm hover:shadow-md ${isRTL ? 'text-right' : 'text-left'}`}
            >
                <div className="flex items-center gap-3 overflow-hidden">
                    {icon && <span className="text-gray-400 shrink-0">{icon}</span>}
                    <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
                </div>
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 right-0 z-[100] mt-1 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden max-h-60 overflow-y-auto"
                    >
                        {options.map((opt) => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => {
                                    onChange(opt.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full px-4 py-3 text-sm font-medium hover:bg-blue-50 transition-colors flex items-center justify-between ${value === opt.value ? 'text-blue-600 bg-blue-50/50' : 'text-gray-700'} ${isRTL ? 'text-right' : 'text-left'}`}
                            >
                                <span>{opt.label}</span>
                                {value === opt.value && <div className="h-2 w-2 bg-blue-600 rounded-full shrink-0" />}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- Custom Date Picker Component ---
interface DatePickerProps {
    value: string; // YYYY-MM-DD
    onChange: (val: string) => void;
    placeholder?: string;
    className?: string;
}

export const CustomDatePicker: React.FC<DatePickerProps> = ({ value, onChange, placeholder, className }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { lang, isRTL, t: translationsRoot } = useLanguage();
    const ct = translationsRoot.calendar;
    const containerRef = useRef<HTMLDivElement>(null);

    // Parse current value or use today
    const currentValDate = value ? new Date(value) : new Date();
    const [viewDate, setViewDate] = useState(new Date(currentValDate.getFullYear(), currentValDate.getMonth(), 1));

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const years = Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - 10 + i);

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const startDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();

    const handlePrevMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
    };

    const handleDateSelect = (day: number) => {
        const d = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        const formatted = d.toISOString().split('T')[0];
        onChange(formatted);
        setIsOpen(false);
    };

    const isToday = (day: number) => {
        const today = new Date();
        return today.getDate() === day && today.getMonth() === viewDate.getMonth() && today.getFullYear() === viewDate.getFullYear();
    };

    const isSelected = (day: number) => {
        if (!value) return false;
        const d = new Date(value);
        return d.getDate() === day && d.getMonth() === viewDate.getMonth() && d.getFullYear() === viewDate.getFullYear();
    };

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold text-sm text-blue-900 shadow-sm hover:shadow-md ${isRTL ? 'text-right' : 'text-left'}`}
            >
                <div className="flex items-center gap-3 overflow-hidden">
                    <CalendarIcon className="h-4 w-4 text-gray-400 shrink-0" />
                    <span className="truncate">{value || ct?.selectDate || placeholder}</span>
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className={`absolute z-[110] w-[280px] md:w-[320px] mt-2 bg-white border border-gray-100 rounded-[2rem] shadow-2xl p-6 ${isRTL ? 'right-0 origin-top-right' : 'left-0 origin-top-left'}`}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <button type="button" onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                                <ChevronLeft className={`h-4 w-4 text-gray-600 ${isRTL ? 'rotate-180' : ''}`} />
                            </button>
                            <div className="text-sm font-black text-blue-900 uppercase tracking-widest">
                                {ct?.months[viewDate.getMonth()]} {viewDate.getFullYear()}
                            </div>
                            <button type="button" onClick={handleNextMonth} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                                <ChevronRight className={`h-4 w-4 text-gray-600 ${isRTL ? 'rotate-180' : ''}`} />
                            </button>
                        </div>

                        {/* Weekdays */}
                        <div className={`grid grid-cols-7 gap-1 mb-2 ${isRTL ? 'direction-rtl' : ''}`}>
                            {ct?.days.map((d: string) => (
                                <div key={d} className="text-[10px] font-black text-gray-400 text-center uppercase py-2">
                                    {d}
                                </div>
                            ))}
                        </div>

                        {/* Days Grid */}
                        <div className={`grid grid-cols-7 gap-1 ${isRTL ? 'direction-rtl' : ''}`}>
                            {Array.from({ length: startDay }).map((_, i) => (
                                <div key={`empty-${i}`} />
                            ))}
                            {Array.from({ length: daysInMonth(viewDate.getFullYear(), viewDate.getMonth()) }).map((_, i) => {
                                const day = i + 1;
                                return (
                                    <button
                                        key={day}
                                        type="button"
                                        onClick={() => handleDateSelect(day)}
                                        className={`h-9 w-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all
                      ${isSelected(day)
                                                ? 'bg-blue-900 text-white shadow-lg scale-110'
                                                : isToday(day)
                                                    ? 'bg-red-50 text-red-600 border border-red-100'
                                                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                                            }`}
                                    >
                                        {day}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
// --- Image Upload Component ---
interface ImageUploadProps {
    value: string;
    onChange: (val: string) => void;
    label?: string;
    className?: string;
}

import { Upload, Link as LinkIcon, X as XIcon } from 'lucide-react';

export const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, label, className }) => {
    const [mode, setMode] = useState<'url' | 'file'>(value && !value.startsWith('data:') ? 'url' : 'file');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { isRTL } = useLanguage();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onChange(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className={`space-y-3 ${className}`}>
            {label && <label className="block text-sm font-black text-blue-900 mb-2 uppercase tracking-tight">{label}</label>}

            <div className="flex p-1 bg-gray-100 rounded-xl w-fit mb-2">
                <button
                    type="button"
                    onClick={() => setMode('file')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${mode === 'file' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
                >
                    <Upload className="h-3 w-3 inline-block mr-2" />
                    {isRTL ? 'رفع ملف' : 'Upload File'}
                </button>
                <button
                    type="button"
                    onClick={() => setMode('url')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${mode === 'url' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
                >
                    <LinkIcon className="h-3 w-3 inline-block mr-2" />
                    {isRTL ? 'رابط مباشر' : 'Direct Link'}
                </button>
            </div>

            {mode === 'url' ? (
                <div className="relative">
                    <input
                        type="text"
                        value={value}
                        onChange={e => onChange(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium text-sm text-blue-900 shadow-sm"
                    />
                </div>
            ) : (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="relative group cursor-pointer"
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />
                    <div className="w-full h-40 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 group-hover:bg-blue-50/50 group-hover:border-blue-200 transition-all">
                        {value ? (
                            <div className="relative w-full h-full p-2">
                                <img src={value} className="w-full h-full object-contain rounded-xl" alt="Preview" />
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); onChange(''); }}
                                    className="absolute top-4 right-4 p-1.5 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
                                >
                                    <XIcon className="h-4 w-4" />
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="p-4 bg-white rounded-2xl shadow-sm text-gray-400 group-hover:text-blue-500 group-hover:scale-110 transition-all">
                                    <Upload className="h-8 w-8 text-blue-500" />
                                </div>
                                <span className="text-sm font-medium text-gray-500 group-hover:text-blue-600">
                                    {isRTL ? 'اضغط لرفع صورة' : 'Click to select or drop image'}
                                </span>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
