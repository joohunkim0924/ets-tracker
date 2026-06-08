import React, { useEffect, useMemo, useState } from 'react';
import { differenceInMonths, parseISO } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Minus, Plus, AlertTriangle, Shield, Target, GraduationCap, Award, Dumbbell } from 'lucide-react';
import {
  RANK_OPTIONS,
  DEFAULT_PROMOTION_STATE,
  STORAGE_KEY,
  PROMOTION_TRACKER_UPDATED_EVENT,
  mapUserRankToPromotion,
  getRouteForRank,
  getPromotionTarget,
  getJuniorProgress,
  calculateSemiCentralizedTotal,
  validateAftScore,
  aftMinTotal,
  CATEGORY_CAPS,
  AWARD_VALUES,
  JUNIOR_TRACKS,
} from '@/lib/promotion-points';

function loadState(userRank) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_PROMOTION_STATE, ...JSON.parse(raw) };
  } catch {
    /* use defaults */
  }
  const state = { ...DEFAULT_PROMOTION_STATE };
  const mapped = mapUserRankToPromotion(userRank);
  if (mapped) state.rank = mapped;
  return state;
}

function PointsRing({ current, max = 800 }) {
  const pct = Math.min(100, (current / max) * 100);
  const size = 220;
  const stroke = 12;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="relative mx-auto flex aspect-square w-[min(100%,14rem)] items-center justify-center">
      <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(270 60% 55%)"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
          style={{ filter: 'drop-shadow(0 0 10px hsl(270 60% 50% / 0.45))' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="font-mono text-4xl font-black text-white">{current}</span>
        <span className="text-[10px] font-inter uppercase tracking-[0.25em] text-violet-200/70">/ {max} pts</span>
      </div>
    </div>
  );
}

function AwardCounter({ label, value, onChange, unitPts }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-white/10 bg-black/20 px-3 py-2">
      <div>
        <p className="text-xs font-inter font-semibold text-white">{label}</p>
        <p className="text-[10px] text-violet-200/60">{unitPts} pts each</p>
      </div>
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => onChange(Math.max(0, value - 1))} className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white">
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="w-6 text-center font-mono text-sm font-bold text-white">{value}</span>
        <button type="button" onClick={() => onChange(value + 1)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white">
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

function JuniorTrack({ rank, enlistmentDate, now }) {
  const monthsTis = enlistmentDate
    ? Math.max(differenceInMonths(now, parseISO(enlistmentDate)), 0)
    : 0;
  const tracks = Object.keys(JUNIOR_TRACKS).map(r => ({
    rankKey: r,
    ...getJuniorProgress(r, monthsTis),
  }));

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="rounded-2xl border border-violet-500/20 bg-violet-950/40 p-5 shadow-lg">
        <p className="text-[10px] font-inter uppercase tracking-[0.2em] text-violet-300/80">Automatic promotion track</p>
        <h3 className="mt-1 text-lg font-inter font-bold text-white">Time in service pathway</h3>
        <p className="mt-2 text-xs text-violet-100/70">
          {enlistmentDate ? `${monthsTis} months time in service` : 'Add enlistment date in settings for live TIS tracking'}
        </p>
        <div className="mt-5 space-y-4">
          {tracks.map(track => {
            const active = track.rankKey === rank;
            return (
              <div key={track.label} className={`rounded-xl border p-3 transition-all ${active ? 'border-violet-400/40 bg-violet-900/30' : 'border-white/5 bg-black/20 opacity-70'}`}>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-inter font-semibold text-white">{track.label}</p>
                  {active && <span className="rounded-full bg-violet-500/20 px-2 py-0.5 text-[9px] font-inter uppercase tracking-wider text-violet-300">Current</span>}
                </div>
                {track.tigMonths && <p className="mb-2 text-[10px] text-violet-200/60">{track.tigMonths} months time in grade required</p>}
                <div className="mb-1 flex justify-between text-[10px] font-mono text-violet-200/80">
                  <span>0 mo</span>
                  <span>{Math.round(track.tisPct)}%</span>
                  <span>{track.tisMonths} mo TIS</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-black/40">
                  <div className="h-full rounded-full bg-gradient-to-r from-violet-700 to-violet-400 transition-all duration-700" style={{ width: `${track.tisPct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="rounded-xl border border-amber-500/20 bg-amber-950/30 p-4">
        <p className="text-xs font-inter font-semibold text-amber-100">Commander waiver</p>
        <p className="mt-1 text-[11px] leading-relaxed text-amber-100/70">
          Early promotion waivers may be granted by your commander when you demonstrate exceptional performance before meeting standard TIS/TIG requirements.
        </p>
      </div>
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs font-inter font-semibold text-white">Soldier tip</p>
        <p className="mt-1 text-[11px] leading-relaxed text-violet-100/70">
          Focus on mastering your MOS, maintaining discipline, and practicing the 5 AFT core events (MDL, HRP, SDC, PLK, 2MR).
        </p>
      </div>
    </div>
  );
}

function BoardChecklist({ checklist, onChange }) {
  const items = [
    { key: 'ncoer', label: 'Review NCOER History and Ensure Consistency' },
    { key: 'srb', label: 'Verify IPPS-A Soldier Record Brief (SRB) Accuracy' },
    { key: 'deploymentAwards', label: 'Confirm Complete Deployment and Award Credits' },
    { key: 'msaf', label: 'Complete Multi-Source Assessment and Feedback (MSAF) 360' },
  ];

  return (
    <div className="space-y-3 animate-in fade-in duration-500">
      <div className="rounded-2xl border border-violet-500/20 bg-violet-950/40 p-5">
        <p className="text-[10px] font-inter uppercase tracking-[0.2em] text-violet-300/80">Centralized board</p>
        <h3 className="mt-1 text-lg font-inter font-bold text-white">NCO Board Readiness</h3>
        <p className="mt-2 text-xs text-violet-100/70">SSG and above promotions are centralized. Use this checklist to prepare your record before the board.</p>
      </div>
      {items.map(item => (
        <label key={item.key} className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-black/25 p-4 transition-colors hover:border-violet-500/30">
          <Checkbox checked={!!checklist[item.key]} onCheckedChange={checked => onChange(item.key, checked === true)} className="mt-0.5" />
          <span className="text-sm font-inter text-white leading-snug">{item.label}</span>
        </label>
      ))}
    </div>
  );
}

export default function PromotionTracker({ user, now = new Date() }) {
  const [state, setState] = useState(() => loadState(user?.rank));

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent(PROMOTION_TRACKER_UPDATED_EVENT));
  }, [state]);

  const route = getRouteForRank(state.rank);
  const target = getPromotionTarget(state.rank);
  const caps = target ? CATEGORY_CAPS[target] : null;

  const semi = useMemo(() => {
    if (!target) return null;
    return calculateSemiCentralizedTotal({
      aftScore: state.aftScore,
      weaponsHits: state.weaponsHits,
      awards: state.awards,
      militaryEducation: state.militaryEducation,
      civilianEducation: state.civilianEducation,
    }, target);
  }, [state, target]);

  const aftValidation = validateAftScore(state.aftScore, state.mosCategory);
  const cutoff = Number(state.cutoffScore) || 0;
  const cutoffPct = cutoff > 0 && semi ? Math.min(100, (semi.total / cutoff) * 100) : 0;

  const setAward = (key, val) => setState(s => ({ ...s, awards: { ...s.awards, [key]: val } }));

  return (
    <div className="rounded-2xl border border-violet-900/50 bg-gradient-to-b from-zinc-950 via-violet-950/90 to-zinc-950 p-4 shadow-xl sm:p-5">
      <div className="mb-4 space-y-2">
        <Label className="text-[10px] uppercase tracking-[0.2em] text-violet-200/70">Current rank</Label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {RANK_OPTIONS.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setState(s => ({ ...s, rank: opt.value }))}
              className={`rounded-xl border px-2 py-2.5 text-[10px] font-inter font-semibold uppercase tracking-wide transition-all ${
                state.rank === opt.value
                  ? 'border-violet-400 bg-violet-500/20 text-violet-100 shadow-md'
                  : 'border-white/10 bg-black/30 text-violet-100/60 hover:border-violet-500/30'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {route === 'semi' && (
        <div className="mb-5 flex items-center justify-between rounded-xl border border-white/10 bg-black/25 px-4 py-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-violet-200/70">MOS category</p>
            <p className="text-xs font-inter text-white">{state.mosCategory === 'combat' ? 'Combat specialty (21 roles)' : 'Standard MOS'}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-inter text-violet-200/60">Standard</span>
            <Switch checked={state.mosCategory === 'combat'} onCheckedChange={checked => setState(s => ({ ...s, mosCategory: checked ? 'combat' : 'standard' }))} />
            <span className="text-[10px] font-inter text-violet-200/60">Combat</span>
          </div>
        </div>
      )}

      {route === 'junior' && <JuniorTrack rank={state.rank} enlistmentDate={user?.enlistment_date} now={now} />}
      {route === 'board' && (
        <BoardChecklist
          checklist={state.boardChecklist}
          onChange={(key, val) => setState(s => ({ ...s, boardChecklist: { ...s.boardChecklist, [key]: val } }))}
        />
      )}

      {route === 'semi' && semi && caps && (
        <div className="space-y-5 animate-in fade-in duration-500">
          <div className="rounded-2xl border border-violet-500/20 bg-black/30 p-4 text-center">
            <PointsRing current={semi.total} />
            <p className="mt-3 text-[10px] font-inter uppercase tracking-[0.2em] text-violet-200/70">Semi-centralized promotion points</p>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-[0.2em] text-violet-200/70">Cutoff score target</Label>
            <Input type="number" min="0" max="800" value={state.cutoffScore} onChange={e => setState(s => ({ ...s, cutoffScore: e.target.value }))} className="h-11 border-white/10 bg-black/40 font-mono text-white" />
            {cutoff > 0 && (
              <div className="pt-1">
                <div className="mb-1 flex justify-between text-[10px] font-mono text-violet-200/80">
                  <span>{semi.total} pts earned</span>
                  <span>{cutoff} cutoff</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-black/40">
                  <div className="h-full rounded-full bg-violet-500 transition-all duration-500" style={{ width: `${cutoffPct}%` }} />
                </div>
                <p className="mt-1 text-center text-[10px] font-mono text-violet-200/60">
                  {semi.total >= cutoff ? 'At or above cutoff' : `${cutoff - semi.total} points to cutoff`}
                </p>
              </div>
            )}
          </div>

          <Accordion type="multiple" className="space-y-2">
            <AccordionItem value="aft" className="rounded-xl border border-white/10 bg-black/25 px-3">
              <AccordionTrigger className="text-white hover:no-underline">
                <span className="flex items-center gap-2 text-xs font-inter font-semibold uppercase tracking-wider">
                  <Dumbbell className="h-4 w-4 text-violet-400" /> Army Fitness Test ({semi.breakdown.aft} pts)
                </span>
              </AccordionTrigger>
              <AccordionContent className="space-y-3">
                <Input type="number" min="0" max="500" placeholder="0–500" value={state.aftScore} onChange={e => setState(s => ({ ...s, aftScore: e.target.value }))} className="h-11 border-white/10 bg-black/40 font-mono text-white" />
                <p className="text-[10px] text-violet-200/60">5 events: MDL, HRP, SDC, PLK, 2MR. Max {target === 'e6' ? 140 : 120} promotion pts at 500. Min {aftMinTotal(state.mosCategory)} total required.</p>
                {!aftValidation.valid && (
                  <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-950/40 p-3 text-amber-100">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                    <p className="text-[11px]">{aftValidation.message}</p>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="weapons" className="rounded-xl border border-white/10 bg-black/25 px-3">
              <AccordionTrigger className="text-white hover:no-underline">
                <span className="flex items-center gap-2 text-xs font-inter font-semibold uppercase tracking-wider">
                  <Target className="h-4 w-4 text-violet-400" /> Weapons qualification ({semi.breakdown.weapons} pts)
                </span>
              </AccordionTrigger>
              <AccordionContent className="space-y-2">
                <Input type="number" min="0" max="40" placeholder="Hits (0–40)" value={state.weaponsHits} onChange={e => setState(s => ({ ...s, weaponsHits: e.target.value }))} className="h-11 border-white/10 bg-black/40 font-mono text-white" />
                <p className="text-[10px] text-violet-200/60">Expert 36–40 → 96–110 · Sharpshooter 30–35 → 56–91 · Marksman 23–29 → 28–50</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="awards" className="rounded-xl border border-white/10 bg-black/25 px-3">
              <AccordionTrigger className="text-white hover:no-underline">
                <span className="flex items-center gap-2 text-xs font-inter font-semibold uppercase tracking-wider">
                  <Award className="h-4 w-4 text-violet-400" /> Awards & decorations ({semi.breakdown.awards} / {caps.awards} max)
                </span>
              </AccordionTrigger>
              <AccordionContent className="space-y-2">
                <AwardCounter label="ARCOM" unitPts={AWARD_VALUES.arcom} value={state.awards.arcom} onChange={v => setAward('arcom', v)} />
                <AwardCounter label="AAM" unitPts={AWARD_VALUES.aam} value={state.awards.aam} onChange={v => setAward('aam', v)} />
                <AwardCounter label="Good Conduct Medal" unitPts={AWARD_VALUES.gcm} value={state.awards.gcm} onChange={v => setAward('gcm', v)} />
                <AwardCounter label="Certificate of Achievement" unitPts={AWARD_VALUES.coa} value={state.awards.coa} onChange={v => setAward('coa', v)} />
                <AwardCounter label="Combat / specialty badge" unitPts={AWARD_VALUES.badge} value={state.awards.badge} onChange={v => setAward('badge', v)} />
                <p className="text-[10px] text-violet-200/60">COA points cap at 20 total in this category.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="mil-ed" className="rounded-xl border border-white/10 bg-black/25 px-3">
              <AccordionTrigger className="text-white hover:no-underline">
                <span className="flex items-center gap-2 text-xs font-inter font-semibold uppercase tracking-wider">
                  <Shield className="h-4 w-4 text-violet-400" /> Military education ({semi.breakdown.militaryEd} / {caps.militaryEducation} max)
                </span>
              </AccordionTrigger>
              <AccordionContent className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-[10px] text-violet-200/70">Correspondence course hours (1 pt / 5 hrs)</Label>
                  <Input type="number" min="0" value={state.militaryEducation.correspondenceHours} onChange={e => setState(s => ({ ...s, militaryEducation: { ...s.militaryEducation, correspondenceHours: e.target.value } }))} className="h-11 border-white/10 bg-black/40 font-mono text-white" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] text-violet-200/70">Resident training weeks (4 pts / week)</Label>
                  <Input type="number" min="0" value={state.militaryEducation.residentWeeks} onChange={e => setState(s => ({ ...s, militaryEducation: { ...s.militaryEducation, residentWeeks: e.target.value } }))} className="h-11 border-white/10 bg-black/40 font-mono text-white" />
                </div>
                <label className="flex items-center gap-3 rounded-lg border border-white/10 bg-black/20 px-3 py-2.5">
                  <Checkbox checked={state.militaryEducation.ncoesGraduate} onCheckedChange={checked => setState(s => ({ ...s, militaryEducation: { ...s.militaryEducation, ncoesGraduate: checked === true } }))} />
                  <span className="text-xs font-inter text-white">NCOES graduate (BLC/ALC completed)</span>
                </label>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="civ-ed" className="rounded-xl border border-white/10 bg-black/25 px-3">
              <AccordionTrigger className="text-white hover:no-underline">
                <span className="flex items-center gap-2 text-xs font-inter font-semibold uppercase tracking-wider">
                  <GraduationCap className="h-4 w-4 text-violet-400" /> Civilian education ({semi.breakdown.civilianEd} / {caps.civilianEducation} max)
                </span>
              </AccordionTrigger>
              <AccordionContent className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-[10px] text-violet-200/70">College semester hours (2 pts / hour)</Label>
                  <Input type="number" min="0" value={state.civilianEducation.semesterHours} onChange={e => setState(s => ({ ...s, civilianEducation: { ...s.civilianEducation, semesterHours: e.target.value } }))} className="h-11 border-white/10 bg-black/40 font-mono text-white" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] text-violet-200/70">Technical certifications (10 pts each, max 50)</Label>
                  <Input type="number" min="0" max="5" value={state.civilianEducation.techCerts} onChange={e => setState(s => ({ ...s, civilianEducation: { ...s.civilianEducation, techCerts: e.target.value } }))} className="h-11 border-white/10 bg-black/40 font-mono text-white" />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}
    </div>
  );
}
