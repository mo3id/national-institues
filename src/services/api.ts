import axios, { AxiosError } from 'axios';
import { SiteData } from '@/store/useDataStore';
import { getAuthHeaders, clearAuth } from './authApi';

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

// Axios interceptor to append /api.php and add Authorization header
apiClient.interceptors.request.use(config => {
    // If the url is just query params (e.g. ?action=...), prepend /api.php
    if (config.url && config.url.startsWith('?')) {
        config.url = `/api.php${config.url}`;
    }
    
    // Add Authorization header if token exists
    const authHeaders = getAuthHeaders();
    if (authHeaders.Authorization) {
        config.headers = config.headers || {};
        config.headers.Authorization = authHeaders.Authorization;
    }
    
    return config;
});

// Response interceptor to handle 401 errors
apiClient.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            // Clear auth and redirect to login
            clearAuth();
            // Remove old mock auth flag if exists
            localStorage.removeItem('is_admin_authenticated');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

interface ApiResponse<T = any> {
    status: 'success' | 'error';
    data?: T;
    message?: string;
}

import { SCHOOLS, NEWS, JOBS, GOVERNORATES } from '@/constants';
import { DEFAULT_SITE_DATA } from '@/store/useDataStore';

export const fetchSiteData = async (): Promise<SiteData> => {
    try {
        console.log('[API Debug]: Fetching site data from server...');
        const startTime = Date.now();
        const response = await apiClient.get<ApiResponse<SiteData>>(`?action=get_site_data&t=${Date.now()}`);
        const loadTime = Date.now() - startTime;
        console.log(`[API Debug]: Response received in ${loadTime}ms`);
        const { data } = response;

        if (data.status !== 'success' || !data.data) {
            console.error('[API Error]: Server returned non-success status:', data);
            throw new Error(data.message || 'Failed to fetch site data from server.');
        }

        console.log('[API Success]: Site data loaded successfully');
        return data.data;
    } catch (error: any) {
        console.error('[API Error]: Failed to fetch site data, falling back to mock data');
        console.error('[API Error Details]:', {
            message: error.message,
            code: error.code,
            response: error.response?.data,
            status: error.response?.status,
            url: error.config?.url
        });

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

export const submitAdmission = async (admissionData: Record<string, any>): Promise<ApiResponse> => {
    const fd = new FormData();
    // Text fields
    const textFields = ['studentName', 'studentDOB', 'studentNationalId', 'gradeStage', 'gradeClass', 'parentName', 'parentPhone', 'parentEmail', 'notes'];
    for (const key of textFields) {
        fd.append(key, admissionData[key] ?? '');
    }
    // Preferences as JSON string
    fd.append('preferences', JSON.stringify(admissionData.preferences || []));
    // Document names as JSON string, files as actual File objects
    const docs: { name: string; file?: File }[] = admissionData.documents || [];
    const docNames: string[] = [];
    for (const doc of docs) {
        docNames.push(doc.name || '');
        if (doc.file) {
            fd.append('documents[]', doc.file, doc.file.name);
        }
    }
    fd.append('documentNames', JSON.stringify(docNames));

    const { data } = await apiClient.post<ApiResponse>('?action=add_admission', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000,
    });
    if (data.status !== 'success') throw new Error(data.message || 'Failed to submit admission');
    return data;
};

export const getAdmissionDetail = async (id: string): Promise<ApiResponse> => {
    const { data } = await apiClient.get<ApiResponse>(`?action=get_admission_detail&id=${id}`);
    if (data.status !== 'success') throw new Error(data.message || 'Failed to fetch admission detail');
    return data;
};

export const getAdmissionStatus = async (admissionId: string): Promise<ApiResponse> => {
    const { data } = await apiClient.get<ApiResponse>(`?action=get_admission_status&admissionId=${admissionId}`);
    return data;
};

export const updateAdmission = async (id: string, status: string, acceptedSchool: string, adminNotes: string): Promise<ApiResponse> => {
    const { data } = await apiClient.post<ApiResponse>('?action=update_admission', { id, status, acceptedSchool, adminNotes });
    return data;
};

export const deleteEntry = async (type: 'complaints' | 'contactMessages' | 'jobApplications' | 'admissions', id: string): Promise<ApiResponse> => {
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

export const saveGovernorate = async (governorate: any): Promise<ApiResponse> => {
    const { data } = await apiClient.post<ApiResponse>('?action=save_governorate', governorate);
    notifyUpdate();
    return data;
};

export const deleteGovernorate = async (id: string): Promise<ApiResponse> => {
    const { data } = await apiClient.get<ApiResponse>(`?action=delete_governorate&id=${id}`);
    notifyUpdate();
    return data;
};

export const deleteJob = async (id: string): Promise<ApiResponse> => {
    const { data } = await apiClient.get<ApiResponse>(`?action=delete_job&id=${id}`);
    notifyUpdate();
    return data;
};

export const saveAlumni = async (alumni: any): Promise<ApiResponse> => {
    const { data } = await apiClient.post<ApiResponse>('?action=save_alumni', alumni);
    notifyUpdate();
    return data;
};

export const deleteAlumni = async (id: string): Promise<ApiResponse> => {
    const { data } = await apiClient.get<ApiResponse>(`?action=delete_alumni&id=${id}`);
    notifyUpdate();
    return data;
};
