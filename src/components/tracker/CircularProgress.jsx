import React, { useEffect, useState } from 'react';

export default function CircularProgress({ percentage, patchSrc, patchAlt }) {
  const [patchFailed, setPatchFailed] = useState(false);
  const size = 280;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  useEffect(() => {
    setPatchFailed(false);
  }, [patchSrc]);

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--secondary))"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          style={{
            filter: 'drop-shadow(0 0 8px hsl(142 69% 58% / 0.3))',
          }}
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden rounded-full">
        <div className="absolute inset-8 rounded-full bg-background/70 border border-border/60" />
        <div className="absolute inset-0 flex items-center justify-center">
          {patchSrc && !patchFailed ? (
            <img
              key={patchSrc}
              src={patchSrc}
              alt={patchAlt || ''}
              className="w-36 h-36 object-contain opacity-80"
              style={{ filter: 'drop-shadow(0 8px 18px hsl(var(--background) / 0.55))' }}
              loading="eager"
              decoding="async"
              referrerPolicy="no-referrer"
              onError={() => setPatchFailed(true)}
            />
          ) : patchAlt ? (
            <div className="w-24 h-24 rounded-full border border-primary/20 bg-primary/10 flex items-center justify-center px-3 text-center">
              <span className="text-sm font-inter font-black text-primary uppercase tracking-widest">
                {patchAlt.replace(' unit patch', '')}
              </span>
            </div>
          ) : null}
        </div>
        <div className="relative z-10 mt-36 flex flex-col items-center rounded-full bg-background/85 px-5 py-2 border border-border/70 shadow-sm">
          <span className="text-2xl font-mono font-bold text-foreground tracking-tight">
            {percentage.toFixed(8)}%
          </span>
          <span className="text-[10px] font-inter uppercase tracking-widest text-muted-foreground mt-1">
            COMPLETE
          </span>
        </div>
      </div>
    </div>
  );
}
