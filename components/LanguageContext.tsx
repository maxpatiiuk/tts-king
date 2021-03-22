import React                        from 'react';
import {
  DEFAULT_LANGUAGE,
  Language,
  LocalizationStrings,
}                                   from '../lib/languages';
import { useRouter }                from 'next/router';

const LanguageContext = React.createContext<Language>(DEFAULT_LANGUAGE);

export const GetUserLanguage =
  <DEFINITIONS extends Record<string, string | Function>>({
    localizationStrings,
    children,
  }: {
    localizationStrings: LocalizationStrings<DEFINITIONS>,
    children: (
      languageStrings: DEFINITIONS,
      language: Language,
    ) => React.ReactNode
  }): JSX.Element => <LanguageContext.Consumer>{
    (language) =>
      children(localizationStrings[language], language)
  }</LanguageContext.Consumer>;


export const LanguageProvider = ({
  children
}:{
  children: React.ReactNode
})=>{

  const {defaultLocale = 'en-US', locale = defaultLocale} = useRouter();

  return <LanguageContext.Provider value={locale as Language}>
    {children}
  </LanguageContext.Provider>;

};