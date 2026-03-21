import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";

export default function StepDates({ data, onChange, onNext, onBack }) {
  const canProceed = data.enlistment_date && data.ets_date;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-inter font-bold text-foreground">SERVICE DATES</h2>
        <p className="text-sm text-muted-foreground">When did you ship and when do you ETS?</p>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-inter">
            ENLISTMENT DATE
          </Label>
          <Input
            type="date"
            value={data.enlistment_date || ''}
            onChange={(e) => onChange({ ...data, enlistment_date: e.target.value })}
            className="bg-secondary border-border text-foreground font-mono h-12"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-inter">
            ETS DATE
          </Label>
          <Input
            type="date"
            value={data.ets_date || ''}
            onChange={(e) => onChange({ ...data, ets_date: e.target.value })}
            className="bg-secondary border-border text-foreground font-mono h-12"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onBack}
          className="h-12 px-6 border-border text-muted-foreground font-inter uppercase tracking-wider text-sm"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> BACK
        </Button>
        <Button
          onClick={onNext}
          disabled={!canProceed}
          className="flex-1 h-12 bg-primary text-primary-foreground font-inter font-semibold uppercase tracking-wider text-sm hover:bg-primary/90 disabled:opacity-30"
        >
          CONTINUE <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}