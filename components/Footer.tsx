
import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Star } from 'lucide-react';
import NISLogo from './NISLogo';
import { useLanguage } from '../LanguageContext';
import { translations } from '../translations';

const Footer: React.FC = () => {
  const { lang, isRTL, t: translationsRoot } = useLanguage();
  const t = translationsRoot.footer;

  return (
    <footer className="bg-[#0f172a] text-gray-400 py-20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-900/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10 text-start">
        <div className="space-y-8">
          <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
            <div className="bg-white p-2 rounded-xl">
              <NISLogo className="h-12 w-12" showText={false} />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-white tracking-tight leading-tight">
                {lang === 'ar' ? 'المعاهد القومية' : 'National Institutes'}
              </span>
              <span className="text-[9px] text-red-500 font-bold uppercase tracking-widest mt-1">Est. 1956</span>
            </div>
          </div>
          <p className="text-sm leading-relaxed">
            {t.description}
          </p>
          <div className={`flex ${isRTL ? 'space-x-reverse space-x-6' : 'space-x-6'}`}>
            <Facebook className="h-5 w-5 cursor-pointer hover:text-red-500 transition-colors" />
            <Twitter className="h-5 w-5 cursor-pointer hover:text-red-500 transition-colors" />
            <Instagram className="h-5 w-5 cursor-pointer hover:text-red-500 transition-colors" />
            <Linkedin className="h-5 w-5 cursor-pointer hover:text-red-500 transition-colors" />
          </div>
        </div>

        <div>
          <h4 className={`text-white font-bold mb-8 uppercase tracking-widest text-xs flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
            <Star className="h-3 w-3 text-red-500 fill-red-500" />
            <span>{t.navTitle}</span>
          </h4>
          <ul className="space-y-4 text-sm font-medium">
            {t.links.map((link, idx) => (
              <li key={idx}><a href="#" className="hover:text-white transition-colors">{link}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className={`text-white font-bold mb-8 uppercase tracking-widest text-xs flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
            <Star className="h-3 w-3 text-red-500 fill-red-500" />
            <span>{t.regionsTitle}</span>
          </h4>
          <ul className="space-y-4 text-sm font-medium">
            {t.regions.map((region, idx) => (
              <li key={idx}><a href="#" className="hover:text-white transition-colors">{region}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className={`text-white font-bold mb-8 uppercase tracking-widest text-xs flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
            <Star className="h-3 w-3 text-red-500 fill-red-500" />
            <span>{t.infoTitle}</span>
          </h4>
          <ul className="space-y-6 text-sm">
            <li className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
              <div className="bg-white/5 p-2 rounded-lg">
                <Phone className="h-4 w-4 text-red-500" />
              </div>
              <span dir="ltr">+20 2 2736 0000</span>
            </li>
            <li className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
              <div className="bg-white/5 p-2 rounded-lg">
                <Mail className="h-4 w-4 text-red-500" />
              </div>
              <span>info@nis.edu.eg</span>
            </li>
            <li className={`flex items-start ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
              <div className="bg-white/5 p-2 rounded-lg mt-1">
                <MapPin className="h-4 w-4 text-red-500" />
              </div>
              <span className="leading-relaxed">{t.address}</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] font-bold uppercase tracking-widest">
        <span>{t.copyright}</span>
        <div className={`flex ${isRTL ? 'space-x-reverse space-x-6' : 'space-x-6'} mt-4 md:mt-0`}>
          <a href="#" className="hover:text-white">{t.privacy}</a>
          <a href="#" className="hover:text-white">{t.terms}</a>
          <a href="#" className="hover:text-white">{t.sitemap}</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
