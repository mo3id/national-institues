import { en } from './locales/en';
import { ar } from './locales/ar';

export const translations = {
    en,
    ar,
};

export type Language = keyof typeof translations;
export type TranslationKeys = typeof en;

export const getTranslations = (lang: Language): TranslationKeys => {
    return translations[lang] || translations.en;
};
