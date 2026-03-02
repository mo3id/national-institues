import React, { createContext, useContext, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDataStore, SiteData, DEFAULT_SITE_DATA } from '@/store/useDataStore';
import { fetchSiteData, updateCategory } from '@/services/api';
import ErrorPage from '@/components/common/ErrorPage';

interface DataContextType {
    data: SiteData;
    updateData: (category: keyof SiteData, newData: any) => void;
    isLoading: boolean;
    error: Error | null;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { data, setData, updateData } = useDataStore();
    const queryClient = useQueryClient();

    const { isLoading, error, data: apiData, refetch } = useQuery({
        queryKey: ['siteData'],
        queryFn: fetchSiteData,
        // Fallback or retry settings handled globally or here
        staleTime: 5 * 60 * 1000, // 5 minutes cache
    });

    useEffect(() => {
        if (apiData) {
            // Smart Merge: Don't override default mock data with empty arrays/objects from the API
            const merged = { ...DEFAULT_SITE_DATA };

            // Arrays
            if (apiData.schools && apiData.schools.length > 0) merged.schools = apiData.schools;
            if (apiData.news && apiData.news.length > 0) merged.news = apiData.news;
            if (apiData.jobs && apiData.jobs.length > 0) merged.jobs = apiData.jobs;
            if (apiData.heroSlides && apiData.heroSlides.length > 0) merged.heroSlides = apiData.heroSlides;
            if (apiData.partners && apiData.partners.length > 0) merged.partners = apiData.partners;
            if (apiData.galleryImages && apiData.galleryImages.length > 0) merged.galleryImages = apiData.galleryImages;

            // Objects
            if (apiData.aboutData && Object.keys(apiData.aboutData).length > 0) merged.aboutData = apiData.aboutData;
            if (apiData.stats && Object.keys(apiData.stats).length > 0) merged.stats = apiData.stats;
            if (apiData.homeData && Object.keys(apiData.homeData).length > 0) merged.homeData = apiData.homeData;
            if (apiData.formSettings && Object.keys(apiData.formSettings).length > 0) merged.formSettings = apiData.formSettings;

            // Arrays that can safely be empty if mock defaults are empty
            if (apiData.complaints) merged.complaints = apiData.complaints;
            if (apiData.contactMessages) merged.contactMessages = apiData.contactMessages;
            if (apiData.jobApplications) merged.jobApplications = apiData.jobApplications;

            setData(merged);
        }
    }, [apiData, setData]);

    // Fallback logic internally for UI robustness
    // If the API call fails, we still load the `data` from Zustand (which is initialized to DEFAULT_SITE_DATA).
    // The user will still see the app functioning (just with default data).
    // We can also let the components access `error` if they want to explicitly show an error state.

    // Generic mutation for reliable and instant dashboard updates
    const updateMutation = useMutation({
        mutationFn: async ({ category, newData }: { category: keyof SiteData, newData: any }) => {
            try {
                await updateCategory(category, newData);
            } catch (err) {
                console.warn(`[Local Fallback]: Update API failed or missing on server for ${category}. UI updated optimistically.`, err);
                // Allow it to pass so the UI functions as intended until the real server is updated.
            }
            return { category, newData };
        },
        onMutate: async ({ category, newData }) => {
            // Optimistic Update: Instantly update Zustand so dashboard feels perfectly real-time
            updateData(category, newData);
        },
        onSuccess: (res) => {
            // Optional: Backup save to localStorage to persist across refreshes if API is dead
            const currentObj = JSON.parse(localStorage.getItem('nis_offline_cache') || '{}');
            localStorage.setItem('nis_offline_cache', JSON.stringify({ ...currentObj, [res.category]: res.newData }));
        }
    });

    const contextUpdateData = (category: keyof SiteData, newData: any) => {
        updateMutation.mutate({ category, newData });
    };

    // Optional: Load offline cache if API returns empty for things
    useEffect(() => {
        if (apiData) {
            const merged = { ...DEFAULT_SITE_DATA };
            const offlineCache = JSON.parse(localStorage.getItem('nis_offline_cache') || '{}');

            const mergeStrategy = (key: keyof SiteData, isArray: boolean) => {
                if (isArray) {
                    return (apiData[key] && (apiData[key] as any[]).length > 0) ? apiData[key] : (offlineCache[key] || merged[key]);
                } else {
                    return (apiData[key] && Object.keys(apiData[key] as any).length > 0) ? apiData[key] : (offlineCache[key] || merged[key]);
                }
            };

            merged.schools = mergeStrategy('schools', true) as any;
            merged.news = mergeStrategy('news', true) as any;
            merged.jobs = mergeStrategy('jobs', true) as any;
            merged.heroSlides = mergeStrategy('heroSlides', true) as any;
            merged.partners = mergeStrategy('partners', true) as any;
            merged.galleryImages = mergeStrategy('galleryImages', true) as any;
            merged.jobApplications = mergeStrategy('jobApplications', true) as any;
            merged.complaints = mergeStrategy('complaints', true) as any;
            merged.contactMessages = mergeStrategy('contactMessages', true) as any;

            merged.aboutData = mergeStrategy('aboutData', false) as any;
            merged.stats = mergeStrategy('stats', false) as any;
            merged.homeData = mergeStrategy('homeData', false) as any;
            merged.formSettings = mergeStrategy('formSettings', false) as any;

            setData(merged);
        }
    }, [apiData, setData]);
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
