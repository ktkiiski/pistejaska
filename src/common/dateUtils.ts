import { Temporal } from "@js-temporal/polyfill";

export const getTodayAsString = () => Temporal.Now.plainDateISO().toString();
export const convertToLocaleDateString = (instant: Temporal.Instant) => {
  const timeZone = Temporal.Now.timeZone();
  const zonedDateTime = instant.toZonedDateTimeISO(timeZone);
  const plainDate = Temporal.PlainDate.from(zonedDateTime);

  return plainDate.toLocaleString();
};
