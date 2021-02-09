import {
	AvailableLanguages,
	LanguageStringsStructure,
}                               from '../lib/languages';
import React                    from 'react';
import LanguageContext          from './LanguageContext';
import Menu                     from './Menu';
import {
	mainPageMenuItem,
	MenuItem,
	languageStrings as commonMenuLanguageStrings,
}                               from '../lib/menuComponents';
import { FirebaseAuthConsumer } from '@react-firebase/auth';

const languageStrings: LanguageStringsStructure & {
	'en-US': {
		about: string,
		signIn: string,
		pricing: string,
	},
} = {
	'en-US': {
		about: 'About',
		signIn: 'Sign Up / Sign in',
		pricing: 'Pricing',
	},
};

const menuItemsDictionary = (language: AvailableLanguages['type']): (
	Record<'left' | 'right' | 'right_signed_in', Record<string, MenuItem>>
	) => (
	{
		'left': {
			'/': mainPageMenuItem(language),
			'/about': {
				label: languageStrings[language].about,
			},
			'/pricing': {
				label: languageStrings[language].pricing,
			},
		},
		'right': {
			'/sign_in': {
				label: languageStrings[language].signIn,
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
		({isSignedIn}) => <LanguageContext.Consumer>{
			(language) => <Menu menuItemGroups={[
				menuItemsDictionary(language).left,
				menuItemsDictionary(language)[
					isSignedIn ?
						'right_signed_in' :
						'right'
					],
			]} />
		}</LanguageContext.Consumer>
	}</FirebaseAuthConsumer>;
}