import React, { createContext, useContext, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDataStore, SiteData, DEFAULT_SITE_DATA } from '@/store/useDataStore';
import { fetchSiteData, updateCategory } from '@/services/api';
import ErrorPage from '@/components/common/ErrorPage';

// ─── Cross-Tab Sync Channel ───────────────────────────────────────────────────
const SYNC_CHANNEL_NAME = 'nis_data_sync';

interface DataContextType {
    data: SiteData;
    updateData: (category: keyof SiteData, newData: any) => void;
    isLoading: boolean;
    error: Error | null;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// ─── Deep Translation Fallback Helper ──────────────────────────────────────────
function applyFallbacks(obj: any): any {
    if (!obj || typeof obj !== 'object') return obj;

    if (Array.isArray(obj)) {
        return obj.map(applyFallbacks);
    }

    const newObj = { ...obj };
    const keys = Object.keys(newObj);

    const isEmpty = (val: any) => {
        if (val === null || val === undefined || val === '') return true;
        if (Array.isArray(val) && val.length === 0) return true;
        return false;
    };

    for (const key of keys) {
        // Pattern 1: fieldName / fieldNameAr
        if (key.endsWith('Ar')) {
            const baseKey = key.slice(0, -2);
            if (keys.includes(baseKey)) {
                const enVal = newObj[baseKey];
                const arVal = newObj[key];

                if (isEmpty(enVal) && !isEmpty(arVal)) newObj[baseKey] = arVal;
                if (isEmpty(arVal) && !isEmpty(enVal)) newObj[key] = enVal;
            }
        }

        // Pattern 2: fieldEn / fieldAr
        if (key.endsWith('En')) {
            const baseKey = key.slice(0, -2);
            const arKey = baseKey + 'Ar';
            if (keys.includes(arKey)) {
                const enVal = newObj[key];
                const arVal = newObj[arKey];

                if (isEmpty(enVal) && !isEmpty(arVal)) newObj[key] = arVal;
                if (isEmpty(arVal) && !isEmpty(enVal)) newObj[arKey] = enVal;
            }
        }

        // Recursively apply to children
        if (newObj[key] && typeof newObj[key] === 'object') {
            newObj[key] = applyFallbacks(newObj[key]);
        }
    }

    return newObj;
}

// ─── Direct Merge Helper ───────────────────────────────────────────────────────
function buildMergedData(apiData: SiteData): SiteData {
    const merged = { ...DEFAULT_SITE_DATA };

    // API Data is the single source of truth
    const pick = (key: keyof SiteData, isArray: boolean): any => {
        const api = apiData ? apiData[key] as any : undefined;
        const def = merged[key] as any;
        if (isArray) {
            return (api && api.length > 0) ? api : def;
        } else {
            return (api && Object.keys(api).length > 0) ? api : def;
        }
    };

    merged.schools = pick('schools', true);
    merged.news = pick('news', true);
    merged.jobs = pick('jobs', true);
    merged.jobDepartments = pick('jobDepartments', true);
    merged.governorates = pick('governorates', true);
    merged.heroSlides = pick('heroSlides', true);
    merged.partners = pick('partners', true);
    merged.galleryImages = pick('galleryImages', true);
    merged.jobApplications = pick('jobApplications', true);
    merged.complaints = pick('complaints', true);
    merged.contactMessages = pick('contactMessages', true);
    merged.aboutData = pick('aboutData', false);
    merged.stats = pick('stats', false);
    merged.homeData = pick('homeData', false);
    merged.formSettings = pick('formSettings', false);
    merged.contactData = pick('contactData', false);
    merged.pagesHeroSettings = pick('pagesHeroSettings', false);

    // Normalize legacy school type values + MySQL lowercase field names
    if (Array.isArray(merged.schools)) {
        merged.schools = merged.schools.map((s: any) => {
            let t = s.type;
            // Normalize JSON string or single string to array
            let types = Array.isArray(t) ? t : (typeof t === 'string' && t.startsWith('[') ? JSON.parse(t) : [t]);

            // Map legacy values
            types = types.map((type: string) => {
                if (type === 'National') return 'Arabic';
                if (type === 'Language') return 'Languages';
                if (type === 'International') return 'American';
                return type;
            }).filter((type: string) => type && type.trim() !== '');

            // Normalize MySQL lowercase column names to camelCase
            return {
                ...s,
                type: types,
                mainImage: s.mainImage || s.mainimage || '',
                nameAr: s.nameAr || s.namear || '',
                locationAr: s.locationAr || s.locationar || '',
                governorateAr: s.governorateAr || s.governoratear || '',
                principalAr: s.principalAr || s.principalar || '',
                aboutAr: s.aboutAr || s.aboutar || '',
                addressAr: s.addressAr || s.addressar || '',
                studentCount: s.studentCount || s.studentcount || '',
                teachersCount: s.teachersCount || s.teacherscount || '',
                foundedYear: s.foundedYear || s.foundedyear || '',
                applicationLink: s.applicationLink || s.applicationlink || '',
            };
        });
    }

    // Apply Deep Fallbacks for all translation fields
    const normalized = applyFallbacks(merged);

    // No local storage code anymore!
    return normalized;
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { data, setData, updateData } = useDataStore();
    const queryClient = useQueryClient();
    const channelRef = useRef<BroadcastChannel | null>(null);

    // ── React Query (Server defines everything) ───────────────────────────────
    const { isLoading, error, data: apiData, refetch } = useQuery({
        queryKey: ['siteData'],
        queryFn: fetchSiteData,

        staleTime: 30 * 1000,              // 30 seconds
        refetchOnWindowFocus: false,       // DO NOT throw 500 errors when returning to tab
        refetchInterval: false,            // Polling disabled
        refetchIntervalInBackground: false,
        retry: 1,                          // Lowered to prevent chaining 500 errors
        retryDelay: 2000,                  // 2s delay between retries
    });

    // ── Apply fetched data to Zustand store ───────────────────────────────
    useEffect(() => {
        if (apiData) {
            setData(buildMergedData(apiData));
        }
    }, [apiData, setData]);

    // ── BroadcastChannel & Local Tab Sync ──────────────
    useEffect(() => {
        const handleSync = () => {
            queryClient.invalidateQueries({ queryKey: ['siteData'] });
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('nis_data_sync_local', handleSync);
        }

        if (typeof BroadcastChannel !== 'undefined') {
            const channel = new BroadcastChannel(SYNC_CHANNEL_NAME);
            channelRef.current = channel;

            channel.onmessage = (event) => {
                if (event.data?.type === 'DATA_UPDATED') {
                    handleSync();
                }
            };
        }

        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('nis_data_sync_local', handleSync);
            }
            if (channelRef.current) {
                channelRef.current.close();
                channelRef.current = null;
            }
        };
    }, [queryClient]);

    // ── Mutation: save to server + sync all tabs ──────────────────────────
    const updateMutation = useMutation({
        mutationFn: async ({ category, newData }: { category: keyof SiteData; newData: any }) => {
            await updateCategory(category, newData);
            return { category, newData };
        },

        onSuccess: (res) => {
            // 1. Update query cache in THIS tab immediately 
            queryClient.setQueryData(['siteData'], (oldData: any) => {
                if (!oldData) return oldData;
                return { ...oldData, [res.category]: res.newData };
            });

            // 2. Update Zustand store in THIS tab
            updateData(res.category as keyof SiteData, res.newData);

            // No persistent local storage cache!

            // 3. Broadcast to ALL OTHER open tabs
            if (channelRef.current) {
                channelRef.current.postMessage({ type: 'DATA_UPDATED', category: res.category });
            }
        },

        onError: (err: any) => {
            console.error('Update failed:', err);
            window.dispatchEvent(new CustomEvent('nis_api_error', {
                detail: {
                    message: err.message,
                    type: 'SAVE_FAILED'
                }
            }));
        },
    });

    const contextUpdateData = (category: keyof SiteData, newData: any) => {
        updateMutation.mutate({ category, newData });
    };

    // Strict Error State
    if (error && !apiData) {
        console.error('API Error details:', error);
        return (
            <div className="flex flex-col min-h-screen bg-[#fafcff]">
                <ErrorPage error={error} onRetry={() => refetch()} />
            </div>
        );
    }

    // Strict Loading State (Waits for DB response, NO EMPTY SCREENS)
    if (isLoading && !apiData) {
        return (
            <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#fafcff]">
                <div className="relative w-32 h-32 flex items-center justify-center mb-6">
                    <img src="/layer-1-small.webp" alt="Loading" className="w-full h-auto object-contain animate-pulse" />
                </div>
                <div className="flex gap-2" dir="ltr">
                    <div className="w-3 h-3 rounded-full bg-[#1e3a8a] animate-bounce" style={{ animationDelay: '0s' }} />
                    <div className="w-3 h-3 rounded-full bg-[#1e3a8a] animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-3 h-3 rounded-full bg-[#991b1b] animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
            </div>
        );
    }

    // Unified data provided to components
    return (
        <DataContext.Provider value={{ data, updateData: contextUpdateData, isLoading, error }}>
            {children}
        </DataContext.Provider>
    );
};

export const useSiteData = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error('useSiteData must be used within DataProvider');
    return context;
};
