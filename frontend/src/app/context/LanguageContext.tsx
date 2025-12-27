"use client";

import React, { createContext, useContext, useEffect } from "react";

export type Language = "en";

interface LanguageContextType {
  language: Language;
  direction: "ltr";
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // Always set to English and LTR
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
  }, []);

  return (
    <LanguageContext.Provider value={{ language: "en", direction: "ltr" }}>
      {children}
    </LanguageContext.Provider>
  );
};
