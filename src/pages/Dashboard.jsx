import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { localStore } from '@/lib/offline-store';
import { differenceInDays, format, parseISO } from 'date-fns';
import { Shield, Settings, MapPin, ChevronRight, TrendingUp } from 'lucide-react';
import { UNIT_PATCHES, RANK_INSIGNIA } from '@/lib/army-data';
import CircularProgress from '../components/tracker/CircularProgress';
import CountdownDisplay from '../components/tracker/CountdownDisplay';
import StatsCard from '../components/tracker/StatsCard';
import BottomNav from '@/components/layout/BottomNav';
import FriendTimers from '@/components/tracker/FriendTimers';
import PromotionCountdown from '@/components/tracker/PromotionCountdown';
import PromotionPointsBar from '@/components/tracker/PromotionPointsBar';
import { isPromotionDateReached, resetPromotionTrackerState } from '@/lib/promotion-points';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const loadUser = async () => {
      const me = await localStore.auth.me();
      if (!me.onboarded) {
        navigate('/onboarding');
        return;
      }
      setUser(me);
      setLoading(false);
    };
    loadUser();
  }, [navigate]);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (loading || !user?.promotion_date) return;
    if (!isPromotionDateReached(user.promotion_date, now)) return;

    (async () => {
      resetPromotionTrackerState({ seedRank: user.rank });
      const updated = await localStore.auth.updateMe({ promotion_date: '' });
      setUser(updated);
    })();
  }, [loading, user?.promotion_date, user?.rank, now]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div
          className="border-2 border-primary border-t-transparent rounded-full animate-spin"
          style={{ width: 'var(--app-spinner)', height: 'var(--app-spinner)' }}
        />
      </div>
    );
  }

  const enlistmentDate = parseISO(user.enlistment_date);
  const etsDate = parseISO(user.ets_date);
  const pcsDate = user.pcs_date ? parseISO(user.pcs_date) : null;

  const totalMs = etsDate.getTime() - enlistmentDate.getTime();
  const elapsedMs = now.getTime() - enlistmentDate.getTime();
  const percentage = Math.min(Math.max((elapsedMs / totalMs) * 100, 0), 100);

  const totalDays = differenceInDays(etsDate, enlistmentDate);
  const daysServed = differenceInDays(now, enlistmentDate);
  const msRemaining = Math.max(etsDate.getTime() - now.getTime(), 0);
  const daysRemaining = Math.floor(msRemaining / (1000 * 60 * 60 * 24));
  const hoursRemaining = Math.floor((msRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutesRemaining = Math.floor((msRemaining % (1000 * 60 * 60)) / (1000 * 60));
  const secondsRemaining = Math.floor((msRemaining % (1000 * 60)) / 1000);
  const pcsDaysRemaining = pcsDate ? differenceInDays(pcsDate, now) : null;
  const unitKey = user.unit ? String(user.unit).trim().toUpperCase() : '';
  const unitPatch = UNIT_PATCHES[unitKey];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-page pt-header-pt pb-header-pb">
        <div className="flex min-w-0 flex-1 items-center gap-block-gap">
          <div
            className="flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-primary/20 bg-primary/10"
            style={{ width: 'var(--app-touch-target)', height: 'var(--app-touch-target)' }}
          >
            {user.rank && RANK_INSIGNIA[user.rank] ? (
              <img
                src={RANK_INSIGNIA[user.rank]}
                alt={user.rank}
                className="object-contain"
                style={{ width: 'var(--app-touch-inner)', height: 'var(--app-touch-inner)' }}
              />
            ) : (
              <Shield className="text-primary" style={{ width: 'var(--app-icon-header)', height: 'var(--app-icon-header)' }} />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-[clamp(0.5625rem,2.6vw,0.625rem)] uppercase tracking-[0.2em] text-muted-foreground font-inter">
              {user.rank} • {user.mos}
            </p>
            <p className="text-[clamp(0.8125rem,3.6vw,0.875rem)] font-inter font-semibold text-foreground">
              {user.preferred_name || user.first_name} {user.last_name}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate('/settings')}
          className="flex shrink-0 items-center justify-center rounded-xl border border-border bg-secondary text-muted-foreground transition-colors hover:text-foreground"
          style={{ width: 'var(--app-touch-target)', height: 'var(--app-touch-target)' }}
        >
          <Settings style={{ width: 'var(--app-icon-header)', height: 'var(--app-icon-header)' }} />
        </button>
      </div>

      {/* Main content */}
      <div className="relative flex flex-1 flex-col items-center overflow-x-hidden overflow-y-auto px-page pb-bottom-scroll pt-block-gap">
        {/* Circular progress */}
        <div className="relative z-10 mb-block-gap">
          <CircularProgress
            percentage={percentage}
            unitPatchSrc={unitPatch}
            unitPatchAlt={unitKey ? `${user.unit} unit patch` : ''}
          />
        </div>

        {/* Days remaining */}
        <div className="relative z-10 w-full">
          <CountdownDisplay
            daysRemaining={daysRemaining}
            hoursRemaining={hoursRemaining}
            minutesRemaining={minutesRemaining}
            secondsRemaining={secondsRemaining}
            etsDate={format(etsDate, 'dd MMM yyyy').toUpperCase()}
            contractPercentage={percentage}
          />
        </div>

        {/* Stats grid */}
        <div className="relative z-10 mt-block-gap mb-4 grid w-full grid-cols-2 gap-block-gap">
          <StatsCard
            label="DAYS SERVED"
            value={Math.max(daysServed, 0).toLocaleString()}
            unit="DAYS"
            highlight="green"
          />
          <StatsCard
            label="CONTRACT"
            value={totalDays.toLocaleString()}
            unit="DAYS"
          />
        </div>

        {/* Promotion countdown */}
        <div className="w-full mb-4 relative z-10 space-y-3">
          <PromotionCountdown user={user} now={now} />
          <PromotionPointsBar />
          <button
            type="button"
            onClick={() => navigate('/promotion')}
            className="promotion-cta"
          >
            <div className="flex items-center gap-3">
              <div className="promotion-cta-icon">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-inter uppercase tracking-[0.2em] opacity-80">AR 600-8-19</p>
                <p className="text-sm font-inter font-semibold">Calculate Promotion Points</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 opacity-80" />
          </button>
        </div>

        {/* PCS countdown if applicable */}
        {pcsDate && pcsDaysRemaining !== null && (
          <div className="relative z-10 mb-4 flex w-full items-center gap-block-gap rounded-xl border border-border bg-card p-card">
            <div
              className="flex shrink-0 items-center justify-center rounded-lg border border-accent/20 bg-accent/10"
              style={{ width: 'var(--app-touch-target)', height: 'var(--app-touch-target)' }}
            >
              <MapPin className="text-accent" style={{ width: 'var(--app-icon-header)', height: 'var(--app-icon-header)' }} />
            </div>
            <div className="flex-1">
              <span className="block font-inter text-[clamp(0.5625rem,2.6vw,0.625rem)] uppercase tracking-[0.2em] text-muted-foreground">
                PCS COUNTDOWN
              </span>
              <span className="font-mono text-[clamp(1.125rem,5.5vmin,1.375rem)] font-bold text-accent">
                {Math.max(pcsDaysRemaining, 0)}
              </span>
              <span className="ml-1.5 font-inter text-[clamp(0.6875rem,3.1vw,0.75rem)] text-muted-foreground">
                DAYS — {format(pcsDate, 'dd MMM yyyy').toUpperCase()}
              </span>
            </div>
          </div>
        )}

        {/* Friends ETS timers */}
        <div className="w-full mb-4 relative z-10">
          <FriendTimers now={now} />
        </div>

        {/* Footer quote */}
        <div className="w-full text-center py-4 relative z-10">
          <p className="font-inter text-[clamp(0.5625rem,2.6vw,0.625rem)] uppercase tracking-[0.25em] text-muted-foreground/50">
            THIS TOO SHALL PASS
          </p>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
