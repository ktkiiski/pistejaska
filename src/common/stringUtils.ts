export const stringifyScore = (score: number | null) =>
  score == null ? "—" : String(Math.round(score));
