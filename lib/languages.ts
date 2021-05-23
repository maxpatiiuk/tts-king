import type { IR, RA, RR } from './typescriptCommonTypes';

export const DEFAULT_LANGUAGE = 'en-US' as const;
export const AVAILABLE_LANGUAGES: RA<string> = ['en-US'] as const;

export type Language = typeof AVAILABLE_LANGUAGES[number];

export type LocalizationStrings<
  DEFINITIONS extends IR<
    string | ((...arguments_: readonly never[]) => unknown)
  >
> = {
  readonly [language in Language]: DEFINITIONS;
};

export const extractString =
  <
    KEY extends string,
    DEFINITIONS extends RR<
      KEY,
      string | ((...arguments_: readonly never[]) => unknown)
    >
  >(
    localizationStrings: LocalizationStrings<DEFINITIONS>,
    key: KEY
  ) =>
  (
    language: Language
  ): typeof localizationStrings[typeof language][typeof key] =>
    localizationStrings[language][key];
