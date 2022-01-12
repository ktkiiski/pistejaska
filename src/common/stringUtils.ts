export const stringifyScore = (score: number | null) =>
  score == null ? "—" : String(Math.round(score));

const numericEmojis = [
  "0️⃣",
  "1️⃣",
  "2️⃣",
  "3️⃣",
  "4️⃣",
  "5️⃣",
  "6️⃣",
  "7️⃣",
  "8️⃣",
  "9️⃣",
];

const numRegexp = /\d/g;

export function getPositionAsEmoji(position: number): string {
  return position
    .toString()
    .replace(numRegexp, (numStr) => numericEmojis[+numStr]);
}

export function formatDuration(hours: number): string {
  if (Number.isNaN(hours) || !Number.isFinite(hours)) {
    return "???";
  }
  const fullHours = Math.trunc(hours);
  const fullMinutes = Math.round((hours - fullHours) * 60);
  return fullHours > 0
    ? `${fullHours}h ${fullMinutes}min`
    : `${fullMinutes}min`;
}

export function pluralize(count: number, singular: string, plural: string) {
  return count === 1 ? `1 ${singular}` : `${count} ${plural}`;
}
