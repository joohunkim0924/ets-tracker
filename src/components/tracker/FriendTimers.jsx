import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { localStore } from '@/lib/offline-store';
import { format, parseISO } from 'date-fns';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DateInput } from '@/components/ui/date-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RANKS, UNITS } from '@/lib/army-data';

function AddFriendModal({ onClose, onSaved }) {
  const [form, setForm] = useState({ name: '', ets_date: '', rank: '', unit: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    if (error) setError('');
  };

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = form.name.trim();
    const etsDate = form.ets_date.trim();
    if (!name || !etsDate) {
      setError('Name and ETS date are required.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      await localStore.entities.Friend.create({
        name,
        ets_date: etsDate,
        rank: form.rank || undefined,
        unit: form.unit || undefined,
      });
      onSaved();
    } catch {
      setError('Could not save friend. Please try again.');
      setSaving(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end overflow-x-hidden bg-black/50"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="flex w-full max-w-full max-h-[min(90dvh,92svh)] flex-col rounded-t-2xl bg-background"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-friend-title"
      >
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-4 overflow-y-auto overflow-x-hidden p-modal">
            <div className="flex items-center justify-between">
              <h2 id="add-friend-title" className="text-sm font-inter font-bold uppercase tracking-widest">ADD FRIEND</h2>
              <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-lg touch-manipulation" aria-label="Close">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">NAME *</Label>
              <Input
                placeholder="e.g. SGT Smith"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                className="h-12 bg-secondary border-border"
                autoComplete="name"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">ETS DATE *</Label>
              <DateInput
                value={form.ets_date}
                onChange={e => set('ets_date', e.target.value)}
                className="bg-secondary border-border"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">RANK</Label>
                <Select value={form.rank || undefined} onValueChange={v => set('rank', v)}>
                  <SelectTrigger className="h-12 bg-secondary border-border">
                    <SelectValue placeholder="Rank" />
                  </SelectTrigger>
                  <SelectContent>
                    {RANKS.map(rank => <SelectItem key={rank} value={rank}>{rank}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">UNIT</Label>
                <Select value={form.unit || undefined} onValueChange={v => set('unit', v)}>
                  <SelectTrigger className="h-12 bg-secondary border-border">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent className="max-h-64">
                    {UNITS.map(u => <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="shrink-0 space-y-2 border-t border-border bg-background p-modal pb-bottom-scroll">
            {error && (
              <p className="text-center text-xs font-inter text-destructive">{error}</p>
            )}
            <Button
              type="submit"
              disabled={saving}
              className="h-12 w-full touch-manipulation font-inter font-semibold uppercase tracking-wider"
            >
              {saving ? <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" /> : 'ADD FRIEND'}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}

function FriendCard({ friend, now, onDelete }) {
  const etsDate = parseISO(friend.ets_date);
  const msRemaining = Math.max(etsDate.getTime() - now.getTime(), 0);
  const daysRemaining = Math.floor(msRemaining / (1000 * 60 * 60 * 24));
  const hoursRemaining = Math.floor((msRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutesRemaining = Math.floor((msRemaining % (1000 * 60 * 60)) / (1000 * 60));
  const secondsRemaining = Math.floor((msRemaining % (1000 * 60)) / 1000);
  const pad = n => String(n).padStart(2, '0');
  const isETS = msRemaining === 0;

  return (
    <div className="relative flex w-[min(100%,var(--app-buddy-card))] max-w-full shrink-0 flex-col gap-2 rounded-xl border border-border bg-card p-card">
      <button
        type="button"
        onClick={() => onDelete(friend.id)}
        className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:text-destructive touch-manipulation"
        aria-label={`Remove ${friend.name}`}
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
    const data = await localStore.entities.Friend.list('ets_date');
    setFriends(data);
  };

  useEffect(() => { load(); }, []);

  const openAdd = useCallback(() => setShowAdd(true), []);
  const closeAdd = useCallback(() => setShowAdd(false), []);

  const handleDelete = async (id) => {
    await localStore.entities.Friend.delete(id);
    setFriends(f => f.filter(x => x.id !== id));
  };

  return (
    <div className="w-full min-w-0 max-w-full">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-inter">BATTLE BUDDIES</p>
        <button
          type="button"
          onClick={openAdd}
          className="flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-4 text-xs font-inter font-semibold uppercase tracking-widest text-primary touch-manipulation active:bg-primary/20"
          style={{ minHeight: 'var(--app-touch-target)' }}
        >
          <Plus className="h-4 w-4" />
          ADD FRIEND
        </button>
      </div>

      {friends.length === 0 ? (
        <button
          type="button"
          onClick={openAdd}
          className="w-full rounded-xl border-2 border-dashed border-border py-8 text-sm text-muted-foreground font-inter text-center transition-colors hover:border-primary/40 hover:text-primary touch-manipulation active:bg-primary/5"
        >
          + Add a friend to track their ETS
        </button>
      ) : (
        <div className="-mx-page overflow-x-auto px-page pb-2 overscroll-x-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max min-w-full gap-3">
            {friends.map(f => (
              <FriendCard key={f.id} friend={f} now={now} onDelete={handleDelete} />
            ))}
          </div>
        </div>
      )}

      {showAdd && (
        <AddFriendModal
          onClose={closeAdd}
          onSaved={() => {
            closeAdd();
            load();
          }}
        />
      )}
    </div>
  );
}
