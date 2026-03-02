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
    timeout: 15000,
});

interface ApiResponse<T = any> {
    status: 'success' | 'error';
    data?: T;
    message?: string;
}

export const fetchSiteData = async (): Promise<SiteData> => {
    try {
        const response = await apiClient.get<ApiResponse<SiteData>>('?action=get_site_data');
        const { data } = response;

        if (data.status !== 'success' || !data.data) {
            throw new Error(data.message || 'Failed to fetch site data from server.');
        }

        return data.data;
    } catch (error) {
        // Advanced Error Logging for Development
        if (error instanceof AxiosError) {
            console.error(`[API Error - fetchSiteData]: ${error.message}`, error.response?.data || error);
            throw new Error(error.response?.data?.message || error.message);
        }

        console.error(`[Unknown Error - fetchSiteData]:`, error);
        throw error;
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
    const { data } = await apiClient.post<ApiResponse>('?action=update_category', { category, newData });
    if (data.status !== 'success') throw new Error(data.message || `Failed to update ${category}`);
    return data;
};
