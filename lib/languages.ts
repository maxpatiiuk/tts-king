export const DEFAULT_LANGUAGE = 'en-US' as const;
export const AVAILABLE_LANGUAGES:Readonly<string[]> = [
  'en-US'
] as const;


export type Language = typeof AVAILABLE_LANGUAGES[number];

export type LocalizationStrings<DEFINITIONS extends Record<string,
  string | Function>> = {
    readonly [language in Language]:
    DEFINITIONS
  };

export const extractString = <KEY extends string,
  DEFINITIONS extends Record<KEY, string | Function>>(
  localizationStrings: LocalizationStrings<DEFINITIONS>,
  key: KEY,
)=>(language:Language)=>
  localizationStrings[language][key];