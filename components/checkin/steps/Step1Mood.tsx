"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Step1MoodProps {
  value: number | null;
  onNext: (val: number) => void;
}

export function Step1Mood({ value, onNext }: Step1MoodProps) {
  const [mood, setMood] = useState<number | null>(value);

  return (
    <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
      <h2 className="text-3xl font-bold mb-12 text-center">Como estás agora?</h2>

      <div className="mb-16">
        <div className="flex justify-between gap-1 mb-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <button
              key={num}
              onClick={() => setMood(num)}
              className={cn(
                "flex-1 h-16 rounded-lg text-lg font-bold transition-all duration-200 border-2",
                mood === num
                  ? "bg-primary text-primary-foreground border-primary scale-110 shadow-md"
                  : "bg-secondary text-secondary-foreground border-transparent hover:border-primary/40"
              )}
            >
              {num}
            </button>
          ))}
        </div>
        <div className="flex justify-between px-2 text-3xl">
          <span>😔</span>
          <span>😐</span>
          <span>😊</span>
        </div>
      </div>

      <Button 
        size="lg" 
        className="w-full h-14 text-lg mt-auto mb-8"
        onClick={() => onNext(mood || 5)}
        disabled={mood === null}
      >
        Continuar
      </Button>
    </div>
  );
}
