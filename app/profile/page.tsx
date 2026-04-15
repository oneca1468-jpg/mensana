import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { logout } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const firstName = user.user_metadata?.first_name || "Utilizador";

  return (
    <div className="flex flex-col min-h-screen p-4 bg-background">
      <div className="max-w-md mx-auto w-full pt-10">
        <h1 className="text-3xl font-bold mb-8">Perfil</h1>

        <div className="bg-secondary/50 rounded-2xl p-6 mb-8 flex items-center gap-4">
          <div className="h-16 w-16 bg-primary/20 text-primary rounded-full flex items-center justify-center text-2xl font-bold">
            {firstName.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold">{firstName}</h2>
            <p className="text-muted-foreground text-sm">{user.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Settings links / placeholders would go here */}
        </div>

        <div className="mt-8">
          <form action={logout}>
            <Button type="submit" variant="destructive" className="w-full h-14 text-lg font-bold">
              Terminar Sessão
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
