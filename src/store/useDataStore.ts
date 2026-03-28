import { create } from 'zustand';
// import { SCHOOLS, NEWS, JOBS } from '@/constants';
import { School, NewsItem, JobVacancy, JobApplication } from '@/types';

export interface SiteData {
    schools: School[];
    news: NewsItem[];
    jobs: JobVacancy[];
    jobDepartments: { id: string; nameEn: string; nameAr: string }[];
    governorates: { id: string; name: string; nameAr: string }[];
    jobApplications: JobApplication[];
    admissions: any[];
    admissionSettings: {
        isOpen: boolean;
        requiredDocuments: string[];
        gradeStages: string[];
        gradeClasses: string[];
        maxPreferences: number;
        formTitle: string;
        formTitleAr: string;
        formDesc: string;
        formDescAr: string;
    };
    heroSlides: any[];
    aboutData: any;
    complaints: any[];
    contactMessages: any[];
    pagesHeroSettings: {
        about: { backgroundType: 'color' | 'image'; backgroundColor?: string; backgroundImage?: string; };
        schools: { backgroundType: 'color' | 'image'; backgroundColor?: string; backgroundImage?: string; };
        news: { backgroundType: 'color' | 'image'; backgroundColor?: string; backgroundImage?: string; };
        jobs: { backgroundType: 'color' | 'image'; backgroundColor?: string; backgroundImage?: string; };
        complaints: { backgroundType: 'color' | 'image'; backgroundColor?: string; backgroundImage?: string; };
        contact: { backgroundType: 'color' | 'image'; backgroundColor?: string; backgroundImage?: string; };
    };
    stats: {
        journeyInNumbers: string;
        journeyInNumbersAr: string;
        items: { number: string; label: string; labelAr: string; color: string; }[];
    };
    homeData: {
        trustedTitle: string;
        trustedTitleAr: string;
        trustedHighlight: string;
        trustedHighlightAr: string;
        trustedDesc: string;
        trustedDescAr: string;
        trustedCTA: string;
        trustedCTAAr: string;

        gatewayTitle: string;
        gatewayTitleAr: string;
        gatewayHighlight: string;
        gatewayHighlightAr: string;
        gatewayDesc: string;
        gatewayDescAr: string;
        gatewayCTA: string;
        gatewayCTAAr: string;
        mapImage: string;

        ctaTitle: string;
        ctaTitleAr: string;
        ctaDesc: string;
        ctaDescAr: string;
        ctaButton: string;
        ctaButtonAr: string;
    };
    partners: { id: string; name: string; logo: string; }[];
    galleryImages: string[];
    formSettings: {
        contactFormTitle: string;
        contactFormTitleAr: string;
        contactFormDesc: string;
        contactFormDescAr: string;
        jobFormTitle: string;
        jobFormTitleAr: string;
        jobFormDesc: string;
        jobFormDescAr: string;
    };
    contactData: {
        address: string;
        addressAr: string;
        phone: string;
        email: string;
        workingHours: string;
        workingHoursAr: string;
        facebook: string;
        twitter: string;
        instagram: string;
        linkedin: string;
        footerDesc?: string;
        footerDescAr?: string;
    };
}

export const DEFAULT_SITE_DATA: SiteData = {
    schools: [],
    news: [],
    jobs: [],
    jobDepartments: [],
    governorates: [],
    jobApplications: [],
    admissions: [],
    admissionSettings: {
        isOpen: true,
        requiredDocuments: ['شهادة الميلاد', 'صورة شخصية', 'شهادة آخر سنة دراسية'],
        gradeStages: ['ابتدائي', 'إعدادي', 'ثانوي'],
        gradeClasses: ['أول', 'ثاني', 'ثالث', 'رابع', 'خامس', 'سادس'],
        maxPreferences: 0,
        formTitle: 'School Admission Application',
        formTitleAr: 'طلب التقديم للمدارس',
        formDesc: 'Fill in your details to apply for admission',
        formDescAr: 'أدخل بياناتك للتقديم على الالتحاق بالمدارس'
    },
    complaints: [],
    contactMessages: [],
    heroSlides: [],
    aboutData: {
        name: '', nameAr: '', role: '', roleAr: '',
        desc: '', descAr: '', quote: '', quoteAr: '',
        points: [], pointsAr: [],
        chairmanImage: '',
        storyTitle: '', storyTitleAr: '', storyDesc: '', storyDescAr: '',
        missionTitle: '', missionTitleAr: '', missionDesc: '', missionDescAr: '',
        visionTitle: '', visionTitleAr: '', visionDesc: '', visionDescAr: '',
        values: [],
        storyImage: '',
        schoolCount: '', schoolCountAr: '',
        schoolCountLabel: '', schoolCountLabelAr: ''
    },
    pagesHeroSettings: {
        about: { backgroundType: 'color', backgroundColor: '#0f172a' },
        schools: { backgroundType: 'color', backgroundColor: '#0f172a' },
        news: { backgroundType: 'color', backgroundColor: '#0f172a' },
        jobs: { backgroundType: 'color', backgroundColor: '#0f172a' },
        complaints: { backgroundType: 'color', backgroundColor: '#0f172a' },
        contact: { backgroundType: 'color', backgroundColor: '#0f172a' }
    },
    stats: {
        journeyInNumbers: '', journeyInNumbersAr: '', items: []
    },
    homeData: {
        trustedTitle: '', trustedTitleAr: '', trustedHighlight: '', trustedHighlightAr: '',
        trustedDesc: '', trustedDescAr: '', trustedCTA: '', trustedCTAAr: '',
        gatewayTitle: '', gatewayTitleAr: '', gatewayHighlight: '', gatewayHighlightAr: '',
        gatewayDesc: '', gatewayDescAr: '', gatewayCTA: '', gatewayCTAAr: '', mapImage: '',
        ctaTitle: '', ctaTitleAr: '', ctaDesc: '', ctaDescAr: '', ctaButton: '', ctaButtonAr: ''
    },
    partners: [],
    galleryImages: [],
    formSettings: {
        contactFormTitle: '', contactFormTitleAr: '', contactFormDesc: '', contactFormDescAr: '',
        jobFormTitle: '', jobFormTitleAr: '', jobFormDesc: '', jobFormDescAr: ''
    },
    contactData: {
        address: '', addressAr: '', phone: '', email: '',
        workingHours: '', workingHoursAr: '',
        facebook: '', twitter: '', instagram: '', linkedin: '',
        footerDesc: '', footerDescAr: ''
    }
};

interface DataStoreState {
    data: SiteData;
    setData: (data: SiteData) => void;
    updateData: (category: keyof SiteData, newData: any) => void;
}

export const useDataStore = create<DataStoreState>((set) => ({
    data: DEFAULT_SITE_DATA,
    setData: (data) => set({ data }),
    updateData: (category, newData) => set((state) => ({
        data: {
            ...state.data,
            [category]: newData
        }
    })),
}));
