import React, { useEffect, useState } from 'react';
import { Sparkles, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { analyzeAftWithAi } from '@/api/aiService';

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

const THINKING_STEPS = [
  'Packaging full AFT score history',
  'Measuring total score trend',
  'Comparing event-by-event changes',
  'Finding priority training focus',
  'Building workout and recovery plan',
  'Finalizing Gemini analysis',
];

function formatRawValue(event, value) {
  if (value === null || value === undefined || value === '') return null;
  if (!event.timeBased) return Number(value);

  const totalSeconds = Number(value);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function buildTrendSummary(scores) {
  const chronologicalScores = [...scores].reverse();
  const oldest = chronologicalScores[0];
  const latest = scores[0];
  const previous = scores[1];

  const eventTrends = EVENTS.map((event) => {
    const records = chronologicalScores
      .map((score) => ({
        date: score.date,
        raw: score[event.key] ?? null,
        points: score[event.pointsKey] ?? null,
      }))
      .filter((record) => record.raw !== null || record.points !== null);

    const first = records[0] || null;
    const last = records[records.length - 1] || null;

    return {
      key: event.key,
      label: event.label,
      records,
      first_raw: first ? formatRawValue(event, first.raw) : null,
      latest_raw: last ? formatRawValue(event, last.raw) : null,
      points_delta: first && last && first.points !== null && last.points !== null
        ? Number(last.points) - Number(first.points)
        : null,
      latest_level: getLevel(latest?.[event.pointsKey]),
    };
  });

  return {
    score_count: scores.length,
    date_range: {
      first: oldest?.date || null,
      latest: latest?.date || null,
    },
    total_score: {
      oldest: oldest?.total_score ?? null,
      previous: previous?.total_score ?? null,
      latest: latest?.total_score ?? null,
      delta_from_oldest: oldest && latest ? Number(latest.total_score || 0) - Number(oldest.total_score || 0) : null,
      delta_from_previous: previous && latest ? Number(latest.total_score || 0) - Number(previous.total_score || 0) : null,
    },
    events: eventTrends,
  };
}

function ThinkingProgress({ stepIndex, progress }) {
  const currentStep = THINKING_STEPS[Math.min(stepIndex, THINKING_STEPS.length - 1)];

  return (
    <div className="border-t border-border bg-secondary/60 px-5 py-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-inter font-semibold">
          Thinking
        </span>
        <span className="text-[10px] font-mono text-primary">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-background border border-border">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-muted-foreground font-inter">
        {currentStep}
      </p>
    </div>
  );
}

export default function AFTAnalysis({ scores }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [error, setError] = useState('');
  const [model, setModel] = useState('');
  const [source, setSource] = useState('');
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (!loading) return undefined;

    setProgress(8);
    setStepIndex(0);

    const interval = window.setInterval(() => {
      setProgress((current) => Math.min(current + 9, 94));
      setStepIndex((current) => Math.min(current + 1, THINKING_STEPS.length - 1));
    }, 1400);

    return () => window.clearInterval(interval);
  }, [loading]);

  const latest = scores[0];

  if (!latest) return null;

  const eventSummary = EVENTS.map(ev => ({
    key: ev.key,
    label: ev.label,
    pts: latest[ev.pointsKey] ?? null,
    level: getLevel(latest[ev.pointsKey]),
  }));
  const trendSummary = buildTrendSummary(scores);

  const generate = async () => {
    setLoading(true);
    setError('');
    setExpanded(true);
    setSource('');
    setAnalysis(null);
    setModel('');

    try {
      const result = await analyzeAftWithAi({
        scores,
        latest,
        previous: scores[1],
        eventSummary,
        trendSummary,
      });
      setAnalysis(result.analysis);
      setModel(result.model || '');
      setSource(result.source || '');
      setProgress(100);
      setStepIndex(THINKING_STEPS.length - 1);
    } catch (apiError) {
      setModel('');
      setSource('');
      setError(apiError.message || 'Unable to generate analysis.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden mt-4">
      {/* Header */}
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
            {analysis ? 'Regenerate' : 'Analyze with AI'}
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
        <>
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-muted-foreground font-inter">Generating your personalized plan…</p>
          </div>
          <ThinkingProgress stepIndex={stepIndex} progress={progress} />
        </>
      )}

      {!loading && !analysis && (
        <div className="px-5 py-8 text-center">
          <p className="text-xs text-muted-foreground font-inter">
            Tap <strong>Analyze with AI</strong> for a Master Fitness Trainer–style review, weaknesses, and a{' '}
            <strong>4-week</strong> plan.
          </p>
        </div>
      )}

      {!loading && error && !analysis && (
        <div className="px-5 pb-5">
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive font-inter">
            {error}
          </p>
        </div>
      )}

      {!loading && analysis && expanded && (
        <div className="border-t border-border px-5 py-4">
          {model && (
            <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-inter">
              Model: {model}
              {source ? ` · ${source}` : ''}
            </p>
          )}
          {error && (
            <p className="mb-3 rounded-lg border border-accent/30 bg-accent/10 px-3 py-2 text-xs text-muted-foreground font-inter">
              {error}
            </p>
          )}
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
