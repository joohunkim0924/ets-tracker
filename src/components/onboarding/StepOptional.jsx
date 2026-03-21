import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Shield } from "lucide-react";

export default function StepOptional({ data, onChange, onSubmit, onBack, isSubmitting }) {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-inter font-bold text-foreground">OPTIONAL INFO</h2>
        <p className="text-sm text-muted-foreground">Add a PCS date if you have one. You can skip this.</p>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-inter">
            PCS DATE (OPTIONAL)
          </Label>
          <Input
            type="date"
            value={data.pcs_date || ''}
            onChange={(e) => onChange({ ...data, pcs_date: e.target.value })}
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
          onClick={onSubmit}
          disabled={isSubmitting}
          className="flex-1 h-12 bg-primary text-primary-foreground font-inter font-semibold uppercase tracking-wider text-sm hover:bg-primary/90"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Shield className="w-4 h-4 mr-2" /> DEPLOY TRACKER
            </>
          )}
        </Button>
      </div>
    </div>
  );
}