import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { SCHOOLS } from '../constants';
import { ArrowLeft, MapPin, Phone, Mail, Globe } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const SchoolProfile: React.FC = () => {
  const { id } = useParams();
  const { isRTL, t } = useLanguage();
  const school = SCHOOLS.find(s => s.id === id);

  if (!school) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <p className="text-gray-600">School not found</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-72 md:h-96 bg-cover bg-center" style={{backgroundImage: `url(https://picsum.photos/seed/cover${school.id}/1600/400)`}}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 h-full flex items-end pb-6">
          <div className="flex items-center gap-6">
            <div className="w-32 h-32 bg-white rounded-lg p-3 shadow-lg overflow-hidden">
              <img src={school.logo} alt={school.name} className="w-full h-full object-cover" />
            </div>
            <div className="text-white">
              <h1 className="text-3xl font-black">{school.name}</h1>
              <p className="text-sm opacity-90">{school.governorate} • {school.location}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-6 relative z-10 pt-5 md:pt-8 lg:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h3 className="font-bold text-lg md:text-xl mb-4">{t?.schools?.title ?? 'School Details'}</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-900 mt-1" />
                <div>
                  <p className="text-xs text-gray-400">العنوان</p>
                  <p className="font-bold">شارع التعليم، الحي الأول</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-blue-900 mt-1" />
                <div>
                  <p className="text-xs text-gray-400">الهاتف</p>
                  <p className="font-bold">02-12345678</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-900 mt-1" />
                <div>
                  <p className="text-xs text-gray-400">البريد الإلكتروني</p>
                  <p className="font-bold">info@school{school.id}.edu.eg</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Globe className="w-5 h-5 text-blue-900 mt-1" />
                <div>
                  <p className="text-xs text-gray-400">الموقع الإلكتروني</p>
                  <p className="font-bold text-blue-700">www.school-website.com</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Link to="/schools" className="text-sm text-gray-600 inline-flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                العودة للقائمة
              </Link>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="font-bold text-lg md:text-xl mb-4">عن المدرسة</h3>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">هذه فقرة تجريبية لوصف المدرسة. تتميز المدرسة بتقديم تعليم عالي الجودة وتوفر بيئة تعليمية آمنة ومحفزة للطلاب. تضم المدرسة نخبة من المعلمين ذوي الخبرة والكفاءة العالية.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="font-bold text-lg md:text-xl mb-4">معرض الصور</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="h-28 md:h-36 bg-gray-100 rounded-lg overflow-hidden">
                    <img src={`https://picsum.photos/seed/${school.id}-${i}/400/300`} alt="gallery" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolProfile;
