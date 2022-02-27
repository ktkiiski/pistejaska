import { Temporal } from "@js-temporal/polyfill";

const timeZone = Temporal.Now.timeZone();

export const getTodayAsString = () => Temporal.Now.plainDateISO().toString();
export const convertToLocaleDateString = (instant: Temporal.Instant) => {
  if (!instant) {
    return "";
  }
  const zonedDateTime = instant.toZonedDateTimeISO(timeZone);
  const plainDate = Temporal.PlainDate.from(zonedDateTime);

  return plainDate.toLocaleString();
};

export const convertToLocaleTimeString = (instant: Temporal.Instant) => {
  if (!instant) {
    return "";
  }

  const zonedDateTime = instant.toZonedDateTimeISO(timeZone);
  const plainTime = Temporal.PlainTime.from(zonedDateTime);

  return plainTime.toLocaleString();
};
