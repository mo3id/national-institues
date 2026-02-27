
import React from 'react';
import { Twitter, Instagram, Linkedin, Github } from 'lucide-react';
import { Link } from 'react-router-dom';
import NISLogo from '../common/NISLogo';
import { useLanguage } from '@/context/LanguageContext';
import ScrollReveal from '../common/ScrollReveal';

const Footer: React.FC = () => {
  const { lang, isRTL, t: translationsRoot } = useLanguage();
  const t = translationsRoot.footer;

  const socialLinks = [
    { Icon: Twitter, href: "#" },
    { Icon: Instagram, href: "#" },
    { Icon: Linkedin, href: "#" },
    { Icon: Github, href: "#" },
  ];

  return (
    <footer className="bg-white text-gray-900 pt-24 pb-12 relative overflow-hidden border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 pb-16">
          {/* Logo and Description */}
          <div className="lg:col-span-5 space-y-12">
            <ScrollReveal direction="right">
              <div className="flex items-center gap-4 justify-start">
                <img src="/Layer 1.png" alt="NIS Logo" className="h-12 md:h-16 object-contain" />
                <span className="text-[26px] md:text-[32px] font-bold tracking-tight text-[#1e3a8a]">
                  {t.networkName}
                </span>
              </div>
              <p className="mt-10 text-gray-500 text-[16px] md:text-[20px] leading-relaxed max-w-lg text-start">
                {t.description}
              </p>
              <div className="flex gap-10 mt-12 justify-start">
                {socialLinks.map(({ Icon, href }, i) => (
                  <a
                    key={i}
                    href={href}
                    className="text-gray-400 hover:text-black transition-colors"
                  >
                    <Icon className="h-8 w-8" />
                  </a>
                ))}
              </div>
            </ScrollReveal>
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
              <ScrollReveal delay={0.1}>
                <div className="text-start">
                  <h4 className="font-bold text-[20px] md:text-[26px] mb-10">{t.productTitle}</h4>
                  <ul className="space-y-6">
                    {t.productLinks.map((link, idx) => (
                      <li key={idx}>
                        <a href="#" className="text-gray-500 hover:text-black text-[16px] md:text-[20px] transition-colors">
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <div className="text-start">
                  <h4 className="font-bold text-[20px] md:text-[26px] mb-10">{t.resourcesTitle}</h4>
                  <ul className="space-y-6">
                    {t.resourceLinks.map((link, idx) => (
                      <li key={idx}>
                        <a href="#" className="text-gray-500 hover:text-black text-[16px] md:text-[20px] transition-colors">
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.3}>
                <div className="text-start">
                  <h4 className="font-bold text-[20px] md:text-[26px] mb-10">{t.companyTitle}</h4>
                  <ul className="space-y-6">
                    {t.companyLinks.map((link, idx) => {
                      let to = '#';
                      if (idx === 0) to = '/about';
                      if (idx === 1) to = '/careers';
                      if (idx === 2) to = '/contact';
                      return (
                        <li key={idx}>
                          <Link to={to} className="text-gray-500 hover:text-black text-[16px] md:text-[20px] transition-colors">
                            {link}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <ScrollReveal direction="up" delay={0.4}>
          <div className="pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="text-[16px] md:text-[20px] text-gray-400 text-center md:text-start">
              {t.copyright}
            </div>
            <div className="flex flex-wrap justify-center gap-12 text-[16px] md:text-[20px]">
              {[t.privacy, t.terms, t.cookies].map((link, i) => (
                <a key={i} href="#" className="text-gray-400 hover:text-black transition-colors">
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
