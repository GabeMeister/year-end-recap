export const ALL_SLIDES = [
  "about",

  "new_authors",
  "team_commits",
  "file_count",
  "lines_of_code",
  "longest_files",

  "author_commits_over_time",
  "team_commits_by_month",
  "team_commits_by_week_day",
  "team_commits_by_hour",
  "highest_commit_day_by_author",

  "longest_commit",
  "shortest_commits",
  "commit_message_lengths",

  "author_blame_counts",

  "avg_releases_per_day",
  "most_releases_in_day",
  "ending",
];

export const SLIDE_PARTS = {
  new_authors: [
    "title",
    "prev_year_number",
    "curr_year_number",
    "percent_increase",
    "list_names",
  ],
  team_commits: [
    "title",
    "prev_year_number",
    "curr_year_number",
    "percent_increase",
  ],
  file_count: [
    "title",
    "prev_year_number",
    "curr_year_number",
    "percent_increase",
  ],
  lines_of_code: [
    "title",
    "prev_year_number",
    "curr_year_number",
    "percent_increase",
  ],
  longest_files: ["title", "third_place", "second_place", "first_place"],

  author_commits_over_time: ["title", "main"],
  team_commits_by_month: ["title", "main"],
  team_commits_by_week_day: ["title", "main"],
  team_commits_by_hour: ["title", "main"],
  highest_commit_day_by_author: ["title", "author", "commits"],

  longest_commit: ["title", "author", "commit"],
  shortest_commits: ["title", "first", "second", "third", "fourth", "fifth"],
  commit_message_lengths: ["main"],

  author_blame_counts: ["title", "main"],

  avg_releases_per_day: ["title", "main"],
  most_releases_in_day: ["title", "main"],
  ending: ["main"],
};
