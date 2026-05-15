import React from 'react';

export default function StatsCard({ label, value, unit, highlight = undefined }) {
  return (
    <div className="flex min-w-0 max-w-full flex-col gap-1 rounded-xl border border-border bg-card p-card">
      <span className="font-inter font-medium text-[clamp(0.5625rem,2.6vw,0.625rem)] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </span>
      <div className="flex items-baseline gap-1.5">
        <span className={`font-mono text-stat-value ${highlight === 'green' ? 'text-primary' : highlight === 'amber' ? 'text-accent' : highlight === 'red' ? 'text-destructive' : 'text-foreground'}`}>
          {value}
        </span>
        {unit && (
          <span className="font-inter text-[clamp(0.6875rem,3vw,0.75rem)] uppercase tracking-wider text-muted-foreground">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}