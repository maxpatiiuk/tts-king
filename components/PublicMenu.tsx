import { Language, LocalizationStrings } from '../lib/languages';
import React                             from 'react';
import { GetUserLanguage }               from './LanguageContext';
import Menu                              from './Menu';
import {
  mainPageMenuItem,
  MenuItem,
}                                        from '../lib/menuComponents';
import commonLocalizationStrings         from '../const/commonStrings';
import { AuthContext }                   from './AuthContext';

const localizationStrings: LocalizationStrings<{
  about: string,
  signIn: string,
  pricing: string,
}> = {
  'en-US': {
    about: 'About',
    signIn: 'Sign Up / Sign in',
    pricing: 'Pricing',
  },
};

const menuItemsDictionary = (
  languageStrings: typeof localizationStrings[Language],
  language: Language,
): (
  Record<'left' | 'right' | 'right_signed_in', Record<string, MenuItem>>
  ) => (
  {
    'left': {
      '/': mainPageMenuItem(language),
      '/about': {
        label: languageStrings.about,
      },
      '/pricing': {
        label: languageStrings.pricing,
      },
    },
    'right': {
      '/sign_in': {
        label: languageStrings.signIn,
      },
    },
    'right_signed_in': {
      '/dashboard': {
        label: commonLocalizationStrings[language].dashboard,
      },
    },
  }
);

export function PublicMenu() {

  const {user} = React.useContext(AuthContext);

  return <GetUserLanguage
    localizationStrings={localizationStrings}
  >{
    (languageStrings, language) => <Menu menuItemGroups={[
      menuItemsDictionary(languageStrings, language).left,
      menuItemsDictionary(languageStrings, language)[
        user ?
          'right_signed_in' :
          'right'
        ],
    ]} />
  }</GetUserLanguage>;
}