import React                                  from 'react';
import {
  DEFAULT_LANGUAGE,
  Language,
  LanguageStringsStructure,
} from '../lib/languages';

const LanguageContext = React.createContext<Language>(DEFAULT_LANGUAGE);

export default LanguageContext;

export const GetUserLanguage =
  <DEFINITIONS extends Record<string, string | Function>>({
    languageStrings,
    children,
  }: {
    languageStrings: LanguageStringsStructure<DEFINITIONS>,
    children: (
      languageStrings: DEFINITIONS,
      language: Language,
    ) => React.ReactNode
  }): JSX.Element => <LanguageContext.Consumer>{
    (language) =>
      children(languageStrings[language], language)
  }</LanguageContext.Consumer>;