
import { School, NewsItem, JobVacancy } from '@/types';

export const SCHOOLS: School[] = [
  { id: '1', name: 'Port Said School', nameAr: 'مدرسة بورسعيد', location: 'Zamalek', locationAr: 'الزمالك', governorate: 'Cairo', governorateAr: 'القاهرة', principal: 'Dr. Ahmed Ali', logo: 'https://picsum.photos/seed/school1/100/100', type: 'Language' },
  { id: '2', name: 'Nasr School for Girls', nameAr: 'مدرسة النصر للبنات', location: 'Maadi', locationAr: 'المعادي', governorate: 'Cairo', governorateAr: 'القاهرة', principal: 'Mrs. Fatma Hassan', logo: 'https://picsum.photos/seed/school2/100/100', type: 'International' },
  { id: '3', name: 'Victoria College', nameAr: 'كلية فيكتوريا', location: 'Victoria', locationAr: 'فيكتوريا', governorate: 'Alexandria', governorateAr: 'الإسكندرية', principal: 'Mr. John Smith', logo: 'https://picsum.photos/seed/school3/100/100', type: 'National' },
  { id: '4', name: 'El Nasr Boys School', nameAr: 'مدرسة النصر للبنين', location: 'Shatby', locationAr: 'الشاطبي', governorate: 'Alexandria', governorateAr: 'الإسكندرية', principal: 'Dr. Magdy Yacoub', logo: 'https://picsum.photos/seed/school4/100/100', type: 'Language' },
  { id: '5', name: 'Language Schools of Mansoura', nameAr: 'مدارس اللغات بالمنصورة', location: 'Dakahlia', locationAr: 'الدقهلية', governorate: 'Dakahlia', governorateAr: 'الدقهلية', principal: 'Dr. Mona Zaki', logo: 'https://picsum.photos/seed/school5/100/100', type: 'Language' },
  { id: '6', name: 'Bakalos School', nameAr: 'مدرسة باكالوس', location: 'Giza', locationAr: 'الجيزة', governorate: 'Giza', governorateAr: 'الجيزة', principal: 'Mr. Tarek Shawky', logo: 'https://picsum.photos/seed/school6/100/100', type: 'National' },
  { id: '7', name: 'El Nasr Language School', nameAr: 'مدرسة النصر للغات', location: 'Heliopolis', locationAr: 'مصر الجديدة', governorate: 'Cairo', governorateAr: 'القاهرة', principal: 'Ms. Laila Ahmed', logo: 'https://picsum.photos/seed/school7/100/100', type: 'Language' },
  { id: '8', name: 'Misr Language School', nameAr: 'مدرسة مصر للغات', location: 'Pyramids', locationAr: 'الأهرام', governorate: 'Giza', governorateAr: 'الجيزة', principal: 'Dr. Ibrahim Kamel', logo: 'https://picsum.photos/seed/school8/100/100', type: 'International' },
  { id: '9', name: 'Suez Canal School', nameAr: 'مدرسة قناة السويس', location: 'Maadi', locationAr: 'المعادي', governorate: 'Cairo', governorateAr: 'القاهرة', principal: 'Mrs. Sanaa Mansour', logo: 'https://picsum.photos/seed/school9/100/100', type: 'Language' },
  { id: '10', name: 'Modern Education School', nameAr: 'مدرسة التربية الحديثة', location: 'New Cairo', locationAr: 'القاهرة الجديدة', governorate: 'Cairo', governorateAr: 'القاهرة', principal: 'Mr. Khaled El-Nabawy', logo: 'https://picsum.photos/seed/school10/100/100', type: 'International' },
  { id: '11', name: 'Tanta Language School', nameAr: 'مدرسة طنطا للغات', location: 'Tanta', locationAr: 'طنطا', governorate: 'Gharbia', governorateAr: 'الغربية', principal: 'Ms. Nadia Lotfy', logo: 'https://picsum.photos/seed/school11/100/100', type: 'Language' },
  { id: '12', name: 'Mansoura Victoria School', nameAr: 'مدرسة فيكتوريا بالمنصورة', location: 'Mansoura', locationAr: 'المنصورة', governorate: 'Dakahlia', governorateAr: 'الدقهلية', principal: 'Mr. Ahmed Helmy', logo: 'https://picsum.photos/seed/school12/100/100', type: 'National' },
  { id: '13', name: 'Alexandria International School', nameAr: 'مدرسة الإسكندرية الدولية', location: 'Montaza', locationAr: 'المنتزه', governorate: 'Alexandria', governorateAr: 'الإسكندرية', principal: 'Dr. Sarah Jenkins', logo: 'https://picsum.photos/seed/school13/100/100', type: 'International' },
  { id: '14', name: 'Giza National School', nameAr: 'مدرسة الجيزة القومية', location: 'Dokki', locationAr: 'الدقي', governorate: 'Giza', governorateAr: 'الجيزة', principal: 'Mr. Mahmoud Yassin', logo: 'https://picsum.photos/seed/school14/100/100', type: 'National' },
  { id: '15', name: 'Zamalek Language School', nameAr: 'مدرسة الزمالك للغات', location: 'Zamalek', locationAr: 'الزمالك', governorate: 'Cairo', governorateAr: 'القاهرة', principal: 'Ms. Yousra', logo: 'https://picsum.photos/seed/school15/100/100', type: 'Language' },
  { id: '16', name: 'Agouza National School', nameAr: 'مدرسة العجوزة القومية', location: 'Agouza', locationAr: 'العجوزة', governorate: 'Giza', governorateAr: 'الجيزة', principal: 'Mr. Adel Imam', logo: 'https://picsum.photos/seed/school16/100/100', type: 'National' },
  { id: '17', name: 'Nasr City Language School', nameAr: 'مدرسة مدينة نصر للغات', location: 'Nasr City', locationAr: 'مدينة نصر', governorate: 'Cairo', governorateAr: 'القاهرة', principal: 'Dr. Mona El-Shazly', logo: 'https://picsum.photos/seed/school17/100/100', type: 'Language' },
  { id: '18', name: 'Maadi British School', nameAr: 'المدرسة البريطانية بالمعادي', location: 'Maadi', locationAr: 'المعادي', governorate: 'Cairo', governorateAr: 'القاهرة', principal: 'Mr. David Miller', logo: 'https://picsum.photos/seed/school18/100/100', type: 'International' },
  { id: '19', name: 'Shubra National School', nameAr: 'مدرسة شبرا القومية', location: 'Shubra', locationAr: 'شبرا', governorate: 'Cairo', governorateAr: 'القاهرة', principal: 'Ms. Karima Mokhtar', logo: 'https://picsum.photos/seed/school19/100/100', type: 'National' },
  { id: '20', name: 'Heliopolis International', nameAr: 'مدرسة مصر الجديدة الدولية', location: 'Heliopolis', locationAr: 'مصر الجديدة', governorate: 'Cairo', governorateAr: 'القاهرة', principal: 'Dr. Amr Adeeb', logo: 'https://picsum.photos/seed/school20/100/100', type: 'International' },
  { id: '21', name: 'El Mansoura Boys', nameAr: 'مدرسة المنصورة للبنين', location: 'Talkha', locationAr: 'طلخا', governorate: 'Dakahlia', governorateAr: 'الدقهلية', principal: 'Mr. Mohamed Sobhi', logo: 'https://picsum.photos/seed/school21/100/100', type: 'Language' },
  { id: '22', name: 'Alexandria Girls College', nameAr: 'كلية الإسكندرية للبنات', location: 'Saba Pasha', locationAr: 'سابا باشا', governorate: 'Alexandria', governorateAr: 'الإسكندرية', principal: 'Ms. Hend Rostom', logo: 'https://picsum.photos/seed/school22/100/100', type: 'National' },
  { id: '23', name: 'Tanta American School', nameAr: 'مدرسة طنطا الأمريكية', location: 'Tanta', locationAr: 'طنطا', governorate: 'Gharbia', governorateAr: 'الغربية', principal: 'Mr. Robert Wilson', logo: 'https://picsum.photos/seed/school23/100/100', type: 'International' },
  { id: '24', name: 'Giza Language Academy', nameAr: 'أكاديمية الجيزة للغات', location: 'Mohandessin', locationAr: 'المهندسين', governorate: 'Giza', governorateAr: 'الجيزة', principal: 'Ms. Ghada Abdel Razek', logo: 'https://picsum.photos/seed/school24/100/100', type: 'Language' },
  { id: '25', name: 'Sheraton National School', nameAr: 'مدرسة شيراتون القومية', location: 'Sheraton', locationAr: 'شيراتون', governorate: 'Cairo', governorateAr: 'القاهرة', principal: 'Mr. Ahmed Mekky', logo: 'https://picsum.photos/seed/school25/100/100', type: 'National' },
];

