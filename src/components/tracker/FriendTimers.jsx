import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { format, parseISO } from 'date-fns';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function AddFriendModal({ onClose, onSaved }) {
  const [form, setForm] = useState({ name: '', ets_date: '', rank: '', unit: '' });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    await base44.entities.Friend.create({ name: form.name, ets_date: form.ets_date, rank: form.rank || undefined, unit: form.unit || undefined });
    setSaving(false);
    onSaved();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="bg-background w-full rounded-t-2xl p-6 space-y-4 pb-10">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-inter font-bold uppercase tracking-widest">ADD FRIEND</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-muted-foreground" /></button>
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">NAME *</Label>
          <Input placeholder="e.g. SGT Smith" value={form.name} onChange={e => set('name', e.target.value)} className="h-12 bg-secondary border-border" />
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">ETS DATE *</Label>
          <Input type="date" value={form.ets_date} onChange={e => set('ets_date', e.target.value)} className="h-12 font-mono bg-secondary border-border" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">RANK</Label>
            <Input placeholder="e.g. SPC" value={form.rank} onChange={e => set('rank', e.target.value)} className="h-12 bg-secondary border-border" />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">UNIT</Label>
            <Input placeholder="e.g. 1-9 CAV" value={form.unit} onChange={e => set('unit', e.target.value)} className="h-12 bg-secondary border-border" />
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving || !form.name || !form.ets_date} className="w-full h-12 font-inter font-semibold uppercase tracking-wider">
          {saving ? <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" /> : 'ADD FRIEND'}
        </Button>
      </div>
    </div>
  );
}

function FriendCard({ friend, now, onDelete }) {
  const etsDate = parseISO(friend.ets_date);
  const msRemaining = Math.max(etsDate - now, 0);
  const daysRemaining = Math.floor(msRemaining / (1000 * 60 * 60 * 24));
  const hoursRemaining = Math.floor((msRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutesRemaining = Math.floor((msRemaining % (1000 * 60 * 60)) / (1000 * 60));
  const secondsRemaining = Math.floor((msRemaining % (1000 * 60)) / 1000);
  const pad = n => String(n).padStart(2, '0');
  const isETS = msRemaining === 0;

  return (
    <div className="min-w-[260px] max-w-[260px] bg-card rounded-xl border border-border p-5 flex flex-col gap-2 relative">
      <button
        onClick={() => onDelete(friend.id)}
        className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-destructive transition-colors"
      >
        <X className="w-3 h-3" />
      </button>
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-inter">
          {friend.rank ? `${friend.rank} · ` : ''}{friend.unit || 'FRIEND'}
        </p>
        <p className="text-base font-inter font-bold text-foreground truncate pr-6">{friend.name}</p>
      </div>
      {isETS ? (
        <p className="text-lg font-mono font-black text-primary">ETS! 🎉</p>
      ) : (
        <>
          <div className="flex items-end gap-1.5">
            <span className="text-4xl font-mono font-black text-primary leading-none">{daysRemaining.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground font-inter mb-1">DAYS</span>
          </div>
          <p className="text-xs font-mono text-muted-foreground tracking-widest">
            {pad(hoursRemaining)}:{pad(minutesRemaining)}:{pad(secondsRemaining)}
          </p>
        </>
      )}
      <p className="text-[10px] font-mono text-muted-foreground/60 uppercase">
        ETS {format(etsDate, 'dd MMM yyyy').toUpperCase()}
      </p>
    </div>
  );
}

export default function FriendTimers({ now }) {
  const [friends, setFriends] = useState([]);
  const [showAdd, setShowAdd] = useState(false);

  const load = async () => {
    const data = await base44.entities.Friend.list('ets_date');
    setFriends(data);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    await base44.entities.Friend.delete(id);
    setFriends(f => f.filter(x => x.id !== id));
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-inter">BATTLE BUDDIES</p>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-primary font-inter font-semibold"
        >
          <Plus className="w-3 h-3" /> ADD
        </button>
      </div>

      {friends.length === 0 ? (
        <button
          onClick={() => setShowAdd(true)}
          className="w-full border-2 border-dashed border-border rounded-xl py-6 text-xs text-muted-foreground font-inter text-center hover:border-primary/40 hover:text-primary transition-colors"
        >
          + Add a friend to track their ETS
        </button>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-none" style={{ scrollSnapType: 'x mandatory' }}>
          {friends.map(f => (
            <div key={f.id} style={{ scrollSnapAlign: 'start' }}>
              <FriendCard friend={f} now={now} onDelete={handleDelete} />
            </div>
          ))}
          <div className="min-w-[120px] flex items-center justify-center">
            <button
              onClick={() => setShowAdd(true)}
              className="w-12 h-12 rounded-xl bg-secondary border-2 border-dashed border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {showAdd && <AddFriendModal onClose={() => setShowAdd(false)} onSaved={() => { setShowAdd(false); load(); }} />}
    </div>
  );
}