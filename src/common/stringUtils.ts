export const stringifyScore = (score: number | null) =>
  score == null ? "—" : String(Math.round(score));

export function renderPercentage(count: number, max: number) {
  const percentage = Math.round((count / max) * 100);
  if (Number.isNaN(percentage) || !Number.isFinite(percentage)) {
    return "–";
  }
  return `${percentage}% (${count})`;
}

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

export function formatNthNumber(num: number): string {
  if (!Number.isFinite(num)) return "–";
  const str = num.toString();
  const lastDigit = str.charAt(str.length - 1);
  switch (lastDigit) {
    case "1":
      return `${str}st`;
    case "2":
      return `${str}nd`;
    case "3":
      return `${str}rd`;
    default:
      return `${str}th`;
  }
}

// Regexp that tests if the string contains just "emojis" and nothing else
let containsJustEmojisRegexp: RegExp | undefined;
try {
  containsJustEmojisRegexp = /^\p{Extended_Pictographic}+$/u;
} catch {
  // Browser does not support this kind of modern regexp
}

export function containsJustEmojis(str: string) {
  return containsJustEmojisRegexp?.test(str);
}
