import { Temporal } from "@js-temporal/polyfill";

const timeZone = Temporal.Now.timeZone();

export const getTodayAsString = () => Temporal.Now.plainDateISO().toString();

export const convertToPlainDate = (instant: Temporal.Instant) => {
  const zonedDateTime = instant.toZonedDateTimeISO(timeZone);
  return Temporal.PlainDate.from(zonedDateTime);
};

export const convertToPlainTime = (instant: Temporal.Instant) => {
  const zonedDateTime = instant.toZonedDateTimeISO(timeZone);
  return Temporal.PlainTime.from(zonedDateTime);
};

export const convertToLocaleDateString = (
  instant: Temporal.Instant,
  options?: Intl.DateTimeFormatOptions
) => {
  if (!instant) {
    return "";
  }
  return convertToPlainDate(instant).toLocaleString(undefined, options);
};

export const convertToLocaleTimeString = (
  instant: Temporal.Instant,
  options?: Intl.DateTimeFormatOptions
) => {
  if (!instant) {
    return "";
  }
  return convertToPlainTime(instant).toLocaleString(undefined, options);
};
