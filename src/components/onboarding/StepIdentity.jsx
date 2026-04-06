import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { MOS_LIST } from "@/lib/mos-list";
import { RANKS, UNITS } from '@/lib/army-data';

export default function StepIdentity({ data, onChange, onNext }) {
  const canProceed = data.last_name && data.first_name && data.rank && data.mos && data.age && data.gender;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-inter font-bold text-foreground">IDENTIFY YOURSELF</h2>
        <p className="text-sm text-muted-foreground">Enter your basic service information.</p>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-inter">
            LAST NAME
          </Label>
          <Input
            placeholder="Smith"
            value={data.last_name || ''}
            onChange={(e) => onChange({ ...data, last_name: e.target.value })}
            className="bg-secondary border-border text-foreground font-inter placeholder:text-muted-foreground/50 h-12"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-inter">
            FIRST NAME
          </Label>
          <Input
            placeholder="John"
            value={data.first_name || ''}
            onChange={(e) => onChange({ ...data, first_name: e.target.value })}
            className="bg-secondary border-border text-foreground font-inter placeholder:text-muted-foreground/50 h-12"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-inter">
            PREFERRED NAME <span className="text-muted-foreground/50 normal-case tracking-normal">(optional)</span>
          </Label>
          <Input
            placeholder="e.g. Johnny"
            value={data.preferred_name || ''}
            onChange={(e) => onChange({ ...data, preferred_name: e.target.value })}
            className="bg-secondary border-border text-foreground font-inter placeholder:text-muted-foreground/50 h-12"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-inter">
            RANK
          </Label>
          <Select value={data.rank || ''} onValueChange={(val) => onChange({ ...data, rank: val })}>
            <SelectTrigger className="bg-secondary border-border text-foreground h-12">
              <SelectValue placeholder="Select rank" />
            </SelectTrigger>
            <SelectContent>
              {RANKS.map((rank) => (
                <SelectItem key={rank} value={rank}>{rank}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-inter">AGE</Label>
          <Input
            type="number"
            placeholder="25"
            value={data.age || ''}
            onChange={(e) => onChange({ ...data, age: e.target.value })}
            className="bg-secondary border-border text-foreground font-mono placeholder:text-muted-foreground/50 h-12"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-inter">GENDER</Label>
          <Select value={data.gender || ''} onValueChange={(val) => onChange({ ...data, gender: val })}>
            <SelectTrigger className="bg-secondary border-border text-foreground h-12">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-inter">
            MOS
          </Label>
          <Select value={data.mos || ''} onValueChange={(val) => onChange({ ...data, mos: val })}>
            <SelectTrigger className="bg-secondary border-border text-foreground h-12">
              <SelectValue placeholder="Select MOS" />
            </SelectTrigger>
            <SelectContent className="max-h-64">
              {MOS_LIST.map((m) => (
                <SelectItem key={m.code} value={m.code}>
                  {m.code} — {m.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-inter">
            UNIT
          </Label>
          <Select value={data.unit || ''} onValueChange={(val) => onChange({ ...data, unit: val })}>
            <SelectTrigger className="bg-secondary border-border text-foreground h-12">
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent className="max-h-64">
              {UNITS.map((u) => (
                <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        onClick={onNext}
        disabled={!canProceed}
        className="w-full h-12 bg-primary text-primary-foreground font-inter font-semibold uppercase tracking-wider text-sm hover:bg-primary/90 disabled:opacity-30"
      >
        CONTINUE <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
}