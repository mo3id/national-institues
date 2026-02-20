
export interface School {
  id: string;
  name: string;
  location: string;
  governorate: string;
  principal: string;
  logo: string;
  type: 'National' | 'International' | 'Language';
}

export interface NewsItem {
  id: string;
  title: string;
  titleAr: string;
  date: string;
  summary: string;
  summaryAr: string;
  image: string;
}

export interface JobVacancy {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
}

export enum ThinkingLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export type AspectRatio = '1:1' | '2:3' | '3:2' | '3:4' | '4:3' | '9:16' | '16:9' | '21:9';
export type ImageSize = '1K' | '2K' | '4K';
