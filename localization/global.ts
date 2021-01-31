import { LanguageStringsStructure } from '../lib/languages';

interface CommonStringsLocalization extends LanguageStringsStructure {
	'en-US': {
		returnToHomePage: string,
	},
}

export const CommonStrings: CommonStringsLocalization = {
	'en-US': {
		returnToHomePage: '← Return to homepage',
	},
};