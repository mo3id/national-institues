export type Section = 'overview' | 'news' | 'schools' | 'hero' | 'about' | 'settings';
export type Theme = 'light' | 'dark';
export type Lang = 'en' | 'ar';

export interface DashNewsItem {
    id: string;
    title: string;
    titleAr: string;
    date: string;
    summary: string;
    summaryAr: string;
    image: string;
    published: boolean;
}

export interface DashSchool {
    id: string;
    name: string;
    location: string;
    governorate: string;
    principal: string;
    logo: string;
    type: string;
}

export interface HeroSlide {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    image: string;
}

export interface AboutData {
    quote: string;
    name: string;
    role: string;
    desc: string;
    points: string[];
}

export interface AdminProfile {
    name: string;
    email: string;
}

export const UI: Record<Lang, Record<string, string>> = {
    en: {
        overview: 'Overview', news: 'News Articles', schools: 'Schools',
        hero: 'Hero Slides', about: 'About Section', settings: 'Settings',
        logout: 'Logout', addArticle: 'Add Article', editSection: 'Edit Section',
        save: 'Save Changes', cancel: 'Cancel', delete: 'Delete', edit: 'Edit',
        published: 'Published', draft: 'Draft', search: 'Search...',
        titleEn: 'Title (EN)', titleAr: 'Title (AR)', summaryEn: 'Summary (EN)',
        summaryAr: 'Summary (AR)', date: 'Date', imageUrl: 'Image URL',
        publishNow: 'Publish immediately', chairmanName: 'Chairman Name',
        role: 'Role / Title', quote: 'Quote', description: 'Description',
        keyPoints: 'Key Points (comma separated)', slideTitle: 'Title',
        slideSubtitle: 'Subtitle / Badge', slideDesc: 'Description', slideImage: 'Image URL',
        schoolName: 'School Name', location: 'Location', governorate: 'Governorate',
        principal: 'Principal', type: 'Type', logo: 'Logo URL',
        adminProfile: 'Admin Profile', adminName: 'Name', adminEmail: 'Email',
        language: 'Dashboard Language', darkMode: 'Dark Mode',
        totalArticles: 'Total Articles', publishedCount: 'Published',
        schoolsCount: 'Schools', studentsCount: 'Students',
        quickActions: 'Quick Actions', recentArticles: 'Recent Articles',
        viewAll: 'View All', addNewArticle: 'Add News Article',
        editHero: 'Edit Hero Slides', updateAbout: 'Update About Section',
        actions: 'Actions', status: 'Status', title: 'Title',
        heroManage: 'Manage homepage hero slider content',
        aboutManage: "Manage the chairman's message and about section",
        schoolsManage: 'Browse and edit all schools in the network',
        newsManage: 'articles', profileSaved: 'Profile saved!', settingsSaved: 'Settings saved!',
        articleSaved: 'Article saved successfully', articleDeleted: 'Article deleted',
        articleAdded: 'New article added!', slideSaved: 'Hero slide saved',
        aboutSaved: 'About section saved!', schoolSaved: 'School saved!',
        required: 'Title and date are required',
    },
    ar: {
        overview: 'نظرة عامة', news: 'الأخبار', schools: 'المدارس',
        hero: 'شرائح البطل', about: 'قسم التعريف', settings: 'الإعدادات',
        logout: 'تسجيل الخروج', addArticle: 'إضافة مقال', editSection: 'تعديل القسم',
        save: 'حفظ التغييرات', cancel: 'إلغاء', delete: 'حذف', edit: 'تعديل',
        published: 'منشور', draft: 'مسودة', search: 'بحث...',
        titleEn: 'العنوان (إنجليزي)', titleAr: 'العنوان (عربي)', summaryEn: 'الملخص (إنجليزي)',
        summaryAr: 'الملخص (عربي)', date: 'التاريخ', imageUrl: 'رابط الصورة',
        publishNow: 'نشر فوراً', chairmanName: 'اسم الرئيس',
        role: 'الدور / اللقب', quote: 'الاقتباس', description: 'الوصف',
        keyPoints: 'النقاط الرئيسية (مفصولة بفاصلة)', slideTitle: 'العنوان',
        slideSubtitle: 'العنوان الفرعي / الشارة', slideDesc: 'الوصف', slideImage: 'رابط الصورة',
        schoolName: 'اسم المدرسة', location: 'الموقع', governorate: 'المحافظة',
        principal: 'المدير', type: 'النوع', logo: 'رابط الشعار',
        adminProfile: 'الملف الشخصي', adminName: 'الاسم', adminEmail: 'البريد الإلكتروني',
        language: 'لغة لوحة التحكم', darkMode: 'الوضع الداكن',
        totalArticles: 'إجمالي المقالات', publishedCount: 'المنشورة',
        schoolsCount: 'المدارس', studentsCount: 'الطلاب',
        quickActions: 'إجراءات سريعة', recentArticles: 'أحدث المقالات',
        viewAll: 'عرض الكل', addNewArticle: 'إضافة خبر', editHero: 'تعديل الشرائح',
        updateAbout: 'تحديث قسم التعريف',
        actions: 'الإجراءات', status: 'الحالة', title: 'العنوان',
        heroManage: 'إدارة شرائح الصفحة الرئيسية',
        aboutManage: 'إدارة رسالة الرئيس وقسم التعريف',
        schoolsManage: 'استعراض وتعديل جميع المدارس في الشبكة',
        newsManage: 'مقالات', profileSaved: 'تم حفظ الملف الشخصي!', settingsSaved: 'تم حفظ الإعدادات!',
        articleSaved: 'تم حفظ المقال بنجاح', articleDeleted: 'تم حذف المقال',
        articleAdded: 'تمت إضافة مقال جديد!', slideSaved: 'تم حفظ الشريحة',
        aboutSaved: 'تم حفظ قسم التعريف!', schoolSaved: 'تم حفظ المدرسة!',
        required: 'العنوان والتاريخ مطلوبان',
    }
};

export const HERO_IMAGES = [
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1544531696-9348411883aa?q=80&w=2069&auto=format&fit=crop',
];
