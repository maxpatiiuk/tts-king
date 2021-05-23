import type { ListeningStats, TotalStats } from './listeningStats';
import type { DatabaseDeletedPost } from './posts';
import type { DatabaseSource } from './sources';
import type { IR } from './typescriptCommonTypes';

export type DatabaseUser = {
  readonly subscribeToNewsletter: boolean;
  readonly sources: IR<DatabaseSource>;
  readonly postsContent: IR<string>;
  readonly listeningStats: ListeningStats;
  readonly totalStats: TotalStats;
  readonly deletedPostsMeta: IR<DatabaseDeletedPost>;
  readonly deletedPostsContent: IR<string>;
};
