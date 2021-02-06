import { AvailableLanguages, LanguageStringsStructure } from '../lib/languages';
import React                                            from 'react';
import LanguageContext                                  from './LanguageContext';
import { useAuth }                                      from './AuthContext';
import Menu                                             from './Menu';
import {
	mainPageMenuItem,
	MenuItem,
	languageStrings as commonMenuLanguageStrings,
}                                                       from '../lib/menuComponents';

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

	const {user} = useAuth();

	return <LanguageContext.Consumer>{
		(language) => <Menu menuItemGroups={[
			menuItemsDictionary(language).left,
			menuItemsDictionary(language)[
				user === null ?
					'right' :
					'right_signed_in'
				],
		]} />
	}</LanguageContext.Consumer>;
}