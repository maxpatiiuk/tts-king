import { LanguageStringsStructure } from '../lib/languages';

interface ErrorPageLocalization extends LanguageStringsStructure {
	'en-US': {
		title: string,
		description: string,
		keywords: string,
		author: string,
	},
}

const SiteInfo: ErrorPageLocalization = {
	'en-US': {
		title: 'TTS King',
		description: `Convert your daily news digests into a simple podcast you can listen to
			while in transit, walking or even exercising. TTS King helps you stay productive
			no matter where you are!`,
		keywords: `TTS King, tts, text-to-speech, text to speech, convert websites to audio,
			website to audio, website to audiobook, reader mode, website reader mode, distraction
			free browser`,
		author: 'Maksym Patiiuk',
	},
};

export default SiteInfo;