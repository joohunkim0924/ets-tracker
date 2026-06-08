import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { localStore } from '@/lib/offline-store';
import BottomNav from '@/components/layout/BottomNav';
import PromotionTracker from '@/components/promotion/PromotionTracker';

export default function PromotionTrackerPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    localStore.auth.me().then(me => {
      if (!me.onboarded) {
        navigate('/onboarding');
        return;
      }
      setUser(me);
      setLoading(false);
    });
  }, [navigate]);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen max-w-full flex-col overflow-x-hidden bg-background">
      <div className="flex items-center gap-3 px-page pb-header-pb pt-header-pt">
        <button type="button" onClick={() => navigate('/')} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-secondary text-muted-foreground">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-inter">AR 600-8-19</p>
          <h1 className="text-lg font-inter font-black uppercase tracking-tight text-foreground">Promotion Tracker</h1>
        </div>
      </div>
      <div className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-page pb-bottom-scroll">
        <PromotionTracker user={user} now={now} />
      </div>
      <BottomNav />
    </div>
  );
}
