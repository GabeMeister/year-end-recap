export type CommitData = {
  name: string;
  commits: number;
};

export type SummaryData = Record<string, number>;

export type RepoRecap = {
  version: number;
  allTimeAuthorCommits: AuthorCommits[];
};

export type AuthorCommits = {
  commits: number;
  name: string;
};
