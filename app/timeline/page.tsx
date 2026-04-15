import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { TimelineClient } from "@/components/timeline/TimelineClient";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function TimelinePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch the last 30 bounds since the max toggle is 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const cutoffIso = thirtyDaysAgo.toISOString().split('T')[0];

  const { data: checkins } = await supabase
    .from('checkins')
    .select('*')
    .eq('user_id', user.id)
    .gte('checked_in_date', cutoffIso)
    .order('checked_in_date', { ascending: true });

  if (!checkins || checkins.length < 3) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-6 max-w-sm mx-auto">
        <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-32 h-32 text-secondary mb-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.866 8.21 8.21 0 0 0 3 2.48Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
        </svg>
        <h2 className="text-2xl font-bold mb-4">Ainda a carregar os teus padrões</h2>
        <p className="text-muted-foreground text-lg mb-8">
          Faz check-in durante pelo menos 3 dias para veres gráficos e correlações sobre a tua semana.
        </p>
        <Button asChild size="lg" className="w-full">
          <Link href="/checkin">Fazer Check-in</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TimelineClient checkins={checkins} />
    </div>
  );
}
