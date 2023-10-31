export type RepoRecap = {
  version: number;
  allTimeAuthorCommits: AuthorCommits[];
  newAuthors: TeamAuthorData;
  teamCommits: TeamCommitData;
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

export type TeamAuthorData = {
  previousYearCount: number;
  currentYearCount: number;
  newAuthors: AuthorFirstCommit[];
};

export type TeamCommitData = {
  previousYearCount: number;
  currentYearCount: number;
};
