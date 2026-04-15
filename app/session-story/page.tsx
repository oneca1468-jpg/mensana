"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Copy, PlusCircle, Sparkles } from "lucide-react";

export default function SessionStoryPage() {
  const [story, setStory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchLatestStory();
  }, []);

  async function fetchLatestStory() {
    try {
      const res = await fetch("/api/session-story");
      const data = await res.json();
      if (data.success && data.story) {
        setStory(data.story);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerate() {
    setGenerating(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/session-story", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setStory(data.story);
      } else {
        setErrorMsg(data.message || data.error);
      }
    } catch (e: any) {
      setErrorMsg("Ocorreu um erro ao comunicar com a IA.");
    } finally {
      setGenerating(false);
    }
  }

  function handleShare() {
    if (!story?.share_token) return;
    const url = `${window.location.origin}/s/${story.share_token}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-col flex-1 p-4 pb-24 max-w-md mx-auto w-full pt-10">
      <h1 className="text-3xl font-bold mb-2">Session Story</h1>
      <p className="text-muted-foreground mb-8 text-lg">Um resumo da tua semana para refletires com o teu terapeuta.</p>

      {errorMsg && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-xl mb-6 font-medium">
          {errorMsg}
        </div>
      )}

      {loading ? (
        <div className="h-64 flex items-center justify-center bg-secondary/20 rounded-2xl animate-pulse">
          <p className="text-muted-foreground">A carregar...</p>
        </div>
      ) : story ? (
        <div className="space-y-6">
          <div className="bg-secondary/20 p-6 rounded-3xl border border-secondary shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-orange-400 opacity-50" />
            <p className="whitespace-pre-wrap text-lg leading-relaxed text-foreground/90">
              {story.content}
            </p>
          </div>

          <Button 
            size="lg" 
            variant="outline" 
            className="w-full h-14"
            onClick={handleShare}
          >
            {copied ? "Link Copiado!" : (
              <>
                <Copy className="mr-2 h-5 w-5" />
                Partilhar com terapeuta
              </>
            )}
          </Button>

          <div className="pt-8 text-center">
            <p className="text-sm text-muted-foreground mb-4">A semana terminou? Cria um novo resumo.</p>
            <Button
              size="lg"
              onClick={handleGenerate}
              disabled={generating}
              className="w-full h-14 bg-foreground text-background hover:bg-foreground/90"
            >
              {generating ? "A analisar dados..." : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Gerar Nova Story
                </>
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center p-8 bg-secondary/10 rounded-3xl border border-dashed border-secondary">
          <Sparkles className="h-16 w-16 text-primary mb-4 opacity-50" />
          <h3 className="text-xl font-bold mb-2">Ainda não tens um resumo</h3>
          <p className="text-muted-foreground mb-8">
            Faz check-in regularmente para que a IA possa interpretar os teus padrões.
          </p>
          <Button
            size="lg"
            className="w-full h-14"
            onClick={handleGenerate}
            disabled={generating}
          >
            {generating ? "A analisar..." : "Gerar Session Story"}
          </Button>
        </div>
      )}
    </div>
  );
}
