import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { differenceInDays, format, parseISO } from 'date-fns';
import { Shield, Settings, MapPin } from 'lucide-react';
import CircularProgress from '../components/tracker/CircularProgress';
import CountdownDisplay from '../components/tracker/CountdownDisplay';
import StatsCard from '../components/tracker/StatsCard';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const me = await base44.auth.me();
      if (!me.onboarded) {
        navigate('/onboarding');
        return;
      }
      setUser(me);
      setLoading(false);
    };
    loadUser();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const today = new Date();
  const enlistmentDate = parseISO(user.enlistment_date);
  const etsDate = parseISO(user.ets_date);
  const pcsDate = user.pcs_date ? parseISO(user.pcs_date) : null;

  const totalDays = differenceInDays(etsDate, enlistmentDate);
  const daysServed = differenceInDays(today, enlistmentDate);
  const daysRemaining = differenceInDays(etsDate, today);
  const percentage = Math.min(Math.max((daysServed / totalDays) * 100, 0), 100);
  const pcsDaysRemaining = pcsDate ? differenceInDays(pcsDate, today) : null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-8 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-inter">
              {user.rank} • {user.mos}
            </p>
            <p className="text-sm font-inter font-semibold text-foreground">
              {user.preferred_name || user.first_name} {user.last_name}
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/settings')}
          className="w-10 h-10 rounded-xl bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Main countdown */}
      <div className="flex-1 flex flex-col items-center px-6 pt-4">
        {/* Days remaining - hero number */}
        <CountdownDisplay
          daysRemaining={Math.max(daysRemaining, 0)}
          etsDate={format(etsDate, 'dd MMM yyyy').toUpperCase()}
        />

        {/* Circular progress */}
        <div className="my-8">
          <CircularProgress percentage={percentage} />
        </div>

        {/* Stats grid */}
        <div className="w-full grid grid-cols-2 gap-3 mb-4">
          <StatsCard
            label="DAYS SERVED"
            value={Math.max(daysServed, 0).toLocaleString()}
            unit="DAYS"
            highlight="green"
          />
          <StatsCard
            label="CONTRACT LENGTH"
            value={totalDays.toLocaleString()}
            unit="DAYS"
          />
        </div>

        {/* PCS countdown if applicable */}
        {pcsDate && pcsDaysRemaining !== null && (
          <div className="w-full bg-card rounded-xl border border-border p-5 flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-accent" />
            </div>
            <div className="flex-1">
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-inter block">
                PCS COUNTDOWN
              </span>
              <span className="text-xl font-mono font-bold text-accent">
                {Math.max(pcsDaysRemaining, 0)}
              </span>
              <span className="text-xs text-muted-foreground font-inter ml-1.5">
                DAYS — {format(pcsDate, 'dd MMM yyyy').toUpperCase()}
              </span>
            </div>
          </div>
        )}

        {/* Footer quote */}
        <div className="w-full text-center py-6">
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/50 font-inter">
            THIS TOO SHALL PASS
          </p>
        </div>
      </div>
    </div>
  );
}