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

    const { isLoading, error, data: apiData } = useQuery({
        queryKey: ['siteData'],
        queryFn: fetchSiteData,
        // Fallback or retry settings handled globally or here
        staleTime: 5 * 60 * 1000, // 5 minutes cache
    });

    useEffect(() => {
        if (apiData) {
            setData({ ...DEFAULT_SITE_DATA, ...apiData });
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
        // If the fetching failed entirely AND no existing data was in cache/zustand override,
        // Render the Error Page directly at the provider level for critical failure.
        // However, we have DEFAULT_SITE_DATA. So it won't be a completely blank canvas.
        // Let's console.warn the error so developers know it's offline fallback.
        console.warn('API error, relying on default initial state.', error);
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
