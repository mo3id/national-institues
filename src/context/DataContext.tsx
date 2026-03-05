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

    // Normalize legacy school type values
    if (Array.isArray(merged.schools)) {
        merged.schools = merged.schools.map((s: any) => {
            let type = s.type;
            if (type === 'National') type = 'Arabic';
            if (type === 'Language') type = 'Languages';
            if (type === 'International') type = 'American';
            return { ...s, type };
        });
    }

    // No local storage code anymore!
    return merged;
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

        staleTime: 0,
        refetchOnWindowFocus: true,
        refetchInterval: 30 * 1000,
        refetchIntervalInBackground: false,
    });

    // ── Apply fetched data to Zustand store ───────────────────────────────
    useEffect(() => {
        if (apiData) {
            setData(buildMergedData(apiData));
        }
    }, [apiData, setData]);

    // ── BroadcastChannel: listen for changes from OTHER tabs ──────────────
    useEffect(() => {
        if (typeof BroadcastChannel === 'undefined') return;

        const channel = new BroadcastChannel(SYNC_CHANNEL_NAME);
        channelRef.current = channel;

        channel.onmessage = (event) => {
            if (event.data?.type === 'DATA_UPDATED') {
                queryClient.invalidateQueries({ queryKey: ['siteData'] });
            }
        };

        return () => {
            channel.close();
            channelRef.current = null;
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
            alert(`Dashboard save failed! Please upload the latest api.php to your server.\nError: ${err.message}`);
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
