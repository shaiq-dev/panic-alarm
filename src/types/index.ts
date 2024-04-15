export type ActionResponse<T extends Record<string, unknown> = {}> =
  | { ok: false; error: string }
  | ({ ok: true } & T);

/* Used in session validation */
export type SessionLastClog = {
  src: "signin" | "signup" | (string & {});
  event: string;
  domains: string[];
};