export const GOVERNORATES = [
  { name: 'Cairo', nameAr: 'القاهرة', count: 12, coords: 'M 150 150 Q 160 140 170 150' },
  { name: 'Alexandria', nameAr: 'الإسكندرية', count: 4, coords: 'M 50 50 Q 60 40 70 50' },
  { name: 'Giza', nameAr: 'الجيزة', count: 6, coords: 'M 140 160 Q 150 170 160 160' },
  { name: 'Dakahlia', nameAr: 'الدقهلية', count: 3, coords: 'M 180 100 Q 190 90 200 100' },
  { name: 'Gharbia', nameAr: 'الغربية', count: 2, coords: 'M 150 80 Q 160 70 170 80' },
];

export const NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'NIS National Sports Day 2024',
    titleAr: 'اليوم الرياضي للمعاهد القومية ٢٠٢٤',
    date: '2024-03-15',
    summary: 'Over 5,000 students participated in our multi-governorate sports festival held at the Olympic Center.',
    summaryAr: 'شارك أكثر من ٥٠٠٠ طالب في مهرجاننا الرياضي الذي أقيم في المركز الأوليمبي.',
    image: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '2',
    title: 'New Science Labs in Alexandria',
    titleAr: 'مختبرات علوم جديدة في الإسكندرية',
    date: '2024-03-12',
    summary: 'Victoria College inaugurates state-of-the-art STEM laboratories to enhance practical learning.',
    summaryAr: 'كلية فيكتوريا تفتتح مختبرات STEM الحديثة لتعزيز التعلم العملي.',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '3',
    title: 'Arabic Calligraphy Competition',
    titleAr: 'مسابقة الخط العربي',
    date: '2024-03-10',
    summary: 'Celebrating our rich heritage through the annual NIS calligraphy championship for middle schoolers.',
    summaryAr: 'الاحتفال بتراثنا الغني من خلال بطولة الخط السنوية لطلاب المرحلة الإعدادية.',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '4',
    title: 'Teacher Excellence Awards',
    titleAr: 'جوائز التميز للمعلمين',
    date: '2024-03-08',
    summary: 'Recognizing the dedication of our 8,500+ educators at the annual NIS Cairo summit.',
    summaryAr: 'تكريم جهود أكثر من ٨٥٠٠ معلم في قمة المعاهد القومية السنوية بالقاهرة.',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '5',
    title: 'Robotics Team Wins Bronze',
    titleAr: 'فريق الروبوتات يحصد البرونزية',
    date: '2024-03-05',
    summary: 'The Giza National School robotics team secured 3rd place in the international FIRST LEGO League.',
    summaryAr: 'حقق فريق الروبوتات بمدرسة الجيزة القومية المركز الثالث في مسابقة FIRST LEGO League الدولية.',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '6',
    title: 'Summer Camps Enrollment Open',
    titleAr: 'فتح باب التسجيل في المعسكرات الصيفية',
    date: '2024-03-01',
    summary: 'Diverse summer programs ranging from coding to art are now available across all NIS campuses.',
    summaryAr: 'برامج صيفية متنوعة تتراوح من البرمجة إلى الفنون متاحة الآن في جميع فروعنا.',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '7',
    title: 'IGCSE Top Achievers Ceremony',
    titleAr: 'حفل تكريم أوائل الـ IGCSE',
    date: '2024-02-25',
    summary: 'Honoring our students who achieved world-highest scores in the Cambridge IGCSE examinations.',
    summaryAr: 'تكريم طلابنا الذين حققوا أعلى الدرجات العالمية في امتحانات كامبريدج IGCSE.',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '8',
    title: 'Sustainable Campus Initiative',
    titleAr: 'مبادرة الحرم المدرسي المستدام',
    date: '2024-02-20',
    summary: 'NIS Mansoura launches the first solar-powered primary school section in the Delta region.',
    summaryAr: 'المعاهد القومية بالمنصورة تطلق أول قسم ابتدائي يعمل بالطاقة الشمسية في منطقة الدلتا.',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '9',
    title: 'Chess Tournament Finals',
    titleAr: 'نهائيات بطولة الشطرنج',
    date: '2024-02-15',
    summary: 'The final showdown of the inter-school chess championship takes place in Maadi this weekend.',
    summaryAr: 'المواجهة النهائية لبطولة الشطرنج بين المدارس تقام في المعادي هذا الأسبوع.',
    image: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '10',
    title: 'Community Service Week',
    titleAr: 'أسبوع الخدمة المجتمعية',
    date: '2024-02-10',
    summary: 'Students from 40+ schools joined forces to plant 10,000 trees across 5 governorates.',
    summaryAr: 'تعاون طلاب من أكثر من ٤٠ مدرسة لزراعة ١٠,٠٠٠ شجرة في ٥ محافظات.',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '11',
    title: 'Digital Transformation Phase 2',
    titleAr: 'المرحلة الثانية من التحول الرقمي',
    date: '2024-02-05',
    summary: 'All NIS classrooms are now equipped with interactive smart boards and high-speed fiber optics.',
    summaryAr: 'تم تجهيز جميع فصولنا بسبورات ذكية تفاعلية وألياف ضوئية عالية السرعة.',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '12',
    title: 'Music and Arts Festival',
    titleAr: 'مهرجان الموسيقى والفنون',
    date: '2024-02-01',
    summary: 'A showcase of Egyptian talent at the Cairo Opera House featuring our NIS symphony orchestra.',
    summaryAr: 'عرض للمواهب المصرية في دار الأوبرا المصرية يضم أوركسترا السيمفوني للمعاهد القومية.',
    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=800&q=80'
  },
];

