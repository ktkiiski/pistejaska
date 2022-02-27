import React, { useEffect, useState } from "react";
import { Temporal } from "@js-temporal/polyfill";

interface DurationCounterProps {
  startTime: number;
}

function DurationCounter({ startTime }: DurationCounterProps) {
  const [renderDate, setRenderDate] = useState(
    Temporal.Now.instant().epochSeconds
  );
  useEffect(() => {
    const interval = setInterval(() => {
      setRenderDate(Temporal.Now.instant().epochSeconds);
    });
    return () => clearInterval(interval);
  }, []);

  const duration = Temporal.Instant.fromEpochSeconds(renderDate).since(
    Temporal.Instant.fromEpochSeconds(startTime),
    { largestUnit: "hour" }
  );

  const durations = [duration.hours, duration.minutes, duration.seconds].map(
    (unit) => String(unit).padStart(2, "0")
  );

  return <span>{durations.join(":")}</span>;
}
export default DurationCounter;
