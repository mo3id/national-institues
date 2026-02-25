
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
  type: 'National' | 'International' | 'Language';
  mainImage?: string;
  gallery?: string[];
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
}

export enum ThinkingLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export type AspectRatio = '1:1' | '2:3' | '3:2' | '3:4' | '4:3' | '9:16' | '16:9' | '21:9';
export type ImageSize = '1K' | '2K' | '4K';
