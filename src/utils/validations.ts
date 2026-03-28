import { z } from 'zod';

const phoneRegex = new RegExp(/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/);

export const getContactSchema = (lang: string) => z.object({
    fullName: z.string().min(3, { message: lang === 'ar' ? 'يجب أن يتكون الاسم من 3 أحرف على الأقل' : 'Full name must be at least 3 characters' }),
    email: z.string().email({ message: lang === 'ar' ? 'عنوان البريد الإلكتروني غير صالح' : 'Invalid email address' }),
    subject: z.string().min(3, { message: lang === 'ar' ? 'يجب أن يتكون الموضوع من 3 أحرف على الأقل' : 'Subject must be at least 3 characters' }),
    message: z.string().min(10, { message: lang === 'ar' ? 'يجب أن تتكون الرسالة من 10 أحرف على الأقل' : 'Message must be at least 10 characters' }),
});

export const getComplaintSchema = (lang: string) => z.object({
    fullName: z.string().min(3, { message: lang === 'ar' ? 'يجب أن يتكون الاسم من 3 أحرف على الأقل' : 'Full name must be at least 3 characters' }),
    phone: z.string().regex(phoneRegex, { message: lang === 'ar' ? 'رقم الهاتف غير صالح' : 'Invalid phone number' }),
    email: z.string().email({ message: lang === 'ar' ? 'عنوان البريد الإلكتروني غير صالح' : 'Invalid email address' }),
    messageType: z.string().min(1, { message: lang === 'ar' ? 'الرجاء اختيار نوع الرسالة' : 'Please select message type' }),
    school: z.string().min(1, { message: lang === 'ar' ? 'الرجاء اختيار المدرسة' : 'Please select a school' }),
    message: z.string().min(10, { message: lang === 'ar' ? 'يجب أن تتكون الرسالة من 10 أحرف على الأقل' : 'Message must be at least 10 characters' }),
});

export const getJobApplicationSchema = (lang: string) => z.object({
    fullName: z.string().min(3, { message: lang === 'ar' ? 'يجب أن يتكون الاسم من 3 أحرف على الأقل' : 'Full name must be at least 3 characters' }),
    email: z.string().email({ message: lang === 'ar' ? 'عنوان البريد الإلكتروني غير صالح' : 'Invalid email address' }),
    phone: z.string().regex(phoneRegex, { message: lang === 'ar' ? 'رقم الهاتف غير صالح' : 'Invalid phone number' }),
    job: z.string().optional(),
    experience: z.string().optional(),
    coverLetter: z.string().optional(),
    file: z.any().refine(val => val !== null, { message: lang === 'ar' ? 'الرجاء إرفاق السيرة الذاتية' : 'Please upload your CV' })
});

