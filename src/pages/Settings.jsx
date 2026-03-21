import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, Save, LogOut } from "lucide-react";

const RANKS = [
  "PV1", "PV2", "PFC", "SPC", "CPL",
  "SGT", "SSG", "SFC", "MSG", "1SG", "SGM", "CSM"
];

export default function Settings() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const me = await base44.auth.me();
      setData({
        last_name: me.last_name || '',
      first_name: me.first_name || '',
      preferred_name: me.preferred_name || '',
        rank: me.rank || '',
        mos: me.mos || '',
        enlistment_date: me.enlistment_date || '',
        ets_date: me.ets_date || '',
        pcs_date: me.pcs_date || '',
      });
      setLoading(false);
    };
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await base44.auth.updateMe({
      ...data,
      pcs_date: data.pcs_date || null,
    });
    setSaving(false);
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 pt-8 pb-6">
        <button
          onClick={() => navigate('/')}
          className="w-10 h-10 rounded-xl bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-inter font-bold text-foreground uppercase tracking-[0.1em]">
          SETTINGS
        </h1>
      </div>

      <div className="flex-1 px-6 space-y-5">
        <div className="space-y-2">
          <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-inter">NAME</Label>
          <Input
            value={data.soldier_name}
            onChange={(e) => setData({ ...data, soldier_name: e.target.value })}
            className="bg-secondary border-border text-foreground font-inter h-12"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-inter">RANK</Label>
          <Select value={data.rank} onValueChange={(val) => setData({ ...data, rank: val })}>
            <SelectTrigger className="bg-secondary border-border text-foreground h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RANKS.map((rank) => (
                <SelectItem key={rank} value={rank}>{rank}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-inter">MOS</Label>
          <Input
            value={data.mos}
            onChange={(e) => setData({ ...data, mos: e.target.value })}
            className="bg-secondary border-border text-foreground font-inter h-12"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-inter">ENLISTMENT DATE</Label>
          <Input
            type="date"
            value={data.enlistment_date}
            onChange={(e) => setData({ ...data, enlistment_date: e.target.value })}
            className="bg-secondary border-border text-foreground font-mono h-12"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-inter">ETS DATE</Label>
          <Input
            type="date"
            value={data.ets_date}
            onChange={(e) => setData({ ...data, ets_date: e.target.value })}
            className="bg-secondary border-border text-foreground font-mono h-12"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-inter">PCS DATE (OPTIONAL)</Label>
          <Input
            type="date"
            value={data.pcs_date}
            onChange={(e) => setData({ ...data, pcs_date: e.target.value })}
            className="bg-secondary border-border text-foreground font-mono h-12"
          />
        </div>

        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full h-12 bg-primary text-primary-foreground font-inter font-semibold uppercase tracking-wider text-sm hover:bg-primary/90 mt-4"
        >
          {saving ? (
            <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" /> SAVE CHANGES
            </>
          )}
        </Button>

        <Button
          variant="outline"
          onClick={() => base44.auth.logout()}
          className="w-full h-12 border-destructive/30 text-destructive font-inter uppercase tracking-wider text-sm hover:bg-destructive/10 mb-12"
        >
          <LogOut className="w-4 h-4 mr-2" /> LOG OUT
        </Button>
      </div>
    </div>
  );
}