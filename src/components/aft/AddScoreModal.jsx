import React, { useState } from 'react';
import { localStore } from '@/lib/offline-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateInput } from '@/components/ui/date-input';
import { X } from 'lucide-react';
import { calculatePoints } from '@/lib/aft-scoring';
import { ALTERNATE_RUN_EVENTS, DEFAULT_ALTERNATE_RUN_EVENT } from '@/lib/aft-alternate-events';
import {
  PROFILE_TYPES,
  PROFILE_OPTIONS,
  PROFILE_PASSING_POINTS,
  createEmptyExemptions,
  isEventExempt,
  computeTotalScore,
  getProfileType,
} from '@/lib/aft-profile';

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
  const profileType = getProfileType(existingScore);
  const exemptions = {
    ...createEmptyExemptions(),
    ...(existingScore?.event_exemptions || {}),
  };

  if (existingScore?.permanent_profile && !existingScore?.event_exemptions) {
    exemptions.two_mile_run = true;
  }

  const form = {
    date: existingScore?.date || new Date().toISOString().split('T')[0],
    profile_type: profileType,
    event_exemptions: exemptions,
    alternate_run_event: existingScore?.alternate_run_event || DEFAULT_ALTERNATE_RUN_EVENT,
    alternate_run_pass: existingScore?.alternate_run_pass !== false,
  };

  if (!existingScore) return form;

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

  const hasProfile = form.profile_type === PROFILE_TYPES.PERMANENT;
  const noProfile = !userAge || !userGender;

  const setExempt = (eventKey, enabled) => {
    setForm(f => {
      const next = {
        ...f,
        event_exemptions: { ...f.event_exemptions, [eventKey]: enabled },
      };
      const ev = EVENTS.find(e => e.key === eventKey);
      if (enabled && ev) {
        if (eventKey === 'two_mile_run') {
          next.two_mile_run = '';
          next.two_mile_run_seconds = null;
          next.two_mile_run_points = f.alternate_run_pass ? PROFILE_PASSING_POINTS : 0;
        } else {
          next[ev.key] = '';
          if (ev.timeInput) next[`${ev.key}_seconds`] = null;
          next[ev.pointsKey] = PROFILE_PASSING_POINTS;
        }
      } else if (!enabled && ev) {
        next[ev.pointsKey] = '';
      }
      return next;
    });
  };

  const setRaw = (ev, value) => {
    if (isEventExempt(form, ev.key)) return;

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
    const payload = {
      date: form.date,
      profile_type: form.profile_type,
      permanent_profile: hasProfile,
      event_exemptions: hasProfile ? form.event_exemptions : null,
    };

    let total = 0;

    EVENTS.forEach(ev => {
      const exempt = hasProfile && form.event_exemptions?.[ev.key];

      if (exempt && ev.key === 'two_mile_run') {
        payload[ev.key] = null;
        payload[ev.pointsKey] = form.alternate_run_pass ? PROFILE_PASSING_POINTS : 0;
        payload.alternate_run_event = form.alternate_run_event;
        payload.alternate_run_pass = form.alternate_run_pass;
        total += payload[ev.pointsKey];
        return;
      }

      if (exempt) {
        payload[ev.key] = null;
        payload[ev.pointsKey] = PROFILE_PASSING_POINTS;
        total += PROFILE_PASSING_POINTS;
        return;
      }

      if (ev.timeInput) {
        const secs = form[`${ev.key}_seconds`];
        if (secs !== null && secs !== undefined) payload[ev.key] = secs;
      } else if (form[ev.key] !== '' && form[ev.key] !== undefined) {
        payload[ev.key] = Number(form[ev.key]);
      }

      const pts = Number(form[ev.pointsKey] || 0);
      payload[ev.pointsKey] = pts;
      total += pts;
    });

    if (!hasProfile) {
      payload.alternate_run_event = null;
      payload.alternate_run_pass = null;
      payload.event_exemptions = null;
      payload.permanent_profile = false;
    }

    payload.total_score = total;

    if (isEditing) {
      await localStore.entities.AFTScore.update(existingScore.id, payload);
    } else {
      await localStore.entities.AFTScore.create(payload);
    }
    setSaving(false);
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end overflow-x-hidden bg-black/50">
      <div className="w-full max-w-full max-h-[min(90dvh,92svh)] overflow-y-auto overflow-x-hidden rounded-t-2xl bg-background p-modal pb-bottom-scroll">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-inter font-bold uppercase tracking-widest">
            {isEditing ? 'EDIT AFT SCORE' : 'LOG AFT SCORE'}
          </h2>
          <button type="button" onClick={onClose}><X className="w-5 h-5 text-muted-foreground" /></button>
        </div>

        <div className="mb-4 space-y-2">
          <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Profile status</Label>
          <div className="grid grid-cols-2 gap-2">
            {PROFILE_OPTIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setForm(f => ({
                  ...f,
                  profile_type: opt.value,
                  event_exemptions: opt.value === PROFILE_TYPES.PERMANENT ? f.event_exemptions : createEmptyExemptions(),
                }))}
                className={`rounded-xl border px-3 py-2.5 text-[10px] font-inter font-semibold uppercase tracking-wider transition-all ${
                  form.profile_type === opt.value
                    ? 'border-primary bg-primary/10 text-primary shadow-sm'
                    : 'border-border bg-secondary text-muted-foreground hover:border-primary/30'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {!noProfile && (
          <div className="mb-4 p-3 bg-primary/5 border border-primary/20 rounded-xl text-xs text-muted-foreground font-inter">
            Auto-calculating for {userGender}, age {userAge}
          </div>
        )}
        {noProfile && !hasProfile && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-xl text-xs text-destructive font-inter">
            Age and gender not set — go to Settings to enable auto point calculation.
          </div>
        )}

        <div className="space-y-2 mb-4">
          <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">TEST DATE</Label>
          <DateInput
            value={form.date}
            onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
            className="bg-secondary border-border"
          />
        </div>

        {EVENTS.map(ev => {
          const exempt = isEventExempt(form, ev.key);
          const runExempt = ev.key === 'two_mile_run' && exempt;

          return (
            <div key={ev.key} className="mb-4 p-4 bg-secondary rounded-xl border border-border">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-xs font-inter font-semibold uppercase tracking-widest text-foreground">{ev.label}</p>
                {hasProfile && (
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-[10px] font-inter font-semibold uppercase tracking-wider text-muted-foreground">Profile</span>
                    <Switch
                      checked={!!form.event_exemptions?.[ev.key]}
                      onCheckedChange={checked => setExempt(ev.key, checked)}
                    />
                  </div>
                )}
              </div>

              {runExempt ? (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Alternate event</Label>
                    <Select
                      value={form.alternate_run_event}
                      onValueChange={val => setForm(f => ({ ...f, alternate_run_event: val }))}
                    >
                      <SelectTrigger className="h-10 bg-background border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ALTERNATE_RUN_EVENTS.map(alt => (
                          <SelectItem key={alt.key} value={alt.key}>{alt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-2.5">
                    <Checkbox
                      id="alternate-run-pass"
                      checked={form.alternate_run_pass}
                      onCheckedChange={checked => setForm(f => ({
                        ...f,
                        alternate_run_pass: checked === true,
                        two_mile_run_points: checked === true ? PROFILE_PASSING_POINTS : 0,
                      }))}
                    />
                    <Label htmlFor="alternate-run-pass" className="text-xs font-inter font-semibold cursor-pointer">
                      Pass ({PROFILE_PASSING_POINTS} pts if checked)
                    </Label>
                  </div>
                  <div className="h-10 px-3 bg-muted/50 border border-border rounded-md flex items-center justify-between font-mono text-sm">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Points</span>
                    <span className="font-bold text-primary">
                      {form.alternate_run_pass ? PROFILE_PASSING_POINTS : 0}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                      RAW ({ev.unit}){exempt ? ' — profile' : ''}
                    </Label>
                    <Input
                      type={ev.timeInput ? 'text' : 'number'}
                      inputMode="numeric"
                      disabled={exempt}
                      placeholder={exempt ? '60 pts (profile)' : ev.timeInput ? 'MM:SS' : '0'}
                      value={exempt ? 'Profile minimum' : (form[ev.key] ?? '')}
                      onChange={e => setRaw(ev, e.target.value)}
                      className="h-10 font-mono bg-background border-border disabled:opacity-70"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">POINTS</Label>
                    <div className="h-10 px-3 bg-muted/50 border border-border rounded-md flex items-center font-mono text-sm text-primary font-bold">
                      {exempt
                        ? PROFILE_PASSING_POINTS
                        : (form[ev.pointsKey] !== '' && form[ev.pointsKey] !== undefined ? form[ev.pointsKey] : '—')}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        <div className="flex items-center justify-between px-4 py-3 bg-primary/10 rounded-xl border border-primary/20 mb-4">
          <span className="text-xs font-inter font-semibold uppercase tracking-widest text-muted-foreground">TOTAL</span>
          <span className="text-2xl font-mono font-black text-primary">
            {computeTotalScore(form, EVENTS)}
          </span>
        </div>

        <Button onClick={handleSave} disabled={saving} className="w-full h-12 font-inter font-semibold uppercase tracking-wider">
          {saving ? <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" /> : isEditing ? 'UPDATE SCORE' : 'SAVE SCORE'}
        </Button>
      </div>
    </div>
  );
}
