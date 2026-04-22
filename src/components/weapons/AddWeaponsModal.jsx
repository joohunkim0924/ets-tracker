import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

const WEAPONS = ['M4', 'M17', 'M18', 'M9', 'M240B', 'M249', 'M2', 'M320', 'AT4', 'Mk19'];
const QUALIFICATIONS = ['Unqualified', 'Marksman', 'Sharpshooter', 'Expert'];

export default function AddWeaponsModal({ onClose, onSaved, existingRecord }) {
  const today = new Date().toISOString().split('T')[0];
  const isEditing = !!existingRecord;

  const [form, setForm] = useState({
    date: existingRecord?.date || today,
    weapon: existingRecord?.weapon || '',
    hits: existingRecord?.hits !== undefined ? String(existingRecord.hits) : '',
    total_rounds: existingRecord?.total_rounds !== undefined ? String(existingRecord.total_rounds) : '',
    score: existingRecord?.score !== undefined ? String(existingRecord.score) : '',
    qualification: existingRecord?.qualification || '',
    range: existingRecord?.range || '',
    notes: existingRecord?.notes || '',
  });
  const [saving, setSaving] = useState(false);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      date: form.date,
      weapon: form.weapon,
      qualification: form.qualification || undefined,
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

  const canSave = form.date && form.weapon;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="bg-background w-full rounded-t-2xl p-6 max-h-[90vh] overflow-y-auto pb-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-inter font-bold uppercase tracking-widest">
            {isEditing ? 'EDIT WEAPONS RECORD' : 'LOG WEAPONS RECORD'}
          </h2>
          <button onClick={onClose}><X className="w-5 h-5 text-muted-foreground" /></button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">DATE</Label>
            <Input type="date" value={form.date} onChange={e => set('date', e.target.value)} className="h-12 font-mono bg-secondary border-border" />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">WEAPON *</Label>
            <Select value={form.weapon} onValueChange={v => set('weapon', v)}>
              <SelectTrigger className="h-12 bg-secondary border-border">
                <SelectValue placeholder="Select weapon..." />
              </SelectTrigger>
              <SelectContent>
                {WEAPONS.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

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

          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">QUALIFICATION</Label>
            <Select value={form.qualification} onValueChange={v => set('qualification', v)}>
              <SelectTrigger className="h-12 bg-secondary border-border">
                <SelectValue placeholder="Select qualification..." />
              </SelectTrigger>
              <SelectContent>
                {QUALIFICATIONS.map(q => <SelectItem key={q} value={q}>{q}</SelectItem>)}
              </SelectContent>
            </Select>
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