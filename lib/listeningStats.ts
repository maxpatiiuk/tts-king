import type { RR } from './typescriptCommonTypes';

const statsCategories = ['posts', 'paragraphs', 'words', 'characters'] as const;

type StatsCategories = typeof statsCategories[number];

export type ListeningStats = RR<
  number,
  RR<number, RR<StatsCategories, number>>
>;

export type TotalStats = RR<StatsCategories | 'queuedPosts', number>;
