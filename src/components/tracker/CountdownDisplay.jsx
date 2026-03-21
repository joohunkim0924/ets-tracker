import React from 'react';

export default function CountdownDisplay({ daysRemaining, hoursRemaining, minutesRemaining, secondsRemaining, etsDate }) {
  const pad = (n) => String(n).padStart(2, '0');

  return (
    <div className="text-center space-y-3">
      <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-inter font-medium">
        DAYS UNTIL ETS
      </span>
      <div className="flex items-baseline justify-center gap-2">
        <span className="text-7xl font-mono font-black text-primary leading-none tracking-tight">
          {daysRemaining}
        </span>
      </div>
      <div className="flex items-center justify-center gap-1 font-mono text-sm text-muted-foreground">
        <span>{pad(hoursRemaining)}</span>
        <span className="text-muted-foreground/40">:</span>
        <span>{pad(minutesRemaining)}</span>
        <span className="text-muted-foreground/40">:</span>
        <span className="text-foreground font-semibold">{pad(secondsRemaining)}</span>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground/50 ml-1">HRS</span>
      </div>
      <span className="text-xs text-muted-foreground font-mono block">
        {etsDate}
      </span>
    </div>
  );
}