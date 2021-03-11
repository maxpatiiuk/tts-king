export type DatabasePostMeta = Record<string, DatabasePost>;

export type DatabasePost = (
  {
    source_url: string,
  } | {
  file_name: string,
}
  ) & {
  preview: string,
};