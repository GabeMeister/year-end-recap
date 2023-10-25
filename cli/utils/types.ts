export type NumberObject = { [key: string]: number };
export type StringObject = { [key: string]: string };
export type AnyObject = { [key: string]: any };

export type CommitData = {
  name: string;
  commits: number;
};

export type SummaryData = Record<string, number>;

export type RepoRecap = {
  allTimeAuthorCommits: Record<string, number>;
};
