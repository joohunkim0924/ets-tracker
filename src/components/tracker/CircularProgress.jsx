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
        {patchSrc && !patchFailed && (
          <img
            src={patchSrc}
            alt={patchAlt || ''}
            className="absolute w-28 h-28 object-contain opacity-[0.18]"
            style={{ filter: 'grayscale(15%) saturate(90%)' }}
            loading="eager"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={() => setPatchFailed(true)}
          />
        )}
        <span className="relative z-10 text-3xl font-mono font-bold text-foreground tracking-tight">
          {percentage.toFixed(8)}%
        </span>
        <span className="relative z-10 text-xs font-inter uppercase tracking-widest text-muted-foreground mt-2">
          COMPLETE
        </span>
      </div>
    </div>
  );
}
