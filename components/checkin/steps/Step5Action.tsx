"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Step5ActionProps {
  value: string;
  isSubmitting: boolean;
  onNext: (val: string) => void;
}

export function Step5Action({ value, isSubmitting, onNext }: Step5ActionProps) {
  const [action, setAction] = useState(value);

  return (
    <div className="flex-1 flex flex-col max-w-md mx-auto w-full pt-10">
      <h2 className="text-3xl font-bold mb-4">Fizeste algo em relação a isso?</h2>
      <p className="text-muted-foreground mb-8">Uma pequena ação ou decisão conta.</p>

      <textarea
        value={action}
        onChange={(e) => setAction(e.target.value)}
        maxLength={120}
        placeholder="Fui dar uma volta..."
        className="w-full h-32 p-4 text-lg bg-secondary/50 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
      />
      <div className="text-right text-sm text-muted-foreground mt-2">
        {action.length}/120
      </div>

      <div className="mt-auto mb-8 flex flex-col gap-3">
        <Button 
          size="lg" 
          className="w-full h-14 text-lg"
          onClick={() => onNext(action)}
          disabled={isSubmitting}
        >
          {isSubmitting ? "A Guardar..." : (action.trim() ? "Concluir" : "Saltar e Concluir")}
        </Button>
      </div>
    </div>
  );
}
