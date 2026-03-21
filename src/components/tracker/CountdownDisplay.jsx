import React from 'react';

export default function CountdownDisplay({ daysRemaining, etsDate }) {
  return (
    <div className="text-center space-y-1">
      <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-inter font-medium">
        DAYS UNTIL ETS
      </span>
      <div className="flex items-baseline justify-center gap-2">
        <span className="text-7xl font-mono font-black text-primary leading-none tracking-tight">
          {daysRemaining}
        </span>
      </div>
      <span className="text-xs text-muted-foreground font-mono">
        {etsDate}
      </span>
    </div>
  );
}