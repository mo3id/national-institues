import { create } from 'zustand';
import { SCHOOLS, NEWS, JOBS } from '@/constants';
import { School, NewsItem, JobVacancy } from '@/types';

export interface SiteData {
    schools: School[];
    news: NewsItem[];
    jobs: JobVacancy[];
    heroSlides: any[];
    aboutData: any;
    complaints: any[];
    contactMessages: any[];
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
}

export const DEFAULT_SITE_DATA: SiteData = {
    schools: SCHOOLS || [],
    news: NEWS || [],
    jobs: JOBS || [],
    complaints: [],
    contactMessages: [],
    heroSlides: [
        {
            id: 1,
            title: 'Nurturing Global Leaders',
            titleAr: 'تنشئة قادة عالميين',
            subtitle: 'Legacy of Excellence',
            subtitleAr: 'إرث من التميز',
            description: 'Empowering the next generation with world-class education and values.',
            descriptionAr: 'تمكين الجيل القادم من خلال تعليم وقيم ذات مستوى عالمي.',
            image: '/nano-banana-1771792169108.png'
        },
        { id: 2, title: 'Excellence in Education', titleAr: 'التميز في التعليم', subtitle: 'Leading National Institutes in Egypt', subtitleAr: 'المعاهد القومية الرائدة في مصر', description: 'Empowering future generations with knowledge and values.', descriptionAr: 'تمكين أجيال المستقبل بالمعرفة والقيم.', image: '/nano-banana-1771778144311.png' },
        { id: 3, title: 'Modern Learning', titleAr: 'تعلم حديث', subtitle: 'Advanced Curriculum & Facilities', subtitleAr: 'مناهج ومرافق متطورة', description: 'Preparing students for a globalized world.', descriptionAr: 'إعداد الطلاب لعالم معولم.', image: '/nano-banana-1771806330134.png' },
    ],
    aboutData: {
        name: 'Ahmed Eid',
        nameAr: 'أحمد عيد',
        role: 'Chairman of NIS',
        roleAr: 'رئيس المعاهد القومية',
        desc: 'Leading the future of national education in Egypt through excellence and innovation.',
        descAr: 'قيادة مستقبل التعليم القومي في مصر من خلال التميز والابتكار.',
        quote: 'Education is the most powerful weapon which you can use to change the world.',
        quoteAr: 'التعليم هو أقوى سلاح يمكنك استخدامه لتغيير العالم.',
        points: ['40+ Years of Excellence', 'Modern Curriculum', 'Expert Faculty', 'Advanced Facilities'],
        pointsAr: ['أكثر من ٤٠ عاماً من التميز', 'مناهج حديثة', 'أعضاء هيئة تدريس خبراء', 'مرافق متقدمة'],
        chairmanImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2000&auto=format&fit=crop',
        storyTitle: 'Crafting the Future Since 1995',
        storyTitleAr: 'صياغة المستقبل منذ عام ١٩٩٥',
        storyDesc: 'Our journey began with a simple yet profound vision: to provide world-class education that respects our national roots while embracing global innovation.',
        storyDescAr: 'بدأت رحلتنا برؤية بسيطة ولكن عميقة: تقديم تعليم عالمي يحترم جذورنا الوطنية مع تبني الابتكار العالمي.',
        missionTitle: 'Our Mission',
        missionTitleAr: 'رسالتنا',
        missionDesc: 'To empower students with the knowledge, skills, and values needed to thrive in an ever-changing world, fostering a new generation of Egyptian leaders.',
        missionDescAr: 'تمكين الطلاب بالمعرفة والمهارات والقيم اللازمة للازدهار في عالم دائم التغير، ورعاية جيل جديد من القادة المصريين.',
        visionTitle: 'Our Vision',
        visionTitleAr: 'رؤيتنا',
        visionDesc: 'To be the benchmark for educational excellence in Egypt, recognized for producing graduates who are intellectually curious and socially responsible.',
        visionDescAr: 'أن نكون المعيار للتميز التعليمي في مصر، والمعترف بنا في تخريج طلاب يتسمون بالفضول الفكري والمسؤولية الاجتماعية.',
        values: [
            { title: 'Excellence', titleAr: 'التميز', desc: 'Striving for the highest standards in everything we do.', descAr: 'السعي لتحقيق أعلى المعايير في كل ما نقوم به.' },
            { title: 'Innovation', titleAr: 'الابتكار', desc: 'Embracing new ideas and creative problem solving.', descAr: 'تبني الأفكار الجديدة وحل المشكلات بطرق إبداعية.' },
            { title: 'Integrity', titleAr: 'النزاهة', desc: 'Maintaining honest and ethical conduct at all times.', descAr: 'الحفاظ على السلوك الصادق والأخلاقي في جميع الأوقات.' },
            { title: 'Community', titleAr: 'المجتمع', desc: 'Fostering a supportive and inclusive learning environment.', descAr: 'تعزيز بيئة تعليمية داعمة وشاملة للجميع.' }
        ]
    },
    stats: {
        journeyInNumbers: "Our Journey in Numbers",
        journeyInNumbersAr: "رحلتنا في أرقام",
        items: [
            { number: '40+', label: 'Educational Institutions', labelAr: 'مؤسسة تعليمية', color: 'bg-rose-400' },
            { number: '50k+', label: 'Students Enrolled', labelAr: 'طالب وطالبة', color: 'bg-sky-300' },
            { number: '8.5k+', label: 'Expert Educators', labelAr: 'معلم خبير', color: 'bg-amber-300' },
            { number: '5', label: 'Decades of Legacy', labelAr: 'عقود من العطاء', color: 'bg-emerald-300' }
        ]
    },
    homeData: {
        trustedTitle: 'Trusted by Generations of',
        trustedTitleAr: 'أجيال تثق في',
        trustedHighlight: 'Egyptian Families',
        trustedHighlightAr: 'العائلات المصرية',
        trustedDesc: 'Providing high-quality national education that builds character and prepares students for a successful future.',
        trustedDescAr: 'تقديم تعليم قومي عالي الجودة يبني الشخصية ويعد الطلاب لمستقبل ناجح.',
        trustedCTA: 'Discover Our Schools',
        trustedCTAAr: 'اكتشف مدارسنا',
        gatewayTitle: 'Your Gateway to',
        gatewayTitleAr: 'بوابتك إلى',
        gatewayHighlight: 'Educational Excellence',
        gatewayHighlightAr: 'التميز التعليمي',
        gatewayDesc: 'Join thousands of students across Egypt in our network of specialized national institutes.',
        gatewayDescAr: 'انضم إلى آلاف الطلاب في جميع أنحاء مصر في شبكة معاهدنا القومية المتخصصة.',
        gatewayCTA: 'View Map',
        gatewayCTAAr: 'عرض الخريطة',
        mapImage: '/nano-banana-17717977008341.png',
        ctaTitle: 'Join the NIS Family Today',
        ctaTitleAr: 'انضم لعائلة المعاهد القومية اليوم',
        ctaDesc: 'Become part of Egypt\'s leading educational network and shape your child\'s future.',
        ctaDescAr: 'كن جزءاً من شبكة التعليم الرائدة في مصر وشكل مستقبل طفلك.',
        ctaButton: 'Register Interest',
        ctaButtonAr: 'سجل اهتمامك'
    },
    partners: [
        { id: '1', name: 'Partner 1', logo: '/image copy.png' },
        { id: '2', name: 'Partner 2', logo: '/image copy.png' },
        { id: '3', name: 'Partner 3', logo: '/image copy.png' },
        { id: '4', name: 'Partner 4', logo: '/image copy.png' },
    ],
    galleryImages: [
        'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=600&q=80'
    ],
    formSettings: {
        contactFormTitle: 'Get in Touch',
        contactFormTitleAr: 'تواصل معنا',
        contactFormDesc: 'We are here to answer your questions and help you in any way we can.',
        contactFormDescAr: 'نحن هنا للإجابة على أسئلتك ومساعدتك بأي طريقة ممكنة.',
        jobFormTitle: 'Join Our Team',
        jobFormTitleAr: 'انضم إلى فريقنا',
        jobFormDesc: 'Fill out the form below to apply for your dream job at NIS.',
        jobFormDescAr: 'املأ النموذج أدناه للتقدم لوظيفة أحلامك في المعاهد القومية.',
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
