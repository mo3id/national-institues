export type Section = 'overview' | 'news' | 'schools' | 'departments' | 'jobs' | 'recruitment' | 'hero' | 'chairman' | 'institute' | 'home' | 'forms' | 'contact' | 'complaints' | 'contactMessages' | 'heroBackgrounds' | 'governorates' | 'admissions' | 'modifications' | 'alumni' | 'settings';
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
    type: string | string[];
    mainImage?: string;
    mainimage?:string;
    gallery?: string[];
    // New fields
    about?: string;
    aboutAr?: string;
    phone?: string;
    email?: string;
    website?: string;
    rating?: string;
    studentCount?: string;
    teachersCount?: string;
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

export interface DashAdmission {
    id: string;
    studentName: string;
    studentDOB: string;
    studentNationalId: string;
    gradeStage: string;
    gradeClass: string;
    parentName: string;
    parentPhone: string;
    parentEmail: string;
    preferences: { schoolId: string; schoolName: string; schoolNameAr: string }[];
    documents?: { name: string; fileName: string; path: string }[];
    notes?: string;
    status: 'Pending' | 'Under Review' | 'Accepted' | 'Waitlist' | 'Rejected';
    acceptedSchool?: string;
    adminNotes?: string;
    createdAt: string;
}

export interface DashAlumni {
    id: string;
    name: string;
    nameAr: string;
    image: string;
    school: string;
    schoolAr: string;
    graduationYear: string;
    degree: string;
    degreeAr: string;
    jobTitle: string;
    jobTitleAr: string;
    company: string;
    companyAr: string;
    testimonial?: string;
    testimonialAr?: string;
    linkedin?: string;
    twitter?: string;
    featured?: boolean;
}

