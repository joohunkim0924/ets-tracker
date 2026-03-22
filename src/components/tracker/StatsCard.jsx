import React from 'react';

export default function StatsCard({ label, value, unit, highlight }) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 flex flex-col gap-1">
      <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-inter font-medium">
        {label}
      </span>
      <div className="flex items-baseline gap-1.5">
        <span className={`text-2xl font-mono font-bold ${highlight === 'green' ? 'text-primary' : highlight === 'amber' ? 'text-accent' : highlight === 'red' ? 'text-destructive' : 'text-foreground'}`}>
          {value}
        </span>
        {unit && (
          <span className="text-xs uppercase tracking-wider text-muted-foreground font-inter">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}