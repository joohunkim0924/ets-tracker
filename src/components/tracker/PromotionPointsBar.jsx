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
    <div className="promotion-panel rounded-xl p-4">
      <div className="mb-2 flex items-center justify-between">
        <p className="promotion-label">Promotion points</p>
        <p className="font-mono text-sm font-bold promotion-accent">
          {summary.total}
          <span className="promotion-accent-muted"> / {summary.max}</span>
        </p>
      </div>
      <div className="promotion-progress-track h-3">
        <div className="promotion-progress-fill-gradient" style={{ width: `${summary.pct}%` }} />
      </div>
      <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono promotion-accent-muted">
        <span>0</span>
        <span>{Math.round(summary.pct)}% to max</span>
        <span>{summary.max}</span>
      </div>
      {summary.cutoff > 0 && (
        <p className="mt-2 text-center text-[10px] font-inter promotion-accent">
          {summary.total >= summary.cutoff
            ? `At or above cutoff (${summary.cutoff})`
            : `${summary.cutoff - summary.total} pts to cutoff (${summary.cutoff})`}
        </p>
      )}
    </div>
  );
}
