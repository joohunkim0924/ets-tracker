import React from 'react';

/** Decimal places for live contract % (updates with sub-second dashboard clock). */
const CONTRACT_PCT_DECIMALS = 11;

export default function CountdownDisplay({
  daysRemaining,
  hoursRemaining,
  minutesRemaining,
  secondsRemaining,
  etsDate,
  contractPercentage = null,
}) {
  const pad = (n) => String(n).padStart(2, '0');
  const pct =
    contractPercentage !== null && contractPercentage !== undefined
      ? Math.min(Math.max(contractPercentage, 0), 100)
      : null;

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

      {pct !== null && (
        <div className="mx-auto w-full max-w-[min(100%,22rem)] pt-2 text-left">
          <div className="mb-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-muted-foreground">0%</span>
              <span className="text-[10px] font-mono text-muted-foreground">100%</span>
            </div>
            <p className="mt-1 text-center font-mono text-[clamp(0.5rem,2.4vw,0.625rem)] font-bold leading-tight tabular-nums tracking-tight text-primary">
              {pct.toFixed(CONTRACT_PCT_DECIMALS)}%
            </p>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-75 ease-linear"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-1 text-center text-[10px] font-inter uppercase tracking-[0.15em] text-muted-foreground/70">
            Contract complete
          </p>
        </div>
      )}
    </div>
  );
}