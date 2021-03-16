import { Language, LocalizationStrings } from './languages';

export type DatabaseSource = {
  label_color: string,
  priority: number,
} & ({
  type: 'subscription',
  subscribed: boolean,
} | {
  type: 'category',
  label: string
});

const localizationStrings: LocalizationStrings<{
  uncategorized: string
}> = {
  'en-US': {
    uncategorized: 'Uncategorized',
  },
};

export const defaultDatabaseSources = (
  language: Language,
): Record<string, DatabaseSource> => (
  {
    'uncategorized': {
      type: 'category',
      label: localizationStrings[language].uncategorized,
      priority: 0,
      label_color: '#0011ff',
    },
  }
);

export interface Source {
  label: string,
  description: string,
}

const subscriptionNames: Readonly<string[]> = ['oreally'] as const;

export const sourceSubscriptions: Record<typeof subscriptionNames[number],
  Source> = {
  'oreally': {
    label: 'O\'Really Newsletter',
    description: 'here goes the description of this newsletter',
  },
} as const;