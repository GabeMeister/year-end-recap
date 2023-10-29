export type RepoRecap = {
  version: number;
  allTimeAuthorCommits: AuthorCommits[];
  newAuthors: AuthorData;
};

export type CommitData = {
  name: string;
  commits: number;
};

export type SummaryData = Record<string, number>;

export type AuthorCommits = {
  commits: number;
  name: string;
};

export type AuthorFirstCommits = Record<string, Date>;

export type AuthorFirstCommit = {
  name: string;
  first_commit: Date;
};

export type AuthorData = {
  previousYearCount: number;
  currentYearCount: number;
  newAuthors: AuthorFirstCommit[];
};
