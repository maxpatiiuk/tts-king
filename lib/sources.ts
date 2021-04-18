import type { Language, LocalizationStrings } from './languages';

export const localizationStrings: LocalizationStrings<{
  readonly mySources: string;
  readonly availableSubscriptions: string;
  readonly subscribe: string;
  readonly unsubscribe: string;
  readonly priority: string;
  readonly search: string;
  readonly newSourceName: string;
  readonly sourceName: string;
  readonly controls: string;
  readonly confirmDeleteTitle: string;
  readonly confirmDeleteMessage: string;
  readonly confirmDeleteSourceMessage: string;
  readonly confirmDeleteSubscription: string;
  readonly label: string;
  readonly uncategorized: string;
}> = {
  'en-US': {
    mySources: 'My sources',
    availableSubscriptions: 'Available Subscriptions',
    subscribe: 'Subscribe',
    unsubscribe: 'Unsubscribe',
    priority: 'Priority',
    search: '🔍\tSearch',
    newSourceName: "New Source's Name",
    sourceName: 'Source Name',
    controls: 'Controls',
    confirmDeleteTitle: 'Confirm Deletion',
    confirmDeleteMessage: 'Are you sure you want to delete this source?',
    confirmDeleteSourceMessage:
      'All posts belonging to this source would be removed',
    confirmDeleteSubscription:
      'All posts added by this subscription would be removed',
    label: 'Label',
    uncategorized: 'Uncategorized',
  },
};

interface DatabaseSourceBase {
  readonly type: string;
  readonly priority: number;
}

export interface DatabaseSubscription extends DatabaseSourceBase {
  readonly type: 'subscription';
  readonly subscribed: boolean;
}

export interface DatabaseCategory extends DatabaseSourceBase {
  readonly type: 'category';
  readonly labelColor: string;
  readonly label: string;
}

export type DatabaseSource = DatabaseSubscription | DatabaseCategory;

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
  readonly label: string;
  readonly imgLink: string;
  readonly description: string;
}

const subscriptionNames: Readonly<string[]> = ["o'reilly"] as const;

export const sourceSubscriptions: Record<
  typeof subscriptionNames[number],
  Source
> = {
  "o'reilly": {
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
