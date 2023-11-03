export type RepoRecap = {
  version: number;
  allTimeAuthorCommits: AuthorCommits[];
  newAuthors: TeamAuthorData;
  teamCommits: TeamCommitData;
  fileCount: FileCount;
  linesOfCode: LinesOfCode;
  longestFiles: LongestFiles;
  authorCommitsOverTime: AuthorCommitsOverTime;
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
  prevYear: number;
  currYear: number;
};

export type FileCount = {
  prevYear: number;
  currYear: number;
};

export type LinesOfCode = {
  prevYear: number;
  currYear: number;
};

export type LongestFiles = {
  path: string;
  lines: number;
}[];

export type RawCommit = {
  name: string;
  date: string;
  message: string;
};

export type CommitsDay = {
  date: string;
  name: string;
  value: string;
};

export type AuthorCommitsOverTime = CommitsDay[];
