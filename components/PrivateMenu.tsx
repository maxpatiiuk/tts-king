import {
	AvailableLanguages,
	LanguageStringsStructure,
}                      from '../lib/languages';
import React           from 'react';
import LanguageContext from './LanguageContext';
import Menu            from './Menu';
import {
	mainPageMenuItem,
	MenuItem,
	languageStrings as commonMenuLanguageStrings,
}                      from '../lib/menuComponents';

const languageStrings: LanguageStringsStructure & {
	'en-US': {
		profile: string,
	},
} = {
	'en-US': {
		profile: 'Profile',
	},
};

const menuItemsDictionary = (language: AvailableLanguages['type']): (
	Record<'left' | 'right', Record<string, MenuItem>>
	) => (
	{
		'left': {
			'/': mainPageMenuItem(language),
			'/profile': {
				label: languageStrings[language].profile,
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