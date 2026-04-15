"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Step2EventProps {
  value: string;
  onNext: (val: string) => void;
}

export function Step2Event({ value, onNext }: Step2EventProps) {
  const [event, setEvent] = useState(value);

  return (
    <div className="flex-1 flex flex-col max-w-md mx-auto w-full pt-10">
      <h2 className="text-3xl font-bold mb-4">Aconteceu algo importante hoje?</h2>
      <p className="text-muted-foreground mb-8">Podes ser breve ou saltar este passo.</p>

      <textarea
        value={event}
        onChange={(e) => setEvent(e.target.value)}
        maxLength={120}
        placeholder="Hoje o meu chefe..."
        className="w-full h-32 p-4 text-lg bg-secondary/50 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
      />
      <div className="text-right text-sm text-muted-foreground mt-2">
        {event.length}/120
      </div>

      <div className="mt-auto mb-8 flex flex-col gap-3">
        <Button 
          size="lg" 
          className="w-full h-14 text-lg"
          onClick={() => onNext(event)}
        >
          {event.trim() ? 'Continuar' : 'Saltar'}
        </Button>
      </div>
    </div>
  );
}