export const JOBS: JobVacancy[] = [
  { id: '1', title: 'Mathematics Teacher (IGCSE)', titleAr: 'مدرس رياضيات (IGCSE)', department: 'Academic', departmentAr: 'أكاديمي', location: 'Zamalek, Cairo', locationAr: 'الزمالك، القاهرة', type: 'Full-time', typeAr: 'دوام كامل', description: 'Seeking an experienced math teacher for our international section.', descriptionAr: 'مطلوب مدرس رياضيات ذو خبرة للقسم الدولي.' },
  { id: '2', title: 'School Counselor', titleAr: 'مرشد طلابي', department: 'Student Services', departmentAr: 'خدمات الطلاب', location: 'Victoria, Alexandria', locationAr: 'فيكتوريا، الإسكندرية', type: 'Full-time', typeAr: 'دوام كامل', description: 'Experienced counselor to support student mental health and academic guidance.', descriptionAr: 'مرشد ذو خبرة لدعم الصحة النفسية للطلاب والإرشاد الأكاديمي.' },
  { id: '3', title: 'Administrative Assistant', titleAr: 'مساعد إداري', department: 'Admin', departmentAr: 'إدارة', location: 'Maadi, Cairo', locationAr: 'المعادي، القاهرة', type: 'Part-time', typeAr: 'دوام جزئي', description: 'Assisting the principal office with daily administrative tasks.', descriptionAr: 'مساعدة مكتب المدير في المهام الإدارية اليومية.' },
  { id: '4', title: 'Physical Education Coach', titleAr: 'مدرب تربية رياضية', department: 'Sports', departmentAr: 'أنشطة رياضية', location: 'Tanta, Gharbia', locationAr: 'طنطا، الغربية', type: 'Full-time', typeAr: 'دوام كامل', description: 'Lead sports programs and manage inter-school athletic competitions.', descriptionAr: 'قيادة البرامج الرياضية وإدارة المسابقات الرياضية بين المدارس.' },
  { id: '5', title: 'English Literature Specialist', titleAr: 'أخصائي أدب إنجليزي', department: 'Academic', departmentAr: 'أكاديمي', location: 'Nasr City, Cairo', locationAr: 'مدينة نصر، القاهرة', type: 'Full-time', typeAr: 'دوام كامل', description: 'Advanced literature instruction for secondary levels.', descriptionAr: 'تعليم متقدم للأدب للمراحل الثانوية.' },
];
