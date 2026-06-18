import React, { useState } from 'react';

export default function CircularProgress({ percentage, unitPatchSrc, unitPatchAlt }) {
  const [patchFailed, setPatchFailed] = useState(false);
  const size = 280;
  const strokeWidth = size * (10 / 280);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="ring-progress-root relative flex aspect-square h-ring w-ring shrink-0 items-center justify-center">
      {unitPatchSrc && !patchFailed && (
        <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
          <img
            src={unitPatchSrc}
            alt={unitPatchAlt || ''}
            className="aspect-square h-[86%] w-[86%] max-h-[86%] max-w-[86%] object-contain object-center opacity-[0.16]"
            style={{
              filter: 'grayscale(20%) saturate(85%)',
            }}
            loading="eager"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={() => setPatchFailed(true)}
          />
        </div>
      )}
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="relative z-[1] h-full w-full -rotate-90"
        preserveAspectRatio="xMidYMid meet"
      >
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
            filter: 'drop-shadow(0 0 8px hsl(var(--primary) / 0.4))',
          }}
        />
      </svg>
      {/* Center content */}
      <div className="pointer-events-none absolute inset-0 z-[2] flex flex-col items-center justify-center px-[4%]">
        <span className="ring-progress-pct max-w-[92%] break-words text-center font-mono text-foreground">
          {percentage.toFixed(1)}%
        </span>
        <span className="ring-progress-label mt-[0.12em] max-w-[90%] text-center font-inter uppercase text-muted-foreground">
          COMPLETE
        </span>
      </div>
    </div>
  );
}
