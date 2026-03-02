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
    title: z.string().min(3, { message: 'Title is too short' }),
    titleAr: z.string().min(3, { message: 'Arabic title is too short' }),
    summary: z.string().min(5, { message: 'Summary is too short' }),
    summaryAr: z.string().min(5, { message: 'Arabic summary is too short' }),
    date: z.string().min(1, { message: 'Date is required' }),
    image: z.string().min(1, { message: 'Image is required' }),
});

export const getDashHeroSchema = () => z.object({
    title: z.string().min(3, { message: 'Title is required' }),
    subtitle: z.string().min(3, { message: 'Subtitle is required' }),
    description: z.string().min(5, { message: 'Description is required' }),
    image: z.string().min(1, { message: 'Image is required' })
});

export const getDashSchoolSchema = () => z.object({
    name: z.string().min(3, { message: 'School name is required' }),
    location: z.string().min(3, { message: 'Location is required' }),
    governorate: z.string().min(1, { message: 'Governorate is required' }),
    principal: z.string().min(3, { message: 'Principal name is required' }),
    type: z.string().min(1, { message: 'Type is required' }),
    mainImage: z.string().min(1, { message: 'Main image is required' }),
});

export const getDashJobSchema = () => z.object({
    title: z.string().min(3, { message: 'Title is required' }),
    titleAr: z.string().min(3, { message: 'Arabic title is required' }),
    department: z.string().min(2, { message: 'Department is required' }),
    departmentAr: z.string().min(2, { message: 'Arabic department is required' }),
    location: z.string().min(2, { message: 'Location is required' }),
    locationAr: z.string().min(2, { message: 'Arabic location is required' }),
    type: z.string().min(1, { message: 'Type is required' }),
    description: z.string().min(10, { message: 'Description is required' }),
    descriptionAr: z.string().min(10, { message: 'Arabic description is required' })
});
