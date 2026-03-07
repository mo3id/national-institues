export type Section = 'overview' | 'news' | 'schools' | 'departments' | 'jobs' | 'recruitment' | 'hero' | 'chairman' | 'institute' | 'home' | 'forms' | 'contact' | 'complaints' | 'contactMessages' | 'settings';
export type Theme = 'light' | 'dark';
export type Lang = 'en' | 'ar';

export interface DashNewsItem {
    id: string;
    title: string;
    titleAr: string;
    date: string;
    summary: string;
    summaryAr: string;
    content?: string;
    contentAr?: string;
    image: string;
    published: boolean;
    featured?: boolean;
    highlightTitle?: string;
    highlightTitleAr?: string;
    highlightContent?: string;
    highlightContentAr?: string;
}

export interface DashSchool {
    id: string;
    name: string;
    nameAr?: string;
    location: string;
    locationAr?: string;
    governorate: string;
    governorateAr?: string;
    address?: string;
    addressAr?: string;
    principal: string;
    principalAr?: string;
    logo: string;
    type: string;
    mainImage?: string;
    gallery?: string[];
    // New fields
    about?: string;
    aboutAr?: string;
    phone?: string;
    email?: string;
    website?: string;
    rating?: string;
    studentCount?: string;
    foundedYear?: string;
    applicationLink?: string;
}

export interface DashJob {
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
    image?: string; // optional cover image (base64 or URL)
}

export interface DashJobApplication {
    id: string;
    job?: string;      // Job ID — field name sent by Careers.tsx
    jobId?: string;    // Legacy / alternate key (kept for compatibility)
    jobTitle: string;
    fullName: string;
    email: string;
    phone: string;
    experience?: string;
    coverLetter?: string;
    cvName: string;
    cvData: string;
    appliedAt: string;
    status: 'Pending' | 'Interview' | 'Rejected' | 'Hired' | 'On Hold';
    notes?: string;
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
    nameAr: string;
    roleAr: string;
    quoteAr: string;
    descAr: string;
    pointsAr: string[];
    chairmanImage?: string; // New field

    // New about page fields
    storyTitle: string;
    storyTitleAr: string;
    storyDesc: string;
    storyDescAr: string;
    missionTitle: string;
    missionTitleAr: string;
    missionDesc: string;
    missionDescAr: string;
    visionTitle: string;
    visionTitleAr: string;
    visionDesc: string;
    visionDescAr: string;
    values: { title: string; titleAr: string; desc: string; descAr: string; }[];
}

export interface AdminProfile {
    name: string;
    email: string;
}

