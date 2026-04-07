import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { format, parseISO } from 'date-fns';
import { Plus, TrendingUp, List, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import BottomNav from '@/components/layout/BottomNav';
import AddScoreModal from '@/components/aft/AddScoreModal';
import AFTAnalysis from '@/components/aft/AFTAnalysis';

const EVENTS = [
  { key: 'deadlift', label: 'Deadlift', pointsKey: 'deadlift_points', unit: 'lbs' },
  { key: 'pushups', label: 'Push-Ups', pointsKey: 'pushups_points', unit: 'reps' },
  { key: 'sprint_drag_carry', label: 'Sprint-Drag-Carry', pointsKey: 'sprint_drag_carry_points', unit: 'sec' },
  { key: 'plank', label: 'Plank', pointsKey: 'plank_points', unit: 'sec' },
  { key: 'two_mile_run', label: '2-Mile Run', pointsKey: 'two_mile_run_points', unit: 'sec' },
];

const TABS = ['OVERVIEW', 'HISTORY', 'EVENTS TREND'];

export default function AFT() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('OVERVIEW');
  const [showAdd, setShowAdd] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [userAge, setUserAge] = useState(null);
  const [userGender, setUserGender] = useState(null);

  const load = async () => {
    const [data, me] = await Promise.all([
      base44.entities.AFTScore.list('-date'),
      base44.auth.me(),
    ]);
    setScores(data);
    setUserAge(me.age || null);
    setUserGender(me.gender || null);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const chartData = [...scores].reverse().map(s => ({
    date: format(parseISO(s.date), 'MMM d'),
    total: s.total_score || 0,
  }));

  const latest = scores[0];
  const previous = scores[1];
  const totalDelta = latest && previous ? (latest.total_score || 0) - (previous.total_score || 0) : null;

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-8 pb-4">
        <h1 className="text-lg font-inter font-bold uppercase tracking-[0.1em]">AFT TRACKER</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex px-6 gap-1 mb-4">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 text-[10px] uppercase tracking-widest font-inter font-semibold rounded-lg transition-colors ${tab === t ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 px-6 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : scores.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <p className="text-muted-foreground font-inter text-sm">No AFT scores yet.</p>
            <button onClick={() => setShowAdd(true)} className="text-primary text-sm font-inter font-semibold">Log your first score →</button>
          </div>
        ) : (
          <>
            {tab === 'OVERVIEW' && (
              <div className="space-y-4">
                {/* Latest score hero */}
                <div className="bg-card rounded-xl border border-border p-5">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-inter mb-1">LATEST SCORE</p>
                  <div className="flex items-end gap-3">
                    <span className="text-6xl font-mono font-black text-primary">{latest?.total_score ?? '—'}</span>
                    {totalDelta !== null && (
                      <span className={`text-sm font-mono font-semibold mb-2 ${totalDelta >= 0 ? 'text-primary' : 'text-destructive'}`}>
                        {totalDelta >= 0 ? '+' : ''}{totalDelta} pts
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground font-mono mt-1">{latest?.date ? format(parseISO(latest.date), 'dd MMM yyyy').toUpperCase() : ''}</p>
                </div>

                {/* Progress chart */}
                {chartData.length > 1 && (
                  <div className="bg-card rounded-xl border border-border p-5">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-inter mb-4">TOTAL SCORE OVER TIME</p>
                    <ResponsiveContainer width="100%" height={160}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                        <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} domain={['auto', 'auto']} />
                        <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                        <Line type="monotone" dataKey="total" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: 'hsl(var(--primary))', r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Event breakdown of latest */}
                <div className="bg-card rounded-xl border border-border p-5">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-inter mb-3">LATEST EVENT BREAKDOWN</p>
                  <div className="space-y-2">
                    {EVENTS.map(ev => {
                      const pts = latest?.[ev.pointsKey] ?? '—';
                      const raw = latest?.[ev.key] ?? '—';
                      return (
                        <div key={ev.key} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                          <span className="text-xs font-inter text-foreground">{ev.label}</span>
                          <div className="flex items-center gap-3 text-right">
                            <span className="text-xs font-mono text-muted-foreground">{raw !== '—' ? `${raw} ${ev.unit}` : '—'}</span>
                            <span className="text-sm font-mono font-bold text-primary w-10 text-right">{pts}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* AI Analysis */}
                <AFTAnalysis scores={scores} />
              </div>
            )}

            {tab === 'HISTORY' && (
              <div className="space-y-3">
                {scores.map(s => (
                  <div key={s.id} className="bg-card rounded-xl border border-border overflow-hidden">
                    <button
                      className="w-full flex items-center justify-between px-5 py-4"
                      onClick={() => setExpandedId(expandedId === s.id ? null : s.id)}
                    >
                      <div className="text-left">
                        <p className="text-xs font-mono text-muted-foreground">{format(parseISO(s.date), 'dd MMM yyyy').toUpperCase()}</p>
                        <p className="text-2xl font-mono font-black text-primary">{s.total_score ?? '—'} <span className="text-xs font-inter font-normal text-muted-foreground">pts</span></p>
                      </div>
                      {expandedId === s.id ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                    </button>
                    {expandedId === s.id && (
                      <div className="px-5 pb-4 space-y-1 border-t border-border pt-3">
                        {EVENTS.map(ev => (
                          <div key={ev.key} className="flex justify-between text-xs py-1">
                            <span className="font-inter text-muted-foreground">{ev.label}</span>
                            <span className="font-mono text-foreground">{s[ev.key] ?? '—'} {ev.unit} · <span className="text-primary font-semibold">{s[ev.pointsKey] ?? '—'} pts</span></span>
                          </div>
                        ))}
                        <button
                          onClick={async () => { await base44.entities.AFTScore.delete(s.id); load(); }}
                          className="mt-2 flex items-center gap-1.5 text-destructive text-[11px] font-inter font-semibold hover:opacity-70 transition-opacity"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete record
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {tab === 'EVENTS TREND' && (
              <div className="space-y-4">
                {EVENTS.map(ev => {
                  const evData = [...scores].reverse().map(s => ({
                    date: format(parseISO(s.date), 'MMM d'),
                    raw: s[ev.key] ?? null,
                    pts: s[ev.pointsKey] ?? null,
                  })).filter(d => d.raw !== null);

                  return (
                    <div key={ev.key} className="bg-card rounded-xl border border-border p-5">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-inter mb-1">{ev.label}</p>
                      {evData.length < 2 ? (
                        <p className="text-xs text-muted-foreground font-inter py-4 text-center">Need 2+ scores to show trend.</p>
                      ) : (
                        <ResponsiveContainer width="100%" height={120}>
                          <LineChart data={evData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="date" tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} />
                            <YAxis tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} domain={['auto', 'auto']} />
                            <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 11 }} formatter={(v) => [`${v} ${ev.unit}`, 'Raw']} />
                            <Line type="monotone" dataKey="raw" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: 'hsl(var(--primary))', r: 3 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {showAdd && <AddScoreModal onClose={() => setShowAdd(false)} onSaved={() => { setShowAdd(false); load(); }} userAge={userAge} userGender={userGender} />}
      <BottomNav />
    </div>
  );
}