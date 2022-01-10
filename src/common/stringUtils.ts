export const stringifyScore = (score: number | null) =>
  score == null ? "—" : String(Math.round(score));

const numericEmojis = [
  '0️⃣',
  '1️⃣',
  '2️⃣',
  '3️⃣',
  '4️⃣',
  '5️⃣',
  '6️⃣',
  '7️⃣',
  '8️⃣',
  '9️⃣',
];

const numRegexp = /\d/g;

export function getPositionAsEmoji(position: number): string {
  return position.toString().replace(numRegexp, (numStr) => numericEmojis[+numStr]);
}
