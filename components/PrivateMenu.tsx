import {
  AvailableLanguages,
  LanguageStringsStructure,
}                      from '../lib/languages';
import React           from 'react';
import LanguageContext from './LanguageContext';
import Menu            from './Menu';
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

const menuItemsDictionary = (language: AvailableLanguages['type']): (
  Record<'left' | 'right', Record<string, MenuItem>>
  ) => (
  {
    'left': {
      '/': mainPageMenuItem(language),
      '/dashboard/profile': {
        label: languageStrings[language].profile,
      },
      '/dashboard/sources': {
        label: languageStrings[language].sources,
      },
      '/dashboard/stats': {
        label: languageStrings[language].stats,
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
  return <LanguageContext.Consumer>{
    (language) => <Menu menuItemGroups={[
      menuItemsDictionary(language).left,
      menuItemsDictionary(language).right,
    ]} />
  }</LanguageContext.Consumer>;
}