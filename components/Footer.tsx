
import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Star, Heart } from 'lucide-react';
import NISLogo from './NISLogo';
import { useLanguage } from '../LanguageContext';
import ScrollReveal from './ScrollReveal';

const Footer: React.FC = () => {
  const { lang, isRTL, t: translationsRoot } = useLanguage();
  const t = translationsRoot.footer;

  return (
    <footer className="bg-[#0f172a] text-gray-400 py-32 relative overflow-hidden border-t border-white/5">
      {/* Animated background glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-900/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[120px] animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-[120px] animate-pulse-slow" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 text-start">
          <ScrollReveal direction="right">
            <div className="space-y-8">
              <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
                <div className="bg-white p-3 rounded-2xl shadow-2xl">
                  <NISLogo className="h-10 w-10 md:h-12 md:w-12" showText={false} />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-white tracking-tight leading-none uppercase">
                    {lang === 'ar' ? 'المعاهد القومية' : 'NIS Network'}
                  </span>
                  <span className="text-[10px] text-red-500 font-bold uppercase tracking-[0.3em] mt-2">Est. 1956</span>
                </div>
              </div>
              <p className="text-sm leading-relaxed font-medium text-gray-400/80">
                {t.description}
              </p>
              <div className={`flex ${isRTL ? 'space-x-reverse space-x-5' : 'space-x-5'}`}>
                {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-red-700 hover:text-white transition-all duration-300 transform hover:-translate-y-1">
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div>
              <h4 className={`text-white font-black mb-10 uppercase tracking-[0.2em] text-[10px] flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                <div className="w-1.5 h-1.5 bg-red-600 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.5)]" />
                <span>{t.navTitle}</span>
              </h4>
              <ul className="space-y-5 text-xs font-bold uppercase tracking-widest">
                {t.links.map((link, idx) => (
                  <li key={idx}>
                    <a href="#" className="hover:text-red-500 transition-colors flex items-center gap-3 group">
                      <span className="w-0 h-[1px] bg-red-600 transition-all duration-300 group-hover:w-4" />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div>
              <h4 className={`text-white font-black mb-10 uppercase tracking-[0.2em] text-[10px] flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                <div className="w-1.5 h-1.5 bg-red-600 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.5)]" />
                <span>{t.regionsTitle}</span>
              </h4>
              <ul className="space-y-5 text-xs font-bold uppercase tracking-widest">
                {t.regions.map((region, idx) => (
                  <li key={idx}>
                    <a href="#" className="hover:text-red-500 transition-colors flex items-center gap-3 group">
                      <span className="w-0 h-[1px] bg-red-600 transition-all duration-300 group-hover:w-4" />
                      {region}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="left" delay={0.3}>
            <div>
              <h4 className={`text-white font-black mb-10 uppercase tracking-[0.2em] text-[10px] flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                <div className="w-1.5 h-1.5 bg-red-600 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.5)]" />
                <span>{t.infoTitle}</span>
              </h4>
              <ul className="space-y-8 text-xs">
                <li className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'} group`}>
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-red-700/20 group-hover:text-red-500 transition-all">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-gray-600 font-black uppercase tracking-widest">Call Center</span>
                    <span dir="ltr" className="text-white font-black tracking-widest">+20 2 2736 0000</span>
                  </div>
                </li>
                <li className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'} group`}>
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-blue-600/20 group-hover:text-blue-500 transition-all">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-gray-600 font-black uppercase tracking-widest">Email Us</span>
                    <span className="text-white font-black tracking-widest lowercase">info@nis.edu.eg</span>
                  </div>
                </li>
                <li className={`flex items-start ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'} group`}>
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-green-600/20 group-hover:text-green-500 transition-all">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Main Office</span>
                    <span className="leading-relaxed text-gray-300 font-medium text-xs normal-case">{t.address}</span>
                  </div>
                </li>
              </ul>
            </div>
          </ScrollReveal>
        </div>

        {/* Bottom Bar */}
        <ScrollReveal direction="up" delay={0.5}>
          <div className="mt-24 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
              <span>{t.copyright}</span>
              <span className="text-red-900">•</span>
              <span className="flex items-center gap-1">MADE WITH <Heart className="h-2 w-2 text-red-600 fill-red-600 animate-pulse" /> IN CAIRO</span>
            </div>
            <div className={`flex flex-wrap justify-center ${isRTL ? 'space-x-reverse space-x-10' : 'space-x-10'} text-[10px] font-black uppercase tracking-[0.2em]`}>
              {[t.privacy, t.terms, t.sitemap].map((link, i) => (
                <a key={i} href="#" className="text-gray-500 hover:text-white transition-colors relative group">
                  {link}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-red-600 transition-all group-hover:w-full" />
                </a>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: translate(-50%, 50%) scale(1); }
          50% { opacity: 0.6; transform: translate(-50%, 50%) scale(1.1); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s infinite ease-in-out;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
