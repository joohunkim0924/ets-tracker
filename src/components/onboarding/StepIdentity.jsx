import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const RANKS = [
  "PV1", "PV2", "PFC", "SPC", "CPL",
  "SGT", "SSG", "SFC", "MSG", "1SG", "SGM", "CSM"
];

export default function StepIdentity({ data, onChange, onNext }) {
  const canProceed = data.name && data.rank && data.mos;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-inter font-bold text-foreground">IDENTIFY YOURSELF</h2>
        <p className="text-sm text-muted-foreground">Enter your basic service information.</p>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-inter">
            NAME
          </Label>
          <Input
            placeholder="Last, First"
            value={data.name || ''}
            onChange={(e) => onChange({ ...data, name: e.target.value })}
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
          <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-inter">
            MOS
          </Label>
          <Input
            placeholder="e.g. 11B, 68W, 25B"
            value={data.mos || ''}
            onChange={(e) => onChange({ ...data, mos: e.target.value })}
            className="bg-secondary border-border text-foreground font-inter placeholder:text-muted-foreground/50 h-12"
          />
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