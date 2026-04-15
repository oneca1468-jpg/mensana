"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckinData } from "./types";
import { Step1Mood } from "./steps/Step1Mood";
import { Step2Event } from "./steps/Step2Event";
import { Step3Context } from "./steps/Step3Context";
import { Step4Thought } from "./steps/Step4Thought";
import { Step5Action } from "./steps/Step5Action";
import { Step6Done } from "./steps/Step6Done";

export function CheckinFlow() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<CheckinData>({
    mood: null,
    event: "",
    context: [],
    thought: "",
    action: "",
  });

  const nextStep = () => {
    setDirection(1);
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setDirection(-1);
    setStep((prev) => prev - 1);
  };

  const updateData = (partial: Partial<CheckinData>) => {
    setData((prev) => ({ ...prev, ...partial }));
  };

  const submitCheckin = async (finalData: CheckinData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/checkin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...finalData,
          context: finalData.context.length > 0 ? finalData.context.join(', ') : null
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to save');
      }

      setStep(6);
    } catch (err) {
      console.error(err);
      alert("Houve um erro ao guardar. Tenta novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteStep5 = (action: string) => {
    const finalData = { ...data, action };
    updateData({ action });
    submitCheckin(finalData);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <div className="relative w-full h-[100dvh] bg-background overflow-hidden flex flex-col">
      {/* Progress Bar */}
      {step < 6 && (
        <div className="absolute top-0 left-0 right-0 z-50 p-4 pt-safe">
          <div className="flex items-center justify-between mb-2">
           <span className="text-sm font-medium text-muted-foreground">Passo {step} de 5</span>
           {step > 1 && (
             <button onClick={prevStep} className="text-sm text-primary font-medium p-2 -mr-2">Voltar</button>
           )}
          </div>
          <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary"
              initial={{ width: `${((step - 1) / 5) * 100}%` }}
              animate={{ width: `${(step / 5) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      {/* Slide Container */}
      <div className="flex-1 relative w-full h-full">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute inset-0 w-full h-full pt-20 pb-[env(safe-area-inset-bottom)] px-4 flex flex-col"
          >
            {step === 1 && <Step1Mood value={data.mood} onNext={(val) => { updateData({ mood: val }); nextStep(); }} />}
            {step === 2 && <Step2Event value={data.event} onNext={(val) => { updateData({ event: val }); nextStep(); }} />}
            {step === 3 && <Step3Context value={data.context} onNext={(val) => { updateData({ context: val }); nextStep(); }} />}
            {step === 4 && <Step4Thought value={data.thought} onNext={(val) => { updateData({ thought: val }); nextStep(); }} />}
            {step === 5 && <Step5Action value={data.action} isSubmitting={isSubmitting} onNext={handleCompleteStep5} />}
            {step === 6 && <Step6Done />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
