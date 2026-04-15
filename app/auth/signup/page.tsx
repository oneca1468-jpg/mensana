"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signup } from "../actions";

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await signup(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background p-4 justify-center">
      <div className="max-w-sm w-full mx-auto space-y-8">
        
        {/* Header Context */}
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-black tracking-tight">Cria a tua conta.</h1>
          <p className="text-muted-foreground text-lg">Começa hoje a tua jornada de bem-estar.</p>
        </div>

        {/* Form Container */}
        <div className="bg-secondary/30 p-8 rounded-3xl border border-secondary/50 shadow-sm backdrop-blur-sm">
          <form action={handleSubmit} className="space-y-6">
            
            {error && (
              <div className="bg-destructive/15 text-destructive p-3 rounded-lg text-sm font-medium">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-muted-foreground">O teu nome</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Diogo"
                  className="h-12 bg-background border-none shadow-sm focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-muted-foreground">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="exemplo@email.com"
                  className="h-12 bg-background border-none shadow-sm focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-muted-foreground">Password</Label>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Mínimo 6 caracteres"
                  className="h-12 bg-background border-none shadow-sm focus-visible:ring-primary"
                />
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full h-14 text-lg font-bold" disabled={loading}>
              {loading ? "A criar conta..." : "Registar"}
            </Button>
          </form>
        </div>

        {/* Footer Context */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Já tens uma conta?{" "}
            <Link href="/auth/login" className="text-primary font-semibold hover:underline">
              Entrar
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
