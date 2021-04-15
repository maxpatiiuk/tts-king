export const DEFAULT_LANGUAGE = 'en-US' as const;
export const AVAILABLE_LANGUAGES: Readonly<string[]> = ['en-US'] as const;

export type Language = typeof AVAILABLE_LANGUAGES[number];

export type LocalizationStrings<
  DEFINITIONS extends Readonly<
    Record<string, string | ((...arguments_: readonly never[]) => unknown)>
  >
> = {
  readonly [language in Language]: DEFINITIONS;
};

export const extractString = <
  KEY extends string,
  DEFINITIONS extends Readonly<
    Record<KEY, string | ((...arguments_: readonly never[]) => unknown)>
  >
>(
  localizationStrings: LocalizationStrings<DEFINITIONS>,
  key: KEY
) => (
  language: Language
): typeof localizationStrings[typeof language][typeof key] =>
  localizationStrings[language][key];
