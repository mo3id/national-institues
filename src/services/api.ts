import axios, { AxiosError } from 'axios';
import { SiteData } from '@/store/useDataStore';

// Ensure the API base URL falls back to relative /api.php if VITE_API_BASE_URL is not provided or undefined
// This uses Vite's string replacement for env variables.
const API_BASE_URL: string = (import.meta as any).env.VITE_API_BASE_URL || '/api.php';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    // Optional: timeout to prevent hanging requests indefinitely
    // Short timeout to fail fast if backend is not running
    timeout: 2500,
});

interface ApiResponse<T = any> {
    status: 'success' | 'error';
    data?: T;
    message?: string;
}

export const fetchSiteData = async (): Promise<SiteData> => {
    try {
        const response = await apiClient.get<ApiResponse<SiteData>>(`?action=get_site_data&t=${Date.now()}`);
        const { data } = response;

        if (data.status !== 'success' || !data.data) {
            throw new Error(data.message || 'Failed to fetch site data from server.');
        }

        return data.data;
    } catch (error) {
        console.warn('[API Warning]: Backend unreachable, falling back to local storage cache.');
        const offlineCache = JSON.parse(localStorage.getItem('nis_offline_cache') || '{}');
        return offlineCache as SiteData;
    }
};

export const submitComplaint = async (complaintData: Record<string, any>): Promise<ApiResponse> => {
    const { data } = await apiClient.post<ApiResponse>('?action=add_complaint', complaintData);
    if (data.status !== 'success') throw new Error(data.message || 'Failed to submit complaint');
    return data;
};

export const submitContactMessage = async (contactData: Record<string, any>): Promise<ApiResponse> => {
    const { data } = await apiClient.post<ApiResponse>('?action=add_contact_message', contactData);
    if (data.status !== 'success') throw new Error(data.message || 'Failed to submit message');
    return data;
};

export const updateCategory = async (category: string, newData: any): Promise<ApiResponse> => {
    try {
        const { data } = await apiClient.post<ApiResponse>('?action=update_category', { category, newData });
        if (data.status !== 'success') throw new Error(data.message || `Failed to update ${category}`);
        return data;
    } catch (err) {
        console.warn(`[API Warning]: API update failed for ${category}, saving locally.`);
        const offlineCache = JSON.parse(localStorage.getItem('nis_offline_cache') || '{}');
        offlineCache[category] = newData;
        localStorage.setItem('nis_offline_cache', JSON.stringify(offlineCache));
        return { status: 'success' };
    }
};

export const submitJobApplication = async (applicationData: Record<string, any>): Promise<ApiResponse> => {
    const { data } = await apiClient.post<ApiResponse>('?action=add_job_application', applicationData);
    if (data.status !== 'success') throw new Error(data.message || 'Failed to submit application');
    return data;
};
