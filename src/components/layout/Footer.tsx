
import React from 'react';
import Twitter from 'lucide-react/dist/esm/icons/twitter';
import Instagram from 'lucide-react/dist/esm/icons/instagram';
import Linkedin from 'lucide-react/dist/esm/icons/linkedin';
import Github from 'lucide-react/dist/esm/icons/github';
import Facebook from 'lucide-react/dist/esm/icons/facebook';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useSiteData } from '@/context/DataContext';
import ScrollReveal from '../common/ScrollReveal';

const Footer: React.FC = () => {
  const { lang, isRTL, t: translationsRoot } = useLanguage();
  const { data: siteData } = useSiteData();
  const t = translationsRoot.footer;

  const socialLinks = [
    { Icon: Facebook, href: siteData.contactData?.facebook || "#" },
    { Icon: Twitter, href: siteData.contactData?.twitter || "#" },
    { Icon: Instagram, href: siteData.contactData?.instagram || "#" },
    { Icon: Linkedin, href: siteData.contactData?.linkedin || "#" },
  ];

  return (
    <footer className="bg-white text-gray-900 pt-24 pb-12 relative overflow-hidden border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 pb-16">
          {/* Logo and Description */}
          <div className="lg:col-span-5 space-y-12">
            <ScrollReveal direction="right">
              <div className="flex flex-col md:flex-row items-center gap-4 justify-center md:justify-start">
                <img src="/layer-1-small.webp" alt="NIS Logo" className="h-12 md:h-16 object-contain" width="134" height="48" loading="lazy" decoding="async" />
                <span className="text-[26px] md:text-[32px] font-bold tracking-tight text-[#1e3a8a]">
                  {t.networkName}
                </span>
              </div>
              <p className="mt-10 text-gray-600 text-[16px] md:text-[20px] leading-relaxed max-w-lg text-center md:text-start mx-auto md:mx-0">
                {(lang === 'ar' ? siteData.contactData?.footerDescAr : siteData.contactData?.footerDesc) || t.description}
              </p>
              <div className="flex gap-10 mt-12 justify-center md:justify-start">
                {socialLinks.map(({ Icon, href }, i) => {
                  if (!href || href === "#") return null;
                  return (
                    <a
                      key={i}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Visit our ${Icon.name || 'social media'} page`}
                      className="text-gray-600 hover:text-[#1e3a8a] transition-all duration-300 hover:-translate-y-1"
                    >
                      <Icon className="h-7 w-7 md:h-8 md:w-8" />
                    </a>
                  );
                })}
              </div>
            </ScrollReveal>
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
              <ScrollReveal delay={0.1}>
                <div className="text-center md:text-start flex flex-col items-center md:items-start">
                  <h3 className="font-bold text-[20px] md:text-[26px] mb-10">{t.productTitle}</h3>
                  <ul className="space-y-6">
                    {t.productLinks.map((link: any, idx: number) => (
                      <li key={idx}>
                        <Link to={link.path} className="text-gray-600 hover:text-black text-[16px] md:text-[20px] transition-colors">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <div className="text-center md:text-start flex flex-col items-center md:items-start">
                  <h3 className="font-bold text-[20px] md:text-[26px] mb-10">{t.resourcesTitle}</h3>
                  <ul className="space-y-6">
                    {t.resourceLinks.map((link: any, idx: number) => (
                      <li key={idx}>
                        <Link to={link.path} className="text-gray-600 hover:text-black text-[16px] md:text-[20px] transition-colors">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.3}>
                <div className="text-center md:text-start flex flex-col items-center md:items-start">
                  <h3 className="font-bold text-[20px] md:text-[26px] mb-10">{t.companyTitle}</h3>
                  <ul className="space-y-6">
                    {t.companyLinks.map((link: any, idx: number) => (
                      <li key={idx}>
                        <Link to={link.path} className="text-gray-600 hover:text-black text-[16px] md:text-[20px] transition-colors">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <ScrollReveal direction="up" delay={0.4}>
          <div className="pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="text-[16px] md:text-[20px] text-gray-600 text-center md:text-start">
              {t.copyright}
            </div>
            <div className="flex flex-wrap justify-center gap-12 text-[16px] md:text-[20px]">
              {[t.privacy, t.terms, t.cookies].map((link, i) => (
                <a key={i} href="#" className="text-gray-600 hover:text-black transition-colors">
                  {link}
                </a>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Large Background Text */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 pointer-events-none select-none overflow-hidden w-full text-center">
        <span className="text-[15vw] font-black text-gray-300/15 leading-none uppercase whitespace-nowrap">
          {t.networkName}
        </span>
      </div>
    </footer>
  );
};

export default Footer;
