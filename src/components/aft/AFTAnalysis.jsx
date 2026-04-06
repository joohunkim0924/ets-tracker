import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Sparkles, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const EVENTS = [
  { key: 'deadlift', label: 'Deadlift', pointsKey: 'deadlift_points' },
  { key: 'pushups', label: 'Push-Ups', pointsKey: 'pushups_points' },
  { key: 'sprint_drag_carry', label: 'Sprint-Drag-Carry', pointsKey: 'sprint_drag_carry_points' },
  { key: 'plank', label: 'Plank', pointsKey: 'plank_points' },
  { key: 'two_mile_run', label: '2-Mile Run', pointsKey: 'two_mile_run_points' },
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
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(true);

  const latest = scores[0];

  if (!latest) return null;

  const eventSummary = EVENTS.map(ev => ({
    label: ev.label,
    pts: latest[ev.pointsKey] ?? null,
    level: getLevel(latest[ev.pointsKey]),
  }));

  const generate = async () => {
    setLoading(true);
    setAnalysis(null);

    const breakdown = eventSummary
      .map(e => `- ${e.label}: ${e.pts !== null ? `${e.pts} pts (${e.level})` : 'no data'}`)
      .join('\n');

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a US Army fitness coach analyzing a soldier's AFT (Army Fitness Test) results.

Latest scores:
${breakdown}

Score tiers: weak = below 80 pts, moderate = 80–89 pts, strong = 90+ pts.

Provide a personalized, encouraging fitness plan. Structure your response with these sections:
1. **Overall Assessment** — 2-3 sentences of honest encouragement and appreciation for their effort, acknowledging their strengths.
2. **Priority Focus Areas** — For each weak/moderate event, give 3-4 specific exercises or drills to improve it (with sets/reps/duration). Skip strong events.
3. **Weekly Workout Plan** — A 5-day structured weekly schedule targeting the weak areas while maintaining strengths.
4. **Nutrition & Recovery** — 4-5 specific, actionable nutrition tips tailored to the demands of their weak events.
5. **Motivational Close** — 1-2 sentences of genuine encouragement.

Keep it practical, specific, and military-fitness focused. Be direct but supportive. Use markdown formatting.`,
    });

    setAnalysis(result);
    setLoading(false);
  };

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden mt-4">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-inter font-semibold">AI Analysis</span>
        </div>
        <div className="flex items-center gap-2">
          {analysis && (
            <button
              onClick={() => setExpanded(e => !e)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
          <button
            onClick={generate}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-[10px] font-inter font-semibold uppercase tracking-widest disabled:opacity-60"
          >
            {loading ? (
              <div className="w-3 h-3 border border-primary-foreground border-t-transparent rounded-full animate-spin" />
            ) : (
              <RefreshCw className="w-3 h-3" />
            )}
            {analysis ? 'Regenerate' : 'Analyze'}
          </button>
        </div>
      </div>

      {/* Event tier badges */}
      <div className="px-5 py-3 flex flex-wrap gap-2 border-b border-border">
        {eventSummary.map(e => (
          <span
            key={e.label}
            className={`text-[10px] font-inter font-semibold px-2 py-1 rounded-md border ${e.level ? levelColors[e.level] : 'text-muted-foreground bg-secondary border-border'}`}
          >
            {e.label} {e.pts !== null ? `· ${e.pts}` : ''} {e.level ? `· ${levelLabels[e.level]}` : '· NO DATA'}
          </span>
        ))}
      </div>

      {/* Analysis content */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-muted-foreground font-inter">Generating your personalized plan…</p>
        </div>
      )}

      {!loading && !analysis && (
        <div className="px-5 py-8 text-center">
          <p className="text-xs text-muted-foreground font-inter">Tap <strong>Analyze</strong> to generate a personalized workout plan based on your latest scores.</p>
        </div>
      )}

      {!loading && analysis && expanded && (
        <div className="px-5 py-4">
          <ReactMarkdown
            className="text-sm prose prose-sm max-w-none text-foreground [&_h1]:text-sm [&_h1]:font-bold [&_h1]:uppercase [&_h1]:tracking-widest [&_h1]:text-primary [&_h2]:text-sm [&_h2]:font-bold [&_h2]:uppercase [&_h2]:tracking-widest [&_h2]:text-primary [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:space-y-1 [&_li]:text-xs [&_p]:text-xs [&_p]:leading-relaxed"
          >
            {analysis}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}