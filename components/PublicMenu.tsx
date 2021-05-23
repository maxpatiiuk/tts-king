import React from 'react';

import commonLocalizationStrings from '../const/commonStrings';
import type { Language, LocalizationStrings } from '../lib/languages';
import type { MenuItem } from '../lib/menuComponents';
import { mainPageMenuItem } from '../lib/menuComponents';
import { useAuth } from './FirebaseApp';
import { GetUserLanguage } from './LanguageContext';
import Menu from './Menu';

const localizationStrings: LocalizationStrings<{
  readonly about: string;
  readonly signIn: string;
  readonly pricing: string;
}> = {
  'en-US': {
    about: 'About',
    signIn: 'Sign Up / Sign in',
    pricing: 'Pricing',
  },
};

const menuItemsDictionary = (
  languageStrings: Readonly<typeof localizationStrings[Language]>,
  language: Language
): Record<'left' | 'right' | 'rightSignedIn', Record<string, MenuItem>> => ({
  left: {
    '/': mainPageMenuItem(language),
    '/about': {
      label: languageStrings.about,
    },
    '/pricing': {
      label: languageStrings.pricing,
    },
  },
  right: {
    '/sign_in': {
      label: languageStrings.signIn,
    },
  },
  rightSignedIn: {
    '/dashboard': {
      label: commonLocalizationStrings[language].dashboard,
    },
  },
});

export function PublicMenu(): JSX.Element {
  const { user } = useAuth();

  return (
    <GetUserLanguage localizationStrings={localizationStrings}>
      {(
        languageStrings: Readonly<typeof localizationStrings[Language]>,
        language: Language
      ): JSX.Element => (
        <Menu
          menuItemGroups={[
            menuItemsDictionary(languageStrings, language).left,
            menuItemsDictionary(languageStrings, language)[
              user ? 'rightSignedIn' : 'right'
            ],
          ]}
        />
      )}
    </GetUserLanguage>
  );
}
