import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

const EVENTS = [
  { key: 'deadlift', label: 'Deadlift', unit: 'lbs', pointsKey: 'deadlift_points' },
  { key: 'power_throw', label: 'Standing Power Throw', unit: 'm', pointsKey: 'power_throw_points' },
  { key: 'pushups', label: 'Hand-Release Push-Ups', unit: 'reps', pointsKey: 'pushups_points' },
  { key: 'sprint_drag_carry', label: 'Sprint-Drag-Carry', unit: 'sec', pointsKey: 'sprint_drag_carry_points' },
  { key: 'plank', label: 'Plank', unit: 'sec', pointsKey: 'plank_points' },
  { key: 'two_mile_run', label: '2-Mile Run', unit: 'sec', pointsKey: 'two_mile_run_points' },
];

export default function AddScoreModal({ onClose, onSaved }) {
  const today = new Date().toISOString().split('T')[0];
  const [form, setForm] = useState({ date: today });
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    const payload = { ...form };
    // compute total
    let total = 0;
    EVENTS.forEach(e => { total += Number(payload[e.pointsKey] || 0); });
    payload.total_score = total;
    // convert numerics
    [...EVENTS.map(e => e.key), ...EVENTS.map(e => e.pointsKey)].forEach(k => {
      if (payload[k] !== undefined && payload[k] !== '') payload[k] = Number(payload[k]);
    });
    await base44.entities.AFTScore.create(payload);
    setSaving(false);
    onSaved();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="bg-background w-full rounded-t-2xl p-6 max-h-[90vh] overflow-y-auto pb-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-inter font-bold uppercase tracking-widest">LOG AFT SCORE</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-muted-foreground" /></button>
        </div>

        <div className="space-y-2 mb-4">
          <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">TEST DATE</Label>
          <Input type="date" value={form.date} onChange={e => set('date', e.target.value)} className="h-12 font-mono bg-secondary border-border" />
        </div>

        {EVENTS.map(ev => (
          <div key={ev.key} className="mb-4 p-4 bg-secondary rounded-xl border border-border">
            <p className="text-xs font-inter font-semibold uppercase tracking-widest text-foreground mb-3">{ev.label}</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">RAW ({ev.unit})</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={form[ev.key] || ''}
                  onChange={e => set(ev.key, e.target.value)}
                  className="h-10 font-mono bg-background border-border"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">POINTS</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={form[ev.pointsKey] || ''}
                  onChange={e => set(ev.pointsKey, e.target.value)}
                  className="h-10 font-mono bg-background border-border"
                />
              </div>
            </div>
          </div>
        ))}

        <Button onClick={handleSave} disabled={saving} className="w-full h-12 font-inter font-semibold uppercase tracking-wider">
          {saving ? <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" /> : 'SAVE SCORE'}
        </Button>
      </div>
    </div>
  );
}