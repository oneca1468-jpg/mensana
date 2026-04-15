import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CheckinFlow } from "@/components/checkin/CheckinFlow";

function CheckedInToday({ checkin }: { checkin: any }) {
  return (
    <div className="flex flex-col min-h-screen p-4 bg-background">
      <div className="max-w-md mx-auto w-full pt-10">
        <h1 className="text-3xl font-bold mb-8">O teu check-in de hoje</h1>
        
        <div className="bg-secondary/50 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="text-6xl bg-primary/10 rounded-full h-20 w-20 flex items-center justify-center">
              {checkin.mood >= 8 ? '😊' : checkin.mood <= 4 ? '😔' : '😐'}
            </div>
            <div>
              <div className="text-sm text-muted-foreground uppercase tracking-widest font-bold">Estado de Espírito</div>
              <div className="text-3xl font-black">{checkin.mood} / 10</div>
            </div>
          </div>

          <div className="space-y-6">
            {checkin.event && (
              <div>
                <h3 className="font-semibold text-muted-foreground mb-1">Acontecimento</h3>
                <p className="text-lg">{checkin.event}</p>
              </div>
            )}
            
            {checkin.context && (
              <div>
                <h3 className="font-semibold text-muted-foreground mb-1">Contexto</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {checkin.context.split(',').map((ctx: string) => (
                    <span key={ctx} className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium">
                      {ctx.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {checkin.thought && (
              <div>
                <h3 className="font-semibold text-muted-foreground mb-1">Pensamentos</h3>
                <p className="text-lg italic text-muted-foreground">&quot;{checkin.thought}&quot;</p>
              </div>
            )}

            {checkin.action && (
              <div>
                <h3 className="font-semibold text-muted-foreground mb-1">Ação tomada</h3>
                <p className="text-lg bg-background p-3 rounded-xl border">{checkin.action}</p>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-muted-foreground">Volta amanhã para manteres a tua streak!</p>
      </div>
    </div>
  );
}

export default async function CheckinPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Check if user already checked in today (matching their timezone or server date)
  // checked_in_date represents the ISO YYYY-MM-DD
  const todayDate = new Date().toISOString().split('T')[0];

  const { data: existingCheckin } = await supabase
    .from('checkins')
    .select('*')
    .eq('user_id', user.id)
    .eq('checked_in_date', todayDate)
    .single();

  if (existingCheckin) {
    return <CheckedInToday checkin={existingCheckin} />;
  }

  return <CheckinFlow />;
}
