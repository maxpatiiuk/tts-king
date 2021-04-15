import type { Language, LocalizationStrings } from './languages';

export type DatabaseSource = {
  priority: number;
} & (
  | {
      type: 'subscription';
      subscribed: boolean;
    }
  | {
      type: 'category';
      labelColor: string;
      label: string;
    }
);

const localizationStrings: LocalizationStrings<{
  uncategorized: string;
}> = {
  'en-US': {
    uncategorized: 'Uncategorized',
  },
};

export const defaultDatabaseSources = (
  language: Language
): Record<string, DatabaseSource> => ({
  uncategorized: {
    type: 'category',
    label: localizationStrings[language].uncategorized,
    priority: 0,
    labelColor: '#0011ff',
  },
});

export interface Source {
  label: string;
  imgLink: string;
  description: string;
}

const subscriptionNames: Readonly<string[]> = ['oreally'] as const;

export const sourceSubscriptions: Record<
  typeof subscriptionNames[number],
  Source
> = {
  oreally: {
    label: "O'Really Newsletter",
    imgLink: '',
    description: 'here goes the description of this newsletter',
  },
} as const;

const MAX_COLOR = 16_777_215;
const HEX_RADIX = 16;

const getRandomColor = (): string =>
  `#${Math.floor(Math.random() * MAX_COLOR).toString(HEX_RADIX)}`;

export const createNewCategory = (sourceLabel: string): DatabaseSource => ({
  type: 'category',
  label: sourceLabel,
  priority: 0,
  labelColor: getRandomColor(),
});

export const createNewSubscription = (): DatabaseSource => ({
  type: 'subscription',
  priority: 0,
  subscribed: true,
});
