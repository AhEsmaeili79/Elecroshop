import { useLanguage } from "../context/LanguageContext";
import { getTranslation, TranslationKey } from "../translations";

export const useTranslation = () => {
  const { language } = useLanguage();
  const t = getTranslation(language);

  const translate = (key: string): string => {
    const keys = key.split(".");
    let value: any = t;
    
    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }
    
    return typeof value === "string" ? value : key;
  };

  return { t, translate, language };
};
