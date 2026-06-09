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
  buildJuniorTrackRows,
  calculateSemiCentralizedTotal,
  validateAftScore,
  aftMinTotal,
  CATEGORY_CAPS,
  AWARD_VALUES,
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
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="promotion-ring-progress transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="font-mono text-4xl font-black text-white">{current}</span>
        <span className="text-[10px] font-inter uppercase tracking-[0.25em] promotion-accent-muted">/ {max} pts</span>
      </div>
    </div>
  );
}

function AwardCounter({ label, value, onChange, unitPts }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-white/10 bg-black/20 px-3 py-2">
      <div>
        <p className="text-xs font-inter font-semibold text-white">{label}</p>
        <p className="text-[10px] promotion-accent-muted">{unitPts} pts each</p>
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
  const tracks = buildJuniorTrackRows(rank, monthsTis);
  const isOfficer = rank === '2lt';

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="promotion-panel rounded-2xl p-5 shadow-lg">
        <p className="promotion-label">Automatic promotion track</p>
        <h3 className="mt-1 text-lg font-inter font-bold text-white">
          {isOfficer ? 'Time in grade pathway' : 'Time in service pathway'}
        </h3>
        <p className="mt-2 text-xs promotion-accent-muted">
          {enlistmentDate
            ? `${monthsTis} months time in service`
            : 'Add enlistment date in settings for live TIS tracking'}
        </p>
        <div className="mt-5 space-y-4">
          {tracks.map(track => {
            const active = track.rankKey === rank;
            return (
              <div key={track.label} className={`rounded-xl border p-3 transition-all ${active ? 'border-primary/50 bg-primary/10' : 'border-white/5 bg-black/20 opacity-70'}`}>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-inter font-semibold text-white">{track.label}</p>
                  {active && <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[9px] font-inter uppercase tracking-wider text-primary">Current</span>}
                </div>
                {track.tigMonths && <p className="mb-2 text-[10px] promotion-accent-muted">{track.tigMonths} months time in grade required</p>}
                <div className="mb-1 flex justify-between text-[10px] font-mono promotion-accent-muted">
                  <span>0 mo</span>
                  <span>{Math.round(track.tisPct)}%</span>
                  <span>{track.tisMonths} mo TIS</span>
                </div>
                <div className="promotion-progress-track h-2.5">
                  <div className="promotion-progress-fill-gradient" style={{ width: `${track.tisPct}%` }} />
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
        <p className="mt-1 text-[11px] leading-relaxed promotion-accent-muted">
          {isOfficer
            ? 'Focus on leadership development, PME completion, and building a strong OER history for your next grade.'
            : 'Focus on mastering your MOS, maintaining discipline, and practicing the 5 AFT core events (MDL, HRP, SDC, PLK, 2MR).'}
        </p>
      </div>
    </div>
  );
}

function BoardChecklist({ checklist, onChange, isOfficer }) {
  const items = isOfficer
    ? [
      { key: 'ncoer', label: 'Review OER History and Ensure Consistency' },
      { key: 'srb', label: 'Verify Official Military Personnel File (OMPF) Accuracy' },
      { key: 'deploymentAwards', label: 'Confirm Complete Deployment and Award Credits' },
      { key: 'msaf', label: 'Complete Multi-Source Assessment and Feedback (MSAF) 360' },
    ]
    : [
      { key: 'ncoer', label: 'Review NCOER History and Ensure Consistency' },
      { key: 'srb', label: 'Verify IPPS-A Soldier Record Brief (SRB) Accuracy' },
      { key: 'deploymentAwards', label: 'Confirm Complete Deployment and Award Credits' },
      { key: 'msaf', label: 'Complete Multi-Source Assessment and Feedback (MSAF) 360' },
    ];

  return (
    <div className="space-y-3 animate-in fade-in duration-500">
      <div className="promotion-panel rounded-2xl p-5">
        <p className="promotion-label">Centralized board</p>
        <h3 className="mt-1 text-lg font-inter font-bold text-white">
          {isOfficer ? 'Officer Board Readiness' : 'NCO Board Readiness'}
        </h3>
        <p className="mt-2 text-xs promotion-accent-muted">
          {isOfficer
            ? 'CPT and above promotions are centralized. Use this checklist to prepare your record before the board.'
            : 'SSG and above promotions are centralized. Use this checklist to prepare your record before the board.'}
        </p>
      </div>
      {items.map(item => (
        <label key={item.key} className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-black/25 p-4 transition-colors hover:border-primary/40">
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
    <div className="rounded-2xl promotion-panel-deep p-4 shadow-xl sm:p-5">
      <div className="mb-4 space-y-2">
        <Label className="promotion-label">Current rank</Label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-3">
          {RANK_OPTIONS.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setState(s => ({ ...s, rank: opt.value }))}
              className={`rounded-xl border px-2 py-2.5 text-[10px] font-inter font-semibold uppercase tracking-wide transition-all ${
                state.rank === opt.value
                  ? 'border-primary bg-primary/20 text-white shadow-md'
                  : 'border-white/10 bg-black/30 text-primary/60 hover:border-primary/40'
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
            <p className="promotion-label">MOS category</p>
            <p className="text-xs font-inter text-white">{state.mosCategory === 'combat' ? 'Combat specialty (21 roles)' : 'Standard MOS'}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-inter promotion-accent-muted">Standard</span>
            <Switch checked={state.mosCategory === 'combat'} onCheckedChange={checked => setState(s => ({ ...s, mosCategory: checked ? 'combat' : 'standard' }))} />
            <span className="text-[10px] font-inter promotion-accent-muted">Combat</span>
          </div>
        </div>
      )}

      {route === 'junior' && <JuniorTrack rank={state.rank} enlistmentDate={user?.enlistment_date} now={now} />}
      {route === 'board' && (
        <BoardChecklist
          isOfficer={state.rank === 'cpt'}
          checklist={state.boardChecklist}
          onChange={(key, val) => setState(s => ({ ...s, boardChecklist: { ...s.boardChecklist, [key]: val } }))}
        />
      )}

      {route === 'semi' && semi && caps && (
        <div className="space-y-5 animate-in fade-in duration-500">
          <div className="promotion-panel rounded-2xl p-4 text-center">
            <PointsRing current={semi.total} />
            <p className="mt-3 promotion-label">Semi-centralized promotion points</p>
          </div>

          <div className="space-y-2">
            <Label className="promotion-label">Cutoff score target</Label>
            <Input type="number" min="0" max="800" value={state.cutoffScore} onChange={e => setState(s => ({ ...s, cutoffScore: e.target.value }))} className="h-11 border-white/10 bg-black/40 font-mono text-white" />
            {cutoff > 0 && (
              <div className="pt-1">
                <div className="mb-1 flex justify-between text-[10px] font-mono promotion-accent-muted">
                  <span>{semi.total} pts earned</span>
                  <span>{cutoff} cutoff</span>
                </div>
                <div className="promotion-progress-track h-2.5">
                  <div className="promotion-progress-fill" style={{ width: `${cutoffPct}%` }} />
                </div>
                <p className="mt-1 text-center text-[10px] font-mono promotion-accent-muted">
                  {semi.total >= cutoff ? 'At or above cutoff' : `${cutoff - semi.total} points to cutoff`}
                </p>
              </div>
            )}
          </div>

          <Accordion type="multiple" className="space-y-2">
            <AccordionItem value="aft" className="rounded-xl border border-white/10 bg-black/25 px-3">
              <AccordionTrigger className="text-white hover:no-underline">
                <span className="flex items-center gap-2 text-xs font-inter font-semibold uppercase tracking-wider">
                  <Dumbbell className="h-4 w-4 text-primary" /> Army Fitness Test ({semi.breakdown.aft} pts)
                </span>
              </AccordionTrigger>
              <AccordionContent className="space-y-3">
                <Input type="number" min="0" max="500" placeholder="0–500" value={state.aftScore} onChange={e => setState(s => ({ ...s, aftScore: e.target.value }))} className="h-11 border-white/10 bg-black/40 font-mono text-white" />
                <p className="text-[10px] promotion-accent-muted">5 events: MDL, HRP, SDC, PLK, 2MR. Max {target === 'e6' ? 140 : 120} promotion pts at 500. Min {aftMinTotal(state.mosCategory)} total required.</p>
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
                  <Target className="h-4 w-4 text-primary" /> Weapons qualification ({semi.breakdown.weapons} pts)
                </span>
              </AccordionTrigger>
              <AccordionContent className="space-y-2">
                <Input type="number" min="0" max="40" placeholder="Hits (0–40)" value={state.weaponsHits} onChange={e => setState(s => ({ ...s, weaponsHits: e.target.value }))} className="h-11 border-white/10 bg-black/40 font-mono text-white" />
                <p className="text-[10px] promotion-accent-muted">Expert 36–40 → 96–110 · Sharpshooter 30–35 → 56–91 · Marksman 23–29 → 28–50</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="awards" className="rounded-xl border border-white/10 bg-black/25 px-3">
              <AccordionTrigger className="text-white hover:no-underline">
                <span className="flex items-center gap-2 text-xs font-inter font-semibold uppercase tracking-wider">
                  <Award className="h-4 w-4 text-primary" /> Awards & decorations ({semi.breakdown.awards} / {caps.awards} max)
                </span>
              </AccordionTrigger>
              <AccordionContent className="space-y-2">
                <AwardCounter label="ARCOM" unitPts={AWARD_VALUES.arcom} value={state.awards.arcom} onChange={v => setAward('arcom', v)} />
                <AwardCounter label="AAM" unitPts={AWARD_VALUES.aam} value={state.awards.aam} onChange={v => setAward('aam', v)} />
                <AwardCounter label="Good Conduct Medal" unitPts={AWARD_VALUES.gcm} value={state.awards.gcm} onChange={v => setAward('gcm', v)} />
                <AwardCounter label="Certificate of Achievement" unitPts={AWARD_VALUES.coa} value={state.awards.coa} onChange={v => setAward('coa', v)} />
                <AwardCounter label="Combat / specialty badge" unitPts={AWARD_VALUES.badge} value={state.awards.badge} onChange={v => setAward('badge', v)} />
                <p className="text-[10px] promotion-accent-muted">COA points cap at 20 total in this category.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="mil-ed" className="rounded-xl border border-white/10 bg-black/25 px-3">
              <AccordionTrigger className="text-white hover:no-underline">
                <span className="flex items-center gap-2 text-xs font-inter font-semibold uppercase tracking-wider">
                  <Shield className="h-4 w-4 text-primary" /> Military education ({semi.breakdown.militaryEd} / {caps.militaryEducation} max)
                </span>
              </AccordionTrigger>
              <AccordionContent className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-[10px] promotion-accent-muted">Correspondence course hours (1 pt / 5 hrs)</Label>
                  <Input type="number" min="0" value={state.militaryEducation.correspondenceHours} onChange={e => setState(s => ({ ...s, militaryEducation: { ...s.militaryEducation, correspondenceHours: e.target.value } }))} className="h-11 border-white/10 bg-black/40 font-mono text-white" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] promotion-accent-muted">Resident training weeks (4 pts / week)</Label>
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
                  <GraduationCap className="h-4 w-4 text-primary" /> Civilian education ({semi.breakdown.civilianEd} / {caps.civilianEducation} max)
                </span>
              </AccordionTrigger>
              <AccordionContent className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-[10px] promotion-accent-muted">College semester hours (2 pts / hour)</Label>
                  <Input type="number" min="0" value={state.civilianEducation.semesterHours} onChange={e => setState(s => ({ ...s, civilianEducation: { ...s.civilianEducation, semesterHours: e.target.value } }))} className="h-11 border-white/10 bg-black/40 font-mono text-white" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] promotion-accent-muted">Technical certifications (10 pts each, max 50)</Label>
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
