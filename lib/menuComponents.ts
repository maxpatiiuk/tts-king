import {
	AvailableLanguages,
	LanguageStringsStructure,
}               from './languages';
import siteInfo from '../const/siteInfo';

export interface MenuItem {
	label: string,
	classNames?: string,  // ''
	collapsable?: boolean,  // true
}

export const mainPageMenuItem = (
	language: AvailableLanguages['type'],
) => (
	{
		label: siteInfo[language].title,
		classNames: 'font-bold bg-clip-text bg-gradient-to-l ' +
			'from-yellow-400 to-purple-400 text-transparent',
		collapsable: false,
	}
);

export const languageStrings: LanguageStringsStructure<{
	dashboard: string,
}> = {
	'en-US': {
		dashboard: 'My Dashboard',
	},
};