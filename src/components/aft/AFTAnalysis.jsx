import React, { useState } from 'react';
import { Sparkles, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const EVENTS = [
  { key: 'deadlift', label: 'Deadlift', pointsKey: 'deadlift_points', timeBased: false },
  { key: 'pushups', label: 'Push-Ups', pointsKey: 'pushups_points', timeBased: false },
  { key: 'sprint_drag_carry', label: 'Sprint-Drag-Carry', pointsKey: 'sprint_drag_carry_points', timeBased: true },
  { key: 'plank', label: 'Plank', pointsKey: 'plank_points', timeBased: true },
  { key: 'two_mile_run', label: '2-Mile Run', pointsKey: 'two_mile_run_points', timeBased: true },
];

function getLevel(pts) {
  if (pts === null || pts === undefined) return null;
  if (pts < 80) return 'weak';
  if (pts < 90) return 'moderate';
  return 'strong';
}

const levelColors = {
  weak: 'text-destructive bg-destructive/10 border-destructive/20',
  moderate: 'text-accent-foreground bg-accent/20 border-accent/30',
  strong: 'text-primary bg-primary/10 border-primary/20',
};

const levelLabels = { weak: 'WEAK', moderate: 'MODERATE', strong: 'STRONG' };

export default function AFTAnalysis({ scores }) {
  const [analysis, setAnalysis] = useState(null);
  const [expanded, setExpanded] = useState(true);
  const [comingSoon, setComingSoon] = useState(false);

  const latest = scores[0];

  if (!latest) return null;

  const eventSummary = EVENTS.map((ev) => ({
    key: ev.key,
    label: ev.label,
    pts: latest[ev.pointsKey] ?? null,
    level: getLevel(latest[ev.pointsKey]),
  }));

  const showComingSoon = () => {
    setComingSoon(true);
    setExpanded(true);
    setAnalysis(null);
  };

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden mt-4">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-inter font-semibold">
            MFT AI Analysis
          </span>
        </div>
        <div className="flex items-center gap-2">
          {analysis && (
            <button
              type="button"
              onClick={() => setExpanded((e) => !e)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
          <button
            type="button"
            onClick={showComingSoon}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-[10px] font-inter font-semibold uppercase tracking-widest"
          >
            <RefreshCw className="w-3 h-3" />
            Analyze with AI
          </button>
        </div>
      </div>

      <div className="px-5 py-3 flex flex-wrap gap-2 border-b border-border">
        {eventSummary.map((e) => (
          <span
            key={e.label}
            className={`text-[10px] font-inter font-semibold px-2 py-1 rounded-md border ${e.level ? levelColors[e.level] : 'text-muted-foreground bg-secondary border-border'}`}
          >
            {e.label} {e.pts !== null ? `· ${e.pts}` : ''} {e.level ? `· ${levelLabels[e.level]}` : '· NO DATA'}
          </span>
        ))}
      </div>

      {!comingSoon && !analysis && (
        <div className="px-5 py-8 text-center">
          <p className="text-xs text-muted-foreground font-inter">
            Tap <strong>Analyze with AI</strong> for a Master Fitness Trainer–style review, weaknesses, and a{' '}
            <strong>4-week</strong> plan.
          </p>
        </div>
      )}

      {comingSoon && !analysis && (
        <div className="px-5 py-8 text-center">
          <div className="mx-auto max-w-sm rounded-xl border border-primary/25 bg-primary/10 px-4 py-5">
            <p className="text-sm font-inter font-semibold text-primary">
              Feature coming soon!
            </p>
            <p className="mt-2 text-xs text-muted-foreground font-inter leading-relaxed">
              AI analysis isn&apos;t available yet. We&apos;re working on it — check back in a future update.
            </p>
          </div>
        </div>
      )}

      {analysis && expanded && (
        <div className="border-t border-border px-5 py-4">
          <div className="rounded-xl border border-border bg-secondary/25">
            <p className="border-b border-border px-4 py-2 text-[10px] font-inter font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Analysis
            </p>
            <div className="max-h-[min(58vh,32rem)] overflow-y-auto overscroll-y-contain px-4 py-3">
              <div className="text-sm max-w-none text-foreground [&_h1]:text-sm [&_h1]:font-bold [&_h1]:uppercase [&_h1]:tracking-widest [&_h1]:text-primary [&_h2]:mt-4 [&_h2]:text-sm [&_h2]:font-bold [&_h2]:uppercase [&_h2]:tracking-widest [&_h2]:text-primary [&_h3]:text-xs [&_h3]:font-semibold [&_h3]:text-foreground [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-4 [&_li]:text-xs [&_li]:my-0.5 [&_p]:text-xs [&_p]:my-2 [&_p]:leading-relaxed [&_code]:rounded [&_code]:bg-background [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[10px]">
                <ReactMarkdown>{analysis}</ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
