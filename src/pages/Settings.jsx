import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { localStore } from '@/lib/offline-store';
import { Input } from "@/components/ui/input";
import { DateInput } from '@/components/ui/date-input';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, LogOut } from "lucide-react";
import { MOS_LIST } from "@/lib/mos-list";
import BottomNav from '@/components/layout/BottomNav';
import { RANKS, UNITS } from '@/lib/army-data';

export default function Settings() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const load = async () => {
      const me = await localStore.auth.me();
      setData({
        last_name: me.last_name || '',
        first_name: me.first_name || '',
        preferred_name: me.preferred_name || '',
        rank: me.rank || '',
        mos: me.mos || '',
        unit: me.unit || '',
        enlistment_date: me.enlistment_date || '',
        ets_date: me.ets_date || '',
        pcs_date: me.pcs_date || '',
        age: me.age || '',
        gender: me.gender || '',
      });
      setLoading(false);
    };
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await localStore.auth.updateMe({
      ...data,
      unit: data.unit || null,
      pcs_date: data.pcs_date || null,
    });
    setSaving(false);
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen max-w-full overflow-x-hidden bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-full overflow-x-hidden bg-background flex flex-col">
      <div className="w-full min-w-0 max-w-full px-page pb-header-pb pt-header-pt">
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-inter">PROFILE</p>
        <h1 className="text-2xl font-inter font-black text-foreground uppercase tracking-tight">SETTINGS</h1>
      </div>

      <div className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden px-page pb-bottom-scroll">
        <div className="mx-auto min-w-0 w-full max-w-content space-y-5">

        <div className="space-y-5">
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-inter">LAST NAME</Label>
            <Input value={data.last_name} onChange={(e) => setData({ ...data, last_name: e.target.value })} className="bg-secondary border-border text-foreground font-inter h-12" />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-inter">FIRST NAME</Label>
            <Input value={data.first_name} onChange={(e) => setData({ ...data, first_name: e.target.value })} className="bg-secondary border-border text-foreground font-inter h-12" />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-inter">PREFERRED NAME <span className="normal-case tracking-normal text-muted-foreground/50">(optional)</span></Label>
            <Input value={data.preferred_name} onChange={(e) => setData({ ...data, preferred_name: e.target.value })} className="bg-secondary border-border text-foreground font-inter h-12" />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-inter">RANK</Label>
            <Select value={data.rank} onValueChange={(val) => setData({ ...data, rank: val })}>
              <SelectTrigger className="bg-secondary border-border text-foreground h-12"><SelectValue /></SelectTrigger>
              <SelectContent>
                {RANKS.map((rank) => <SelectItem key={rank} value={rank}>{rank}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-inter">MOS</Label>
            <Select value={data.mos} onValueChange={(val) => setData({ ...data, mos: val })}>
              <SelectTrigger className="bg-secondary border-border text-foreground h-12"><SelectValue placeholder="Select MOS" /></SelectTrigger>
              <SelectContent className="max-h-64">
                {MOS_LIST.map((m) => <SelectItem key={m.code} value={m.code}>{m.code} — {m.title}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-inter">UNIT</Label>
            <Select value={data.unit} onValueChange={(val) => setData({ ...data, unit: val })}>
              <SelectTrigger className="bg-secondary border-border text-foreground h-12"><SelectValue placeholder="Select unit" /></SelectTrigger>
              <SelectContent className="max-h-64">
                {UNITS.map((u) => <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="min-w-0 max-w-full space-y-2">
            <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-inter">ENLISTMENT DATE</Label>
            <DateInput
              value={data.enlistment_date}
              onChange={(e) => setData({ ...data, enlistment_date: e.target.value })}
              className="bg-secondary text-foreground border-border"
            />
          </div>

          <div className="min-w-0 max-w-full space-y-2">
            <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-inter">ETS DATE</Label>
            <DateInput
              value={data.ets_date}
              onChange={(e) => setData({ ...data, ets_date: e.target.value })}
              className="bg-secondary text-foreground border-border"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-inter">AGE</Label>
            <Input type="number" placeholder="25" value={data.age} onChange={(e) => setData({ ...data, age: e.target.value })} className="bg-secondary border-border text-foreground font-mono h-12" />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-inter">GENDER</Label>
            <Select value={data.gender} onValueChange={(val) => setData({ ...data, gender: val })}>
              <SelectTrigger className="bg-secondary border-border text-foreground h-12"><SelectValue placeholder="Select gender" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="min-w-0 max-w-full space-y-2">
            <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-inter">PCS DATE (OPTIONAL)</Label>
            <DateInput
              value={data.pcs_date}
              onChange={(e) => setData({ ...data, pcs_date: e.target.value })}
              className="bg-secondary text-foreground border-border"
            />
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full h-12 bg-primary text-primary-foreground font-inter font-semibold uppercase tracking-wider text-sm hover:bg-primary/90">
            {saving ? <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> SAVE CHANGES</>}
          </Button>

          <Button variant="outline" onClick={() => localStore.auth.logout('/onboarding')} className="w-full h-12 border-destructive/30 text-destructive font-inter uppercase tracking-wider text-sm hover:bg-destructive/10">
            <LogOut className="w-4 h-4 mr-2" /> RESET OFFLINE DATA
          </Button>
        </div>

        </div>
      </div>

      <BottomNav />
    </div>
  );
}