export interface HeroSlide {
    id: number;
    title: string;
    titleAr?: string;
    subtitle: string;
    subtitleAr?: string;
    description: string;
    descriptionAr?: string;
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
    storyImage?: string;
    schoolCount?: string;
    schoolCountAr?: string;
    schoolCountLabel?: string;
    schoolCountLabelAr?: string;
    foundationYear?: number;
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
        storyImage: 'Story Image',
        schoolCount: 'School Count',
        complaint: 'Complaint',
        suggestion: 'Suggestion',
        inquiry: 'Inquiry',
        thanks: 'Thanks',
        deleteConfirm: 'Are you sure you want to delete this {type}? This cannot be undone.',
        deleteSuccess: '{type} deleted successfully',
        firstPage: 'First Page',
        lastPage: 'Last Page',
        page: 'Page',
        enterDeptBoth: 'Please enter department name in both languages',
        deptAdded: 'Department added',
        cantDeleteDept: 'Cannot delete department as it contains active jobs.',
        deletedSuccess: 'Deleted successfully',
        enterGovBoth: 'Please enter governorate name in both languages',
        govAdded: 'Governorate added',
        errAddingGov: 'Error adding governorate',
        cantDeleteGov: 'Cannot delete governorate as it contains schools',
        errDeletingGov: 'Error deleting governorate',
        deleteFailed: 'Delete failed',
        messageDeleted: 'Message deleted',
        confirmDeleteMessage: 'Are you sure you want to delete this message? This cannot be undone.',
        governorates: 'Governorates',
        jobDepartments: 'Job Departments',
        saveFailed: 'Save failed: {message}',
        invalidEmail: 'Invalid email format',
        invalidFacebook: 'Invalid Facebook URL',
        invalidTwitter: 'Invalid Twitter URL',
        invalidInstagram: 'Invalid Instagram URL',
        invalidLinkedIn: 'Invalid LinkedIn URL',
        superAdmin: 'Super Admin',
        totalTeachers: 'Total Teachers',
        enterBoth: 'Please enter both languages',
        actionSuccess: 'Action completed successfully',
        actionFailed: 'Action failed',
        thisYear: 'This year',
        featured: 'Featured',
        newDept: 'New Department',
        newGov: 'New Governorate',
        governoratesTitle: 'Governorates',
        jobDepartmentsTitle: 'Job Departments',
        nameEn: 'Name (EN)',
        nameAr: 'Name (AR)',
        all: 'All',
        appliedJob: 'Applied Job',
        failedToLoadApp: 'Failed to load application',
        preparingPreview: 'Preparing preview...',
        statusUpdated: 'Status updated successfully',
        updateFailed: 'Update failed',
        applicant: 'Applicant',
        storyTitleLabel: 'Story Title',
        storyDescLabel: 'Story Description',
        missionTitleLabel: 'Mission Title',
        missionDescLabel: 'Mission Description',
        visionTitleLabel: 'Vision Title',
        visionDescLabel: 'Vision Description',
        addJobTitle: 'Add New Vacancy',
        addSchoolTitle: 'Add New School',
        editJobTitle: 'Edit Vacancy',
        requestDetails: 'Request Details',
        adminResponse: 'Admin Response',
        writeResponse: 'Write response here...',
        updatedSuccess: 'Updated successfully',
        messageDetails: 'Message Details',
        confirmDeletion: 'Confirm Deletion',
        foundationYear: 'Foundation Year',
        exampleYear: 'e.g., 1985',
        foundationYearDesc: 'Used to calculate "Years of Service" in stats section',
        titleArLabel: 'Title (AR)',
        highlightArLabel: 'Highlight (AR)',
        descArLabel: 'Description (AR)',
        ctaTextEn: 'CTA Text (EN)',
        ctaTextAr: 'CTA Text (AR)',
        schoolCountLabelEn: 'School Count Label (EN)',
        schoolCountLabelAr: 'School Count Label (AR)',
        mapImage: 'Map Image',
        addressEn: 'Address (EN)',
        addressAr: 'Address (AR)',
        phoneAr: 'Phone (AR)',
        emailAr: 'Email (AR)',
        websiteAr: 'Website (AR)',
        socialLinks: 'Social Links',
        galleryMosaic: 'Gallery Mosaic Images',
        partner: 'Partner',
        partners: 'Partners',
        galleryImages: 'Gallery Images',
        highlightEnLabel: 'Highlight (EN)',
        descriptionEnLabel: 'Description (EN)',
        gatewayTitleEnLabel: 'Gateway Title (EN)',
        gatewayHighlightEnLabel: 'Gateway Highlight (EN)',
        gatewayDescEnLabel: 'Gateway Description (EN)',
        contactForm: 'Contact Form',
        careersForm: 'Careers Form',
        basicInfo: 'Basic Info',
        addressLabel: 'Address',
        workingHoursLabel: 'Working Days & Hours',
        fromToDay: 'From - To Day',
        fromToTime: 'From - To Time',
        socialMedia: 'Social Media',
        footerTexts: 'Footer Texts',
        allTypes: 'All Types',
        requestId: 'Request ID',
        admissions: 'School Admissions',
        admissionsManage: 'View and manage school admission applications',
        modifications: 'Modification Requests',
        modificationsManage: 'Review and approve student preference modification requests',
        admissionSettings: 'Admission Settings',
        admissionSettingsManage: 'Configure the admission form and required documents',
        studentName: 'Student Name',
        studentDOB: 'Date of Birth',
        studentNationalId: 'National ID',
        gradeStage: 'Grade Stage',
        gradeClass: 'Grade Class',
        parentName: 'Parent Name',
        parentPhone: 'Parent Phone',
        parentEmail: 'Parent Email',
        preferences: 'School Preferences',
        documents: 'Documents',
        adminNotes: 'Admin Notes',
        acceptedSchool: 'Accepted at School',
        underReview: 'Under Review',
        accepted: 'Accepted',
        waitlist: 'Waitlist',
        isOpen: 'Registration Open',
        requiredDocuments: 'Required Documents',
        gradeStages: 'Grade Stages',
        gradeClasses: 'Grade Classes',
        addDocument: 'Add Document',
        addStage: 'Add Stage',
        addClass: 'Add Class',
        maxPreferences: 'Max Preferences (0 = unlimited)',
        formTitleEn: 'Form Title (EN)',
        formTitleAr: 'Form Title (AR)',
        formDescEn: 'Form Description (EN)',
        formDescAr: 'Form Description (AR)',
        admissionSaved: 'Admission settings saved',
        admissionUpdated: 'Admission updated successfully',
        admissionDeleted: 'Admission deleted',
        viewDocuments: 'View Documents',
        noDocuments: 'No documents uploaded',
        admissionId: 'Admission ID',
        alumni: 'Alumni',
        alumniManage: 'Browse and edit alumni profiles',
        addAlumni: 'Add Alumni',
        editAlumni: 'Edit Alumni',
        alumniSaved: 'Alumni saved successfully',
        alumniDeleted: 'Alumni deleted',
        alumniAdded: 'New alumni added!',
        graduationYear: 'Graduation Year',
        degree: 'Degree',
        jobTitle: 'Job Title',
        company: 'Company',
        testimonial: 'Testimonial',
        linkedin: 'LinkedIn URL',
        twitter: 'Twitter/X URL',
        alumniImage: 'Alumni Photo',
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
        storyImage: 'صورة القصة',
        schoolCount: 'عدد المدارس',
        complaint: 'شكوى',
        suggestion: 'اقتراح',
        inquiry: 'استفسار',
        thanks: 'شكر',
        deleteConfirm: 'هل أنت متأكد من حذف {type}؟ لا يمكن التراجع عن هذا الإجراء.',
        deleteSuccess: 'تم حذف {type} بنجاح',
        firstPage: 'البداية',
        lastPage: 'النهاية',
        page: 'صفحة',
        enterDeptBoth: 'الرجاء إدخال اسم القسم باللغتين',
        deptAdded: 'تم إضافة القسم',
        cantDeleteDept: 'لا يمكن حذف القسم لأنه يحتوي على وظائف مسجلة.',
        deletedSuccess: 'تم الحذف بنجاح',
        enterGovBoth: 'الرجاء إدخال اسم المحافظة باللغتين',
        govAdded: 'تم إضافة المحافظة',
        errAddingGov: 'حدث خطأ أثناء الإضافة',
        cantDeleteGov: 'لا يمكن حذف المحافظة لوجود مدارس مرتبطة بها',
        errDeletingGov: 'حدث خطأ أثناء الحذف',
        deleteFailed: 'فشل الحذف',
        messageDeleted: 'تم حذف الرسالة',
        confirmDeleteMessage: 'هل أنت متأكد من حذف هذه الرسالة؟ لا يمكن التراجع عن هذا الإجراء.',
        governorates: 'المحافظات',
        jobDepartments: 'أقسام الوظائف',
        saveFailed: 'فشل الحفظ: {message}',
        invalidEmail: 'تنسيق البريد الإلكتروني غير صالح',
        invalidFacebook: 'رابط فيسبوك غير صالح',
        invalidTwitter: 'رابط تويتر غير صالح',
        invalidInstagram: 'رابط انستجرام غير صالح',
        invalidLinkedIn: 'رابط لينكد إن غير صالح',
        superAdmin: 'مسؤول النظام',
        totalTeachers: 'إجمالي المعلمين',
        enterBoth: 'الرجاء إدخال اللغتين',
        actionSuccess: 'تمت العملية بنجاح',
        actionFailed: 'فشلت العملية',
        thisYear: 'هذا العام',
        featured: 'المميز',
        newDept: 'بناء قسم جديد',
        newGov: 'إضافة محافظة جديدة',
        governoratesTitle: 'المحافظات',
        jobDepartmentsTitle: 'أقسام الوظائف',
        nameEn: 'الاسم (EN)',
        nameAr: 'الاسم (AR)',
        all: 'الكل',
        appliedJob: 'الوظيفة المتقدم لها',
        failedToLoadApp: 'فشل تحميل الطلب',
        preparingPreview: 'جاري تجهيز المعاينة...',
        statusUpdated: 'تم تحديث الحالة بنجاح',
        updateFailed: 'فشل التحديث',
        applicant: 'متقدم',
        storyTitleLabel: 'عنوان القصة',
        storyDescLabel: 'وصف القصة',
        missionTitleLabel: 'عنوان الرسالة',
        missionDescLabel: 'وصف الرسالة',
        visionTitleLabel: 'عنوان الرؤية',
        visionDescLabel: 'وصف الرؤية',
        addJobTitle: 'إضافة وظيفة جديدة',
        addSchoolTitle: 'إضافة مدرسة جديدة',
        editJobTitle: 'تعديل الوظيفة',
        requestDetails: 'تفاصيل الطلب',
        adminResponse: 'رد الإدارة',
        writeResponse: 'اكتب الرد هنا...',
        updatedSuccess: 'تم التحديث بنجاح',
        messageDetails: 'تفاصيل الرسالة',
        confirmDeletion: 'تأكيد الحذف',
        foundationYear: 'سنة التأسيس',
        exampleYear: 'مثال: 1985',
        foundationYearDesc: 'يستخدم لحساب "أعوام من العطاء" في قسم الإحصائيات',
        titleArLabel: 'العنوان (عربي)',
        highlightArLabel: 'التظليل (عربي)',
        descArLabel: 'الوصف (عربي)',
        ctaTextEn: 'نص الزر (EN)',
        ctaTextAr: 'نص الزر (AR)',
        schoolCountLabelEn: 'تسمية عدد المدارس (EN)',
        schoolCountLabelAr: 'تسمية عدد المدارس (AR)',
        mapImage: 'صورة الخريطة',
        addressEn: 'العنوان (EN)',
        addressAr: 'العنوان (عربي)',
        phoneAr: 'الهاتف (عربي)',
        emailAr: 'البريد الإلكتروني (عربي)',
        websiteAr: 'الموقع الإلكتروني (عربي)',
        socialLinks: 'روابط التواصل الاجتماعي',
        galleryMosaic: 'صور معرض الفسيفساء',
        partner: 'شريك',
        partners: 'شركاء',
        galleryImages: 'صور المعرض',
        highlightEnLabel: 'التظليل (EN)',
        descriptionEnLabel: 'الوصف (EN)',
        gatewayTitleEnLabel: 'عنوان البوابة (EN)',
        gatewayHighlightEnLabel: 'تظليل البوابة (EN)',
        gatewayDescEnLabel: 'وصف البوابة (EN)',
        contactForm: 'نموذج التواصل',
        careersForm: 'نموذج الوظائف',
        basicInfo: 'معلومات أساسية',
        addressLabel: 'العنوان',
        workingHoursLabel: 'أيام وساعات العمل',
        fromToDay: 'من يوم - إلى يوم',
        fromToTime: 'من ساعة - إلى ساعة',
        socialMedia: 'التواصل الاجتماعي',
        footerTexts: 'نصوص الفوتر',
        allTypes: 'جميع الأنواع',
        requestId: 'رقم الطلب',
        admissions: 'طلبات الالتحاق',
        admissionsManage: 'عرض وإدارة طلبات الالتحاق بالمدارس',
        modifications: 'طلبات تعديل الرغبات',
        modificationsManage: 'مراجعة واعتماد طلبات تعديل رغبات المدارس',
        admissionSettings: 'إعدادات التقديم',
        admissionSettingsManage: 'تكوين نموذج التقديم والمستندات المطلوبة',
        studentName: 'اسم الطالب',
        studentDOB: 'تاريخ الميلاد',
        studentNationalId: 'الرقم القومي',
        gradeStage: 'المرحلة الدراسية',
        gradeClass: 'الصف الدراسي',
        parentName: 'اسم ولي الأمر',
        parentPhone: 'هاتف ولي الأمر',
        parentEmail: 'بريد ولي الأمر',
        preferences: 'الرغبات (المدارس)',
        documents: 'المستندات',
        adminNotes: 'ملاحظات الإدارة',
        acceptedSchool: 'مقبول في مدرسة',
        underReview: 'قيد المراجعة',
        accepted: 'مقبول',
        waitlist: 'قائمة الانتظار',
        isOpen: 'التسجيل مفتوح',
        requiredDocuments: 'المستندات المطلوبة',
        gradeStages: 'المراحل الدراسية',
        gradeClasses: 'الصفوف الدراسية',
        addDocument: 'إضافة مستند',
        addStage: 'إضافة مرحلة',
        addClass: 'إضافة صف',
        maxPreferences: 'أقصى رغبات (0 = غير محدود)',
        formTitleEn: 'عنوان النموذج (EN)',
        formTitleAr: 'عنوان النموذج (AR)',
        formDescEn: 'وصف النموذج (EN)',
        formDescAr: 'وصف النموذج (AR)',
        admissionSaved: 'تم حفظ إعدادات التقديم',
        admissionUpdated: 'تم تحديث الطلب بنجاح',
        admissionDeleted: 'تم حذف الطلب',
        viewDocuments: 'عرض المستندات',
        noDocuments: 'لم يتم رفع مستندات',
        admissionId: 'رقم الطلب',
        heroBackgrounds: 'خلفيات الهيرو',
        heroBackgroundsManage: 'تخصيص خلفيات قسم الهيرو لكل صفحة',
        pageHeroSettings: 'إعدادات هيرو الصفحات',
        backgroundType: 'نوع الخلفية',
        backgroundColor: 'لون الخلفية',
        backgroundImage: 'صورة الخلفية',
        colorMode: 'لون ثابت',
        imageMode: 'صورة',
        alumni: 'الخريجون',
        alumniManage: 'استعراض وتعديل بيانات الخريجين',
        addAlumni: 'إضافة خريج',
        editAlumni: 'تعديل بيانات خريج',
        alumniSaved: 'تم حفظ بيانات الخريج بنجاح',
        alumniDeleted: 'تم حذف الخريج',
        alumniAdded: 'تمت إضافة خريج جديد!',
        graduationYear: 'سنة التخرج',
        degree: 'المؤهل',
        jobTitle: 'المسمى الوظيفي',
        company: 'الشركة',
        testimonial: 'شهادة / كلمة',
        linkedin: 'رابط لينكدإن',
        twitter: 'رابط تويتر/X',
        alumniImage: 'صورة الخريج',
    }
};

export interface PageHeroSettings {
    backgroundType: 'color' | 'image';
    backgroundColor?: string;
    backgroundImage?: string;
}

export interface PagesHeroSettings {
    about: PageHeroSettings;
    schools: PageHeroSettings;
    news: PageHeroSettings;
    jobs: PageHeroSettings;
    complaints: PageHeroSettings;
    contact: PageHeroSettings;
}

export const HERO_IMAGES = [
    '/layer-1-small.webp',
    '/layer-1-small.webp',
    '/layer-1-small.webp',
];
