import React, { useEffect, useState } from "react";

interface DurationCounterProps {
    startTime: Date;
}

function DurationCounter({ startTime }: DurationCounterProps) {
    const [renderDate, setRenderDate] = useState(new Date());
    useEffect(() => {
        const interval = setInterval(() => {
            setRenderDate(new Date());
        });
        return () => clearInterval(interval);
    }, []);

    const duration = Math.max(renderDate.getTime() - startTime.getTime(), 0);
    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const hoursStr = String(hours).padStart(2, '0');
    const minutesStr = String(minutes % 60).padStart(2, '0');
    const secondsStr = String(seconds % 60).padStart(2, '0');
    return (
        <span>{hoursStr}:{minutesStr}:{secondsStr}</span>
    );
}

export default DurationCounter;
