import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Shield } from 'lucide-react';
import StepIdentity from '../components/onboarding/StepIdentity';
import StepDates from '../components/onboarding/StepDates';
import StepOptional from '../components/onboarding/StepOptional';

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState({
    last_name: '',
    first_name: '',
    preferred_name: '',
    rank: '',
    mos: '',
    enlistment_date: '',
    ets_date: '',
    pcs_date: '',
  });

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await base44.auth.updateMe({
      last_name: data.last_name,
      first_name: data.first_name,
      preferred_name: data.preferred_name || null,
      rank: data.rank,
      mos: data.mos,
      enlistment_date: data.enlistment_date,
      ets_date: data.ets_date,
      pcs_date: data.pcs_date || null,
      onboarded: true,
    });
    setIsSubmitting(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="pt-12 pb-8 px-6 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 mb-4">
          <Shield className="w-7 h-7 text-primary" />
        </div>
        <h1 className="text-lg font-inter font-bold text-foreground uppercase tracking-[0.15em]">
          ETS TRACKER
        </h1>
      </div>

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2 pb-8">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === step ? 'w-8 bg-primary' : i < step ? 'w-4 bg-primary/40' : 'w-4 bg-secondary'
            }`}
          />
        ))}
      </div>

      {/* Step content */}
      <div className="flex-1 px-6 pb-12">
        {step === 0 && (
          <StepIdentity
            data={data}
            onChange={setData}
            onNext={() => setStep(1)}
          />
        )}
        {step === 1 && (
          <StepDates
            data={data}
            onChange={setData}
            onNext={() => setStep(2)}
            onBack={() => setStep(0)}
          />
        )}
        {step === 2 && (
          <StepOptional
            data={data}
            onChange={setData}
            onSubmit={handleSubmit}
            onBack={() => setStep(1)}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  );
}