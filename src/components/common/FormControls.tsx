
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down';
import CalendarIcon from 'lucide-react/dist/esm/icons/calendar';
import ChevronLeft from 'lucide-react/dist/esm/icons/chevron-left';
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right';
import Upload from 'lucide-react/dist/esm/icons/upload';
import LinkIcon from 'lucide-react/dist/esm/icons/link';
import XIcon from 'lucide-react/dist/esm/icons/x';
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
                className={`w-full flex items-center justify-between px-6 py-4 bg-[var(--surface2)] border transition-all duration-300 rounded-2xl outline-none font-bold text-sm text-[var(--text)]
          ${isOpen ? 'border-[var(--accent)] ring-4 ring-[var(--accent)]/5 shadow-md' : 'border-[var(--border)] shadow-sm hover:shadow-md'}
          ${isRTL ? 'text-right' : 'text-left'}`}
            >
                <div className="flex items-center gap-3 overflow-hidden">
                    {icon && <span className={`${isOpen ? 'text-[var(--accent)]' : 'text-[var(--text2)]'} shrink-0 transition-colors`}>{icon}</span>}
                    <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
                </div>
                <ChevronDown className={`h-4 w-4 transition-all duration-300 ${isOpen ? 'rotate-180 text-[var(--accent)]' : 'text-[var(--text2)]'}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 12, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 12, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute top-full left-0 right-0 z-[100] mt-2 bg-[var(--surface,#ffffff)] border border-[var(--border)] rounded-[1.5rem] shadow-2xl overflow-hidden max-h-60 overflow-y-auto p-2"
                        style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
                    >
                        {options.map((opt) => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => {
                                    onChange(opt.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full px-5 py-3.5 text-sm font-bold rounded-xl transition-all flex items-center justify-between mb-1 last:mb-0
                  ${value === opt.value
                                        ? 'text-[var(--accent)] bg-[var(--accent)]/5'
                                        : 'text-[var(--text)] hover:bg-[var(--surface2)]'}`}
                            >
                                <span>{opt.label}</span>
                                {value === opt.value && <div className="h-1.5 w-1.5 bg-[var(--accent)] rounded-full shrink-0 shadow-[0_0_8px_var(--accent)]" />}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- Custom Multi-Select Component ---
interface MultiSelectProps {
    value: string[];
    onChange: (val: string[]) => void;
    options: { value: string; label: string }[];
    placeholder?: string;
    icon?: React.ReactNode;
    className?: string;
}

