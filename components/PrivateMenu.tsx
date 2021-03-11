import {
  Language,
  LanguageStringsStructure,
} from '../lib/languages';
import React                                from 'react';
import { GetUserLanguage } from './LanguageContext';
import Menu                                 from './Menu';
import {
  languageStrings as commonMenuLanguageStrings,
  mainPageMenuItem,
  MenuItem,
}                      from '../lib/menuComponents';

const languageStrings: LanguageStringsStructure<{
  profile: string,
  sources: string,
  stats: string,
}> = {
  'en-US': {
    profile: 'Profile',
    sources: 'Sources',
    stats: 'Stats',
  },
};

const menuItemsDictionary = (
  localizedLanguageStrings: typeof languageStrings[Language],
  language: Language
): (
  Record<'left' | 'right', Record<string, MenuItem>>
  ) => (
  {
    'left': {
      '/': mainPageMenuItem(language),
      '/dashboard/profile': {
        label: localizedLanguageStrings.profile,
      },
      '/dashboard/sources': {
        label: localizedLanguageStrings.sources,
      },
      '/dashboard/stats': {
        label: localizedLanguageStrings.stats,
      },
    },
    'right': {
      '/dashboard': {
        label: commonMenuLanguageStrings[language].dashboard,
      },
    },
  }
);

export function PrivateMenu() {
  return <GetUserLanguage languageStrings={languageStrings}>{
    (languageStrings, language) => <Menu menuItemGroups={[
      menuItemsDictionary(languageStrings, language).left,
      menuItemsDictionary(languageStrings, language).right,
    ]} />
  }</GetUserLanguage>;
}