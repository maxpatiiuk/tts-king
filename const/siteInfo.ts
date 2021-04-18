import type { LocalizationStrings } from '../lib/languages';
import { strip } from '../lib/localizationHelper';

const siteInfo: LocalizationStrings<{
  readonly title: string;
  readonly description: string;
  readonly keywords: string;
  readonly author: string;
  readonly tts: string;
  readonly king: string;
}> = {
  'en-US': {
    title: 'TTS King',
    tts: 'TTS',
    king: 'King',
    description: strip(`Convert your daily news digests into a
      simple podcast you can listen to while in transit, walking or
      even exercising. TTS King helps you stay productive no matter
      where you are!`),
    keywords: strip(`TTS King, tts, text-to-speech, text to
      speech, convert websites to audio, website to audio, website
      to audiobook, reader mode, website reader mode, distraction
      free browser`),
    author: 'Maksym Patiiuk',
  },
};

export default siteInfo;
