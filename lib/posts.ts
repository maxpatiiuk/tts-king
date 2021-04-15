export type DatabasePostMeta = Record<string, DatabasePost>;

export type DatabasePost = (
  | {
      sourceUrl: string;
    }
  | {
      fileName: string;
    }
) & {
  preview: string;
};
