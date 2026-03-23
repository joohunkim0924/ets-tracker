import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Dumbbell, Star } from 'lucide-react';

const tabs = [
  { path: '/', label: 'ETS', icon: Shield },
  { path: '/aft', label: 'AFT', icon: Dumbbell },
  { path: '/benefits', label: 'Benefits', icon: Star },
];

export default function BottomNav() {
  const { pathname } = useLocation();
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border flex z-50">
      {tabs.map(({ path, label, icon: Icon }) => {
        const active = pathname === path;
        return (
          <Link
            key={path}
            to={path}
            className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-colors ${active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] uppercase tracking-widest font-inter font-medium">{label}</span>
          </Link>
        );
      })}
    </div>
  );
}