export const ALL_SLIDES = [
  "about",

  "new_authors",
  "team_commits",
  "file_count",
  "lines_of_code",
  "longest_files",

  "author_commits_over_time",
  "all_time_author_commits",
  "team_commits_for_year",
  "team_changed_lines_for_year",
  "team_commits_by_month",
  "team_commits_by_week_day",
  "team_commits_by_hour",
  "highest_commit_day_by_author",

  "longest_commit",
  "shortest_commits",
  "commit_message_lengths",
  "most_releases_in_day",
  "avg_releases_per_day",
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
  all_time_author_commits: ["title", "main"],
  team_commits_for_year: ["title", "main"],
  team_changed_lines_for_year: ["title", "main"],
  team_commits_by_month: ["title", "main"],
  team_commits_by_week_day: ["title", "main"],
  team_commits_by_hour: ["title", "main"],
  highest_commit_day_by_author: ["title", "main"],

  longest_commit: ["title", "main"],
  shortest_commits: ["title", "main"],
  commit_message_lengths: ["title", "main"],
  most_releases_in_day: ["title", "main"],
  avg_releases_per_day: ["title", "main"],
};
