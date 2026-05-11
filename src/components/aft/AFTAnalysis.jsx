import React, { useState } from 'react';
import { Sparkles, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { generateAftAnalysis } from '@/api/aftAnalysisClient';

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

const TRAINING_GUIDANCE = {
  deadlift: [
    'Trap-bar or barbell deadlift: 5 sets of 5 reps at challenging weight',
    'Romanian deadlift: 3 sets of 8 reps',
    'Farmer carries: 4 rounds of 40 meters',
    'Sandbag pick-and-carry: 5 rounds of 30 meters',
  ],
  pushups: [
    'Hand-release push-up intervals: 6 rounds of max reps in 45 seconds',
    'Tempo push-ups: 4 sets of 10 reps with a 3-second descent',
    'Incline or banded burnout set: 3 sets to near failure',
    'Plank shoulder taps: 3 sets of 20 total reps',
  ],
  sprint_drag_carry: [
    'Sprint repeats: 6 x 50 meters with 60-90 seconds rest',
    'Sled drag or heavy backward walk: 5 rounds of 25 meters',
    'Lateral shuffle drill: 4 rounds of 20 meters each direction',
    'Kettlebell carry circuit: 4 rounds of 1 minute work',
  ],
  plank: [
    'Front plank holds: 4 rounds of 45-90 seconds',
    'RKC plank: 5 rounds of 20-30 seconds',
    'Side planks: 3 rounds per side',
    'Dead bugs or hollow-body holds: 3 sets of 12-15 reps',
  ],
  two_mile_run: [
    'Interval run: 6 x 400 meters at faster-than-goal pace',
    'Tempo run: 1-2 miles at uncomfortable but sustainable pace',
    'Easy recovery run: 20-30 minutes conversational pace',
    'Hill sprints: 8 rounds of 20 seconds uphill',
  ],
};

function buildWeeklyPlan(focusAreas) {
  const focusLabels = focusAreas.map((event) => event.label.toLowerCase());
  const runFocus = focusLabels.includes('2-mile run');
  const carryFocus = focusLabels.includes('sprint-drag-carry');
  const upperFocus = focusLabels.includes('push-ups');
  const coreFocus = focusLabels.includes('plank');

  return [
    `**Day 1** - Strength focus: deadlift work, loaded carries, and core finisher${carryFocus ? ' with extra drag or shuttle work' : ''}.`,
    `**Day 2** - Running focus: interval session plus easy cooldown jog${runFocus ? ' with goal-pace repeats' : ''}.`,
    `**Day 3** - Upper body and trunk: push-up ladder, shoulder stability, plank progressions${upperFocus || coreFocus ? ' with one extra accessory round' : ''}.`,
    '**Day 4** - Recovery: mobility, light walk, easy bike, and 15 minutes of stretching.',
    '**Day 5** - Full AFT prep circuit: practice transitions, short sprint work, and one event-specific finisher for each weak area.',
  ];
}

function generateOfflineAnalysis(latest, previous, eventSummary) {
  const focusAreas = eventSummary.filter((event) => event.level === 'weak' || event.level === 'moderate');
  const strongAreas = eventSummary.filter((event) => event.level === 'strong');
  const totalDelta = previous ? (latest.total_score || 0) - (previous.total_score || 0) : null;

  const overallAssessment = [
    `Your latest recorded AFT score is **${latest.total_score || 0}**.${totalDelta !== null ? ` That is **${totalDelta >= 0 ? '+' : ''}${totalDelta}** points compared with your previous score.` : ''}`,
    strongAreas.length
      ? `Your strongest events right now are ${strongAreas.map((event) => `**${event.label}**`).join(', ')}. Keep those sharp while you bring the weaker events up.`
      : 'You have room to build across every event, which means consistent training should translate into visible gains quickly.',
  ];

  const priorityFocus = focusAreas.length
    ? focusAreas.map((event) => `### ${event.label}\n${TRAINING_GUIDANCE[event.key].map((item) => `- ${item}`).join('\n')}`)
    : ['All tracked events are in a strong range right now. Focus on maintenance work, recovery, and one full AFT rehearsal every 1-2 weeks.'];

  const nutrition = [
    '- Eat a solid protein serving at each meal to support recovery and strength gains.',
    '- Hydrate early in the day and add electrolytes when training hard in the heat.',
    '- Put most of your carbs around hard run days and sprint-drag-carry sessions.',
    '- Keep one quick field-friendly snack on hand, like jerky, protein bars, or trail mix.',
    '- Prioritize 7+ hours of sleep whenever mission tempo allows, especially before test practice days.',
  ];

  return [
    '## Overall Assessment',
    ...overallAssessment,
    '',
    '## Priority Focus Areas',
    ...priorityFocus,
    '',
    '## Weekly Workout Plan',
    ...buildWeeklyPlan(focusAreas),
    '',
    '## Nutrition & Recovery',
    ...nutrition,
    '',
    '## Motivational Close',
    'Stay consistent, keep the sessions simple, and stack small wins. Even in the field, disciplined work and recovery will move your score in the right direction.',
  ].join('\n');
}

export default function AFTAnalysis({ scores }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [error, setError] = useState('');
  const [model, setModel] = useState('');

  const latest = scores[0];

  if (!latest) return null;

  const eventSummary = EVENTS.map(ev => ({
    label: ev.label,
    pts: latest[ev.pointsKey] ?? null,
    level: getLevel(latest[ev.pointsKey]),
  }));

  const generate = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await generateAftAnalysis({
        latest,
        previous: scores[1],
        eventSummary,
      });
      setAnalysis(result.analysis);
      setModel(result.model || '');
    } catch (apiError) {
      setAnalysis(generateOfflineAnalysis(latest, scores[1], eventSummary));
      setModel('');
      setError(`${apiError.message} Showing local backup analysis.`);
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
          {model && (
            <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-inter">
              Generated with {model}
            </p>
          )}
          {error && (
            <p className="mb-3 rounded-lg border border-accent/30 bg-accent/10 px-3 py-2 text-xs text-muted-foreground font-inter">
              {error}
            </p>
          )}
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
