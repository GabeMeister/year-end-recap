export type RepoRecap = {
  version: number;

  newAuthors: TeamAuthorData;
  teamCommits: TeamCommitData;
  fileCount: FileCount;
  linesOfCode: LinesOfCode;
  longestFiles: LongestFiles;

  authorCommitsOverTime: AuthorCommitsOverTime;
  allTimeAuthorCommits: AuthorCommits[];
  teamCommitsForYear: number;
  teamChangedLinesForYear: LineChangeStat;
  teamCommitsByMonth: TeamCommitsByMonth;
  teamCommitsByWeekDay: TeamCommitsByWeekDay;
  teamCommitsByHour: TeamCommitsByHour;
  highestCommitDayByAuthor: HighestCommitDaySummary;

  longestCommit: Commit;
  shortestCommits: Commit[];
  commitMessageLengths: CommitMessageLength[];
  avgReleasesPerDay: AvgReleasesPerDay;
  mostReleasesInDay: MostReleasesInDay;
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

export type CommitStat = {
  filesChanged: number;
} & LineChangeStat;

export type LineChangeStat = {
  insertions: number;
  deletions: number;
};

export type TeamCommitsByMonth = {
  month: string;
  commits: number;
}[];

export type TeamCommitsByWeekDay = {
  weekday: string;
  commits: number;
}[];

export type TeamCommitsByHour = {
  hour: string;
  commits: number;
}[];

export type HighestCommitDaySummary = {
  authorName: string;
  count: number;
  date: string;
  commitMessages: {
    hash: string;
    message: string;
  }[];
};

export type MostChangesDaySummary = {
  authorName: string;
  insertions: number;
  deletions: number;
  date: string;
};

export type Commit = {
  author_name: string;
  length: number;
  author_when: string;
  message: string;
  hash: string;
};

export type CommitMessageLength = {
  length: number;
  frequency: number;
};

export type AvgReleasesPerDay = {
  count: number;
};

export type MostReleasesInDay = {
  count: number;
  date: string;
};

export type StatsQuery = {
  id: number;
  part: string;
};
