import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
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
    unit: '',
    age: '',
    gender: '',
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
      unit: data.unit || null,
      age: data.age || null,
      gender: data.gender || null,
      enlistment_date: data.enlistment_date,
      ets_date: data.ets_date,
      pcs_date: data.pcs_date || null,
      onboarded: true,
    });
    setIsSubmitting(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen max-w-full overflow-x-hidden bg-background flex flex-col">
      {/* Header */}
      <div className="px-page pb-block-gap pt-[clamp(2.25rem,7vw,3.5rem)] text-center">
        <img
          src="/icons/icon-192x192.png"
          alt="Army1"
          className="mx-auto mb-4 h-16 w-16 rounded-2xl shadow-md"
        />
        <h1 className="text-lg font-inter font-bold text-foreground uppercase tracking-[0.15em]">
          ARMY1
        </h1>
      </div>

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2 pb-block-gap">
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
      <div className="mx-auto flex min-w-0 w-full max-w-content flex-1 px-page pb-12">
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