export const UI: Record<Lang, Record<string, string>> = {
    en: {
        overview: 'Overview', news: 'News Articles', schools: 'Schools', jobs: 'Job Vacancies',
        hero: 'Hero Slides', about: 'About Section', settings: 'Settings',
        logout: 'Logout', addArticle: 'Add Article', editSection: 'Edit Section',
        save: 'Save Changes', cancel: 'Cancel', delete: 'Delete', edit: 'Edit',
        published: 'Published', draft: 'Draft', search: 'Search...',
        titleEn: 'Title (EN)', titleAr: 'Title (AR)', summaryEn: 'Short Summary (EN)',
        summaryAr: 'Short Summary (AR)', contentEn: 'Full Content (EN)', contentAr: 'Full Content (AR)', date: 'Date', imageUrl: 'Image URL',
        highlightTitleEn: 'Highlight Title (EN)', highlightTitleAr: 'Highlight Title (AR)',
        highlightContentEn: 'Highlight Content (EN)', highlightContentAr: 'Highlight Content (AR)',
        publishNow: 'Publish immediately', chairmanName: 'Chairman Name',
        role: 'Role / Title', quote: 'Quote', description: 'Description',
        keyPoints: 'Key Points (comma separated)', slideTitle: 'Title',
        slideSubtitle: 'Subtitle / Badge', slideDesc: 'Description', slideImage: 'Image URL',
        schoolName: 'School Name', location: 'Location', governorate: 'Governorate',
        address: 'Physical Address',
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
        jobsManage: 'Manage current job openings and applications',
        featuredNews: 'Featured News',
        newsManage: 'articles', profileSaved: 'Profile saved!', settingsSaved: 'Settings saved!',
        articleSaved: 'Article saved successfully', articleDeleted: 'Article deleted',
        articleAdded: 'New article added!', slideSaved: 'Hero slide saved',
        aboutSaved: 'About section saved!', schoolSaved: 'School saved!',
        required: 'Please fill all required fields',
        jobSaved: 'Job saved successfully',
        jobDeleted: 'Job deleted',
        jobAdded: 'New vacancy added!',
        jobImage: 'Job Image',
        uploadImage: 'Upload Image',
        previewImage: 'Preview Image',
        dragDrop: 'Drag & drop or click here',
        previewCV: 'Preview CV',
        homeUpdated: 'Home page updated',
        home: 'Home Page',
        homeManage: 'Manage homepage sections and partners',
        chairman: 'Chairman Word',
        chairmanManage: "Manage the chairman's quote and profile",
        institute: 'About Institute',
        instituteManage: 'Manage history, mission and vision',
        forms: 'Forms Settings',
        formsManage: 'Update form titles and descriptions',
        contactSettings: 'Contact Info',
        contactSettingsManage: 'Manage global addresses, phones and social links',
        noResults: 'No results found',
        addSchool: 'Add School',
        addJob: 'Add Job Vacancy',
        department: 'Department',
        story: 'Our Story',
        mission: 'Mission',
        vision: 'Vision',
        introduction: 'Introduction Section',
        map: 'Map Section',
        partnersGallery: 'Partners & Gallery',
        loading: 'Loading...',
        bottomCTA: 'Bottom CTA Section',
        mapImageLabel: 'Map Image',
        chairmanImageLabel: 'Chairman Image',
        mainImage: 'Primary Image',
        gallery: 'Photo Gallery',
        addImage: 'Add Image',
        aboutSchool: 'About School',
        contactData: 'Contact info',
        website: 'Website',
        rating: 'Rating',
        studentCount: 'Students Count',
        foundedYear: 'Founded Year',
        complaints: 'Complaints',
        complaintsManage: 'View and manage submitted complaints',
        senderName: 'Sender Name',
        phone: 'Phone',
        email: 'Email',
        school: 'School',
        messageType: 'Message Type',
        message: 'Message',
        contactMessages: 'Contact Messages',
        contactMessagesManage: 'View messages from contact forms',
        subject: 'Subject',
        recruitmentPortal: 'Recruitment Portal',
        applicants: 'Applicants',
        applicantsManage: 'View and manage job applications',
        applicationDate: 'Application Date',
        cv: 'CV',
        notes: 'Notes',
        feedback: 'Feedback',
        pending: 'Pending',
        inprogress: 'In Progress',
        responded: 'Responded',
        interview: 'Interview',
        rejected: 'Rejected',
        hired: 'Hired',
        onHold: 'On Hold',
        viewJob: 'View Job',
        backToJobs: 'Back to Jobs',
        changeStatus: 'Change Status',
        addNote: 'Add Note',
        downloadCV: 'Download CV',
        close: 'Close',
        print: 'Print',
    },
    ar: {
        overview: 'نظرة عامة', news: 'الأخبار', schools: 'المدارس', jobs: 'الوظائف الشاغرة',
        hero: 'شرائح البطل', about: 'قسم التعريف', settings: 'الإعدادات',
        logout: 'تسجيل الخروج', addArticle: 'إضافة مقال', editSection: 'تعديل القسم',
        save: 'حفظ التغييرات', cancel: 'إلغاء', delete: 'حذف', edit: 'تعديل',
        published: 'منشور', draft: 'مسودة', search: 'بحث...',
        titleEn: 'العنوان (إنجليزي)', titleAr: 'العنوان (عربي)', summaryEn: 'الملخص المختصر (إنجليزي)',
        summaryAr: 'الملخص المختصر (عربي)', contentEn: 'تفاصيل الخبر (إنجليزي)', contentAr: 'تفاصيل الخبر (عربي)', date: 'التاريخ', imageUrl: 'رابط الصورة',
        highlightTitleEn: 'عنوان القسم الإضافي (إنجليزي)', highlightTitleAr: 'عنوان القسم الإضافي (عربي)',
        highlightContentEn: 'محتوى القسم الإضافي (إنجليزي)', highlightContentAr: 'محتوى القسم الإضافي (عربي)',
        publishNow: 'نشر فوراً', chairmanName: 'اسم الرئيس',
        role: 'الدور / اللقب', quote: 'الاقتباس', description: 'الوصف',
        keyPoints: 'النقاط الرئيسية (مفصولة بفاصلة)', slideTitle: 'العنوان',
        slideSubtitle: 'العنوان الفرعي / الشارة', slideDesc: 'الوصف', slideImage: 'رابط الصورة',
        schoolName: 'اسم المدرسة', location: 'الموقع', governorate: 'المحافظة',
        address: 'العنوان التفصيلي',
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
        jobsManage: 'إدارة الوظائف الشاغرة والفرص المتاحة',
        featuredNews: 'خبر مميز',
        home: 'الصفحة الرئيسية',
        homeManage: 'إدارة محتوى الصفحة الرئيسية والشركاء',
        newsManage: 'مقالات', profileSaved: 'تم حفظ الملف الشخصي!', settingsSaved: 'تم حفظ الإعدادات!',
        articleSaved: 'تم حفظ المقال بنجاح', articleDeleted: 'تم حذف المقال',
        articleAdded: 'تمت إضافة مقال جديد!', slideSaved: 'تم حفظ الشريحة',
        aboutSaved: 'تم حفظ قسم التعريف!', schoolSaved: 'تم حفظ المدرسة!',
        required: 'الرجاء ملء جميع الحقول المطلوبة',
        jobSaved: 'تم حفظ الوظيفة بنجاح',
        jobDeleted: 'تم حذف الوظيفة',
        jobAdded: 'تمت إضافة وظيفة جديدة!',
        jobImage: 'صورة الوظيفة',
        uploadImage: 'رفع صورة',
        previewImage: 'معاينة الصورة',
        dragDrop: 'اسحب وأفلت أو انقر هنا',
        previewCV: 'معاينة السيرة الذاتية',
        homeUpdated: 'تم تحديث الصفحة الرئيسية',
        chairman: 'كلمة الرئيس',
        chairmanManage: 'إدارة صورة واقتباس الرئيس',
        institute: 'عن المعهد',
        instituteManage: 'إدارة التاريخ والرسالة والرؤية',
        forms: 'إعدادات النماذج',
        formsManage: 'تحديث عناوين ونصوص النماذج',
        contactSettings: 'بيانات الاتصال',
        contactSettingsManage: 'إدارة العناوين والهواتف وروابط التواصل الاجتماعي',
        noResults: 'لم يتم العثور على نتائج',
        addSchool: 'إضافة مدرسة',
        addJob: 'إضافة وظيفة شاغرة',
        department: 'القسم',
        story: 'قصتنا',
        mission: 'الرسالة',
        vision: 'الرؤية',
        introduction: 'قسم المقدمة (أجيال تثق في)',
        map: 'قسم الخريطة',
        partnersGallery: 'الشركاء والمعرض',
        loading: 'جاري التحميل...',
        bottomCTA: 'قسم التسجيل السفلي',
        mapImageLabel: 'صورة الخريطة',
        chairmanImageLabel: 'صورة الرئيس',
        mainImage: 'الصورة الرئيسية',
        gallery: 'معرض الصور',
        addImage: 'إضافة صورة',
        aboutSchool: 'عن المدرسة',
        contactData: 'تفاصيل التواصل',
        website: 'الموقع الإلكتروني',
        rating: 'التقييم',
        studentCount: 'عدد الطلاب',
        foundedYear: 'سنة التأسيس',
        complaints: 'الشكاوى',
        complaintsManage: 'عرض وإدارة الشكاوى المقدمة',
        senderName: 'اسم المرسل',
        phone: 'الهاتف',
        email: 'البريد الإلكتروني',
        school: 'المدرسة',
        messageType: 'نوع الرسالة',
        message: 'الرسالة',
        contactMessages: 'رسائل التواصل',
        contactMessagesManage: 'عرض رسائل نماذج التواصل',
        subject: 'الموضوع',
        recruitmentPortal: 'بوابة التوظيف',
        applicants: 'المتقدمون',
        applicantsManage: 'عرض وإدارة طلبات التوظيف',
        applicationDate: 'تاريخ التقديم',
        cv: 'السيرة الذاتية',
        notes: 'ملاحظات',
        feedback: 'ملاحظات',
        pending: 'قيد الانتظار',
        inprogress: 'قيد المعالجة',
        responded: 'تم الرد',
        interview: 'مقابلة',
        rejected: 'مرفوض',
        hired: 'مقبول',
        onHold: 'قيد الانتظار',
        viewJob: 'عرض الوظيفة',
        backToJobs: 'العودة إلى الوظائف',
        changeStatus: 'تغيير الحالة',
        addNote: 'إضافة ملاحظة',
        downloadCV: 'تحميل السيرة الذاتية',
        close: 'إغلاق',
        print: 'طباعة',
    }
};

export const HERO_IMAGES = [
    '/layer-1-small.webp',
    '/layer-1-small.webp',
    '/layer-1-small.webp',
];
