// Admissions API Service - Frontend API calls
import { apiClient } from './api';

const API_URL = (import.meta as any).env?.VITE_API_URL || '/api.php';

// Types
export interface Preference {
  schoolId: string;
  schoolName?: string;
  schoolNameAr?: string;
  stage?: string;
}

export interface AdmissionData {
  studentName: string;
  studentNameAr?: string;
  studentDOB?: string;
  studentNationalId?: string;
  passportNumber?: string;
  gradeStage: string;
  gradeClass?: string;
  parentName?: string;
  parentNameAr?: string;
  parentPhone: string;
  parentEmail?: string;
  parentNationalId?: string;
  parentJob?: string;
  address?: string;
  hasSibling?: boolean;
  siblingSchool?: string;
  preferences: Preference[];
  documents: File[]; // Required
  idType?: 'national_id' | 'passport' | 'both';
}

export interface AdmissionResponse {
  applicationId: string;
  applicationNumber: string;
  trackUrl: string;
}

export interface AdmissionStatus {
  applicationId: string;
  applicationNumber: string;
  studentName: string;
  gradeStage: string;
  gradeClass?: string;
  status: string;
  statusLabel: string;
  acceptedSchool: string | null;
  submittedAt: string;
  updatedAt: string;
  preferences: {
    order: number;
    schoolId: string;
    schoolName: string;
    stage: string;
  }[];
  modifications: {
    requestNumber: string;
    status: string;
    statusLabel: string;
    reason: string;
    adminResponse: string | null;
    requestedAt: string;
    reviewedAt: string | null;
  }[];
  actions: {
    canRequestModification: boolean;
    canEditPreferences: boolean;
    requestModificationUrl: string;
    editPreferencesUrl: string;
  };
}

export interface ModificationRequest {
  admissionId: string;
  requestedPreferences: Preference[];
  reason: string;
}

export interface ModificationResponse {
  requestId: string;
  requestNumber: string;
  trackUrl: string;
}

export interface ModificationStatus {
  requestNumber: string;
  studentName: string;
  status: string;
  statusLabel: string;
  reason: string;
  adminResponse: string | null;
  requestedAt: string;
  reviewedAt: string | null;
  completedAt: string | null;
  requestedPreferences: Preference[];
  actions: {
    canResubmit: boolean;
    canEdit: boolean;
  };
}

/**
 * Submit new admission application
 * Uses FormData for file uploads
 */
export const submitAdmission = async (data: AdmissionData): Promise<{
  status: string;
  message?: string;
  data?: AdmissionResponse;
  error_code?: string;
}> => {
  const formData = new FormData();
  
  // Add text fields
  formData.append('studentName', data.studentName);
  if (data.studentNameAr) formData.append('studentNameAr', data.studentNameAr);
  if (data.studentDOB) formData.append('studentDOB', data.studentDOB);
  formData.append('studentNationalId', data.studentNationalId);
  formData.append('gradeStage', data.gradeStage);
  if (data.gradeClass) formData.append('gradeClass', data.gradeClass);
  if (data.parentName) formData.append('parentName', data.parentName);
  if (data.parentNameAr) formData.append('parentNameAr', data.parentNameAr);
  formData.append('parentPhone', data.parentPhone);
  if (data.parentEmail) formData.append('parentEmail', data.parentEmail);
  if (data.parentNationalId) formData.append('parentNationalId', data.parentNationalId);
  if (data.parentJob) formData.append('parentJob', data.parentJob);
  if (data.address) formData.append('address', data.address);
  formData.append('hasSibling', data.hasSibling ? '1' : '0');
  if (data.siblingSchool) formData.append('siblingSchool', data.siblingSchool);
  
  // Add preferences as JSON
  formData.append('preferences', JSON.stringify(data.preferences));
  
  // Add documents
  if (data.documents && data.documents.length > 0) {
    const docNames: string[] = [];
    data.documents.forEach((doc, index) => {
      formData.append('documents[]', doc);
      docNames.push(`Document ${index + 1}`);
    });
    formData.append('documentNames', JSON.stringify(docNames));
  }
  
  const response = await apiClient.post(`?action=add_admission`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

/**
 * Get admission status by various identifiers
 */
export const getAdmissionStatus = async (
  identifier: { admissionId?: string; applicationNumber?: string; nationalId?: string }
): Promise<{
  status: string;
  data?: AdmissionStatus;
  message?: string;
}> => {
  const params = new URLSearchParams();
  if (identifier.admissionId) params.append('admissionId', identifier.admissionId);
  if (identifier.applicationNumber) params.append('applicationNumber', identifier.applicationNumber);
  if (identifier.nationalId) params.append('nationalId', identifier.nationalId);
  
  const response = await apiClient.get(`?action=get_admission_status&${params.toString()}`);
  return response.data;
};

/**
 * Request modification of preferences
 */
export const requestModification = async (
  data: ModificationRequest
): Promise<{
  status: string;
  message?: string;
  data?: ModificationResponse;
}> => {
  const response = await apiClient.post(`?action=request_modification`, data);
  return response.data;
};

/**
 * Get modification request status
 */
export const getModificationStatus = async (
  requestNumber?: string,
  nationalIdSuffix?: string,
  applicationNumber?: string
): Promise<{
  status: string;
  data?: ModificationStatus;
  message?: string;
}> => {
  const params = new URLSearchParams();
  if (requestNumber) params.append('requestNumber', requestNumber);
  if (nationalIdSuffix) params.append('nationalIdSuffix', nationalIdSuffix);
  if (applicationNumber) params.append('applicationNumber', applicationNumber);

  const response = await apiClient.get(`?action=get_modification_status&${params.toString()}`);
  return response.data;
};

// Admin-only functions

export interface ReviewModificationRequest {
  requestId: string;
  action: 'approve' | 'reject';
  adminResponse: string;
}

export interface UpdateAdmissionRequest {
  id: string;
  status?: string;
  acceptedSchoolId?: string | null;
  adminNotes?: string;
}

/**
 * Review modification request (Admin only)
 */
export const reviewModification = async (
  data: ReviewModificationRequest
): Promise<{
  status: string;
  message?: string;
  data?: {
    requestId: string;
    newStatus: string;
    admissionStatus: string;
    adminResponse: string;
  };
}> => {
  const response = await apiClient.post(`?action=review_modification`, data);
  return response.data;
};

/**
 * Delete modification request (Admin only)
 */
export const deleteModification = async (
  id: string
): Promise<{
  status: string;
  message?: string;
}> => {
  const response = await apiClient.post(`?action=delete_modification`, { id });
  return response.data;
};

/**
 * Update admission status (Admin only)
 */
export const updateAdmission = async (
  data: UpdateAdmissionRequest
): Promise<{
  status: string;
  message?: string;
  data?: { id: string; status: string };
}> => {
  const response = await apiClient.post(`?action=update_admission`, data);
  return response.data;
};
