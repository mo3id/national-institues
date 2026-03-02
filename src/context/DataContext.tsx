import React, { createContext, useContext, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDataStore, SiteData, DEFAULT_SITE_DATA } from '@/store/useDataStore';
import { fetchSiteData } from '@/services/api';
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

            setData(merged);
        }
    }, [apiData, setData]);

    // Fallback logic internally for UI robustness
    // If the API call fails, we still load the `data` from Zustand (which is initialized to DEFAULT_SITE_DATA).
    // The user will still see the app functioning (just with default data).
    // We can also let the components access `error` if they want to explicitly show an error state.

    // A generic mutation helper for updating specific data categories (this would normally be several specific endpoints)
    const updateMutation = useMutation({
        mutationFn: async ({ category, newData }: { category: keyof SiteData, newData: any }) => {
            // Ideally, here you'll post to your API. e.g.:
            // await apiClient.post('?action=update_category', { category, newData });

            // For now, since PHP backend just returns what's given, we mock success.
            return { category, newData };
        },
        onSuccess: (res) => {
            updateData(res.category as keyof SiteData, res.newData);
            // Optionally save to local data fallback when offline:
            // localStorage.setItem('nis_site_data', JSON.stringify({ ...data, [res.category]: res.newData }));
        }
    });

    const contextUpdateData = (category: keyof SiteData, newData: any) => {
        // Trigger React Query mutation, which in turn calls Zustand's updateData on success
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
