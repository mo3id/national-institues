import axios from 'axios';

// Ensure the API base URL is relative when deployed, or points to the backend folder
// for local dev, if proxy is configured, or point to absolute localhost URL.
const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || '/backend/api.php';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const fetchSiteData = async () => {
    const { data } = await apiClient.get('?action=get_site_data');
    if (data.status !== 'success') throw new Error(data.message || 'Failed to fetch site data');
    return data.data; // The actual SiteData object
};

export const submitComplaint = async (complaintData: any) => {
    const { data } = await apiClient.post('?action=add_complaint', complaintData);
    if (data.status !== 'success') throw new Error(data.message);
    return data;
};

export const submitContactMessage = async (contactData: any) => {
    const { data } = await apiClient.post('?action=add_contact_message', contactData);
    if (data.status !== 'success') throw new Error(data.message);
    return data;
};
