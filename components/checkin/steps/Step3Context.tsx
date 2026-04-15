"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Step3ContextProps {
  value: string[];
  onNext: (val: string[]) => void;
}

const CHIPS = [
  "Trabalho",
  "Casa",
  "Com família",
  "Com amigos",
  "Sozinho",
  "Outro",
];

export function Step3Context({ value, onNext }: Step3ContextProps) {
  const [selected, setSelected] = useState<string[]>(value);

  const toggleChip = (chip: string) => {
    setSelected((prev) => 
      prev.includes(chip) 
        ? prev.filter((c) => c !== chip) 
        : [...prev, chip]
    );
  };

  return (
    <div className="flex-1 flex flex-col max-w-md mx-auto w-full pt-10">
      <h2 className="text-3xl font-bold mb-8">Onde estavas / com quem?</h2>

      <div className="flex flex-wrap gap-4 mb-8">
        {CHIPS.map((chip) => {
          const isSelected = selected.includes(chip);
          return (
            <button
              key={chip}
              onClick={() => toggleChip(chip)}
              className={cn(
                "px-6 py-4 rounded-full text-lg font-medium transition-all duration-200 border-2",
                isSelected 
                  ? "bg-primary text-primary-foreground border-primary scale-105" 
                  : "bg-secondary text-secondary-foreground border-transparent hover:border-primary/30"
              )}
            >
              {chip}
            </button>
          );
        })}
      </div>

      <div className="mt-auto mb-8 flex flex-col gap-3">
        <Button 
          size="lg" 
          className="w-full h-14 text-lg"
          onClick={() => onNext(selected)}
        >
          {selected.length > 0 ? "Continuar" : "Saltar"}
        </Button>
      </div>
    </div>
  );
}
