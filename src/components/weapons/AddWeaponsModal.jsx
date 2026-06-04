import React, { useMemo, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateInput } from '@/components/ui/date-input';
import { X } from 'lucide-react';
import { deriveQualification } from '@/lib/weapons-qualification';
import { ALL_WEAPONS, OPTIC_TYPES, isRifleWeapon } from '@/lib/weapons-data';

const QUAL_COLORS = {
  Unqualified: 'text-destructive',
  Marksman: 'text-muted-foreground',
  Sharpshooter: 'text-amber-600',
  Expert: 'text-primary',
};

export default function AddWeaponsModal({ onClose, onSaved, existingRecord = null }) {
  const today = new Date().toISOString().split('T')[0];
  const isEditing = !!existingRecord;

  const [form, setForm] = useState({
    date: existingRecord?.date || today,
    weapon: existingRecord?.weapon || '',
    optic_type: existingRecord?.optic_type || '',
    hits: existingRecord?.hits !== undefined ? String(existingRecord.hits) : '',
    total_rounds: existingRecord?.total_rounds !== undefined ? String(existingRecord.total_rounds) : '',
    score: existingRecord?.score !== undefined ? String(existingRecord.score) : '',
    range: existingRecord?.range || '',
    notes: existingRecord?.notes || '',
  });
  const [saving, setSaving] = useState(false);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const showOptic = isRifleWeapon(form.weapon);

  const computedQualification = useMemo(
    () => deriveQualification({
      hits: form.hits,
      total_rounds: form.total_rounds,
      score: form.score,
    }),
    [form.hits, form.total_rounds, form.score]
  );

  const handleSave = async () => {
    setSaving(true);
    const qualification = computedQualification || undefined;
    const payload = {
      date: form.date,
      weapon: form.weapon,
      qualification,
      optic_type: showOptic && form.optic_type ? form.optic_type : undefined,
      range: form.range || undefined,
      notes: form.notes || undefined,
    };
    if (form.hits !== '') payload.hits = Number(form.hits);
    if (form.total_rounds !== '') payload.total_rounds = Number(form.total_rounds);
    if (form.score !== '') payload.score = Math.max(0, Number(form.score));

    if (isEditing) {
      await base44.entities.WeaponsRecord.update(existingRecord.id, payload);
    } else {
      await base44.entities.WeaponsRecord.create(payload);
    }
    setSaving(false);
    onSaved();
  };

  const canSave = form.date && form.weapon && (!showOptic || form.optic_type);

  return (
    <div className="fixed inset-0 z-50 flex items-end overflow-x-hidden bg-black/50">
      <div className="w-full max-w-full max-h-[min(90dvh,92svh)] overflow-y-auto overflow-x-hidden rounded-t-2xl bg-background p-modal pb-bottom-scroll">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-inter font-bold uppercase tracking-widest">
            {isEditing ? 'EDIT WEAPONS RECORD' : 'LOG WEAPONS RECORD'}
          </h2>
          <button type="button" onClick={onClose}><X className="w-5 h-5 text-muted-foreground" /></button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">DATE</Label>
            <DateInput
              value={form.date}
              onChange={e => set('date', e.target.value)}
              className="bg-secondary border-border"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">WEAPON *</Label>
            <Select
              value={form.weapon}
              onValueChange={v => setForm(f => ({
                ...f,
                weapon: v,
                optic_type: isRifleWeapon(v) ? f.optic_type : '',
              }))}
            >
              <SelectTrigger className="h-12 bg-secondary border-border">
                <SelectValue placeholder="Select weapon..." />
              </SelectTrigger>
              <SelectContent>
                {ALL_WEAPONS.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {showOptic && (
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">OPTIC TYPE *</Label>
              <Select value={form.optic_type} onValueChange={v => set('optic_type', v)}>
                <SelectTrigger className="h-12 bg-secondary border-border">
                  <SelectValue placeholder="Select optic..." />
                </SelectTrigger>
                <SelectContent>
                  {OPTIC_TYPES.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">HITS</Label>
              <Input type="number" placeholder="36" value={form.hits} onChange={e => set('hits', e.target.value)} className="h-12 font-mono bg-secondary border-border" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">TOTAL ROUNDS</Label>
              <Input type="number" placeholder="40" value={form.total_rounds} onChange={e => set('total_rounds', e.target.value)} className="h-12 font-mono bg-secondary border-border" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">SCORE (optional)</Label>
            <Input type="number" min="0" placeholder="e.g. 36" value={form.score} onChange={e => set('score', e.target.value)} className="h-12 font-mono bg-secondary border-border" />
          </div>

          <div className="rounded-xl border border-border bg-secondary px-4 py-3">
            <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">QUALIFICATION (auto)</Label>
            <p className={`mt-1 text-sm font-inter font-bold uppercase tracking-wider ${QUAL_COLORS[computedQualification] || 'text-muted-foreground'}`}>
              {computedQualification ?? 'Enter hits or score'}
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">RANGE / LOCATION (optional)</Label>
            <Input placeholder="e.g. Range 14" value={form.range} onChange={e => set('range', e.target.value)} className="h-12 bg-secondary border-border" />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">NOTES (optional)</Label>
            <Input placeholder="Any notes..." value={form.notes} onChange={e => set('notes', e.target.value)} className="h-12 bg-secondary border-border" />
          </div>

          <Button onClick={handleSave} disabled={saving || !canSave} className="w-full h-12 font-inter font-semibold uppercase tracking-wider mt-2">
            {saving ? <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" /> : isEditing ? 'UPDATE RECORD' : 'SAVE RECORD'}
          </Button>
        </div>
      </div>
    </div>
  );
}
