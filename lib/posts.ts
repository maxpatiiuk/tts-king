export type DatabasePost = {
  readonly sourceUrl?: string;
  readonly fileName?: string;
  readonly preview: string;
};

export type DatabaseDeletedPost = DatabasePost & {
  readonly sourceName: string;
};
