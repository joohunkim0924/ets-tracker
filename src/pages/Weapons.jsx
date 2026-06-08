import React, { useEffect, useState } from 'react';
import { localStore } from '@/lib/offline-store';
import { format, parseISO } from 'date-fns';
import { Plus, ChevronDown, ChevronUp, Target, Trash2, Pencil } from 'lucide-react';
import BottomNav from '@/components/layout/BottomNav';
import AddWeaponsModal from '@/components/weapons/AddWeaponsModal';
import { deriveQualification } from '@/lib/weapons-qualification';

const QUAL_COLORS = {
  Unqualified: 'text-destructive bg-destructive/10 border-destructive/20',
  Marksman: 'text-muted-foreground bg-secondary border-border',
  Sharpshooter: 'text-amber-600 bg-amber-50 border-amber-200',
  Expert: 'text-primary bg-primary/10 border-primary/20',
};

const TABS = ['OVERVIEW', 'HISTORY'];

function recordQualification(record) {
  return deriveQualification(record) || record.qualification || null;
}

export default function Weapons() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('OVERVIEW');
  const [showAdd, setShowAdd] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const load = async () => {
    const data = await localStore.entities.WeaponsRecord.list('-date');
    setRecords(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  // Group records by weapon for overview
  const byWeapon = records.reduce((acc, r) => {
    if (!acc[r.weapon]) acc[r.weapon] = [];
    acc[r.weapon].push(r);
    return acc;
  }, {});

  const latest = records[0];

  return (
    <div className="flex min-h-screen max-w-full flex-col overflow-x-hidden bg-background pb-bottom-scroll">
      {/* Header */}
      <div className="flex items-center justify-between px-page pb-header-pb pt-header-pt">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-inter">RECORD</p>
          <h1 className="text-lg font-inter font-bold uppercase tracking-[0.1em]">WEAPONS CARD</h1>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-4 flex min-w-0 w-full max-w-full gap-1 overflow-x-hidden px-page">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 text-[10px] uppercase tracking-widest font-inter font-semibold rounded-lg transition-colors ${tab === t ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-page">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <Target className="w-12 h-12 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground font-inter text-sm">No weapons records yet.</p>
            <button onClick={() => setShowAdd(true)} className="text-primary text-sm font-inter font-semibold">Log your first record →</button>
          </div>
        ) : (
          <>
            {tab === 'OVERVIEW' && (
              <div className="space-y-4">
                {/* Latest entry */}
                {latest && (
                  <div className="rounded-xl border border-border bg-card p-card">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-inter mb-1">LATEST ENTRY</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-3xl font-mono font-black text-primary">{latest.weapon}</p>
                        <p className="text-xs text-muted-foreground font-mono mt-1">{latest.date ? format(parseISO(latest.date), 'dd MMM yyyy').toUpperCase() : ''}</p>
                      </div>
                      {recordQualification(latest) && (
                        <span className={`px-3 py-1.5 rounded-lg border text-xs font-inter font-bold uppercase tracking-wider ${QUAL_COLORS[recordQualification(latest)] || 'text-foreground bg-secondary border-border'}`}>
                          {recordQualification(latest)}
                        </span>
                      )}
                    </div>
                    {(latest.hits !== undefined && latest.total_rounds !== undefined) && (
                      <div className="mt-3 pt-3 border-t border-border flex flex-wrap gap-4 text-xs font-mono">
                        <span><span className="text-muted-foreground">Hits: </span><span className="font-bold">{latest.hits}/{latest.total_rounds}</span></span>
                        {latest.optic_type && <span><span className="text-muted-foreground">Optic: </span><span className="font-bold">{latest.optic_type}</span></span>}
                        {latest.score !== undefined && <span><span className="text-muted-foreground">Score: </span><span className="font-bold text-primary">{latest.score}</span></span>}
                        {latest.range && <span className="text-muted-foreground">{latest.range}</span>}
                      </div>
                    )}
                  </div>
                )}

                {/* Per-weapon best */}
                <div className="rounded-xl border border-border bg-card p-card">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-inter mb-3">BY WEAPON</p>
                  <div className="space-y-3">
                    {Object.entries(byWeapon).map(([weapon, recs]) => {
                      const best = recs.reduce((b, r) => {
                        const bq = ['Unqualified','Marksman','Sharpshooter','Expert'].indexOf(recordQualification(b) || 'Unqualified');
                        const rq = ['Unqualified','Marksman','Sharpshooter','Expert'].indexOf(recordQualification(r) || 'Unqualified');
                        return rq > bq ? r : b;
                      }, recs[0]);
                      return (
                        <div key={weapon} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                          <div>
                            <p className="text-sm font-inter font-semibold text-foreground">{weapon}</p>
                            <p className="text-xs text-muted-foreground font-mono">{recs.length} record{recs.length !== 1 ? 's' : ''}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {best.hits !== undefined && best.total_rounds !== undefined && (
                              <span className="text-xs font-mono text-muted-foreground">{best.hits}/{best.total_rounds}</span>
                            )}
                            {recordQualification(best) && (
                              <span className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider ${QUAL_COLORS[recordQualification(best)] || ''}`}>
                                {recordQualification(best)}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {tab === 'HISTORY' && (
              <div className="space-y-3">
                {records.map(r => (
                  <div key={r.id} className="bg-card rounded-xl border border-border overflow-hidden">
                    <button
                      className="flex w-full items-center justify-between px-card py-4"
                      onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}
                    >
                      <div className="text-left">
                        <p className="text-xs font-mono text-muted-foreground">{r.date ? format(parseISO(r.date), 'dd MMM yyyy').toUpperCase() : ''}</p>
                        <p className="text-xl font-mono font-black text-primary">{r.weapon}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {recordQualification(r) && (
                          <span className={`px-2 py-1 rounded border text-[10px] font-bold uppercase tracking-wider ${QUAL_COLORS[recordQualification(r)] || ''}`}>
                            {recordQualification(r)}
                          </span>
                        )}
                        {expandedId === r.id ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                      </div>
                    </button>
                    {expandedId === r.id && (
                      <div className="space-y-1 border-t border-border px-card pb-4 pt-3 text-xs font-mono">
                        {r.hits !== undefined && r.total_rounds !== undefined && (
                          <div className="flex justify-between py-1">
                            <span className="text-muted-foreground font-inter">Hits</span>
                            <span className="font-bold">{r.hits} / {r.total_rounds}</span>
                          </div>
                        )}
                        {r.optic_type && (
                          <div className="flex justify-between py-1">
                            <span className="text-muted-foreground font-inter">Optic</span>
                            <span>{r.optic_type}</span>
                          </div>
                        )}
                        {r.score !== undefined && (
                          <div className="flex justify-between py-1">
                            <span className="text-muted-foreground font-inter">Score</span>
                            <span className="font-bold text-primary">{r.score}</span>
                          </div>
                        )}
                        {r.range && (
                          <div className="flex justify-between py-1">
                            <span className="text-muted-foreground font-inter">Range</span>
                            <span>{r.range}</span>
                          </div>
                        )}
                        {r.notes && (
                          <div className="pt-2 border-t border-border text-muted-foreground font-inter">{r.notes}</div>
                        )}
                        <div className="mt-2 flex items-center gap-4">
                          <button
                            onClick={() => { setEditingRecord(r); setExpandedId(null); }}
                            className="flex items-center gap-1.5 text-primary text-[11px] font-inter font-semibold hover:opacity-70 transition-opacity"
                          >
                            <Pencil className="w-3.5 h-3.5" /> Edit record
                          </button>
                          <button
                            onClick={async () => { await localStore.entities.WeaponsRecord.delete(r.id); load(); }}
                            className="flex items-center gap-1.5 text-destructive text-[11px] font-inter font-semibold hover:opacity-70 transition-opacity"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete record
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {showAdd && <AddWeaponsModal onClose={() => setShowAdd(false)} onSaved={() => { setShowAdd(false); load(); }} />}
      {editingRecord && <AddWeaponsModal onClose={() => setEditingRecord(null)} onSaved={() => { setEditingRecord(null); load(); }} existingRecord={editingRecord} />}
      <BottomNav />
    </div>
  );
}