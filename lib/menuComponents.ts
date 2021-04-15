import siteInfo from '../const/siteInfo';
import type { Language } from './languages';

export interface MenuItem {
  readonly label: string;
  // Empty by default
  readonly classNames?: string;
  // True by default
  readonly collapsable?: boolean;
}

export const mainPageMenuItem = (language: Language) =>
  ({
    label: siteInfo[language].title,
    classNames:
      'font-bold bg-clip-text bg-gradient-to-l ' +
      'from-yellow-400 to-purple-400 text-transparent',
    collapsable: false,
  } as const);
