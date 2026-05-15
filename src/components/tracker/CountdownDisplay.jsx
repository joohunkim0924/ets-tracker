import React from 'react';

export default function CountdownDisplay({ daysRemaining, hoursRemaining, minutesRemaining, secondsRemaining, etsDate }) {
  const pad = (n) => String(n).padStart(2, '0');

  return (
    <div className="space-y-[clamp(0.5rem,2.2vmin,0.75rem)] text-center">
      <span className="font-inter font-medium text-[clamp(0.5625rem,2.6vw,0.625rem)] uppercase tracking-[0.2em] text-muted-foreground">
        DAYS UNTIL ETS
      </span>
      <div className="flex items-baseline justify-center gap-[clamp(0.25rem,1.5vw,0.5rem)]">
        <span className="font-mono leading-none tracking-tight text-countdown text-primary">
          {daysRemaining}
        </span>
      </div>
      <div className="flex items-center justify-center gap-1 font-mono text-[clamp(0.78rem,3.4vw,0.875rem)] text-muted-foreground">
        <span>{pad(hoursRemaining)}</span>
        <span className="text-muted-foreground/40">:</span>
        <span>{pad(minutesRemaining)}</span>
        <span className="text-muted-foreground/40">:</span>
        <span className="font-semibold text-foreground">{pad(secondsRemaining)}</span>
        <span className="ml-1 font-inter text-[clamp(0.5625rem,2.5vw,0.625rem)] uppercase tracking-widest text-muted-foreground/50">
          HRS
        </span>
      </div>
      <span className="block font-mono text-[clamp(0.6875rem,3.1vw,0.75rem)] text-muted-foreground">
        {etsDate}
      </span>
    </div>
  );
}