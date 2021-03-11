import {
  Language,
  LocalizationStrings,
} from '../lib/languages';
import React                                from 'react';
import { GetUserLanguage } from './LanguageContext';
import Menu                                 from './Menu';
import {
  localizationStrings as commonMenuLocalizationStrings,
  mainPageMenuItem,
  MenuItem,
}                      from '../lib/menuComponents';

const localizationStrings: LocalizationStrings<{
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
  languageStrings: typeof localizationStrings[Language],
  language: Language
): (
  Record<'left' | 'right', Record<string, MenuItem>>
  ) => (
  {
    'left': {
      '/': mainPageMenuItem(language),
      '/dashboard/profile': {
        label: languageStrings.profile,
      },
      '/dashboard/sources': {
        label: languageStrings.sources,
      },
      '/dashboard/stats': {
        label: languageStrings.stats,
      },
    },
    'right': {
      '/dashboard': {
        label: commonMenuLocalizationStrings[language].dashboard,
      },
    },
  }
);

export function PrivateMenu() {
  return <GetUserLanguage localizationStrings={localizationStrings}>{
    (languageStrings, language) => <Menu menuItemGroups={[
      menuItemsDictionary(languageStrings, language).left,
      menuItemsDictionary(languageStrings, language).right,
    ]} />
  }</GetUserLanguage>;
}