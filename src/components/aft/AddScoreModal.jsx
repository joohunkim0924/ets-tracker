import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { calculatePoints } from '@/lib/aft-scoring';

const EVENTS = [
  { key: 'deadlift', label: 'Deadlift', unit: 'lbs', pointsKey: 'deadlift_points', timeInput: false },
  { key: 'pushups', label: 'Hand-Release Push-Ups', unit: 'reps', pointsKey: 'pushups_points', timeInput: false },
  { key: 'sprint_drag_carry', label: 'Sprint-Drag-Carry', unit: 'MM:SS', pointsKey: 'sprint_drag_carry_points', timeInput: true },
  { key: 'plank', label: 'Plank', unit: 'MM:SS', pointsKey: 'plank_points', timeInput: true },
  { key: 'two_mile_run', label: '2-Mile Run', unit: 'MM:SS', pointsKey: 'two_mile_run_points', timeInput: true },
];

function parseMMSS(str) {
  if (!str || !str.includes(':')) return null;
  const [mPart, sPart] = str.split(':');
  if (sPart === undefined || sPart === '') return null;
  const m = Number(mPart);
  const s = Number(sPart);
  if (isNaN(m) || isNaN(s)) return null;
  return m * 60 + s;
}

/**
 * While typing MM:SS without a colon: after two minute digits, insert ":" before seconds
 * (e.g. "123" -> "12:3"). If user already typed ":", keep their minute/second digit groups.
 */
function normalizeMmSsInput(raw) {
  if (raw === '') return '';
  const firstColon = raw.indexOf(':');
  if (firstColon !== -1) {
    const before = raw.slice(0, firstColon).replace(/\D/g, '').slice(0, 3);
    const after = raw.slice(firstColon + 1).replace(/\D/g, '').slice(0, 2);
    return `${before}:${after}`;
  }
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 0) return '';
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}:${digits.slice(2, 4)}`;
}

function formatMMSS(secs) {
  if (secs === null || secs === undefined) return '';
  const m = Math.floor(Number(secs) / 60);
  const s = Number(secs) % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function buildInitialForm(existingScore) {
  if (!existingScore) return { date: new Date().toISOString().split('T')[0] };
  const form = { date: existingScore.date };
  EVENTS.forEach(ev => {
    const raw = existingScore[ev.key];
    if (raw !== undefined && raw !== null) {
      form[ev.key] = ev.timeInput ? formatMMSS(raw) : String(raw);
      if (ev.timeInput) form[`${ev.key}_seconds`] = raw;
    }
    const pts = existingScore[ev.pointsKey];
    if (pts !== undefined && pts !== null) form[ev.pointsKey] = pts;
  });
  return form;
}

export default function AddScoreModal({ onClose, onSaved, userAge, userGender, existingScore = null }) {
  const [form, setForm] = useState(() => buildInitialForm(existingScore));
  const [saving, setSaving] = useState(false);
  const isEditing = !!existingScore;

  const setRaw = (ev, value) => {
    const age = userAge ? Number(userAge) : null;
    const gender = userGender ? String(userGender).toLowerCase() : null;

    let rawSeconds = null;
    let displayValue = value;
    if (ev.timeInput) {
      displayValue = normalizeMmSsInput(value);
      rawSeconds = parseMMSS(displayValue);
    } else {
      rawSeconds = value === '' ? null : Number(value);
    }

    const pts = (rawSeconds !== null && age && gender)
      ? calculatePoints(ev.key, gender, age, rawSeconds)
      : '';

    setForm(f => ({
      ...f,
      [ev.key]: displayValue,
      [`${ev.key}_seconds`]: rawSeconds,
      [ev.pointsKey]: pts !== null && pts !== undefined ? pts : '',
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = { date: form.date };
    let total = 0;
    EVENTS.forEach(ev => {
      if (ev.timeInput) {
        const secs = form[`${ev.key}_seconds`];
        if (secs !== null && secs !== undefined) payload[ev.key] = secs;
      } else {
        if (form[ev.key] !== '' && form[ev.key] !== undefined) payload[ev.key] = Number(form[ev.key]);
      }
      const pts = Number(form[ev.pointsKey] || 0);
      payload[ev.pointsKey] = pts;
      total += pts;
    });
    payload.total_score = total;

    if (isEditing) {
      await base44.entities.AFTScore.update(existingScore.id, payload);
    } else {
      await base44.entities.AFTScore.create(payload);
    }
    setSaving(false);
    onSaved();
  };

  const noProfile = !userAge || !userGender;

  return (
    <div className="fixed inset-0 z-50 flex items-end overflow-x-hidden bg-black/50">
      <div className="w-full max-w-full max-h-[min(90dvh,92svh)] overflow-y-auto overflow-x-hidden rounded-t-2xl bg-background p-modal pb-bottom-scroll">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-inter font-bold uppercase tracking-widest">
            {isEditing ? 'EDIT AFT SCORE' : 'LOG AFT SCORE'}
          </h2>
          <button onClick={onClose}><X className="w-5 h-5 text-muted-foreground" /></button>
        </div>

        {noProfile ? (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-xl text-xs text-destructive font-inter">
            ⚠️ Age and gender not set — go to Settings to enable auto point calculation.
          </div>
        ) : (
          <div className="mb-4 p-3 bg-primary/5 border border-primary/20 rounded-xl text-xs text-muted-foreground font-inter">
            Auto-calculating for {userGender}, age {userAge}
          </div>
        )}

        <div className="space-y-2 mb-4">
          <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">TEST DATE</Label>
          <Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="h-12 font-mono bg-secondary border-border" />
        </div>

        {EVENTS.map(ev => (
          <div key={ev.key} className="mb-4 p-4 bg-secondary rounded-xl border border-border">
            <p className="text-xs font-inter font-semibold uppercase tracking-widest text-foreground mb-3">{ev.label}</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">RAW ({ev.unit})</Label>
                <Input
                  type={ev.timeInput ? 'text' : 'number'}
                  inputMode={ev.timeInput ? 'numeric' : 'numeric'}
                  pattern={ev.timeInput ? '[0-9:]*' : '[0-9]*'}
                  placeholder={ev.timeInput ? 'MM:SS (e.g. 12:30)' : '0'}
                  value={form[ev.key] ?? ''}
                  onChange={e => setRaw(ev, e.target.value)}
                  className="h-10 font-mono bg-background border-border"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">POINTS {!noProfile ? '(auto)' : ''}</Label>
                <div className="h-10 px-3 bg-muted/50 border border-border rounded-md flex items-center font-mono text-sm text-primary font-bold">
                  {form[ev.pointsKey] !== '' && form[ev.pointsKey] !== undefined ? form[ev.pointsKey] : '—'}
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="flex items-center justify-between px-4 py-3 bg-primary/10 rounded-xl border border-primary/20 mb-4">
          <span className="text-xs font-inter font-semibold uppercase tracking-widest text-muted-foreground">TOTAL</span>
          <span className="text-2xl font-mono font-black text-primary">
            {EVENTS.reduce((sum, ev) => sum + Number(form[ev.pointsKey] || 0), 0)}
          </span>
        </div>

        <Button onClick={handleSave} disabled={saving} className="w-full h-12 font-inter font-semibold uppercase tracking-wider">
          {saving ? <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" /> : isEditing ? 'UPDATE SCORE' : 'SAVE SCORE'}
        </Button>
      </div>
    </div>
  );
}