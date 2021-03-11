import { Action } from './stateManagement';

export const defaultLanguage = 'en-US' as const;
export const listOfLanguages = ['en-US'] as const;
export type AvailableLanguages = Action<'en-US'>

export type LanguageStringsStructure<DEFINITIONS extends Record<string,
  string | number | Function>> = {
  readonly [language in AvailableLanguages['type']]:
  DEFINITIONS
}
