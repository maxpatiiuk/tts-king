import React from 'react';

import commonStrings from '../const/commonStrings';
import type { Language, LocalizationStrings } from '../lib/languages';
import type { MenuItem } from '../lib/menuComponents';
import { mainPageMenuItem } from '../lib/menuComponents';
import { GetUserLanguage } from './LanguageContext';
import Menu from './Menu';

const localizationStrings: LocalizationStrings<{
  readonly stats: string;
}> = {
  'en-US': {
    stats: 'Stats',
  },
};

const menuItemsDictionary = (
  languageStrings: Readonly<typeof localizationStrings[Language]>,
  language: Language
): Record<'left' | 'right', Record<string, MenuItem>> => ({
  left: {
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
  right: {
    '/dashboard': {
      label: commonStrings[language].dashboard,
    },
  },
});

export function PrivateMenu(): JSX.Element {
  return (
    <GetUserLanguage localizationStrings={localizationStrings}>
      {(
        languageStrings: Readonly<typeof localizationStrings[Language]>,
        language: Language
      ): JSX.Element => (
        <Menu
          menuItemGroups={[
            menuItemsDictionary(languageStrings, language).left,
            menuItemsDictionary(languageStrings, language).right,
          ]}
        />
      )}
    </GetUserLanguage>
  );
}
