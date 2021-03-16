import {
  Language,
  LocalizationStrings,
}                          from '../lib/languages';
import React               from 'react';
import { GetUserLanguage } from './LanguageContext';
import Menu                from './Menu';
import {
  mainPageMenuItem,
  MenuItem,
}                          from '../lib/menuComponents';
import commonStrings       from '../const/commonStrings';

const localizationStrings: LocalizationStrings<{
  stats: string,
}> = {
  'en-US': {
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
        label: commonStrings[language].profile,
      },
      '/dashboard/sources': {
        label: commonStrings[language].sources,
      },
      '/dashboard/stats': {
        label: languageStrings.stats,
      },
    },
    'right': {
      '/dashboard': {
        label: commonStrings[language].dashboard,
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