
export interface School {
  id: string;
  name: string;
  nameAr: string;
  location: string;
  locationAr: string;
  governorate: string;
  governorateAr: string;
  principal: string;
  principalAr?: string;
  logo: string;
  type: 'Arabic' | 'Languages' | 'American' | 'British' | 'French';
  mainImage?: string;
  gallery?: string[];
  about?: string;
  aboutAr?: string;
  phone?: string;
  email?: string;
  website?: string;
  rating?: string;
  studentCount?: string;
  foundedYear?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  titleAr: string;
  date: string;
  summary: string;
  summaryAr: string;
  image: string;
  published?: boolean;
}

export interface JobVacancy {
  id: string;
  title: string;
  titleAr: string;
  department: string;
  departmentAr: string;
  location: string;
  locationAr: string;
  type: string;
  typeAr: string;
  description: string;
  descriptionAr: string;
  image?: string; // optional cover image base64/URL
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  fullName: string;
  email: string;
  phone: string;
  experience?: string;
  coverLetter?: string;
  cvName: string;
  cvData: string; // base64 or blob URL
  appliedAt: string;
  status: 'Pending' | 'Interview' | 'Rejected' | 'Hired' | 'On Hold';
  notes?: string;
}

export enum ThinkingLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export type AspectRatio = '1:1' | '2:3' | '3:2' | '3:4' | '4:3' | '9:16' | '16:9' | '21:9';
export type ImageSize = '1K' | '2K' | '4K';
