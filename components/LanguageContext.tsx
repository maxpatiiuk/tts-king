import React                                  from 'react';
import {
  DEFAULT_LANGUAGE,
  Language,
  LocalizationStrings,
} from '../lib/languages';

const LanguageContext = React.createContext<Language>(DEFAULT_LANGUAGE);

export default LanguageContext;

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