export const getLoginSchema = (isRTL: boolean) => z.object({
    email: z.string().email({ message: isRTL ? 'البريد الإلكتروني غير صالح' : 'Invalid email address' }),
    password: z.string().min(6, { message: isRTL ? 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل' : 'Password must be at least 6 characters' })
});

export const getDashNewsSchema = () => z.object({
    titleAr: z.string().optional().nullish(),
    summaryAr: z.string().optional().nullish(),
    contentAr: z.string().optional().nullish(),
    title: z.string().optional().nullish(),
    summary: z.string().optional().nullish(),
    content: z.string().optional().nullish(),
    date: z.string().min(1, { message: 'Date is required' }),
    image: z.string().min(1, { message: 'Image is required' }),
    highlightTitle: z.string().optional().nullish(),
    highlightTitleAr: z.string().optional().nullish(),
    highlightContent: z.string().optional().nullish(),
    highlightContentAr: z.string().optional().nullish(),
    featured: z.any().optional(),
    published: z.any().optional(),
}).refine(d => d.title || d.titleAr, { message: 'Title is required in at least one language', path: ['titleAr'] })
    .refine(d => d.summary || d.summaryAr, { message: 'Summary is required in at least one language', path: ['summaryAr'] })
    .refine(d => d.content || d.contentAr, { message: 'Content is required in at least one language', path: ['contentAr'] });

export const getDashHeroSchema = () => z.object({
    title: z.string().optional().nullish(),
    titleAr: z.string().optional().nullish(),
    subtitle: z.string().optional().nullish(),
    subtitleAr: z.string().optional().nullish(),
    description: z.string().optional().nullish(),
    descriptionAr: z.string().optional().nullish(),
    image: z.string().min(1, { message: 'Image is required' })
}).refine(d => d.title || d.titleAr, { message: 'Title is required', path: ['title'] });

export const getDashSchoolSchema = () => z.object({
    name: z.string().optional().nullish(),
    nameAr: z.string().optional().nullish(),
    location: z.string().optional().nullish(),
    locationAr: z.string().optional().nullish(),
    governorate: z.string().min(1, { message: 'Governorate is required' }),
    address: z.string().optional().nullish(),
    addressAr: z.string().optional().nullish(),
    principal: z.string().optional().nullish(),
    principalAr: z.string().optional().nullish(),
    type: z.any().optional(), // Can be string or array
    mainImage: z.string().min(1, { message: 'Main image is required' }),
    logo: z.string().min(1, { message: 'Logo is required' }),
    about: z.string().optional().nullish(),
    aboutAr: z.string().optional().nullish(),
    phone: z.string().min(1, { message: 'Phone is required' }),
    email: z.string().email({ message: 'Valid email is required' }),
    website: z.string().min(1, { message: 'Website is required' }),
    rating: z.string().min(1, { message: 'Rating is required' }),
    studentCount: z.string().min(1, { message: 'Student count is required' }),
    foundedYear: z.string().min(4, { message: 'Founded year is required' }),
    applicationLink: z.string().optional().nullish(),
}).refine(d => d.name || d.nameAr, { message: 'School name is required', path: ['name'] })
    .refine(d => d.location || d.locationAr, { message: 'Location is required', path: ['location'] })
    .refine(d => d.about || d.aboutAr, { message: 'About section is required', path: ['about'] });

export const getAdmissionSchema = (lang: string) => z.object({
    studentName: z.string().min(3, { message: lang === 'ar' ? 'اسم الطالب مطلوب (3 أحرف على الأقل)' : 'Student name must be at least 3 characters' }),
    studentDOB: z.string().min(1, { message: lang === 'ar' ? 'تاريخ الميلاد مطلوب' : 'Date of birth is required' }),
    studentNationalId: z.string().min(5, { message: lang === 'ar' ? 'الرقم القومي مطلوب' : 'National ID is required' }),
    gradeStage: z.string().min(1, { message: lang === 'ar' ? 'المرحلة الدراسية مطلوبة' : 'Grade stage is required' }),
    gradeClass: z.string().min(1, { message: lang === 'ar' ? 'الصف الدراسي مطلوب' : 'Grade class is required' }),
    parentName: z.string().min(3, { message: lang === 'ar' ? 'اسم ولي الأمر مطلوب' : 'Parent name must be at least 3 characters' }),
    parentPhone: z.string().regex(phoneRegex, { message: lang === 'ar' ? 'رقم الهاتف غير صالح' : 'Invalid phone number' }),
    parentEmail: z.string().email({ message: lang === 'ar' ? 'البريد الإلكتروني غير صالح' : 'Invalid email address' }),
    preferences: z.array(z.any()).min(1, { message: lang === 'ar' ? 'يجب اختيار مدرسة واحدة على الأقل' : 'Please select at least one school' }),
    notes: z.string().optional(),
});

export const getDashJobSchema = () => z.object({
    title: z.string().optional().nullish(),
    titleAr: z.string().optional().nullish(),
    department: z.string().optional().nullish(),
    departmentAr: z.string().optional().nullish(),
    location: z.string().optional().nullish(),
    locationAr: z.string().optional().nullish(),
    type: z.string().min(1, { message: 'Type is required' }),
    description: z.string().optional().nullish(),
    descriptionAr: z.string().optional().nullish(),
    image: z.string().min(1, { message: 'Image is required' }).optional()
}).refine(d => d.title || d.titleAr, { message: 'Title is required', path: ['title'] })
    .refine(d => d.description || d.descriptionAr, { message: 'Description is required', path: ['description'] });
