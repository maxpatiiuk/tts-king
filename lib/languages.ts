
export const DEFAULT_LANGUAGE = 'en-US' as const;
export const AVAILABLE_LANGUAGES:Readonly<string[]> = ['en-US'] as const;
export type Language = typeof AVAILABLE_LANGUAGES[number];

export type LanguageStringsStructure<DEFINITIONS extends Record<string,
  string | Function>> = {
    readonly [language in Language]:
    DEFINITIONS
  };

export const dummyLanguageStrings:LanguageStringsStructure<{}> = {
  'en-US': {},
};