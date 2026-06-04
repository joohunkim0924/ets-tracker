import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Dumbbell, Star, BookOpen, Crosshair } from 'lucide-react';

const tabs = [
  { path: '/', label: 'ETS', icon: Shield },
  { path: '/aft', label: 'AFT', icon: Dumbbell },
  { path: '/weapons', label: 'Weapons', icon: Crosshair },
  { path: '/benefits', label: 'Benefits', icon: Star },
  { path: '/references', label: 'Refs', icon: BookOpen },
];

export default function BottomNav() {
  const { pathname } = useLocation();
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex max-w-full overflow-x-hidden border-t border-border bg-card pb-[env(safe-area-inset-bottom,0px)]">
      {tabs.map(({ path, label, icon: Icon }) => {
        const active = pathname === path;
        return (
          <Link
            key={path}
            to={path}
            className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 py-nav-y transition-colors ${active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Icon className="h-[var(--app-icon-tab)] w-[var(--app-icon-tab)]" />
            <span className="max-w-full truncate text-[10px] font-inter font-medium uppercase tracking-widest">{label}</span>
          </Link>
        );
      })}
    </div>
  );
}