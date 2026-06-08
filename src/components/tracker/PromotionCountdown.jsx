import React, { useState } from 'react';
import { differenceInDays, parseISO, format } from 'date-fns';
import { ChevronRight, Star } from 'lucide-react';
import { localStore } from '@/lib/offline-store';
import { DateInput } from '@/components/ui/date-input';

export default function PromotionCountdown({ user, now }) {
  const [editing, setEditing] = useState(false);
  const [dateInput, setDateInput] = useState(user.promotion_date || '');
  const [saving, setSaving] = useState(false);

  const promotionDate = user.promotion_date ? parseISO(user.promotion_date) : null;

  const handleSave = async () => {
    setSaving(true);
    await localStore.auth.updateMe({ promotion_date: dateInput });
    user.promotion_date = dateInput;
    setSaving(false);
    setEditing(false);
    // Force a page reload to refresh user data
    window.location.reload();
  };

  if (!promotionDate && !editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="w-full bg-card rounded-xl border border-dashed border-border p-4 flex items-center justify-between text-left hover:border-primary/40 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Star className="w-4 h-4 text-primary" />
          </div>
          <span className="text-xs font-inter text-muted-foreground uppercase tracking-widest">Add Promotion Date</span>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </button>
    );
  }

  if (editing) {
    return (
      <div className="w-full bg-card rounded-xl border border-border p-4">
        <div className="flex items-center gap-2 mb-3">
          <Star className="w-4 h-4 text-primary" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-inter">Promotion Date</span>
        </div>
        <DateInput
          value={dateInput}
          onChange={e => setDateInput(e.target.value)}
          className="mb-3 bg-background border-input"
        />
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={!dateInput || saving}
            className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-inter font-semibold uppercase tracking-widest disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
          <button
            onClick={() => setEditing(false)}
            className="flex-1 py-2 rounded-lg bg-secondary text-muted-foreground text-xs font-inter font-semibold uppercase tracking-widest"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  const daysRemaining = Math.max(differenceInDays(promotionDate, now), 0);
  const enlistmentDate = user.enlistment_date ? parseISO(user.enlistment_date) : null;
  const totalMs = enlistmentDate ? promotionDate.getTime() - enlistmentDate.getTime() : null;
  const elapsedMs = enlistmentDate ? now.getTime() - enlistmentDate.getTime() : null;
  const pct = totalMs && elapsedMs !== null
    ? Math.min(Math.max((elapsedMs / totalMs) * 100, 0), 100)
    : null;

  return (
    <div className="w-full bg-card rounded-xl border border-border p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-primary" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-inter">Promotion Countdown</span>
        </div>
        <button onClick={() => { setDateInput(user.promotion_date || ''); setEditing(true); }} className="text-[10px] text-muted-foreground uppercase tracking-widest font-inter hover:text-primary transition-colors">
          Edit
        </button>
      </div>
      <div className="flex items-baseline gap-1.5 mb-3">
        <span className="text-3xl font-mono font-black text-primary">{daysRemaining}</span>
        <span className="text-xs text-muted-foreground font-inter">DAYS — {format(promotionDate, 'dd MMM yyyy').toUpperCase()}</span>
      </div>
      {pct !== null && (
        <>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono text-muted-foreground">0%</span>
            <span className="text-[11px] font-mono font-bold text-primary">{pct.toFixed(8)}%</span>
            <span className="text-[10px] font-mono text-muted-foreground">100%</span>
          </div>
          <div className="w-full h-2.5 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </>
      )}
    </div>
  );
}