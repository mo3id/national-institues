import axios, { AxiosError } from 'axios';
import { SiteData } from '@/store/useDataStore';

// Ensure the API base URL falls back to relative /api.php if VITE_API_BASE_URL is not provided or undefined
// This uses Vite's string replacement for env variables.
// Remove /api.php from base URL to handle paths cleanly
const API_BASE_URL: string = ((import.meta as any).env.VITE_API_BASE_URL || '/api.php').replace(/\/api\.php\/?$/, '');
const SYNC_CHANNEL_NAME = 'nis_data_sync';

// Cross-tab and local tab sync helper
const notifyUpdate = () => {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('nis_data_sync_local'));
    }
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
    // timeout set to 120s to accommodate the massive ~6.2MB payload from cPanel
    timeout: 120000,
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

import { SCHOOLS, NEWS, JOBS, GOVERNORATES } from '@/constants';
import { DEFAULT_SITE_DATA } from '@/store/useDataStore';

export const fetchSiteData = async (): Promise<SiteData> => {
    try {
        const response = await apiClient.get<ApiResponse<SiteData>>(`?action=get_site_data&t=${Date.now()}`);
        const { data } = response;

        if (data.status !== 'success' || !data.data) {
            throw new Error(data.message || 'Failed to fetch site data from server.');
        }

        return data.data;
    } catch (error: any) {
        console.warn('[API Warning]: Failed to fetch site data, falling back to mock data:', error);

        // Return mock data so the app can still run when the PHP server is down or timing out
        return {
            ...DEFAULT_SITE_DATA,
            schools: SCHOOLS as any,
            news: NEWS as any,
            jobs: JOBS as any,
            stats: {
                journeyInNumbers: 'Journey in Numbers',
                journeyInNumbersAr: 'رحلتنا في أرقام',
                items: [
                    { number: '25', label: 'Schools', labelAr: 'مدرسة', color: '#1e3a8a' },
                    { number: '100K+', label: 'Students', labelAr: 'طالب', color: '#991b1b' },
                ]
            }
        };
    }
};

export const submitComplaint = async (complaintData: Record<string, any>): Promise<ApiResponse> => {
    const { data } = await apiClient.post<ApiResponse>('?action=add_complaint', complaintData);
    if (data.status !== 'success') throw new Error(data.message || 'Failed to submit complaint');
    notifyUpdate();
    return data;
};

export const getComplaintStatus = async (complaintId: string): Promise<ApiResponse> => {
    const { data } = await apiClient.get<ApiResponse>(`?action=get_complaint_status&complaintId=${complaintId}`);
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

export const getPaginatedEntries = async (params: { type: string, page: number, limit: number, search?: string, filterType?: string }): Promise<ApiResponse> => {
    const { type, page, limit, search = '', filterType = 'All' } = params;
    const { data } = await apiClient.get<ApiResponse>(`?action=get_entries&type=${type}&page=${page}&limit=${limit}&search=${encodeURIComponent(search)}&filterType=${encodeURIComponent(filterType)}`);
    return data;
};

export const updateComplaint = async (id: string, status: string, response: string): Promise<ApiResponse> => {
    const { data } = await apiClient.post<ApiResponse>('?action=update_complaint', { id, status, response });
    return data;
};

export const updateJobApplication = async (id: string, status: string): Promise<ApiResponse> => {
    const { data } = await apiClient.post<ApiResponse>('?action=update_job_application', { id, status });
    return data;
};

export const getJobApplicationDetails = async (id: string): Promise<ApiResponse> => {
    const { data } = await apiClient.get<ApiResponse>(`?action=get_job_application&id=${id}`);
    return data;
};

export const deleteEntry = async (type: 'complaints' | 'contactMessages' | 'jobApplications', id: string): Promise<ApiResponse> => {
    const { data } = await apiClient.post<ApiResponse>('?action=delete_entry', { type, id });
    if (data.status !== 'success') throw new Error(data.message || 'Failed to delete entry');
    return data;
};

// --- Specialized CRUD for real tables (News, Schools, Jobs) ---
export const saveNews = async (news: any): Promise<ApiResponse> => {
    const { data } = await apiClient.post<ApiResponse>('?action=save_news', news);
    notifyUpdate();
    return data;
};

export const deleteNews = async (id: string): Promise<ApiResponse> => {
    const { data } = await apiClient.get<ApiResponse>(`?action=delete_news&id=${id}`);
    notifyUpdate();
    return data;
};

export const saveSchool = async (school: any): Promise<ApiResponse> => {
    const { data } = await apiClient.post<ApiResponse>('?action=save_school', school);
    notifyUpdate();
    return data;
};

export const deleteSchool = async (id: string): Promise<ApiResponse> => {
    const { data } = await apiClient.get<ApiResponse>(`?action=delete_school&id=${id}`);
    notifyUpdate();
    return data;
};

export const saveJob = async (job: any): Promise<ApiResponse> => {
    const { data } = await apiClient.post<ApiResponse>('?action=save_job', job);
    notifyUpdate();
    return data;
};

export const getDashboardStats = async (): Promise<ApiResponse> => {
    const { data } = await apiClient.get<ApiResponse>('?action=get_dashboard_stats');
    return data;
};

export const getLiveStats = async (): Promise<ApiResponse> => {
    const { data } = await apiClient.get<ApiResponse>('?action=get_live_stats');
    return data;
};

export const deleteJob = async (id: string): Promise<ApiResponse> => {
    const { data } = await apiClient.get<ApiResponse>(`?action=delete_job&id=${id}`);
    notifyUpdate();
    return data;
};
