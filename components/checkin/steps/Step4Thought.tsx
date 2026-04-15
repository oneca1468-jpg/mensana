"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Step4ThoughtProps {
  value: string;
  onNext: (val: string) => void;
}

export function Step4Thought({ value, onNext }: Step4ThoughtProps) {
  const [thought, setThought] = useState(value);

  return (
    <div className="flex-1 flex flex-col max-w-md mx-auto w-full pt-10">
      <h2 className="text-3xl font-bold mb-4">O que estava na tua cabeça?</h2>
      <p className="text-muted-foreground mb-8">Pensamentos ou sentimentos que gostasses de registar.</p>

      <textarea
        value={thought}
        onChange={(e) => setThought(e.target.value)}
        maxLength={140}
        placeholder="Estava a pensar que..."
        className="w-full h-32 p-4 text-lg bg-secondary/50 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
      />
      <div className="text-right text-sm text-muted-foreground mt-2">
        {thought.length}/140
      </div>

      <div className="mt-auto mb-8 flex flex-col gap-3">
        <Button 
          size="lg" 
          className="w-full h-14 text-lg"
          onClick={() => onNext(thought)}
        >
          {thought.trim() ? "Continuar" : "Saltar"}
        </Button>
      </div>
    </div>
  );
}
