import { Language, LanguageStringsStructure } from '../lib/languages';
import React                                  from 'react';
import { GetUserLanguage }                    from './LanguageContext';
import Menu                                   from './Menu';
import {
  languageStrings as commonMenuLanguageStrings,
  mainPageMenuItem,
  MenuItem,
}                                             from '../lib/menuComponents';
import { FirebaseAuthConsumer }               from '@react-firebase/auth';

const languageStrings: LanguageStringsStructure<{
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
  localizedLanguageStrings: typeof languageStrings[Language],
  language: Language,
): (
  Record<'left' | 'right' | 'right_signed_in', Record<string, MenuItem>>
  ) => (
  {
    'left': {
      '/': mainPageMenuItem(language),
      '/about': {
        label: localizedLanguageStrings.about,
      },
      '/pricing': {
        label: localizedLanguageStrings.pricing,
      },
    },
    'right': {
      '/sign_in': {
        label: localizedLanguageStrings.signIn,
      },
    },
    'right_signed_in': {
      '/dashboard': {
        label: commonMenuLanguageStrings[language].dashboard,
      },
    },
  }
);

export function PublicMenu() {
  return <FirebaseAuthConsumer>{

    ({isSignedIn}) => <GetUserLanguage languageStrings={languageStrings}>{
      (languageStrings, language) => <Menu menuItemGroups={[
        menuItemsDictionary(languageStrings, language).left,
        menuItemsDictionary(languageStrings, language)[
          isSignedIn ?
            'right_signed_in' :
            'right'
          ],
      ]} />
    }</GetUserLanguage>
  }</FirebaseAuthConsumer>;
}