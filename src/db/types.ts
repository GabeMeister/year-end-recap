import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type repos = {
    id: Generated<number>;
    name: string | null;
    url: string | null;
    created_date: Generated<Timestamp | null>;
    updated_date: Generated<Timestamp | null>;
    data: unknown | null;
};
export type signups = {
    id: Generated<number>;
    email: string | null;
    signup_datetime: Timestamp | null;
};
export type DB = {
    repos: repos;
    signups: signups;
};
