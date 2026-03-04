import React, { createContext, useContext, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDataStore, SiteData, DEFAULT_SITE_DATA } from '@/store/useDataStore';
import { fetchSiteData, updateCategory } from '@/services/api';
import ErrorPage from '@/components/common/ErrorPage';

// ─── Cross-Tab Sync Channel ───────────────────────────────────────────────────
// Broadcasts a signal to all other open tabs of the same origin whenever the
// dashboard saves data, so they refetch immediately without needing a reload.
const SYNC_CHANNEL_NAME = 'nis_data_sync';

interface DataContextType {
    data: SiteData;
    updateData: (category: keyof SiteData, newData: any) => void;
    isLoading: boolean;
    error: Error | null;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// ─── Smart Merge Helper ───────────────────────────────────────────────────────
function buildMergedData(apiData: SiteData): SiteData {
    const offlineCache = JSON.parse(localStorage.getItem('nis_offline_cache') || '{}');
    const merged = { ...DEFAULT_SITE_DATA };

    const pick = (key: keyof SiteData, isArray: boolean): any => {
        const api = apiData[key] as any;
        const cache = offlineCache[key];
        const def = merged[key] as any;
        if (isArray) {
            return (api && api.length > 0) ? api : (cache || def);
        } else {
            return (api && Object.keys(api).length > 0) ? api : (cache || def);
        }
    };

    merged.schools = pick('schools', true);
    merged.news = pick('news', true);
    merged.jobs = pick('jobs', true);
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

    return merged;
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { data, setData, updateData } = useDataStore();
    const queryClient = useQueryClient();
    const channelRef = useRef<BroadcastChannel | null>(null);

    // ── React Query (with polling + window focus refetch) ─────────────────
    const { isLoading, error, data: apiData, refetch } = useQuery({
        queryKey: ['siteData'],
        queryFn: fetchSiteData,

        staleTime: 0,                   // Always consider data stale → refetch when focused
        refetchOnWindowFocus: true,     // Refetch when user switches back to this tab
        refetchInterval: 30 * 1000,    // Poll server every 30 seconds as a safety net
        refetchIntervalInBackground: false, // Don't poll when tab is hidden (saves resources)
    });

    // ── Apply fetched data to Zustand store ───────────────────────────────
    useEffect(() => {
        if (apiData) {
            setData(buildMergedData(apiData));
        }
    }, [apiData, setData]);

    // ── BroadcastChannel: listen for changes from OTHER tabs ──────────────
    useEffect(() => {
        if (typeof BroadcastChannel === 'undefined') return; // SSR / old browser guard

        const channel = new BroadcastChannel(SYNC_CHANNEL_NAME);
        channelRef.current = channel;

        channel.onmessage = (event) => {
            if (event.data?.type === 'DATA_UPDATED') {
                // Another tab saved data → refetch immediately so this tab is up-to-date
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
            // 1. Update query cache in THIS tab immediately (no extra network round-trip)
            queryClient.setQueryData(['siteData'], (oldData: any) => {
                if (!oldData) return oldData;
                return { ...oldData, [res.category]: res.newData };
            });

            // 2. Update Zustand store in THIS tab
            updateData(res.category as keyof SiteData, res.newData);

            // 3. Persist to localStorage offline cache
            const currentObj = JSON.parse(localStorage.getItem('nis_offline_cache') || '{}');
            localStorage.setItem('nis_offline_cache', JSON.stringify({ ...currentObj, [res.category]: res.newData }));

            // 4. Broadcast to ALL OTHER open tabs → they will refetch from server immediately
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

    if (error && !apiData) {
        console.error('API Error details:', error);
        return (
            <div className="flex flex-col min-h-screen bg-[#fafcff]">
                <ErrorPage error={error} onRetry={() => refetch()} />
            </div>
        );
    }

    return (
        <DataContext.Provider value={{ data, updateData: contextUpdateData, isLoading: isLoading && !apiData, error }}>
            {children}
        </DataContext.Provider>
    );
};

export const useSiteData = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error('useSiteData must be used within DataProvider');
    return context;
};
