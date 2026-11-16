import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogOut, Radar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/_authenticated/app")({
  head: () => ({
    meta: [
      { title: "Dashboard — Flight Price Notifier" },
      { name: "description", content: "Your Flight Price Notifier dashboard." },
      { property: "og:title", content: "Dashboard — Flight Price Notifier" },
      { property: "og:description", content: "Your flight fare tracking dashboard." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AppPage,
});

function AppPage() {
  const { user } = Route.useRouteContext();
  const { queryClient } = Route.useRouteContext();
  const navigate = useNavigate();

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="relative min-h-screen bg-background">
      <div className="pointer-events-none absolute inset-0 bg-gradient-hero" />
      <header className="relative border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Logo />
          <Button variant="outline" size="sm" onClick={signOut}>
            <LogOut /> Sign out / 登出
          </Button>
        </div>
      </header>
      <main className="relative mx-auto max-w-3xl px-6 py-20 animate-fade-up">
        <h1 className="break-all text-3xl font-semibold tracking-tight sm:text-4xl">
          Hi <span className="text-gradient">{user.email}</span>
        </h1>
        <div className="mt-10 rounded-2xl border border-border bg-card/70 p-8 backdrop-blur">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent">
            <Radar className="h-5 w-5 text-primary-glow" />
          </div>
          <p className="text-lg">你的航線追蹤儀表板即將上線 — 下一個里程碑會加上訂閱航線的功能。</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Your dashboard is coming soon. Route-subscription will be added in the next milestone.
          </p>
        </div>
      </main>
    </div>
  );
}
