import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getPromotionPointsSummary, PROMOTION_TRACKER_UPDATED_EVENT } from '@/lib/promotion-points';

export default function PromotionPointsBar() {
  const location = useLocation();
  const [summary, setSummary] = useState(() => getPromotionPointsSummary());

  useEffect(() => {
    setSummary(getPromotionPointsSummary());
  }, [location.pathname]);

  useEffect(() => {
    const refresh = () => setSummary(getPromotionPointsSummary());
    window.addEventListener(PROMOTION_TRACKER_UPDATED_EVENT, refresh);
    window.addEventListener('focus', refresh);
    return () => {
      window.removeEventListener(PROMOTION_TRACKER_UPDATED_EVENT, refresh);
      window.removeEventListener('focus', refresh);
    };
  }, []);

  if (!summary) return null;

  return (
    <div className="rounded-xl border border-violet-700 bg-violet-950 p-4">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[10px] font-inter uppercase tracking-[0.2em] text-violet-300">Promotion points</p>
        <p className="font-mono text-sm font-bold text-violet-400">
          {summary.total}
          <span className="text-violet-600"> / {summary.max}</span>
        </p>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-violet-900">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-violet-400 shadow-[0_0_10px_rgba(167,139,250,0.5)] transition-all duration-500"
          style={{ width: `${summary.pct}%` }}
        />
      </div>
      <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono text-violet-500">
        <span>0</span>
        <span>{Math.round(summary.pct)}% to max</span>
        <span>{summary.max}</span>
      </div>
      {summary.cutoff > 0 && (
        <p className="mt-2 text-center text-[10px] font-inter text-violet-400">
          {summary.total >= summary.cutoff
            ? `At or above cutoff (${summary.cutoff})`
            : `${summary.cutoff - summary.total} pts to cutoff (${summary.cutoff})`}
        </p>
      )}
    </div>
  );
}
