import axios, { AxiosError } from 'axios';
import { SiteData } from '@/store/useDataStore';

// Ensure the API base URL falls back to relative /api.php if VITE_API_BASE_URL is not provided or undefined
// This uses Vite's string replacement for env variables.
// Remove /api.php from base URL to handle paths cleanly
const API_BASE_URL: string = ((import.meta as any).env.VITE_API_BASE_URL || '/api.php').replace(/\/api\.php\/?$/, '');
const SYNC_CHANNEL_NAME = 'nis_data_sync';

// Cross-tab sync helper
const notifyUpdate = () => {
    if (typeof BroadcastChannel !== 'undefined') {
        const channel = new BroadcastChannel(SYNC_CHANNEL_NAME);
        channel.postMessage({ type: 'DATA_UPDATED' });
        channel.close();
    }
};

export const apiClient = axios.create({
    baseURL: API_BASE_URL || '',
    headers: {
        'Content-Type': 'application/json',
    },
    // Timeout set to 15s to accommodate slow cPanel shared hosting (~7s avg response)
    timeout: 15000,
});

// Axios interceptor to append /api.php correctly without redundant slashes
apiClient.interceptors.request.use(config => {
    // If the url is just query params (e.g. ?action=...), prepend /api.php
    if (config.url && config.url.startsWith('?')) {
        config.url = `/api.php${config.url}`;
    }
    return config;
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
    } catch (error: any) {
        console.error('[API Error]: Failed to fetch site data:', error);
        throw new Error(error.response?.data?.message || error.message || 'Failed to fetch site data from server.');
    }
};

export const submitComplaint = async (complaintData: Record<string, any>): Promise<ApiResponse> => {
    const { data } = await apiClient.post<ApiResponse>('?action=add_complaint', complaintData);
    if (data.status !== 'success') throw new Error(data.message || 'Failed to submit complaint');
    notifyUpdate();
    return data;
};

export const submitContactMessage = async (contactData: Record<string, any>): Promise<ApiResponse> => {
    const { data } = await apiClient.post<ApiResponse>('?action=add_contact_message', contactData);
    if (data.status !== 'success') throw new Error(data.message || 'Failed to submit message');
    notifyUpdate();
    return data;
};

export const updateCategory = async (category: string, newData: any): Promise<ApiResponse> => {
    try {
        const { data } = await apiClient.post<ApiResponse>('?action=update_category', { category, newData });
        if (data.status !== 'success') throw new Error(data.message || `Failed to update ${category}`);
        notifyUpdate();
        return data;
    } catch (err: any) {
        const errorMsg = err.response?.data?.message || err.message || `Failed to update ${category}`;
        console.error(`[API Error]: API update failed for ${category}`, err.response?.data || err);
        throw new Error(errorMsg);
    }
};

export const submitJobApplication = async (applicationData: Record<string, any>): Promise<ApiResponse> => {
    const { data } = await apiClient.post<ApiResponse>('?action=add_job_application', applicationData);
    if (data.status !== 'success') throw new Error(data.message || 'Failed to submit application');
    notifyUpdate();
    return data;
};

export const deleteEntry = async (type: 'complaints' | 'contactMessages', id: string): Promise<ApiResponse> => {
    const { data } = await apiClient.post<ApiResponse>('?action=delete_entry', { type, id });
    if (data.status !== 'success') throw new Error(data.message || 'Failed to delete entry');
    return data;
};