export const CustomMultiSelect: React.FC<MultiSelectProps> = ({ value = [], onChange, options, placeholder, icon, className }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { isRTL } = useLanguage();
    const containerRef = useRef<HTMLDivElement>(null);

    const toggleOption = (optValue: string) => {
        const newValue = value.includes(optValue)
            ? value.filter(v => v !== optValue)
            : [...value, optValue];
        onChange(newValue);
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const displayValue = value.length > 0
        ? options.filter(o => value.includes(o.value)).map(o => o.label).join(', ')
        : placeholder;

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between px-6 py-4 bg-[var(--surface2)] border transition-all duration-300 rounded-2xl outline-none font-bold text-sm text-[var(--text)]
          ${isOpen ? 'border-[var(--accent)] ring-4 ring-[var(--accent)]/5 shadow-md' : 'border-[var(--border)] shadow-sm hover:shadow-md'}
          ${isRTL ? 'text-right' : 'text-left'}`}
            >
                <div className="flex items-center gap-3 overflow-hidden">
                    {icon && <span className={`${isOpen ? 'text-[var(--accent)]' : 'text-[var(--text2)]'} shrink-0 transition-colors`}>{icon}</span>}
                    <span className="truncate">{displayValue}</span>
                </div>
                <div className="flex items-center gap-2">
                    {value.length > 0 && (
                        <span className="bg-[var(--accent)] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                            {value.length}
                        </span>
                    )}
                    <ChevronDown className={`h-4 w-4 transition-all duration-300 ${isOpen ? 'rotate-180 text-[var(--accent)]' : 'text-[var(--text2)]'}`} />
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 12, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 12, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute top-full left-0 right-0 z-[100] mt-2 bg-[var(--surface,#ffffff)] border border-[var(--border)] rounded-[1.5rem] shadow-2xl overflow-hidden max-h-60 overflow-y-auto p-2"
                        style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
                    >
                        {options.map((opt) => {
                            const isSelected = value.includes(opt.value);
                            return (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => toggleOption(opt.value)}
                                    className={`w-full px-5 py-3.5 text-sm font-bold rounded-xl transition-all flex items-center justify-between mb-1 last:mb-0
                      ${isSelected
                                            ? 'text-[var(--accent)] bg-[var(--accent)]/5'
                                            : 'text-[var(--text)] hover:bg-[var(--surface2)]'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${isSelected ? 'bg-[var(--accent)] border-[var(--accent)]' : 'border-[var(--border)] bg-transparent'}`}>
                                            {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                        </div>
                                        <span>{opt.label}</span>
                                    </div>
                                    {isSelected && <div className="h-1.5 w-1.5 bg-[var(--accent)] rounded-full shrink-0 shadow-[0_0_8px_var(--accent)]" />}
                                </button>
                            );
                        })}
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
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const dayStr = String(d.getDate()).padStart(2, '0');
        const formatted = `${year}-${month}-${dayStr}`;
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
                className={`w-full flex items-center justify-between px-6 py-4 bg-[var(--surface2)] border transition-all duration-300 rounded-2xl outline-none font-bold text-sm text-[var(--text)]
          ${isOpen ? 'border-[var(--accent)] ring-4 ring-[var(--accent)]/5 shadow-md' : 'border-[var(--border)] shadow-sm hover:shadow-md'}
          ${isRTL ? 'text-right' : 'text-left'}`}
            >
                <div className="flex items-center gap-3 overflow-hidden">
                    <CalendarIcon className={`h-4 w-4 transition-colors ${isOpen ? 'text-[var(--accent)]' : 'text-[var(--text2)]'} shrink-0`} />
                    <span className="truncate">{value || ct?.selectDate || placeholder}</span>
                </div>
                <ChevronDown className={`h-4 w-4 transition-all duration-300 ${isOpen ? 'rotate-180 text-[var(--accent)]' : 'text-[var(--text2)]'}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className={`absolute z-[110] w-[280px] md:w-[320px] mt-2 bg-[var(--surface,#ffffff)] border border-[var(--border)] rounded-[2rem] shadow-2xl p-6 ${isRTL ? 'right-0 origin-top-right' : 'left-0 origin-top-left'}`}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <button type="button" onClick={handlePrevMonth} className="p-2 hover:bg-[var(--surface2)] rounded-xl transition-colors">
                                <ChevronLeft className={`h-4 w-4 text-[var(--text)] ${isRTL ? 'rotate-180' : ''}`} />
                            </button>
                            <div className="text-sm font-black text-[var(--text)] uppercase tracking-widest">
                                {ct?.months[viewDate.getMonth()]} {viewDate.getFullYear()}
                            </div>
                            <button type="button" onClick={handleNextMonth} className="p-2 hover:bg-[var(--surface2)] rounded-xl transition-colors">
                                <ChevronRight className={`h-4 w-4 text-[var(--text)] ${isRTL ? 'rotate-180' : ''}`} />
                            </button>
                        </div>

                        {/* Weekdays */}
                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {ct?.days.map((d: string) => (
                                <div key={d} className="text-[10px] font-black text-[var(--text2)] text-center uppercase py-2">
                                    {d}
                                </div>
                            ))}
                        </div>

                        {/* Days Grid */}
                        <div className="grid grid-cols-7 gap-1">
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
                                                ? 'bg-[var(--accent)] text-white shadow-lg scale-110'
                                                : isToday(day)
                                                    ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                                                    : 'text-[var(--text)] hover:bg-[var(--accent)]/10 hover:text-[var(--accent)]'
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

export const ImageUpload: React.FC<ImageUploadProps> = React.memo(({ value, onChange, label, className }) => {
    const [mode, setMode] = useState<'url' | 'file'>(() => {
        if (!value) return 'file';
        return value.startsWith('data:') ? 'file' : 'url';
    });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { isRTL } = useLanguage();

    React.useEffect(() => {
        if (!value) return;
        const newMode = value.startsWith('data:') ? 'file' : 'url';
        if (newMode !== mode) {
            setMode(newMode);
        }
    }, [value, mode]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const MAX_WIDTH = 1200;
                    const MAX_HEIGHT = 1200;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
                    } else {
                        if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
                    }

                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);

                    onChange(canvas.toDataURL('image/webp', 0.8));
                };
                img.src = event.target?.result as string;
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className={`space-y-3 ${className}`}>
            {label && <label className="block text-sm font-black text-[var(--text)] mb-2 uppercase tracking-tight">{label}</label>}

            <div className="flex p-1 bg-[var(--surface2)] rounded-xl w-fit mb-2">
                <div 
                    className="relative group/tooltip inline-block"
                    title={value && mode === 'url' ? (isRTL ? 'يرجى مسح الرابط أولاً للتمكن من رفع ملف' : 'Please clear the URL first to upload a file') : undefined}
                    style={value && mode === 'url' ? { cursor: 'not-allowed' } : undefined}
                >
                    <button
                        type="button"
                        onClick={() => {
                            if (!(value && mode === 'url')) {
                                setMode('file');
                            }
                        }}
                        disabled={!!value && mode === 'url'}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${mode === 'file' ? 'bg-[var(--surface)] shadow-sm text-[var(--accent)]' : 'text-[var(--text2)]'} ${!!value && mode === 'url' ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                        <Upload className="h-3 w-3 inline-block me-2" />
                        {isRTL ? 'رفع ملف' : 'Upload File'}
                    </button>
                </div>
                <div 
                    className="relative group/tooltip inline-block"
                    title={value && mode === 'file' ? (isRTL ? 'يرجى حذف الصورة المرفوعة أولاً للتمكن من إضافة رابط مباشر' : 'Please delete the uploaded image first to add a direct link') : undefined}
                    style={value && mode === 'file' ? { cursor: 'not-allowed' } : undefined}
                >
                    <button
                        type="button"
                        onClick={() => {
                            if (!(value && mode === 'file')) {
                                setMode('url');
                            }
                        }}
                        disabled={!!value && mode === 'file'}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${mode === 'url' ? 'bg-[var(--surface)] shadow-sm text-[var(--accent)]' : 'text-[var(--text2)]'} ${!!value && mode === 'file' ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                        <LinkIcon className="h-3 w-3 inline-block me-2" />
                        {isRTL ? 'رابط مباشر' : 'Direct Link'}
                    </button>
                </div>
            </div>

            {mode === 'url' ? (
                <div className="space-y-3">
                    {value && (
                        <div className="relative w-full h-40 bg-[var(--surface2)] border-2 border-[var(--border)] rounded-2xl overflow-hidden">
                            <img src={value} className="w-full h-full object-contain p-2" alt="Preview" />
                            <button
                                type="button"
                                onClick={() => onChange('')}
                                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
                                title={isRTL ? 'حذف الصورة' : 'Delete Image'}
                            >
                                <XIcon className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                    <div className="relative">
                        <input
                            type="text"
                            value={value}
                            onChange={e => onChange(e.target.value)}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full px-5 py-4 bg-[var(--surface2)] border border-[var(--border)] rounded-2xl focus:ring-4 focus:ring-[var(--accent)]/10 focus:border-[var(--accent)] outline-none transition-all font-medium text-sm text-[var(--text)] shadow-sm pr-12"
                        />
                        {value && (
                            <button
                                type="button"
                                onClick={() => onChange('')}
                                className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'left-4' : 'right-4'} p-1.5 text-[var(--text2)] hover:text-red-500 hover:bg-red-50 rounded-full transition-colors`}
                                title={isRTL ? 'مسح الرابط' : 'Clear URL'}
                            >
                                <XIcon className="h-4 w-4" />
                            </button>
                        )}
                    </div>
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
                    <div className="w-full h-40 bg-[var(--surface2)] border-2 border-dashed border-[var(--border)] rounded-2xl flex flex-col items-center justify-center gap-2 group-hover:bg-[var(--accent)]/5 group-hover:border-[var(--accent)]/30 transition-all">
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
                                <div className="p-4 bg-[var(--surface)] rounded-2xl shadow-sm text-[var(--text2)] group-hover:text-[var(--accent)] group-hover:scale-110 transition-all">
                                    <Upload className="h-8 w-8 text-[var(--accent)]" />
                                </div>
                                <span className="text-sm font-medium text-[var(--text2)] group-hover:text-[var(--text)]">
                                    {isRTL ? 'اضغط لرفع صورة' : 'Click to select or drop image'}
                                </span>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
});
