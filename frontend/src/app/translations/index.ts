import { en } from "./en";
import { fa } from "./fa";

export type TranslationKey = keyof typeof en;

export const translations = {
  en,
  fa,
};

export type Language = "en" | "fa";

export const getTranslation = (language: Language) => {
  return translations[language];
};
