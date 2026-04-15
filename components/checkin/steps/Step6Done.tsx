"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export function Step6Done() {
  const router = useRouter();

  // Redirect after a 3 second viewing or wait for button tap
  // Optionally calculate streak here, placeholder visual for now

  return (
    <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full text-center">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <CheckCircle2 className="w-32 h-32 text-primary mx-auto mb-8" />
      </motion.div>

      <motion.h2 
        className="text-4xl font-bold mb-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Registado.
      </motion.h2>

      <motion.p 
        className="text-xl text-muted-foreground mb-12"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Bom trabalho! O teu check-in foi gravado com sucesso.
      </motion.p>

      {/* Placeholder Streak */}
      <motion.div
        className="bg-primary/10 text-primary px-6 py-3 rounded-full text-lg font-semibold flex items-center gap-2"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        🔥 5 Dias Seguidos
      </motion.div>

      <div className="mt-auto mb-8 w-full">
        <Button size="lg" className="w-full h-14 text-lg" onClick={() => router.push('/timeline')}>
          Ver Histórico
        </Button>
      </div>
    </div>
  );
}
