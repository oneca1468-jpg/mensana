import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { notFound } from 'next/navigation'

// We need a specific unauthenticated server client using the Service Role Key 
// to bypass RLS and fetch the public token record.
function createAdminClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() { return [] },
        setAll(cookiesToSet) { },
      },
      auth: {
        persistSession: false
      }
    }
  )
}

export default async function PublicSessionStoryPage({ params }: { params: { token: string } }) {
  const supabaseAdmin = createAdminClient();

  const { data: story } = await supabaseAdmin
    .from('session_stories')
    .select('*')
    .eq('share_token', params.token)
    .single();

  if (!story) {
    notFound();
  }

  // Parse the week start for UI
  const dateStr = new Date(story.week_start).toLocaleDateString('pt-PT', { 
    day: 'numeric', month: 'long' 
  });

  return (
    <div className="min-h-screen bg-background flex flex-col p-4">
      {/* Mensana Branding Header */}
      <header className="flex justify-center items-center py-6 mb-8">
        <h1 className="text-2xl font-black tracking-tighter text-primary">Mensana.</h1>
      </header>

      {/* Reading View */}
      <main className="flex-1 max-w-lg mx-auto w-full">
        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">
          Resumo da Semana (${dateStr})
        </p>
        
        <div className="bg-secondary/20 p-8 rounded-3xl border border-secondary shadow-md relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-orange-400" />
          <p className="whitespace-pre-wrap text-xl leading-relaxed font-serif text-foreground/90">
            {story.content}
          </p>
        </div>
      </main>

      {/* CTA Footer */}
      <footer className="mt-16 mb-8 text-center px-4">
        <div className="max-w-md mx-auto py-8 border-t border-secondary/50">
          <h2 className="font-bold text-lg mb-2">Construa melhores sessões de terapia.</h2>
          <p className="text-muted-foreground mb-6">
            Acompanhe a sua saúde mental de forma estruturada.
          </p>
          <Button asChild size="lg" className="w-full h-14 text-lg">
            <Link href="/">Saiba mais sobre a Mensana</Link>
          </Button>
        </div>
      </footer>
    </div>
  );
}
