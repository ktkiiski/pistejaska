import { Temporal } from "@js-temporal/polyfill";

function parseTimestamp(value: unknown): number | null {
  if (typeof value === "string") {
    return Date.parse(value);
  }
  if (typeof value === "number") {
    return value;
  }
  if (value instanceof Date) {
    return value.getTime();
  }
  return null;
}

export default function parseDate(date: unknown): Temporal.Instant | null {
  const timestamp = parseTimestamp(date);
  if (
    timestamp == null ||
    Number.isNaN(timestamp) ||
    !Number.isFinite(timestamp)
  ) {
    return null;
  }
  return Temporal.Instant.fromEpochMilliseconds(timestamp);
}
